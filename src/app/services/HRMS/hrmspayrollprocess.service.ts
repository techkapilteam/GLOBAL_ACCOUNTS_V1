// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class HrmspayrollprocessService {
  
// }
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import * as jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { jsPDF } from 'jspdf';


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from '@angular/common';
// import 'jspdf-autotable';
// import { formatDate } from '@angular/common';
// import { formatDate } from "@angular/common";
import { CommonService } from '../common.service';
// import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Injectable({
  providedIn: 'root'
})


export class HrmspayrollprocessService {

  constructor(private _CommonService: CommonService) { }

  GetPayrollProcessDetails(searchtype:any, MonthYear:any, BranchId:any): Observable<any> {
   
    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('searchtype', searchtype).set('MonthYear', MonthYear).set("BranchId", BranchId);

    // return this._CommonService.getAPI('/Transactions/HRMSTransactions/GetEmployeeDetailsPayroll', params, 'YES');
    return this._CommonService.getAPI('/Transactions/HRMSTransactions/GetEmployeeDetailsPayroll', params, 'YES');
    
  }



  


  
  // Save JV Details
  SaveJVDetails(data:any):any {
    try {
      debugger
      return this._CommonService.postAPI("/Transactions/HRMSTransactions/SaveJVDetails", data)
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }

  //----Save Payroll Process

  SavePayrollProcess(data:any):any {
    try {
      debugger
      return this._CommonService.postAPI("/Transactions/HRMSTransactions/SaveEmpPayroll", data)
    }
    catch (errormssg) {
      this._CommonService.showErrorMessage(errormssg);
    }
  }

  GetPayRollApprovalDetails(serachtype:any, Month:any, BranchId:any): Observable<any> {

    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('searchtype', serachtype).set('MonthYear', Month).set("BranchId", BranchId);
    return this._CommonService.getAPI('/Transactions/HRMSTransactions/GetEmployeeDetailsPayrollApproval', params, 'YES');


  }

  GetSalaryStatemetDetails(serachtype:any, Month:any, BranchId:any): Observable<any> {

    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('searchtype', serachtype).set('MonthYear', Month).set("BranchId", BranchId);
    return this._CommonService.getAPI('/Transactions/HRMSTransactions/GetEmployeeDetailsPayrollApproved', params, 'YES');

  }

  SavePayrollApproval(data:any, Type:any):any {
    debugger
    try {
      return this._CommonService.postAPI('/Transactions/HRMSTransactions/AuthoriseEmpPayroll?Type=' + Type, data);
    }

    catch (e) {
      this._CommonService.showErrorMessage(e);
    }
    //let path = '/Settings/Users/AddFormToMenu/SaveUserRights?_AllmenuformsDTO=' + Formsdata + '&roleid=' + roleid + '&userid=' + userid + '';
  }


  //HRMS Proffesional Tax Report Api's Start; MAHESH M

  getEmployeesList() {
    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname());
    return this._CommonService.getAPI('/HRMSController/getEmployees', params, 'YES');
  }


  showProffesionalTaxDetails(searchtype:any,Month:any): Observable<any> {

    const params = new HttpParams().set("searchtype", searchtype).set('MonthYear', Month).set('Branchschema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/HRMSController/getProffesionalTaxDetailsList', params, 'YES');

  }

  showEsiStatementDetails(searchtype:any,Month:any): Observable<any> {

    const params = new HttpParams().set("searchtype", searchtype).set('MonthYear', Month).set('Branchschema', this._CommonService.getschemaname());;

    return this._CommonService.getAPI('/Transactions/HRMSReports/GetEmployeeEsiDetails', params, 'YES');

  }

  // get jv details by jv type
  GetJVDetails(emplyoeeCode:any, monthYear:any, jvType:any): Observable<any> {
    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('EmployeeCode', emplyoeeCode).set('MonthYear', monthYear).set('JVType', jvType);
    return this._CommonService.getAPI('/Transactions/HRMSTransactions/GetJVDetailsByType', params, 'YES');
  }
  //check check jv type already processed or not
  GetJVDetailsDuplicateCheck(monthYear:any, jvType:any): Observable<any> {
    const params = new HttpParams().set('Branchschema', this._CommonService.getschemaname()).set('MonthYear', monthYear).set('JVType', jvType);
    return this._CommonService.getAPI('/Transactions/HRMSTransactions/GetJVDetailsDuplicateCheck', params, 'YES');
  }

  // _downloadProffesionalTaxReportsPdf(reportName:any, gridData:any, gridheaders:any, colWidthHeight:any, pagetype:any, betweenorason:any, fromdate:any, printorpdf:any,totalamounts:any) {
  //   debugger;
  //   let address = this._CommonService.getcompanyaddress();
  //   let Companyreportdetails = this._CommonService._getCompanyDetails();
  //   let doc = new jsPDF(pagetype);

  //   let totalPagesExp = '{total_pages_count_string}'
  //   let today = formatDate(new Date(), 'dd-MM-yyyy hh:mm', 'en-IN');
  // //  let Easy_chit_Img = this._CommonService.Easy_chit_Img;
  //   let currencyformat = this._CommonService.currencysymbol;
  //   let rupeeImage = this._CommonService._getRupeeSymbol();
  //   let kapil_logo=this._CommonService.getKapilGroupLogo();
  //   var lMargin = 15; //left margin in mm
  //   var rMargin = 15; //right margin in mm 
  //   var pdfInMM;


  //   doc.autoTable({
  //     columns: gridheaders,
  //     body: gridData,
  //     theme: 'grid',
  //     headStyles: {
  //       fillColor: this._CommonService.pdfProperties("Header Color"),
  //       halign: this._CommonService.pdfProperties("Header Alignment"),
  //       fontSize: this._CommonService.pdfProperties("Header Fontsize")
  //     },
  //     styles: {
  //       cellPadding: 1, fontSize: this._CommonService.pdfProperties("Cell Fontsize"), cellWidth: 'wrap',
  //       rowPageBreak: 'avoid',
  //       overflow: 'linebreak'
  //     },
  //     // Override the default above for the text column
  //     columnStyles: colWidthHeight,
  //     startY: 48,
  //     showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
  //     showFoot: 'lastPage',
  //     didDrawPage: function(data:any) {

  //       let pageSize = doc.internal.pageSize;
  //       let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
  //       let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
  //       // Header
  //       doc.setFontStyle('normal');
  //       if (doc.internal.getNumberOfPages() == 1) {
  //         debugger;
  //         doc.setFontSize(15);
  //         if (pagetype == "a4") {
  //           doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20)
  //           doc.setTextColor('black');
  //           doc.text(Companyreportdetails.pCompanyName, 60, 20);
  //           doc.setFontSize(8);
  //           doc.text(address, 40, 27, 0, 0, 'left');
  //           if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
  //             doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 85, 32);
  //           }
  //           doc.setFontSize(14);
  //           doc.text(reportName, 90, 42);
  //           doc.setFontSize(10);
  //           doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 163, 47);
  //           doc.setDrawColor(0, 0, 0);
  //           pdfInMM = 233;
  //           doc.line(10, 50, (pdfInMM - lMargin - rMargin), 50) // horizontal line
  //         }
  //         if (pagetype == "landscape") {
  //           doc.addImage(kapil_logo, 'JPEG', 10,5)
  //           doc.setTextColor('black');
  //           doc.text(Companyreportdetails.pCompanyName, 110, 10);
  //           doc.setFontSize(10);
  //           doc.text(address, 80, 15, 0, 0, 'left');
  //           if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
  //             doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 125, 20);
  //           }
  //           doc.setFontSize(14);
           
  //           doc.text(reportName, 130, 30);
  //           doc.setFontSize(10);
  //           //  doc.text('Printed On : ' + today + '', 15, 57);
  //           doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 235, 40);
  //           doc.setDrawColor(0, 0, 0);
  //           pdfInMM = 315;
  //           doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45) // horizontal line
  //         }
  //       }
  //       else {
  //         data.settings.margin.top = 20;
  //         data.settings.margin.bottom = 15;
  //       }
  //       debugger;
  //       var pageCount = doc.internal.getNumberOfPages();
  //       if (doc.internal.getNumberOfPages() == totalPagesExp) {
  //         debugger;

  //       }
  //       // Footer
  //       let page = "Page " + doc.internal.getNumberOfPages()
  //       // Total page number plugin only available in jspdf v1.0+
  //       if (typeof doc.putTotalPages === 'function') {
  //         debugger;
  //         page = page + ' of ' + totalPagesExp
  //       }
  //       doc.line(5, pageHeight - 10, (pdfInMM - lMargin - rMargin), pageHeight - 10) // horizontal line
  //       doc.setFontSize(10);
  //       doc.text("Printed on : " + today, data.settings.margin.left, pageHeight - 5);
  //       doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
  //     },

  //     willDrawCell: function(data:any) {
  //       debugger
  //       if ((data.section == "body" && data.cell.colSpan != 15) && data.cell.raw != "0") {
  //         data.cell.text[0] = '' + data.cell.raw
  //       }
       
  //     },
  //     didDrawCell: function(data:any) {
  //       debugger
  //       if ((data.column.index == 4 || data.column.index == 5 || data.column.index == 6) && data.cell.section == 'body') {
  //         var td = data.cell.raw;
  //         // if (td) {
  //           if (currencyformat == "₹") {
  //             var textPos = data.cell.textPos;
  //             doc.setFontStyle('normal');
  //             doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.7, 1.7);
  //           }
  //         //}
  //       }
  //     }
  //   });
  //   doc.setFontSize(8);
  //   console.log(totalamounts)
  //   doc.text('Total', 90, doc.autoTable.previous.finalY + 4);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 158, doc.autoTable.previous.finalY + 2, 1.5, 2);
  //   }
  //   doc.text(totalamounts.totalGrossSalary + '', 160, doc.autoTable.previous.finalY + 4);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 198, doc.autoTable.previous.finalY + 2, 1.5, 2);
  //   }
  //   doc.text(totalamounts.totalNetSalary + '', 200, doc.autoTable.previous.finalY + 4);

  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 256, doc.autoTable.previous.finalY + 2, 1.5, 2);
  //   }
  //   doc.text(totalamounts.totalTax + '', 258, doc.autoTable.previous.finalY + 4);    doc.setFontSize(10)

  //   doc.text("Cheque NO.", 15, doc.autoTable.previous.finalY + 20);
  //   doc.text("BANK", 115, doc.autoTable.previous.finalY + 20);

  //   doc.text("A.G.M", 15, doc.autoTable.previous.finalY + 35);
  //   doc.text("R.M", 95, doc.autoTable.previous.finalY + 35);
  //   doc.text("Manager", 165, doc.autoTable.previous.finalY + 35);
  //   doc.text("Accounts Officer", 225, doc.autoTable.previous.finalY + 35);



  //   if (typeof doc.putTotalPages === 'function') {
  //     debugger;
  //     doc.putTotalPages(totalPagesExp);

  //   }
  //   if (printorpdf == "Pdf") {
  //     doc.save('' + reportName + '.pdf');
  //   }
  //   if (printorpdf == "Print") {
  //     this._CommonService.setiFrameForPrint(doc);
  //   }

  // }


//   _downloadProfessionalTaxReportsPdf(
//   reportName: any,
//   gridData: any,
//   gridHeaders: any,
//   colWidthHeight: any,
//   pageType: any,
//   betweenOrAsOn: any,
//   fromDate: any,
//   printOrPdf: any,
//   totalAmounts: any
// ) {
//   // Local helper to replace Kendo's isNullOrEmptyString
//   const isNullOrEmptyString = (value: any) => {
//     return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
//   };

//   const address = this._CommonService.getcompanyaddress();
//   const Companyreportdetails = this._CommonService._getCompanyDetails();
//   const doc = new jsPDF(pageType);

//   const totalPagesExp = '{total_pages_count_string}';
//   const today = formatDate(new Date(), 'dd-MM-yyyy hh:mm', 'en-IN');
//   const currencyformat = this._CommonService.currencysymbol;
//   const rupeeImage = this._CommonService._getRupeeSymbol();
//   const kapil_logo = this._CommonService.getKapilGroupLogo();

//   const lMargin = 15;
//   const rMargin = 15;
//   let pdfInMM: number;

//   doc.autoTable({
//     columns: gridHeaders,
//     body: gridData,
//     theme: 'grid',
//     headStyles: {
//       fillColor: this._CommonService.pdfProperties("Header Color"),
//       halign: this._CommonService.pdfProperties("Header Alignment"),
//       fontSize: this._CommonService.pdfProperties("Header Fontsize")
//     },
//     styles: {
//       cellPadding: 1,
//       fontSize: this._CommonService.pdfProperties("Cell Fontsize"),
//       cellWidth: 'wrap',
//       rowPageBreak: 'avoid',
//       overflow: 'linebreak'
//     },
//     columnStyles: colWidthHeight,
//     startY: 48,
//     showHead: 'everyPage',
//     showFoot: 'lastPage',
//     didDrawPage: (data: any) => {
//       const pageSize = doc.internal.pageSize;
//       const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
//       const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

//       // Header
//       doc.setFontStyle('normal');
//       if (doc.internal.getNumberOfPages() === 1) {
//         doc.setFontSize(pageType === "a4" ? 15 : 10);

//         if (pageType === "a4") {
//           doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20);
//           doc.setTextColor('black');
//           doc.text(Companyreportdetails.pCompanyName, 60, 20);
//           doc.setFontSize(8);
//           doc.text(address, 40, 27, 0, 0, 'left');
//           if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
//             doc.text('CIN : ' + Companyreportdetails.pCinNo, 85, 32);
//           }
//           doc.setFontSize(14);
//           doc.text(reportName, 90, 42);
//           doc.setFontSize(10);
//           doc.text('Branch : ' + Companyreportdetails.pBranchname, 163, 47);
//           doc.setDrawColor(0, 0, 0);
//           pdfInMM = 233;
//           doc.line(10, 50, pdfInMM - lMargin - rMargin, 50);
//         }

//         if (pageType === "landscape") {
//           doc.addImage(kapil_logo, 'JPEG', 10, 5);
//           doc.setTextColor('black');
//           doc.text(Companyreportdetails.pCompanyName, 110, 10);
//           doc.setFontSize(10);
//           doc.text(address, 80, 15, 0, 0, 'left');
//           if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
//             doc.text('CIN : ' + Companyreportdetails.pCinNo, 125, 20);
//           }
//           doc.setFontSize(14);
//           doc.text(reportName, 130, 30);
//           doc.setFontSize(10);
//           doc.text('Branch : ' + Companyreportdetails.pBranchname, 235, 40);
//           doc.setDrawColor(0, 0, 0);
//           pdfInMM = 315;
//           doc.line(10, 45, pdfInMM - lMargin - rMargin, 45);
//         }
//       } else {
//         data.settings.margin.top = 20;
//         data.settings.margin.bottom = 15;
//       }

//       // Footer
//       let page = "Page " + doc.internal.getNumberOfPages();
//       if (typeof doc.putTotalPages === 'function') {
//         page += ' of ' + totalPagesExp;
//       }
//       doc.line(5, pageHeight - 10, pdfInMM - lMargin - rMargin, pageHeight - 10);
//       doc.setFontSize(10);
//       doc.text("Printed on : " + today, data.settings.margin.left, pageHeight - 5);
//       doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
//     },

//     willDrawCell: (data: any) => {
//       if (data.section === "body" && data.cell.colSpan !== 15 && data.cell.raw !== "0") {
//         data.cell.text[0] = '' + data.cell.raw;
//       }
//     },

//     didDrawCell: (data: any) => {
//       if ([4, 5, 6].includes(data.column.index) && data.cell.section === 'body') {
//         if (currencyformat === "₹") {
//           const textPos = data.cell.textPos;
//           doc.setFontStyle('normal');
//           doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.7, 1.7);
//         }
//       }
//     }
//   });

//   // Totals
//   doc.setFontSize(8);
//   doc.text('Total', 90, doc.autoTable.previous.finalY + 4);
//   if (currencyformat === "₹") {
//     doc.addImage(rupeeImage, 158, doc.autoTable.previous.finalY + 2, 1.5, 2);
//   }
//   doc.text(totalAmounts.totalGrossSalary + '', 160, doc.autoTable.previous.finalY + 4);
//   if (currencyformat === "₹") {
//     doc.addImage(rupeeImage, 198, doc.autoTable.previous.finalY + 2, 1.5, 2);
//   }
//   doc.text(totalAmounts.totalNetSalary + '', 200, doc.autoTable.previous.finalY + 4);
//   if (currencyformat === "₹") {
//     doc.addImage(rupeeImage, 256, doc.autoTable.previous.finalY + 2, 1.5, 2);
//   }
//   doc.text(totalAmounts.totalTax + '', 258, doc.autoTable.previous.finalY + 4);

//   // Signature section
//   doc.setFontSize(10);
//   doc.text("Cheque NO.", 15, doc.autoTable.previous.finalY + 20);
//   doc.text("BANK", 115, doc.autoTable.previous.finalY + 20);
//   doc.text("A.G.M", 15, doc.autoTable.previous.finalY + 35);
//   doc.text("R.M", 95, doc.autoTable.previous.finalY + 35);
//   doc.text("Manager", 165, doc.autoTable.previous.finalY + 35);
//   doc.text("Accounts Officer", 225, doc.autoTable.previous.finalY + 35);

//   // Total pages placeholder
//   if (typeof doc.putTotalPages === 'function') {
//     doc.putTotalPages(totalPagesExp);
//   }

//   // Save or Print
//   if (printOrPdf === "Pdf") {
//     doc.save(reportName + '.pdf');
//   }
//   if (printOrPdf === "Print") {
//     this._CommonService.setiFrameForPrint(doc);
//   }
// }



_downloadProfessionalTaxReportsPdf(
  reportName: string,
  gridData: any[],
  gridHeaders: any[],
  colWidthHeight: any,
  pageType: 'a4' | 'landscape',
  betweenOrAsOn: string,
  fromDate: string,
  printOrPdf: string,
  totalAmounts: any
) {
  const isNullOrEmptyString = (value: any) =>
    value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

  const address = this._CommonService.getcompanyaddress();
  const Companyreportdetails = this._CommonService._getCompanyDetails();
  const currencyformat = this._CommonService.currencysymbol;
  const rupeeImage = this._CommonService._getRupeeSymbol();
  const kapil_logo = this._CommonService.getKapilGroupLogo();
  const today = formatDate(new Date(), 'dd-MM-yyyy hh:mm', 'en-IN');

  const orientation = pageType === 'landscape' ? 'landscape' : 'portrait';

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });

  const totalPagesExp = '{total_pages_count_string}';
  const lMargin = 15;
  const rMargin = 15;
  let pdfInMM = pageType === 'landscape' ? 315 : 233;

  autoTable(doc, {
    columns: gridHeaders,
    body: gridData,
    theme: 'grid',
    // headStyles: {
    //   fillColor: this._CommonService.pdfProperties("Header Color"),
    //   halign: this._CommonService.pdfProperties("Header Alignment"),
    //   fontSize: this._CommonService.pdfProperties("Header Fontsize")
    // },
    // styles: {
    //   cellPadding: 1,
    //   fontSize: this._CommonService.pdfProperties("Cell Fontsize"),
    //   cellWidth: 'wrap',
    //   overflow: 'linebreak',
    //   rowPageBreak: 'avoid'
    // },


    headStyles: {
  fillColor: this._CommonService.pdfProperties("Header Color") || [200, 200, 200], // fallback gray
  halign: (this._CommonService.pdfProperties("Header Alignment") as 'left' | 'center' | 'right') || 'center',
  fontSize: Number(this._CommonService.pdfProperties("Header Fontsize") || 11)
},
styles: {
  cellPadding: 1,
  fontSize: Number(this._CommonService.pdfProperties("Cell Fontsize")),
  cellWidth: 'wrap',
  overflow: 'linebreak',
  rowPageBreak: 'avoid' as any  // bypass TS error
} as any


,

    columnStyles: colWidthHeight,
    startY: 48,
    showHead: 'everyPage',
    showFoot: 'lastPage',

    didDrawPage: (data: any) => {
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width;
      const pageHeight = pageSize.height;

      // Header
      doc.setFont('helvetica', 'normal');
      if (pageType === 'a4') {
        doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20);
        doc.setFontSize(15);
        doc.text(Companyreportdetails.pCompanyName, 60, 20);
        doc.setFontSize(8);
        doc.text(address, 40, 27);
        if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
          doc.text('CIN : ' + Companyreportdetails.pCinNo, 85, 32);
        }
        doc.setFontSize(14);
        doc.text(reportName, 90, 42);
        doc.setFontSize(10);
        doc.text('Branch : ' + Companyreportdetails.pBranchname, 163, 47);
        doc.line(10, 50, pdfInMM - lMargin - rMargin, 50);
      } else {
        // Landscape header
        doc.addImage(kapil_logo, 'JPEG', 10, 5, 20, 20);
        doc.setFontSize(10);
        doc.text(Companyreportdetails.pCompanyName, 110, 10);
        doc.text(address, 80, 15);
        if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
          doc.text('CIN : ' + Companyreportdetails.pCinNo, 125, 20);
        }
        doc.setFontSize(14);
        doc.text(reportName, 130, 30);
        doc.setFontSize(10);
        doc.text('Branch : ' + Companyreportdetails.pBranchname, 235, 40);
        doc.line(10, 45, pdfInMM - lMargin - rMargin, 45);
      }

      // Footer
      let pageText = `Page ${doc.getNumberOfPages()}`;
      if ((doc as any).putTotalPages) pageText += ` of ${totalPagesExp}`;

      doc.line(5, pageHeight - 10, pdfInMM - lMargin - rMargin, pageHeight - 10);
      doc.setFontSize(10);
      doc.text(`Printed on : ${today}`, data.settings.margin.left, pageHeight - 5);
      doc.text(pageText, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
    },

    didDrawCell: (data: any) => {
      if ([4, 5, 6].includes(data.column.index) && data.cell.section === 'body' && currencyformat === '₹') {
        const textPos = data.cell.textPos;
        doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.7, 1.7);
      }
    }
  });

  // Total section
  // doc.setFontSize(8);
  // doc.text('Total', 90, doc.autoTable.previous.finalY + 4);
  // if (currencyformat === '₹') {
  //   doc.addImage(rupeeImage, 158, doc.autoTable.previous.finalY + 2, 1.5, 2);
  // }
  // doc.text(totalAmounts.totalGrossSalary + '', 160, doc.autoTable.previous.finalY + 4);





  const finalY = (doc as any).autoTable.previous.finalY;
  doc.setFontSize(8);
doc.text('Total', 90, finalY + 4);
if (currencyformat === '₹') {
  doc.addImage(rupeeImage, 158, finalY + 2, 1.5, 2);
}
doc.text(totalAmounts.totalGrossSalary + '', 160, finalY + 4);

  // Total pages
  if ((doc as any).putTotalPages) (doc as any).putTotalPages(totalPagesExp);

  if (printOrPdf === "Pdf") {
    doc.save(reportName + '.pdf');
  } else {
    this._CommonService.setiFrameForPrint(doc);
  }
}


  //esi statement report
  setiFrameForPrint(doc:any) {
    debugger;
    const iframe = document.createElement('iframe');
    iframe.id = "iprint";
    iframe.name = "iprint";
    iframe.src = doc.output('bloburl');
    iframe.setAttribute('style', 'display: none;');
    document.body.appendChild(iframe);
    iframe.contentWindow?.print();
  }

_downloadEsiStatementReportPdf(
  reportName: string,
  gridData: any[],
  gridHeaders: any[],
  colWidthHeight: any,
  pageType: 'a4' | 'landscape',
  betweenOrAsOn: string,
  fromDate: string,
  employerContributionAmt: any,
  totalEmpEsiAmt: any,
  totalEsiAmt: any,
  printOrPdf: string,
  totalAmounts: any
) {
  const isNullOrEmptyString = (value: any) =>
    value === null || value === undefined || (typeof value === 'string' && value.trim() === '');

  const address = this._CommonService.getcompanyaddress();
  const Companyreportdetails = this._CommonService._getCompanyDetails();
  const currencyformat = this._CommonService.currencysymbol;
  const rupeeImage = this._CommonService._getRupeeSymbol();
  const kapil_logo = this._CommonService.getKapilGroupLogo();
  const today = formatDate(new Date(), 'dd-MM-yyyy hh:mm', 'en-IN');

  const orientation = pageType === 'landscape' ? 'landscape' : 'portrait';
  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

  const totalPagesExp = '{total_pages_count_string}';
  const lMargin = 15;
  const rMargin = 15;
  let pdfInMM = pageType === 'landscape' ? 315 : 233;

  autoTable(doc, {
    columns: gridHeaders,
    body: gridData,
    theme: 'grid',
    headStyles: {
      fillColor: this._CommonService.pdfProperties("Header Color") || [200, 200, 200],
      halign: (this._CommonService.pdfProperties("Header Alignment") as 'left' | 'center' | 'right') || 'center',
      fontSize: Number(this._CommonService.pdfProperties("Header Fontsize") || 11)
    },
    styles: {
      cellPadding: 1,
      fontSize: Number(this._CommonService.pdfProperties("Cell Fontsize") || 10),
      cellWidth: 'wrap',
      overflow: 'linebreak',
      rowPageBreak: 'avoid' as any
    } as any,
    columnStyles: colWidthHeight,
    startY: 48,
    showHead: 'everyPage',
    showFoot: 'lastPage',
    didDrawPage: (data: any) => {
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width;
      const pageHeight = pageSize.height;

      // Header
      doc.setFont('helvetica', 'normal');
      if (pageType === 'a4') {
        doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20);
        doc.setFontSize(15);
        doc.text(Companyreportdetails.pCompanyName, 60, 20);
        doc.setFontSize(8);
        doc.text(address, 40, 27);
        if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
          doc.text('CIN : ' + Companyreportdetails.pCinNo, 85, 32);
        }
        doc.setFontSize(14);
        doc.text(reportName, 90, 42);
        doc.setFontSize(10);
        doc.text('Branch : ' + Companyreportdetails.pBranchname, 163, 47);
        if (betweenOrAsOn === 'As On' && !isNullOrEmptyString(fromDate)) {
          doc.text('As on : ' + fromDate, 15, 47);
        }
        doc.line(10, 50, pdfInMM - lMargin - rMargin, 50);
      } else {
        // Landscape header
        doc.addImage(kapil_logo, 'JPEG', 10, 5, 20, 20);
        doc.setFontSize(10);
        doc.text(Companyreportdetails.pCompanyName, 110, 10);
        doc.text(address, 80, 15);
        if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
          doc.text('CIN : ' + Companyreportdetails.pCinNo, 125, 20);
        }
        doc.setFontSize(14);
        doc.text(reportName, 130, 30);
        doc.setFontSize(10);
        doc.text('Branch : ' + Companyreportdetails.pBranchname, 235, 40);
        if (betweenOrAsOn === 'As On' && !isNullOrEmptyString(fromDate)) {
          doc.text('As on : ' + fromDate, 15, 40);
        }
        doc.line(10, 45, pdfInMM - lMargin - rMargin, 45);
      }

      // Footer
      let pageText = `Page ${doc.getNumberOfPages()}`;
      if ((doc as any).putTotalPages) pageText += ` of ${totalPagesExp}`;

      doc.line(5, pageHeight - 10, pdfInMM - lMargin - rMargin, pageHeight - 10);
      doc.setFontSize(10);
      doc.text(`Printed on : ${today}`, data.settings.margin.left, pageHeight - 5);
      doc.text(pageText, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
    },
    didDrawCell: (data: any) => {
      if ([4, 5, 6].includes(data.column.index) && data.cell.section === 'body' && currencyformat === '₹') {
        const textPos = data.cell.textPos;
        doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.7, 1.7);
      }
    }
  });

  // Totals section
  const finalY = (doc as any).autoTable.previous.finalY;
  doc.setFontSize(8);
  doc.text('Total', 90, finalY + 4);
  if (currencyformat === '₹') doc.addImage(rupeeImage, 158, finalY + 2, 1.5, 2);
  doc.text(totalAmounts.totalGrossSalary + '', 160, finalY + 4);

  doc.setFontSize(10);
  const yStart = finalY + 20;
  if (currencyformat === '₹') doc.addImage(rupeeImage, 88, yStart, 1.9, 1.9);
  doc.text(`Employer Contribution(3.25%) : ${employerContributionAmt}`, 15, yStart);

  if (currencyformat === '₹') doc.addImage(rupeeImage, 88, yStart + 3, 1.9, 1.9);
  doc.text(`Employee Contribution(0.75%) : ${totalEmpEsiAmt}`, 15, yStart + 5);

  if (currencyformat === '₹') doc.addImage(rupeeImage, 88, yStart + 6, 1.9, 1.9);
  doc.text(`Total E.S.I : ${totalEsiAmt}`, 15, yStart + 10);

  // Signatures
  doc.text("Cheque NO.", 15, yStart + 30);
  doc.text("BANK", 115, yStart + 30);
  doc.text("A.G.M", 15, yStart + 45);
  doc.text("R.M", 95, yStart + 45);
  doc.text("Manager", 165, yStart + 45);
  doc.text("Account Officer", 225, yStart + 45);

  // Total pages plugin
  if ((doc as any).putTotalPages) (doc as any).putTotalPages(totalPagesExp);

  if (printOrPdf === 'Pdf') {
    doc.save(reportName + '.pdf');
  } else {
    this._CommonService.setiFrameForPrint(doc);
  }
}




  //HRMS Proffesional Tax Report Api's End;

  // _downloadPayrollProcessApprovalPdf(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, fromdate, todate, printorpdf,gridtotals) {
  //   debugger;
  //   let address = this._CommonService.getcompanyaddress();
  //   let Companyreportdetails = this._CommonService._getCompanyDetails();
  //   let doc = new jsPDF(pagetype);
  //   let currencyformat = this._CommonService.currencysymbol;
  //   let rupeeImage = this._CommonService._getRupeeSymbol();
  //   let kapil_logo = this._CommonService.getKapilGroupLogo();
  //   // let doc = new jsPDF('lanscape');
  //   let totalPagesExp = '{total_pages_count_string}'
  //   let today = formatDate(new Date(), 'dd-MMM-yyyy  h:mm:ss a', 'en-IN');
  //  var lMargin = 15; //left margin in mm
  //  var rMargin = 15; //right margin in mm
  //  var pdfInMM;
  //  let pageheight;
  //  let data2;

  //   var raw = gridData;
  //   var body = []
  // debugger
  //   for (var i = 0; i < raw.length; i++) {
  //     var row = []
  //     debugger
  //     for (var key in raw[i]) {
  //       row.push(raw[i][key])
       
  //     }
  //     if (i % 2 === 0) {
  //       row.unshift({
  //         rowSpan: 2,
  //         content: row[1],
  //         styles: { valign: 'middle', halign: 'center'},
  //       })
  //       row.splice(2,1);
  //     }
  //     if (i % 2 === 0) {
  //       row.unshift({
  //         rowSpan: 2,
  //         content: row[1],
  //         styles: { valign: 'middle', halign: 'center'},
  //       })
  //       row.splice(2,1);
  //     }

  //     body.push(row);
  
  //   }
  //   doc.autoTable({
  //     head: gridheaders,
  //     body: body,
  //     theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
  //     headStyles: {
  //       fillColor: this._CommonService.pdfProperties("Header Color"),
  //       halign: this._CommonService.pdfProperties("Header Alignment"),
  //       fontSize: this._CommonService.pdfProperties("Header Fontsize")
  //     }, // Red
  //     styles: {
  //       cellPadding: 1, fontSize: this._CommonService.pdfProperties("Cell Fontsize"), cellWidth: 'wrap',
  //       rowPageBreak: 'avoid',
  //       overflow: 'linebreak'
  //     },
  //     // Override the default above for the text column
  //     columnStyles: colWidthHeight,
  //     startY: 48,
  //     showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
  //     showFoot: 'lastPage',
  //     didDrawPage: function(data) {

  //       let pageSize = doc.internal.pageSize;
  //       let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
  //       let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
  //       data2 = data;
  //       // Header
  //       doc.setFontStyle('normal');
  //       if (doc.internal.getNumberOfPages() == 1) {
  //         debugger;
  //         doc.setFontSize(15);
  //         if (pagetype == "a4") {

  //           doc.addImage(kapil_logo, 'JPEG', 10, 5)
  //           doc.setTextColor('black');
  //           doc.text(Companyreportdetails.pCompanyName, 60, 10);
  //           doc.setFontSize(8);
  //           doc.text(address, 40, 17, 0, 0, 'left');
  //           if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
  //             doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 85, 22);
  //           }
  //           doc.setFontSize(14);
  //             doc.text(reportName, 100, 32);
  //           doc.setFontSize(10);
  //           // if (betweenorason == "Between") {

  //           //   doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 57);
  //           // }
  //           // else if (betweenorason == "As on") {

  //           //   if (fromdate != "") {
  //           //     doc.text('As on  : ' + fromdate + '', 15, 57);
  //           //   }
  //           // }
  //           doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 163, 40);
  //           doc.setDrawColor(0, 0, 0);
  //           pdfInMM = 233;
  //           doc.line(10, 43, (pdfInMM - lMargin - rMargin), 43) // horizontal line
  //         }
  //         if (pagetype == "landscape") {
  //           doc.addImage(kapil_logo, 'JPEG', 10, 5)
  //           doc.setTextColor('black');
  //           doc.text(Companyreportdetails.pCompanyName, 110, 10);
  //           doc.setFontSize(10);
  //           doc.text(address, 80, 17, 0, 0, 'left');
  //           if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
  //             doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 125, 22);
  //           }
  //           doc.setFontSize(14);
           
  //             doc.text(reportName, 105, 32);
           
  //             doc.setFontSize(10);
  //             //  doc.text('Printed On : ' + today + '', 15, 57);
  //             doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 235, 42);
  //             doc.setDrawColor(0, 0, 0);
  //             pdfInMM = 315;
  //             doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45) // horizontal line
  //           doc.setFontSize(10);
  //           // if (betweenorason == "Between") {

  //           //   doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 58);
  //           // }
  //           // else if (betweenorason == "As on") {

  //           //   if (fromdate != "") {
  //           //     doc.text('As on  : ' + fromdate + '', 15, 58);
  //           //   }
  //           // }
  //           // doc.text('Printed On : ' + today + '', 15, 57);
  //         }

  //       }
  //       else {

  //         data.settings.margin.top = 20;
  //         data.settings.margin.bottom = 15;
  //       }
  //       debugger;
  //       var pageCount = doc.internal.getNumberOfPages();
  //       if (doc.internal.getNumberOfPages() == totalPagesExp) {
  //         debugger;

  //       }
  //       // Footer
  //       let page = "Page " + doc.internal.getNumberOfPages()
  //       // Total page number plugin only available in jspdf v1.0+
  //       if (typeof doc.putTotalPages === 'function') {
  //         debugger;
  //         page = page + ' of ' + totalPagesExp
  //       }
  //       doc.line(5, pageHeight - 10, (pdfInMM - lMargin - rMargin), pageHeight - 10) // horizontal line

  //       doc.setFontSize(10);
  //       doc.text("Printed on : " + today, data.settings.margin.left, pageHeight - 5);
        
  //       //doc.text(officeCd, pageWidth / 2, pageHeight - 5, 'center');
  //       doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
        
  //     },
  //     didDrawCell: function(data) {

  //       if ((data.column.index == 23||data.column.index == 3 || data.column.index == 4 || data.column.index == 5 || data.column.index == 6 || data.column.index == 7 || data.column.index == 8 || data.column.index == 9 || data.column.index == 10 || data.column.index == 11 || data.column.index == 12 || data.column.index == 13 || data.column.index == 14 || data.column.index == 15 || data.column.index == 16 || data.column.index == 17 || data.column.index == 18 || data.column.index == 19 || data.column.index == 20 || data.column.index == 21 || data.column.index == 22) && data.cell.section === 'body') {

  //         var td = data.cell.raw;
  //         if (td) {
  //           if (currencyformat == "₹") {
  //             var textPos = data.cell.textPos;
  //             doc.setFontStyle('normal');
  //             doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.5, 1.5);
  //           }
  //         }

  //       }

  //     }
  //   });
  //   doc.setFontSize(10);

  //   ///By Ramakanth adding extra page for the totals : 27-09-2021
  //   if(doc.autoTable.previous.finalY+50 < doc.internal.pageSize.getHeight() - 15)
  //   {
  //     debugger;
  //   doc.text('Totals :', 20, doc.autoTable.previous.finalY + 8);
  //   doc.text('Basic                  :'+"     "+gridtotals['basic'], 20, doc.autoTable.previous.finalY + 15);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 49, doc.autoTable.previous.finalY + 13, 1.9, 1.9);
  //   }
  //   doc.text('VDA                   :'+"     "+gridtotals['vda'], 20, doc.autoTable.previous.finalY + 20);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 49, doc.autoTable.previous.finalY + 18, 1.9, 1.9);
  //   }
  //   doc.text('Arrears               :'+"     "+gridtotals['arrears'], 20, doc.autoTable.previous.finalY + 25);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 49, doc.autoTable.previous.finalY + 23, 1.9, 1.9);
  //   }
  //   doc.text('Basic Protection :'+"     "+gridtotals['basicprotection'], 20, doc.autoTable.previous.finalY + 30);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 49, doc.autoTable.previous.finalY + 28, 1.9, 1.9);
  //   }
  //   doc.text('Allowances         :'+"     "+gridtotals['allowances'], 20, doc.autoTable.previous.finalY + 35);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 49, doc.autoTable.previous.finalY + 33, 1.9, 1.9);
  //   }
  //   doc.text('Special Allowance     :'+"     "+gridtotals['specialallowance'], 120, doc.autoTable.previous.finalY + 15);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 156, doc.autoTable.previous.finalY + 13, 1.9, 1.9);
  //   }
  //   doc.text('Increment Protection :'+"     "+gridtotals['incrementprotection'], 120, doc.autoTable.previous.finalY + 20);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 156, doc.autoTable.previous.finalY + 18, 1.9, 1.9);
  //   }
  //   doc.text('Advance                    :'+"     "+gridtotals['advances'], 120, doc.autoTable.previous.finalY + 25);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 156, doc.autoTable.previous.finalY + 23, 1.9, 1.9);
  //   }
  //   doc.text('Insurance                  :'+"     "+gridtotals['insurance'], 120, doc.autoTable.previous.finalY + 30);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 156, doc.autoTable.previous.finalY + 28, 1.9, 1.9);
  //   }
  //   doc.text('Recoveries                :'+"     "+gridtotals['recoveries'], 120, doc.autoTable.previous.finalY + 35);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 156, doc.autoTable.previous.finalY + 33, 1.9, 1.9);
  //   }
  //   doc.text('Income Tax :'+"     "+gridtotals['incometax'], 220, doc.autoTable.previous.finalY +15);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 242, doc.autoTable.previous.finalY + 13, 1.9, 1.9);
  //   }
  //   doc.text('PF               :'+"     "+gridtotals['pf'], 220, doc.autoTable.previous.finalY + 20);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 242, doc.autoTable.previous.finalY + 18, 1.9, 1.9);
  //   }
  //   doc.text('ESI              :'+"     "+gridtotals['esi'], 220, doc.autoTable.previous.finalY + 25);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 242, doc.autoTable.previous.finalY + 23, 1.9, 1.9);
  //   }
  //   doc.text('Absent        :'+"     "+gridtotals['absenties'], 220, doc.autoTable.previous.finalY + 30);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 242, doc.autoTable.previous.finalY + 28, 1.9, 1.9);
  //   }
  //   doc.text('Prof. Tax     :'+"     "+gridtotals['proftax'], 220, doc.autoTable.previous.finalY + 35);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 242, doc.autoTable.previous.finalY + 33, 1.9, 1.9);
  //   }
  //   doc.setDrawColor(0, 0, 0);
  //   pdfInMM = 315;
  //   doc.line(10, doc.autoTable.previous.finalY + 40, (pdfInMM - lMargin - rMargin), doc.autoTable.previous.finalY + 40);
  //   doc.text('Total Gross Salary:'+"     "+gridtotals['gross'], 20, doc.autoTable.previous.finalY + 45);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 52, doc.autoTable.previous.finalY + 43, 1.9, 1.9);
  //   }
  //   doc.text('Total Deductions:'+"      "+gridtotals['deductions'], 120, doc.autoTable.previous.finalY + 45);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 150, doc.autoTable.previous.finalY + 43, 1.9, 1.9);
  //   }
  //   doc.text('Total Net Salary:'+"     "+gridtotals['net'], 220, doc.autoTable.previous.finalY + 45);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 248,doc.autoTable.previous.finalY + 43, 1.9, 1.9);
  //   }
  //   doc.setDrawColor(0, 0, 0);
  //   pdfInMM = 315;
  //   doc.line(10, doc.autoTable.previous.finalY + 50, (pdfInMM - lMargin - rMargin), doc.autoTable.previous.finalY + 50);
  //   // doc.text("Cheque No.", 15, doc.autoTable.previous.finalY + 60);
  //   // doc.text("Bank", 115, doc.autoTable.previous.finalY + 60);

  //   /*doc.text("A.G.M", 15, doc.autoTable.previous.finalY + 70);
  //   doc.text("R.M", 95, doc.autoTable.previous.finalY + 70);
  //   doc.text("Manager", 165, doc.autoTable.previous.finalY + 70);
  //   doc.text("Account Officer", 225, doc.autoTable.previous.finalY + 70);*/
  //   //COMMENTED ABOVE CODE ON 27.11.2023 AS Salutation not printing (jagadish)
  //   doc.text("A.G.M", 15, 199);
  //   doc.text("R.M", 95, 199);
  //   doc.text("Manager", 165, 199);
  //   doc.text("Account Officer", 225,199);
 
  // }else{
  //   doc.addPage();
  //   doc.setFontSize(10);
    
  //   doc.text('Totals :'+ '', 15, 10);
  //   doc.text('Basic                  :'+"      "+gridtotals['basic'], 15,20);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 44,  18, 2, 2);
  //   }
  //   doc.text('VDA                   :'+"      "+gridtotals['vda'], 15, 30);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 44, 28, 2,2);
  //   }
  //   doc.text('Arrears               :'+"      "+gridtotals['arrears'], 15, 40);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 44, 38,2,2);
  //   }
  //   doc.text('Basic Protection :'+"      "+gridtotals['basicprotection'], 15, 50);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 44, 48,2,2);
  //   }
  //   doc.text('Allowances         :'+"      "+gridtotals['allowances'], 15, 60);

  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 44, 58,2,2);
  //   }
  //  /////////////////////////////////////////////////////////////////
  //  doc.text('Special Allowance     :'+"     "+gridtotals['specialallowance'], 120, 20);
  //  if (currencyformat == "₹") {
  //    doc.addImage(rupeeImage, 'JPEG', 156, 18, 2, 2);
  //  }
  //  doc.text('Increment Protection :'+"     "+gridtotals['incrementprotection'], 120,  30);
  //  if (currencyformat == "₹") {
  //    doc.addImage(rupeeImage, 'JPEG', 156, 28,  2, 2);
  //  }
  //  doc.text('Advance                    :'+"     "+gridtotals['advances'], 120, 40);
  //  if (currencyformat == "₹") {
  //    doc.addImage(rupeeImage, 'JPEG', 156, 38,  2, 2);
  //  }
  //  doc.text('Insurance                  :'+"     "+gridtotals['insurance'], 120, 50);
  //  if (currencyformat == "₹") {
  //    doc.addImage(rupeeImage, 'JPEG', 156, 48,  2, 2);
  //  }
  //  doc.text('Recoveries                :'+"     "+gridtotals['recoveries'], 120, 60);
  //  if (currencyformat == "₹") {
  //    doc.addImage(rupeeImage, 'JPEG', 156, 58,  2, 2);
  //  }
  //  ////////////////////////////////////////////////////////////////////////////////////////
  //  doc.text('Income Tax :'+"     "+gridtotals['incometax'], 220, 20);
  //  if (currencyformat == "₹") {
  //    doc.addImage(rupeeImage, 'JPEG', 242, 18, 2, 2);
  //  }
  //  doc.text('PF               :'+"     "+gridtotals['pf'], 220, 30);
  //  if (currencyformat == "₹") {
  //    doc.addImage(rupeeImage, 'JPEG', 242, 28, 2, 2);
  //  }
  //  doc.text('ESI              :'+"     "+gridtotals['esi'], 220, 40);
  //  if (currencyformat == "₹") {
  //    doc.addImage(rupeeImage, 'JPEG', 242, 38, 2, 2);
  //  }
  //  doc.text('Absent        :'+"     "+gridtotals['absenties'], 220, 50);
  //  if (currencyformat == "₹") {
  //    doc.addImage(rupeeImage, 'JPEG', 242, 48, 2, 2);
  //  }
  //  doc.text('Prof. Tax     :'+"     "+gridtotals['proftax'], 220, 60);
  //  if (currencyformat == "₹") {
  //    doc.addImage(rupeeImage, 'JPEG', 242,58, 2, 2);
  //  }
  //  ///////////////////////////////////////////////////////////////////////////////////////
  //  doc.setDrawColor(0, 0, 0);
  //   pdfInMM = 315;
  //   doc.line(10,  68, (pdfInMM - lMargin - rMargin),  68);
  //   //////////////////////////////////////////////////////////////////////////////////////
  //   doc.text('Total Gross Salary:'+"     "+gridtotals['gross'], 15, 75);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 47, 73, 2,2);
  //   }
  //   doc.text('Total Deductions:'+"      "+gridtotals['deductions'], 120, 75);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 150, 73, 1.9, 1.9);
  //   }
  //   doc.text('Total Net Salary:'+"     "+gridtotals['net'], 220, 75);
  //   if (currencyformat == "₹") {
  //     doc.addImage(rupeeImage, 'JPEG', 248,73, 1.9, 1.9);
  //   }
  //   //////////////////////////////////////////////////////////////////////////////////////
  //   doc.setDrawColor(0, 0, 0);
  //   pdfInMM = 315;
  //   doc.line(10,80, (pdfInMM - lMargin - rMargin), 80);
  //   ///////////////////////////////////////////////////////////////////////////////////////
    
  //   doc.text("A.G.M", 15, 100);
  //   doc.text("R.M", 95, 100);
  //   doc.text("Manager", 165, 100);
  //   doc.text("Account Officer", 225, 100);

  //   //////////////////////////////////////////////////////////////////////////////////////////
    
  

  // }
  //   if (typeof doc.putTotalPages === 'function') {
  //     debugger;
  //     doc.putTotalPages(totalPagesExp);

  //   }
  //   if (printorpdf == "Pdf") {
  //     doc.save('' + reportName + '.pdf');
  //   }
  //   if (printorpdf == "Print") {
  //     this.setiFrameForPrint(doc);
  //   }

  // }


  


// _downloadPayrollProcessApprovalPdf(
//   reportName: string,
//   gridData: any[],
//   gridheaders: any[],
//   colWidthHeight: any,
//   pagetype: 'a4' | 'landscape',
//   betweenorason: string,
//   fromdate: string,
//   todate: string,
//   printorpdf: 'Print' | 'Pdf',
//   gridtotals: any
// ) {
//   try {
//     const address = this._CommonService.getcompanyaddress();
//     const companyDetails = this._CommonService._getCompanyDetails();
//     const currencySymbol = this._CommonService.currencysymbol;
//     const rupeeImage = this._CommonService._getRupeeSymbol();
//     const kapil_logo = this._CommonService.getKapilGroupLogo();

//     // const doc = new jsPDF(pagetype);
//     const doc = new jsPDF({
//   orientation: pagetype === 'landscape' ? 'landscape' : 'portrait',
//   unit: 'mm',
//   format: 'a4',
//   compress: true
// });

//     const totalPagesExp = '{total_pages_count_string}';
//     const today = formatDate(new Date(), 'dd-MMM-yyyy h:mm:ss a', 'en-IN');

//     const lMargin = 15;
//     const rMargin = 15;
//     let pdfWidth = pagetype === 'a4' ? 210 : 297; // approx A4 width in mm
//     let pdfHeight = pagetype === 'a4' ? 297 : 210;

//     // Prepare table body
//     const body = gridData.map((row, i) => {
//       const rowData = Object.keys(row).map((key) => row[key]);
//       // Example of row-span logic if needed
//       if (i % 2 === 0) {
//         rowData.unshift({
//           rowSpan: 2,
//           content: rowData[1],
//           styles: { valign: 'middle', halign: 'center' },
//         });
//         rowData.splice(2, 1);
//       }
//       return rowData;
//     });

//     autoTable(doc, {
//   head: gridheaders,
//   body: body,
//   theme: 'grid',
//   startY: 50,
//  headStyles: {
//   fillColor: this._CommonService.pdfProperties("Header Color") || [200, 200, 200], // fallback gray
//   halign: (this._CommonService.pdfProperties("Header Alignment") as 'left' | 'center' | 'right') || 'center',
//   fontSize: Number(this._CommonService.pdfProperties("Header Fontsize") || 11)
// },
// styles: {
//   cellPadding: 1,
//   fontSize: Number(this._CommonService.pdfProperties("Cell Fontsize")),
//   cellWidth: 'wrap',
//   overflow: 'linebreak',
//   rowPageBreak: 'avoid' as any  // bypass TS error
// } as any,

//   columnStyles: colWidthHeight,
//   showHead: 'everyPage',
//   showFoot: 'lastPage',
//   didDrawPage: (data) => {
//     // HEADER (first page)
//   // Check if this is the first page
// if (doc.internal.pages.length === 1) {
//   doc.addImage(kapil_logo, 'JPEG', 10, 5, 30, 15);
//   doc.setFontSize(15);
//   doc.text(companyDetails.pCompanyName, 60, 10);
//   doc.setFontSize(8);
//   doc.text(address, 40, 17);
//   if (companyDetails.pCinNo) {
//     doc.text('CIN : ' + companyDetails.pCinNo, 85, 22);
//   }
//   doc.setFontSize(14);
//   doc.text(reportName, 100, 32);
//   doc.setFontSize(10);
//   doc.text('Branch : ' + companyDetails.pBranchname, 163, 40);
//   doc.setDrawColor(0, 0, 0);
//   doc.line(lMargin, 43, pdfWidth - rMargin, 43);
// }

// // Footer example
// const pageNum = doc.internal.pages.length;
// const pageText = `Page ${pageNum} of ${totalPagesExp}`;
// doc.line(lMargin, pdfHeight - 10, pdfWidth - rMargin, pdfHeight - 10);
// doc.setFontSize(10);
// doc.text('Printed on : ' + today, lMargin, pdfHeight - 5);
// doc.text(pageText, pdfWidth - rMargin - 20, pdfHeight - 5);


//     // FOOTER
//     // const page = `Page ${doc.internal.getNumberOfPages()} of ${totalPagesExp}`;
//     const page = `Page ${doc.internal.pages.length} of ${totalPagesExp}`;

//     doc.line(lMargin, pdfHeight - 10, pdfWidth - rMargin, pdfHeight - 10);
//     doc.setFontSize(10);
//     doc.text('Printed on : ' + today, lMargin, pdfHeight - 5);
//     doc.text(page, pdfWidth - rMargin - 20, pdfHeight - 5);
//   },
//   didDrawCell: (data) => {
//   const currencyCols = [3, 4, 5, 6, 7, 8, 9, 10, 11]; // adjust column indexes
//   if (currencyCols.includes(data.column.index) && data.cell.section === 'body') {
//     if (currencySymbol === '₹' && rupeeImage) {
//       const cell = data.cell;
//       const x = cell.x + cell.padding('left'); 
//       const y = cell.y + cell.height / 2 - 0.75; 
//       doc.addImage(rupeeImage, 'JPEG', x - 3, y, 1.5, 1.5); 
//     }
//   }
// },


// });


//     // Add totals
//     let finalY = doc.autoTable.previous.finalY + 5;
//     const col1X = 20, col2X = 120, col3X = 220;
//     const rowGap = 5;
//     const totalsKeys = [
//       ['basic', 'vda', 'arrears', 'basicprotection', 'allowances'],
//       ['specialallowance', 'incrementprotection', 'advances', 'insurance', 'recoveries'],
//       ['incometax', 'pf', 'esi', 'absenties', 'proftax'],
//     ];

    

//     // Draw totals in 3 columns
//     totalsKeys.forEach((colKeys, colIndex) => {
//       colKeys.forEach((key, i) => {
//         const y = finalY + (i * rowGap * 2);
//         doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)} : ${gridtotals[key]}`, [col1X, col2X, col3X][colIndex], y);
//         if (currencySymbol === '₹' && rupeeImage) {
//           doc.addImage(rupeeImage, 'JPEG', [col1X + 30, col2X + 36, col3X + 22][colIndex], y - 2, 1.9, 1.9);
//         }
//       });
//     });

//     doc.text(`Total Gross Salary : ${gridtotals.gross}`, col1X, finalY + 45);
//     doc.text(`Total Deductions : ${gridtotals.deductions}`, col2X, finalY + 45);
//     doc.text(`Total Net Salary : ${gridtotals.net}`, col3X, finalY + 45);

//     // Draw line after totals
//     doc.line(lMargin, finalY + 50, pdfWidth - rMargin, finalY + 50);

//     // Add signature placeholders
//     doc.text('A.G.M', 15, pdfHeight - 30);
//     doc.text('R.M', 95, pdfHeight - 30);
//     doc.text('Manager', 165, pdfHeight - 30);
//     doc.text('Account Officer', 225, pdfHeight - 30);

//     // Add total pages
//     if (typeof doc.putTotalPages === 'function') {
//       doc.putTotalPages(totalPagesExp);
//     }

//     // Save or Print
//     if (printorpdf === 'Pdf') {
//       doc.save(`${reportName}.pdf`);
//     } else if (printorpdf === 'Print') {
//       const iframe = document.createElement('iframe');
//       iframe.style.position = 'absolute';
//       iframe.style.width = '0px';
//       iframe.style.height = '0px';
//       document.body.appendChild(iframe);
//       iframe.contentWindow?.document.open();
//       iframe.contentWindow?.document.write(`<iframe src="${doc.output('datauristring')}" style="width:100%;height:100%;"></iframe>`);
//       iframe.contentWindow?.document.close();
//     }
//   } catch (error) {
//     console.error('PDF generation error:', error);
//   }
// }





// _downloadPayrollProcessApprovalPdf(
//   reportName: string,
//   gridData: any[],
//   gridheaders: any[],
//   colWidthHeight: any,
//   pagetype: 'a4' | 'landscape',
//   betweenorason: string,
//   fromdate: string,
//   todate: string,
//   printorpdf: 'Print' | 'Pdf',
//   gridtotals: any
// ) {
//   try {
//     const address = this._CommonService.getcompanyaddress();
//     const companyDetails = this._CommonService._getCompanyDetails();
//     const currencySymbol = this._CommonService.currencysymbol;
//     const rupeeImage = this._CommonService._getRupeeSymbol();
//     const kapil_logo = this._CommonService.getKapilGroupLogo();

//     // Create jsPDF instance
//     const doc = new jsPDF({
//       orientation: pagetype === 'landscape' ? 'landscape' : 'portrait',
//       unit: 'mm',
//       format: 'a4',
//       compress: true
//     });

//     const totalPagesExp = '{total_pages_count_string}';
//     const today = formatDate(new Date(), 'dd-MMM-yyyy h:mm:ss a', 'en-IN');

//     const lMargin = 15;
//     const rMargin = 15;
//     let pdfWidth = pagetype === 'a4' ? 210 : 297; // A4 width in mm
//     let pdfHeight = pagetype === 'a4' ? 297 : 210;

//     // Prepare table body
//     const body = gridData.map((row, i) => {
//       const rowData = Object.keys(row).map((key) => row[key]);
//       // Example of row-span logic if needed
//       if (i % 2 === 0) {
//         rowData.unshift({
//           rowSpan: 2,
//           content: rowData[1],
//           styles: { valign: 'middle', halign: 'center' },
//         });
//         rowData.splice(2, 1);
//       }
//       return rowData;
//     });

//     // Generate table with autoTable
//     autoTable(doc, {
//       head: gridheaders,
//       body: body,
//       theme: 'grid',
//       startY: 50,
//       headStyles: {
//         fillColor: this._CommonService.pdfProperties("Header Color") || [200, 200, 200], // fallback gray
//         halign: (this._CommonService.pdfProperties("Header Alignment") as 'left' | 'center' | 'right') || 'center',
//         fontSize: Number(this._CommonService.pdfProperties("Header Fontsize") || 11)
//       },
//       styles: {
//         cellPadding: 1,
//         fontSize: Number(this._CommonService.pdfProperties("Cell Fontsize")) || 10,
//         cellWidth: 'wrap',
//         overflow: 'linebreak',
//         rowPageBreak: 'avoid' as any // bypass TS error
//       }as any,
//       columnStyles: colWidthHeight,
//       showHead: 'everyPage',
//       showFoot: 'lastPage',
//       didDrawPage: (data) => {
//         // HEADER (first page)
//         if (doc.internal.pages.length === 1) {
//           doc.addImage(kapil_logo, 'JPEG', 10, 5, 30, 15);
//           doc.setFontSize(15);
//           doc.text(companyDetails.pCompanyName, 60, 10);
//           doc.setFontSize(8);
//           doc.text(address, 40, 17);
//           if (companyDetails.pCinNo) {
//             doc.text('CIN : ' + companyDetails.pCinNo, 85, 22);
//           }
//           doc.setFontSize(14);
//           doc.text(reportName, 100, 32);
//           doc.setFontSize(10);
//           doc.text('Branch : ' + companyDetails.pBranchname, 163, 40);
//           doc.setDrawColor(0, 0, 0);
//           doc.line(lMargin, 43, pdfWidth - rMargin, 43);
//         }

//         // FOOTER
//         const page = `Page ${doc.internal.pages.length} of ${totalPagesExp}`;
//         doc.line(lMargin, pdfHeight - 10, pdfWidth - rMargin, pdfHeight - 10);
//         doc.setFontSize(10);
//         doc.text('Printed on : ' + today, lMargin, pdfHeight - 5);
//         doc.text(page, pdfWidth - rMargin - 20, pdfHeight - 5);
//       },
//       didDrawCell: (data) => {
//         // Add rupee image for currency columns (adjust column indexes)
//         const currencyCols = [3, 4, 5, 6, 7, 8, 9, 10, 11]; // columns with currency
//         if (currencyCols.includes(data.column.index) && data.cell.section === 'body') {
//           if (currencySymbol === '₹' && rupeeImage) {
//             const cell = data.cell;
//             const x = cell.x + cell.padding('left');
//             const y = cell.y + cell.height / 2 - 0.75;
//             doc.addImage(rupeeImage, 'JPEG', x, y, 1.5, 1.5); // position rupee image
//           }
//         }
//       }
//     });

//     // Get final Y after table
//     const finalY = doc.lastAutoTable.finalY + 5;

//     const col1X = 20, col2X = 120, col3X = 220;
//     const rowGap = 5;
//     const totalsKeys = [
//       ['basic', 'vda', 'arrears', 'basicprotection', 'allowances'],
//       ['specialallowance', 'incrementprotection', 'advances', 'insurance', 'recoveries'],
//       ['incometax', 'pf', 'esi', 'absenties', 'proftax'],
//     ];

//     // Draw totals in 3 columns
//     totalsKeys.forEach((colKeys, colIndex) => {
//       colKeys.forEach((key, i) => {
//         const y = finalY + (i * rowGap * 2);
//         doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)} : ${gridtotals[key]}`, [col1X, col2X, col3X][colIndex], y);
//         if (currencySymbol === '₹' && rupeeImage) {
//           doc.addImage(rupeeImage, 'JPEG', [col1X + 30, col2X + 36, col3X + 22][colIndex], y - 2, 1.9, 1.9);
//         }
//       });
//     });

//     // Draw total salary info
//     doc.text(`Total Gross Salary : ${gridtotals.gross}`, col1X, finalY + 45);
//     doc.text(`Total Deductions : ${gridtotals.deductions}`, col2X, finalY + 45);
//     doc.text(`Total Net Salary : ${gridtotals.net}`, col3X, finalY + 45);

//     // Draw line after totals
//     doc.line(lMargin, finalY + 50, pdfWidth - rMargin, finalY + 50);

//     // Add signature placeholders
//     doc.text('A.G.M', 15, pdfHeight - 30);
//     doc.text('R.M', 95, pdfHeight - 30);
//     doc.text('Manager', 165, pdfHeight - 30);
//     doc.text('Account Officer', 225, pdfHeight - 30);

//     // Add total pages
//     if (typeof doc.putTotalPages === 'function') {
//       doc.putTotalPages(totalPagesExp);
//     }

//     // Save or Print PDF
//     if (printorpdf === 'Pdf') {
//       doc.save(`${reportName}.pdf`);
//     } else if (printorpdf === 'Print') {
//       const iframe = document.createElement('iframe');
//       iframe.style.position = 'absolute';
//       iframe.style.width = '0px';
//       iframe.style.height = '0px';
//       document.body.appendChild(iframe);
//       iframe.contentWindow?.document.open();
//       iframe.contentWindow?.document.write(`<iframe src="${doc.output('datauristring')}" style="width:100%;height:100%;"></iframe>`);
//       iframe.contentWindow?.document.close();
//     }
//   } catch (error) {
//     console.error('PDF generation error:', error);
//   }
// }



  
  // _downloadjvdetailsPdf(reportName, gridData, gridheaders, colWidthHeight, pagetype, betweenorason, fromdate, todate, printorpdf) {
  //   debugger;
  //   let address = this._CommonService.getcompanyaddress();
  //   let Companyreportdetails = this._CommonService._getCompanyDetails();
  //   let currencyformat = this._CommonService.currencysymbol;
  //   let doc = new jsPDF(pagetype);
  //   // let doc = new jsPDF('lanscape');
  //   let totalPagesExp = '{total_pages_count_string}'
  //   let today = formatDate(new Date(), 'dd-MMM-yyyy  h:mm:ss a', 'en-IN');
  //   // let Easy_chit_Img = this.Easy_chit_Img;
  //   let kapil_logo = this._CommonService.getKapilGroupLogo();
  //   let rupeeImage =  this._CommonService._getRupeeSymbol();
  //   var lMargin = 15; //left margin in mm
  //   var rMargin = 15; //right margin in mm
  //   var pdfInMM;
  //   doc.autoTable({
  //     columns: gridheaders,
  //     body: gridData,
  //     theme: 'grid',//'striped'|'grid'|'plain'|'css' = 'striped'
  //     headStyles: {
  //       fillColor: this._CommonService.pdfProperties("Header Color"),
  //       halign: this._CommonService.pdfProperties("Header Alignment"),
  //       fontSize: this._CommonService.pdfProperties("Header Fontsize")
  //     }, // Red
  //     styles: {
  //       cellPadding: 1, fontSize: this._CommonService.pdfProperties("Cell Fontsize"), cellWidth: 'wrap',
  //       rowPageBreak: 'avoid',
  //       overflow: 'linebreak'
  //     },
  //     // Override the default above for the text column
  //     //columnStyles: colWidthHeight,
  //     columnStyles: {
  //       0: { cellWidth: 'auto', halign: 'left' },
  //       1: { cellWidth: 'auto', halign: 'right' },
  //       2: { cellWidth: 'auto', halign: 'right' },
  //       3: { cellWidth: 'auto', halign: 'right' },
  //     },

  //     startY: 55,
  //     showHead: 'everyPage',//|'everyPage'|'never' = 'firstPage''
  //     showFoot: 'lastPage',
  //     didDrawPage: function (data) {
  //       let pageSize = doc.internal.pageSize;
  //       let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
  //       let pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
  //       // Header
  //       doc.setFontStyle('normal');
  //       if (doc.internal.getNumberOfPages() == 1) {
  //         debugger;
  //         doc.setFontSize(15);
  //         if (pagetype == "a4") {
  //           doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20)
  //           doc.setTextColor('black');
  //           doc.text(Companyreportdetails.pCompanyName, 60, 20);
  //           doc.setFontSize(8);
  //           doc.text(address, 40, 27, 0, 0, 'left');
  //           if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
  //             doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 85, 32);
  //           }
  //           doc.setFontSize(14);


  //           doc.text(reportName, 65, 42);


  //           doc.setFontSize(10);

  //           //  doc.text('Printed On : ' + today + '', 15, 57);
  //           doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 163, 50);
  //           doc.setFontSize(10);
  //           if (betweenorason == "Between") {

  //             doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 50);
  //           }
  //           else if (betweenorason == "As On") {

  //             if (fromdate != "") {
  //               doc.text('As on  : ' + fromdate + '', 15, 50);
  //             }
  //           }
  //           doc.setDrawColor(0, 0, 0);
  //           pdfInMM = 233;
  //           doc.line(10, 52, (pdfInMM - lMargin - rMargin), 52) // horizontal line
  //         }
  //         if (pagetype == "landscape") {
  //           doc.addImage(kapil_logo, 'JPEG', 20, 15, 20, 20)
  //           doc.setTextColor('black');
  //           doc.text(Companyreportdetails.pCompanyName, 110, 20);
  //           doc.setFontSize(10);
  //           doc.text(address, 80, 27, 0, 0, 'left');
  //           if (!isNullOrEmptyString(Companyreportdetails.pCinNo)) {
  //             doc.text('CIN : ' + Companyreportdetails.pCinNo + '', 125, 32);
  //           }
  //           doc.setFontSize(14);
  //           doc.text(reportName, 130, 42);
  //           doc.setFontSize(10);
  //           //  doc.text('Printed On : ' + today + '', 15, 57);
  //           doc.text('Branch : ' + Companyreportdetails.pBranchname + '', 235, 50);
  //           doc.setFontSize(10);
  //           if (betweenorason == "Between") {

  //             doc.text('Between  : ' + fromdate + '  And  ' + todate + ' ', 15, 50);
  //           }
  //           else if (betweenorason == "As On") {

  //             if (fromdate != "") {
  //               doc.text('As on  : ' + fromdate + '', 15, 50);
  //             }
  //           }
  //           doc.setDrawColor(0, 0, 0);
  //           pdfInMM = 315;
  //           doc.line(10, 52, (pdfInMM - lMargin - rMargin), 52) // horizontal line

  //         }

  //       }
  //       else {

  //         data.settings.margin.top = 20;
  //         data.settings.margin.bottom = 15;
  //       }
  //       debugger;
  //       var pageCount = doc.internal.getNumberOfPages();
  //       if (doc.internal.getNumberOfPages() == totalPagesExp) {
  //         debugger;

  //       }
  //       // Footer
  //       let page = "Page " + doc.internal.getNumberOfPages()
  //       // Total page number plugin only available in jspdf v1.0+
  //       if (typeof doc.putTotalPages === 'function') {
  //         debugger;
  //         page = page + ' of ' + totalPagesExp
  //       }
  //       doc.line(5, pageHeight - 10, (pdfInMM - lMargin - rMargin), pageHeight - 10) // horizontal line
  //       doc.setFontSize(10);
  //       doc.text("Printed on : " + today, data.settings.margin.left, pageHeight - 5);
  //       //doc.text(officeCd, pageWidth / 2, pageHeight - 5, 'center');
  //       doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
  //     },
  //     willDrawCell: function (data) {
  //       if (data.row.index === gridData.length - 1) {
  //         doc.setFontStyle("bold");
  //         //  doc.setFontSize("10");
  //         //  doc.setFillColor(239, 154, 154);
  //       }

  //     },
  //     didDrawCell: function (data) {

  //       if ((data.column.index == 1 || data.column.index == 2 || data.column.index == 3) && data.cell.section === 'body') {

  //         var td = data.cell.raw;
  //         // Assuming the td cells have an img element with a data url set (<td><img src="data:image/jpeg;base64,/9j/4AAQ..."></td>)
  //         // var img = this._getRupeeSymbol();
  //         if (td != 0) {
  //           if (currencyformat == "₹") {
  //             var textPos = data.cell.textPos;
  //             doc.setFontStyle('normal');
  //             doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.5, 1.5);
  //           }
  //         }
  //       }

  //     }
  //   });


  //   if (typeof doc.putTotalPages === 'function') {
  //     debugger;
  //     doc.putTotalPages(totalPagesExp);

  //   }
  //   if (printorpdf == "Pdf") {
  //     doc.save('' + reportName + '.pdf');
  //   }
  //   if (printorpdf == "Print") {
  //     this.setiFrameForPrint(doc);
  //   }

  // }

}

export function isNullOrEmptyString(
  value: string | null | undefined
): boolean {
  return value === null || value === undefined || value.trim() === '';
}
