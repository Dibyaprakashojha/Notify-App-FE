import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from 'src/app/user/auth.service';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = true;
  public loggedIn: boolean = false;
  public userProfile: KeycloakProfile = {};
  firstName: string | undefined;

  constructor(
    private auth: AuthService,
    private keycloakService: KeycloakService
  ) {}

  logout() {
    this.auth.logout();
  }

  async ngOnInit(): Promise<void> {
    this.loggedIn = await this.auth.isLoggedIn();
    if (this.loggedIn) {
      this.userProfile = await this.auth.loadUserProfile();

      // console.log(this.userProfile);
      this.firstName = this.userProfile.firstName;
    } else {
      this.auth.login();
    }
  }
}
