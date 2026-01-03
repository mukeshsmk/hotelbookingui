import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoomsRepository } from '../rooms-repository';
import { ToastrService } from 'ngx-toastr';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';

export class MyDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-room-booking-dialog',
  templateUrl: './room-booking-dialog.component.html',
  styleUrls: ['./room-booking-dialog.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})

export class RoomBookingDialogComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  isDragging = false;
  selectedFile!: File;
  previewUrl: string | ArrayBuffer | null = null;
  roomsLoaded = false;
  MAX_SIZE = 1 * 1024 * 1024; // 1MB
  room = this.data;
  today = new Date();
  model: any = {
    clientObject: {
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      idNumber: '',
      city: '',
      state: '',
      status: '',
      address2: '',
      address1: ''
    },
    bookingObject: {
      id: '',
      roomId: '',
      roomNumber: '',
      roomType: '',
      clientId: '',
      totalAmount: '',
      amountPaid: '',
      amountRemaining: '',
      adultCount: '',
      childrenCount: '',
      paymentType: '',
      transactionStatus: 22,
      checkinDts: new Date(),
      checkoutDts: new Date(new Date().setDate(new Date().getDate() + 1)),
      comments: '',
      status: ''
    },
    files: ''
  };

  rooms = [
    { id: 1, name: 'AC' },
    { id: 2, name: 'Non AC' },
  ];
  loading: boolean = false;
  isEditMode: boolean = false;
  isNewBooking: boolean = false;
  roomDetails: any;
  selectedTabIndex = 0;
  constructor(
    private dialogRef: MatDialogRef<RoomBookingDialogComponent>, private repository: RoomsRepository,
    @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    if (this.data?.mode === 'edit') {
      this.isEditMode = true;
      this.selectedTabIndex = 1;
      this.model = {
        clientObject: {
          firstName: this.data.data.firstName,
          lastName: this.data.data.lastName,
          email: this.data.data.email,
          mobileNumber: this.data.data.mobileNumber,
          idNumber: this.data.data.idNumber,
          city: this.data.data.city,
          state: this.data.data.state,
          address1: this.data.data.address1,
        },
        bookingObject: {
          id: this.data.data.bookingId,
          roomId: this.data.data.roomId,
          roomNumber: this.data.data.roomNumber,
          roomType: this.data.data.roomType,
          clientId: this.data.data.clientId,
          adultCount: this.data.data.adultCount,
          childrenCount: this.data.data.childrenCount,
          totalAmount: this.data.data.totalAmount,
          amountPaid: this.data.data.amountPaid,
          amountRemaining: this.data.data.amountRemaining,
          paymentType: this.data.data.paymentType,
          transactionStatus: 22,
          checkinDts: this.data.data.checkinDts,
          checkoutDts: this.data.data.checkoutDts,
          comments: this.data.data.comments,
        }
      }
    } else if (this.data?.mode === 'booking') {
      this.isNewBooking = true;
      this.model.bookingObject.roomNumber = this.data.data.roomNumber;
      this.model.bookingObject.roomId = this.data.data.roomId;
      this.model.bookingObject.roomType = this.data.data.roomType;
    }
    this.fetchRoomDetails();
  }

  onDropdownOpen(opened: boolean) {
    if (opened && !this.roomsLoaded) {
      this.fetchRoomDetails();
    }
  }

  fetchRoomDetails() {
    this.loading = true;
    const formatted = this.formatDateForApi(this.model.bookingObject.checkinDts);

    this.repository.getRoomDetails(formatted).subscribe({
      next: (res) => {
        this.roomDetails = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  formatDateForApi(date: any): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;   // yyyy-MM-dd
  }

  isFormValid() {
    const client = this.model.clientObject;
    const booking = this.model.bookingObject;

    return (
      client.firstName &&
      // client.lastName &&
      client.mobileNumber &&
      // client.idNumber &&
      // client.address1 &&
      booking.checkinDts &&
      booking.checkoutDts &&
      // booking.adultCount &&
      booking.roomType &&
      booking.roomNumber
      // booking.paymentType &&
      // booking.amountPaid
    );
  }

  onCheckinChange(checkinDate: Date) {
    if (!checkinDate) return;
    const checkout = new Date(checkinDate);
    checkout.setDate(checkout.getDate() + 1);
    this.model.bookingObject.checkoutDts = checkout;
  }

  close() {
    this.dialogRef.close();
  }

  save() {

    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('files', this.selectedFile);
    } else {
      formData.append('files', new Blob([]));
    }

    formData.append(
      'clientObject',
      new Blob(
        [JSON.stringify(this.model.clientObject)],
        { type: 'application/json' }
      )
    );
    this.model.bookingObject.amountRemaining = this.model.bookingObject.totalAmount - this.model.bookingObject.amountPaid
    formData.append(
      'bookingObject',
      new Blob(
        [JSON.stringify(this.model.bookingObject)],
        { type: 'application/json' }
      )
    );

    this.repository.addBooking(formData).subscribe({
      next: (res: any) => {
        console.log("res", res)
        if (res?.status === '200 OK' || res.message === 'Success') {
          const message = this.isEditMode ? 'Booking updated successfully' : 'Booking added successfully';
          this.toastr.success(message, 'Success');
          this.dialogRef.close(true);
        } else {
          this.toastr.error('Booking failed', 'Error');
        }
      },
      error: (err) => {
        console.error('Booking failed', err);
        if (err.status === 400) {
          this.toastr.warning('Invalid booking data', 'Warning');
        } else if (err.status === 500) {
          this.toastr.error('Server error. Try again later', 'Error');
        } else {
          this.toastr.error('Something went wrong', 'Error');
        }
      }
    });
  }

  onRoomSelect(selectedRoomNumber: string) {
    this.model.bookingObject.roomNumber = selectedRoomNumber;
    const room = this.roomDetails.find((r: { roomNumber: string; }) => r.roomNumber === selectedRoomNumber);
    if (room) {
      this.model.bookingObject.roomId = room.id;
    }
  }
  selectRoomType(item: any) {
    console.log("item", item)
    this.model.bookingObject.roomType = item;
    if (item) {
      this.model.bookingObject.totalAmount = (item === 1 ? 1500 : 1200);
    }
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  validateAndSetFile(file: File) {
    const allowedTypes = ['image/png', 'image/jpeg'];

    if (!allowedTypes.includes(file.type)) {
      alert('Only PNG and JPG files are allowed');
      return;
    }

    if (file.size > this.MAX_SIZE) {
      alert('File size must be less than 1MB');
      return;
    }

    this.selectedFile = file;

    // Preview
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result);
    reader.readAsDataURL(file);
  }

  removeFile() {
    this.selectedFile = null as any;
    this.previewUrl = null;

    // Clear input value (IMPORTANT)
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }


}
