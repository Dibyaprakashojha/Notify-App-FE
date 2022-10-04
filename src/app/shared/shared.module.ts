import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChatComponent } from './components/chat/chat.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';

const modules = [
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatSnackBarModule,
];

@NgModule({
  declarations: [
    ChatComponent,
    HeaderComponent,
    LayoutComponent,
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild([]),
    ...modules,
  ],
  exports: [ChatComponent, HeaderComponent, LayoutComponent, ...modules],
})
export class SharedModule {}
