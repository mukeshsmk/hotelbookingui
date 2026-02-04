import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean {

    // ✅ Allow if token exists
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // ❌ Block & redirect
    this.router.navigate(['/login']);
    return false;
  }
}
