import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  logindetails: any;
  islogin: boolean = false;

  constructor(private router: Router, private _commonservice: CommonService) {}

  // ── Auth API calls ────────────────────────────────────────────────────────

  LoginUser(formData: any) {
    return this._commonservice.postAPI('/login', formData);
  }

  LoginUsercheckdata(formData: any) {
    return this._commonservice.postAPI('/checklogin', formData);
  }

  checklogin(formData: any): Promise<any> {
    return this._commonservice.postAPI('/checklogin', formData).toPromise();
  }

  CheckPassword(formData: any) {
    return this._commonservice.postAPI('/checkpassword', formData);
  }

  // ── Session Getters (reads from sessionStorage) ───────────────────────────

  _getUser(): any {
    const data = sessionStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  getuseridname(): string {
    this.logindetails = this._getUser();
    return this.logindetails?.pUserName ?? '';
  }

  getpContactRefID(): string {
    this.logindetails = this._getUser();
    return this.logindetails?.pContactRefID ?? '';
  }

  getContactnumber(): string {
    this.logindetails = this._getUser();
    return this.logindetails?.contactno ?? '';
  }

  getEmployeeName(): string {
    this.logindetails = this._getUser();
    return this.logindetails?.pUserName ?? '';
  }

  _getRoles(): string | null {
    return sessionStorage.getItem('UFM');
  }

  // ── User Rights ───────────────────────────────────────────────────────────

  _getUserWiseForms(roleId: any, userId: any, branchId: any) {
    const params = new HttpParams()
      .set('roleId', roleId)
      .set('userId', userId)
      .set('branchId', branchId);
    return this._commonservice.getAPI('/Settings/Users/UserRights/GetUserForms', params, 'YES');
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  Logout(): void {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/']);
  }
}