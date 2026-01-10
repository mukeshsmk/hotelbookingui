import { Component } from '@angular/core';
import { DashboardRepository } from './dashboard-repository';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  cardDetails: any;
  barChartDetails: any;
  constructor(private repo: DashboardRepository) { }

  ngOnInit() {
    this.fetchCardDetails();
  }

  fetchCardDetails() {
    this.repo.getCardDetails().subscribe({
      next: (res) => {
        this.cardDetails = res;
      },
      error: () => console.error('Failed to load Card Details')
    });
  }
}
