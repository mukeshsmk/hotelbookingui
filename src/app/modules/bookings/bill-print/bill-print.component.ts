import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomsRepository } from '../../rooms/rooms-repository';

@Component({
  selector: 'app-bill-print',
  templateUrl: './bill-print.component.html',
  styleUrls: ['./bill-print.component.scss']
})
export class BillPrintComponent implements OnInit {
  @ViewChild('billTemplate') billTemplate!: any;
  today = new Date();
  billData: any;
  constructor(
    private route: ActivatedRoute,
    private repo: RoomsRepository
  ) { }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.repo.getBookingDetails(id).subscribe(b => {
      this.billData = b;
      setTimeout(() => window.print(), 300);
    });
  }

  printBill(booking: any) {
    console.log('Printing bill for booking:', booking);
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
                width: 210mm;
                /* A4 width */
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
