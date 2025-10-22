import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AppHeaderComponent } from './app-header/app-header.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppHeaderComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [AppHeaderComponent]
})
export class SharedModule { }
