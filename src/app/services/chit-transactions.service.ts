import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class ChitTransactionsService {
   constructor(private _commonService: CommonService) {}
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
  
}
