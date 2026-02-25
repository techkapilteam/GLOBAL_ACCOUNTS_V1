import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  showSuccessMessage() {
    throw new Error('Method not implemented.');
  }
  isNullOrEmptyString(chitgroupstatus: any) {
    throw new Error('Method not implemented.');
  }

  //  isNullOrEmptyString(value:any): boolean {
  //   let isvalid = false;
  //   if (value == undefined || value == '' || value == null)
  //     isvalid = true;
  //   return isvalid;
  // }
  _downloadchequesReportsPdf(reportname: string, rows: (string | { content: string; styles: { halign: string; fontSize: number; fontStyle: string; }; })[][], gridheaders: any[], colWidthHeight: { 0: { cellWidth: string; halign: string; }; 1: { cellWidth: string; halign: string; }; 2: { cellWidth: number; halign: string; }; 3: { cellWidth: number; halign: string; }; 4: { cellWidth: number; halign: string; }; 5: { cellWidth: string; halign: string; }; 6: { cellWidth: string; halign: string; }; 7: { cellWidth: string; halign: string; }; 8: { cellWidth: string; }; 9: { cellWidth: string; }; } | { 0: { cellWidth: string; halign: string; }; 1: { cellWidth: string; }; 2: { cellWidth: number; halign: string; }; 3: { cellWidth: number; halign: string; }; 4: { cellWidth: number; halign: string; }; 5: { cellWidth: string; halign: string; }; 6: { cellWidth: string; halign: string; }; 7: { cellWidth: string; }; 8: { cellWidth: string; }; 9: { cellWidth: string; }; 10: { cellWidth: string; halign: string; }; }, arg4: string, arg5: string, arg6: string, arg7: string, printorpdf: any, amounttotal: any) {
    throw new Error('Method not implemented.');
  }
  convertAmountToPdfFormat(totalreceivedamt: any): any {
    throw new Error('Method not implemented.');
  }
  currencyformat(ptotalreceivedamount: any): any {
    throw new Error('Method not implemented.');
  }
  transform(gridDatatemp: any[], searchText: any, columnName: string): any[] {
    throw new Error('Method not implemented.');
  }
  searchfilterlength: any;
  showErrorMessage(error: any) {
    throw new Error('Method not implemented.');
  }
  getDateObjectFromDataBase(pfrombrsdate: any): any {
    throw new Error('Method not implemented.');
  }
  exportAsExcelFile(rows: any[], arg1: string) {
    throw new Error('Method not implemented.');
  }

  getFormatDateGlobal(ptobrsdate: any): any {
    throw new Error('Method not implemented.');
  }
  
  currencysymbol: any;
  _getCompanyDetails(): any {
    throw new Error('Method not implemented.');
  }

  // COMPANY DETAILS
  comapnydetails: any = {
    pdatepickerenablestatus: false
  };

  pageSize = 10;

  constructor(private http: HttpClient) {}

  // DATE PICKER SETTINGS
  datePickerPropertiesSetup(key: string): any {
    const config = {
      dateInputFormat: 'DD-MM-YYYY',
      containerClass: 'theme-default',
      currencysymbol: '₹'
    };
    // return config[key];
  }

  // GET SCHEMA NAME
  getschemaname(): string {
    return 'default_schema';
  }

  // IP ADDRESS
  getipaddress(): string {
    return '0.0.0.0';
  }

  // USER ID
  getcreatedby(): string {
    return 'SYSTEM';
  }

  // FORMAT DATE
  getFormatDateNormal(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  // SHOW MESSAGE
  showWarningMessage(message: string): void {
    alert(message);
  }

  showInfoMessage(message: string): void {
    alert(message);
  }

  // REMOVE COMMAS
  removeCommasInAmount(value: any): string {
    if (value == null) return '0';
    return String(value).replace(/,/g, '');
  }

  // VALIDATION MESSAGE
  getValidationMessage(control: any, errorkey: string, label: string, key: string, extra: string): string {
    switch (errorkey) {
      case 'required':
        return `${label} is required.`;
      case 'maxlength':
        return `${label} exceeds maximum length.`;
      default:
        return `${label} is invalid.`;
    }
  }
}
