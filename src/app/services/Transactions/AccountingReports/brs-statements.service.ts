
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CommonService } from '../../common.service';

@Injectable({
  providedIn: 'root'
})
export class BRSStatementsService {

  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetBrStatementReportbyDates(fromdate: string | number | boolean,pBankAccountId: string | number | boolean): Observable<any> {

      let params = new HttpParams().set('fromdate', fromdate).set('_pBankAccountId', pBankAccountId).set('BranchSchema', this._CommonService.getschemaname());
      return this._CommonService.getAPI('/Accounting/AccountingReports/GetBrs', params, 'YES') .pipe(
        catchError((e:any) => {
          this._CommonService.showErrorMessage(e);
          return throwError(() => e);
        })
      );
  }
  GetBrStatementReportbyDatesChequesInfo(fromdate: string | number | boolean,todate: string | number | boolean,pBankAccountId: string | number | boolean): Observable<any> {

      
      const params = new HttpParams().set('fromdate', fromdate).set('todate', todate).set('_pBankAccountId', pBankAccountId).set('BranchSchema', this._CommonService.getschemaname());
      return this._CommonService.getAPI('/Accounting/AccountingReports/GetBrStatementReportbyDatesChequesInfo', params, 'YES') .pipe(
        catchError((e:any) => {
          this._CommonService.showErrorMessage(e);
          return throwError(() => e);
        })
      );
  }
  GetBRSBankbalance(fromdate: string | number | boolean,pBankAccountId: string | number | boolean): Observable<any> {
    
      const params = new HttpParams().set('fromdate', fromdate).set('_pBankAccountId', pBankAccountId).set('BranchSchema', this._CommonService.getschemaname());
      return this._CommonService.getAPI('/Accounting/AccountingReports/GetBrsBankBalance', params, 'YES') .pipe(
        catchError((e:any) => {
          this._CommonService.showErrorMessage(e);
          return throwError(() => e);
        })
      );
  }
  
  Getbrscount(brsdate: string | number | boolean,_pBankAccountId: string | number | boolean,BranchSchema: string | number | boolean): Observable<any> {
   
      const params = new HttpParams().set('brsdate', brsdate).set('_pBankAccountId', _pBankAccountId).set('BranchSchema', BranchSchema);
      return this._CommonService.getAPI('/Accounting/AccountingReports/Getbrscount', params, 'YES') .pipe(
        catchError((e:any) => {
          this._CommonService.showErrorMessage(e);
          return throwError(() => e);
        })
      );
  }
  saveBRS(brsData:any) {
    
    return this._CommonService.postAPI('/Accounting/AccountingReports/SaveBrs', brsData)
  }
}
