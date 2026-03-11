import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralReceiptCancelService {
  cancelReceipt(GeneralReceiptCancelData: any) : Observable<any[]> {
    throw new Error('Method not implemented.');
  }

  constructor(private _commonService: CommonService) {}

  
  getReceiptNumber(): Observable<any[]> {
    debugger;
    const params = new HttpParams().set('GlobalSchema', 'global').set('BranchSchema', 'accounts')
      .set('CompanyCode', 'KAPILCHITS').set('BranchCode', 'KLC01');
     return this._commonService.getAPI('/Accounts/GetReceiptNumber', params,'YES');
  }

 
 getreceiptdata(receiptId: any): Observable<any> {
  debugger;
  console.log('ReceiptId sent to API:', receiptId);
  const params = new HttpParams().set('GlobalSchema', 'global').set('BranchSchema', 'KLC01')
    .set('TaxSchema', 'taxes').set('CompanyCode', 'KAPILCHITS').set('BranchCode', 'accounts');
  return this._commonService.getAPI('/Accounts/GetGeneralReceiptsData', params,'YES');
}

  getEmployeeName(searchtype: string): Observable<any[]> {

    debugger;

    const params = new HttpParams()
      .set('localSchema', this._commonService.getschemaname())
      .set('searchtype', searchtype ?? '');

    return this._commonService.getAPI(
      '/Subscriber/GetSubInterducedDetails',
      params,
      'YES'
    );
  }

  
  saveReceiptCancel(payload: any): Observable<any> {

    debugger;

    return this._commonService.postAPI(
      '/GeneralReceiptCancel/saveGeneralReceiptCancel',
      payload
    );
  }

 
  savepettycashcancel(payload: any): Observable<any> {

    debugger;

    return this._commonService.postAPI(
      '/GeneralReceiptCancel/savepettycashReceiptCancel',
      payload
    );
  }
}
