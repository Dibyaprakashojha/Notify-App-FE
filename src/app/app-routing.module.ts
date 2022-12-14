import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './shared/components/chat/chat.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { AuthGuard } from './user/auth.guard';
import { Role } from './user/role';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    data: {
      roles: [Role.USER]
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
