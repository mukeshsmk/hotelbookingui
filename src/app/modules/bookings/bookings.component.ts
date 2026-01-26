import { Component, OnInit, ViewChild, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Client } from './client.model';
import { BookingsRepository } from './bookings-repository';
import { AddBookingDialogComponent } from './add-booking-dialog/add-booking-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RoomBookingDialogComponent } from '../rooms/room-booking-dialog/room-booking-dialog.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { ViewBookingDialogComponent } from '../rooms/view-booking-dialog/view-booking-dialog.component';
import { BillPrintComponent } from './bill-print/bill-print.component';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit, AfterViewInit {
  @Input() isViewOnly: boolean = false;
  displayedColumns = [
    'bookingId',
    'name',
    'mobileNumber',
    'room',
    'checkinDts',
    'checkoutDts',
    'billingNumber',
    'payment',
    'actions'
  ];

  dataSource = new MatTableDataSource<Client>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() printBill = new EventEmitter<any>();
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  rowContext: any;
  inputValue: any;
  @ViewChild('billPrintPage') billPrintPage: BillPrintComponent | undefined;

  billData: any;
  today = new Date();
  isBillPrint = false
  constructor(private dialog: MatDialog, private bookingRepo: BookingsRepository) { }

  ngOnInit() {
    if(this.isViewOnly){
      this.loadTodayClients(); 
    }else{
      this.loadClients();  
    }
   
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.pageSize = 10;
  }

  loadClients() {
    this.bookingRepo.getBookingList().subscribe({
      next: (res: any[]) => {
        this.dataSource.data = res;
      },
      error: (err) => {
        console.error('Failed to load clients', err);
      }
    });
  }

  loadTodayClients(){
    this.bookingRepo.getTodayBookingList().subscribe({
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
    const dialogRef = this.dialog.open(RoomBookingDialogComponent, {
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
        mode: 'view-booking'
      }
    });
  }
  edit(data: any) {

  }
  delete(data: any) {

  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  clear() {
    this.inputValue = '';
    this.dataSource.filter = '';
  }

  onPrintClick(booking: any) {
    this.billPrintPage?.printBill(booking?.bookingId);
  }

}
