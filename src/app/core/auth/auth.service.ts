import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  id: string;
  userName: string;
  email: string;
  token: string;
  role: string;
  tenantId: number;
  name: string;
  surname: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'super_admin_token';
  
  private authStatusSubject = new BehaviorSubject<boolean>(this.hasToken());
  public authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('username', email);
    body.set('password', password);
    body.set('scope', 'openid profile email api');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<any>(`${this.apiUrl}/connect/token`, body.toString(), { headers }).pipe(
      tap(res => {
        if (res.access_token) {
          this.setToken(res.access_token);
          this.authStatusSubject.next(true);
        }
      }),
      catchError(err => {
        console.error('Login error', err);
        return throwError(() => err);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.authStatusSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
}
