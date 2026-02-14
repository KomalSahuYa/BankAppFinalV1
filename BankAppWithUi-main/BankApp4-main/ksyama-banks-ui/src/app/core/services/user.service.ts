import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  username: string;
  role: 'MANAGER' | 'CLERK';
  email?: string;
  phoneNumber?: string;
  aadhaarNumber?: string;
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

  createUser(userData: any): Observable<User> { return this.http.post<User>(`${this.apiUrl}`, userData); }
  getAllUsers(): Observable<User[]> { return this.http.get<User[]>(`${this.apiUrl}`); }
  getAllClerks(): Observable<User[]> { return this.http.get<User[]>(`${this.apiUrl}?role=CLERK`); }
  getActiveClerks(): Observable<User[]> { return this.http.get<User[]>(`${this.apiUrl}?role=CLERK&active=true`); }
  updateUser(id: number, userData: any): Observable<User> { return this.http.put<User>(`${this.apiUrl}/${id}`, userData); }
  deactivateUser(id: number): Observable<void> { return this.http.put<void>(`${this.apiUrl}/${id}/deactivate`, {}); }

  checkUsernameExists(username: string): Observable<boolean> {
    const params = new HttpParams().set('username', username);
    return this.http.get<boolean>(`${this.apiUrl}/check-username`, { params });
  }

  checkEmailExists(emailId: string): Observable<boolean> {
    const params = new HttpParams().set('emailId', emailId);
    return this.http.get<boolean>(`${this.apiUrl}/check-email`, { params });
  }

  checkPhoneExists(phoneNumber: string): Observable<boolean> {
    const params = new HttpParams().set('phoneNumber', phoneNumber);
    return this.http.get<boolean>(`${this.apiUrl}/check-phone`, { params });
  }
}
