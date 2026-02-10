import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChitTransactionsService {
   constructor(private _commonService: CommonService,private http:HttpClient) {}
  getBranchesByCAO(BranchSchema: string, Caoname: string) {

    const params = new HttpParams()
      .set('BranchSchema', BranchSchema)
      .set('Caoname', Caoname);

    return this._commonService.getAPI(
      '/ChitTransactions/ChitReports/getBranchesByCAO',
      params,
      'YES'
    );
  }

  getKGMSBranchList(LocalSchema: string) {

    const params = new HttpParams().set('BranchSchema', LocalSchema);

    return this._commonService.getAPI(
      '/ChitTransactions/getKGMSBranchesList',
      params,
      'YES'
    );
  }

  getCAOpendingtrasferlist(
    BranchSchema: string,
    Caoschema: string,
    ptypeofpayment: string
  ) {

    const params = new HttpParams()
      .set('BranchSchema', BranchSchema)
      .set('Caoschema', Caoschema)
      .set('ptypeofpayment', ptypeofpayment);

    return this._commonService.getAPI(
      '/ChitTransactions/ChitReports/GetPendingTransferDetails',
      params,
      'YES'
    );
  }
  getCAOBranchlist(BranchSchema: any){
    const params = new HttpParams().set('BranchSchema', BranchSchema);
    return this._commonService.getAPI('/ChitTransactions/ChitReports/getCAOBranches', params, 'YES');

  }
  GetkgmsCollectionReport(
    CAOSchema: string,
    Branchschema: string,
    fromdate: string,
    todate: string,
    ReportType: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('CAOSchema', CAOSchema)
      .set('Branchschema', Branchschema)
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('ReportType', ReportType);

    return this.http.get<any>('/ChitTransactions/GetkgmsCollectionReport', { params })
      .pipe(
        catchError((err) => {
          this._commonService.showErrorMessage(err);
          return throwError(() => err); // RxJS 7+ syntax
        })
      );
  }
  
}
