import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() { }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(username: string, password: string): boolean {
    if (username && password) {
      localStorage.setItem('authToken', 'dummy-token-' + Date.now());
      localStorage.setItem('username', username);
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }
}
