import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoomsRepository } from '../rooms-repository';

@Component({
  selector: 'app-view-booking-dialog',
  templateUrl: './view-booking-dialog.component.html',
  styleUrls: ['./view-booking-dialog.component.scss']
})
export class ViewBookingDialogComponent {
  loading: boolean = false;
  bookingDetails: any;
  isFromUser: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<ViewBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private repository: RoomsRepository,
  ) { }

  ngOnInit(): void {
    this.getBookingDetails();
    if(this.data.mode === 'view-user'){
      this.isFromUser = true
    }
  }

  getBookingDetails() {
    this.loading = true;
    this.repository.getBookingDetails(this.data.data.bookingId).subscribe({
      next: (res) => {
        this.bookingDetails = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
