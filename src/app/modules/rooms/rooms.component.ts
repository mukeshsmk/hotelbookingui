import { Component } from '@angular/core';
import { RoomsRepository } from './rooms-repository';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent {

  selectedDate = new Date();
  roomDetails: any[] = [];
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

  /* roomDetails = [
    { number: 1, status: 'Available', guestName: null, note: 'Ready for Check-in' },
    { number: 2, status: 'Occupied', guestName: 'John Doe', checkOut: '2024-10-24' },
    { number: 3, status: 'Needs Cleaning', guestName: 'Jane Smith', note: 'Departed: 23/10/2024' },
    { number: 4, status: 'Out of Order', note: 'Maintenance Required' },
    { number: 1, status: 'Available', guestName: null, note: 'Ready for Check-in' },
    { number: 2, status: 'Occupied', guestName: 'John Doe', checkOut: '2024-10-24' },
    { number: 3, status: 'Needs Cleaning', guestName: 'Jane Smith', note: 'Departed: 23/10/2024' },
    { number: 4, status: 'Out of Order', note: 'Maintenance Required' }
  ]; */

  constructor(private roomsRepo: RoomsRepository) { }

  ngOnInit() {
    this.loadRooms();
  }

  /* loadRooms() {
    this.roomsRepo.getRooms().subscribe({
      next: (data) => this.roomDetails = data,
      error: () => console.error('Failed to load rooms')
    });
  } */

  loadRooms() {
    this.roomsRepo.getRooms().subscribe({
      next: (rooms) => {
        this.roomDetails = this.groupByFloor(rooms);
      },
      error: () => console.error('Failed to load rooms')
    });
  }

  groupByFloor(rooms: any[]) {
    const map = new Map<number, any>();

    rooms.forEach(room => {
      if (!map.has(room.floorNumber)) {
        map.set(room.floorNumber, {
          floorNumber: room.floorNumber,
          floorName: room.floorName,
          rooms: []
        });
      }
      map.get(room.floorNumber).rooms.push(room);
    });

    return Array.from(map.values()).sort(
      (a, b) => a.floorNumber - b.floorNumber
    );
  }

}
