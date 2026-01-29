
import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpParams } from '@angular/common/http';
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class TDSReportService {

  constructor(private _commonservice: CommonService) { }

  public getTDSSectionDetails() {
    return this._commonservice.getAPI('/ChitTransactions/ChitReports/getTDSSectionDetails', "params", 'No');
  }


  public getTDSReportDetails(localSchema:any, sectionid:any, fromdate:any, todate:any, grouptype:any,reporttype:any) {
    const params = new HttpParams().set("localSchema", localSchema).set("sectionid", sectionid).set("fromdate", fromdate).set("todate", todate).set("grouptype", grouptype).set("reporttype", reporttype);
    return this._commonservice.getAPI('/ChitTransactions/ChitReports/getTDSReportDetails', params, 'YES');
  }

  public getTDSReportDiffDetails(localSchema:any, sectionid:any, fromdate:any, todate:any) {
    const params = new HttpParams().set("localSchema", localSchema).set("sectionid", sectionid).set("fromdate", fromdate).set("todate", todate);
    return this._commonservice.getAPI('/ChitTransactions/ChitReports/getTDSReportDiffDetails', params, 'YES');
  }

  getGstReportDetails(fromdate:any, todate:any, reporttype:any,ledgername:any) :any{
    try {
      const params = new HttpParams().set('localSchema', this._commonservice.getschemaname()).set('fromdate', fromdate).set('todate', todate).set('reporttype', reporttype).set('ledgername', ledgername);
      return this._commonservice.getAPI('/ChitTransactions/ChitReports/getGstReport', params, 'YES');
    }
    catch (errormssg:any) {
      this._commonservice.showErrorMessage(errormssg);
    }
  }
  // public exportAsExcelFile(json: any[], excelFileName: string): void {
    
  //   const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
  //   const myworkbook: XLSX.WorkBook = { Sheets: { 'data': myworksheet }, SheetNames: ['data'] };
  //   const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
  //   this.saveAsExcelFile(excelBuffer, excelFileName);
  // }

  // private saveAsExcelFile(buffer: any, fileName: string): void {
  //   const data: Blob = new Blob([buffer], {
  //     type: EXCEL_TYPE
  //   });
  //   FileSaver.saveAs(data, fileName + '_Excel'+ EXCEL_EXTENSION);
  // }
  Getgstreport(Branchschema:any,fromdate:any, todate:any):any {
    try {
      const params = new HttpParams().set('Branchschema',Branchschema).set('fromdate', fromdate).set('todate', todate);
      return this._commonservice.getAPI('/ChitTransactions/Getgstreport', params, 'YES');
    }
    catch (errormssg:any) {
      this._commonservice.showErrorMessage(errormssg);
    }
  }
}
