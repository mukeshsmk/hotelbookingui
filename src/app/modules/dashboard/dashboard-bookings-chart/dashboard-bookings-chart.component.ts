import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, Input } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BookingsRepository } from '../../bookings/bookings-repository';
import { Subscription } from 'rxjs';
import { DashboardRepository } from '../dashboard-repository';

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

    constructor(private repo: DashboardRepository) { }

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
                        backgroundColor: '#27ae6066',
                        borderColor: '#27ae60',
                        borderWidth: 2,
                        borderRadius: 6,
                        borderSkipped: false
                    },
                    {
                        label: 'Check-outs',
                        data: [],
                        backgroundColor: '#e74c3c66',
                        borderColor: '#e74c3c',
                        borderWidth: 2,
                        borderRadius: 6,
                        borderSkipped: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: { size: 13, weight: '500' },
                            usePointStyle: true
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 12 } }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, font: { size: 12 } },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    }
                }
            }
        });
    }

    private loadData() {
        const sub = this.repo.getBarChartData().subscribe({
            next: (res: any) => {
                this.applyChartData(res[0], res[1], res[2]);
            },
            error: () => console.error('Failed to bar char details')
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
