import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddBookingDialogComponent } from './add-booking-dialog/add-booking-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface Booking {
  id: number;
  guestName: string;
  room: number;
  checkIn: string;   // stored as 'YYYY-MM-DD' or date string
  checkOut: string;
  status: string;
  payment: string;
}

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements AfterViewInit {

  displayedColumns: string[] = ['id', 'guestName', 'room', 'checkIn', 'checkOut', 'status', 'payment'];
  dataSource = new MatTableDataSource<Booking>([
    { id: 101, guestName: 'John Doe', room: 101, checkIn: '2025-11-23', checkOut: '2025-11-25', status: 'Checked-in', payment: 'Paid' },
    { id: 102, guestName: 'Jane Smith', room: 102, checkIn: '2025-11-23', checkOut: '2025-11-24', status: 'Pending', payment: 'Due' },
    { id: 103, guestName: 'Bob Johnson', room: 103, checkIn: '2025-11-22', checkOut: '2025-11-24', status: 'Checked-out', payment: 'Paid' },
  ]);

  filterGuestName: string = '';
  filterCheckInStart!: Date | null;
  filterCheckOutEnd!: Date | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Custom filter logic
    this.dataSource.filterPredicate = (data: Booking, filter: string) => {
      const guestMatch = this.filterGuestName
        ? data.guestName.toLowerCase().includes(this.filterGuestName.toLowerCase())
        : true;

      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);

      const startValid = this.filterCheckInStart ? checkInDate >= this.filterCheckInStart : true;
      const endValid = this.filterCheckOutEnd ? checkOutDate <= this.filterCheckOutEnd : true;

      return guestMatch && startValid && endValid;
    };
  }

  applyFilters() {
    // Trigger filtering
    this.dataSource.filter = '' + Math.random();
  }

  applyGuestFilter(event: Event) {
    this.filterGuestName = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  openAddBookingModal() {
    const dialogRef = this.dialog.open(AddBookingDialogComponent, {
      width: '950px'
    });

    dialogRef.afterClosed().subscribe(result => {
      /* if (result) {
        // Add new booking to the table
        this.dataSource.data = [...this.dataSource.data, result];
      } */
    });
  }
}
