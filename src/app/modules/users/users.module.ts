import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';;
import { MaterialCollectionModule } from 'src/app/shared/material-collection.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';
import { EditUsersDialogComponent } from './edit-users-dialog/edit-users-dialog.component';


@NgModule({
  declarations: [
    UsersComponent,
    EditUsersDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    MaterialCollectionModule
  ],
  providers: []
})
export class UsersModule { }
