import { Component } from '@angular/core';
import { RoomCard } from './room-card';
import { RoomBookingDialogComponent } from '../room-booking-dialog/room-booking-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewBookingDialogComponent } from '../view-booking-dialog/view-booking-dialog.component';
import { RoomsRepository } from '../rooms-repository';


@Component({
  selector: 'app-room-cards',
  templateUrl: './room-cards.component.html',
  styleUrls: ['./room-cards.component.scss']
})
export class RoomCardsComponent {
  rooms: any;
  constructor(private dialog: MatDialog, private repository: RoomsRepository) { }
  ngOnInit() {
    this.fetchRoomDetails();
  }

  fetchRoomDetails() {
    this.repository.getRoomUserDetails().subscribe({
      next: (res: any[]) => {
        this.rooms = res;
      },
      error: (err) => {
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
    const dialogRef = this.dialog.open(ViewBookingDialogComponent, {
      width: '950px',
      data: data
    });
  }
}
