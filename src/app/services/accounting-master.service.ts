import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class AccountingMasterService {
  recordid: any;
  bankdetails: any;
  status: any;
  adressdetails: any;

  constructor(
    private http: HttpClient,
    private _CommonService: CommonService
  ) {}

  ViewChequeManagementDetails(): Observable<any> {
    const params = new HttpParams()
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI(
      '/Accounting/Configuration/ViewChequeManagementDetails',
      params,
      'YES'
    );
  }

  GetBankDetails1(recordid: any, data: any): void {
    this.recordid = recordid;
    this.bankdetails = data;
  }

  GetBankDetails(): Observable<any> {
    const params = new HttpParams()
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI(
      '/Accounting/Configuration/GetBankDetails',
      params,
      'YES'
    );
  }

  GetBankUPIDetails(): Observable<any> {
    const params = new HttpParams()
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI(
      '/BankInformation/GetBankUPIDetails',
      params,
      'YES'
    );
  }

  GetExistingChequeCount(
    BankId: any,
    ChqFromNo: any,
    ChqToNo: any
  ): Observable<any> {
    const params = new HttpParams()
      .set('BranchSchema', this._CommonService.getschemaname())
      .set('BankId', BankId)
      .set('ChqFromNo', ChqFromNo)
      .set('ChqToNo', ChqToNo);

    return this._CommonService.getAPI(
      '/Accounting/Configuration/GetExistingChequeCount',
      params,
      'YES'
    );
  }

  GetAvailableChequeCount(
    BankId: any,
    ChqFromNo: any,
    ChqToNo: any
  ): Observable<any> {
    const params = new HttpParams()
      .set('BranchSchema', this._CommonService.getschemaname())
      .set('BankId', BankId)
      .set('ChqFromNo', ChqFromNo)
      .set('ChqToNo', ChqToNo);

    return this._CommonService.getAPI(
      '/Accounting/Configuration/GetAvailableChequeCount',
      params,
      'YES'
    );
  }

  SaveChequeManagement(cheqinformation: any): Observable<any> {
    return this._CommonService.postAPI(
      '/Accounting/Configuration/SaveChequeManagement',
      cheqinformation
    );
  }

  viewbankinformation(): Observable<any> {
    const params = new HttpParams()
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI(
      '/BankInformation/ViewBankInformationDetails',
      params,
      'Yes'
    );
  }

  viewbank(recordid: any): Observable<any> {
    const params = new HttpParams()
      .set('BranchSchema', this._CommonService.getschemaname())
      .set('precordid', recordid);

    return this._CommonService.getAPI(
      '/BankInformation/ViewBankInformation',
      params,
      'Yes'
    );
  }

  newformstatus(status: any): void {
    this.status = status;
  }

  newstatus(): any {
    return this.status;
  }

  editbankdetails(): any {
    return this.recordid;
  }

  editbankdetails1(): any {
    return this.bankdetails;
  }

  savebankinformation(bankinformationdata: any): Observable<any> {
    return this._CommonService.postAPI(
      '/BankInformation/SaveBankInformation',
      bankinformationdata
    );
  }

  GetCheckDuplicateDebitCardNo(bankinformationdata: any): Observable<any> {
    return this._CommonService.postAPI(
      '/BankInformation/GetCheckDuplicateDebitCardNo',
      bankinformationdata
    );
  }

  GetBanks(): Observable<any> {
    return this._CommonService.getAPI(
      '/Common/GetGlobalBanks',
      '',
      'NO'
    );
  }

  GetAccountTree(): Observable<any> {
    const params = new HttpParams()
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI(
      '/AccountTree',
      params,
      'YES'
    );
  }

  GetAccountTreeSearch(searchterm: any): Observable<any> {
    const params = new HttpParams()
      .set('BranchSchema', this._CommonService.getschemaname())
      .set('searchterm', searchterm);

    return this._CommonService.getAPI(
      '/AccountTreeSearch',
      params,
      'YES'
    );
  }

  getBankConfigurationdetails(branchschema: any): Observable<any> {
    const params = new HttpParams()
      .set('branchschema', branchschema);

    return this._CommonService.getAPI(
      '/BankInformation/getBankConfigurationdetails',
      params,
      'YES'
    );
  }

  GetSubLedgerdata(ledgerid: any, branchschema: any): Observable<any> {
    const params = new HttpParams()
      .set('ledgerid', ledgerid)
      .set('branchschema', branchschema);

    return this._CommonService.getAPI(
      '/GetSubLedgerdata',
      params,
      'YES'
    );
  }

  CheckAccountnameDuplicate(
    Accountname: any,
    Accounttype: any,
    Parentid: any
  ): Observable<any> {
    const params = new HttpParams()
      .set('Accountname', Accountname)
      .set('AccountType', Accounttype)
      .set('ParentId', Parentid);

    return this._CommonService.getAPI(
      '/checkAccountnameDuplicates',
      params,
      'YES'
    );
  }

  SaveAccountHeads(accountsdata: any): Observable<any> {
    return this._CommonService.postAPI(
      '/SaveAccHead',
      accountsdata
    );
  }
  
}
