import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-booking-dialog',
  templateUrl: './add-booking-dialog.component.html',
  styleUrls: ['./add-booking-dialog.component.scss']
})
export class AddBookingDialogComponent {

  newBooking = {
    guestName: '',
    gender:'',
    room: null as number | null,
    checkIn: '',
    checkOut: '',
    status: 'Pending',
    payment: 'Due'
  };

  constructor(private dialogRef: MatDialogRef<AddBookingDialogComponent>) { }

  saveBooking() {
   /*  if (!this.newBooking.name || !this.newBooking.room || !this.newBooking.checkIn || !this.newBooking.checkOut) {
      return;
    } */
    this.dialogRef.close(this.newBooking);
  }

  close() {
    this.dialogRef.close();
  }
}
