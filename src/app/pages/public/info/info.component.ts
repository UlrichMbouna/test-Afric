import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  title = 'Information';
  description = '';

  constructor(private route: ActivatedRoute, private router: Router) {
    const data = this.route.snapshot.data || {};
    this.title = data['title'] ?? this.title;
    this.description = data['description'] ?? this.description;
  }

  goHome(): void {
    this.router.navigateByUrl('/');
  }

  goLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
