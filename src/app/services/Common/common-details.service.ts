
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { CommonService } from '../common.service';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CompanyDetailsService {

 

//   constructor(private http: HttpClient, private _CommonService: CommonService) { }

//   GetCompanyData(): Observable<any> {
//     try {
//      debugger;
//       const params = new HttpParams().set('LocalSchema', this._CommonService.getschemaname());
//       return this._CommonService.getAPI('/Common/GetcompanyNameandaddressDetails', params, 'YES');
//     }
//     catch (e) {
//       this._CommonService.showErrorMessage(e);
//     }
//   }

//   SaveTextData(data){
//     debugger;
//     return this._CommonService.postAPI1("/Common/SaveTextData",data);
//   }
// }
