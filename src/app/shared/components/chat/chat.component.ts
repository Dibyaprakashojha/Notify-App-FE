import { Component, Input, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { KeycloakProfile } from 'keycloak-js';
import { AuthService } from 'src/app/user/auth.service';
import { UserMessage } from '../../userMessage';
import { SwPush } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment.prod';
import { NotificationService } from '../../services/notification.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  // messages: string[] = [
  //   'Yes, need some few hours to finish it',
  //   'What is the progress on the work ?',
  //   'I m gooding well.',
  //   'Hi, Good morning',
  //   'I am fine. What about you?',
  //   'How are you ?',
  //   'Good morning',
  //   'Hi',
  // ];

  messages: UserMessage[] = [
    {
      to: 'John',
      from: 'Chris',
      message: 'Yes, need some few hours to finish it',
    },
    {
      to: 'John',
      from: 'Chris',
      message: 'What is the progress on the work ?',
    },
    {
      to: 'John',
      from: 'Chris',
      message: 'I m doing well',
    },
    {
      to: 'John',
      from: 'Chris',
      message: 'Hi, Good morning',
    },
    {
      to: 'John',
      from: 'Chris',
      message: 'I am fine. What about you?',
    },
    {
      to: 'John',
      from: 'Chris',
      message: 'How are you ?',
    },
    {
      to: 'John',
      from: 'Chris',
      message: 'Good morning',
    },
    {
      to: 'John',
      from: 'Chris',
      message: 'Hi',
    },
  ];

  disabled = true;
  newmessage: string = '';
  private stompClient!: Stomp.Client;
  public userProfile: KeycloakProfile = {};
  userProfileName: string | undefined = '';
  @Input() userClicked!: UserMessage;
  subscribeObj$!: string | undefined;

  constructor(
    private _authService: AuthService,
    private push: SwPush,
    private snackbar: MatSnackBar,
    private notificationService: NotificationService,
    private _http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    this.userProfile = await this._authService.loadUserProfile();
    this.userProfileName = this.userProfile.username;
    console.log('UserClicked', this.userClicked);

    // const registration = await navigator.serviceWorker.ready;
    // const sub = await registration.pushManager.subscribe({
    //   userVisibleOnly: true,
    //   applicationServerKey: environment.VAPID_PUBLIC_KEY,
    // });

    // const subObj = await registration.pushManager.getSubscription();
    // this.subscribeObj$ = JSON.stringify(sub);
    // console.log(`registr Object:`, subObj);
    // console.log('Subscription object:', JSON.stringify(sub));
    this.connect();
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;
    if (connected) {
      this.messages = [];
    }
  }

  connect() {
    const socket = new SockJS('http://localhost:8080/chat');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, (frame?: Stomp.Frame) => {
      console.log('Connected: ' + frame);
      _this.stompClient.subscribe(
        '/current/initial',
        (hello: Stomp.Message) => {
          console.log('hello', hello);
          console.log('body: ', JSON.parse(hello.body));
          console.log('messages: ', JSON.parse(hello.body).message);
          const message = JSON.parse(hello.body);
          console.log(JSON.stringify(message.to).toLowerCase());
          if (JSON.stringify(message.to).toLowerCase() === '"john"') {
            _this.showMessage(JSON.parse(hello.body));
          }
        }
      );
    });
  }

  /**
   * This method is called when the user clicks on subscribe button
   * uses a vapid public key to subscribe to the notifications services
   * @return subscription object
   */
  async subscribeToNotifications() {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscribed = !!(await registration?.pushManager.getSubscription());
    const publicKey = this.notificationService
      .getPublicKey()
      .subscribe((data) => console.log(`data: ${data}`));
    const sub = await registration?.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: JSON.stringify(publicKey),
    });

    const subObj = await registration?.pushManager.getSubscription();
    this.subscribeObj$ = JSON.stringify(sub);
    console.log(`registr Object:`, subObj);
    console.log('Subscription object:', this.subscribeObj$);

    // if (this.push.isEnabled) {
    if (sub) {
      this.push.notificationClicks.subscribe(
        // (x) => {
        //   console.log('logs:', x);
        //   this.push
        //     .requestSubscription({
        //       serverPublicKey: environment.VAPID_PUBLIC_KEY,
        //     })
        //     .then(
        (subscription) => {
          // subscription = {
          //   action: 'subscribe',
          //   notification: {
          //     title: 'Notifications',
          //     body: 'New Message Received',
          //     requireInteraction: true,
          //     data: { dateOfArrival: Date.now() },
          //     actions: [{ action: 'inbox', title: 'Go to app' }],
          //   },
          // };
          console.log('Subscription log:', subscription);
          this.notificationService
            .getSubscription(JSON.stringify(subscription))
            .subscribe(
              (x: any) => console.log(x),
              (err: any) => console.log('errors', err)
            );
        }
      );
    }
    // .catch((err) =>
    //   console.error('Could not subscribe to notifications', err)
    // );
    // });
  }

  sendMessage() {
    const chatObj: UserMessage = {
      from: this.userProfileName,
      to: 'john',
      message: this.newmessage,
    };
    this.stompClient.send('/start/resume', {}, JSON.stringify(chatObj));
    this.showMessage(chatObj);
    this.push.messages.subscribe((message) => {
      console.log(message);
      const data = JSON.stringify(this.payload);
      const subscription = JSON.stringify(this.subscribeObj$);
      this.notificationService.triggerMessage(subscription, data).subscribe(
        (x) => {
          console.log(`Inside the sendMessage fuction`);
          console.log(x);
        },
        (err) => console.log(err)
      );
      this.snackbar.open(JSON.stringify(message));
    });
    this.newmessage = '';
  }

  showMessage(userMsg: UserMessage) {
    userMsg = { to: userMsg.to, message: userMsg.message, from: userMsg.from };
    console.log('Show messages: ', userMsg);
    console.log('User inputs: ', userMsg.message);
    this._http.post(environment.baseUrl + 'addMessages', userMsg);
    console.log(`Added message`);
    this.messages.unshift(userMsg);
  }

  payload = JSON.stringify({
    notification: {
      title: 'Message Notification',
      body: 'New Message Received',
      requireInteraction: true,
      data: { dateOfArrival: Date.now() },
      actions: [{ action: 'inbox', title: 'Go to app' }],
    },
  });

  triggerMessage = (subscription: any, data: any) => {
    subscription = this.subscribeObj$;
    data = this.payload;
    this.notificationService.triggerMessage(subscription, data).subscribe(
      (x) => console.log('Triggered:', x),
      (err) => console.log('Error:', err)
    );
  };

  private urlB64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
