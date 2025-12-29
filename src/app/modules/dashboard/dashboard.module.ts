import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { MaterialCollectionModule } from 'src/app/shared/material-collection.module';
import { BookingsModule } from '../bookings/bookings.module';
import { DashboardRoomsComponent } from './dashboard-rooms/dashboard-rooms.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardCardComponent,
    DashboardRoomsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialCollectionModule,
    BookingsModule,
  ]
})
export class DashboardModule { }
