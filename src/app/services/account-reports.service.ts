import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountReportsService {
  private _CommonService=inject(CommonService)
  
  GetChequesIssuedData(BrsFromDate:any,BrsTodate:any,bankid: any, startindex: any, endindex: any, modeofreceipt: any, _searchText: any, GlobalSchema: any,branchcode:any,companycode:any): Observable<any> {
    const params = new HttpParams().set('BrsFromDate', BrsFromDate).set('BrsTodate', BrsTodate).set('_BankId', bankid).set('BranchSchema', this._CommonService.getbranchname()).set('startindex', startindex).set('endindex', endindex).set('modeofreceipt', modeofreceipt).set('searchtext', _searchText).set('GlobalSchema', GlobalSchema).set('branchcode', branchcode).set('companycode', companycode);
    return this._CommonService.getAPI('/Accounts/GetChequesIssued', params, 'YES')
  }
  GetBankBalance(bankid: any) {
    const params = new HttpParams().set('brstodate', '09-01-2026').set('_recordid', bankid).set('BranchSchema', this._CommonService.getbranchname()).set('branchCode', this._CommonService.getBranchCode()).set('companyCode', this._CommonService.getCompanyCode());
    return this._CommonService.getAPI('/Accounts/GetBankBalance', params, 'YES');
  }
  Getgstvocuherprint(Branchschema: any, Gstvoucherno: any): Observable<any> {
    const params = new HttpParams().set('branchSchema', Branchschema).set('Gstvoucherno', Gstvoucherno).set('globalSchema', this._CommonService.getschemaname()).set('companyCode', this._CommonService.getCompanyCode()).set('branchCode', this._CommonService.getBranchCode());
    return this._CommonService.getAPI('/Accounts/Getgstvocuherprint', params, 'YES')
  }
  public getTDSReportDetails(localSchema:any, sectionid:any, fromdate:any, todate:any, grouptype:any,reporttype:any) {
    const params = new HttpParams().set("localSchema", localSchema).set("sectionid", sectionid).set("fromdate", fromdate).set("todate", todate).set("grouptype", grouptype).set("reporttype", reporttype).set("globalSchema", this._CommonService.getschemaname()).set("companyCode", this._CommonService.getCompanyCode()).set("branchCode", this._CommonService.getBranchCode());
    return this._CommonService.getAPI('/Accounts/getTDSReportDetails', params, 'YES');
  }
  
}
