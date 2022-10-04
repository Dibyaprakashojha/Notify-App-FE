import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _http: HttpClient) {}

  private _baseUrl = 'http://localhost:8080/';

  subscribe = (subscription: any) => {
    return this._http
      .post(this._baseUrl + 'subscribe', subscription)
      .pipe(map((res) => res));
  };

  // triggerMessage = (message: any) => {
  //   return (
  //     this._http
  //       // .post(environment.baseUrl + 'triggerMessage', JSON.parse(message))
  //       .post(this._baseUrl + 'triggerMessage', JSON.parse(message))
  //       .pipe(map((res) => res))
  //   );
  // };
}
