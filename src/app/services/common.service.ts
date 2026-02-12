import { EventEmitter, Injectable } from '@angular/core';
import { mergeMap, of, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { formatDate } from 'ngx-bootstrap/chronos';
import { CookieService } from 'ngx-cookie-service';
// import { environment } from '../envir/environment.prod';
import { jsPDF } from 'jspdf';
import autoTable, { ColumnInput, RowInput } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from '../envir/environment';



@Injectable({
  providedIn: 'root',
})
export class CommonService {




  showSuccessMessage() {
    this.toastr.success("Saved successfully", "Success", { timeOut: this.messageShowTimeOut });
  }
  showSuccessMsg(message: any) {
    this.toastr.success(message, "Success", { timeOut: this.messageShowTimeOut });
  }
  showErrorMessage(error: any) {
    console.warn('API disabled (mock mode):', error?.message || error);
  }

  _downloadchequesReportsPdf(
    reportname: string,
    rows: any[],
    headers: string[],
    colWidthHeight: any,
    orientation: string,
    from: string,
    to: string,
    type: string,
    printorpdf: string,
    total: any
  ) {
    console.log("PDF Download Triggered", {
      reportname, rows, headers, orientation, total
    });
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(json);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      const data: Blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });
      FileSaver.saveAs(data, fileName + '.xlsx');
    });
  }
  showWarningMessage(message: string) {
    this.toastr.warning(message);
  }
  convertAmountToPdfFormat(arg0: any): any {
    throw new Error('Method not implemented.');
  }
  pageSize: number = 10;

  datePickerPropertiesSetup(property: string): string | boolean {

    if (property === "containerClass") {
      return "theme-dark-blue";
    }

    if (property === "dateInputFormat") {
      return sessionStorage.getItem("dateformat") ?? "DD-MM-YYYY";
    }

    if (property === "monthInputFormat") {
      return this.getMonthInputFormat(); // already returns string
    }

    if (property === "showWeekNumbers") {
      return false;
    }

    if (property === "currencysymbol") {
      return sessionStorage.getItem("currencyformat") ?? "₹";
    }
    return "";
  }

  getMonthInputFormat(): string {

    this.dateFormat = sessionStorage.getItem("dateformat");

    if (this.dateFormat == "MM DD YYYY") return 'MM YYYY';
    if (this.dateFormat == "DD MM YYYY") return 'MM YYYY';
    if (this.dateFormat == "YYYY MM DD") return 'YYYY MM';
    if (this.dateFormat == "DD/MM/YYYY") return 'MM/YYYY';
    if (this.dateFormat == "MM/DD/YYYY") return 'MM/YYYY';
    if (this.dateFormat == "YYYY/MM/DD") return 'YYYY/MM';
    if (this.dateFormat == "DD-MM-YYYY") return 'MM-YYYY';
    if (this.dateFormat == "MM-DD-YYYY") return 'MM-YYYY';
    if (this.dateFormat == "YYYY-MM-DD") return 'YYYY-MM';
    if (this.dateFormat == "DD-MMM-YYYY") return 'MMM-YYYY';
    if (this.dateFormat == "MMM-DD-YYYY") return 'MMM-YYYY';
    if (this.dateFormat == "YYYY-MMM-DD") return 'YYYY-MMM';
    return 'MM-YYYY';
  }

  currencyformat(ptotalreceivedamount: any): any {
    throw new Error('Method not implemented.');
  }
  searchfilterlength = 3;
  searchplaceholder = 'Please enter 3 or more characters'
  ipaddress = sessionStorage.getItem("ipaddress");
  errormessages: any
  datevalue: any;
  year: any;
  month: any;
  day: any;
  newDate: any;
  public ReferralId: any;
  pCreatedby: any;
  pStatusname = 'ACTIVE';
  ptypeofoperation = 'CREATE';
  globalschema = 'GLOBAL';
  comapnydetails: any = {};
  //dateFormat: any;
  //currencysymbol: any;
  private FiTab1Data = new Subject<any>();
  private BankData = new Subject<any>();
  private BankUpdate = new Subject<any>();
  private KYCData = new Subject<any>();
  private KYCUpdate = new Subject<any>();
  private TDSData = new Subject<any>();
  private TDSUpdate = new Subject<any>();
  private ContactData = new Subject<any>();
  private ContactUpdate = new Subject<any>();
  private chargesDataToEdit = new Subject<any>();
  private ContactId = new Subject<any>();

  private GuarantorId = new Subject<any>();
  private CollectionTargetListupdate = new Subject<any>();
  private EnrollDetailsupdate = new Subject<any>();
  private showingGuarantordataInSearchEngine = new Subject<any>();
  showingGuarantordataInSearchEngine$ = this.showingGuarantordataInSearchEngine.asObservable();
  formtype: any;
  NoticePostDetails: any = [];
  totalamount: any = 0;
  penaltyamount: any = 0;
  duedetails: any = [];
  duedetailsgriddata: any = [];
  subscriptionamounttotal = 0;
  dividendamounttotal = 0;
  totalamountdues = 0;
  totaldamages = 0;
  pdftype!: string;
  GuarantorDetails!: any[];
  Companydetails: any;
  tempdata = []
  aadhar_Required: any;
  clear_ContactMerge_Event = new EventEmitter();
  ptranstypedate: boolean = false
  fromdateglobal = ''
  todateglobal = ''
  ptranstypegroupcode: boolean = false
  chitno = '';
  contactGST: any;
  legalReceiptCheckStatus!: string;
  ReserveticketStatus: boolean = false;
  Referredbystatus: boolean = false;
  UserRightsList: any;
  status: any;
  messageShowTimeOut = 1500;
  dateFormat!: string | null;
  // datepipe: any;
  private apiHostUrl: string | null = null;

  currencysymbol = sessionStorage.getItem("currencyformat");
  constructor(private http: HttpClient, private toastr: ToastrService, private _CookieService: CookieService, private datepipe: DatePipe) {
    this.pCreatedby = 'admin'; // or from auth/user session
    this.ipaddress = '127.0.0.1';
    console.log('DatePipe injected:', this.datepipe);
  }



  // getschemaname() {
  //   let pschemaname = sessionStorage.getItem("schemaname");
  //   return pschemaname.toString();
  // }

  getschemaname(): string {
    // return sessionStorage.getItem('schemaname') ?? '';
    return 'global';
  }
  getbranchname(): string {
    // return sessionStorage.getItem('loginBranchName') ?? '';
    return 'accounts';
  }



  getCompanyCode(): string {
    // return sessionStorage.getItem('CompanyCode') ?? '';
    return 'KAPILCHITS';
  }
  getBranchCode(): string {
    // return sessionStorage.getItem('BranchCode') ?? '';
    return 'KLC01';
  }
  getbrachid(): number | null {
    let companyDetailsRaw = sessionStorage.getItem('companydetails');

    if (!companyDetailsRaw) {
      return null;
    }

    let companyDetails = JSON.parse(companyDetailsRaw);
    return companyDetails?.pbranchid ?? null;
  }
  extractData(data: any) {
    return data;
  }

  extractData1(data: any) {
    return data;
  }

  handleError(error: any) {
    console.error(error);
    return throwError(() => error);
  }

  getAPI1(apiPath: string, params: any, parameterStatus: string): Observable<any> {
    let urldata = environment.apiURL;

    return this.http.get<any[]>(urldata).pipe(
      mergeMap(json => {
        let apiUrl = json[0].ApiHostUrl + apiPath;

        if (parameterStatus.toUpperCase() === 'YES') {
          return this.http.get(apiUrl, {
            params: new HttpParams({ fromObject: params }),
            responseType: 'text'
          }).pipe(
            map(this.extractData1),
            catchError(this.handleError)
          );
        } else {
          return this.http.get(apiUrl).pipe(
            map(this.extractData),
            catchError(this.handleError)
          );
        }
      }),
      catchError(this.handleError)
    );
  }




  private loadApiHostUrl() {
    debugger;
    this.apiHostUrl = environment.apiURL
    if (this.apiHostUrl) {
      return of(this.apiHostUrl);
    }
    return this.http.get<any>(environment.apiURL).pipe(
      map(config => {
        this.apiHostUrl = config['ApiHostUrl'];
        return this.apiHostUrl;
      })
    )
  }
  getAPI(apiPath: string, params: any, parameterStatus: string): Observable<any> {
    // debugger;
    // const urldata = environment.apiURL;

    // return this.http.get<any>(urldata).pipe(
    //   mergeMap(json => {
    //     debugger;
    //     const apiUrl = json[0].ApiHostUrl + apiPath;

    //     if (parameterStatus.toUpperCase() === 'YES') {
    //       return this.http.get(apiUrl, { params }).pipe(
    //         map(this.extractData),
    //         catchError(this.handleError)
    //       );
    //     } else {
    //       return this.http.get(apiUrl).pipe(
    //         map(this.extractData),
    //         catchError(this.handleError)
    //       );
    //     }
    //   }),
    //   catchError(this.handleError)
    // );
    debugger;
    let urldata = environment.apiURL;

    if (parameterStatus.toUpperCase() == 'YES')
      return this.loadApiHostUrl().pipe(
        switchMap(apiBaseUrl => {
          debugger
          const fullUrl = apiBaseUrl + apiPath + "?" + params;
          return this.http.get(fullUrl).pipe(
            map((res: any) => this.extractData(res)),
            catchError(error => this.handleError(error))
          );
        }));
    else
      return this.loadApiHostUrl().pipe(
        switchMap(apiBaseUrl => {
          const fullUrl = apiBaseUrl + apiPath;
          return this.http.get(fullUrl).pipe(
            map((res: any) => this.extractData(res)),
            catchError(error => this.handleError(error))
          );
        }));
  }

  postAPI(apiPath: string, data: any): Observable<any> {
    const urldata = environment.apiURL;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });

    return this.http.get<any[]>(urldata).pipe(
      mergeMap(json => {
        const apiUrl = json[0].ApiHostUrl + apiPath;

        return this.http.post(apiUrl, data, { headers }).pipe(
          map(this.extractData),
          catchError(this.handleError)
        );
      }),
      catchError(this.handleError)
    );
  }

  postAPI1(apiPath: string, data: any): Observable<any> {
    const urldata = environment.apiURL;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });

    return this.http.get<any[]>(urldata).pipe(
      mergeMap(json => {
        const apiUrl = json[0].ApiHostUrl + apiPath;
        return this.http.post(apiUrl, data, { headers });
      }),
      catchError(this.handleError)
    );
  }


  getcompanyaddress(): string {
    let companyDetails = this._getCompanyDetails();
    if (!companyDetails) {
      return '';
    }
    let address = '';

    if (companyDetails.pAddress1?.trim()) {
      address = companyDetails.pAddress1.trim();
    }
    return address ? `${address.replace(/,\s*$/, '')}.` : '';
  }
  _getCompanyDetails(): any | null {
    let raw = sessionStorage.getItem('companydetails');
    return raw ? JSON.parse(raw) : null;
  }

  // showErrorMessage(errormsg: string) {

  //   this.toastr.error(errormsg, "Error!", { timeOut: this.messageShowTimeOut });
  // }

  pdfProperties(propertyType: string): string | number {
    switch (propertyType) {
      case 'Date': {
        const time = formatDate(
          new Date(),
          'dd-MMM-yyyy/h:mm:ss a',
          'en-IN'
        ).split('/')[1];

        return `${this.getFormatDateGlobal(new Date())} ${time}`;
      }

      case 'Header Color':
        return '#0b4093';

      case 'Header Color1':
        return 'white';

      case 'Header Alignment':
        return 'center';

      case 'Header Fontsize':
      case 'Cell Fontsize':
        return 7;

      case 'Address Fontsize':
        return 8;

      default:
        return '';
    }
  }
  // getFormatDateGlobal(date: any)  {

  //   this.dateFormat = sessionStorage.getItem("dateformat");

  //   if (this.dateFormat == "MM DD YYYY") {
  //     return this.datepipe.transform(date, 'MM dd yyyy')
  //   }
  //   if (this.dateFormat == "DD MM YYYY") {
  //     return this.datepipe.transform(date, 'dd MM yyyy')
  //   }
  //   if (this.dateFormat == "YYYY MM DD") {
  //     return this.datepipe.transform(date, 'yyyy MM dd')
  //   }
  //   if (this.dateFormat == "DD/MM/YYYY") {
  //     return this.datepipe.transform(date, 'dd/MM/yyyy')
  //   }
  //   if (this.dateFormat == "MM/DD/YYYY") {
  //     return this.datepipe.transform(date, 'MM/dd/yyyy')
  //   }
  //   if (this.dateFormat == "YYYY/MM/DD") {
  //     return this.datepipe.transform(date, 'yyyy/MM/dd')
  //   }
  //   if (this.dateFormat == "DD-MM-YYYY") {
  //     return this.datepipe.transform(date, 'dd-MM-yyyy')
  //   }
  //   if (this.dateFormat == "MM-DD-YYYY") {
  //     return this.datepipe.transform(date, 'MM-dd-yyyy')
  //   }
  //   if (this.dateFormat == "YYYY-MM-DD") {
  //     return this.datepipe.transform(date, 'yyyy-MM-dd')
  //   }
  //   if (this.dateFormat == "DD-MMM-YYYY") {
  //     return this.datepipe.transform(date, 'dd-MMM-yyyy')
  //   }
  //   if (this.dateFormat == "MMM-DD-YYYY") {
  //     return this.datepipe.transform(date, 'MMM-dd-yyyy')
  //   }
  //   if (this.dateFormat == "YYYY-MMM-DD") {
  //     return this.datepipe.transform(date, 'yyyy-MMM-dd')
  //   }
  //   if (this.dateFormat == "YYYY-DD-MMM") {
  //     return this.datepipe.transform(date, 'dd-MMM-yyyy')
  //   }
  // }
  getFormatDateGlobal(date: any): string {
    if (!date) return '';

    const storedFormat = sessionStorage.getItem('dateformat') ?? '';

    let format = 'dd/MM/yyyy';

    switch (storedFormat) {
      case "MM DD YYYY": format = 'MM dd yyyy'; break;
      case "DD MM YYYY": format = 'dd MM yyyy'; break;
      case "YYYY MM DD": format = 'yyyy MM dd'; break;
      case "DD/MM/YYYY": format = 'dd/MM/yyyy'; break;
      case "MM/DD/YYYY": format = 'MM/dd/yyyy'; break;
      case "YYYY/MM/DD": format = 'yyyy/MM/dd'; break;
      case "DD-MM-YYYY": format = 'dd-MM-yyyy'; break;
      case "MM-DD-YYYY": format = 'MM-dd-yyyy'; break;
      case "YYYY-MM-DD": format = 'yyyy-MM-dd'; break;
      case "DD-MMM-YYYY": format = 'dd-MMM-yyyy'; break;
      case "MMM-DD-YYYY": format = 'MMM-dd-yyyy'; break;
      case "YYYY-MMM-DD": format = 'yyyy-MMM-dd'; break;
      case "YYYY-DD-MMM": format = 'dd-MMM-yyyy'; break;
    }

    return this.datepipe.transform(date, format) ?? '';
  }
  _getRupeeSymbol() {
    return "data:image/png;base64,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";
  }
  getKapilGroupLogo() {
    // let img = "/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MSA2NC4xNDA5NDksIDIwMTAvMTIvMDctMTA6NTc6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUuMSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZDMEJFNzUyQUJFRTExRTE5MjQxRjJBQUQ1RUI1NkVBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZDMEJFNzUzQUJFRTExRTE5MjQxRjJBQUQ1RUI1NkVBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkMwQkU3NTBBQkVFMTFFMTkyNDFGMkFBRDVFQjU2RUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkMwQkU3NTFBQkVFMTFFMTkyNDFGMkFBRDVFQjU2RUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAABAQEBAQEBAQEBAQEBAQEBAQEB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"
    let img = "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";
    return img;
  }
  downloadgstsummarypdf(reportName: any, month: string, gridData: any, gridheaders: any, colWidthHeight: any, pagetype: string, printorpdf: string) {
    debugger;
    let address = this.getcompanyaddress();
    let Companyreportdetails = this._getCompanyDetails();
    const doc = new jsPDF('p', 'mm', 'a4');
    // let doc = new jsPDF('lanscape');
    let totalPagesExp = '{total_pages_count_string}'
    let today = this.pdfProperties("Date");
    // let Easy_chit_Img = this.Easy_chit_Img;
    let kapil_logo = this.getKapilGroupLogo();
    var lMargin = 15; //left margin in mm
    var rMargin = 15; //right margin in mm
    var pdfInMM: number;

    // doc.autoTable({
    //   columns: gridheaders,
    //   body: gridData,
    //   theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
    //   headStyles: {
    //     fillColor: this.pdfProperties("Header Color"),
    //     halign: this.pdfProperties("Header Alignment"),
    //     fontSize: this.pdfProperties("Header Fontsize")
    //   }, // Red
    //   styles: {
    //     cellWidth: 'wrap', fontSize: this.pdfProperties("Cell Fontsize"),
    //     rowPageBreak: 'avoid',
    //     overflow: 'linebreak'
    //   },
    //   // Override the default above for the text column
    //   columnStyles: colWidthHeight,
    //   startY: 48,
    //   showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
    //   showFoot: 'lastPage',

    //   didDrawPage: function (data: any) {

    //     let pageSize = doc.internal.pageSize;
    //     let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    //     let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    //     // Header
    //     doc.setFont('helvetica', 'bold');
    //     if (doc.getNumberOfPages() === 1) {
    //       debugger;
    //       doc.setFontSize(15);
    //       if (pagetype == "a4") {
    //         doc.addImage(kapil_logo, 'JPEG', 10, 5, 40, 20);

    //         doc.setTextColor('black');
    //         doc.text(Companyreportdetails.pCompanyName, 60, 10);
    //         doc.setFontSize(8);
    //         doc.text(address, 40, 15, 0, 0, 'left');
    //         // if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
    //         //   doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 85, 20);
    //         // }

    //         let cin = Companyreportdetails?.pCinNo;

    //         if (typeof cin === 'string' && cin.trim().length > 0) {
    //           doc.text(`CIN : ${cin}`, 85, 20);
    //         }


    //         doc.setFontSize(14);

    //         doc.text(reportName, 87, 30);


    //         doc.setFontSize(10);


    //         //  doc.text('Printed On : ' + today + '', 15, 57);
    //         doc.text('Month : ' + month + '', 15, 40);
    //         doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 163, 40);
    //         doc.setDrawColor(0, 0, 0);
    //         pdfInMM = 233;
    //         doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45) // horizontal line

    //       }
    //       if (pagetype == "landscape") {
    //         doc.addImage(kapil_logo, 'JPEG', 20, 15, 20, 20)
    //         doc.setTextColor('black');
    //         doc.text(Companyreportdetails.pCompanyName, 110, 20);
    //         doc.setFontSize(10);
    //         doc.text(address, 80, 27, 0, 0, 'left');
    //         // if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
    //         //   doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 125, 32);
    //         // }
    //         let cin = Companyreportdetails?.pCinNo;

    //         if (typeof cin === 'string' && cin.trim().length > 0) {
    //           doc.text(`CIN : ${cin}`, 125, 32);
    //         }

    //         doc.setFontSize(14);


    //         doc.text(reportName, 130, 42);


    //         doc.setFontSize(10);


    //         //  doc.text('Printed On : ' + today + '', 15, 57);
    //         doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 235, 50);
    //         pdfInMM = 315;
    //         doc.setDrawColor(0, 0, 0);
    //         doc.line(10, 48, (pdfInMM - lMargin - rMargin), 48) // horizontal line
    //       }

    //     }
    //     else {

    //       data.settings.margin.top = 20;
    //       data.settings.margin.bottom = 15;
    //     }
    //     debugger;
    //     var pageCount = doc.internal.getNumberOfPages();
    //     if (doc.internal.getNumberOfPages() == totalPagesExp) {
    //       debugger;

    //     }
    //     // Footer
    //     let page = "Page " + doc.internal.getNumberOfPages()
    //     // Total page number plugin only available in jspdf v1.0+
    //     if (typeof doc.putTotalPages === 'function') {
    //       debugger;
    //       page = page + ' of ' + totalPagesExp
    //     }
    //     doc.line(5, pageHeight - 10, (pdfInMM - lMargin - rMargin), pageHeight - 10) // horizontal line
    //     doc.setFontSize(10);
    //     doc.text("Printed on : " + today, data.settings.margin.left, pageHeight - 5);
    //     //doc.text(officeCd, pageWidth / 2, pageHeight - 5, 'center');
    //     doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
    //   },

    // });

    autoTable(doc, {
      columns: gridheaders,
      body: gridData,
      theme: 'grid',
      rowPageBreak: 'avoid',

      headStyles: {
        fillColor: this.pdfProperties("Header Color"),
        halign: this.pdfProperties("Header Alignment") as 'left' | 'center' | 'right',
        fontSize: Number(this.pdfProperties("Header Fontsize"))
      },

      styles: {
        cellWidth: 'wrap',
        fontSize: Number(this.pdfProperties("Cell Fontsize")),

        overflow: 'linebreak'
      },


      columnStyles: colWidthHeight,
      startY: 48,
      showHead: 'everyPage',
      showFoot: 'lastPage',

      didDrawPage: (data) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFont('helvetica', 'bold');

        if (doc.getNumberOfPages() === 1) {
          doc.setFontSize(15);

          doc.addImage(kapil_logo, 'JPEG', 10, 5, 40, 20);
          doc.text(Companyreportdetails.pCompanyName, 60, 10);

          doc.setFontSize(14);
          doc.text(reportName, 87, 30);

          doc.line(10, 45, pageWidth - rMargin, 45);
        }

        const page = `Page ${doc.getNumberOfPages()}`;
        doc.setFontSize(10);
        doc.text("Printed on : " + today, data.settings.margin.left, pageHeight - 5);
        doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
      }
    });
    if (typeof doc.putTotalPages === 'function') {
      debugger;
      doc.putTotalPages(totalPagesExp);

    }
    if (printorpdf == "Pdf") {
      doc.save('' + reportName + '.pdf');
    }
    if (printorpdf == "Print") {
      this.setiFrameForPrint(doc);
    }

  }
  setiFrameForPrint(doc: any) {
    debugger;
    const iframe = document.createElement('iframe');
    iframe.id = "iprint";
    iframe.name = "iprint";
    iframe.src = doc.output('bloburl');
    iframe.setAttribute('style', 'display: none;');
    document.body.appendChild(iframe);
    // iframe.contentWindow.print();
    iframe.contentWindow?.print();
  }
  _downloadGSTVOucherReport2(
    reportName: string,
    gridData: RowInput[],
    gridheaders: ColumnInput[],
    colWidthHeight: any,
    pagetype: 'a4' | 'letter' | 'legal',
    betweenorason: string,
    fromdate: string,
    todate: string,
    printorpdf: 'Pdf' | 'Print',
    gstvoucherprintdata: any[],
    SubscriberImage: string | undefined,
    companydata: any,
    showgrid1: boolean,
    totalamtBeforeTax: number,
    totaligstamt: number,
    totalCGSTAmt: number,
    totalSGSTAmt: number,
    totalTaxAmt: number,
    totalamtAfterTax: number,
    gsthideshow: boolean,
    otherstate: boolean,
    AmtnubertoWords: string,
    totaldiscountAmt: number,
    proundoff_amount: number,
    invoice_tds_amount: number,
    totalamount_after_tax: number
  ): void {

    const company: any = this._getCompanyDetails();
    let address = company?.pAddress1 || this.getcompanyaddress() || '';
    address = address.replace(/,\s*$/, '');
    if (address) address += '.';

    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: pagetype });
    const totalPagesExp = '{total_pages_count_string}';
    const today = this.pdfProperties('Date');

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFont('times', 'normal');
    doc.setFontSize(15);
    doc.text(company.pCompanyName, pageWidth / 2, 10, { align: 'center' });

    doc.setFontSize(8);
    doc.text(address.substring(0, 115), pageWidth / 2, 15, { align: 'center' });
    doc.text(address.substring(115), pageWidth / 2, 18, { align: 'center' });

    if (company?.pCinNo) {
      doc.text(`CIN : ${company.pCinNo}`, pageWidth / 2, 22, { align: 'center' });
    }

    doc.setFontSize(14);
    doc.text(reportName, 15, 30);

    if (betweenorason === 'Between') {
      doc.text(`Between: ${fromdate} And ${todate}`, 15, 40);
    } else if (fromdate) {
      doc.text(`As on: ${fromdate}`, 15, 40);
    }

    doc.line(10, 37, pageWidth - 10, 37);

    autoTable(doc, {
      columns: gridheaders,
      body: gridData,
      startY: 75,
      theme: 'grid',
      styles: {
        fontSize: Number(this.pdfProperties('Cell Fontsize')),
        cellPadding: 1
      },
      headStyles: {
        fillColor: this.pdfProperties('Header Color'),
        halign: 'center'
      },
      columnStyles: colWidthHeight,
      didDrawPage: (data) => {
        let page = `Page ${doc.getNumberOfPages()}`;
        if (typeof doc.putTotalPages === 'function') {
          page += ` of ${totalPagesExp}`;
        }

        doc.setFontSize(9);
        doc.text(`Printed on: ${today}`, 14, pageHeight - 5);
        doc.text(page, pageWidth - 30, pageHeight - 5);
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.text('Total Discount Amount:', 15, finalY);
    doc.text(this.convertAmountToPdfFormat(totaldiscountAmt), 70, finalY);

    doc.text('Total Amount Before Tax:', 15, finalY + 7);
    doc.text(this.convertAmountToPdfFormat(totalamtBeforeTax), 70, finalY + 7);

    if (gsthideshow) {
      doc.text('CGST:', 15, finalY + 14);
      doc.text(this.convertAmountToPdfFormat(totalCGSTAmt), 70, finalY + 14);

      doc.text('SGST:', 15, finalY + 21);
      doc.text(this.convertAmountToPdfFormat(totalSGSTAmt), 70, finalY + 21);
    } else {
      doc.text('IGST:', 15, finalY + 14);
      doc.text(this.convertAmountToPdfFormat(totaligstamt), 70, finalY + 14);
    }

    doc.text('Total Tax Amount:', 15, finalY + 28);
    doc.text(this.convertAmountToPdfFormat(totalTaxAmt), 70, finalY + 28);

    doc.setFont('times', 'bold');
    doc.text('Total Amount After Tax:', 15, finalY + 35);
    doc.text(this.convertAmountToPdfFormat(totalamtAfterTax), 70, finalY + 35);

    doc.setFont('times', 'normal');
    doc.text(`Amount in Words: ${AmtnubertoWords}`, 15, finalY + 45);

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    if (printorpdf === 'Pdf') {
      doc.save(`${reportName}.pdf`);
    } else {
      this.setiFrameForPrint(doc);
    }
  }
  getDateObjectFromDataBase(date: any): Date | null {
    if (!date) return null;

    try {
      // If already a Date object
      if (date instanceof Date) {
        return date;
      }

      // If string like "2024-01-31T00:00:00"
      if (typeof date === 'string') {
        return new Date(date);
      }

      // If numeric timestamp
      if (typeof date === 'number') {
        return new Date(date);
      }

      return null;
    } catch (error) {
      console.error('Invalid date received from DB:', date);
      return null;
    }
  }
  getCreatedBy(): string {
    const userId = sessionStorage.getItem('LoginUserid');
    return userId ? JSON.parse(userId).toString() : '';
  }

  getIpAddress(): string {
    const ip = sessionStorage.getItem('ipaddress');
    return ip ?? '';
  }
  showInfoMessage(errormsg: string) {

    this.toastr.success(errormsg, "Success!", { timeOut: this.messageShowTimeOut });
  }


  //     getValidationMessage(formcontrol: AbstractControl, errorkey: string, lablename: string, key: string, skipKey: string):
  //      string {
  //     let errormessage;
  // let error1=formcontrol.errors;

  //     if (errorkey == 'required')
  //       errormessage = lablename + ' Required';
  //     if (errorkey == 'email' || errorkey == 'pattern')
  //       errormessage = 'Invalid ' + lablename;
  //     if (errorkey == 'minlength') {
  //       // let length = error1[errorkey].requiredLength;
  //     const length = error1[errorkey].requiredLength;
  //       errormessage = 'Enter the data with minimum(' + length + ') fixed length'
  //     }
  //     if (errorkey == 'maxlength' && key != skipKey) {
  //       let length = formcontrol.errors[errorkey].requiredLength;
  //       // errormessage = lablename + ' Must Have ' + length + ' Letters';
  //       errormessage = 'Enter the data with maximum(' + length + ') fixed length'
  //     }
  //     if (errorkey == 'maxlength' && key == skipKey) {
  //       errormessage = 'Invalid ' + lablename;
  //     }
  //     return errormessage;
  //   }



  getValidationMessage(
    formcontrol: AbstractControl,
    errorkey: string,
    lablename: string,
    key: string,
    skipKey: string
  ): string {

    const errors = formcontrol.errors;

    if (!errors || !errors[errorkey]) {
      return '';
    }

    if (errorkey === 'required') {
      return `${lablename} Required`;
    }

    if (errorkey === 'email' || errorkey === 'pattern') {
      return `Invalid ${lablename}`;
    }

    if (errorkey === 'minlength') {
      const length = errors[errorkey].requiredLength;
      return `Enter the data with minimum (${length}) fixed length`;
    }

    if (errorkey === 'maxlength' && key !== skipKey) {
      const length = errors[errorkey].requiredLength;
      return `Enter the data with maximum (${length}) fixed length`;
    }

    if (errorkey === 'maxlength' && key === skipKey) {
      return `Invalid ${lablename}`;
    }

    return '';
  }




  public currencyFormat(value: any) {
    if (value == null) { value = "0"; }
    else {
      value = parseFloat(value.toString().replace(/,/g, ""));
    }
    value = value.toLocaleString("en", { useGrouping: false, minimumFractionDigits: 0 })
    let withNegativeData: any;
    var result: any;
    //let currencyformat= this.cookieservice.get("savedformat")
    let currencyformat;
    if (this.currencysymbol == "₹") {
      currencyformat = "India"
    } else {
      currencyformat = "other"
    }

    if (currencyformat == "India") {
      if (value < 0) {
        let stringData = value.toString();
        withNegativeData = stringData.substring(1, stringData.length);
        result = withNegativeData.toString().split('.');
      }
      else if (value >= 0) {
        result = value.toString().split('.');
      }
      var lastThree = result[0].substring(result[0].length - 3);
      var otherNumbers = result[0].substring(0, result[0].length - 3);
      if (otherNumbers != '')
        lastThree = ',' + lastThree;
      var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
      if (result.length > 1) {
        output += "." + result[1];
      }
      if (value >= 0) {
        return output
      }
      else if (value < 0) {
        output = '-' + '' + output;
        return output
      }
      // }
    }
    else {
      // this.symbol = this.cookieservice.get("symbolofcurrency")
      var result = value.toString().split('.');
      var lastThree = result[0].substring(result[0].length - 3);
      var otherNumbers = result[0].substring(0, result[0].length - 3);
      if (otherNumbers != '')
        lastThree = ',' + lastThree;
      var output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree;
      if (result.length > 1) {
        output += "." + result[1];
      }
      return output
      //return this.symbol+"  "+output
    }

  }
  getFormatDateNormal(date: any): string | null {
    if (date != null && date != '' && date != undefined)
      return this.datepipe.transform(date, 'dd/MM/yyyy');
    else
      return null;
  }
  removeCommasInAmount(value: string | number): string {
    return String(value).replace(/,/g, '');
  }
  //   public removeCommasInAmount(value:any) {
  //   if (this.isNullOrEmptyString(value))
  //     value = 0;
  //   return parseFloat(value.toString().replace(/,/g, ""))
  //   // let a = value.split(',')
  //   // let b = a.join('')
  //   // let c = b
  //   // return c;
  // }
  isNullOrEmpty(value: string | number | null | undefined): boolean {
    // null or undefined → true
    if (value == null) return true;

    // number → not empty
    if (typeof value === 'number') return false;

    // string → check empty or only whitespace
    return value.trim() === '';
  }

  fileUploadS3(formName: string, data: any) {
    const urldata = environment.apiURL;

    return this.http.get(urldata).pipe(
      mergeMap((json: any) =>
        this.http.post(`${json[0]['ApiHostUrl']}/uploadFile/${formName}`, data).pipe(
          map(this.extractData),
          catchError(this.handleError)
        )
      )
    );
  }
  _MultipleGroupingGridExportData(
    gridData: any[],
    groupedCol: string,
    isGroupedColDate: boolean
  ): any[] {
    const groupedByCol: Record<string, any[]> = {};
    const groupedByTransaction: Record<string, any[]> = {};
    const groupKeys: string[] = [];
    const transactionKeys: string[] = [];
    const finalList: any[] = [];

    // 1️⃣ Group data by column and transaction
    for (const row of gridData) {
      const groupColValue = isGroupedColDate
        ? this.getFormatDateGlobal(row[groupedCol])
        : row[groupedCol];

      const transactionNo = row["ptransactionno"];

      // Group by column
      if (!groupedByCol[groupColValue]) {
        groupedByCol[groupColValue] = [{ ...row }];
        groupKeys.push(groupColValue);
      } else {
        groupedByCol[groupColValue].push(row);
      }

      // Group by transaction
      if (!groupedByTransaction[transactionNo]) {
        groupedByTransaction[transactionNo] = [{ ...row }];
        transactionKeys.push(transactionNo);
      } else {
        groupedByTransaction[transactionNo].push(row);
      }
    }

    // 2️⃣ Add transaction-level headers
    for (const txKey of transactionKeys) {
      const transactionRows = groupedByTransaction[txKey];
      transactionRows.forEach((row, idx) => {
        if (idx === 0) {
          row["group"] = {
            content: `               ${row["ptransactionno"]}`,
            colSpan: 15,
            styles: { halign: "left", fontStyle: "bold", textColor: "#663300" },
          };
        }
        finalList.push(row);
      });
    }

    // 3️⃣ Build final grouped array
    const newDataArray: any[] = [];

    for (const key of groupKeys) {
      // Add group header
      newDataArray.push({
        group: {
          content: `${key}`,
          colSpan: 15,
          styles: { halign: "left", fontStyle: "bold", textColor: "#009933" },
        },
      });

      // Add rows belonging to this group
      for (const row of finalList) {
        const rowGroupValue = isGroupedColDate
          ? this.getFormatDateGlobal(row[groupedCol])
          : row[groupedCol];

        if (rowGroupValue === key) {
          newDataArray.push(row);
        }
      }
    }

    return newDataArray;
  }

  _JvListdownloadReportsPdf(
    reportName: string,
    gridData: any[],
    gridHeaders: any[],
    colWidthHeight: any,
    pageType: 'a4' | 'landscape',
    betweenOrAsOn: 'Between' | 'As On',
    fromDate: string,
    toDate: string,
    printOrPdf: 'Pdf' | 'Print'
  ) {
    const address = this.getcompanyaddress();
    const Companyreportdetails = this._getCompanyDetails();
    const currencySymbol = this.currencysymbol;
    const totalPagesExp = '{total_pages_count_string}';
    const today = this.pdfProperties('Date');
    const kapilLogo = this.getKapilGroupLogo();
    const rupeeImage = this._getRupeeSymbol();

    const doc = new jsPDF({
      orientation: pageType === 'landscape' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true,
    });

    const autoTableOptions: any = {
      columns: gridHeaders,
      body: gridData,
      theme: 'grid',
      headStyles: {
        fillColor: this.pdfProperties('Header Color'),
        halign: this.pdfProperties('Header Alignment'),
        fontSize: this.pdfProperties('Header Fontsize'),
      },
      styles: {
        cellPadding: 1,
        fontSize: this.pdfProperties('Cell Fontsize'),
        cellWidth: 'wrap',
        overflow: 'linebreak',
        rowPageBreak: 'avoid',
      },
      columnStyles: colWidthHeight,
      startY: 52,
      showHead: 'everyPage',
      showFoot: 'lastPage',
      didDrawPage: (data: any) => {
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width || pageSize.getWidth();
        const pageHeight = pageSize.height || pageSize.getHeight();
        const lMargin = 15;
        const rMargin = 15;
        const pdfInMM = pageType === 'landscape' ? 315 : 233;

        // Header
        doc.setFont('Times', 'normal');
        if ((doc.internal as any).getNumberOfPages() === 1) {
          doc.setFontSize(pageType === 'landscape' ? 10 : 15);
          doc.addImage(kapilLogo, 'JPEG', 10, pageType === 'landscape' ? 5 : 15, 20, 20);
          doc.setTextColor('black');
          doc.text(Companyreportdetails.pCompanyName, pageWidth / 2, pageType === 'landscape' ? 10 : 15, { align: 'center' });
          doc.setFontSize(8);
          doc.text(address.substring(0, 150), pageWidth / 2, pageType === 'landscape' ? 15 : 24, { align: 'center' });

          if (Companyreportdetails.pCinNo) {
            doc.text('CIN : ' + Companyreportdetails.pCinNo, pageWidth / 2, pageType === 'landscape' ? 20 : 28, { align: 'center' });
          }

          doc.setFontSize(14);
          doc.text(reportName, pageWidth / 2, pageType === 'landscape' ? 30 : 38, { align: 'center' });

          doc.setFontSize(10);
          doc.text('Branch : ' + Companyreportdetails.pBranchname, pageType === 'landscape' ? 235 : 163, pageType === 'landscape' ? 40 : 47);

          if (betweenOrAsOn === 'Between') {
            doc.text(`Between  : ${fromDate}  And  ${toDate}`, 15, pageType === 'landscape' ? 40 : 47);
          } else if (betweenOrAsOn === 'As On' && fromDate) {
            doc.text(`As on  : ${fromDate}`, 15, pageType === 'landscape' ? 40 : 47);
          }

          doc.setDrawColor(0, 0, 0);
          doc.line(10, pageType === 'landscape' ? 45 : 50, pdfInMM - lMargin - rMargin, pageType === 'landscape' ? 45 : 50);
        }

        // Footer
        const page = `Page ${(doc.internal as any).getNumberOfPages()} of ${totalPagesExp}`;
        doc.line(5, pageHeight - 10, pdfInMM - lMargin - rMargin, pageHeight - 10);
        doc.setFontSize(10);
        doc.text(`Printed on : ${today}`, lMargin, pageHeight - 5);
        doc.text(page, pageWidth - rMargin - 20, pageHeight - 5);
      },
      willDrawCell: (data: any) => {
        if (reportName === 'PAYMENT VOUCHER LIST') {
          if (data.cell.raw === '0' || data.cell.raw === '0.00') {
            data.cell.text[0] = '';
          }
        } else {
          if (data.section === 'body' && data.cell.colSpan !== 15 && data.cell.raw !== '0') {
            data.cell.text[0] = ' ' + data.cell.raw;
          }
          if (data.cell.raw === '0' || data.cell.raw === '0.00') {
            data.cell.text[0] = '';
          }
        }
      },
      didDrawCell: (data: any) => {
        if ((data.column.index === 1 || data.column.index === 2) && data.cell.section === 'body') {
          if (currencySymbol === '₹' && data.cell.raw !== 0) {
            const textPos = data.cell.textPos;
            doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.7, 1.7);
          }
        }
      },
    };

    autoTable(doc, autoTableOptions);

    // Put total pages
    if ((doc as any).putTotalPages) {
      (doc as any).putTotalPages(totalPagesExp);
    }

    if (printOrPdf === 'Pdf') {
      doc.save(`${reportName}.pdf`);
    } else if (printOrPdf === 'Print') {
      this.setiFrameForPrint(doc);
    }
  }
  _downloadTrialBalanceReportsPdf(
    reportName: string,
    gridData: any[],
    gridheaders: any[],
    colWidthHeight: any,
    pagetype: 'a4' | 'landscape',
    betweenorason: string,
    fromdate: string,
    todate: string,
    printorpdf: string,
    totalamounts: any
  ): void {

    const address = this.getcompanyaddress();
    const Companyreportdetails = this._getCompanyDetails();
    const currencyformat = this.currencysymbol;
    const today = this.pdfProperties('Date');
    const kapil_logo = this.getKapilGroupLogo();
    const rupeeImage = this._getRupeeSymbol();

    const orientation = pagetype === 'landscape' ? 'landscape' : 'portrait';

    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    });

    const totalPagesExp = '{total_pages_count_string}';
    const lMargin = 15;
    const rMargin = 15;
    let pdfInMM = pagetype === 'landscape' ? 315 : 233;

    autoTable(doc, {
      columns: gridheaders,
      body: gridData,
      theme: 'grid',

      headStyles: {
        fillColor: this.pdfProperties('Header Color'),
        halign: 'center',
        fontSize: 11
      },
      rowPageBreak: 'avoid',
      styles: {
        cellPadding: 1,
        fontSize: 10,
        cellWidth: 'wrap',

        overflow: 'linebreak'
      },

      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto', halign: 'right' },
        2: { cellWidth: 'auto', halign: 'right' }
      },

      startY: 48,
      showHead: 'everyPage',
      showFoot: 'lastPage',

      // =====================================================
      // HEADER + FOOTER
      // =====================================================
      didDrawPage: (data: any) => {

        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width;
        const pageHeight = pageSize.height;

        doc.setFont('helvetica', 'normal');

        // ================= A4 =================
        if (pagetype === 'a4') {

          doc.addImage(kapil_logo, 'JPEG', 10, 5, 20, 20);
          doc.setFontSize(15);
          doc.text(Companyreportdetails.pCompanyName, 72, 10);

          doc.setFontSize(8);
          const address1 = address.substr(0, 115);
          const address2 = address.substring(115);
          doc.text(address1, 110, 15, { align: 'center' });
          doc.text(address2, 110, 18);

          if (Companyreportdetails.pCinNo) {
            doc.text(`CIN : ${Companyreportdetails.pCinNo}`, 90, 22);
          }

          doc.setFontSize(14);
          doc.text(reportName, 90, 30);

          doc.setFontSize(10);
          doc.text(`Branch : ${Companyreportdetails.pBranchname}`, 160, 40);

          if (betweenorason === 'Between') {
            doc.text(`Between : ${fromdate} And ${todate}`, 15, 40);
          } else if (fromdate) {
            doc.text(`As on : ${fromdate}`, 15, 40);
          }

          doc.line(10, 45, pdfInMM - lMargin - rMargin, 45);
        }

        // ================= LANDSCAPE =================
        if (pagetype === 'landscape') {

          doc.addImage(kapil_logo, 'JPEG', 20, 15, 20, 20);
          doc.setFontSize(15);
          doc.text(Companyreportdetails.pCompanyName, 110, 20);

          doc.setFontSize(10);
          doc.text(address, 80, 27);

          if (Companyreportdetails.pCinNo) {
            doc.text(`CIN : ${Companyreportdetails.pCinNo}`, 125, 32);
          }

          doc.setFontSize(14);
          doc.text(reportName, 130, 42);

          doc.setFontSize(10);
          doc.text(`Branch : ${Companyreportdetails.pBranchname}`, 235, 50);

          if (betweenorason === 'Between') {
            doc.text(`Between : ${fromdate} And ${todate}`, 15, 50);
          } else if (fromdate) {
            doc.text(`As on : ${fromdate}`, 15, 50);
          }

          doc.line(10, 52, pdfInMM - lMargin - rMargin, 52);
        }

        data.settings.margin.top = 48;
        data.settings.margin.bottom = 15;

        // ================= FOOTER =================
        let pageText = `Page ${doc.getNumberOfPages()}`;
        if ((doc as any).putTotalPages) {
          pageText += ` of ${totalPagesExp}`;
        }

        doc.line(5, pageHeight - 10, pdfInMM - lMargin - rMargin, pageHeight - 10);
        doc.setFontSize(10);
        doc.text(`Printed on : ${today}`, data.settings.margin.left, pageHeight - 5);
        doc.text(pageText, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
      },

      // =====================================================
      // LAST ROW BOLD
      // =====================================================
      willDrawCell: (data: any) => {
        if (data.row.index === gridData.length - 1) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
        }
      },

      // =====================================================
      // RUPEE SYMBOL
      // =====================================================
      didDrawCell: (data: any) => {
        if (
          (data.column.index === 1 || data.column.index === 2) &&
          data.cell.section === 'body' &&
          data.row.index !== gridData.length - 1 &&
          currencyformat === '₹' &&
          data.cell.raw !== ''
        ) {
          const pos = data.cell.textPos;
          doc.setFont('helvetica', 'normal');
          doc.addImage(
            rupeeImage,
            pos.x - data.cell.contentWidth,
            pos.y + 0.5,
            1.5,
            1.5
          );
        }
      }
    });

    if ((doc as any).putTotalPages) {
      (doc as any).putTotalPages(totalPagesExp);
    }

    if (printorpdf === 'Pdf') {
      doc.save(`${reportName}.pdf`);
    } else {
      this.setiFrameForPrint(doc);
    }
  }

  // ===================================================================
  // PRINT SUPPORT (UNCHANGED LOGIC)
  // ===================================================================
  // setiFrameForPrint(doc: jsPDF): void {
  //   const iframe = document.createElement('iframe');
  //   iframe.style.display = 'none';
  //   const blobUrl = doc.output('bloburl');
  //   iframe.src = blobUrl.toString();
  //   document.body.appendChild(iframe);
  //   iframe.contentWindow?.print();
  // }

  // getcompanyaddress(): string { return ''; }
  // _getCompanyDetails(): any { return {}; }
  // getKapilGroupLogo(): string { return ''; }
  // _getRupeeSymbol(): string { return ''; }
  // pdfProperties(key: string): any { return ''; }





  removeCommasForEntredNumber(enteredNumber: any) {
    return this.removeCommasInAmount(enteredNumber);
  }
  getFormatDateYYYMMDD(date: Date | string | null | undefined): string | null {
    if (!date) {
      return null;
    }

    return this.datepipe.transform(date, 'yyyy-MM-dd');
  }
  _downloadBRSReportsPdf(
    reportName: string,
    gridData: any[],
    gridheaders: any[],
    colWidthHeight: any,
    pagetype: any,
    betweenorason: string,
    fromdate: string,
    todate: string,
    BankBalance: any,
    chequesdepositedbutnotcredited: any,
    CHEQUESISSUEDBUTNOTCLEARED: any,
    balanceperbankbook: any,
    printorpdf: string,
    bankname: string
  ) {

    const doc = new jsPDF({
      orientation: pagetype === 'landscape' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const totalPagesExp = '{total_pages_count_string}';
    const today = this.pdfProperties("Date");
    const currencyformat = this.currencysymbol;
    const kapil_logo = this.getKapilGroupLogo();

    let pageHeight = doc.internal.pageSize.getHeight();
    let pageWidth = doc.internal.pageSize.getWidth();

    autoTable(doc, {
      head: [gridheaders],
      body: gridData,
      startY: 46,
      theme: 'grid',

      headStyles: {
        fillColor: this.pdfProperties("Header Color") as any,
        halign: (this.pdfProperties("Header Alignment") as 'left' | 'center' | 'right') ?? 'center',
        fontSize: Number(this.pdfProperties("Header Fontsize")) || 10
      },

      styles: {
        fontSize: Number(this.pdfProperties("Cell Fontsize")) || 9,
        cellPadding: 1,
        overflow: 'linebreak'
      },

      columnStyles: {
        0: { halign: 'center' as const },
        1: { halign: 'center' as const },
        3: { halign: 'right' as const, cellWidth: 30 }
      },

      didDrawPage: (data) => {

        doc.setFont('times', 'bold');
        doc.setFontSize(14);
        doc.text("Bank Reconciliation - " + bankname, 15, 20);

        doc.setFontSize(10);
        if (betweenorason === "Between") {
          doc.text(`Between : ${fromdate} And ${todate}`, 15, 26);
        } else {
          doc.text(`As On : ${fromdate}`, 15, 26);
        }

        doc.addImage(kapil_logo, 'JPEG', pageWidth - 40, 10, 25, 15);

        let str = "Page " + doc.getNumberOfPages();
        if (typeof doc.putTotalPages === 'function') {
          str = str + " of " + totalPagesExp;
        }

        doc.setFontSize(9);
        doc.text("Printed on : " + today, 15, pageHeight - 10);
        doc.text(str, pageWidth - 40, pageHeight - 10);
      }
    });

    let finalY = (doc as any).lastAutoTable.finalY + 15;

    const addCurrencyIcon = (y: number) => {
      if (currencyformat === "₹") {
        doc.text("₹", 90, y);
      }
    };

    if (finalY + 50 > pageHeight) {
      doc.addPage();
      finalY = 20;
    }

    doc.setFontSize(10);

    addCurrencyIcon(finalY);
    doc.text(`Balance as per bank book : ${BankBalance}`, 15, finalY);

    addCurrencyIcon(finalY + 8);
    doc.text(`Less: Cheques deposited but not credited : ${chequesdepositedbutnotcredited}`, 15, finalY + 8);

    addCurrencyIcon(finalY + 16);
    doc.text(`Add: Cheques issued but not cleared : ${CHEQUESISSUEDBUTNOTCLEARED}`, 15, finalY + 16);

    addCurrencyIcon(finalY + 24);
    doc.text(`Balance as per pass book / statement : ${balanceperbankbook}`, 15, finalY + 24);

    doc.text("Account Officer", 15, finalY + 50);
    doc.text("Manager", pageWidth / 2 - 20, finalY + 50);
    doc.text("Verified by", pageWidth - 50, finalY + 50);

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    if (printorpdf === "Pdf") {
      doc.save(`${reportName}.pdf`);
    }

    if (printorpdf === "Print") {
      this.setiFrameForPrint(doc);
    }
  }



  transform(items: any[], searchText: string, columnName: string): any[] {
    debugger
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toString().toLowerCase();
    return items.filter(it => {
      return it[columnName].toString().toLowerCase().startsWith(searchText);
      //return it[columnName].toString().toLowerCase().includes(searchText);
    });
  }

  GetGlobalBanks(): Observable<any> {
    debugger;
    return this.getAPI('/Common/GetGlobalBanks', '', 'NO');
  }
  GetGlobalUPINames(): Observable<any> {
    debugger;
    return this.getAPI('/Common/GetGlobalUPINames', '', 'NO');
  }
  //  _MultipleGroupingGridExportData(griddata:any, groupdcol:any, isgroupedcolDate:any) {
  //   debugger;

  //   let a = [];
  //   let Ajv = [];
  //   let keys = [];
  //   let Jvlist = [];
  //   for (var i = 0; i < griddata.length; i++) {
  //     let Jsongroupcol;
  //     let Ajvlistgroupcol;
  //     if (isgroupedcolDate == true) {
  //       //Jsongroupcol = formatDate(griddata[i][groupdcol], 'dd-MM-yyyy', 'en-IN');
  //       Jsongroupcol = this.getFormatDateGlobal(griddata[i][groupdcol]);
  //       Ajvlistgroupcol = griddata[i]["ptransactionno"];
  //     }
  //     else {
  //       Jsongroupcol = griddata[i][groupdcol];
  //       Ajvlistgroupcol = griddata[i]["ptransactionno"];
  //     }

  //     if (!a[Jsongroupcol]) {


  //       keys.push(Jsongroupcol);
  //       let k = { ...griddata[i] }
  //       a[Jsongroupcol] = [k];

  //     }
  //     a[Jsongroupcol].push(griddata[i]);


  //     if (!Ajv[Ajvlistgroupcol]) {

  //       Jvlist.push(Ajvlistgroupcol);
  //       let k = { ...griddata[i] }
  //       Ajv[Ajvlistgroupcol] = [k];
  //     }

  //     Ajv[Ajvlistgroupcol].push(griddata[i]);
  //   }

  //   let final = [];
  //   for (var j = 0; j < Jvlist.length; j++) {

  //     let keypair = Ajv[Jvlist[j]]
  //     for (var k = 0; k < keypair.length; k++) {
  //       let groupcolHead

  //       if (k == 0) {
  //         if (isgroupedcolDate == true) {
  //           // groupcolHead = formatDate(keypair[k][groupdcol], 'dd-MM-yyyy', 'en-IN');
  //           groupcolHead = (keypair[k]["ptransactionno"]);
  //         }
  //         else {
  //           groupcolHead = keypair[k]["ptransactionno"];
  //         }
  //         keypair[k]["group"] = {
  //           content: '               ' + groupcolHead + '',
  //           colSpan: 15,
  //           styles: { halign: 'left', fontStyle: 'bold', textColor: "#663300" }
  //         };
  //       }
  //       final.push(keypair[k])
  //     }
  //   }
  //   debugger;
  //   let NewdataArray = [];
  //   for (var RRR = 0; RRR < keys.length; RRR++) {
  //     let KeysN = keys[RRR];
  //     NewdataArray.push({
  //       group: {
  //         content: '' + KeysN + '',
  //         colSpan: 15,
  //         styles: { halign: 'left', fontStyle: 'bold', textColor: "#009933" }
  //       }
  //     });
  //     for (var AAA = 0; AAA < final.length; AAA++) {

  //       if (KeysN == this.getFormatDateGlobal(final[AAA][groupdcol])) {

  //         NewdataArray.push(final[AAA]);
  //       }

  //     }

  //   }
  //   return NewdataArray;

  // }


  hrmsjvtypes = [
    { "name": 'ESI', "value": 'ESI' },
    { "name": 'PROVIDENT FUND', "value": 'PF' },
    { "name": 'AO ALLOWANCES', "value": 'AO ALLOWANCES' },
    { "name": 'PROFISSIONAL TAX', "value": 'PT' },
    { "name": 'VDA', "value": 'VDA' },
    { "name": 'HRA', "value": 'HRA' },
    { "name": 'CHIT ACT ALLOWANCE', "value": 'CHIT ACT' },
    { "name": 'PRO ALLOWANCE', "value": 'PRO' },
    { "name": 'FOREMAN ALLOWANCE', "value": 'FOREMAN' },
    { "name": 'DRIVER ALLOWANCE', "value": 'DRIVER ALLOWANCE' },
    { "name": 'LOYALTY ALLOWANCES', "value": 'LOYALTY ALLOWANCES' },
    { "name": 'VEHICLE ALLOWANCE', "value": 'VEHICLE' },
    { "name": 'RISK ALLOWANCE', "value": 'RISK ALLOWANCE' },
    { "name": 'BIDPAYABLE ALLOWANCE', "value": 'BID PAYABLE' },
    { "name": 'ASSISTANT - AO ALLOWANCE', "value": 'ASSISTANT-AO' },
    { "name": 'CHILDREN EDUCATION ALLOWANCE', "value": 'CHILDREN EDUCATION' },
    { "name": 'CITY ALLOWANCE', "value": 'CITY ALLOWANCE' },
    { "name": 'WASHING ALLOWANCE', "value": 'WASHING ALLOWANCE' },
    { "name": 'CONVEYANCE ALLOWANCE', "value": 'CONVEYANCE ALLOWANCE' },
    { "name": 'SPECIAL ALLOWANCE', "value": 'SPECIAL ALLOWANCE' },
    { "name": 'STAFF SALARIES', "value": 'STAFF SALARIES' },
    { "name": 'WELFARE-INSURANCE', "value": 'WELFARE-INSURANCE' },
    { "name": 'COLLECTION TARGET DEDUCTION', "value": 'COLLECTION TARGET DEDUCTION' },
    { "name": 'REAL ESTATE DEDUCTION', "value": 'REAL ESTATE DEDUCTION' },
    { "name": 'TARGET RELEASE', "value": 'TARGET RELEASE' }

  ]

  exceptionHandlingMessages(formName: string, methodName: string, errorMessage: string) {
    this.toastr.error(errorMessage, "Error!", { timeOut: 2500 });
  }
  getFormatDate1(date: Date | string | null): string | null {

    if (!date) return null;

    const dateFormat = sessionStorage.getItem('dateformat');

    if (dateFormat === 'DD-MMM-YYYY') {
      return this.datepipe.transform(date, 'dd-MM-yyyy');
    }

    return this.datepipe.transform(date, 'yyyy-MM-dd');
  }
  GetUPIClearedData_SummaryReport(
    fromDate: string | null,
    toDate: string | null
  ): Observable<any> {

    let params = new HttpParams()
      .set('BranchSchema', this.getschemaname())
      .set('fromdate', fromDate ?? '')
      .set('todate', toDate ?? '');

    return this.http.get<any>(
      '/ChequesOnHand/GetUPIClearedData_SummaryReport',
      { params }
    );
  }
  _OnlineSettlementReportPdf(
    reportName: string,
    gridData: any[],
    gridHeaders: string[],
    colWidthHeight: any,
    pageType: 'a4' | 'landscape',
    betweenOrAsOn: 'Between' | 'As On',
    fromDate: string,
    toDate: string,
    printOrPdf: 'Pdf' | 'Print',
    amount?: string
  ): void {

    const company = this._getCompanyDetails();
    const address = this.getcompanyaddress();
    const today = this.pdfProperties('Date');
    const logo = this.getKapilGroupLogo();
    const currencySymbol = this.currencysymbol;

    const doc = new jsPDF({
      orientation: pageType === 'landscape' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const totalPagesExp = '{total_pages_count_string}';

    autoTable(doc, {
      head: [gridHeaders],
      body: gridData,
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: this.pdfProperties('Header Color'),
        halign: (this.pdfProperties('Header Alignment') as 'left' | 'center' | 'right') ?? 'center',
        fontSize: Number(this.pdfProperties('Header Fontsize')) || 10
      },
      styles: {
        fontSize: Number(this.pdfProperties('Cell Fontsize')) || 9,
        cellPadding: 1,
        overflow: 'linebreak'
      },
      columnStyles: colWidthHeight,
      didDrawPage: (data: any) => {

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);

        if (logo) {
          doc.addImage(logo, 'JPEG', 10, 5, 25, 15);
        }

        doc.text(company.pCompanyName, pageWidth / 2, 10, { align: 'center' });

        doc.setFontSize(8);
        doc.text(address, pageWidth / 2, 15, { align: 'center' });

        if (company.pCinNo) {
          doc.text(`CIN : ${company.pCinNo}`, pageWidth / 2, 20, { align: 'center' });
        }

        doc.setFontSize(12);
        doc.text(reportName, pageWidth / 2, 28, { align: 'center' });

        doc.setFontSize(9);

        if (betweenOrAsOn === 'Between') {
          doc.text(`Between : ${fromDate}  And  ${toDate}`, 14, 34);
        } else if (betweenOrAsOn === 'As On' && fromDate) {
          doc.text(`As On : ${fromDate}`, 14, 34);
        }

        doc.text(`Branch : ${company.pBranchname}`, pageWidth - 14, 34, { align: 'right' });

        doc.line(10, 36, pageWidth - 10, 36);

        const pageNumber = doc.getNumberOfPages();
        let pageText = `Page ${pageNumber}`;

        if (typeof doc.putTotalPages === 'function') {
          pageText += ` of ${totalPagesExp}`;
        }

        doc.line(10, pageHeight - 12, pageWidth - 10, pageHeight - 12);

        doc.setFontSize(9);
        doc.text(`Printed on : ${today}`, 10, pageHeight - 6);
        doc.text(pageText, pageWidth - 10, pageHeight - 6, { align: 'right' });
      }
    });

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    if (printOrPdf === 'Pdf') {
      doc.save(`${reportName}.pdf`);
    } else {
      this.setiFrameForPrint(doc);
    }
  }


 

}







