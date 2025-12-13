import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthRepository } from './auth-repository';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private authRepo: AuthRepository,
        private router: Router
    ) { }

    login(username: string, password: string) {
        return this.authRepo.login(username, password).pipe(
            tap((res: any) => {
                if (res['login-status'] === 'Success') {
                    localStorage.setItem('token', 'logged-in');   // dummy token
                    localStorage.setItem('user', JSON.stringify(res.userObj));
                }
            })
        );
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    getUserName(): string {
        const user = this.getUser();
        return user ? `${user.firstName} ${user.lastName}` : '';
    }
}
