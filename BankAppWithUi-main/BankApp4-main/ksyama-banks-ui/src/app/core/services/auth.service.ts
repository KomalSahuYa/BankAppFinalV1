import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { environment } from '../../../environments/environment';
import { AuthRequest, AuthResponse, JwtPayload } from '../models/auth.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authUrl = `${environment.apiBaseUrl}/authenticate`;
  private readonly userState$ = new BehaviorSubject<JwtPayload | null>(this.decodeStoredToken());

  constructor(
    private readonly http: HttpClient,
    private readonly tokenStorage: TokenStorageService
  ) {}

  login(request: AuthRequest, persist = true): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authUrl, request).pipe(
      tap((res) => {
        const payload = this.decodeToken(res.token);

        if (!payload || this.isExpired(payload)) {
          this.logout();
          return;
        }

        this.tokenStorage.setToken(res.token, persist);
        this.userState$.next(payload);
      })
    );
  }

  logout(): void {
    this.tokenStorage.clear();
    this.userState$.next(null);
  }

  getToken(): string | null {
    const token = this.tokenStorage.getToken();

    if (!token) {
      return null;
    }

    const payload = this.decodeToken(token);

    if (!payload || this.isExpired(payload)) {
      this.logout();
      return null;
    }

    if (!this.userState$.value) {
      this.userState$.next(payload);
    }

    return token;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getRoles(): string[] {
    return this.userState$.value?.roles ?? [];
  }

  hasRole(role: 'CLERK' | 'MANAGER'): boolean {
    const expectedRole = role.toUpperCase();

    return this.getRoles().some((currentRole) => {
      const normalized = currentRole.replace('ROLE_', '').toUpperCase();
      return normalized === expectedRole;
    });
  }

  getUsername(): string {
    return this.userState$.value?.sub ?? '';
  }

  private decodeStoredToken(): JwtPayload | null {
    const token = this.tokenStorage.getToken();

    if (!token) {
      return null;
    }

    const payload = this.decodeToken(token);

    if (!payload || this.isExpired(payload)) {
      this.tokenStorage.clear();
      return null;
    }

    return payload;
  }

  private isExpired(payload: JwtPayload): boolean {
    return payload.exp * 1000 <= Date.now();
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }
}
