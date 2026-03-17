import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { MockApiService } from './mock-api.service';

@Injectable({ providedIn: 'root' })
export class AccountService {

  constructor(private http: HttpClient, private auth: AuthService, private mockApi: MockApiService) {}

  credit(payload: Record<string, any>): Observable<any> {
    if (environment.mock) {
      return this.mockApi.credit(payload as { amount: number; method?: string; description?: string });
    }
    return this.http.post(this.apiUrl('/account/credit'), payload, this.auth.getAuthOptions());
  }

  debit(payload: Record<string, any>): Observable<any> {
    if (environment.mock) {
      return this.mockApi.debit(payload as { amount: number; method?: string; description?: string });
    }
    return this.http.post(this.apiUrl('/account/debit'), payload, this.auth.getAuthOptions());
  }

  private apiUrl(path: string): string {
    const base = environment.apiUrl.replace(/\/+$/g, '');
    const apiBase = base.endsWith('/api') ? base : `${base}/api`;
    return `${apiBase}${path}`;
  }
}
