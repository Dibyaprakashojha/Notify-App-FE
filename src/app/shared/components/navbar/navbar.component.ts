import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as Keycloak from 'keycloak-js';
import { filter, map, Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  users: string[] = [];
  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    this._userService
      .getAllUsers()
      .pipe(
        map((user): User[] => {
          console.log(user);
          return user;
        })
      )
      .subscribe(data => {
        console.log(`data: ${data}`);
      });
  }
}
// .subscribe(data => {
//   console.log(`User:`, JSON.stringify(data));
// });
