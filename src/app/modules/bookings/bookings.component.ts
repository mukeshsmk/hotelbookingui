import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Client } from './client.model';
import { BookingsRepository } from './bookings-repository';
import { AddBookingDialogComponent } from './add-booking-dialog/add-booking-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'id',
    'name',
    'mobileNumber',
    'idNumber',
    'address',
    'pinCode',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<Client>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private bookingRepo: BookingsRepository) { }

  ngOnInit() {
    this.loadClients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.pageSize = 10;
  }

  loadClients() {
    this.bookingRepo.getClientList().subscribe({
      next: (res: any[]) => {
        this.dataSource.data = res;
      },
      error: (err) => {
        console.error('Failed to load clients', err);
      }
    });
  }

  getFullName(client: Client): string {
    return `${client.firstName} ${client.lastName}`;
  }

  getStatusLabel(status: number): string {
    return status === 1 ? 'Active' : 'Inactive';
  }

  openAddBookingModal() {
    const dialogRef = this.dialog.open(AddBookingDialogComponent, {
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

  editClient(client: Client) {
    const dialogRef = this.dialog.open(AddBookingDialogComponent, {
      width: '950px',
      data: {
        mode: 'edit',
        client: client
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

}
