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

  onReportTypeChange() {
    const today = new Date();

    // Last month end date
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    if (this.reportType === 'monthly') {

      // Last month start date
      this.fromDate = new Date(
        lastMonthEnd.getFullYear(),
        lastMonthEnd.getMonth(),
        1
      );

      this.toDate = lastMonthEnd;

    } else if (this.reportType === 'quarterly') {

      // Start date = 3 months ago (1st day)
      this.fromDate = new Date(
        lastMonthEnd.getFullYear(),
        lastMonthEnd.getMonth() - 2,
        1
      );

      this.toDate = lastMonthEnd;

    }else if (this.reportType === 'yearly') {

    // ✅ Last 1 year (12 months)
    this.fromDate = new Date(
      lastMonthEnd.getFullYear(),
      lastMonthEnd.getMonth() - 11,
      1
    );

    this.toDate = lastMonthEnd;
  }
  }

}
