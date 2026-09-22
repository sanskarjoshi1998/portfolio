import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest } from '../models/auth.model';

const TOKEN_KEY = 'portfolio_admin_token';
const USERNAME_KEY = 'portfolio_admin_username';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Reactive signal so the navbar/guards can react to login state changes instantly
  isAuthenticated = signal<boolean>(this.hasValidToken());

  constructor(private http: HttpClient) {}

  /** Username/password login -> backend returns a JWT */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => this.setSession(response))
    );
  }

  /** Redirects the browser to the backend's Google OAuth2 entry point */
  loginWithGoogle(): void {
    window.location.href = environment.oauth2GoogleLoginUrl;
  }

  /** Called by the OAuth2 redirect component once it reads ?token=... from the URL */
  setTokenFromOAuth2(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.isAuthenticated.set(true);
  }

  private setSession(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USERNAME_KEY, response.username);
    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(USERNAME_KEY);
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryMs = payload.exp * 1000;
      return Date.now() < expiryMs;
    } catch {
      return false;
    }
  }
}
