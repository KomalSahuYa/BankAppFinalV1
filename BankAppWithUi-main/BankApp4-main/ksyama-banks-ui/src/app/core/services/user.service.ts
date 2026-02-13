import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  username: string;
  role: 'MANAGER' | 'CLERK';
  email?: string;
  fullName?: string;
  createdAt?: Date;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiBaseUrl}/employees`;

  constructor(private readonly http: HttpClient) {}

  createUser(userData: any): Observable<User> { return this.http.post<User>(this.apiUrl, userData); }
  getAllUsers(): Observable<User[]> { return this.http.get<User[]>(this.apiUrl); }

  getAllClerks(): Observable<User[]> {
    return this.getAllUsers().pipe(map((users) => users.filter((user) => user.role === 'CLERK')));
  }

  getActiveClerks(): Observable<User[]> {
    // API currently returns active employees only.
    return this.getAllClerks();
  }

  updateUser(id: number, userData: any): Observable<User> { return this.http.put<User>(`${this.apiUrl}/${id}`, userData); }
  deactivateUser(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.getAllUsers().pipe(map((users) => users.some((user) => user.username === username)));
  }
}
