
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonService } from '../../common.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankBookService {
  GetBankEntriesDetails(fromdate: string, todate: string, pbankname: any) {
    throw new Error('Method not implemented.');
  }


  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  //   GetBankNames():Observable<any> {
  //     try {

  //  const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname());
  //       return this._CommonService.getAPI('/Accounting/AccountingReports/GetBankNames', params, 'YES');
  //     }
  //     catch (e:any) {
  //        this._CommonService.showErrorMessage(e);
  //     }
  //   }

  GetBankNames(): Observable<any> {
    let params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService
      .getAPI('/Accounting/AccountingReports/GetBankNames', params, 'YES')
      .pipe(
        catchError((e:any) => {
          this._CommonService.showErrorMessage(e);
          return throwError(() => e);
        })
      );
  }
  GetBankBookReportbyDates(FromDate: string | number | boolean, ToDate: string | number | boolean, _pBankAccountId: string | number | boolean): Observable<any> {
   
      let params = new HttpParams().set('FromDate', FromDate).set('ToDate', ToDate).set('_pBankAccountId', _pBankAccountId).set('BranchSchema', this._CommonService.getschemaname());
      return this._CommonService.getAPI('/Accounting/AccountingReports/GetBankBookDetails', params, 'YES')
      .pipe(
        catchError((e:any) => {
          this._CommonService.showErrorMessage(e);
          return throwError(() => e);
        })
      );
  }
  GetBrsReportBankDebitsBankCredits(fromdate: string | number | boolean, todate: string | number | boolean, bankid: string | number | boolean, transtype: string | number | boolean, branchschema: any): Observable<any> {

      let params = new HttpParams().set('fromdate', fromdate).set('todate', todate).set('bankid', bankid).set('transtype', transtype).set('branchschema', this._CommonService.getschemaname());
      return this._CommonService.getAPI('/ChitTransactions/ChitReports/GetBrsReportBankDebitsBankCredits', params, 'YES')
      
       .pipe(
        catchError((e:any) => {
          this._CommonService.showErrorMessage(e);
          return throwError(() => e);
        })
      );
  }
  GetBankEntriesDetails2(fromDate: string, toDate: string, branchName: string, ReportType: string): Observable<any> {

      let params = new HttpParams()
        .set('FromDate', fromDate || '')
        .set('ToDate', toDate || '')
        .set('BranchSchema', this._CommonService.getschemaname()).set('ReportType', ReportType || '');

      if (branchName) {
        params = params.set('BranchName', branchName);
      }

      return this._CommonService.getAPI(
        '/Accounting/AccountingReports/GetBankEntriesDetails',
        params,
        'YES'
      )
     .pipe(
        catchError((e:any) => {
          this._CommonService.showErrorMessage(e);
          return throwError(() => e);
        })
      );
  }

}
