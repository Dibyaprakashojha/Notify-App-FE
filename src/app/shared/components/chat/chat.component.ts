import { Component, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

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
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?',
    'Hi',
    'Good morning',
    'How are you ?'
  ];
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
          if (message.to === 'Brian') {
            _this.showMessage(JSON.parse(hello.body).message);
          }
        }
      );
    });
  }

  sendMessage() {
    const chatObj = {
      from: 'John',
      to: 'Brian',
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
