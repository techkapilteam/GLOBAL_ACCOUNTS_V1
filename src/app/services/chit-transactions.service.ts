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
   getPaytmAutoreceiptCount(branchcode:any,OfflineSchema:any,trdate:any)
  {
    const params = new HttpParams().set('OfflineSchema',OfflineSchema).set('branchcode',branchcode).set('trdate',trdate);
    return this._commonService.getAPI('/ChitTransactions/getPaytmAutoreceiptCount', params, 'YES');
  }


   updatestatuspatm(transactiondate:any):any{
    try{
      debugger;
      const params = new HttpParams().set('transactiondate',transactiondate);
      return this._commonService.getAPI('/ChitTransactions/updatestatuspatm',params,'YES');
    }
    catch(errormssg){
      this._commonService.showErrorMessage(errormssg);
    }
  }



     updatestatusCashfree(transactiondate:any):any{
    try{
      debugger;
      const params = new HttpParams().set('transactiondate',transactiondate);
      return this._commonService.getAPI('/ChitTransactions/updatestatuscashfree',params,'YES');
    }
    catch(errormssg){
      this._commonService.showErrorMessage(errormssg);
    }
  }



   gettransations(OfflineSchema:any,transactiondate:any):any{
    try{
      //let params =this._commonService.getschemaname()
      let params = new HttpParams().set('OfflineSchema',OfflineSchema).set('caoname',this._commonService.getbranchname()).set('transactiondate', transactiondate)
    return this._commonService.getAPI('/ChitTransactions/GetSQLonlinetransactions',params, 'YES')
    }
    catch(errormssg){
      this._commonService.showErrorMessage(errormssg);
    }
  }


 
  getpaytmautoreceipt(fromdate:any,globalschema:any):any{
    try{
      debugger;
      //let params =this._commonService.getschemaname()
      let params = new HttpParams().set('strdate',fromdate).set('BranchSchema',  this._commonService.getschemaname()).set('GLOBAL',globalschema)
    return this._commonService.getAPI('/ChitTransactions/paytmautoreceipt',params, 'YES')
    }
    catch(errormssg){
      this._commonService.showErrorMessage(errormssg);
    }
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
  // getCAOBranchlist(BranchSchema: any){
  //   const params = new HttpParams().set('BranchSchema', BranchSchema);
  //   return this._commonService.getAPI('/ChitTransactions/ChitReports/getCAOBranches', params, 'YES');
  // }
  getCAOBranchlist(BranchSchema: any,GlobalSchema:any,CompanyCode:any,BranchCode:any){
    const params = new HttpParams().set('BranchSchema', BranchSchema).set('GlobalSchema', GlobalSchema).set('CompanyCode', CompanyCode).set('BranchCode', BranchCode);
    return this._commonService.getAPI('/Accounts/GetCAOBranchList', params, 'YES');
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
