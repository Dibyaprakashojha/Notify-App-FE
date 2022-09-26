import { Component, OnInit } from '@angular/core';
import { AuthService } from './user/auth.service';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn = true;
  public loggedIn: boolean = false;
  public userProfile: KeycloakProfile = {};

  constructor(private auth: AuthService) {}

  async ngOnInit(): Promise<void> {
    //Getting user details
    this.loggedIn = await this.auth.isLoggedIn();
    if (this.loggedIn) {
      this.userProfile = await this.auth.loadUserProfile();
      console.log(this.userProfile);
    } else {
      this.auth.login();
    }
  }
}
