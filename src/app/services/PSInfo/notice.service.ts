import { Injectable, EventEmitter } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  constructor(private _commonService: CommonService) { }

  getRemovalNoticeDataSearch = new EventEmitter();

  clearContactdata = new EventEmitter();

  getGroupCodes() :any {
    try {
      const params = new HttpParams().set('LocalSchema', this._commonService.getschemaname());
      return this._commonService.getAPI('/Notice/PSInfo/getGroupCodes', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  getNoticesGroupCodes(noticetype:any,contactid:any,branchschema:any,localschema:any) :any {
    try {
      const params = new HttpParams().set('LocalSchema', localschema).set('Branchschema', branchschema)
                                     .set('Noticetype', noticetype).set('contactid', contactid);;
      return this._commonService.getAPI('/Notice/PSInfo/getNoticesGroupCodes', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  getPenaltyPercentage(subscribertype:any) :any {
    try {
      if (subscribertype == 'G') {
        subscribertype = 'P'
      }
      const params = new HttpParams().set('subscribertype', subscribertype);
      return this._commonService.getAPI('/Notice/PSInfo/getPenaltyPercentage', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  getRemovalNoticeData(groupcode:any, installmentdue:any, noticetype:any, contactid:any,localschema:any,branchschema:any) :any {
    try {
      const params = new HttpParams().set('LocalSchema', localschema).set('groupcode', groupcode).set('installmentdue', installmentdue).set('noticetype', noticetype).set('contactid', contactid)
      .set('BranchSchema', branchschema);
      return this._commonService.getAPI('/Notice/PSInfo/getRemovalNoticeData', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }
  getLienNoticeData(groupcode:any, installmentdue:any, noticetype:any, contactid:any,localschema:any,branchschema:any) :any {
    try {
      const params = new HttpParams().set('LocalSchema', localschema).set('groupcode', groupcode).set('installmentdue', installmentdue).set('noticetype', noticetype).set('contactid', contactid)
      .set('BranchSchema', branchschema);
      return this._commonService.getAPI('/Notice/PSInfo/getLienNoticeData', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }
  saveNoticeData(data: any) :any {
    try {
      debugger
      return this._commonService.postAPI("/Notice/PSInfo/saveRemovalNotice", data)
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }
  saveNoDueData(data: any) :any{
    try {
      debugger
      return this._commonService.postAPI("/Notice/PSInfo/saveNoDueData", data)
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }
  saveLienNotice(data: any):any{
    try {
      debugger
      return this._commonService.postAPI("/Notice/PSInfo/saveLienNotice", data)
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  getNonIntimatedData(chitgroupid:any) :any {
    debugger
    try {
      const params = new HttpParams().set('LocalSchema', this._commonService.getschemaname()).set('chitgroupid', chitgroupid);
      return this._commonService.getAPI('/Notice/PSInfo/getNonIntimatedList', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  getNoticePostDetails(transactionnos:any, formname:any) :any {

    try {
      debugger
      const params = new HttpParams().set('LocalSchema', this._commonService.getschemaname()).set('transactionnos', transactionnos).set('formname', formname);
      return this._commonService.getAPI('/Notice/PSInfo/getNoticePostDetails', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  getNoticePostDetails_withdate(Formname:any,fromdate:any,todate:any) :any {
    debugger;
    try {
      debugger
      const params = new HttpParams().set('LocalSchema', this._commonService.getschemaname()).set('Formname', Formname).set('fromdate',fromdate).set('todate',todate);
      return this._commonService.getAPI('/Notice/PSInfo/getPostedlettersreprintbetweendates', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }
  getPostedlettersreprintbetweendatesspecimen(Formname:any,fromdate:any,todate:any) :any {
    debugger;
    try {
      debugger
      const params = new HttpParams().set('LocalSchema', this._commonService.getschemaname()).set('Formname', Formname).set('fromdate',fromdate).set('todate',todate);
      return this._commonService.getAPI('/Notice/PSInfo/getPostedlettersreprintbetweendatesspecimen', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  getLienNoticePostDetails(transactionnos:any, formname:any) :any {

    try {
      debugger
      const params = new HttpParams().set('LocalSchema', this._commonService.getschemaname()).set('transactionnos', transactionnos).set('formname', formname);
      return this._commonService.getAPI('/Notice/PSInfo/getLienNoticePostDetails', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    } 
  }

  getPostedLetters(Formname:any,fromdate:any,todate:any,LocalSchema:any,branchSchema:any) :any{
    debugger;
    try {
      debugger
      const params = new HttpParams().set('LocalSchema', LocalSchema).set('Formname', Formname).set('fromdate',fromdate).set('todate',todate).set('branchSchema',branchSchema);
      return this._commonService.getAPI('/Notice/PSInfo/getPostedletters', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  updatePostedLetter(data: any) :any{
    try {
      debugger
      return this._commonService.postAPI("/Notice/PSInfo/updatepostedLetters", data)
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }
  getVacentSalereport(Formname:any,Fromdate:any,Todate:any) :any{
    debugger;
    try {
      debugger
      const params = new HttpParams().set('LocalSchema', this._commonService.getschemaname()).set('Formname', Formname).set('Fromdate', Fromdate).set('Todate', Todate);
      return this._commonService.getAPI('/Notice/PSInfo/VacantSaleReport', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }
  getNoticePostDetailsPreview(data: any) :any {
    try {
      debugger
      return this._commonService.postAPI("/Notice/PSInfo/getNoticePostDetailsPreview", data)
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  getLienNoticeDetailsPreview(data: any) :any{
    try {
      debugger
      return this._commonService.postAPI("/Notice/PSInfo/getLienNoticeDetailsPreview", data)
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  GetChequeReturnInvoice(branch:any,commonReceiptno:any) :any {
    try {
      debugger
      const params = new HttpParams().set('BranchSchema',branch).set('CommonReceiptNumber',commonReceiptno);
      return this._commonService.getAPI('/Accounting/AccountingReports/GetChequeReturnInvoice', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  gettoken() :any {
    try {
    debugger;
      return this._commonService.getAPI('/ubi/GetToken','', 'NO');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }
  saveubi(data: any):any {
    debugger;
    try {

     
        return this._commonService.postAPI('/AccountingTransactions/SaveubiDetails', data);
     
    }
    catch (e) {
      this._commonService.showErrorMessage(e);
    }
  }
  Getubitransactions(strtoken:any,strAccountno:any,strfromdate:any,strtodate:any) :any{
    try {
      debugger
      const params = new HttpParams().set('strtoken',strtoken).set('strAccountno',strAccountno).set('strfromdate',strfromdate).set('strtodate',strtodate);
      return this._commonService.getAPI('/ubi/GetAccountStatement', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }
  GetChequeReturnVoucher(branch:any,commonReceiptno:any) :any{
    try {
      debugger
      const params = new HttpParams().set('BranchSchema',branch).set('CommonReceiptNumber',commonReceiptno);
      return this._commonService.getAPI('/Accounting/AccountingReports/GetChequeReturnVoucher', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  getNoticePostDetailsForReprint(chitgroupid:any, ticketno:any,contact_id:any,reprintformName:any ):any {
    try {
      const params = new HttpParams().set('LocalSchema', this._commonService.getschemaname()).set('chitgroupid', chitgroupid).set('reprintformName', reprintformName).set('ticketno', ticketno).set('contact_id',contact_id);
      return this._commonService.getAPI('/Notice/PSInfo/getNoticePostDetailsForReprint', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  getNoticePostDetailsForReprintByReferenceNo(referenceNumber:any):any {
    debugger
    try {
      const params = new HttpParams().set('LocalSchema', this._commonService.getschemaname()).set('referenceNumber', referenceNumber);
      return this._commonService.getAPI('/Notice/PSInfo/getNoticePostDetailsForReprintByReferenceNo', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  getPostedlettersreprintbetweendates(Formname:any,fromdate:any,todate:any) :any{
    debugger;
    try {
      debugger
      const params = new HttpParams().set('LocalSchema', this._commonService.getschemaname()).set('Formname', Formname).set('fromdate',fromdate).set('todate',todate);
      return this._commonService.getAPI('/Notice/PSInfo/getPostedlettersreprintbetweendates', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }

  getSpecimenDetailsforreprint(chitgroupid:any, ticketno:any,contact_id:any,reprintformName:any ):any {
    try {
      const params = new HttpParams().set('LocalSchema', this._commonService.getschemaname()).set('chitgroupid', chitgroupid).set('specimentype', reprintformName).set('ticketno', ticketno).set('contactid',contact_id);
      return this._commonService.getAPI('/PSSpecimen1/PSInfo/getSpecimenDetailsforreprint', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }
  getnoduedata(BranchSchema:any,groupcodeticketno:any):any {
    try {
      const params = new HttpParams().set('BranchSchema', BranchSchema).set('groupcodeticketno', groupcodeticketno);
      return this._commonService.getAPI('/Notice/PSInfo/getNoDueData', params, 'YES');
    }
    catch (errormssg) {
      this._commonService.showErrorMessage(errormssg);
    }
  }
}
