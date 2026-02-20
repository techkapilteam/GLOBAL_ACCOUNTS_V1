import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from '../../common.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


import { formatDate } from '@angular/common';
// ⚠️ Kendo internal paths are not recommended in newer versions
// import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Injectable({
  providedIn: 'root'
})
export class AccountingReportsService {

  Easy_chit_Img = "data:image/png;base64,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";

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });

  constructor(
    private http: HttpClient,
    private _CommonService: CommonService
  ) { }
  currencyformat: any;
  // GetLedgerAccountList(formname: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('formname', formname)
  //     .set('BranchSchema', this._CommonService.getschemaname());

  //   return this._CommonService.getAPI(
  //     '/AccountingTransactions/GetLedgerAccountList',
  //     params,
  //     'YES'
  //   );
  // }
  GetLedgerAccountList(formname: string, BranchSchema: string, CompanyCode: string, BranchCode: string, GlobalSchema: string): Observable<any> {
    const params = new HttpParams()
      .set('formname', formname)
      .set('BranchSchema', BranchSchema)
      .set('CompanyCode', CompanyCode)
      .set('BranchCode', BranchCode)
      .set('GlobalSchema', GlobalSchema);

    return this._CommonService.getAPI(
      '/Accounts/GetLedgerAccountList',
      params,
      'YES'
    );
  }
  //   GetGstLedgerAccountList(formname: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('formname', formname)
  //     .set('BranchSchema', this._CommonService.getschemaname());

  //   return this._CommonService.getAPI(
  //     '/AccountingTransactions/GetGstLedgerAccountList',
  //     params,
  //     'YES'
  //   );
  // }
  GetGstLedgerAccountList(formname: string, BranchSchema: string, CompanyCode: string, BranchCode: string): Observable<any> {
    const params = new HttpParams()
      .set('formname', formname)
      .set('BranchSchema', BranchSchema)
      .set('CompanyCode', CompanyCode)
      .set('BranchCode', BranchCode);

    return this._CommonService.getAPI(
      '/Accounts/GetGstLedgerAccountList',
      params,
      'YES'
    );
  }

  GetLedgerAccountListforInterbranch(formname: string, BranchSchema: string): Observable<any> {
    const params = new HttpParams()
      .set('formname', formname)
      .set('BranchSchema', BranchSchema);

    return this._CommonService.getAPI(
      '/AccountingTransactions/GetLedgerAccountList',
      params,
      'YES'
    );
  }

  GetLedgerReport(fromDate: string, toDate: string, pAccountId: string | number, pSubAccountId: string | number): Observable<any> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('pAccountId', pAccountId.toString())
      .set('pSubAccountId', pSubAccountId.toString())
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI(
      '/Accounting/AccountingReports/GetAccountLedgerDetails',
      params,
      'YES'
    );
  }

  // GetCashBookReportbyDates(startDate: string, endDate: string, transType: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('fromdate', startDate)
  //     .set('todate', endDate)
  //     .set('transType', transType)
  //     .set('BranchSchema', this._CommonService.getschemaname());

  //   return this._CommonService.getAPI(
  //     '/Accounting/AccountingReports/getCashbookData',
  //     params,
  //     'YES'
  //   );
  // }
  GetCashBookReportbyDates(fromdate: string, todate: string, BranchSchema: any, CompanyCode: any, BranchCode: any): Observable<any> {
    debugger;
    const params = new HttpParams()
      .set('fromdate', fromdate)
      .set('todate', todate)

      .set('BranchSchema', BranchSchema)
      .set('CompanyCode', CompanyCode)
      .set('BranchCode', BranchCode);

    return this._CommonService.getAPI(
      '/Accounts/getCashbookData',
      params,
      'YES'
    );
  }

  GetDayBook(fromdate: string, todate: string, Ason: string): Observable<any> {
    const params = new HttpParams()
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('Ason', Ason)
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI(
      '/Accounting/AccountingReports/getDaybook',
      params,
      'YES'
    );
  }
  GetLedgerSummary(fromDate: string, todate: string, AccountId: string | number, AsOnDate: string, groupcode: string): Observable<any> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('todate', todate)
      .set('pAccountId', AccountId.toString())
      .set('AsOnDate', AsOnDate)
      .set('BranchSchema', this._CommonService.getschemaname())
      .set('Groupcode', groupcode);

    return this._CommonService.getAPI('/Accounting/AccountingReports/GetLedgerSummary', params, 'YES');
  }

  getPartyDetails(loanTypeId: string | number): Observable<any> {
    const params = new HttpParams()
      .set('Type', loanTypeId.toString())
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/ContactConfiguration/getPartyDetails', params, 'YES');
  }

  GetPartyLedgerReport(fromDate: string, toDate: string, pAccountId: string | number, pSubAccountId: string | number, pPartyRefId: string | number): Observable<any> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('pAccountId', pAccountId.toString())
      .set('pSubAccountId', pSubAccountId.toString())
      .set('pPartyRefId', pPartyRefId.toString())
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/Accounting/AccountingReports/GetPartyLedgerDetails', params, 'YES');
  }

  // GetLedgerSummaryAccountList(formname: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('formname', formname)
  //     .set('BranchSchema', this._CommonService.getschemaname());

  //   return this._CommonService.getAPI('/Accounting/AccountingReports/GetLedgerSummaryAccountList', params, 'YES');
  // }
  GetLedgerSummaryAccountList(formname: string, BranchSchema: string, CompanyCode: string, BranchCode: string, GlobalSchema: string): Observable<any> {
    const params = new HttpParams()
      .set('formname', formname)
      .set('BranchSchema', BranchSchema)
      .set('CompanyCode', CompanyCode)
      .set('BranchCode', BranchCode)
      .set('GlobalSchema', GlobalSchema);

    return this._CommonService.getAPI('/Accounts/GetLedgerSummaryAccountList', params, 'YES');
  }

  GetGeneralReceiptbyId(ReceiptId: string | number, branchSchema: string): Observable<any> {
    const params = new HttpParams()
      .set('ReceiptId', ReceiptId.toString())
      .set('BranchSchema', branchSchema);

    return this._CommonService.getAPI('/AccountingTransactions/GetgeneralreceiptReportData', params, 'YES');
  }

  GetInterBranchGeneralReceiptbyId(ReceiptId: string | number): Observable<any> {
    const params = new HttpParams()
      .set('ReceiptId', ReceiptId.toString())
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/AccountingTransactions/GetgeneralreceiptInterBranchReportData', params, 'YES');
  }

  GetCaobranchlist(BranchSchema: string): Observable<any> {
    const params = new HttpParams().set('BranchSchema', BranchSchema);

    return this._CommonService.getAPI('/ChitTransactions/GetCAOBranchList', params, 'YES');
  }

  GetForm15hReportwithpan(loginBranchschema: string, pan_number: string): Observable<any> {
    const params = new HttpParams()
      .set('pan_number', pan_number)
      .set('loginBranchschema', loginBranchschema);

    return this._CommonService.getAPI('/ContactMaster/GetForm15HReportUIDDetails', params, 'YES');
  }

  GetChitReceiptslist(BranchSchema: string, CAOSchema: string): Observable<any> {
    const params = new HttpParams()
      .set('BranchSchema', BranchSchema)
      .set('CAOSchema', CAOSchema);

    return this._CommonService.getAPI('/ChitTransactions/GetChitReceiptslist', params, 'YES');
  }

  GetRePrintInterBranchGeneralReceiptbyId(ReceiptId: string | number, branchschema: string): Observable<any> {
    const params = new HttpParams()
      .set('ReceiptId', ReceiptId.toString())
      .set('BranchSchema', branchschema);

    return this._CommonService.getAPI('/AccountingTransactions/GetRePrintInterBranchGeneralReceiptCount', params, 'YES');
  }
  GetPaymentVoucherbyId(paymentId: string | number): Observable<any> {
    const params = new HttpParams()
      .set('paymentId', paymentId.toString())
      .set('LocalSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/AccountingTransactions/GetPaymentVoucherReportData', params, 'YES');
  }

  GetChitPaymentReportData(paymentId: string | number): Observable<any> {
    const params = new HttpParams()
      .set('paymentId', paymentId.toString())
      .set('LocalSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/AccountingTransactions/GetChitPaymentReportData', params, 'YES');
  }

  GetPettyCashbyId(paymentId: string | number): Observable<any> {
    const params = new HttpParams()
      .set('paymentId', paymentId.toString())
      .set('LocalSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/AccountingTransactions/GetPettyCashReportData', params, 'YES');
  }

  GetJvReport(Jvnumber: string | number): Observable<any> {
    const params = new HttpParams()
      .set('Jvnumber', Jvnumber.toString())
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/accountingtransactions/GetJournalVoucherReportData', params, 'YES');
  }

  GetComparisionTB(fromdate: string, todate: string): Observable<any> {
    const params = new HttpParams()
      .set('fromDate', fromdate)
      .set('todate', todate)
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/Accounting/AccountingReports/GetComparisionTB', params, 'YES');
  }

  // GetTrialBalanceData(fromdate: string, todate: string, grouptype: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('fromDate', fromdate)
  //     .set('todate', todate)
  //     .set('GroupType', grouptype)
  //     .set('LocalSchema', this._CommonService.getschemaname());

  //   return this._CommonService.getAPI('/Accounting/AccountingReports/GetTrialBalance', params, 'YES');
  // }
  GetTrialBalanceData(fromdate: string, todate: string, GroupType: string, LocalSchema: any, CompanyCode: any, BranchCode: any, GlobalSchema: any): Observable<any> {
    const params = new HttpParams()
      .set('fromDate', fromdate)
      .set('todate', todate)
      .set('GroupType', GroupType)
      .set('LocalSchema', LocalSchema)
      .set('CompanyCode', CompanyCode)
      .set('BranchCode', BranchCode)
      .set('GlobalSchema', GlobalSchema);

    return this._CommonService.getAPI('/Accounts/GetTrialBalance', params, 'YES');
  }

  // GetBankChequeDetails(BankId: string | number): Observable<any> {
  //   const params = new HttpParams()
  //     .set('_BankId', BankId.toString())
  //     .set('BranchSchema', this._CommonService.getschemaname());

  //   return this._CommonService.getAPI('/Accounting/AccountingReports/GetIssuedChequeNumbers', params, 'YES');
  // }
  GetBankChequeDetails(_BankId: string | number, BranchSchema: any, CompanyCode: any, BranchCode: any): Observable<any> {
    const params = new HttpParams()
      .set('_BankId', _BankId)
      .set('BranchSchema', BranchSchema)
      .set('CompanyCode', CompanyCode)
      .set('BranchCode', BranchCode);

    return this._CommonService.getAPI('/Accounts/GetIssuedChequeNumbers', params, 'YES');
  }

  // GetIssuedBankDetails(BankId: string | number, _ChqBookId: string | number, _ChqFromNo: string | number, _ChqToNo: string | number): Observable<any> {
  //   const params = new HttpParams()
  //     .set('_BankId', BankId.toString())
  //     .set('_ChqBookId', _ChqBookId.toString())
  //     .set('_ChqFromNo', _ChqFromNo.toString())
  //     .set('_ChqToNo', _ChqToNo.toString())
  //     .set('BranchSchema', this._CommonService.getschemaname());

  //   return this._CommonService.getAPI('/Accounting/AccountingReports/GetIssuedChequeDetails', params, 'YES');
  // }
  GetIssuedBankDetails(_BankId: string | number, _ChqBookId: string | number, _ChqFromNo: string | number, _ChqToNo: string | number, BranchSchema: any, GlobalSchema: any, CompanyCode: any, BranchCode: any): Observable<any> {
    const params = new HttpParams()
      .set('_BankId', _BankId.toString())
      .set('_ChqBookId', _ChqBookId.toString())
      .set('_ChqFromNo', _ChqFromNo.toString())
      .set('_ChqToNo', _ChqToNo.toString())
      .set('BranchSchema', BranchSchema)
      .set('GlobalSchema', GlobalSchema)
      .set('CompanyCode', CompanyCode)
      .set('BranchCode', BranchCode);

    return this._CommonService.getAPI('/Accounts/GetIssuedChequeDetails', params, 'YES');
  }

  // GetUnusedChequeDetails(_BankId: string | number, _ChqBookId: string | number, _ChqFromNo: string | number, _ChqToNo: string | number): Observable<any> {
  //   const params = new HttpParams()
  //     .set('_BankId', _BankId.toString())
  //     .set('_ChqBookId', _ChqBookId.toString())
  //     .set('_ChqFromNo', _ChqFromNo.toString())
  //     .set('_ChqToNo', _ChqToNo.toString())
  //     .set('BranchSchema', this._CommonService.getschemaname());

  //   return this._CommonService.getAPI('/Accounting/AccountingReports/GetUnUsedCheques', params, 'YES');
  // }
  GetUnusedChequeDetails(_BankId: string | number, _ChqBookId: string | number, _ChqFromNo: string | number, _ChqToNo: string | number, BranchSchema: any, GlobalSchema: any, CompanyCode: any, BranchCode: any): Observable<any> {
    const params = new HttpParams()
      .set('_BankId', _BankId.toString())
      .set('_ChqBookId', _ChqBookId.toString())
      .set('_ChqFromNo', _ChqFromNo.toString())
      .set('_ChqToNo', _ChqToNo.toString())
      .set('BranchSchema', BranchSchema)
      .set('GlobalSchema', GlobalSchema)
      .set('CompanyCode', CompanyCode)
      .set('BranchCode', BranchCode);

    return this._CommonService.getAPI('/Accounts/GetUnUsedCheques', params, 'YES');
  }

  // GetJvListReport(fromdate: string, todate: string, pmodeoftransaction: string): Observable<any> {
  //   const params = new HttpParams()
  //     .set('fromdate', fromdate)
  //     .set('todate', todate)
  //     .set('pmodeoftransaction', pmodeoftransaction)
  //     .set('BranchSchema', this._CommonService.getschemaname());

  //   return this._CommonService.getAPI('/Accounting/AccountingReports/GetJvListDetails', params, 'YES');
  // }
  GetJvListReport(fromdate: any, todate: any, pmodeoftransaction: string, BranchSchema: any, CompanyCode: any, BranchCode: any, GlobalSchema: any): Observable<any> {
    const params = new HttpParams()
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('pmodeoftransaction', pmodeoftransaction)
      .set('BranchSchema', BranchSchema)
      .set('CompanyCode', CompanyCode)
      .set('BranchCode', BranchCode)
      .set('GlobalSchema', GlobalSchema);

    return this._CommonService.getAPI('/Accounts/GetJvListDetails', params, 'YES');
  }
  GetJvListReportGroup(fromdate: any, todate: any, pmodeoftransaction: string): Observable<any> {
    const params = new HttpParams()
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('pmodeoftransaction', pmodeoftransaction)
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI(
      '/Accounting/AccountingReports/GetJvListDetailsGroup',
      params,
      'YES'
    );
  }
  _CashBookReportsPdf(
    reportName: string,
    gridData: any[],
    gridheaders: any[],
    colWidthHeight: any,
    pagetype: any,
    betweenorason: string,
    fromdate: string,
    todate: string,
    printorpdf: string
  ) {
    const address = this._CommonService.getcompanyaddress();
    const Companyreportdetails = this._CommonService._getCompanyDetails();
    const doc = new jsPDF(pagetype);
    const totalPagesExp = '{total_pages_count_string}';
    const today = this._CommonService.pdfProperties('Date');
    const currencyformat = this._CommonService.currencysymbol;
    const rupeeImage = this._CommonService._getRupeeSymbol();
    const kapil_logo = this._CommonService.getKapilGroupLogo();

    let pdfInMM: number;

    autoTable(doc, {
      columns: gridheaders,
      body: gridData,
      theme: 'grid',
      headStyles: {
        fillColor: this._CommonService.pdfProperties('Header Color'),
        halign: 'center',
        // this._CommonService.pdfProperties('Header Alignment'),
        fontSize: Number(this._CommonService.pdfProperties('Header Fontsize'))
      },
      styles: {
        cellPadding: 1,
        fontSize: Number(this._CommonService.pdfProperties('Cell Fontsize')),
        cellWidth: 'wrap',
        rowPageBreak: 'avoid',
        overflow: 'linebreak'
      } as any,
      columnStyles: colWidthHeight,
      startY: 48,
      showHead: 'everyPage',
      didDrawPage: (data: any) => {
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.getWidth();
        const pageHeight = pageSize.getHeight();

        doc.setFont('helvetica', 'normal');

        if (doc.getNumberOfPages() === 1) {
          doc.setFontSize(15);

          if (pagetype === 'a4') {
            // doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20);
            doc.text(Companyreportdetails?.pCompanyName ?? '', 60, 20);
            doc.setFontSize(10);
            doc.text(address, 40, 27);

            if (Companyreportdetails?.pCinNo ?? '') {
              doc.text('CIN : ' + Companyreportdetails.pCinNo, 85, 32);
            }

            doc.setFontSize(14);
            doc.text(reportName, 90, 42);
            doc.setFontSize(10);
            doc.text('Branch : ' + Companyreportdetails?.pBranchname, 163, 47);

            if (betweenorason === 'Between') {
              doc.text(`Between : ${fromdate} And ${todate}`, 15, 47);
            } else if (betweenorason === 'As On' && fromdate) {
              doc.text(`As on : ${fromdate}`, 15, 47);
            }

            pdfInMM = 233;
            doc.line(10, 50, pdfInMM - 30, 50);
          }
        }

        let page = 'Page ' + doc.getNumberOfPages();
        if (typeof doc.putTotalPages === 'function') {
          page += ' of ' + totalPagesExp;
        }

        doc.line(5, pageHeight - 10, pageWidth - 5, pageHeight - 10);
        doc.setFontSize(10);
        //doc.text('Printed on : ' + today, 15, pageHeight - 5);
        doc.text(page, pageWidth - 30, pageHeight - 5);
      },
      didDrawCell: (data: any) => {
        if (
          [3, 4, 5].includes(data.column.index) &&
          data.cell.section === 'body' &&
          data.cell.raw !== 0 &&
          currencyformat === '₹'
        ) {
          const textPos = data.cell.textPos;
          //  doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.7, 1.7);
        }
      }
    });

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    if (printorpdf === 'Pdf') doc.save(`${reportName}.pdf`);
    if (printorpdf === 'Print') this.setiFrameForPrint(doc);
  }
  // _BankBookReportsPdf(
  //   reportName: string,
  //   gridData: any[],
  //   gridheaders: any[],
  //   colWidthHeight: any,
  //   pagetype: any,
  //   betweenorason: string,
  //   fromdate: string,
  //   todate: string,
  //   printorpdf: string,
  //   bankname: string
  // ) {
  //   const address = this._CommonService.getcompanyaddress();
  //   const Companyreportdetails = this._CommonService._getCompanyDetails();
  //   const doc = new jsPDF(pagetype);
  //   const totalPagesExp = '{total_pages_count_string}';
  //   const today = this._CommonService.pdfProperties('Date');
  //   const kapil_logo = this._CommonService.getKapilGroupLogo();

  // //   doc.autoTable({
  // //     columns: gridheaders,
  // //     body: gridData,
  // //     theme: 'grid',
  // //     startY: 48,
  // //     didDrawPage: () => {
  // //       doc.setFont(undefined, 'normal');
  // //       doc.setFontSize(14);
  // //       doc.text(`${reportName} - ${bankname}`, 100, 30);
  // //     }
  // //   });

  //   if (printorpdf === 'Pdf') doc.save(`${reportName}.pdf`);
  //   if (printorpdf === 'Print') this.setiFrameForPrint(doc);
  // }
  _BankBookReportsPdf(
    reportName: string,
    gridData: any[],
    gridheaders: any[],
    colWidthHeight: any,
    pagetype: any,
    betweenorason?: string,
    fromdate?: string,
    todate?: string,
    printorpdf?: string,
    bankname?: string
  ) {

    //   const doc = new jsPDF({
    //   orientation: 'landscape',
    //   unit: 'mm',
    //   format: 'a4'
    // });

    //   const today = this._CommonService.pdfProperties('Date');

    //   doc.setFontSize(14);
    //   doc.setFont('helvetica', 'bold');
    //   doc.text(`${reportName}`, 105, 15, { align: 'center' });

    //   doc.setFontSize(11);
    //   doc.setFont('helvetica', 'normal');
    //   doc.text(`${bankname}`, 105, 22, { align: 'center' });

    //   doc.setFontSize(9);
    //   doc.text(`Generated On: ${today}`, 14, 30);

    //   if (betweenorason && fromdate && todate) {
    //     doc.text(`${betweenorason}: ${fromdate} - ${todate}`, 14, 36);
    //   }

    // const pageWidth = doc.internal.pageSize.getWidth();
    // const margin = 8;
    // const usableWidth = pageWidth - margin * 2;

    // autoTable(doc, {
    //   head: [gridheaders.map(h => h.header ?? h)],
    //   body: gridData.map(row =>
    //     gridheaders.map(h => {
    //       const value = row[h.field ?? h] ?? '';
    //       return String(value);  
    //     })
    //   ),

    //   startY: 42,
    //   theme: 'grid',

    //   margin: { left: margin, right: margin },

    //   tableWidth: usableWidth,  

    //   styles: {
    //     fontSize: 5,
    //     cellPadding: 1,
    //     overflow: 'hidden',    
    //     cellWidth: usableWidth / gridheaders.length
    //   },

    //   headStyles: {
    //     fillColor: [11, 64, 147],
    //     textColor: 255,
    //     fontSize: 6
    //   }
    // });

    //   const pageCount = doc.getNumberOfPages();
    //   for (let i = 1; i <= pageCount; i++) {
    //     doc.setPage(i);
    //     doc.setFontSize(8);
    //     doc.text(
    //       `Page ${i} of ${pageCount}`,
    //       105,
    //       doc.internal.pageSize.height - 10,
    //       { align: 'center' }
    //     );
    //   }
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - margin * 2;
    let currentY = 12;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(
      'KAPIL CHITS (HYDERABAD) PVT. LTD.',
      pageWidth / 2,
      currentY,
      { align: 'center' }
    );
    currentY += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(
      'Above TVS Showroom, 1st Floor, Opp: R&B Guest House, Old N.K-07, Kamarreddy',
      pageWidth / 2,
      currentY,
      { align: 'center' }
    );
    currentY += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(
      'CIN: U65992TG2008PTC060803',
      pageWidth / 2,
      currentY,
      { align: 'center' }
    );
    currentY += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(reportName, pageWidth / 2, currentY, { align: 'center' });
    currentY += 6;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    if (bankname) {
      doc.text(bankname, pageWidth / 2, currentY, { align: 'center' });
      currentY += 6;
    }

    doc.setFontSize(10);
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, margin, currentY);

    currentY += 6;

    const headRow = gridheaders.map(h => h.header ?? h);

    const bodyRows = gridData.map(row =>
      gridheaders.map(h => {
        const value = row[h.field ?? h] ?? '';
        return String(value);
      })
    );

    autoTable(doc, {
      head: [headRow],
      body: bodyRows,

      startY: currentY + 4,
      theme: 'grid',

      margin: { left: margin, right: margin },

      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: 'linebreak',
        halign: 'left',
        valign: 'middle'
      },

      headStyles: {
        fillColor: [11, 64, 147],
        textColor: 255,
        fontSize: 12,
        halign: 'center'
      }
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );
    }

    if (printorpdf === 'Pdf') {
      doc.save(`${reportName}.pdf`);
    }

    if (printorpdf === 'Print') {
      this.setiFrameForPrint(doc);
    }

  }
  _AccountLedgerReportsPdf(
    reportName: string,
    subreportname: string,
    gridData: any[],
    gridheaders: any[],
    colWidthHeight: any,
    pagetype: any,
    betweenorason: string,
    fromdate: string,
    todate: string,
    printorpdf: string
  ) {
    const address = this._CommonService.getcompanyaddress();
    const Companyreportdetails = this._CommonService._getCompanyDetails();
    const doc = new jsPDF(pagetype);
    const today = this._CommonService.pdfProperties('Date');
    const kapil_logo = this._CommonService.getKapilGroupLogo();

    autoTable(doc, {
      columns: gridheaders,
      body: gridData,
      startY: 64,
      theme: 'grid',
      headStyles: { fontSize: 6 },
      margin: { left: 3, right: 3 },
      didDrawPage: () => {
        doc.setFont('helvetica', 'normal');
        doc.addImage(kapil_logo, 'JPEG', 10, 15, 30, 20);
        doc.setFontSize(15);
        doc.text(Companyreportdetails?.pCompanyName ?? '', 60, 15);
        doc.setFontSize(9);
        doc.text(address, 32, 20);
        doc.setFontSize(14);
        doc.text(reportName, 90, 38);
        doc.text(subreportname, 30, 45);
        doc.setFontSize(10);
        doc.text('Printed on : ' + today, 15, doc.internal.pageSize.getHeight() - 5);
      }
    });

    if (printorpdf === 'Pdf') doc.save(`${reportName}.pdf`);
    if (printorpdf === 'Print') this.setiFrameForPrint(doc);
  }
  _AccountLedgerReportsPdfforpettycash(
    reportName: string,
    subreportname: string,
    gridData: any[],
    gridheaders: any[],
    colWidthHeight: any,
    pagetype: any,
    betweenorason: string,
    fromdate: string,
    todate: string,
    printorpdf: string,
    isNarrationChecked: boolean
  ) {
    const address = this._CommonService.getcompanyaddress();
    const Companyreportdetails = this._CommonService._getCompanyDetails();
    const doc = new jsPDF(pagetype);
    const totalPagesExp = '{total_pages_count_string}';
    const today = this._CommonService.pdfProperties('Date');
    const kapil_logo = this._CommonService.getKapilGroupLogo();

    //   doc.autoTable({
    //     columns: gridheaders,
    //     body: gridData,
    //     theme: 'grid',
    //     headStyles: {
    //       fillColor: this._CommonService.pdfProperties('Header Color'),
    //       halign: this._CommonService.pdfProperties('Header Alignment'),
    //       fontSize: this._CommonService.pdfProperties('Header Fontsize')
    //     },
    //     styles: {
    //       cellPadding: 1,
    //       fontSize: this._CommonService.pdfProperties('Cell Fontsize'),
    //       cellWidth: 'wrap',
    //       overflow: 'linebreak'
    //     },
    //     columnStyles: {
    //       0: { halign: 'center' },
    //       1: { cellWidth: isNarrationChecked ? 60 : 'auto', halign: 'left' },
    //       2: { halign: 'right' },
    //       3: { halign: 'right' },
    //       4: { halign: 'right' }
    //     },
    //     startY: 64,
    //     didDrawPage: (data:any) => {
    //       const pageHeight = doc.internal.pageSize.getHeight();
    //       const pageWidth = doc.internal.pageSize.getWidth();

    //       doc.setFont(undefined, 'normal');

    //       if (doc.internal.getNumberOfPages() === 1) {
    //         doc.addImage(kapil_logo, 'JPEG', 10, 15);
    //         doc.setFontSize(15);
    //         doc.text(Companyreportdetails.pCompanyName, 60, 15);
    //         doc.setFontSize(9);
    //         doc.text(address, 32, 20);
    //         doc.setFontSize(14);
    //         doc.text(reportName, 90, 38);

    //         const lines = doc.splitTextToSize(subreportname, 180);
    //         doc.text(lines, 30, 45);

    //         doc.setFontSize(10);
    //         doc.text('Branch : ' + Companyreportdetails.pBranchname, 163, 57);

    //         if (betweenorason === 'Between') {
    //           doc.text(`Between : ${fromdate} And ${todate}`, 15, 57);
    //         } else if (fromdate) {
    //           doc.text(`As on : ${fromdate}`, 15, 52);
    //         }

    //         doc.line(10, 59, pageWidth - 10, 59);
    //       }

    //       let page = 'Page ' + doc.internal.getNumberOfPages();
    //       if (typeof doc.putTotalPages === 'function') {
    //         page += ' of ' + totalPagesExp;
    //       }

    //       doc.line(5, pageHeight - 10, pageWidth - 5, pageHeight - 10);
    //       doc.text('Printed on : ' + today, 15, pageHeight - 5);
    //       doc.text(page, pageWidth - 30, pageHeight - 5);
    //     }
    //   });

    if (typeof doc.putTotalPages === 'function') doc.putTotalPages(totalPagesExp);
    if (printorpdf === 'Pdf') doc.save(`${reportName}.pdf`);
    if (printorpdf === 'Print') this.setiFrameForPrint(doc);
  }


  _IssuedChequesReportsPdf(
    reportName: string,
    gridData: any[],
    gridheaders: any[],
    colWidthHeight: any,
    pagetype: any,
    betweenorason: string,
    fromdate: string,
    todate: string,
    printorpdf: string
  ) {
    const Companyreportdetails = this._CommonService._getCompanyDetails();
    const doc = new jsPDF({
      orientation: pagetype === 'landscape' ? 'landscape' : 'portrait',
      format: 'a4'
    });

    const today = this._CommonService.pdfProperties('Date');
    const kapil_logo = this._CommonService.getKapilGroupLogo();
    const currencyformat = this._CommonService.currencysymbol;
    const totalPagesExp = '{total_pages_count_string}';

    autoTable(doc, {
      head: [gridheaders],
      body: gridData,
      startY: 52,
      theme: 'grid',
      columnStyles: colWidthHeight,
      didDrawPage: () => {
        doc.setFont('helvetica', 'normal');
        if (kapil_logo) {
          doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20);
        }

        doc.setFontSize(15);
        doc.text(Companyreportdetails?.pCompanyName ?? '', 60, 20);

        doc.setFontSize(14);
        doc.text(reportName ?? '', 85, 42);
      },
      didDrawCell: (data: any) => {
        if (
          data.column.index === 5 &&
          data.cell.section === 'body' &&
          data.cell.raw !== 0 &&
          currencyformat === '₹'
        ) {
          const textPos = data.cell.textPos;
          const rupeeImg = this._CommonService._getRupeeSymbol();
          doc.addImage(rupeeImg, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.7, 1.7);
        }
      }
    });

    if (typeof doc.putTotalPages === 'function') doc.putTotalPages(totalPagesExp);
    if (printorpdf === 'Pdf') doc.save(`${reportName ?? 'report'}.pdf`);
    if (printorpdf === 'Print') this.setiFrameForPrint(doc);
  }

  _ChequeReturnCancelReportsPdf(
    reportName: string,
    gridData: any[],
    gridheaders: any[],
    colWidthHeight: any,
    pagetype: any,
    betweenorason: string,
    fromdate: string,
    todate: string,
    printorpdf: string
  ) {
    const address = this._CommonService.getcompanyaddress();
    const Companyreportdetails = this._CommonService._getCompanyDetails();
    const doc = new jsPDF(pagetype);
    const today = this._CommonService.pdfProperties('Date');
    const kapil_logo = this._CommonService.getKapilGroupLogo();
    const currencyformat = this._CommonService.currencysymbol;
    const totalPagesExp = '{total_pages_count_string}';

    autoTable(doc, {
      head: [gridheaders],
      body: gridData,
      startY: 53,
      theme: 'grid',
      didDrawPage: () => {
        doc.setFont('helvetica', 'normal');
        doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20);
        doc.setFontSize(15);
        doc.text(Companyreportdetails?.pCompanyName ?? '', 60, 20);
        doc.setFontSize(14);
        doc.text(reportName, 85, 42);
      },
      didDrawCell: (data: any) => {
        if (data.column.index === 2 && currencyformat === '₹') {
          const textPos = data.cell.textPos;
          const rupeeImg = this._CommonService._getRupeeSymbol();
          doc.addImage(rupeeImg, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.7, 1.7);
        }
      }
    });

    if (typeof doc.putTotalPages === 'function') doc.putTotalPages(totalPagesExp);
    if (printorpdf === 'Pdf') doc.save(`${reportName}.pdf`);
    if (printorpdf === 'Print') this.setiFrameForPrint(doc);
  }
  // _ChequeManagementPdf(
  //   reportName: string,
  //   gridData: any[],
  //   gridheaders: any[],
  //   colWidthHeight: any,
  //   pagetype: any,
  //   printorpdf: string
  // ) {
  //   const address = this._CommonService.getcompanyaddress();
  //   const Companyreportdetails = this._CommonService._getCompanyDetails();
  //   const doc = new jsPDF(pagetype);
  //   const today = this._CommonService.pdfProperties('Date');
  //   const kapil_logo = this._CommonService.getKapilGroupLogo();
  //   const totalPagesExp = '{total_pages_count_string}';

  // //   doc.autoTable({
  // //     columns: gridheaders,
  // //     body: gridData,
  // //     theme: 'grid',
  // //     columnStyles: colWidthHeight,
  // //     startY: 53,
  // //     didDrawPage: (data:any) => {
  // //       const pageHeight = doc.internal.pageSize.getHeight();
  // //       const pageWidth = doc.internal.pageSize.getWidth();

  // //       doc.setFont(undefined, 'normal');

  // //       if (doc.internal.getNumberOfPages() === 1) {
  // //         doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20);
  // //         doc.setFontSize(15);
  // //         doc.text(Companyreportdetails.pCompanyName, 60, 20);
  // //         doc.setFontSize(10);
  // //         doc.text(address, 40, 27);
  // //         doc.setFontSize(14);
  // //         doc.text(reportName, 85, 42);
  // //         doc.line(10, 51, pageWidth - 10, 51);
  // //       }

  // //       let page = 'Page ' + doc.internal.getNumberOfPages();
  // //       if (typeof doc.putTotalPages === 'function') page += ' of ' + totalPagesExp;

  // //       doc.line(5, pageHeight - 10, pageWidth - 5, pageHeight - 10);
  // //       doc.setFontSize(10);
  // //       doc.text('Printed on : ' + today, 15, pageHeight - 5);
  // //       doc.text(page, pageWidth - 30, pageHeight - 5);
  // //     }
  // //   });

  //   if (typeof doc.putTotalPages === 'function') doc.putTotalPages(totalPagesExp);
  //   if (printorpdf === 'Pdf') doc.save(`${reportName}.pdf`);
  //   if (printorpdf === 'Print') this.setiFrameForPrint(doc);
  // }



  _ChequeManagementPdf(
    reportName: string,
    gridData: any[],
    gridheaders: any[],
    colWidthHeight: any,
    pagetype: any,
    printorpdf: string
  ) {
    const address = this._CommonService.getcompanyaddress();
    const Companyreportdetails = this._CommonService._getCompanyDetails();
    const doc = new jsPDF(pagetype);
    const today = this._CommonService.pdfProperties('Date');
    const kapil_logo = this._CommonService.getKapilGroupLogo();
    const totalPagesExp = '{total_pages_count_string}';

    autoTable(doc, {
      head: [gridheaders],   // ✅ IMPORTANT
      body: gridData,        // ✅ IMPORTANT
      theme: 'grid',
      columnStyles: colWidthHeight,
      startY: 53,
      didDrawPage: (data: any) => {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();

        // doc.setFont(undefined, 'normal');
        // doc.setFont('helvetica', 'normal');

        doc.setFont(undefined as any, 'normal');

        if (doc.getNumberOfPages() === 1) {

          doc.addImage(kapil_logo, 'JPEG', 10, 15, 20, 20);
          doc.setFontSize(15);
          // doc.text(Companyreportdetails.pCompanyName, 60, 20);
          doc.text(Companyreportdetails?.pCompanyName || '', 60, 20);

          doc.setFontSize(10);
          doc.text(address, 40, 27);
          doc.setFontSize(14);
          doc.text(reportName, 85, 42);
          doc.line(10, 51, pageWidth - 10, 51);
        }

        let page = 'Page ' + doc.getNumberOfPages();

        if (typeof doc.putTotalPages === 'function') {
          page += ' of ' + totalPagesExp;
        }

        doc.line(5, pageHeight - 10, pageWidth - 5, pageHeight - 10);
        doc.setFontSize(10);
        doc.text('Printed on : ' + today, 15, pageHeight - 5);
        doc.text(page, pageWidth - 30, pageHeight - 5);
      }
    });

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }

    if (printorpdf === 'Pdf') doc.save(`${reportName}.pdf`);
    if (printorpdf === 'Print') this.setiFrameForPrint(doc);
  }

  _ComparisionTBReportsPdf(
    reportName: string,
    gridData: any[],
    gridheaders: any[],
    colWidthHeight: any,
    pagetype: any,
    betweenorason: string,
    fromdate: string,
    todate: string,
    printorpdf: string
  ) {
    const Companyreportdetails = this._CommonService._getCompanyDetails();
    const doc = new jsPDF({
      orientation: pagetype === 'landscape' ? 'landscape' : 'portrait',
      format: 'a4'
    });

    const today = this._CommonService.pdfProperties('Date');
    const kapil_logo = this._CommonService.getKapilGroupLogo();
    const currencyformat = this._CommonService.currencysymbol;
    const totalPagesExp = '{total_pages_count_string}';

    (doc as any).autoTable({
      head: [gridheaders],
      body: gridData,
      startY: 55,
      theme: 'grid',
      columnStyles: colWidthHeight,
      didDrawPage: () => {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFont('helvetica', 'normal');
        if (kapil_logo) doc.addImage(kapil_logo, 'JPEG', 10, 5, 30, 15);

        doc.setFontSize(15);
        doc.text(String(Companyreportdetails?.pCompanyName ?? ''), 60, 10);

        doc.setFontSize(14);
        doc.text(String(reportName ?? ''), 90, 30);

        if (betweenorason === 'Between') {
          doc.text(String(`Between : ${fromdate ?? ''} And ${todate ?? ''}`), 15, 40);
        }

        const pageNo = (doc as any).internal.getNumberOfPages?.() ?? 1;
        let page = 'Page ' + String(pageNo);

        if (typeof (doc as any).putTotalPages === 'function') {
          page += ' of ' + totalPagesExp;
        }

        doc.line(5, pageHeight - 10, pageWidth - 5, pageHeight - 10);
        doc.setFontSize(10);
        doc.text(String('Printed on : ' + today), 15, pageHeight - 5);
        doc.text(String(page), pageWidth - 30, pageHeight - 5);
      },
      didDrawCell: (data: any) => {
        if (data.cell.section === 'body' && data.column.index > 0 && data.cell.raw !== 0 && currencyformat === '₹') {
          const rupeeImg = this._CommonService._getRupeeSymbol();
          const textPos = data.cell.textPos;
          doc.addImage(rupeeImg, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.7, 1.7);
        }
      }
    });

    if (typeof (doc as any).putTotalPages === 'function') {
      (doc as any).putTotalPages(totalPagesExp);
    }

    if (printorpdf === 'Pdf') {
      doc.save(`${reportName ?? 'report'}.pdf`);
    }

    if (printorpdf === 'Print') {
      this.setiFrameForPrint(doc);
    }
  }


  setiFrameForPrint(doc: any) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = doc.output('bloburl');
    document.body.appendChild(iframe);
    iframe.contentWindow?.print();
  }
  GetSubscriberJvListReport(fromdate: string, todate: string, pmodeoftransaction: string, tablename: string): Observable<any> {
    const params = new HttpParams()
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('pmodeoftransaction', pmodeoftransaction)
      .set('tablename', tablename)
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/Accounting/AccountingReports/GetSubscriberJvListDetails', params, 'YES');
  }
  GetSubscriberJvListReportGroup(fromdate: string, todate: string, pmodeoftransaction: string, tablename: string): Observable<any> {
    const params = new HttpParams()
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('pmodeoftransaction', pmodeoftransaction)
      .set('tablename', tablename)
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/Accounting/AccountingReports/GetSubscriberJvListDetailsGroup', params, 'YES');
  }
  GetFormNameDetails(): Observable<any> {
    const params = new HttpParams()
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/Accounting/AccountingReports/GetFormNameDetails', params, 'YES');
  }
  GetTransTypeDetails(formname: string): Observable<any> {
    const params = new HttpParams()
      .set('formname', formname)
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/Accounting/AccountingReports/GetTrnastype', params, 'YES');
  }
  GetChitReceiptCancelbyId(paymentId: string | number): Observable<any> {
    const params = new HttpParams()
      .set('paymentId', paymentId.toString())
      .set('LocalSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/AccountingTransactions/GetChitReceiptCancelReportData', params, 'YES');
  }
  GetSubscriberRemovalReport(transactionNo: string | number): Observable<any> {
    const params = new HttpParams()
      .set('TransactionNo', transactionNo.toString())
      .set('localSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/ChitTransactions/ChitReports/getSubscriberRemovalReport', params, 'YES');
  }
  GetBrsStatementsReport(brstype: string, fromdate: string, todate: string, bankname: string): Observable<any> {
    const params = new HttpParams()
      .set('brstype', brstype)
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('bankname', bankname)
      .set('BranchSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/Accounting/AccountingReports/GetBrsStatementsReport', params, 'YES');
  }
  getChitAdvanceReport(fromdate: string, todate: string, branchschema: string, caoschema: string): Observable<any> {
    const params = new HttpParams()
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('branchschema', branchschema)
      .set('caoschema', caoschema)
      .set('globalSchema', this._CommonService.globalschema);

    return this._CommonService.getAPI('/ChitTransactions/ChitReports/getChitAdvanceReport', params, 'YES');
  }
  GetChitAdvanceReceipts(fromdate: string, todate: string, localschema: string): Observable<any> {
    const params = new HttpParams()
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('schemaName', localschema);

    return this._CommonService.getAPI('/ChitTransactions/GetChitAdvanceReceipts', params, 'YES');
  }
  _CompletedGroupDetailsPdf(
    reportName: string,
    gridData: any[],
    gridheaders: any[],
    colWidthHeight: any,
    pagetype: any,
    betweenorason: string,
    fromdate: string,
    todate: string,
    printorpdf: string,
    doc: any
  ) {
    const address = this._CommonService.getcompanyaddress();
    const company = this._CommonService._getCompanyDetails();
    const today = this._CommonService.pdfProperties('Date');
    const logo = this._CommonService.getKapilGroupLogo();
    const currencyformat = this._CommonService.currencysymbol;
    const totalPagesExp = '{total_pages_count_string}';
    const startpage = doc.internal.getNumberOfPages();

    doc.autoTable({
      columns: gridheaders,
      body: gridData,
      startY: 48,
      theme: 'grid',
      didDrawPage: (data: any) => {
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFont(undefined, 'normal');

        if (doc.internal.getNumberOfPages() === startpage) {
          doc.addImage(logo, 'JPEG', 10, 15, 20, 20);
          doc.setFontSize(15);
          doc.text(company?.pCompanyName ?? '', 60, 20);
          doc.setFontSize(10);
          doc.text(address, 40, 27);
          doc.setFontSize(14);
          doc.text(reportName, 90, 42);
          doc.line(10, 53, pageWidth - 10, 53);
        }

        let page = 'Page ' + doc.internal.getNumberOfPages();
        if (typeof doc.putTotalPages === 'function') page += ' of ' + totalPagesExp;
      },
      didDrawCell: (data: any) => {
        if ((data.column.index === 1 || data.column.index === 4) &&
          data.cell.section === 'body' &&
          data.cell.raw !== 0 &&
          currencyformat === '₹') {

          const img = this._CommonService._getRupeeSymbol();
          const textPos = data.cell.textPos;
          doc.addImage(img, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.7, 1.7);
        }
      }
    });

    if (typeof doc.putTotalPages === 'function') doc.putTotalPages(totalPagesExp);
  }
  getChitAdvanceIntrestReport(
    fromdate: string,
    todate: string,
    caoschema: string,
    branchschema: string,
    schemename: string,
    chequeintype: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('caoschema', caoschema)
      .set('branchschema', branchschema)
      .set('globalSchema', this._CommonService.globalschema)
      .set('schemename', schemename)
      .set('chequeintype', chequeintype);

    return this._CommonService.getAPI('/ChitTransactions/ChitReports/getChitAdvanceInterestReport', params, 'YES');
  }
  GetBPOInwardOutwardStatus(
    fromdate: string,
    todate: string,
    groupcode: string,
    ticketno: string,
    branchschema: string,
    loginschema: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('branchschema', branchschema)
      .set('globalSchema', this._CommonService.globalschema)
      .set('loginschema', loginschema)
      .set('groupcode', groupcode)
      .set('ticketno', ticketno);

    return this._CommonService.getAPI('/Verification/GetBPOInwardOutwardStatus', params, 'YES');
  }
  getbporeferenceid(branchschema: string): Observable<any> {
    const params = new HttpParams().set('branchschema', branchschema);
    return this._CommonService.getAPI('/ChitTransactions/ChitReports/getbporeferenceid', params, 'YES');
  }
  Outwardchequesinfo(
    fromdate: string,
    todate: string,
    groupcode: string,
    ticketno: string,
    formname: string,
    branchschema: string,
    localschema: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('branchschema', branchschema)
      .set('localschema', localschema)
      .set('groupcode', groupcode)
      .set('ticketno', ticketno)
      .set('formname', formname);

    return this._CommonService.getAPI('/Verification/GetOutwardCheques', params, 'YES');
  }
  getRemovedchitagreementDetilas(TransactionNo: string | number): Observable<any> {
    const params = new HttpParams()
      .set('localSchema', this._CommonService.getschemaname())
      .set('TransactionNo', TransactionNo.toString());

    return this._CommonService.getAPI('/ChitTransactions/ChitReports/getRemovedchitagreementDetilas', params, 'YES');
  }
  UpdateScheduleid(userId: string | number, asondate: string): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('asondate', asondate)
      .set('branchschema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/ChitTransactions/ChitReports/UpdateScheduleid', params, 'YES');
  }
  GetReceiptsandPayments(
    fromdate: string,
    todate: string,
    groupcode: string,
    branchschema: string,
    userid: string | number
  ): Observable<any> {
    const params = new HttpParams()
      .set('userId', userid.toString())
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('branchschema', branchschema)
      .set('groupcode', groupcode);

    return this._CommonService.getAPI('/ChitTransactions/ChitReports/GetReceiptsandPayments', params, 'YES');
  }
  GetReceiptsandPaymentsExtractCode(
    fromdate: string,
    todate: string,
    groupcode: string,
    branchschema: string,
    userid: string | number,
    extractcode: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('userId', userid.toString())
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('branchschema', branchschema)
      .set('groupcode', groupcode)
      .set('extractcode', extractcode);

    return this._CommonService.getAPI('/ChitTransactions/ChitReports/GetReceiptsandPaymentsExtractCodes', params, 'YES');
  }
  getLegalCellTransfer(
    fromdate: string,
    todate: string,
    BranchSchema: string,
    localschema: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('fromdate', fromdate)
      .set('todate', todate)
      .set('BranchSchema', BranchSchema)
      .set('localschema', localschema);

    return this._CommonService.getAPI('/Verification/GetLegalcellTransferMemoReport', params, 'YES');
  }
  GetBalances(fromdate: string, todate: string, grouptype: string, formname: string): Observable<any> {
    const params = new HttpParams()
      .set('formname', formname)
      .set('fromDate', fromdate)
      .set('todate', todate)
      .set('GroupType', grouptype)
      .set('LocalSchema', this._CommonService.getschemaname());

    return this._CommonService.getAPI('/Accounting/AccountingReports/GetBalances', params, 'YES');
  }
  GetBPOInwardOutwardSummary(branchschema: string, fromdate: string, todate: string): Observable<any> {
    const params = new HttpParams()
      .set('branchschema', branchschema)
      .set('fromdate', fromdate)
      .set('todate', todate);

    return this._CommonService.getAPI('/Verification/GetBPOInwardOutwardSummary', params, 'YES');
  }
  getCrystalReportsAPIdetails(branchschema: string, fromdate: string, todate: string): Observable<any> {
    const params = new HttpParams()
      .set('branchschema', branchschema)
      .set('fromdate', fromdate)
      .set('todate', todate);

    return this._CommonService.getAPI('/Verification/GetBPOInwardOutwardSummary', params, 'YES');
  }
  GetVerificationChargesReceiptslist(BranchSchema: string, CAOSchema: string): Observable<any> {
    const params = new HttpParams()
      .set('BranchSchema', BranchSchema)
      .set('CAOSchema', CAOSchema);

    return this._CommonService.getAPI('/ChitTransactions/GetVerificationChargesReceiptslist', params, 'YES');
  }

}
