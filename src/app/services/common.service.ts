// import { Injectable, EventEmitter } from '@angular/core';
// import { FormGroup, FormBuilder, AbstractControl, Validators, FormControl, FormArray } from '@angular/forms';
// import 'rxjs/Rx';
// import { Observable, throwError } from 'rxjs'
// import 'rxjs';
// import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
// // import { ToastrService } from 'ngx-toastr';
// // import { environment } from '../../environments/environment';
// import { mergeMap, map } from 'rxjs/operators';
// import { Subject } from 'rxjs'

// import { DatePipe } from '@angular/common';
// // import { CookieService } from 'ngx-cookie-service';
// import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// // import * as jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { formatDate } from "@angular/common";
// import { tick } from '@angular/core/testing';
// // import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
// // import * as FileSaver from 'file-saver';
// // import * as XLSX from 'xlsx';
// import { debug } from 'console';
// // import { DomEventsService } from '@progress/kendo-angular-grid';
// import { isNullOrUndefined } from '@swimlane/ngx-datatable';
// // import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
// // import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';
// // import { Color } from '@progress/kendo-drawing';
// // import { content } from 'html2canvas/dist/types/css/property-descriptors/content';


// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = '.xlsx';

// @Injectable({
//   providedIn: 'root'
// })
// export class CommonService {
//   // temGridData: any;



//   Easy_chit_Img = "data:image/png;base64,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";
//   searchfilterlength = 3;
//   searchplaceholder = 'Please enter 3 or more characters'
//   ipaddress = sessionStorage.getItem("ipaddress");
//   errormessages: any
//   datevalue: any;
//   year: any;
//   month: any;
//   day: any;
//   newDate: any;
//   public ReferralId: any;
//   pCreatedby: any;
//   pStatusname = 'ACTIVE';
//   ptypeofoperation = 'CREATE';
//   globalschema = 'GLOBAL';
//   comapnydetails: any={};
//   //dateFormat: any;
//   //currencysymbol: any;
//   private FiTab1Data = new Subject<any>();
//   private BankData = new Subject<any>();
//   private BankUpdate = new Subject<any>();
//   private KYCData = new Subject<any>();
//   private KYCUpdate = new Subject<any>();
//   private TDSData = new Subject<any>();
//   private TDSUpdate = new Subject<any>();
//   private ContactData = new Subject<any>();
//   private ContactUpdate = new Subject<any>();
//   private chargesDataToEdit = new Subject<any>();
//   private ContactId = new Subject<any>();
// private GuarantorId = new Subject<any>();
//   private CollectionTargetListupdate = new Subject<any>();
//   private EnrollDetailsupdate= new Subject<any>();
//   private showingGuarantordataInSearchEngine = new Subject<any>();
//   showingGuarantordataInSearchEngine$ = this.showingGuarantordataInSearchEngine.asObservable();
//   formtype: any;
//   NoticePostDetails: any = [];
//   totalamount: any = 0;
//   penaltyamount: any = 0;
//   duedetails: any = [];
//   duedetailsgriddata: any = [];
//   subscriptionamounttotal=0;
//   dividendamounttotal=0;
//   totalamountdues=0;
//   totaldamages=0;
//   pdftype!: string;
//   GuarantorDetails!: any[];
//   Companydetails: any;
//   tempdata=[]
//   aadhar_Required: any;
//   clear_ContactMerge_Event = new EventEmitter();
//   ptranstypedate:boolean=false
//   fromdateglobal=''
//   todateglobal=''
//   ptranstypegroupcode:boolean=false
//   chitno='';
//   contactGST:any;
//   legalReceiptCheckStatus!: string;
//   ReserveticketStatus:boolean=false;
//   Referredbystatus: boolean = false;
//   UserRightsList: any;
//   status: any;

//  getAPI(apiPath:any, params:any, parameterStatus:any) {

//     let urldata = environment.apiURL;
//     if (parameterStatus.toUpperCase() == 'YES')

//       return this.http.get(urldata).pipe(
//         mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + apiPath, { params }).map(this.extractData).catch(this.handleError)));
//     else
//       return this.http.get(urldata).pipe(
//         mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + apiPath).map(this.extractData).catch(this.handleError)));

//   }
//  getAPI1(apiPath, params, parameterStatus) {

//     let urldata = environment.apiURL;
//     if (parameterStatus.toUpperCase() == 'YES')

//       return this.http.get(urldata).pipe(
//         mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + apiPath, { params,responseType:"text" }).map(this.extractData1).catch(this.handleError)));
//     else
//       return this.http.get(urldata).pipe(
//         mergeMap(json => this.http.get(json[0]['ApiHostUrl'] + apiPath).map(this.extractData).catch(this.handleError)));

//   }
//   GetDesignations(): Observable<any> {
//     return this.getAPI('/Common/GetDesignations', '', 'NO');

//   }
//   GetDesignationsALL(): Observable<any> {
//     return this.getAPI('/Common/GetDesignationsALL', '', 'NO');

//   }
//   GetEnterpriseTypes(): Observable<any> {

//     return this.getAPI('/Common/GetEnterpriseType', '', 'NO');
//   }
//   GetGlobalBanks(): Observable<any> {
//     debugger;
//     return this.getAPI('/Common/GetGlobalBanks', '', 'NO');
//   }
//   GetGlobalUPINames(): Observable<any> {
//     debugger;
//     return this.getAPI('/Common/GetGlobalUPINames', '', 'NO');
//   }

//   GetBranchNames(): Observable<any> {
//     debugger;
//     return this.getAPI('/Common/GetBranchNames', '', 'NO');
//   }
//   GetCAOBranchNames(): Observable<any> {
//     debugger;
//     return this.getAPI('/Common/GetCAOBranchNames', '', 'NO');
//   }
//  getBranchCount(){
//     try {
//       return this.getAPI('/Common/getbranchcount', '', 'NO');
//     }
//     catch (errormssg) {
//       this.showErrorMessage(errormssg);
//     }
//  }

//  getBidpayabledays(){
//   try {
//     return this.getAPI('/Common/getBidpayabledays', '', 'NO');
//   }
//   catch (errormssg) {
//     this.showErrorMessage(errormssg);
//   }
// }

//   GetOtherBranches(localSchema): Observable<any> {
//     const params = new HttpParams().set('LocalSchema', localSchema);
//     return this.getAPI('/Common/GetOtherBranches', params, 'YES');
//   }
//    GetOtherchitadjustmentBranches(localSchema): Observable<any> {
//     const params = new HttpParams().set('LocalSchema', localSchema);
//     return this.getAPI('/Common/GetOtherChitAdjustmentBranches', params, 'YES');
//   }
//   GetInchargeValidateStatus(caoschema): Observable<any> {
//     const params = new HttpParams().set('caoschema', caoschema);
//     return this.getAPI1('/Subscriber/GetInchargeValidateStatus', params, 'YES');
//   }
//   GetOtherBranchesForEmployeeTransfer(localSchema): Observable<any> {
//     const params = new HttpParams().set('LocalSchema', localSchema);
//     return this.getAPI('/Common/GetOtherBranchesForEmployeeTransfer', params, 'YES');
//   }
//    const params = new HttpParams().set('ContactId', ContactId)
//     return this.getAPI('/ContactConfiguration/GetContactDetailsbyId', params, 'YES')
//   }
//   ConvertImagepathtobase64(path) {
//     const params = new HttpParams().set('strPath', path)
//     return this.getAPI('/loans/masters/contactmaster/ConvertImagepathtobase64', params, 'YES')
//   }
// const params = new HttpParams().set('contactType', contacttype)
//     return this.getAPI('/ContactConfiguration/getContactDetails', params, 'YES')
//   }
//   const params = new HttpParams().set('pContactId', ContactId)
//     return this.getAPI('/ContactConfiguration/getDocumentstoreDetails', params, 'YES')
//   }

//   GetContactAddressDetails(contactId) {
//     debugger;
//     const params = new HttpParams().set('contactId', contactId);

//     return this.getAPI('/Common/GetContactAddressDetails', params, 'YES');
//   }

//   GetContactInformationDetails(contactId) {
//     const params = new HttpParams().set('contactId', contactId);

//     return this.getAPI('/Common/GetContactInformationDetails', params, 'YES');
//   }
//   GetforemenAmountDetails(groupcode): Observable<any> {
//     const params = new HttpParams().set('localSchema', this.getschemaname()).set('groupcode', groupcode);
//     return this.getAPI('/Common/getformencommissionandmaximumByGroupCode', params, 'YES');
//   }
//   GetforemenAmountDetailsbygroupid(chitgroupid,branchschema): Observable<any> {
//     const params = new HttpParams().set('localSchema',branchschema ).set('chitgroupid', chitgroupid);
//     return this.getAPI('/Common/getformencommissionandmaximumByGroupid', params, 'YES');
//   }
//   GetSubscriberDues(LocalSchema, groupcode, ticketno, transactiondate) {
//     const params = new HttpParams().set('LocalSchema', LocalSchema).set('groupcode', groupcode).set('ticketno', ticketno).set('transactiondate', transactiondate);

//     return this.getAPI('/Common/GetSubscriberDuesDetails', params, 'YES');
//   }

//   GetSubscriberDocketSheet(LocalSchema, chitgroupid, ticketno) {
//     const params = new HttpParams().set('LocalSchema', LocalSchema).set('chitgroupid', chitgroupid).set('ticketno', ticketno);

//     return this.getAPI('/Common/GetSubscriberDocketSheet', params, 'YES');
//   }

//   GetGroupCodesForForm13(LocalSchema,caoschema, fromdate, todate,typevalue) {
//     const params = new HttpParams().set('localschema', LocalSchema).set('caoschema', caoschema).set('fromdate', fromdate).set('todate', todate).set('type', typevalue);
//     return this.getAPI('/ChitTransactions/ChitReports/getsubscribergroupcodesfortransfers', params, 'YES');
//   }

//   GetTicketNoForForm13(caoschema, chitgroupid,typevalue,fromdate, todate) {
//     const params = new HttpParams().set('BranchSchema',this.getschemaname()).set('caoschema', caoschema).set('chitgroupId', chitgroupid).set('type', typevalue).set('fromdate', fromdate).set('todate', todate);
//     return this.getAPI('/ChitTransactions/ChitReports/GetSubscriberTransferTicketnos', params, 'YES');
//   }

//   GetTransferData(chitgroupid, ticketno, caoschema, typevalue,fromdate,todate) {
//     const params = new HttpParams().set('BranchSchema',this.getschemaname()).set('chitgroupId', chitgroupid).set('ticketno', ticketno).set('caoschema', caoschema).set('type', typevalue)
//     .set('fromdate', fromdate).set('todate', todate);
//     return this.getAPI('/ChitTransactions/ChitReports/GetSubscriberAndAssignmentTransferData', params, 'YES');
//   }
//  GetTerminationReport(localSchema, branchschema, fromdate, todate, ReportType) {
//   const params = new HttpParams().set('localSchema', localSchema).set('branchschema', branchschema).set('fromdate', fromdate).set('todate', todate).set('ReportType', ReportType);
//   return this.getAPI('/ChitTransactions/ChitReports/GetTerminationReportDetails', params, 'YES');
// }
//   GetRemovalData(chitgroupid, ticketno, caoschema,fromdate,todate) {
//     const params = new HttpParams().set('BranchSchema',this.getschemaname()).set('chitgroupId', chitgroupid).set('ticketno', ticketno).set('caoschema', caoschema)
//     .set('fromdate', fromdate).set('todate', todate);
//     return this.getAPI('/ChitTransactions/ChitReports/GetSubscriberAndAssignmentRemovalData', params, 'YES');
//   }

//   GetContactDetailsByContactID(LocalSchema, contactid) {
//     const params = new HttpParams().set('LocalSchema', LocalSchema).set('contactid', contactid);
//     return this.getAPI('/Common/GetContactDetailsByContactID', params, 'YES');
//   }
//   Getchitvalue(): Observable<any> {
//     return this.getAPI('/Common/Getchitvalue', '', 'NO');
//   }
//   Getchitvalue_vacant_subscriber(): Observable<any> {
//     return this.getAPI('/Common/Getchitvalue_vacant_subscriber', '', 'NO');
//   }
//   Getchitperiod(): Observable<any> {
//     return this.getAPI('/Common/Getchitperiod', '', 'NO');
//   }
//   GetFixedBidAuctionnumbers(chitgroupid, Branchschema) {
//     const params = new HttpParams().set('chitgroupid', chitgroupid).set('Branchschema', Branchschema);
//     return this.getAPI('/Configuration/GlobalConfiguration/GetFixedBidAuctionnumbers', params, 'YES');
//   }
//   GetInchargeValidateStatus(caoschema): Observable<any> {
//     const params = new HttpParams().set('caoschema', caoschema);
//     return this.getAPI1('/Subscriber/GetInchargeValidateStatus', params, 'YES');
//   }

//   postAPIpayment(apiPath, data) {

//     let urldata = environment.apiURL;
//     let httpHeaders = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Cache-Control': 'no-cache'
//     });
//     httpHeaders.append('Access-Control-Allow-Origin', '/*');

//     let options = {
//       headers: httpHeaders
//     };
//     return this.http.get(urldata).pipe(
//       mergeMap(json => this.http.post("https://paytm-api.kapilchits.in/api" + apiPath, data, options).map(this.extractData).catch(this.handleError)));

//   }

//   postAPI1(apiPath, data) {

//     let urldata = environment.apiURL;
//     let httpHeaders = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Cache-Control': 'no-cache'
//     });
//     httpHeaders.append('Access-Control-Allow-Origin', '/*');

//     let options = {
//       headers: httpHeaders
//     };
//     return this.http.get(urldata).pipe(
//       mergeMap(json => this.http.post(json[0]['ApiHostUrl'] + apiPath, data, options)));

//   }

//   postReportsAPI(apiPath, data) {

//     let urldata = environment.apiURL;
//     let httpHeaders = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Cache-Control': 'no-cache'
//     });
//     httpHeaders.append('Access-Control-Allow-Origin', '/*');

//     let options = {
//       headers: httpHeaders
//     };
//     return this.http.get(urldata).pipe(
//       mergeMap(json => this.http.post(json[1]['ReportsApiHostUrl'] + apiPath, data, options).map(this.extractData).catch(this.handleError)));

//   }
// postAPI1(apiPath, data) {

//     let urldata = environment.apiURL;
//     let httpHeaders = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Cache-Control': 'no-cache'
//     });
//     httpHeaders.append('Access-Control-Allow-Origin', '/*');

//     let options = {
//       headers: httpHeaders
//     };
//     return this.http.get(urldata).pipe(
//       mergeMap(json => this.http.post(json[0]['ApiHostUrl'] + apiPath, data, options)));

//   }
