import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsRoutingModule } from './rooms-routing.module';
import { RoomsComponent } from './rooms.component';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { MaterialCollectionModule } from 'src/app/shared/material-collection.module';
import { RoomsRepository } from './rooms-repository';
import { HttpClientModule } from '@angular/common/http';
import { RoomCardsComponent } from './room-cards/room-cards.component';
import { RoomBookingDialogComponent } from './room-booking-dialog/room-booking-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewBookingDialogComponent } from './view-booking-dialog/view-booking-dialog.component';


@NgModule({
  declarations: [
    RoomsComponent,
    RoomDetailsComponent,
    RoomCardsComponent,
    RoomBookingDialogComponent,
    ViewBookingDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RoomsRoutingModule,
    HttpClientModule,
    MaterialCollectionModule
  ],
  exports:[RoomBookingDialogComponent],
  providers: [RoomsRepository]
})
export class RoomsModule { }
