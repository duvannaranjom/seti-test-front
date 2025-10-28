import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireRemoteConfigModule } from '@angular/fire/compat/remote-config';
import { FormsModule } from '@angular/forms';
import { HomePage } from './pages/home/home.page';
import { EditTaskPage } from './pages/edit-task/edit-task.page';
import { CategoriesPage } from './pages/categories/categories.page';
import { AddTaskPage } from './pages/add-task/add-task.page';
import { SharedModule } from './shared/shared-module';

@NgModule({
  declarations: [AppComponent, HomePage, EditTaskPage, CategoriesPage, AddTaskPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    IonicStorageModule.forRoot({ name: '__todo' }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireRemoteConfigModule,
    SharedModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
