import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  remember = true;
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.email || !this.password || this.loading) {
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.auth.fetchCurrentUser().subscribe({
          next: () => {
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
          },
          error: () => {
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
          }
        });
      },
      error: (err) => {
        this.loading = false;
        const message = err?.error?.message || err?.message || 'Connexion impossible.';
        this.errorMessage = message;
      }
    });
  }

  goHome(): void {
    this.router.navigateByUrl('/');
  }

  goRegister(): void {
    this.router.navigateByUrl('/register');
  }

  goForgotPassword(): void {
    this.router.navigateByUrl('/forgot-password');
  }

  goPrivacy(): void {
    this.router.navigateByUrl('/privacy');
  }

  goTerms(): void {
    this.router.navigateByUrl('/terms');
  }

  goHelp(): void {
    this.router.navigateByUrl('/help');
  }

  loginWithGoogle(): void {
    this.errorMessage = 'Connexion Google non configurée.';
  }

  loginWithApple(): void {
    this.errorMessage = 'Connexion Apple non configurée.';
  }
}
