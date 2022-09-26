import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private keycloakService: KeycloakService) {}

  /**
   * to get the details of the logged in user
   */
  public getLoggedUser(): KeycloakTokenParsed | undefined {
    try {
      const userDetails:
        | KeycloakTokenParsed
        | undefined = this.keycloakService.getKeycloakInstance().idTokenParsed;
      return userDetails;
    } catch (e) {
      console.error('Exception', e);
      return undefined;
    }
  }

  /**
   * to check if someone is logged in or not
   */
  public isLoggedIn(): Promise<boolean> {
    return this.keycloakService.isLoggedIn();
  }

  /**
   * load the profile of th logged in user
   */
  public loadUserProfile(): Promise<KeycloakProfile> {
    return this.keycloakService.loadUserProfile();
  }
  /**
   * to reload to login page
   * @param redirectUri
   */
  public login(redirectUri?: string): Promise<void> {
    return this.keycloakService.login({
      redirectUri
    });
  }
  /**
   * to logout from current user
   */
  public logout(): void {
    this.keycloakService.logout(window.location.origin);
  }

  /**
   * to redirect to the profile of the logged in user
   */
  public redirectToProfile(): void {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }

  /**
   * to get the role of the logged in user
   * @returns
   */
  public getRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }
}
