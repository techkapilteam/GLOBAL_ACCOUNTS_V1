// import { Injectable } from '@angular/core';
// import { CommonService } from './common.service';
// import { Observable } from 'rxjs';
// import { HttpParams } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root',
// })
// export class GeneralReceiptCancelService {
//   getReceiptNumber() {
//     throw new Error('Method not implemented.');
//   }
  
//   getreceiptdata(receiptid: any) {
//     throw new Error('Method not implemented.');
//   }
//   saveFixedDeposit: any;
//   constructor(private _commonService: CommonService) {}

//   getEmployeeName(searchtype: string): Observable<any[]> {
//     const params = new HttpParams()
//       .set('localSchema', this._commonService.getschemaname())
//       .set('searchtype', searchtype ?? '');

//     return this._commonService.getAPI('/Subscriber/GetSubInterducedDetails', params, 'YES');
//   }

//   savepettycashcancel(pettycashReceiptCancelData: string): Observable<any> {
//     return this._commonService.postAPI(
//       '/GeneralReceiptCancel/savepettycashReceiptCancel',
//       pettycashReceiptCancelData
//     );
//   }
  
// }
