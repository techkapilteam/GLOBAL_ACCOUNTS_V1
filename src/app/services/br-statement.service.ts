import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BrStatementService {
   constructor(private _commonService: CommonService) {}
  // GetBrStatementReportByDates(
  //   fromDate: string,
  //   bankAccountId: number
  // ): Observable<any> {

  //   const params = new HttpParams({
  //     fromObject: {
  //       fromdate: fromDate,
  //       _pBankAccountId: bankAccountId.toString(),
  //       BranchSchema: this._commonService.getschemaname()
  //     }
  //   });

  //   return this._commonService.getAPI(
  //     '/Accounting/AccountingReports/GetBrs',
  //     params,
  //     'YES'
  //   );
  // }
  GetBrStatementReportByDates(
    fromDate: string,
    _pBankAccountId: number,
    BranchSchema:any,
    branchCode:any,
    companyCode:any,
    GlobalSchema:any
  ): Observable<any> {

    const params = new HttpParams({
      fromObject: {
        fromdate: fromDate,
        _pBankAccountId: _pBankAccountId,
        BranchSchema: BranchSchema,
        branchCode:branchCode,
        companyCode:companyCode,
        GlobalSchema:GlobalSchema
      }
    });

    return this._commonService.getAPI(
      '/Accounts/GetBrs',
      params,
      'YES'
    );
  }
  GetBrStatementReportByDatesChequesInfo(
    fromDate: string,
    toDate: string,
    bankAccountId: number
  ): Observable<any> {

    const params = new HttpParams({
      fromObject: {
        fromdate: fromDate,
        todate: toDate,
        _pBankAccountId: bankAccountId.toString(),
        BranchSchema: this._commonService.getschemaname()
      }
    });

    return this._commonService.getAPI(
      '/Accounting/AccountingReports/GetBrStatementReportbyDatesChequesInfo',
      params,
      'YES'
    );
  }
  GetBrsBankBalance(
    fromDate: string,
    bankAccountId: number
  ): Observable<any> {

    const params = new HttpParams({
      fromObject: {
        fromdate: fromDate,
        _pBankAccountId: bankAccountId.toString(),
        BranchSchema: this._commonService.getschemaname()
      }
    });

    return this._commonService.getAPI(
      '/Accounting/AccountingReports/GetBrsBankBalance',
      params,
      'YES'
    );
  }
  GetBrsCount(
    brsDate: string,
    bankAccountId: number,
    branchSchema: string
  ): Observable<any> {

    const params = new HttpParams({
      fromObject: {
        brsdate: brsDate,
        _pBankAccountId: bankAccountId.toString(),
        BranchSchema: branchSchema
      }
    });

    return this._commonService.getAPI(
      '/Accounting/AccountingReports/Getbrscount',
      params,
      'YES'
    );
  }
  SaveBrs(brsData: any): Observable<any> {
    return this._commonService.postAPI(
      '/Accounting/AccountingReports/SaveBrs',
      brsData
    );
  }
  
}
