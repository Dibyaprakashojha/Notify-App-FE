import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ChatComponent } from './components/chat/chat.component';
import { FormsModule } from '@angular/forms';

const modules = [MatButtonModule];

@NgModule({
  declarations: [ChatComponent],
  imports: [CommonModule, FormsModule, ...modules],
  exports: [ChatComponent, ...modules]
})
export class SharedModule {}
