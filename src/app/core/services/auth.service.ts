import { Injectable } from "@angular/core";
import { User } from '../model/user.model';
import { BehaviorSubject, catchError, finalize, map, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../model/core.model';
import { environment } from '../../../environments/environment';
import { MockApiService } from './mock-api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  readonly currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private readonly requestOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }),
    withCredentials: true,
  };

  private readonly tokenKey = environment.tokenKey;

  constructor(
    private http: HttpClient,
    private router: Router,
    private mockApi: MockApiService
  ) { }


  register(data: RegisterRequest): Observable<RegisterResponse> {
    if (environment.mock) {
      return this.mockApi.register(data.name, data.email, data.password).pipe(
        catchError((err) => throwError(() => new Error(err.message || 'Inscription impossible.')))
      );
    }
    return this.http.post<RegisterResponse>(this.apiUrl('/register'), data, this.requestOptions);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    if (environment.mock) {
      return this.mockApi.login(data.email, data.password).pipe(
        tap((response) => {
          const token = this.extractToken(response);
          if (token) {
            this.setToken(token);
          }
        })
      );
    }

    return this.http.post<LoginResponse>(this.apiUrl('/login'), {
      ...data,
      timezone:   Intl.DateTimeFormat().resolvedOptions().timeZone, // ex: "Africa/Douala"
      screenSize: `${window.screen.width}x${window.screen.height}`, // ex: "1920x1080"
      language:   navigator.language,
    }, this.requestOptions).pipe(
      tap((response) => {
        const token = this.extractToken(response);
        if (token) {
          this.setToken(token);
        }
      }),
    );

  }

  logout(): Observable<any> {
    if (environment.mock) {
      this.clearToken();
      this.currentUserSubject.next(null);
      return of({ status: 'success' });
    }
    return this.http.get(this.apiUrl('/logout'), this.getAuthOptions()).pipe(
      finalize(() => this.clearToken()),
    );
  }

  logoutAndRedirect(redirectTo = '/auth/login', queryParams?: Record<string, string>): void {
    this.currentUserSubject.next(null);
    this.logout().pipe(
      catchError(() => of(null)),
      finalize(() => {
        if (queryParams && Object.keys(queryParams).length > 0) {
          const params = new URLSearchParams(queryParams).toString();
          this.router.navigateByUrl(`${redirectTo}?${params}`);
        } else {
          this.router.navigateByUrl(redirectTo);
        }
      }),
    ).subscribe();
  }

  fetchCurrentUser(): Observable<User | null> {
    if (environment.mock) {
      return this.mockApi.getCurrentUser().pipe(
        map((user) => (user ? this.mapMockUser(user) : null)),
        tap((user) => this.currentUserSubject.next(user)),
        catchError(() => {
          this.currentUserSubject.next(null);
          return of(null);
        })
      );
    }

    return this.http.get<{ status: string; data: User }>(
      this.apiUrl('/user'),
      this.getAuthOptions(),
    ).pipe(
      map((response) => response.data),
      tap((user) => this.currentUserSubject.next(user)),
      catchError(() => {
        this.currentUserSubject.next(null);
        return of(null);
      }),
    );
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getAuthOptions(): { headers: HttpHeaders; withCredentials: true } {
    return {
      headers: this.buildAuthHeaders(),
      withCredentials: true,
    };
  }

  setToken(token: string): void {
    const storage = this.getStorage();
    storage?.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    const storage = this.getStorage();
    return storage?.getItem(this.tokenKey) ?? null;
  }

  clearToken(): void {
    const storage = this.getStorage();
    storage?.removeItem(this.tokenKey);
  }

  private apiUrl(path: string): string {
    const base = environment.apiUrl.replace(/\/+$/g, '');
    const apiBase = base.endsWith('/api') ? base : `${base}/api`;
    return `${apiBase}${path}`;
  }

  private buildAuthHeaders(): HttpHeaders {
    let headers = this.requestOptions.headers;
    const token = this.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private extractToken(response: LoginResponse | null | undefined): string | null {
    const anyResponse: any = response ?? {};
    return (
      anyResponse?.data?.token ??
      anyResponse?.data?.accessToken ??
      anyResponse?.token ??
      anyResponse?.accessToken ??
      null
    );
  }

  private mapMockUser(user: { id: number; email: string; name: string; password: string }): User {
    const now = new Date().toISOString();
    return {
      id: String(user.id),
      email: user.email,
      name: user.name,
      password: user.password,
      createdAt: now,
      updatedAt: now,
      createdBy: 'mock',
      updatedBy: 'mock'
    };
  }

  private getStorage(): Storage | null {
    return typeof window !== 'undefined' ? window.localStorage : null;
  }


}
