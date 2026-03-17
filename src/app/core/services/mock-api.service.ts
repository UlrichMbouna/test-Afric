import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string;
  accountNumber: string;
  balance: number;
}

interface MockTransaction {
  id: number;
  userId: number;
  date: string;
  title: string;
  subtitle: string;
  amount: number;
  status: 'Complété' | 'En cours';
}

interface MockDb {
  users: MockUser[];
  transactions: MockTransaction[];
}

@Injectable({ providedIn: 'root' })
export class MockApiService {
  private cache?: MockDb;
  private readonly dbStorageKey = 'mock_db';
  private readonly currentUserKey = 'mock_current_user';

  constructor(private http: HttpClient) {}

  loadDb(): Observable<MockDb> {
    if (this.cache) {
      return of(this.cache);
    }

    const stored = this.getStoredDb();
    if (stored) {
      this.cache = stored;
      return of(stored);
    }

    return this.http.get<MockDb>(environment.mockDbUrl).pipe(
      tap((db) => {
        this.cache = db;
        this.storeDb(db);
      })
    );
  }

  login(email: string, password: string): Observable<{ status: string; data: { token: string } }> {
    return this.loadDb().pipe(
      map((db) => {
        const user = db.users.find((u) => u.email === email && u.password === password);
        if (!user) {
          throw new Error('Email ou mot de passe incorrect.');
        }
        this.setCurrentUser(user);
        return { status: 'success', data: { token: 'mock-token' } };
      }),
      delay(300)
    );
  }

  register(name: string, email: string, password: string): Observable<{ status: string; data: any }> {
    return this.loadDb().pipe(
      map((db) => {
        if (db.users.some((u) => u.email === email)) {
          throw new Error('Cet email est déjà utilisé.');
        }
        const newUser: MockUser = {
          id: this.nextId(db.users.map((u) => u.id)),
          name,
          email,
          password,
          accountNumber: 'FR76 3000 6000 0112 0000 0000 000',
          balance: 0
        };
        db.users.push(newUser);
        this.persistDb(db);
        return { status: 'success', data: { id: newUser.id } };
      }),
      delay(300)
    );
  }

  getCurrentUser(): Observable<MockUser | null> {
    const user = this.getCurrentUserStored();
    return of(user).pipe(delay(150));
  }

  getTransactions(): Observable<MockTransaction[]> {
    return this.loadDb().pipe(
      map((db) => {
        const user = this.getCurrentUserStored();
        if (!user) {
          return [];
        }
        return db.transactions.filter((tx) => tx.userId === user.id);
      }),
      delay(200)
    );
  }

  credit(payload: { amount: number; method?: string; description?: string }): Observable<any> {
    return this.applyTransaction(payload.amount, payload.description || payload.method || 'Crédit');
  }

  debit(payload: { amount: number; method?: string; description?: string }): Observable<any> {
    return this.applyTransaction(-Math.abs(payload.amount), payload.description || payload.method || 'Débit');
  }

  private applyTransaction(amount: number, label: string): Observable<any> {
    return this.loadDb().pipe(
      map((db) => {
        const user = this.getCurrentUserStored();
        if (!user) {
          throw new Error('Utilisateur non connecté.');
        }
        const userRef = db.users.find((u) => u.id === user.id);
        if (!userRef) {
          throw new Error('Utilisateur introuvable.');
        }
        userRef.balance += amount;
        const tx: MockTransaction = {
          id: this.nextId(db.transactions.map((t) => t.id)),
          userId: userRef.id,
          date: new Date().toISOString().slice(0, 10),
          title: amount >= 0 ? 'Crédit du compte' : 'Débit du compte',
          subtitle: label,
          amount,
          status: 'En cours'
        };
        db.transactions.unshift(tx);
        this.persistDb(db);
        this.setCurrentUser(userRef);
        return { status: 'success', data: tx };
      }),
      delay(300)
    );
  }

  private nextId(values: number[]): number {
    return values.length ? Math.max(...values) + 1 : 1;
  }

  private getStoredDb(): MockDb | null {
    try {
      const raw = window.localStorage.getItem(this.dbStorageKey);
      return raw ? (JSON.parse(raw) as MockDb) : null;
    } catch {
      return null;
    }
  }

  private storeDb(db: MockDb): void {
    window.localStorage.setItem(this.dbStorageKey, JSON.stringify(db));
  }

  private persistDb(db: MockDb): void {
    this.cache = db;
    this.storeDb(db);
  }

  private setCurrentUser(user: MockUser): void {
    window.localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  private getCurrentUserStored(): MockUser | null {
    try {
      const raw = window.localStorage.getItem(this.currentUserKey);
      return raw ? (JSON.parse(raw) as MockUser) : null;
    } catch {
      return null;
    }
  }
}
