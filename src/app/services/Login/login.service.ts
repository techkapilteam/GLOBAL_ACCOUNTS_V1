


import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class LoginService {
    logindetails: any;
    islogin:boolean=false

    constructor(private router: Router, private _commonservice: CommonService) { }

    LoginUser(formData:any) {
        
        return this._commonservice.postAPI('/login', formData)
    }
    LoginUsercheckdata(formData:any) {
      
      return this._commonservice.postAPI('/checklogin', formData)
  }
    checklogin(formData:any): Promise<any> {
      
      return this._commonservice.postAPI('/checklogin', formData).toPromise();
  }
    _getUser() {
        // return JSON.parse(sessionStorage.getItem('currentUser'));
        return JSON.parse('');
    }
    getuseridname() {
        let usrid;
        // this.logindetails=  JSON.parse(sessionStorage.getItem('currentUser'));
        this.logindetails=  JSON.parse('');
        usrid=this.logindetails.pUserName;
        return usrid;
      }
    
    
      getpContactRefID() {
        let prefid;
        // this.logindetails=  JSON.parse(sessionStorage.getItem('currentUser'));
        this.logindetails=  JSON.parse('');
        prefid=this.logindetails.pContactRefID;
        return prefid;
      }
    
      getContactnumber() {
        let contact;
        // this.logindetails=  JSON.parse(sessionStorage.getItem('currentUser'));
        this.logindetails=  JSON.parse('');
        contact=this.logindetails.contactno;
        return contact;
      }
    
      getEmployeeName() {
        let empname;
        // this.logindetails=  JSON.parse(sessionStorage.getItem('currentUser'));
        this.logindetails=  JSON.parse('');
        empname=this.logindetails.pUserName;
        return empname;
      }

      CheckPassword(formData:any) {
        debugger;
        return this._commonservice.postAPI('/checkpassword', formData)
    }
    _getUserWiseForms(roleId:any, userId:any, branchId:any) {
        debugger
        const params = new HttpParams().set('roleId', roleId).set('userId', userId).set('branchId', branchId);
        return this._commonservice.getAPI('/Settings/Users/UserRights/GetUserForms', params, 'YES')
    }
    Logout() {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem("LoginUserid");
        sessionStorage.removeItem('UFM');
        sessionStorage.removeItem("ipaddress");
        sessionStorage.removeItem('schemaname');
        sessionStorage.removeItem('branchname');
        sessionStorage.removeItem('branchId');
        sessionStorage.removeItem("currencyformat");
        sessionStorage.removeItem("dateformat");
        sessionStorage.removeItem('companydetails');
        sessionStorage.removeItem('RecentTabs');
        sessionStorage.removeItem('RecentTabShow'); 
        sessionStorage.removeItem('Dbtime');
        sessionStorage.removeItem('pkgmsstart_time');
        sessionStorage.removeItem('pkgmsend_time');
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/']);
    }
    _getRoles() {
      
        return sessionStorage.getItem('UFM');
    }
}