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
  selectedDate: Date | null = new Date();

  constructor(private dialog: MatDialog, private repository: RoomsRepository) { }
  ngOnInit() {
    // Load rooms for the selected date by default
    this.applyDateFilter();
    /* this.fetchRoomDetails(); */
  }

  fetchRoomDetails(date?: Date | null) {
    this.isLoading = true;
    const targetDate = date ?? this.selectedDate;
    if (targetDate) {
      const dateStr = this.formatDate(targetDate);
      this.repository.getRoomUserDetails(dateStr).subscribe({
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

  formatDate(d: Date | null): string {
    if (!d) { return ''; }
    const date = new Date(d);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  applyDateFilter() {
    this.fetchRoomDetails(this.selectedDate);
  }

  onSelectedDateChange(val: Date | null) {
    this.selectedDate = val;
    this.applyDateFilter();
  }

  previousDay() {
    if (!this.selectedDate) { this.selectedDate = new Date(); }
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() - 1);
    this.selectedDate = d;
    this.applyDateFilter();
  }

  nextDay() {
    if (!this.selectedDate) { this.selectedDate = new Date(); }
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + 1);
    this.selectedDate = d;
    this.applyDateFilter();
  }

  goToday() {
    this.selectedDate = new Date();
    this.applyDateFilter();
  }
}
