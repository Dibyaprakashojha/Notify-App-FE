import { Component, Input, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { KeycloakProfile } from 'keycloak-js';
import { AuthService } from 'src/app/user/auth.service';
import { userMessage } from '../../userMessage';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: string[] = [
    'Hi',
    'Good morning',
    'How are you ?',
    'I am fine. What about you?',
    'Hi, Good morning',
    'I m gooding well.',
    'What is the progress on the work ?',
    'Yes, need some few hours to finish it'
  ];
  disabled = true;
  newmessage: string = '';
  private stompClient!: Stomp.Client;
  @Input() userClicked!: userMessage;

  constructor(private _authService: AuthService) {}
  public userProfile: KeycloakProfile = {};
  userProfileName: string | undefined = '';

  async ngOnInit(): Promise<void> {
    this.userProfile = await this._authService.loadUserProfile();
    this.userProfileName = this.userProfile.username;
    this.connect();
    console.log('UserClicked', this.userClicked);
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
          console.log(JSON.parse(hello.body));
          const message = JSON.parse(hello.body);
          // if (JSON.stringify(message.to).toLowerCase() === 'chris') {
          _this.showMessage(JSON.parse(hello.body).message);
          // }
        }
      );
    });
  }

  sendMessage() {
    const chatObj = {
      from: this.userProfileName,
      to: 'chris',
      message: this.newmessage
    };
    this.stompClient.send('/start/resume', {}, JSON.stringify(chatObj));
    this.showMessage(this.newmessage);
    this.newmessage = '';
  }

  showMessage(message: string) {
    this.messages.unshift(message);
  }
}
