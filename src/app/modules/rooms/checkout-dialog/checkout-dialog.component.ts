import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RoomsRepository } from '../rooms-repository';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout-dialog',
  templateUrl: './checkout-dialog.component.html',
  styleUrls: ['./checkout-dialog.component.scss']
})
export class CheckoutDialogComponent {
  amount: any;
  discountAmount:any = 0;
  gstEnabled:boolean = true;
  @ViewChild('ordersDialog') ordersDialog!: TemplateRef<any>;
  ordersDialogRef: any;
  loading: boolean = false;
  orderDetails: any;
  constructor(
    private dialogRef: MatDialogRef<CheckoutDialogComponent>,
    private repository: RoomsRepository,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService
  ) { }

  ngOnInit(): void {}

  // ── Formats Date to yyyy-MM-ddTHH:mm:ss.mmm ───────────────────────────────
  private formatLocalDateTime(d: Date): string {
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    const hh   = String(d.getHours()).padStart(2, '0');
    const min  = String(d.getMinutes()).padStart(2, '0');
    const ss   = String(d.getSeconds()).padStart(2, '0');
    const ms   = String(d.getMilliseconds()).padStart(3, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}.${ms}`;
  }

  checkout() {
    // ── Set current date & time as actual checkout time ────────────────────
    const now = new Date();
    this.data.checkoutDts = this.formatLocalDateTime(now);

    // ── Settle remaining amount ────────────────────────────────────────────
    this.data.amountPaid      = (this.data?.amountPaid ?? 0) + (this.data?.amountRemaining ?? 0);
    this.data.amountRemaining = 0;
    this.data.discountAmount = this.discountAmount;
    this.data.gstEnabled = this.gstEnabled;
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

  openOrdersDialog() {
    this.getOrders();
    this.ordersDialogRef = this.dialog.open(this.ordersDialog, {
      width: '500px',
      panelClass: 'custom-upload-modalbox',
    });
  }

  getOrders() {
    this.loading = true;
    this.repository.getRoomService(this.data.bookingId).subscribe({
      next: (res) => {
        this.orderDetails = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  get grandTotal(): number {
    return this.orderDetails
      ?.reduce((sum: any, item: { orderValue: any }) => sum + item.orderValue, 0);
  }

}
