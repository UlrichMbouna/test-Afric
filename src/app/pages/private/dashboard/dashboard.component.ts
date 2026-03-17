import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { AccountService } from '../../../core/services/account.service';
import { MockApiService } from '../../../core/services/mock-api.service';
import { environment } from '../../../../environments/environment';

interface TransactionItem {
  date: string;
  title: string;
  subtitle: string;
  amount: number;
  status: 'Complété' | 'En cours';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  userName = 'Jean Dupont';
  accountNumberMasked = 'FR76 ... 1234';
  availableBalance = '12,450.00 €';
  userInitials = 'JD';

  mode: 'credit' | 'debit' = 'credit';
  amount: number | null = null;
  paymentMethod = 'Virement Bancaire (Instant)';
  description = '';
  loading = false;
  errorMessage = '';

  transactions: TransactionItem[] = [];

  private userSub?: Subscription;

  constructor(
    private auth: AuthService,
    private account: AccountService,
    private mockApi: MockApiService
  ) {}

  ngOnInit(): void {
    this.userSub = this.auth.currentUser$.subscribe((user) => {
      if (!user) {
        return;
      }
      this.userName = user.name || this.userName;
      this.userInitials = this.buildInitials(this.userName);
      const accountNumber = (user as any)?.accountNumber as string | undefined;
      if (accountNumber) {
        this.accountNumberMasked = this.maskAccountNumber(accountNumber);
      }
      const balance = (user as any)?.balance as number | undefined;
      if (typeof balance === 'number') {
        this.availableBalance = this.formatCurrency(balance);
      }
    });

    if (environment.mock) {
      this.mockApi.getTransactions().subscribe((tx) => {
        this.transactions = tx.map((t) => ({
          date: this.formatDate(t.date),
          title: t.title,
          subtitle: t.subtitle,
          amount: t.amount,
          status: t.status
        }));
      });
    }
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  setMode(mode: 'credit' | 'debit'): void {
    this.mode = mode;
  }

  submitTransaction(): void {
    if (this.loading) {
      return;
    }

    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Veuillez entrer un montant valide.';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    const payload = {
      amount: this.amount,
      method: this.paymentMethod,
      description: this.description
    };

    const request$ = this.mode === 'credit' ? this.account.credit(payload) : this.account.debit(payload);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.pushTransaction();
        this.resetForm();
      },
      error: (err) => {
        this.loading = false;
        const message = err?.error?.message || err?.message || 'Transaction impossible.';
        this.errorMessage = message;
      }
    });
  }

  private pushTransaction(): void {
    const sign = this.mode === 'credit' ? 1 : -1;
    const now = new Date();
    const date = now.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    this.transactions = [
      {
        date,
        title: this.mode === 'credit' ? 'Crédit du compte' : 'Débit du compte',
        subtitle: this.description || this.paymentMethod,
        amount: sign * (this.amount ?? 0),
        status: 'En cours'
      },
      ...this.transactions
    ];
  }

  private resetForm(): void {
    this.amount = null;
    this.description = '';
  }

  private buildInitials(name: string): string {
    const parts = name.split(' ').filter(Boolean);
    const initials = parts.slice(0, 2).map((part) => part[0].toUpperCase());
    return initials.join('') || 'JD';
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  }

  private maskAccountNumber(accountNumber: string): string {
    const trimmed = accountNumber.replace(/\s+/g, '');
    if (trimmed.length < 6) {
      return accountNumber;
    }
    return `${trimmed.slice(0, 4)} ... ${trimmed.slice(-4)}`;
  }

  private formatDate(date: string): string {
    const parsed = new Date(date);
    return parsed.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }
}
