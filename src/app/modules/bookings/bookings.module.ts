import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingsComponent } from './bookings.component';
import { MaterialCollectionModule } from 'src/app/shared/material-collection.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddBookingDialogComponent } from './add-booking-dialog/add-booking-dialog.component';


@NgModule({
  declarations: [
    BookingsComponent,
    AddBookingDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BookingsRoutingModule,
    MaterialCollectionModule
  ]
})
export class BookingsModule { }
