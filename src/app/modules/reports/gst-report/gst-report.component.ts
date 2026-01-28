import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ReportRepository } from '../report-repository';

@Component({
  selector: 'app-gst-report',
  templateUrl: './gst-report.component.html',
  styleUrls: ['./gst-report.component.scss']
})
export class GstReportComponent {

  reportType: 'monthly' | 'quarterly' | 'yearly' | null = null;
  fromDate!: Date | null;
  toDate!: Date | null;
  grandTotals = {
    basePrice: 0,
    gst: 0,
    sgst: 0,
    total: 0
  };
  reportData: any;
  constructor(private datePipe: DatePipe, private titleCasePipe: TitleCasePipe, private repo: ReportRepository) { }
  loadReport() {
    this.repo.getBillingDetails(this.fromDate, this.toDate).subscribe((data: any) => {
      this.reportData = data;
    });
    this.calculateGrandTotal(this.reportData)
  }

  calculateGrandTotal(rows: any[]) {
    this.grandTotals = rows.reduce(
      (acc, row) => {
        acc.basePrice += row.basePrice || 0;
        acc.gst += row.gst || 0;
        acc.sgst += row.sgst || 0;
        acc.total += row.total || 0;
        return acc;
      },
      { basePrice: 0, gst: 0, sgst: 0, total: 0 }
    );
  }

  resetFilters() {
    this.reportType = null;
    this.fromDate = null;
    this.toDate = null;
    this.reportData = [];
  }

  get isGenerateDisabled(): boolean {
    return !this.reportType;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // yyyy-mm-dd
  }
  printReport() {
    const printContent = document.getElementById('print-section')!.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
    <html>
      <head>
        <title>GST Report</title>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `;

    window.print();
    document.body.innerHTML = originalContent;
    location.reload(); // restore Angular view
  }

  get reportTitle(): string {
    if (this.reportType) {
      return `GST Report : ${this.titleCasePipe.transform(this.reportType)}`;
    }

    const from = this.fromDate
      ? this.datePipe.transform(this.fromDate, 'dd-MM-yyyy')
      : null;
    const to = this.toDate
      ? this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
      : null;

    if (from && to) return `GST Report (${from} - ${to})`;
    if (from) return `GST Report (From ${from})`;
    if (to) return `GST Report (Till ${to})`;

    return 'GST Report';
  }


}
