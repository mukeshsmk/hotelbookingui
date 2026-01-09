import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoomsRepository } from '../rooms-repository';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-dialog',
  templateUrl: './checkout-dialog.component.html',
  styleUrls: ['./checkout-dialog.component.scss']
})
export class CheckoutDialogComponent {
  amount: any;
  constructor(
    private dialogRef: MatDialogRef<CheckoutDialogComponent>, private repository: RoomsRepository,
    @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService
  ) { }

  ngOnInit(): void {

  }

  checkout() {
    this.data.amountPaid = this.data?.amountRemaining;
    this.data.amountRemaining = 0;
    this.repository
      .getCheckOut(this.data.bookingId, this.data)
      .subscribe({
        next: (data) => {
          if (data?.status === 'Success') {
            this.toastr.success('Checkout successfully', 'Success');
            this.dialogRef.close(true);
          } else {
            this.toastr.error(
              data?.message || 'Checkout failed',
              'Error'
            );
          }
        },
        error: (err) => {
          this.toastr.error(
            err?.error?.message || 'Something went wrong. Please try again.',
            'Error'
          );
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
