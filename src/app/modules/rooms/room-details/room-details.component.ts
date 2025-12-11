import { Component, Input } from '@angular/core';
import { AddBookingDialogComponent } from '../../bookings/add-booking-dialog/add-booking-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.scss']
})
export class RoomDetailsComponent {
  @Input() room: any;

  constructor(private dialog: MatDialog) { }

  onSelectRoom() {
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  getButtonClass(status: string) {
    switch (status) {
      case 'Available': return 'btn-checkin';
      case 'Occupied': return 'btn-checkout';
      case 'Needs Cleaning': return 'btn-clean';
      case 'Out of Order': return 'btn-repair';
      default: return 'btn-default';
    }
  }

  getCardClass(status: string) {
    switch (status) {
      case 'Available': return 'border-available';
      case 'Occupied': return 'border-occupied';
      case 'Needs Cleaning': return 'border-cleaning';
      case 'Out of Order': return 'border-outoforder';
      default: return 'border-default';
    }
  }

  onRoomAction(room: any) {
    switch (room.status) {
      case 'Available':
        this.checkIn(room);
        break;

      case 'Occupied':
        this.checkOut(room);
        break;

      case 'Needs Cleaning':
        this.markCleaned(room);
        break;

      case 'Out of Order':
        this.repairDone(room);
        break;

      default:
        this.viewDetails(room);
        break;
    }
  }

  checkIn(item: any) {
    console.log("item", item)
  }
  checkOut(item: any) {
    console.log("item", item)
  }
  markCleaned(item: any) {
    console.log("item", item)
  }
  repairDone(item: any) {
    console.log("item", item)
  }
  viewDetails(item: any) {
    console.log("item", item)
  }

  openAddBookingModal() {
    const dialogRef = this.dialog.open(AddBookingDialogComponent, {
      width: '950px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Add new booking to the table
        /* this.dataSource.data = [...this.dataSource.data, result]; */
      }
    });
  }

}
