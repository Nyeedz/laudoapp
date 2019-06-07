import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [LoginComponent],
  declarations: [LoginComponent]
})
export class LoginModule {}
