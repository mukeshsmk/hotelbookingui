import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-rooms',
  templateUrl: './dashboard-rooms.component.html',
  styleUrls: ['./dashboard-rooms.component.scss']
})
export class DashboardRoomsComponent {
  rooms = [
    { number: '101', status: 'available' },
    { number: '102', status: 'available' },
    { number: '103', status: 'available' },
    { number: '104', status: 'booked' },
    { number: '105', status: 'available' },
    { number: '106', status: 'available' },
    { number: '107', status: 'booked' },
    { number: '108', status: 'available' },
    { number: '109', status: 'available' },
    { number: '110', status: 'available' },
    { number: '201', status: 'available' },
    { number: '202', status: 'booked' },
    { number: '203', status: 'booked' },
    { number: '204', status: 'booked' },
    { number: '205', status: 'booked' },
    { number: '206', status: 'booked' },
    { number: '207', status: 'booked' },
    { number: '208', status: 'booked' },
    { number: '209', status: 'booked' },
    { number: '210', status: 'booked' },
    { number: '301', status: 'available' },
    { number: '302', status: 'booked' },
    { number: '303', status: 'booked' },
    { number: '304', status: 'booked' },
    { number: '305', status: 'booked' },
    { number: '306', status: 'booked' },
    { number: '307', status: 'booked' },
    { number: '308', status: 'booked' },
    { number: '309', status: 'booked' },
    { number: '310', status: 'booked' },


    // add as many as you want...
  ];

  selectRoom(room: any) {
    if (room.status === 'booked' || room.status === 'maintenance') return;

    // toggle select
    room.status = room.status === 'selected' ? 'available' : 'selected';
  }
}
