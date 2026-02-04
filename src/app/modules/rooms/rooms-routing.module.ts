import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomsComponent } from './rooms.component';
import { RoomCardsComponent } from './room-cards/room-cards.component';
import { RoomDetailsComponent } from './room-details/room-details.component';

const routes: Routes = [
  { path: '', component: RoomCardsComponent },
  { path: 'room', component: RoomsComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomsRoutingModule { }
