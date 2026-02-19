// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class AccountingTransactionService {

// }
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs'
import { CommonService } from '../../common.service';

@Injectable({
  providedIn: 'root'
})
export class AccountingTransactionsService {

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });
  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  GetPaymentVoucherExistingData(): Observable<any> {
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/accountingtransactions/GetPaymentVoucherExistingData', params, 'YES');
  }


  deletePaymentVoucher(id: number) {
    const params = new HttpParams().set('id', id).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/AccountingTransactions/DeletePaymentVoucher', params, 'YES');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  }
  GetPettyCashExistingData(): Observable<any> {
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/accountingtransactions/GetPettyCashExistingData', params, 'YES');
  }

  GetGeneralReceiptExistingData(): Observable<any> {
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/AccountingTransactions/GetGeneralReceiptsData', params, 'YES');
  }
  GetModeoftransactions(): Observable<any> {
    return this._CommonService.getAPI('/AccountingTransactions/GetModeoftransactions', '', 'NO');
  }

  GetReceiptsandPaymentsLoadingData(formname: any, BranchSchema: any): Observable<any> {
    const params = new HttpParams().set('formname', formname).set('BranchSchema', BranchSchema);
    return this._CommonService.getAPI('/accountingtransactions/GetReceiptsandPaymentsLoadingData', params, 'YES');
  }
    GetReceiptsandPaymentsLoadingData2(formname: any, BranchSchema: any,GlobalSchema:any,CompanyCode:any,BranchCode:any,TaxesSchema:any): Observable<any> {
    const params = new HttpParams().set('formname', formname).set('BranchSchema', BranchSchema)
    .set('GlobalSchema', GlobalSchema).set('CompanyCode', CompanyCode)
    .set('BranchCode', BranchCode).set('TaxesSchema', TaxesSchema);
    return this._CommonService.getAPI('/Accounts/GetReceiptsandPaymentsLoadingData', params, 'YES');
  }

  GetReceiptsandPaymentsLoadingData1(GlobalSchema: any, AccountsSchema: any, CompanyCode: any, BranchCode: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('GlobalSchema', GlobalSchema).set('AccountsSchema', AccountsSchema).set('CompanyCode', CompanyCode).set('BranchCode', BranchCode);
    return this._CommonService.getAPI('/Accounts/BankNames', params, 'YES');
  }



  GetLedgerData1(formname: any, BranchSchema: any, CompanyCode: any, BranchCode: any, GlobalSchema: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('formname', formname).set('BranchSchema', BranchSchema).set('CompanyCode', CompanyCode).set('BranchCode', BranchCode).set('GlobalSchema', GlobalSchema);
    return this._CommonService.getAPI('/Accounts/GetLedgerAccountList', params, 'YES');
  }
  GetBankDetailsbyId1(pbankid: any, BranchSchema: any, GlobalSchema: any, CompanyCode: any, BranchCode: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('pbankid', pbankid).set('BranchSchema', BranchSchema).set('GlobalSchema', GlobalSchema).set('CompanyCode', CompanyCode).set('BranchCode', BranchCode);
    // return this._CommonService.getAPI('/Accounts/BankNames', params, 'YES');
    return this._CommonService.getAPI('/Accounts/GetBankDetailsbyId', params, 'YES');
  }
  GetIssuedChequeNumbers(_BankId:any, BranchSchema:any,CompanyCode:any,BranchCode:any): Observable<any> {
      debugger;
    const params = new HttpParams().set('_BankId',_BankId).set('BranchSchema', BranchSchema).set('CompanyCode', CompanyCode).set('BranchCode', BranchCode);
    // return this._CommonService.getAPI('/Accounts/BankNames', params, 'YES');
    return this._CommonService.getAPI('/Accounts/GetIssuedChequeNumbers', params, 'YES');
  }


   GetBankNames(GlobalSchema:any, AccountsSchema:any,CompanyCode:any,BranchCode:any): Observable<any> {
      debugger;
    const params = new HttpParams().set('GlobalSchema', GlobalSchema).set('AccountsSchema', AccountsSchema).set('CompanyCode', CompanyCode).set('BranchCode', BranchCode);
    // return this._CommonService.getAPI('/Accounts/BankNames', params, 'YES');
    return this._CommonService.getAPI('/Accounts/GetBankNames', params, 'YES');
  }


  GetBankDetailsbyId(pbankid: any): Observable<any> {
    const params = new HttpParams().set('pbankid', pbankid).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/accountingtransactions/GetBankDetailsbyId', params, 'YES');
  }
  GetProductnamesandHSNcodes(): Observable<any> {
    //const params = new HttpParams().set('GlobalSchema',GlobalSchema);
    return this._CommonService.getAPI('/Configuration/GlobalConfiguration/GetProductnamesandHSNcodes', "params", 'NO');
  }

  GetReceiptsandPaymentsLoadingDatapettycash(formname: any, BranchSchema: any): Observable<any> {
    const params = new HttpParams().set('formname', formname).set('BranchSchema', BranchSchema);
    return this._CommonService.getAPI('/accountingtransactions/GetReceiptsandPaymentsLoadingDatapettycash', params, 'YES');
  }

  getReceiptNumber() {
    debugger
    const params = new HttpParams().set("LocalSchema", this._CommonService.getschemaname());
    return this._CommonService.getAPI("/AccountingTransactions/getReceiptNumber", params, 'YES');
  }

  GetSubLedgerDataACCOUNTS(pledgerid: any, BranchSchema: any, CompanyCode: any, BranchCode: any, GlobalSchema: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('pledgerid', pledgerid).set('BranchSchema', BranchSchema).set('CompanyCode', CompanyCode).set('BranchCode', BranchCode).set('GlobalSchema', GlobalSchema);
    return this._CommonService.getAPI('/Accounts/GetSubLedgerData', params, 'YES');
  }
  GetSubLedgerDataFORinterbranch(pledgerid: any, BranchSchema: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('pledgerid', pledgerid).set('BranchSchema', BranchSchema);
    return this._CommonService.getAPI('/accountingtransactions/GetSubLedgerData', params, 'YES');
  }
  GetSubLedgerRestrictedStatus(pledgerid: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('pledgerid', pledgerid).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/accountingtransactions/GetSubLedgerRestrictedStatus', params, 'YES');
  }


  GetSubLedgerDetails(pledgerid: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('pledgerid', pledgerid).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/accountingtransactions/GetSubLedgerDetails', params, 'YES');
  }
  GetChitValueDetails(groupcode: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('groupcode', groupcode).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/accountingtransactions/GetChitValueDetails', params, 'YES');
  }

  getPartyDetailsbyid(ppartyid: any): Observable<any> {
    const params = new HttpParams().set('ppartyid', ppartyid).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/accountingtransactions/getPartyDetailsbyid', params, 'YES');
  }
  GetCashRestrictAmountpercontact(formname: any, branchschema: any, ppartyid: any, trans_date: any): Observable<any> {
    const params = new HttpParams().set('type', formname).set('contactid', ppartyid).set('BranchSchema', branchschema).set('checkdate', trans_date);
    return this._CommonService.getAPI('/AccountingTransactions/GetCashRestrictAmountpercontact', params, 'YES');
  }

  GetBanksList(BranchSchema: any): Observable<any> {
    const params = new HttpParams().set('BranchSchema', BranchSchema);
    return this._CommonService.getAPI('/AccountingTransactions/GetBankntList', params, 'YES')
  }
  
  // GetPayTmBanksList(BranchSchema: any, p0: string, p1: string): Observable<any> {
  //   const params = new HttpParams().set('BranchSchema', BranchSchema);
  //   return this._CommonService.getAPI('/ChequesOnHand/GetBankUPIList', params, 'YES')
  // }
  GetPayTmBanksList(BranchSchema: any, CompanyCode: string, BranchCode: string): Observable<any> {
    const params = new HttpParams().set('BranchSchema', BranchSchema).set('CompanyCode', CompanyCode).set('BranchCode', BranchCode);
    return this._CommonService.getAPI('/Accounts/BankUPIList', params, 'YES')
  }
  // GetCAOBranchList(BranchSchema: any,CompanyCode:any,BranchCode:any): Observable<any> {
  //   const params = new HttpParams().set('BranchSchema', BranchSchema).set('CompanyCode', CompanyCode).set('BranchCode', BranchCode);
  //   return this._CommonService.getAPI('/ChequesOnHand/GetCAOBranchList', params, 'YES')
  // }
  GetCAOBranchList(BranchSchema: any,CompanyCode:any,BranchCode:any,GlobalSchema:any): Observable<any> {
    const params = new HttpParams().set('BranchSchema', BranchSchema).set('CompanyCode', CompanyCode).set('BranchCode', BranchCode).set('GlobalSchema', GlobalSchema);
    return this._CommonService.getAPI('/ChequesOnHand/GetCAOBranchList', params, 'YES')
  }

  GetChequesOnHandData(bankid: any, startindex: any, endindex: any, modeofreceipt: any, _searchText: any, printorview: any): Observable<any> {
    const params = new HttpParams().set('_BankId', bankid).set('BranchSchema', this._CommonService.getschemaname()).set('startindex', startindex).set('endindex', endindex).set('modeofreceipt', modeofreceipt).set('searchtext', _searchText).set('printorview', printorview);
    return this._CommonService.getAPI('/ChequesOnHand/GetChequesOnHandData', params, 'YES')
  }
  GetCashOnHandData(caobranch: any): Observable<any> {
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname()).set('caoBranch', caobranch);
    return this._CommonService.getAPI('/ChequesOnHand/GetCashOnHandData', params, 'YES')
  }
  GetCashOnHandData_(caobranch: any, fromdate: any, todate: any, AsOnDate: any): Observable<any> {//added by uday on 04-09-2024
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname()).set('caoBranch', caobranch).set('fromdate', fromdate).set('todate', todate).set('AsOnDate', AsOnDate);
    return this._CommonService.getAPI('/ChequesOnHand/GetCashOnHandData', params, 'YES');
  }

  SaveChequesOnHand(data: any) {
    return this._CommonService.postAPI('/ChequesOnHand/SaveChequesOnHand', data)
  }
  SaveCashOnHand(data: any) {
    return this._CommonService.postAPI('/ChequesOnHand/SaveCashOnHand', data)
  }
  UpdateCashOnHand(data: any) {
    return this._CommonService.postAPI('/ChequesOnHand/UpdateCashOnHand', data)
  }

  DataFromBrsDatesChequesOnHand(frombrsdate: any, tobrsdate: any, bankid: any, modeofreceipt: any, searchtext: any, startindex: any, endindex: any) {
    const params = new HttpParams().set('BrsFromDate', frombrsdate).set('BrsTodate', tobrsdate).set('_BankId', bankid).set('BranchSchema', this._CommonService.getschemaname()).set('modeofreceipt', modeofreceipt).set('searchtext', searchtext).set('startindex', startindex).set('endindex', endindex);
    return this._CommonService.getAPI('/ChequesOnHand/GetChequesOnHandData_New', params, 'YES');
  }

  GetBankBalance(bankid: any) {
    const params = new HttpParams().set('_recordid', bankid).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/ChequesOnHand/GetBankBalance', params, 'YES');
  }
  GetCashonhandBalance() {
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/ChequesOnHand/GetCashonhandBalance', params, 'YES');
  }
  GetChequesIssuedData(bankid: any, startindex: any, endindex: any, modeofreceipt: any, _searchText: any, printorview: any): Observable<any> {
    const params = new HttpParams().set('_BankId', bankid).set('BranchSchema', this._CommonService.getschemaname()).set('startindex', startindex).set('endindex', endindex).set('modeofreceipt', modeofreceipt).set('searchtext', _searchText).set('printorview', printorview);
    return this._CommonService.getAPI('/ChequesOnHand/GetChequesIssued', params, 'YES')
  }

  DataFromBrsDatesChequesIssued(frombrsdate: any, tobrsdate: any, bankid: any, modeofreceipt: any, _searchText: any, startindex: any, endindex: any) {
    const params = new HttpParams().set('BrsFromDate', frombrsdate).set('BrsTodate', tobrsdate).set('_BankId', bankid).set('BranchSchema', this._CommonService.getschemaname()).set('modeofreceipt', modeofreceipt).set('startindex', startindex).set('endindex', endindex).set('searchtext', _searchText);
    return this._CommonService.getAPI('/ChequesOnHand/GetIssuedCancelledCheques_New', params, 'YES');
  }


  DataFromBrsDatesForOtherChequesDetails(frombrsdate: any, tobrsdate: any, bankid: any) {
    const params = new HttpParams().set('BrsFromDate', frombrsdate).set('BrsTodate', tobrsdate).set('_BankId', bankid).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/ChequesOnHand/GetChequesOtherDetails_New', params, 'YES');
  }

  SaveChequesIssued(data: any) {
    return this._CommonService.postAPI('/ChequesOnHand/SaveChequesIssued', data)
  }

  GetChequesInBankData(bankid: any, startindex: any, endindex: any, modeofreceipt: any, searchtext: any, printorview: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('depositedBankid', bankid).set('BranchSchema', this._CommonService.getschemaname()).set('startindex', startindex).set('endindex', endindex).set('modeofreceipt', modeofreceipt).set('searchtext', searchtext).set('printorview', printorview);
    return this._CommonService.getAPI('/ChequesOnHand/GetChequesInBankData', params, 'YES')
  }

  GetPaytmInBankData(bankid: any, startindex: any, endindex: any, modeofreceipt: any, searchtext: any, printorview: any, receiptDate: any, chequeintype: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('depositedBankid', bankid).set('BranchSchema', this._CommonService.getschemaname()).set('startindex', startindex).set('endindex', endindex).set('modeofreceipt', modeofreceipt).set('searchtext', searchtext).set('printorview', printorview).set('receiptDate', receiptDate).set('chequeintype', chequeintype);
    return this._CommonService.getAPI('/ChequesOnHand/GetUPIClearedData', params, 'YES')
  }

  GetUPIClearedDataForTotalCount(bankid: any, startindex: any, endindex: any, modeofreceipt: any, searchtext: any, printorview: any, receiptDate: any, chequeintype: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('depositedBankid', bankid).set('BranchSchema', this._CommonService.getschemaname()).set('startindex', startindex).set('endindex', endindex).set('modeofreceipt', modeofreceipt).set('searchtext', searchtext).set('printorview', printorview).set('receiptDate', receiptDate).set('chequeintype', chequeintype);
    return this._CommonService.getAPI('/ChequesOnHand/GetUPIClearedDataForTotalCount', params, 'YES')
  }

  GetChequesRowCount(bankid: any, searchtext: any, frombrsdate: any, tobrsdate: any, formname: any, modeofreceipt: any): Observable<any> {
    const params = new HttpParams().set('depositedBankid', bankid).set('BranchSchema', this._CommonService.getschemaname()).set('searchtext', searchtext).set('BrsFromDate', frombrsdate).set('BrsTodate', tobrsdate).set('formname', formname).set('modeofreceipt', modeofreceipt);
    return this._CommonService.getAPI('/ChequesOnHand/GetChequesRowCount', params, 'YES')
  }

  // GetChequeEnquiryData(bankid): Observable<any> {
  //   const params = new HttpParams().set('depositedBankid', bankid).set('BranchSchema', this._CommonService.getschemaname());
  //   return this._CommonService.getAPI('/ChequesOnHand/GetChequeEnquiryData', params, 'YES')
  // }
  GetChequeEnquiryData(bankid: any, startindex: any, endindex: any, modeofreceipt: any, searchtext: any): Observable<any> {
    const params = new HttpParams().set('depositedBankid', bankid).set('BranchSchema', this._CommonService.getschemaname()).set('startindex', startindex).set('endindex', endindex).set('modeofreceipt', modeofreceipt).set('searchtext', searchtext);
    return this._CommonService.getAPI('/ChequesOnHand/GetChequeEnquiryData', params, 'YES')
  }





  SaveChequesInBank(data: any) {
    return this._CommonService.postAPI('/ChequesOnHand/SaveChequesInBank', data)
  }

  SaveOnLineCollection_JV(data: any) {
    return this._CommonService.postAPI('/ChequesOnHand/SaveOnLineCollection_JV', data)
  }

  DataFromBrsDatesChequesInBank(frombrsdate: any, tobrsdate: any, bankid: any, modeofreceipt: any, searchtext: any, startindex: any, endindex: any) {
    const params = new HttpParams().set('BrsFromDate', frombrsdate).set('BrsTodate', tobrsdate).set('depositedBankid', bankid).set('BranchSchema', this._CommonService.getschemaname()).set('modeofreceipt', modeofreceipt).set('searchtext', searchtext).set('startindex', startindex).set('endindex', endindex);
    return this._CommonService.getAPI('/ChequesOnHand/GetClearedReturnedCheques_New', params, 'YES');
  }
  GetPendingautoBRSDetails(BranchSchema: any, allocationstatus: any) {
    const params = new HttpParams().set('BranchSchema', BranchSchema).set('allocationstatus', allocationstatus)
    return this._CommonService.getAPI('/ChequesOnHand/GetPendingautoBRSDetails', params, 'YES');
  }
  GetPendingautoBRSDetailsIssued(BranchSchema: any, allocationstatus: any) {
    const params = new HttpParams().set('BranchSchema', BranchSchema).set('allocationstatus', allocationstatus)
    return this._CommonService.getAPI('/ChequesOnHand/GetPendingautoBRSDetailsIssued', params, 'YES');
  }
  DataFromBrsDatesChequesIssuedBankubi(frombrsdate: any, tobrsdate: any, bankid: any) {
    const params = new HttpParams().set('BrsFromDate', frombrsdate).set('BrsTodate', tobrsdate).set('_BankId', bankid).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/ChequesOnHand/GetIssuedCancelledCheques_Newubi', params, 'YES');
  }
  DataFromBrsDatesChequesInBankubi(frombrsdate: any, tobrsdate: any, bankid: any) {
    const params = new HttpParams().set('BrsFromDate', frombrsdate).set('BrsTodate', tobrsdate).set('depositedBankid', bankid).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/ChequesOnHand/GetClearedReturnedCheques_Newubi', params, 'YES');
  }
  savePaymentVoucher(data: any) {
    debugger;
    return this._CommonService.postAPI('/AccountingTransactions/SavePaymentVoucher', data)
  }

  SaveInterBranchPaymentVoucher(data: any) {
    debugger;
    return this._CommonService.postAPI('/AccountingTransactions/SaveInterBranchPaymentVoucher', data)
  }
  saveInterBranchPaymentVoucherDetailsAll(data: any) {
    debugger;
    return this._CommonService.postAPI('/AccountingTransactions/saveInterBranchPaymentVoucherDetailsAll', data)
  }

  saveChallanaPayment(data: any) {
    debugger;
    return this._CommonService.postAPI('/AccountingTransactions/saveChallanaPaymentVoucher', data)
  }

  savePettyCash(data: any) {
    return this._CommonService.postAPI('/AccountingTransactions/SavePettyCash', data)
  }

  saveGeneralReceipt(data: any) {
    return this._CommonService.postAPI('/AccountingTransactions/SaveGeneralReceipt', data)
  }
  saveJournalVoucher(data: any) {
    return this._CommonService.postAPI('/accountingtransactions/SaveJournalVoucher', data)
  }
  GetJournalVoucherData(): Observable<any> {
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/accountingtransactions/GetJournalVoucherData', params, 'YES');
  }
  UnusedhequeCancel(data: any) {
    debugger
    return this._CommonService.postAPI('/Accounting/AccountingReports/UnusedhequeCancel', data)
  }

  // GetChequeReturnDetails(strFromDate: any, strToDate: any, p0: string, p1: string, p2: string, p3: string) {
  //   const params = new HttpParams().set('fromdate', strFromDate).set('todate', strToDate).set('BranchSchema', this._CommonService.getschemaname());
  //   return this._CommonService.getAPI('/Accounting/AccountingReports/GetChequeReturnDetails', params, 'YES');
  // }
  GetChequeReturnDetails(strFromDate: any, strToDate: any, BranchSchema: string, GlobalSchema: string, CompanyCode: string, BranchCode: string) {
    const params = new HttpParams().set('fromdate', strFromDate).set('todate', strToDate).set('BranchSchema', BranchSchema).set('GlobalSchema', GlobalSchema).set('CompanyCode', CompanyCode).set('BranchCode', BranchCode);
    return this._CommonService.getAPI('/Accounts/GetChequeReturnDetails', params, 'YES');
  }

  GetChequeCancelDetails(strFromDate: any, strToDate: any) {
    const params = new HttpParams().set('fromdate', strFromDate).set('todate', strToDate).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/Accounting/AccountingReports/GetChequeCancelDetails', params, 'YES');
  }
  GetInitialPVDetails(fromdate: any, todate: any, transtype: any) {
    const params = new HttpParams().set('fromdate', fromdate).set('todate', todate).set('transtype', transtype).set('localSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/Accounting/AccountingTransactions/GetInitialPVDetails', params, 'YES');
  }

  Getemipaymentsdata() {
    const params = new HttpParams().set('localSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/Accounting/AccountingTransactions/Getemipayments', params, 'YES');
  }
  GetBidPayableAdjust(fromdate: any, todate: any, formname: any) {
    debugger
    const params = new HttpParams().set('LocalSchema', this._CommonService.getschemaname()).set('Formname', formname).set('Fromdate', fromdate).set('Todate', todate)
    return this._CommonService.getAPI('/Notice/PSInfo/ZPDBidPaybleAdjust', params, 'YES');
  }
  GetChequesOnHand(strToDate: any) {
    const params = new HttpParams().set('Ason', strToDate).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/Accounting/AccountingReports/GetChequesonHandData', params, 'YES');
  }

  getBranchType() {
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/ChitTransactions/getBranchType', params, 'YES');
  }

  getChequeReturnCharges(): Observable<any> {
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/ChequesOnHand/GetChequeReturnCharges', params, 'YES')
  }
  saveGstVoucher(localschema: any, data: any) {
    debugger;
    return this._CommonService.postAPI('/ChitTransactions/savegstvocuher?localschema=' + localschema, data)
  }
  Getgstvocuherprint(Branchschema: any, Gstvoucherno: any): Observable<any> {
    const params = new HttpParams().set('Branchschema', Branchschema).set('Gstvoucherno', Gstvoucherno);
    return this._CommonService.getAPI('/ChitTransactions/Getgstvocuherprint', params, 'YES')
  }
  getgstdocuments(Contactid: any): Observable<any> {
    const params = new HttpParams().set('Contactid', Contactid);
    return this._CommonService.getAPI('/Transactions/ChitTransations/AuctionController/gstvoucherdocuments', params, 'YES')
  }

  // getpartywisestates(Contactid: any, BranchSchema: any): Observable<any> {
  //   const params = new HttpParams().set('partyid', Contactid).set('BranchSchema', BranchSchema);
  //   return this._CommonService.getAPI('/AccountingTransactions/GetPartywiseStates', params, 'YES')
  // }
  getPartywiseStates(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://localhost:5001/api/Accounts/GetPartywiseStates?BranchSchema=accounts&partyid=1&GlobalSchema=global&CompanyCode=KAPILCHITS&BranchCode=KLC01'
    );
  }


  GetCashAmountAccountWise(formname: any, account_id: any, transaction_date: any): Observable<any> {
    const params = new HttpParams().set('formname', formname).set('BranchSchema', this._CommonService.getschemaname()).set('account_id', account_id).set('transaction_date', transaction_date);
    return this._CommonService.getAPI('/AccountingTransactions/GetCashAmountAccountWise', params, 'YES')
  }

  GettdsLedgerAccountsList(formname: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('formname', formname).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/AccountingTransactions/GetLedgerAccountList', params, 'YES');
  }

    GettdsLedgerAccountsList1(formname: any,BranchSchema:any,CompanyCode:any,BranchCode:any,GlobalSchema:any): Observable<any> {
    debugger;
    const params = new HttpParams().set('formname', formname).set('BranchSchema',BranchSchema).set('CompanyCode',CompanyCode).set('BranchCode',BranchCode).set('GlobalSchema',GlobalSchema);
    return this._CommonService.getAPI('/Accounts/GetLedgerAccountList', params, 'YES');
  }

  GettdsJVDetails(creditledger: any, monthYear: any, debitledger: any): Observable<any> {
    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('creditledger', creditledger).set('MonthYear', monthYear).set('debitledger', debitledger);
    return this._CommonService.getAPI('/AccountingTransactions/GetTDSJVDetails', params, 'YES');
  }
  GetInterBranchJVDetails(creditledger: any, transactiondate: any, debitledger: any): Observable<any> {
    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('creditledger', creditledger).set('todate', transactiondate).set('debitledger', debitledger);
    return this._CommonService.getAPI('/AccountingTransactions/GetInterBranchJVDetails', params, 'YES');
  }


  saveTDSjvdetails(data: any) {
    return this._CommonService.postAPI('/accountingtransactions/SaveTDSJVDetails', data)
  }

  SaveInterBranchJVDetails(data: any) {
    return this._CommonService.postAPI('/accountingtransactions/SaveInterBranchJVDetails', data)
  }

  GetTDSJVDetailsDuplicateCheck(monthYear: any, jvType: any): Observable<any> {
    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('MonthYear', monthYear).set('JVType', jvType);
    return this._CommonService.getAPI('/AccountingTransactions/GetTDSJVDetailsDuplicateCheck', params, 'YES');
  }

  GetLCExpensesLedgerAccountsList(formname: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('formname', formname).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/AccountingTransactions/GetLedgerAccountList', params, 'YES');
  }


  GetUPIClearedData_SettlementReport(fromdate: any, todate: any, pbankid: any) {
    const params = new HttpParams().set('FromDate', fromdate).set('Todate', todate).set('BranchSchema', this._CommonService.getschemaname()).set('depositedBankid', pbankid);
    return this._CommonService.getAPI('/ChequesOnHand/GetUPIClearedData_SettlementReport', params, 'YES');
  }

  getForemanDetails(BranchSchema: any, branchid: any, fromdate: any, todate: any, chitStatus: any): Observable<any> {
    const params = new HttpParams().set('BranchSchema', BranchSchema).set('branch_id', branchid).set('fromdate', fromdate).set('todate', todate).set('chitgrouptype', chitStatus);
    return this._CommonService.getAPI('/accountingtransactions/GetForemanDetails', params, 'YES');
  }

  GetForemanPaymentDetails(BranchSchema: any, fromdate: any, todate: any): Observable<any> {
    const params = new HttpParams().set('BranchSchema', BranchSchema).set('fromdate', fromdate).set('todate', todate);
    return this._CommonService.getAPI('/accountingtransactions/GetForemanPaymentDetails', params, 'YES');
  }

  SaveForemanDetails(data: any) {
    return this._CommonService.postAPI('/accountingtransactions/SaveForemanDetails', data)
  }
  getBankTransferDetails(BranchSchema: any, todate: any, banktransferid: any): Observable<any> {
    const params = new HttpParams().set('BranchSchema', BranchSchema).set('banktransferid', banktransferid).set('todate', todate);
    return this._CommonService.getAPI('/accountingtransactions/getBankTransferDetails', params, 'YES');
  }
  GetParollJVDetailsforwelfare(Branchschema: any, todate: any, debitledger: any): Observable<any> {
    const params = new HttpParams().set('Branchschema', Branchschema).set('debitledger', debitledger).set('todate', todate);
    return this._CommonService.getAPI('/AccountingTransactions/GetPayrollJVDetailsforwelfare', params, 'YES');
  }
  GetBankTransferTypes(BranchSchema: any) {
    const params = new HttpParams().set('branchSchema', BranchSchema);
    return this._CommonService.getAPI('/accountingtransactions/GetBankTransferTypes', params, 'YES');

  }


  SaveBankTransferDetails(data: any) {
    return this._CommonService.postAPI('/accountingtransactions/SaveBankTransferDetails', data)
  }
  SaveParollJVDetailsforwelfare(data: any) {
    return this._CommonService.postAPI('/AccountingTransactions/SaveParollJVDetailsforwelfare', data)
  }

  SaveSchemeChequesUpdate(data: any) {
    debugger;
    return this._CommonService.postAPI('/ChitTransactions/SaveSchemeChequesUpdate', data)
  }

  GetLegalCellNames(): Observable<any> {
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/ChitTransactions/GetLegalCellBranchAccountListforGeneralReceipt', params, 'YES');
  }

  saveInterBranchData(data: any) {
    return this._CommonService.postAPI('/ChitTransactions/saveInterBranchReceiptForLegalCell', data)
  }

  saveInterBranchDataForLegal(data: any) {
    return this._CommonService.postAPI('/ChitTransactions/saveInterBranchReceiptForLegalChitReceipt', data)
  }
  GetAgentadvancetenures(): Observable<any> {

    return this._CommonService.getAPI('/ChitTransactions/GetAgentadvancetenures', '', 'NO');
  }
  GetAgentadvanceinterest(Tenureid: any) {
    const params = new HttpParams().set('Tenureid', Tenureid);
    return this._CommonService.getAPI('/ChitTransactions/GetAgentadvanceinterest', params, 'YES');

  }

  GetSubLedgerDataLcExpenses(pledgerid: any, BranchSchema: any, FormName: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('pledgerid', pledgerid).set('BranchSchema', BranchSchema).set('FormName', FormName);
    return this._CommonService.getAPI('/AccountingTransactions/GetSubLedgerDataLcExpenses', params, 'YES');
  }

  SaveAgentAdvance(data: any) {
    return this._CommonService.postAPI('/ChitTransactions/SaveAgentAdvance', data)

  }
  getMVONames(): any {

    try {
      const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname());
      return this._CommonService.getAPI('/Verification/Getmvonames', params, 'YES');
    }
    catch (errormssg: any) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  //added for gst voucher 01-04-2024 start.
  saveGstVoucher1(localschema: any, data: any) {
    debugger;
    return this._CommonService.postAPI('/ChitTransactions/savegstvocuher?localschema=' + localschema, data)
  }
  saveGstBill(localschema: any, data: any) {
    debugger;
    return this._CommonService.postAPI('/ChitTransactions/savegstbill?localschema=' + localschema, data)
  }
  GetPartywiseStates(Contactid: any, BranchSchema: any): Observable<any> {
    const params = new HttpParams().set('partyid', Contactid).set('BranchSchema', BranchSchema);
    return this._CommonService.getAPI('/AccountingTransactions/GetPartywiseStates', params, 'YES')
  }
  GetSubLedgerData1(pledgerid: any): Observable<any> {
    debugger;
    const params = new HttpParams().set('pledgerid', pledgerid).set('BranchSchema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/accountingtransactions/GetSubLedgerData', params, 'YES');
  }
  // GetSubLedgerData(pledgerid: any): Observable<any> {
  //   debugger;
  //   const params = new HttpParams().set('pledgerid', pledgerid).set('BranchSchema', this._CommonService.getschemaname());
  //   return this._CommonService.getAPI('/accountingtransactions/GetSubLedgerData', params, 'YES');
  // }
  GetSubLedgerData(pledgerid: any,BranchSchema:any,CompanyCode:any,LocalSchema:any,BranchCode:any,GlobalSchema:any): Observable<any> {
    debugger;
    const params = new HttpParams().set('pledgerid', pledgerid).set('BranchSchema', BranchSchema).set('CompanyCode', CompanyCode).set('LocalSchema', LocalSchema).set('BranchCode', BranchCode).set('GlobalSchema', GlobalSchema);
    return this._CommonService.getAPI('/Accounts/GetSubLedgerData', params, 'YES');
  }
  //end.
  GetChitReceiptUPIDetails(upireferencenumber: any): any {//added by uday on 09-09-2024 for chit receipt upi details
    debugger
    try {
      const params = new HttpParams().set('upireferencenumber', upireferencenumber);
      return this._CommonService.getAPI('/ChitTransactions/GetChitReceiptUPIDetails', params, 'YES');
    }
    catch (errormssg: any) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  GetInterBranchPaymentVoucherBulkData(BranchSchema: any, Month: any, ParentAccountName: any, statecode: any): any {
    try {
      const params = new HttpParams().set('BranchSchema', BranchSchema).set('Month', Month).set('ParentAccountName', ParentAccountName).set('statecode', statecode);
      return this._CommonService.getAPI('/AccountingTransactions/GetInterBranchPaymentVoucherBulkData', params, 'YES');
    } catch (errormssg: any) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  SaveAutoBrsdataupload(data: any): any {
    try {
      return this._CommonService.postAPI('/ChequesOnHand/SaveAutoBrsdataupload', data);
    } catch (errormssg: any) {
      this._CommonService.showErrorMessage('errormssg');
    }
  }
  SaveAutoBrsdatauploadIssued(data: any): any {
    try {
      return this._CommonService.postAPI('/ChequesOnHand/SaveAutoBrsdatauploadIssued', data);
    } catch (errormssg: any) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }

  SaveBulkJvUpload(data: any) {
    return this._CommonService.postAPI('Transactions/HRMSTransactions/SaveJVDetails', data)
  }

}


