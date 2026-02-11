// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class SscagendsService {
  
// }


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { CommonService } from '../common.service';

@Injectable({
  providedIn: 'root'
})
export class SscagendsService {
  // employee enroll variable
  isEmployeeEnroll: any = '';
  //
  constructor(private _CommonService: CommonService) { }

  getSSCAgendaEmployeeDetails(searchtype:any, BranchId:any, sscagendatype:any): Observable<any> {
    debugger;
    const params = new HttpParams().set('searchtype', searchtype)
      .set('BranchId', BranchId).set('sscagendatype', sscagendatype).set('Branchschema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/Transactions/HRMSTransactions/getSSCAgendaEmployeeDetails', params, 'YES');
  }
  getEmployeeDetails(searchtype:any, BranchId:any): Observable<any> {
    debugger;
    const params = new HttpParams().set('searchtype', searchtype).set('Branchschema', this._CommonService.getschemaname()).set('BranchId', BranchId);

    return this._CommonService.getAPI('/Transactions/HRMSTransactions/getEmployeeDetails', params, 'YES');

  }
  getProcessApproveEmployes(searchtype:any, BranchId:any): Observable<any> {
    debugger;
    const params = new HttpParams().set('searchtype', searchtype).set('Branchschema', this._CommonService.getschemaname()).set('BranchId', BranchId);

    return this._CommonService.getAPI('/Transactions/HRMSTransactions/getProcessApproveEmployes', params, 'YES');

  }

  SaveSSCAgenda(data:any):any {
    try {
      debugger
      return this._CommonService.postAPI("/Transactions/HRMSTransactions/SaveSscAgenda", data)
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  //GetSSCAgendaExistingornot
  // Observable<any>
  GetSSCAgendaExistingornot(pSscAgendaType:any, pEmployeeContactId:any): any {
    try {
      const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname())
        .set('sscagendatype', pSscAgendaType).set('employeeid', pEmployeeContactId);
      return this._CommonService.getAPI("/Verification/GetSSCAgendaExistingornot", params, "YES")
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }



  
  // Get AllowanceTypes
  GetAllowanceTypes():any {
    try {
      //const params = new HttpParams().set('BranchSchema', this._commonService.getschemaname()).    
      return this._CommonService.getAPI("/Transactions/HRMSTransactions/GetAllowanceTypes", "params", "YES")
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  // GetExistingTypes
  GetExistingTypes() :any{
    try {
      const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname());
      return this._CommonService.getAPI("/Transactions/HRMSTransactions/GetExistingAdvanceTypes", params, "YES");
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  //SaveAllowanceDetails
  SaveAllowanceDetails(data:any) :any{
    try {
      return this._CommonService.postAPI("/Transactions/HRMSTransactions/SaveAllowanceDetails", data)
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }

  // update allowancedetails
  Updateallowancedetails(data:any) :any{
    try {
      return this._CommonService.postAPI("/Transactions/HRMSTransactions/Updateemployeeonrollallowance", data)
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }

  // update recovery details
  Updaterecoverydetails(data:any) :any{
    try {
      return this._CommonService.postAPI("/Transactions/HRMSTransactions/Updaterecoverydetails", data)
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }

 

  deleteallowancedetails(branchschema:any,employeeonrollallowanceid:any): Observable<any> {
    const params = new HttpParams().set('branchschema', branchschema).set('employeeonrollallowanceid', employeeonrollallowanceid);
    return this._CommonService.getAPI("/Transactions/HRMSTransactions/Deleteemployeeonrollallowance", params, 'YES');
  }
  deleterecoverydetails(branchschema:any,employeeonrollrecoveriesid:any): Observable<any> {
    const params = new HttpParams().set('branchschema', branchschema).set('employeecontactid', employeeonrollrecoveriesid);
    return this._CommonService.getAPI("/Transactions/HRMSTransactions/DeleteRecoveryDetails", params, 'YES');
  }
  

  //SaveAdvanceDetails
  SaveAdvanceDetails(data:any) :any{
    try {
      return this._CommonService.postAPI("/Transactions/HRMSTransactions/SaveAdvanceDetails", data)
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  // Get RecoveryTypes 
  GetAdvanceTypes() :any{
    try {
      return this._CommonService.getAPI("/Transactions/HRMSTransactions/GetAdvanceTypes", "params", "YES")
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  // Get RecoveryTypes 
  GetRecoveryTypes():any {
    try {
      return this._CommonService.getAPI("/Transactions/HRMSTransactions/GetRecoveryTypes", "params", "YES")
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  //SaveRecoveryDetails
  SaveRecoveryDetails(data:any):any {
    try {
      return this._CommonService.postAPI("/Transactions/HRMSTransactions/SaveRecoveryDetails", data)
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  getPolicyEmployeeDetails(BranchId:any): Observable<any> {
    debugger;
    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('BranchId', BranchId);

    return this._CommonService.getAPI('/Transactions/HRMSTransactions/getPolicyEmployeeDetails', params, 'YES');

  }
  //SavePolicy Details
  SavePolicyDetails(data:any) :any{
    try {
      return this._CommonService.postAPI("/Transactions/HRMSTransactions/SavePolicyDetails", data)
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  //Allowance Details for Grid
  GetAllowanceDetails(employeecontactid:any): Observable<any> {
    debugger;
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname()).set('employeecontactid', employeecontactid);

    return this._CommonService.getAPI('/Transactions/HRMSTransactions/GetAllowanceDetails', params, 'YES');

  }
  GetAdvanceDetails(employeecontactid:any): Observable<any> {
    debugger;
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname()).set('employeecontactid', employeecontactid);

    return this._CommonService.getAPI('/Transactions/HRMSTransactions/GetAdvanceDetails', params, 'YES');

  }
  GetRecoveriesDetails(employeecontactid:any): Observable<any> {
    debugger;
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname()).set('employeecontactid', employeecontactid);
    return this._CommonService.getAPI('/Transactions/HRMSTransactions/GetRecoveryDetails', params, 'YES');

  }

  Updateemployeeonrolladvance(data:any) :any{
    debugger
    try {
      // return this._CommonService.postAPI('/Transactions/HRMSTransactions/Updateemployeeonrolladvance', data);
      return this._CommonService.postAPI('/Transactions/HRMSTransactions/Updateemployeeonrolladvance', data);
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }

  Deleteemployeeonrolladvance(branchschema:any,employeeonrolladvanceid:any,userid:any,ipaddress:any): Observable<any> {
    const params = new HttpParams().set('branchschema', branchschema).set('employeeonrolladvanceid', employeeonrolladvanceid).set('userid', userid).set('ipaddress', ipaddress);
    return this._CommonService.getAPI("/Transactions/HRMSTransactions/Deleteemployeeonrolladvance", params, 'YES');
  }
  GetTDRecoveryTypes(date:any,branchname:any,formname:any,recoverytype:any):any {
    const params = new HttpParams().set('Branchname', branchname).set('Effecteddate', date).set('formname', formname).set('recoverytype', recoverytype);
    try {
      return this._CommonService.getAPI("/Transactions/HRMSTransactions/GetTargetDeductionpercentage", params, "YES")
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  SaveTargetDeductionDetails(data:any) :any{
    try {
      return this._CommonService.postAPI("/Transactions/HRMSTransactions/SaveRecoveryDetails", data)
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  GetTargetdeductionDetails(employeecontactid:any): Observable<any> {
    debugger;
    const params = new HttpParams().set('BranchSchema', this._CommonService.getschemaname()).set('employeecontactid', employeecontactid);
    return this._CommonService.getAPI('/Transactions/HRMSTransactions/GetTargetdeductionDetails', params, 'YES');

  }
  
GetHrmsEmployeeDetails(branchname: string, fromdate: string, todate: string): Observable<any> {
  const params = new HttpParams()
    .set('branchname', branchname)
    .set('fromdate', fromdate)
    .set('todate', todate);
  return this._CommonService.getAPI("/Transactions/HRMSReports/GetHrmsEmployeeDetails", params, 'YES');
}
}
