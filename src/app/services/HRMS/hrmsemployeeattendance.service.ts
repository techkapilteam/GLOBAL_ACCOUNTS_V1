// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class HrmsemployeeattendanceService {
  
// }
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { CommonService } from '../common.service';


@Injectable({
  providedIn: 'root'
})
export class HrmsemployeeattendanceService {

  constructor(private _CommonService: CommonService) { }


  GetCalendarYear(): Observable<any> {

    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetCalendarYear', params, 'YES');

  }

  GetCalendarYearMonth(CalendarId:any): Observable<any> {

    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('CalendarId', CalendarId);

    return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetCalendarYearMonth', params, 'YES');

  }

  GetTDSJVCalendarYearMonth(CalendarId:any): Observable<any> {

    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('CalendarId', CalendarId);

    return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetTDSJVCalendarYearMonth', params, 'YES');

  }

  GetCalendarYearMonthPayroll(CalendarId:any): Observable<any> {

    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('CalendarId', CalendarId);

    return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetCalendarYearMonthPayroll', params, 'YES');

  }

  GetMvoSvoNamesPayroll(): Observable<any> {

    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetMvoSvoNames', params, 'YES');

  }
  GetBpoNamesPayroll(): Observable<any> {

    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetBpoBranchNames', params, 'YES');

  }

  BindLegalCellNames(): Observable<any> {

    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetLegalCellNames', params, 'YES');

  }


  GetCalendarYearMonthAuthorized(CalendarId:any, employeecontactId:any): Observable<any> {

    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('CalendarId', CalendarId).set('empContactId', employeecontactId);

    return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetCalendarYearMonthPayrollAuthorised', params, 'YES');

  }

  GetLoyalityCalendarYearMonth(CalendarId:any): Observable<any> {

    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('CalendarId', CalendarId);

    return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetLoyalityCalendarYearMonth', params, 'YES');

  }

  GetEmployeeAttendanceDetails(searchtype:any, BranchId:any, Year:any, Month:any): Observable<any> {

    const params = new HttpParams().set('searchtype', searchtype).set('BranchId', BranchId).set('Branchschema', this._CommonService.getschemaname()).set('Year', Year).set('Month', Month);

    return this._CommonService.getAPI('/Transactions/HRMSTransactions/GetEmployeeDetailsAttendance', params, 'YES');

  }
  ///Save Employee Anttendance

  SaveEmployeeAttendance(data:any) :any{
    try {
      debugger
      return this._CommonService.postAPI("/Transactions/HRMSTransactions/SaveEmployeeAttendance", data)
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  GetCalendarYearMonthDetails(CalendarId:any): Observable<any> {

    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('CalendarId', CalendarId);

    return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetCalendarYearMonthPayrollBeforeAuthorised', params, 'YES');
    //return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetCalendarYearMonthPayrollAuthorised', params, 'YES');

  }

  GetCalendarMonth(): Observable<any> {
    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetCalendarMonth', params, 'YES');
  }
  GetPolicyRenewalReport(Status:any,MonthName:any): Observable<any> {
    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('Status',Status).set('MonthName',MonthName);
    return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetPolicyRenewalDetails', params, 'YES');
  }
  GetPendingRenewalNotEnteredReport(Status:any,MonthName:any): Observable<any> {
    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('Status',Status).set('MonthName',MonthName);
    return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetPolicyPendingRenewalDetails', params, 'YES');
  }
  



  saveInvestmentDeclarationForm(formdata:any):any {
    try {
      debugger
      return this._CommonService.postAPI("/Transactions/HRMSTransactions/saveInvestmentDeclarationData", formdata)
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }



  GetAttendance(branchschema:any,fromdate:any,todate:any):any{
    debugger
    try {
      const params = new HttpParams().set('branchschema',branchschema).set('fromdate',fromdate).set('todate',todate);
      return this._CommonService.getAPI('/Transactions/HRMSTransaction/GetAttendance', params, 'YES');
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  getBiometricAttendance(branchschema:any,fromdate:any,todate:any):any{
    debugger
    try {
      const params = new HttpParams().set('branchschema',branchschema).set('fromdate',fromdate).set('todate',todate);
      return this._CommonService.getAPI('/Transactions/HRMSTransaction/getBiometricAttendance', params, 'YES');
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  getAvailableLeavesforbiometric(branchschema:any,fromdate:any,todate:any):any{
    debugger
    try {
      const params = new HttpParams().set('branchschema',branchschema).set('fromdate',fromdate).set('todate',todate);
      return this._CommonService.getAPI('/Transactions/HRMSTransaction/getAvailableLeavesforbiometric', params, 'YES');
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  SaveLeaveDetails(formdata:any) :any{
    debugger
    try {
      return this._CommonService.postAPI("/Transactions/HRMSTransaction/SaveBiometricAttendance", formdata);
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  getleavetypes():any{
    debugger
    try {
      return this._CommonService.getAPI('/Transactions/HRMSTransaction/getleavetypes','', 'YES');
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  getBiometricAttendanceReportData(branchschema:any,fromdate:any,todate:any,leavetype:any,formname:any):any{
    debugger
    try {
      const params = new HttpParams().set('branchschema',branchschema).set('fromdate',fromdate).set('todate',todate).set('leavetype',leavetype).set('formname',formname);
      return this._CommonService.getAPI('/Transactions/HRMSTransaction/getBiometricAttendanceReportData', params, 'YES');
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
  GetEmpAllowancesDetailsReportData(branchschema:any,fromdate:any):any{
    debugger
    try {
      const params = new HttpParams().set('BranchSchema',branchschema).set('strdate',fromdate);
      return this._CommonService.getAPI('/Transactions/HRMSReports/GetEmpAllowancesDetails', params, 'YES');
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }
}
