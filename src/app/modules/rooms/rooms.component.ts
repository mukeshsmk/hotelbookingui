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

  constructor(private roomsRepo: RoomsRepository) { }

  ngOnInit() {
    this.loadRooms();
  }

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

    // ✅ Convert to array + sort floors
    return Array.from(map.values())
      .map(floor => ({
        ...floor,
        // ✅ sort rooms by ID
        rooms: floor.rooms.sort((a: any, b: any) => a.id - b.id)
      }))
      .sort((a, b) => a.floorNumber - b.floorNumber);
  }


}
