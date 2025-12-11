import { Component } from '@angular/core';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent {

  selectedDate = new Date();

  previousDay() {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() - 1);
    this.selectedDate = d;
  }

  nextDay() {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + 1);
    this.selectedDate = d;
  }

  goToday() {
    this.selectedDate = new Date();
  }

  roomDetails = [
    { number: 1, status: 'Available', guestName: null, note: 'Ready for Check-in' },
    { number: 2, status: 'Occupied', guestName: 'John Doe', checkOut: '2024-10-24' },
    { number: 3, status: 'Needs Cleaning', guestName: 'Jane Smith', note: 'Departed: 23/10/2024' },
    { number: 4, status: 'Out of Order', note: 'Maintenance Required' },
    { number: 1, status: 'Available', guestName: null, note: 'Ready for Check-in' },
    { number: 2, status: 'Occupied', guestName: 'John Doe', checkOut: '2024-10-24' },
    { number: 3, status: 'Needs Cleaning', guestName: 'Jane Smith', note: 'Departed: 23/10/2024' },
    { number: 4, status: 'Out of Order', note: 'Maintenance Required' }
  ];
}
