
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyDetailsService {

 

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetCompanyData(): Observable<any> {
   
     
      let params = new HttpParams().set('LocalSchema', this._CommonService.getschemaname());
      return this._CommonService.getAPI('/Common/GetcompanyNameandaddressDetails', params, 'YES') .pipe(
        catchError((e:any) => {
          this._CommonService.showErrorMessage(e);
          return throwError(() => e);
        })
      );
  }

  SaveTextData(data:any){
    debugger;
    return this._CommonService.postAPI1("/Common/SaveTextData",data);
  }
}
