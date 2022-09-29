import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private _httpClient: HttpClient) {}
  private _url = 'http://localhost:8080/api/users';

  getAllUsers = (): Observable<User[]> => {
    return this._httpClient.get<User[]>(this._url);
  };
}
