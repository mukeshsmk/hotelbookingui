import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [

  // 🔓 Auth (no guard)
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },

  // 🔐 Protected Routes
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module')
        .then(m => m.DashboardModule)
  },
  {
    path: 'rooms',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/rooms/rooms.module')
        .then(m => m.RoomsModule)
  },
  {
    path: 'bookings',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/bookings/bookings.module')
        .then(m => m.BookingsModule)
  },
  {
    path: 'reports',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/reports/reports.module')
        .then(m => m.ReportsModule)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/settings/settings.module')
        .then(m => m.SettingsModule)
  },

  // 🔁 Default redirect
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // 🚫 404 page
  {
    path: '404',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component')
        .then(m => m.NotFoundComponent)
  },

  // 🚨 Wildcard (always LAST)
  {
    path: '**',
    redirectTo: '404'
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
