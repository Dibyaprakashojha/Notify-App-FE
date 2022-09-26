import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { SharedModule } from '../shared/shared.module';
import { initializer } from './keycloak-initializer';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, SharedModule, KeycloakAngularModule],
  exports: [SharedModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService]
    }
  ]
})
export class UserModule {}
