import { Component } from '@angular/core';
import { RoomCard } from './room-card';
import { RoomBookingDialogComponent } from '../room-booking-dialog/room-booking-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewBookingDialogComponent } from '../view-booking-dialog/view-booking-dialog.component';
import { RoomsRepository } from '../rooms-repository';
import { CheckoutDialogComponent } from '../checkout-dialog/checkout-dialog.component';


@Component({
  selector: 'app-room-cards',
  templateUrl: './room-cards.component.html',
  styleUrls: ['./room-cards.component.scss']
})
export class RoomCardsComponent {
  rooms: any;
  isLoading: boolean = false;
  constructor(private dialog: MatDialog, private repository: RoomsRepository) { }
  ngOnInit() {
    this.fetchRoomDetails();
  }

  fetchRoomDetails() {
    this.isLoading = true;
    this.repository.getRoomUserDetails().subscribe({
      next: (res: any[]) => {
        this.isLoading = false;
        this.rooms = res;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load clients', err);
      }
    });
  }

  getStatusClass(status: string) {
    return {
      'Checked-in': 'status-occupied',
      Available: 'status-available',
      Cleaning: 'status-cleaning',
      Booked: 'status-reserved'
    }[status];
  }

  addGuest(item: any) {
    const dialogRef = this.dialog.open(RoomBookingDialogComponent, {
      width: '950px',
      data: {
        mode: 'booking',
        data: item
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.fetchRoomDetails();
      }
    });
  }

  viewDetails(data: any) {
    this.dialog.open(ViewBookingDialogComponent, {
      width: '950px',
      data: {
        data: data
      }
    });
  }
  checkOut(data: any) {
    this.dialog.open(CheckoutDialogComponent, {
      width: '600px',
      data: data
    });
  }
}
