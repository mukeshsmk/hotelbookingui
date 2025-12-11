import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomsComponent } from './rooms.component';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { MaterialCollectionModule } from 'src/app/shared/material-collection.module';


@NgModule({
  declarations: [
    RoomsComponent,
    RoomDetailsComponent
  ],
  imports: [
    CommonModule,
    RoomsRoutingModule,
    MaterialCollectionModule
  ]
})
export class RoomsModule { }
