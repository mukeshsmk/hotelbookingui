import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialCollectionModule } from '../shared/material-collection.module';
import { AuthRepository } from './auth-repository';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialCollectionModule,
    AuthRoutingModule
  ],
  providers: [AuthRepository]
})
export class AuthModule { }
