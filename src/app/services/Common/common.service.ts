import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

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
