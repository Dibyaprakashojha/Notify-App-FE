import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Role } from './role';

type RouteData = {
  roles: Role[];
};

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private keycloakAngular: KeycloakService,
    private auth: AuthService
  ) {}

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // return true;
    // Force the user to log in if currently unauthenticated.
    if (!this.auth.isLoggedIn()) {
      await this.auth.login(window.location.origin + state.url);
    }

    const userRoles = this.auth.getRoles();

    // Get the roles required from the route.
    const requiredRoles = (route.data as RouteData).roles;

    // Allow the user to to proceed if no additional roles are required to access the route.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every(role => userRoles.includes(role));
  }
}
