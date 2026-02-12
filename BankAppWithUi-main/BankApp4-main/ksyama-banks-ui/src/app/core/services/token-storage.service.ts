import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private token: string | null = null;
  private readonly tokenKey = 'ksyama.jwt';

  constructor() {
    this.token = localStorage.getItem(this.tokenKey) ?? sessionStorage.getItem(this.tokenKey);
  }

  setToken(token: string, persist = true): void {
    this.token = token;
    if (persist) {
      localStorage.setItem(this.tokenKey, token);
      sessionStorage.removeItem(this.tokenKey);
      return;
    }

    sessionStorage.setItem(this.tokenKey, token);
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return this.token;
  }

  clear(): void {
    this.token = null;
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
  }
}
