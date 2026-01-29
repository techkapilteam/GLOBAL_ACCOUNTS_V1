// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class GeneralReceiptCancelService {
  
// }
import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeneralReceiptCancelService {

  constructor(private _commonservice:CommonService) { }

  getReceiptNumber()
  {
    debugger  
    const params=new HttpParams().set("LocalSchema",this._commonservice.getschemaname());
    return this._commonservice.getAPI("/GeneralReceiptCancel/getReceiptNumber", params, 'YES');
  }

   /** 
   * Getting Employee details
  */
 getEmployeeName(searchtype:any) {    
  debugger
  const params = new HttpParams().set('localSchema', this._commonservice.getschemaname()).set("searchtype",searchtype);
  return this._commonservice.getAPI("/Subscriber/GetSubInterducedDetails", params, 'YES');
}

  getreceiptdata(receiptno:any)
  {
    debugger  
    const params=new HttpParams().set("LocalSchema",this._commonservice.getschemaname()).set("receiptno",receiptno);
    return this._commonservice.getAPI("/GeneralReceiptCancel/getgeneralreceiptdata", params, 'YES');
  }
  saveFixedDeposit(GeneralReceiptCancelData:any)
  {
    return this._commonservice.postAPI("/GeneralReceiptCancel/saveGeneralReceiptCancel",GeneralReceiptCancelData);
  }

  savepettycashcancel(pettycashReceiptCancelData:any)
  {
    return this._commonservice.postAPI("/GeneralReceiptCancel/savepettycashReceiptCancel",pettycashReceiptCancelData);
  }
}
