import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}

  goLogin(): void {
    this.router.navigateByUrl('/login');
  }

  goRegister(): void {
    this.router.navigateByUrl('/register');
  }

  goFeatures(): void {
    this.router.navigateByUrl('/features');
  }

  goSecurity(): void {
    this.router.navigateByUrl('/security');
  }

  goPricing(): void {
    this.router.navigateByUrl('/pricing');
  }

  goAbout(): void {
    this.router.navigateByUrl('/about');
  }

  goCards(): void {
    this.router.navigateByUrl('/cards');
  }

  goBusiness(): void {
    this.router.navigateByUrl('/business');
  }

  goBlog(): void {
    this.router.navigateByUrl('/blog');
  }

  goCareers(): void {
    this.router.navigateByUrl('/careers');
  }

  goPress(): void {
    this.router.navigateByUrl('/press');
  }

  goPrivacy(): void {
    this.router.navigateByUrl('/privacy');
  }

  goTerms(): void {
    this.router.navigateByUrl('/terms');
  }

  goCookies(): void {
    this.router.navigateByUrl('/cookies');
  }

  goLicense(): void {
    this.router.navigateByUrl('/license');
  }

  goHelp(): void {
    this.router.navigateByUrl('/help');
  }

  goContact(): void {
    this.router.navigateByUrl('/contact');
  }
}
