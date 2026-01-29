import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


import { MatDialog } from '@angular/material/dialog';
import { RoomBookingDialogComponent } from '../rooms/room-booking-dialog/room-booking-dialog.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { ViewBookingDialogComponent } from '../rooms/view-booking-dialog/view-booking-dialog.component';
import { Client } from '../bookings/client.model';
import { BookingsRepository } from '../bookings/bookings-repository';
import { EditUsersDialogComponent } from './edit-users-dialog/edit-users-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  displayedColumns = [
    'bookingId',
    'name',
    'email',
    'mobileNumber',
    'idNumber',
    'city',
    'state',
    'address1',
    'actions'
  ];

  dataSource = new MatTableDataSource<Client>([]);
  inputValue: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  fromDate!: Date | null;
  toDate!: Date | null;
  contextMenuPosition = { x: '0px', y: '0px' };
  rowContext: any;
  isLoading: boolean = false
  constructor(private dialog: MatDialog, private bookingRepo: BookingsRepository) { }

  ngOnInit() {
    this.setDefaultOneMonthFilter();
    this.loadClients();
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  clear() {
    this.inputValue = '';
    this.dataSource.filter = '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.pageSize = 10;
  }

  loadClients() {
    this.isLoading = true;
    if (!this.fromDate || !this.toDate) {
      return;
    }

    const from = this.formatDateTime(this.fromDate, 0, 0, 0);
    const to = this.formatDateTime(this.toDate, 23, 59, 59)
    this.bookingRepo.getBookingList(from, to).subscribe({
      next: (res: any[]) => {
        this.isLoading = false;
        this.dataSource.data = res;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load clients', err);
      }
    });
  }

  private formatDateTime(date: Date, h: number, m: number, s: number): string {
    const d = new Date(date);
    d.setHours(h, m, s, 0);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
      `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  getFullName(client: Client): string {
    return `${client.firstName} ${client.lastName}`;
  }

  getStatusLabel(status: number): string {
    return status === 1 ? 'Active' : 'Inactive';
  }

  openAddBookingModal() {
    const dialogRef = this.dialog.open(RoomBookingDialogComponent, {
      width: '950px'
    });

    dialogRef.afterClosed().subscribe((result: Client) => {
      if (result) {
        // Add new booking to the table
        this.loadClients()
      }
    });
  }

  viewClient(row: any) {
    console.log('View:', row);
  }

  editClient(item: any) {
    const dialogRef = this.dialog.open(EditUsersDialogComponent, {
      width: '950px',
      data: {
        mode: 'edit',
        data: item
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadClients(); // refresh table
      }
    });
  }


  deleteClient(row: any) {
    if (confirm('Are you sure you want to delete?')) {
      console.log('Delete:', row);
    }
  }

  getPaymentStatus(row: any): string {
    const total = Number(row.totalAmount) || 0;
    const paid = Number(row.amountPaid) || 0;
    if (paid === 0) return 'Unpaid';
    if (paid < total) return 'Unpaid';
    return 'Paid';
  }

  view(data: any) {
    const dialogRef = this.dialog.open(ViewBookingDialogComponent, {
      width: '950px',
      data: {
        data: data,
        mode: 'view-user'
      }
    });
  }
  edit(data: any) {

  }
  delete(data: any) {

  }

  setDefaultOneMonthFilter() {
    const today = new Date();

    this.toDate = new Date(today);
    this.fromDate = new Date(today);
    this.fromDate.setMonth(this.fromDate.getMonth() - 1);

    this.fromDate.setHours(0, 0, 0, 0);
    this.toDate.setHours(23, 59, 59, 999);
  }


  resetFilters() {
    this.setDefaultOneMonthFilter();
    this.loadClients();
  }

}
