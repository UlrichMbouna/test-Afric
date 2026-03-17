import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptedTerms = false;
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loading) {
      return;
    }

    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (!this.acceptedTerms) {
      this.errorMessage = 'Vous devez accepter les conditions.';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.loading = false;
        const message = err?.error?.message || err?.message || 'Création de compte impossible.';
        this.errorMessage = message;
      }
    });
  }

  goLogin(): void {
    this.router.navigateByUrl('/login');
  }

  goHome(): void {
    this.router.navigateByUrl('/');
  }

  goHelp(): void {
    this.router.navigateByUrl('/help');
  }

  goPrivacy(): void {
    this.router.navigateByUrl('/privacy');
  }

  goTerms(): void {
    this.router.navigateByUrl('/terms');
  }
}
