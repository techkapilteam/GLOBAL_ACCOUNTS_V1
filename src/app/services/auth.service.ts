import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }

  // Called by LoginComponent after successful POST /api/Accounts/login
  setSession(token: string, username: string, companyCode: string, branchCode: string): void {
    // Store each value individually for easy access anywhere in the app
    sessionStorage.setItem('token',       token);
    sessionStorage.setItem('isLoggedIn',  'true');
    sessionStorage.setItem('username',    username);
    sessionStorage.setItem('companyCode', companyCode);
    sessionStorage.setItem('branchCode',  branchCode);

    // Also keep the combined object for backward compatibility
    sessionStorage.setItem('loggedInUser', JSON.stringify({ username, companyCode, branchCode }));

    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    sessionStorage.clear();
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getToken(): string {
    return sessionStorage.getItem('token') || '';
  }

  getUsername(): string {
    return sessionStorage.getItem('username') || '';
  }

  getCompanyCode(): string {
    return sessionStorage.getItem('companyCode') || '';
  }

  getBranchCode(): string {
    return sessionStorage.getItem('branchCode') || '';
  }

  getLoggedInUser(): { username: string; companyCode: string; branchCode: string } | null {
    const user = sessionStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  }
}