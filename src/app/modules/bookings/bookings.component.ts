import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
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
    'email',
    'mobileNumber',
    'checkinDts',
    'checkoutDts',
    'room',
    'payment',
    'actions'
  ];

  dataSource = new MatTableDataSource<Client>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };
  rowContext: any;
  inputValue: any;
  @ViewChild('billTemplate') billTemplate!: any;
  billData: any;
  today = new Date();
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
    this.bookingRepo.getBookingList().subscribe({
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

  printBill(booking: any) {

    this.billData = booking;

    const printContent = this.billTemplate.nativeElement.innerHTML;
    const popup = window.open('', '_blank', 'width=900,height=650');

    popup!.document.open();
    popup!.document.write(`
    <html>
      <head>
        <title>Cash Bill</title>

        <style>
        .bill-container {
  font-family: Arial;
  width: 210mm; /* A4 width */
  margin: 0 auto;
}

.bill-header {
  display: flex;
  justify-content: space-between;
  p {
    font-size: 12px;
    margin: 0;
  }
}
.right {
  text-align: end;
}
.cash-bill {
  margin: 0;
  background: #e32913;
  color: #fff;
  padding: 5px 5px;
  display: inline-block;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
   -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
}
.title {
  text-align: center;
  margin-top: -45px;
  h2 {
    color: #e32913;
    font-size: 24px;
    font-weight: 500;
    margin: 0;
  }
  h3 {
    font-size: 19px;
    font-weight: 500;
    color: #4d4949;
    margin: 0;
  }
  p {
    font-size: 12px;
    margin: 0;
  }
}

.bill-info {
  display: flex;
  justify-content: space-between;
  p {
    margin: 8px 0;
    font-size: 13px;
  }
}
.bill-info-1 {
  display: flex;
  justify-content: space-between;
  p {
    margin: 0;
    font-size: 13px;
  }
}

.bill-table {
  width: 100%;
  border-collapse: collapse;
}

.bill-table th,
.bill-table td {
  padding: 6px 4px;
}

.totals {
  text-align: right;
}

.words {
  border: 1px solid #000;
  padding: 5px;
  margin-top: 10px;
}

.footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.sign {
  text-align: right;
  margin-top: 40px;
  font-weight: bold;
}

@media print {
  #bill-print {
    display: block !important;
  }
}

.bill-table {
  width: 100%;
  border-collapse: collapse;
}

.bill-table th,
.bill-table td {
  border: 1px solid #000;
  padding: 8px;
  text-align: left;
}

.bill-table th {
  background-color: #f2f2f2;
}

        </style>

      </head>
      <body>${printContent}</body>
    </html>
  `);

    popup!.document.close();
    popup!.print();
  }

}
