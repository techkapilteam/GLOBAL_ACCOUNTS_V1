// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class ContactmasterService {
  
// }
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CommonService } from '../common.service';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ContactmasterService {
  editinfo = [];

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });

  loadContactForm = new EventEmitter();
  constructor(private http: HttpClient, private _CommonService: CommonService) { }

  saveContactIndividual(data:any, formtype:any): Observable<any> {
    debugger;
   

      if (formtype == 'Save')
        return this._CommonService.postAPI('/ContactMaster/Savecontact', data);
      else
        return this._CommonService.postAPI('/ContactMaster/UpdateContact', data) .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        );
   
  }



   
  saveReferralDetails(data:any): Observable<any> {
  
      return this._CommonService.postAPI('/ContactMore/SaveContactReferral', data) .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        );
    
  }

  emptyarray():any{
    try {
      const params = new HttpParams().set('branchschema', '')
      return this._CommonService.getAPI('/GroupConfiguration/emptyarray', params, 'YES');
    }
    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
  }

  GetRelatedContacts(referenceid:any): Observable<any> {
   
      const params = new HttpParams().set('refid', referenceid);
      return this._CommonService.getAPI('/contactmaster/GetRelatedContacts', params, 'YES') .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
 
    
  }

  GetEmployeeSubscribersInformation(refid:any): Observable<any> {

      const params = new HttpParams().set('refid', refid);
      return this._CommonService.getAPI('/contactmaster/GetEmployeeSubscribersInformation', params, 'YES') .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
   
  }
  GetEmployeeOnlyData(refernceid:any): Observable<any>{
   
      const params = new HttpParams().set('refernceid', refernceid).set('localschema',this._CommonService.getschemaname());
      return this._CommonService.getAPI('/ContactMore/GetEmployeeOnlyData', params, 'YES') .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
    
  }

  saveEmployeeDetails(data:any): Observable<any> {

      return this._CommonService.postAPI('/ContactMore/SaveContactEmployee', data) .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )

  }
  saveAdvocateDetails(data:any): Observable<any> {
  
      return this._CommonService.postAPI('/ContactMore/SaveContactAdvocate', data) .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )

    
  }
  saveSupplierDetails(data:any): Observable<any> {
 
      return this._CommonService.postAPI('/ContactMore/SaveContactSupplier', data) .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }
  saveAddressType(data:any): Observable<any> {

      return this._CommonService.postAPI('/Common/SaveAddressType', data) .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }
  saveTypeofEnterprise(data:any): Observable<any> {

      return this._CommonService.postAPI('/Common/SaveEnterpriseType', data) .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }
  getRelationShip(): Observable<any> {
    return this._CommonService.getAPI('/Common/getRelationShip', '', 'NO');
  }
  getBranches(): Observable<any> {
    return this._CommonService.getAPI('/Common/GetBranchNames', '', 'NO');
  }
  getInterBranches(fromdate:any,todate:any,branchschema:any): Observable<any> {
    const params = new HttpParams().set('branchschema', branchschema).set('fromdate',fromdate).set('todate',todate);
    return this._CommonService.getAPI('/Common/getInterBranches', params, 'YES');
  }
  getRoles(): Observable<any> {
    return this._CommonService.getAPI('/Common/Getroles', '', 'NO');
  }
  getQualifications(): Observable<any> {
    return this._CommonService.getAPI('/Configuration/GlobalConfiguration/ViewQualificationDetails', '', 'NO');
  }
  saveNatureofBussiness(data:any): Observable<any> {

      return this._CommonService.postAPI('/Common/SaveBusinessTypes', data) .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }
  GetAgentSubscribersInformation(refid:any): Observable<any> {
    
      const params = new HttpParams().set('refid', refid);
      return this._CommonService.getAPI('/contactmaster/GetAgentSubscribersInformation', params, 'YES') .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }

  checkContactIndividual(data:any): Observable<any> {
    
      return this._CommonService.postAPI('/ContactMaster/GetPersonCount', data) .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }
  checkpancardno(data:any): Observable<any> {
   
      const params = new HttpParams().set('docrefno', data);
      return this._CommonService.getAPI('/ContactMaster/GetpancardCount', params, 'YES') .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }
  checkTypeofEnterprise(data:any): Observable<any> {

 
      const params = new HttpParams().set('enterprisetype', data);

      return this._CommonService.getAPI('/Common/checkInsertEnterpriseTypeDuplicates', params, 'YES') .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }

  checkNatureofBussiness(data:any): Observable<any> {

 
      const params = new HttpParams().set('businesstype', data);
      return this._CommonService.getAPI('/Common/checkInsertBusinessTypesDuplicates', params, 'YES') .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }

  deleteContactIndividual(data:any): Observable<any> {
    

      return this._CommonService.postAPI('/ContactMaster/DeleteContact', data) .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }


  getContactTotalDetails(data:any): Observable<any> {

    

      const params = new HttpParams().set('Type', data);
      return this._CommonService.getAPI('/ContactMaster/GetContactDetails', params, 'YES') .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }
  
  GetElectricityServiceproviders(data:any): Observable<any> {

      const params = new HttpParams().set('statename', data);
      return this._CommonService.getAPI('/Verification/GetElectricityServiceproviders', params, 'YES') .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }
  gettitleDetails(): Observable<any> {
    
      return this._CommonService.getAPI('/Common/getContacttitles', '', 'NO') .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }
  // getRelationtitles(): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.getAPI('/Common/getRelationtitles', '', 'NO');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getDocumentProofs(): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.getAPI('/Common/getDocumentProofs', '', 'NO');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // GetElectricityStates(): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.getAPI('/Verification/GetElectricityStates', '', 'NO');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getTypeofEnterprise(): Observable<any> {

  //   try {
  //     return this._CommonService.getAPI('/Common/GetEnterpriseType', '', 'NO');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  // getdesignations(): Observable<any> {

  //   try {
  //     return this._CommonService.getAPI('/Common/GetDesignations', '', 'NO');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getNatureofBussiness(): Observable<any> {

  //   try {
  //     return this._CommonService.getAPI('/Common/GetBusinessTypes', '', 'NO');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getAddressTypeDetails(contactType): Observable<any> {
  //   debugger
  //   try {
  //     //return this.http.get(this._CommonService.apiURL + '/loans/masters/contactmaster/GetAddressType?contactype=' + contactType);
  //     const params = new HttpParams().set('contactype', contactType);
  //     return this._CommonService.getAPI('/Common/GetAddressType', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  // checkAddressType(addresstype, contactype): Observable<any> {
  //   try {
  //     let options = {
  //       headers: this.httpHeaders
  //     };

  //     const params = new HttpParams().set('addresstype', addresstype).set('contactype', contactype);
  //     return this._CommonService.getAPI('/Common/checkInsertAddressTypeDuplicates', params, 'YES');

  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  getCountryDetails(): Observable<any> {
  
      return this._CommonService.getAPI('/Common/getCountry', '', 'NO') .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }

getcountrys(GlobalSchema:any): Observable<any> {
      debugger;
    const params = new HttpParams().set('GlobalSchema', GlobalSchema);
    return this._CommonService.getAPI('/Accounts/getCountry', params, 'YES');
  }

getstates(GlobalSchema:any,id:any): Observable<any> {
      debugger;
    const params = new HttpParams().set('GlobalSchema', GlobalSchema).set('id', id);
    return this._CommonService.getAPI('/Accounts/getstate', params, 'YES');
  }

getDistrict(GlobalSchema:any,id:any): Observable<any> {
      debugger;
    const params = new HttpParams().set('GlobalSchema', GlobalSchema).set('id', id);
    return this._CommonService.getAPI('/Accounts/getDistrict', params, 'YES');
  }

  getSateDetails(countryid: number): Observable<any> {

   
      const params = new HttpParams().set('id', countryid.toString());
      return this._CommonService.getAPI('/Common/getstate', params, 'YES') .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }
  getDistrictDetails(stateid:any): Observable<any> {

   
      const params = new HttpParams().set('id', stateid);
      return this._CommonService.getAPI('/Common/getDisrict', params, 'YES') .pipe(
          catchError((e:any) => {
            this._CommonService.showErrorMessage(e);
            return throwError(() => e);
          })
        )
  }


  // loadEditInformation(_contacttype, _referecnceid) {
  //   if (_contacttype != '' && _referecnceid != '') {
  //     this.editinfo = [{ referecnceid: _referecnceid, contacttype: _contacttype }]
  //   }
  //   else {
  //     this.editinfo = [];
  //   }
  // }

  // getEditInformation(): any {

  //   return this.editinfo;

  // }
  // getContactDetailsByID(referenceid): Observable<any> {
  //   try {
  //     const params = new HttpParams().set('refernceid', referenceid);
  //     return this._CommonService.getAPI('/ContactMaster/ViewContact', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  // getContactDetailsMoreByID(referenceid): Observable<any> {
  //   try {
  //     const params = new HttpParams().set('refernceid', referenceid);
  //     return this._CommonService.getAPI('/ContactMore/ViewContactDetails', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getContactDetailsrefid(referenceid): Observable<any> {
  //   try {
  //     const params = new HttpParams().set('refid', referenceid);
  //     return this._CommonService.getAPI('/contactmaster/GetcontactviewByid', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  // GetContactSubscribersInformation(referenceid): Observable<any> {
  //   try {
  //     const params = new HttpParams().set('refid', referenceid);
  //     return this._CommonService.getAPI('/contactmaster/GetContactSubscribersInformation', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  // GetContactGuarantorInformation(referenceid): Observable<any> {
  //   try {
  //     const params = new HttpParams().set('refid', referenceid);
  //     return this._CommonService.getAPI('/contactmaster/GetContactGuarantorInformation', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  // getSubscriberGuarantorData(branchschema, groupcode, ticketno) {
  //   try {
  //     const params = new HttpParams().set('branchschema', branchschema).set('groupcode', groupcode).set('ticketno', ticketno);
  //     return this._CommonService.getAPI('/contactmaster/GetSubscriberGuarantorInformation', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  // getContactDetailsReferralByID(referenceid): Observable<any> {
  //   try {
  //     const params = new HttpParams().set('refernceid', referenceid);
  //     return this._CommonService.getAPI('/ContactMore/ViewReferralContactDetails', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getContactDetailsEmployeeByID(referenceid, branchschema): Observable<any> {
  //   try {
  //     const params = new HttpParams().set('refernceid', referenceid).set('localschema', branchschema);
  //     return this._CommonService.getAPI('/ContactMore/ViewEmployeeContactDetails', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }


  // getIntoducerDetails(): Observable<any> {
  //   return this._CommonService.getAPI('/Subscriber/GetInterducedDetails', '', 'NO')
  // }
  // getdueslist(data): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.postAPI('/Transactions/ChitReports/getdueslist', data);

  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getvacentchitsales(data): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.postAPI('/Transactions/ChitReports/getvacentchitsales', data);

  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // gettrdealy(data): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.postAPI('/Transactions/ChitReports/gettrdealy', data);

  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getbidpaidregister(data): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.postAPI('/Transactions/ChitReports/getbidpayableregister', data);

  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getvacentchitabstract(data): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.postAPI('/Transactions/ChitReports/getvacentchitabstract', data);

  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // GetNewGroupsVacantAbstract(data): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.postAPI('/Transactions/ChitReports/GetNewGroupsVacantAbstract', data);

  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getgroupwiseledger(data): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.postAPI('/Transactions/ChitReports/getgroupwiseledger', data);

  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getcollectiondetails(data): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.postAPI('/Transactions/ChitReports/getcollectionlist', data);

  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getBranchtarget(data): Observable<any> {
  //   debugger;
   
  //     // const options = new HttpParams().set('branchtarget',branchtarget).set('schemaname', schemaname).set('KgmsSchema',KgmsSchema)
  //     // return this._CommonService.postAPI('/Transactions/ChitReports/getbranchtaget', options);
  //     try {
  //     //  const options = new HttpParams().set('branchtarget',branchtarget).set('schemaname', schemaname).set('KgmsSchema',KgmsSchema)
  //        return this._CommonService.postAPI('/Transactions/ChitReports/getbranchtaget', data);
  //       // const params = new HttpParams().set("branchtarget",branchtarget).set('schemaname',schemaname).set('KgmsSchema',KgmsSchema);
  //       // return this._CommonService.getAPI('/Transactions/ChitReports/getbranchtaget', params, 'YES');
  //     }
    
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  // getcollectionBranchtarget(data): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.postAPI('/Transactions/ChitReports/getcollectionbranchtaget', data);

  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getgroupcodes(schemaname): Observable<any> {
  //   try {
  //     const params = new HttpParams().set("localschema",schemaname);
  //     return this._CommonService.getAPI('/Transactions/ChitReports/getgroupcodes', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getGroupcodes(fromdate,todate,branchname,localschema): Observable<any> {
  //   try {
  //     const params = new HttpParams().set("fromdate",fromdate).set("todate",todate).set("branchschema",branchname).set("localschema",localschema);
  //     return this._CommonService.getAPI('/ChitTransactions/ChitReports/getreportgroupcodes', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // GetgridData(fromdate,todate,groupcode,loginBranchname,localschema,branchschema): Observable<any> {
  //   try {
  //     const params = new HttpParams().set("fromdate",fromdate).set("todate",todate).set("groupcode",groupcode).set("Branchname",loginBranchname)
  //     .set("localschema",localschema).set("branchschema",branchschema);
  //     return this._CommonService.getAPI('/ChitTransactions/ChitReports/getgridgroupdetails', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // GetCompanychitData(fromdate,todate,groupcode,branchschema): Observable<any> {
  //   try {
  //     const params = new HttpParams().set("fromdate",fromdate).set("todate",todate).set("groupcode",groupcode).set("branchschema",branchschema);
  //     return this._CommonService.getAPI('/ChitTransactions/ChitReports/getcompanychitdetails', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  
  // GetReauctionMinutesChitsInfo(fromdate,todate,groupcode,branchschema): Observable<any> {
  //   try {
  //     const params = new HttpParams().set("fromdate",fromdate).set("todate",todate).set("groupcode",groupcode).set("branchschema",branchschema);
  //     return this._CommonService.getAPI('/ChitTransactions/ChitReports/getReauctionMinuteschitsinfo', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }


  // getAuctiominuterReport(groupcode, ticketno,AuctionNo,branchschema,companychitstatus) {
   
  //   const params = new HttpParams().set('groupcode', groupcode).set('ticketno', ticketno).set('auctionno', AuctionNo).set('branchschema', branchschema).set('companychitstatus', companychitstatus);
  //   return this._CommonService.getAPI('/ChitTransactions/ChitReports/getgridgroupreportdetails', params, 'YES');
  // }
  // getreauctionminutesreportdetails(groupcode, ticketno,AuctionNo,branchschema) {
   
  //   const params = new HttpParams().set('groupcode', groupcode).set('ticketno', ticketno).set('auctionno', AuctionNo).set('branchschema', branchschema);
  //   return this._CommonService.getAPI('/ChitTransactions/ChitReports/getreauctionminutesreportdetails', params, 'YES');
  // }
  // getchitregistreAdd(LocalSchema, groupcode, ticketno) {
  //   const params = new HttpParams().set('BranchSchema', LocalSchema).set('chitgroup_id', groupcode).set('ticketno', ticketno);
  //   return this._CommonService.getAPI('/ChitTransactions/getchitagreementDetilas', params, 'YES');

  // }
  // getgroupcodesforledger(): Observable<any> {
  //   try {
  //     const params = new HttpParams().set("localschema", sessionStorage.getItem('schemaname'));
  //     return this._CommonService.getAPI('/Transactions/ChitReports/getgroupwisegroupcodes', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  // getreauctionminutesgroupcodes(fromdate,todate,branchname): Observable<any> {
  //   try {
  //     const params = new HttpParams().set("fromdate",fromdate).set("todate",todate).set("branchschema",branchname);
  //     return this._CommonService.getAPI('/ChitTransactions/ChitReports/getreauctionminutesgroupcodes', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  // getgroupcodesubscribres(reporttype, name,caoname): Observable<any> {
  //   try {
  //     const params = new HttpParams().set("localschema", sessionStorage.getItem('schemaname')).set("reporttype", reporttype).set("name", name).set('caoname',caoname);
  //     return this._CommonService.getAPI('/Transactions/ChitReports/getgroupcodessubscribers', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // getsubscribers(schemaname,reporttype,branchcode,schemacode): Observable<any> {
  //   try {
  //     debugger;
  //     const params = new HttpParams().set("localschema", schemaname).set("reporttype", reporttype).set("branchcode", branchcode).set("schemacode", schemacode);
  //     return this._CommonService.getAPI('/Transactions/ChitReports/getchitsubscribernames', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  // GetContactDetailsList() {
  //   try {
  //     // const params = new HttpParams().set('type',viewname);
  //     return this._CommonService.getAPI('/contactmaster/GetcontactviewByName', '', 'NO');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // GetContactDetailsviewList(viewname, set, tabname) {
  //   try {
  //     const params = new HttpParams().set('type', viewname).set('endindex', set).set('tabname', tabname);
  //     return this._CommonService.getAPI('/contactmaster/GetcontactviewByName', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }





  
  // Getnoofrecords(tabname) {
  //   try {
  //     const params = new HttpParams().set('tab', tabname);
  //     return this._CommonService.getAPI('/contactmaster/Getnoofrecords', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  // Getnoofrecordsbasedonsearch(viewname, tabname) {
  //   try {
  //     const params = new HttpParams().set('type', viewname).set('tabname', tabname);
  //     return this._CommonService.getAPI('/contactmaster/Getnoofrecordssearchvalue', params, 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }


  // GetContactDetailsviewListForSearchEnginePDF() {
  //   try {
  //     // const params = new HttpParams().set('type', viewname).set('endindex', set);
  //     return this._CommonService.getAPI('/contactmaster/GetContactSubscribersInformationForPDF', '', 'NO');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }


  // _downloadSearchEngineReportPrintOrPdf(reportname, ContactListDataForPDF, printorpdf) {
  //   debugger;
  //   var doc = new jsPDF();
  //   let pageheight = doc.internal.pageSize.getHeight() - 15;
  //   let contentheight = 270;
  //   this.companyHeaderPrint(doc, reportname);
  //   let rupeeImage = this._CommonService._getRupeeSymbol();
  //   let currencyformat = this._CommonService.currencysymbol;

  //   let header1height = 55;
  //   let header1width = 10;
  //   let header2width = 25;

  //   let header1 = "Branch              ";
  //   doc.text(header1width, header1height, header1);
  //   header1width = header1width + 35

  //   header1 = "Satus   ";
  //   doc.text(45, header1height, header1);
  //   header1width = header1width + 35

  //   header1 = "Id/GroupCode   ";
  //   doc.text(70, header1height, header1);
  //   header1width = header1width + 35

  //   header1 = "Name   ";
  //   doc.text(120, header1height, header1);
  //   header1width = header1width + 35

  //   header1 = "Surname   ";
  //   doc.text(145, header1height, header1);
  //   header1width = header1width + 35

  //   header1 = "Father Name   ";
  //   doc.text(180, header1height, header1);
  //   header1width = header1width + 35

  //   header1height = header1height + 5  //header1height=60
  //   doc.line(5, header1height, 297, header1height) // horizontal line
  //   header1height = header1height + 5  // header1height=65
  //   let hearder2 = "Future Liability   ";
  //   doc.text(header2width, header1height, hearder2);
  //   header2width = header2width + 70

  //   hearder2 = "Due Amount   ";
  //   doc.text(header2width, header1height, hearder2);
  //   header2width = header2width + 65;

  //   hearder2 = "Date Of Birth   ";
  //   doc.text(header2width, header1height, hearder2);
  //   header1height = header1height + 5  //header1height=70
  //   doc.line(5, header1height, 297, header1height) // horizontal line

  //   for (var a = 0; a < ContactListDataForPDF.length; a++) {

  //     if (a > 0) {
  //       doc.addPage();
  //       this.companyHeaderPrint(doc, reportname);

  //       let header1height = 55;
  //       let header1width = 10;
  //       let header2width = 25;

  //       let header1 = "Branch              ";
  //       doc.text(header1width, header1height, header1);
  //       header1width = header1width + 35;

  //       header1 = "Satus   ";
  //       doc.text(45, header1height, header1);
  //       header1width = header1width + 35;

  //       header1 = "Id/GroupCode   ";
  //       doc.text(70, header1height, header1);
  //       header1width = header1width + 35;

  //       header1 = "Name   ";
  //       doc.text(120, header1height, header1);
  //       header1width = header1width + 35;

  //       header1 = "Surname   ";
  //       doc.text(145, header1height, header1);
  //       header1width = header1width + 35;

  //       header1 = "Father Name   ";
  //       doc.text(180, header1height, header1);
  //       header1width = header1width + 35;

  //       header1height = header1height + 5  //header1height=60
  //       doc.line(5, header1height, 297, header1height) // horizontal line
  //       header1height = header1height + 5  // header1height=65
  //       hearder2 = "Future Liability   ";
  //       doc.text(header2width, header1height, hearder2);
  //       header2width = header2width + 70;

  //       hearder2 = "Due Amount   ";
  //       doc.text(header2width, header1height, hearder2);
  //       header2width = header2width + 65;

  //       hearder2 = "Date Of Birth   ";
  //       doc.text(header2width, header1height, hearder2);
  //       header1height = header1height + 5  //header1height=70
  //       doc.line(5, header1height, 297, header1height) // horizontal line

  //       doc.text('SEARCH RESULT FOR ' + ContactListDataForPDF[a].pContactName.toUpperCase() + '', 65, 40);

  //       for (var b = 0; b < ContactListDataForPDF[a].pcontactsubscriberlist.length; b++) {

  //         if (header1height < contentheight) {
  //           header1width = 10;
  //           header1height = header1height + 10 //header1height=80

  //           doc.text(header1width, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].branchname);
  //           header1width = header1width + 35;
  //           doc.text(45, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].chitstatus);
  //           header1width = header1width + 35;
  //           doc.text(70, header1height,
  //             ContactListDataForPDF[a].pcontactsubscriberlist[b].groupcode + "-" + ContactListDataForPDF[a].pcontactsubscriberlist[b].ticketno);
  //           header1width = header1width + 35;
  //           doc.text(120, header1height,
  //             ContactListDataForPDF[a].pContactName);
  //           header1width = header1width + 35;
  //           doc.text(145, header1height,
  //             ContactListDataForPDF[a].pContactsurname);
  //           header1width = header1width + 35;
  //           doc.text(180, header1height, ContactListDataForPDF[a].pFatherName);
  //           header1width = header1width + 35;
  //           header1height = header1height + 10 //header1height=80
  //           header2width = 25;

  //           let futureliability = this._CommonService.currencyFormat(ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount);
  //           futureliability = this._CommonService.convertAmountToPdfFormat(futureliability);
  //           doc.text(header2width, header1height, futureliability.toString());
  //           if (currencyformat == "₹") {
  //             doc.addImage(rupeeImage, header2width - 3, header1height - 2.5, 2, 2.3);
  //           }
  //           header2width = header2width + 70;
  //           let dueamount = this._CommonService.currencyFormat(ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount);
  //           dueamount = this._CommonService.convertAmountToPdfFormat(dueamount);
  //           doc.text(header2width, header1height, dueamount.toString());
  //           if (currencyformat == "₹") {
  //             doc.addImage(rupeeImage, header2width - 3, header1height - 2.5, 2, 2.3);
  //           }
  //           header2width = header2width + 65;
  //           if (ContactListDataForPDF[a].pDateofbirth != "") {
  //             debugger;
  //             let date = this._CommonService.getFormatDateGlobal(ContactListDataForPDF[a].pDateofbirth)
  //             doc.text(header2width, header1height, this._CommonService.getFormatDateGlobal(ContactListDataForPDF[a].pDateofbirth));
  //           }

  //         }
  //         else {

  //           doc.addPage();

  //           header1height = 10;
  //           header1width = 10;
  //           header2width = 25;

  //           let header1 = "Branch              ";
  //           doc.text(header1width, header1height, header1);
  //           header1width = header1width + 35;

  //           header1 = "Satus   ";
  //           doc.text(45, header1height, header1);
  //           header1width = header1width + 35;

  //           header1 = "Id/GroupCode   ";
  //           doc.text(70, header1height, header1);
  //           header1width = header1width + 35;

  //           header1 = "Name   ";
  //           doc.text(120, header1height, header1);
  //           header1width = header1width + 35;

  //           header1 = "Surname   ";
  //           doc.text(145, header1height, header1);
  //           header1width = header1width + 35;

  //           header1 = "Father Name   ";
  //           doc.text(180, header1height, header1);
  //           header1width = header1width + 35;

  //           header1height = header1height + 5  //header1height=60
  //           doc.line(5, header1height, 297, header1height) // horizontal line
  //           header1height = header1height + 5  // header1height=65
  //           hearder2 = "Future Liability   ";
  //           doc.text(header2width, header1height, hearder2);
  //           header2width = header2width + 70;

  //           hearder2 = "Due Amount   ";
  //           doc.text(header2width, header1height, hearder2);
  //           header2width = header2width + 65;

  //           hearder2 = "Date Of Birth   ";
  //           doc.text(header2width, header1height, hearder2);
  //           header1height = header1height + 5  //header1height=70
  //           doc.line(5, header1height, 297, header1height) // horizontal line

  //           header1height = header1height + 10 //header1height=80            
  //           doc.text(header1width, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].branchname);
  //           header1width = header1width + 35;
  //           doc.text(45, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].chitstatus);
  //           header1width = header1width + 35;
  //           doc.text(70, header1height,
  //             ContactListDataForPDF[a].pcontactsubscriberlist[b].groupcode + "-" + ContactListDataForPDF[a].pcontactsubscriberlist[b].ticketno);
  //           header1width = header1width + 35;
  //           doc.text(120, header1height,
  //             ContactListDataForPDF[a].pContactName);
  //           header1width = header1width + 35;
  //           doc.text(145, header1height,
  //             ContactListDataForPDF[a].pContactsurname);
  //           header1width = header1width + 35;
  //           doc.text(180, header1height, ContactListDataForPDF[a].pFatherName);
  //           header1width = header1width + 35;
  //           header1height = header1height + 10 //header1height=80
  //           header2width = 25;
  //           // doc.text(header2width, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount.toString());
  //           // header2width = header2width + 70;
  //           // doc.text(header2width, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount.toString());
  //           let futureliability = this._CommonService.currencyFormat(ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount);
  //           futureliability = this._CommonService.convertAmountToPdfFormat(futureliability);
  //           doc.text(header2width, header1height, futureliability.toString());
  //           if (currencyformat == "₹") {
  //             doc.addImage(rupeeImage, header2width - 3, header1height - 2.5, 2, 2.3);
  //           }
  //           header2width = header2width + 70;
  //           let dueamount = this._CommonService.currencyFormat(ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount);
  //           dueamount = this._CommonService.convertAmountToPdfFormat(dueamount);
  //           doc.text(header2width, header1height, dueamount.toString());
  //           if (currencyformat == "₹") {
  //             doc.addImage(rupeeImage, header2width - 3, header1height - 2.5, 2, 2.3);
  //           }

  //           header2width = header2width + 65;

  //           if (ContactListDataForPDF[a].pDateofbirth != "") {
  //             debugger;
  //             let date = this._CommonService.getFormatDateGlobal(ContactListDataForPDF[a].pDateofbirth)
  //             doc.text(header2width, header1height, this._CommonService.getFormatDateGlobal(ContactListDataForPDF[a].pDateofbirth));
  //           }

  //         }

  //       }


  //     }
  //     else {
  //       doc.text('SEARCH RESULT FOR ' + ContactListDataForPDF[a].pContactName.toUpperCase() + '', 65, 40);
  //       for (var b = 0; b < ContactListDataForPDF[a].pcontactsubscriberlist.length; b++) {

  //         if (header1height < contentheight) {

  //           header1width = 10;
  //           header1height = header1height + 10 //header1height=80

  //           doc.text(header1width, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].branchname);
  //           header1width = header1width + 35
  //           doc.text(45, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].chitstatus);
  //           header1width = header1width + 35
  //           doc.text(70, header1height,
  //             ContactListDataForPDF[a].pcontactsubscriberlist[b].groupcode + "-" + ContactListDataForPDF[a].pcontactsubscriberlist[b].ticketno);
  //           header1width = header1width + 35
  //           doc.text(120, header1height,
  //             ContactListDataForPDF[a].pContactName);
  //           header1width = header1width + 35
  //           doc.text(145, header1height,
  //             ContactListDataForPDF[a].pContactsurname);
  //           header1width = header1width + 35
  //           doc.text(180, header1height, ContactListDataForPDF[a].pFatherName);
  //           header1width = header1width + 35
  //           header1height = header1height + 10 //header1height=80
  //           header2width = 25;
  //           // doc.text(header2width, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount.toString());
  //           // header2width = header2width + 70
  //           // doc.text(header2width, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount.toString());
  //           let futureliability = this._CommonService.currencyFormat(ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount);
  //           futureliability = this._CommonService.convertAmountToPdfFormat(futureliability);
  //           doc.text(header2width, header1height, futureliability.toString());
  //           if (currencyformat == "₹") {
  //             doc.addImage(rupeeImage, header2width - 3, header1height - 2.5, 2, 2.3);
  //           }
  //           header2width = header2width + 70;
  //           let dueamount = this._CommonService.currencyFormat(ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount);
  //           dueamount = this._CommonService.convertAmountToPdfFormat(dueamount);
  //           doc.text(header2width, header1height, dueamount.toString());
  //           if (currencyformat == "₹") {
  //             doc.addImage(rupeeImage, header2width - 3, header1height - 2.5, 2, 2.3);
  //           }

  //           header2width = header2width + 65
  //           if (ContactListDataForPDF[a].pDateofbirth != "") {
  //             debugger;
  //             let date = this._CommonService.getFormatDateGlobal(ContactListDataForPDF[a].pDateofbirth)
  //             doc.text(header2width, header1height, this._CommonService.getFormatDateGlobal(ContactListDataForPDF[a].pDateofbirth));
  //           }

  //         }
  //         else {

  //           doc.addPage();

  //           header1height = 10;
  //           header1width = 10;
  //           header2width = 25;

  //           let header1 = "Branch              ";
  //           doc.text(header1width, header1height, header1);
  //           header1width = header1width + 35;

  //           header1 = "Satus   ";
  //           doc.text(45, header1height, header1);
  //           header1width = header1width + 35;

  //           header1 = "Id/GroupCode   ";
  //           doc.text(70, header1height, header1);
  //           header1width = header1width + 35;

  //           header1 = "Name   ";
  //           doc.text(120, header1height, header1);
  //           header1width = header1width + 35;

  //           header1 = "Surname   ";
  //           doc.text(145, header1height, header1);
  //           header1width = header1width + 35;

  //           header1 = "Father Name   ";
  //           doc.text(180, header1height, header1);
  //           header1width = header1width + 35;

  //           header1height = header1height + 5  //header1height=60
  //           doc.line(5, header1height, 297, header1height) // horizontal line
  //           header1height = header1height + 5  // header1height=65
  //           hearder2 = "Future Liability   ";
  //           doc.text(header2width, header1height, hearder2);
  //           header2width = header2width + 70;

  //           hearder2 = "Due Amount   ";
  //           doc.text(header2width, header1height, hearder2);
  //           header2width = header2width + 65;
  //           hearder2 = "Date Of Birth   ";

  //           doc.text(header2width, header1height, hearder2);
  //           header1height = header1height + 5  //header1height=70
  //           doc.line(5, header1height, 297, header1height) // horizontal line
  //           header1height = header1height + 10 //header1height=80
  //           doc.text(header1width, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].branchname);
  //           header1width = header1width + 35;
  //           doc.text(45, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].chitstatus);
  //           header1width = header1width + 35;
  //           doc.text(70, header1height,
  //             ContactListDataForPDF[a].pcontactsubscriberlist[b].groupcode + "-" + ContactListDataForPDF[a].pcontactsubscriberlist[b].ticketno);
  //           header1width = header1width + 35;
  //           doc.text(120, header1height,
  //             ContactListDataForPDF[a].pContactName);
  //           header1width = header1width + 35;
  //           doc.text(145, header1height,
  //             ContactListDataForPDF[a].pContactsurname);
  //           header1width = header1width + 35;
  //           doc.text(180, header1height, ContactListDataForPDF[a].pFatherName);
  //           header1width = header1width + 35;
  //           header1height = header1height + 10; //header1height=80
  //           header2width = 25;
  //           // doc.text(header2width, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount.toString());
  //           // header2width = header2width + 70;
  //           // doc.text(header2width, header1height, ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount.toString());
  //           let futureliability = this._CommonService.currencyFormat(ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount);
  //           futureliability = this._CommonService.convertAmountToPdfFormat(futureliability);
  //           doc.text(header2width, header1height, futureliability.toString());
  //           if (currencyformat == "₹") {
  //             doc.addImage(rupeeImage, header2width - 3, header1height - 2.5, 2, 2.3);
  //           }
  //           header2width = header2width + 70;
  //           let dueamount = this._CommonService.currencyFormat(ContactListDataForPDF[a].pcontactsubscriberlist[b].dueamount);
  //           dueamount = this._CommonService.convertAmountToPdfFormat(dueamount);
  //           doc.text(header2width, header1height, dueamount.toString());
  //           if (currencyformat == "₹") {
  //             doc.addImage(rupeeImage, header2width - 3, header1height - 2.5, 2, 2.3);
  //           }

  //           header2width = header2width + 65;
  //           if (ContactListDataForPDF[a].pDateofbirth != "") {
  //             debugger;
  //             let date = this._CommonService.getFormatDateGlobal(ContactListDataForPDF[a].pDateofbirth)
  //             doc.text(header2width, header1height, this._CommonService.getFormatDateGlobal(ContactListDataForPDF[a].pDateofbirth));
  //           }
  //         }

  //       }

  //     }


  //   }






  //   if (printorpdf == "Pdf") {
  //     doc.save('' + reportname + '.pdf');
  //   }
  //   if (printorpdf == "Print") {
  //     this._CommonService.setiFrameForPrint(doc);
  //   }

  // }





  // companyHeaderPrint(doc, reportname) {

  //   var lMargin = 15; //left margin in mm
  //   var rMargin = 15; //right margin in mm
  //   var pdfInMM = 210;  // width of A4 in mm

  //   let Companyreportdetails = this._CommonService._getCompanyDetails();
  //   let totalPagesExp = '{total_pages_count_string}'
  //   let today = this._CommonService.pdfProperties("Date");
  //   let kapil_logo = this._CommonService.getKapilGroupLogo();
  //   //page header
  //   doc.setFontSize(15);
  //   doc.setFont("times");
  //   doc.addImage(kapil_logo, 'JPEG', 10, 5)
  //   doc.setFont("Times-Italic")
  //   doc.setTextColor('black');
  //   doc.setFontStyle('normal');
  //   doc.setFontSize(14);

  //   //company Header
  //   let address = this._CommonService.getcompanyaddress();
  //   doc.text(Companyreportdetails.pCompanyName, 60, 10);
  //   doc.setFontSize(8);
  //   doc.setTextColor('black');
  //   doc.text(address, 40, 15, 0, 0, 'left');
  //   if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
  //     doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 85, 20);
  //   }
  //   doc.setFontSize(14);
  //   doc.text(reportname, 87, 30);
  //   doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 150, 40);

  //   doc.setFont("times");
  //   doc.setTextColor("black");
  //   doc.setFontSize(10);
  //   doc.setFontStyle('normal');
  //   doc.line(5, 45, 297, 45) // horizontal line
  //   doc.setFontSize(13);

  // }

  // saveLADetails(data): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.postAPI('/ContactMore/SaveContactReferral', data);

  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }

  // updateMaxChitCount(contactid,maxcount): Observable<any> {
  //   debugger;
  //   try {
  //     return this._CommonService.postAPI('/ContactMaster/updateMaxChitCount?contactid='+contactid+'&maxcount='+maxcount, "");
  
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }
  // GetContactAdvanceSearchColumns(){
  //   debugger
  //   try {
  //     return this._CommonService.getAPI('/contactmaster/GetContactAdvanceSearchColumns', '', 'YES');
  //   }
  //   catch (e) {
  //     this._CommonService.showErrorMessage(e);
  //   }
  // }





}
