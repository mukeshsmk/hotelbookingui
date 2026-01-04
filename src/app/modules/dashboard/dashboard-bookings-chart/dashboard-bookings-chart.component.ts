import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BookingsRepository } from '../../bookings/bookings-repository';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
    selector: 'app-dashboard-bookings-chart',
    templateUrl: './dashboard-bookings-chart.component.html',
    styleUrls: ['./dashboard-bookings-chart.component.scss']
})
export class DashboardBookingsChartComponent implements AfterViewInit, OnDestroy {

    @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
    chart?: Chart<'bar', number[], string>;
    subs: Subscription[] = [];

    @Input() useSample = true;

    private samplePayload = {
        labels: ['29-12', '30-12', '31-12', '01-01', '02-01', '03-01', '04-01'],
        checkins: [2, 1, 3, 0, 2, 4, 1],
        checkouts: [1, 0, 2, 1, 3, 1, 0]
    };

    constructor(private bookingsRepo: BookingsRepository) { }

    ngAfterViewInit(): void {
        this.initChart();
        this.loadData();
    }

    private initChart() {
        const ctx = this.canvas.nativeElement.getContext('2d')!;
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Check-ins',
                        data: [],
                        backgroundColor: '#27ae6070',
                        borderColor: '#27ae60',
                        borderWidth: 2
                    },
                    {
                        label: 'Check-outs',
                        data: [],
                        backgroundColor: '#e73c3c57',
                        borderColor: '#e74c3c',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: true, position: 'bottom' } },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    }

    private loadData() {
        const sub = this.bookingsRepo.getBookingList().subscribe({
            next: (res: any[]) => {
                const sample = {
                    labels: ['29-12-2025', '30-12-2025', '31-12-2025', '01-01-2026', '02-01-2026', '03-01-2026', '04-01-2026'],
                    checkins: [2, 1, 3, 1, 2, 4, 1],
                    checkouts: [1, 11, 2, 2, 3, 1, 7]
                };

                this.applyChartData(sample.labels, sample.checkins, sample.checkouts);
            },
            error: () => {
                // fallback sample if API fails
                this.applyChartData(
                    this.samplePayload.labels,
                    this.samplePayload.checkins,
                    this.samplePayload.checkouts
                );
            }
        });

        this.subs.push(sub);
    }

    private applyChartData(labels: string[], checkins: number[], checkouts: number[]) {
        if (!this.chart) return;

        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = checkins;
        this.chart.data.datasets[1].data = checkouts;

        this.chart.update();
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
        this.chart?.destroy();
    }
}
