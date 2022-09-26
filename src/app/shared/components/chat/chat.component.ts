import { Component, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  greetings: string[] = [];
  disabled = true;
  newmessage: string = '';
  private stompClient!: Stomp.Client;

  constructor() {}

  ngOnInit() {
    this.connect();
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }

  connect() {
    const socket = new SockJS('http://localhost:8080/chat');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame?: Stomp.Frame) {
      console.log('Connected: ' + frame);

      _this.stompClient.subscribe(
        '/start/initial',
        function (hello: Stomp.Message) {
          console.log(JSON.parse(hello.body));

          _this.showMessage(JSON.parse(hello.body));
        }
      );
    });
  }

  sendMessage() {
    this.stompClient.send(
      '/current/resume',
      {},
      JSON.stringify(this.newmessage)
    );
    this.showMessage(this.newmessage);
    this.newmessage = '';
  }

  showMessage(message: string) {
    this.greetings.push(message);
  }
}
