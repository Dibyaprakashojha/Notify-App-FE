import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import * as Keycloak from 'keycloak-js';
import { KeycloakProfile } from 'keycloak-js';
import { filter, map, Observable } from 'rxjs';
import { AuthService } from 'src/app/user/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _keycloakService: KeycloakService
  ) {}

  @Output() conversationClicked: EventEmitter<any> = new EventEmitter();

  users: string[] = [];
  userMessage: User[] = [
    {
      userId: 0,
      userName: '',
      ownerUserId: ''
    }
  ];
  public userProfile: KeycloakProfile = {};
  userProfileName: string | undefined = '';

  async ngOnInit(): Promise<void> {
    this.userProfile = await this._authService.loadUserProfile();
    this.userProfileName = this.userProfile.username;
    this._userService
      .getAllUsers()
      .pipe(
        map((user): string[] => {
          console.log(user);
          this.userMessage = user;
          console.log(`UserDetails: `, this.userMessage);
          return user.map(user => user.userName);
        })
      )
      .subscribe(data => {
        data.forEach(user => {
          if (user.toLowerCase() != this.userProfileName) {
            console.log('profile: ', this.userProfileName);
            console.log(user);
            this.users.push(user);
          }
        });
        console.log(`data: ${data}`);
      });
  }
}
