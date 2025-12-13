import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService   // ✅ inject service
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        if (res['login-status'] === 'Success') {
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error(res.error.errorMsg);
        }
      },
      error: (res) => {
        this.toastr.error(res.error.errorMsg);
      }
    });
  }
}
