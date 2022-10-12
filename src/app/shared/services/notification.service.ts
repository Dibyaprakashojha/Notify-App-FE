import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _http: HttpClient) {}

  private _baseUrl = 'http://localhost:8080/app/';

  getPublicKey = (): Observable<string> => {
    return this._http.get<string>(this._baseUrl + 'publicKey');
  };

  getSubscription = (subscription: any) => {
    return this._http.post(this._baseUrl + 'subscribe', subscription).pipe(
      map((res) => res)
      // retry(1),
      // catchError(this.handleError)
    );
  };

  triggerMessage = (subscription: any, data: any) => {
    return (
      this._http
        // .post(environment.baseUrl + 'triggerMessage', JSON.parse(message))
        .post(
          this._baseUrl + 'triggerMessage',
          JSON.parse(subscription),
          JSON.parse(data)
        )
        .pipe(map((res) => res))
    );
  };

  // handleError = (error: any) => {
  //   let errorMessage = '';

  //   if (error.error instanceof ErrorEvent) {
  //     // client-side error

  //     errorMessage = `Error: ${error.error.message}`;
  //   } else {
  //     // server-side error

  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }

  //   window.alert(errorMessage);

  //   return throwError(errorMessage);
  // };
}
