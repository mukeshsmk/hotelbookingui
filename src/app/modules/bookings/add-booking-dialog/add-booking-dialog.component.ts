import { Component, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { exhaustMap, takeUntil } from 'rxjs/operators';
import { BookingsRepository } from '../bookings-repository';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-booking-dialog',
  templateUrl: './add-booking-dialog.component.html',
  styleUrls: ['./add-booking-dialog.component.scss']
})
export class AddBookingDialogComponent implements OnDestroy {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  newBooking = {
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pinCode: '',
    idNumber: '',
  };

  isDragging = false;
  isSaving = false;
  selectedFile!: File;
  previewUrl: string | ArrayBuffer | null = null;

  MAX_SIZE = 1 * 1024 * 1024; // 1MB

  private saveClick$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<AddBookingDialogComponent>,
    private bookingRepo: BookingsRepository,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.saveClick$.pipe(
      exhaustMap(() => {
        const formData = new FormData();
        if (this.selectedFile) {
          formData.append('files', this.selectedFile);
        }
        formData.append(
          'clientObject',
          new Blob([JSON.stringify(this.newBooking)], { type: 'application/json' })
        );
        return this.bookingRepo.addClient(formData);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        if (res?.statusCode === 'OK' || res?.statusCodeValue === 200) {
          this.toastr.success('Booking added successfully', 'Success');
          this.dialogRef.close(true);
        } else {
          this.toastr.error('Booking failed', 'Error');
          this.isSaving = false;
        }
      },
      error: (err) => {
        console.error('Booking failed', err);
        this.isSaving = false;

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

  ngOnInit() {
    if (this.data?.mode === 'edit') {
      this.newBooking = { ...this.data.client };
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveBooking() {
    if (this.isSaving) return;
    this.isSaving = true;
    this.saveClick$.next();
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

    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result);
    reader.readAsDataURL(file);
  }

  removeFile() {
    this.selectedFile = null as any;
    this.previewUrl = null;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  close() {
    this.dialogRef.close();
  }
}
