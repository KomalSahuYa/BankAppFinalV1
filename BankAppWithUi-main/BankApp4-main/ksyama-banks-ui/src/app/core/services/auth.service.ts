import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthRequest } from '../models/auth.model';

export interface User {
  id: number;
  username: string;
  role: 'MANAGER' | 'CLERK';
  token: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private readonly apiUrl = `${environment.apiBaseUrl}/authenticate`;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser') ?? sessionStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: AuthRequest, persist?: boolean): Observable<unknown>;
  login(username: string, password: string): Observable<unknown>;
  login(first: AuthRequest | string, second?: boolean | string): Observable<unknown> {
    const request: AuthRequest =
      typeof first === 'string' ? { username: first, password: String(second ?? '') } : first;
    const persist = typeof first === 'string' ? true : typeof second === 'boolean' ? second : true;

    return this.http.post<any>(this.apiUrl, request).pipe(
      map((response) => {
        if (response?.token) {
          const derivedRole = this.extractRolesFromToken(response.token).includes('MANAGER') ? 'MANAGER' : 'CLERK';
          const user: User = {
            id: Number(response.userId ?? this.extractUserIdFromToken(response.token) ?? 0),
            username: response.username ?? request.username,
            role: (response.role ?? derivedRole) as 'MANAGER' | 'CLERK',
            token: response.token,
            email: response.emailId ?? response.email,
            fullName: response.fullName,
            phoneNumber: response.phoneNumber
          };

          this.storeCurrentUser(user, persist);
          this.currentUserSubject.next(user);
        }
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    void this.router.navigate(['/login']);
  }

  hasRole(role: string): boolean {
    const normalizedRole = role.toUpperCase();
    const user = this.currentUserValue;

    if (!user || !user.token) {
      return false;
    }

    if (user.role.toUpperCase() === normalizedRole) {
      return true;
    }

    return this.extractRolesFromToken(user.token).includes(normalizedRole);
  }

  isManager(): boolean {
    return this.hasRole('MANAGER');
  }

  isClerk(): boolean {
    return this.hasRole('CLERK');
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue && this.isTokenValid();
  }

  isTokenValid(): boolean {
    const user = this.currentUserValue;
    if (!user?.token) {
      return false;
    }

    try {
      const payload = this.decodeJwtPayload(user.token);
      const expirationTime = Number(payload.exp) * 1000;

      return Number.isFinite(expirationTime) && Date.now() < expirationTime;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    return this.isTokenValid() ? this.currentUserValue?.token ?? null : null;
  }

  getUserRole(): string | null {
    return this.currentUserValue?.role ?? null;
  }

  getUserId(): number | null {
    return this.currentUserValue?.id ?? null;
  }

  getUsername(): string {
    return this.currentUserValue?.username ?? '';
  }

  private storeCurrentUser(user: User, persist: boolean): void {
    const serializedUser = JSON.stringify(user);
    if (persist) {
      localStorage.setItem('currentUser', serializedUser);
      sessionStorage.removeItem('currentUser');
      return;
    }

    sessionStorage.setItem('currentUser', serializedUser);
    localStorage.removeItem('currentUser');
  }

  private extractUserIdFromToken(token: string): number | null {
    const payload = this.decodeJwtPayload(token);
    return Number(payload.userId ?? payload.id ?? payload.subId ?? NaN) || null;
  }

  private extractRolesFromToken(token: string): string[] {
    const payload = this.decodeJwtPayload(token);
    const roles = payload.roles ?? payload.authorities ?? [];
    if (!Array.isArray(roles)) {
      return [];
    }

    return roles.map((role: string) => role.replace('ROLE_', '').toUpperCase());
  }

  private decodeJwtPayload(token: string): any {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    const normalizedPayload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(normalizedPayload.padEnd(normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4), '='));
    return JSON.parse(decodedPayload);
  }
}
