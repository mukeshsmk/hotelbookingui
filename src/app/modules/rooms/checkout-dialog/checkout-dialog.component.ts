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

  }
  close() {
    this.dialogRef.close();
  }
}
