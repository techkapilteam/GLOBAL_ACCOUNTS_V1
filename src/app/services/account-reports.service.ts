import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Injectable({
  providedIn: 'root',
})
export class AccountReportsService {
  private _CommonService=inject(CommonService)
  
  GetChequesIssuedData(BrsFromDate:any,BrsTodate:any,bankid: any, startindex: any, endindex: any, modeofreceipt: any, _searchText: any, GlobalSchema: any,branchcode:any,companycode:any): Observable<any> {
    const params = new HttpParams().set('BrsFromDate', BrsFromDate).set('BrsTodate', BrsTodate).set('_BankId', bankid).set('BranchSchema', this._CommonService.getbranchname()).set('startindex', startindex).set('endindex', endindex).set('modeofreceipt', modeofreceipt).set('searchtext', _searchText).set('GlobalSchema', GlobalSchema).set('branchcode', branchcode).set('companycode', companycode);
    return this._CommonService.getAPI('/Accounts/GetChequesIssued', params, 'YES')
  }
  GetBankBalance(bankid: any) {
    const params = new HttpParams().set('brstodate', '09-03-2026').set('_recordid', bankid).set('BranchSchema', this._CommonService.getbranchname()).set('branchCode', this._CommonService.getBranchCode()).set('companyCode', this._CommonService.getCompanyCode());
    return this._CommonService.getAPI('/Accounts/GetBankBalance', params, 'YES');
  }
  Getgstvocuherprint(Branchschema: any, Gstvoucherno: any): Observable<any> {
    const params = new HttpParams().set('branchSchema', Branchschema).set('Gstvoucherno', Gstvoucherno).set('globalSchema', this._CommonService.getschemaname()).set('companyCode', this._CommonService.getCompanyCode()).set('branchCode', this._CommonService.getBranchCode());
    return this._CommonService.getAPI('/Accounts/Getgstvocuherprint', params, 'YES')
  }
  public getTDSReportDetails(localSchema:any, sectionid:any, fromdate:any, todate:any, grouptype:any,reporttype:any) {
    const params = new HttpParams().set("localSchema", localSchema).set("sectionid", sectionid).set("fromdate", fromdate).set("todate", todate).set("grouptype", grouptype).set("reporttype", reporttype).set("globalSchema", this._CommonService.getschemaname()).set("companyCode", this._CommonService.getCompanyCode()).set("branchCode", this._CommonService.getBranchCode());
    return this._CommonService.getAPI('/Accounts/getTDSReportDetails', params, 'YES');
  }
  GetSubscriberGroups(caobranchschema: string): Observable<any> {

    const params = new HttpParams({
      fromObject: {
        GlobalSchema: this._CommonService.getschemaname(),
      LocalSchema: this._CommonService.getbranchname(),
      CaoSchema: caobranchschema,
      CompanyCode: this._CommonService.getCompanyCode(),
      BranchCode: this._CommonService.getBranchCode(),
        
      }
    });

    return this._CommonService.getAPI(
      '/Accounts/GetSubscriberGroupCodes',
      params,
      'Yes'
    );
  }
  GetChequeEnquiryData(bankid: any, startindex: any, endindex: any, modeofreceipt: any, searchtext: any): Observable<any> {
    const params = new HttpParams().set('depositedBankid', bankid).set('BranchSchema', this._CommonService.getbranchname()).set('startindex', startindex).set('endindex', endindex).set('modeofreceipt', modeofreceipt).set('searchtext', searchtext).set('BrsFromDate', '01-01-1991').set('BrsTodate', '11-03-2026').set('GlobalSchema', this._CommonService.getschemaname()).set('CompanyCode', this._CommonService.getCompanyCode()).set('BranchCode', this._CommonService.getBranchCode());
    return this._CommonService.getAPI('/Accounts/api/ChequesOnHand/GetChequeEnquiryData', params, 'YES')
  }
  downloadKgmsOutwardReportsData(
  reportName: string,
  gridData: any[],
  gridheaders: any[],
  colWidthHeight: any,
  pagetype: 'a4' | 'landscape',
  printorpdf: 'Pdf' | 'Print',
  fromdate: string,
  todate: string,
  betweenorason: string
) {

  const Companyreportdetails = this._CommonService._getCompanyDetails();
  const address = this._CommonService.getcompanyaddress();

  const doc = new jsPDF({
    orientation: pagetype === 'landscape' ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const totalPagesExp = '{total_pages_count_string}';

  const today = this._CommonService.pdfProperties("Date");

  const kapil_logo = this._CommonService.getKapilGroupLogo();
  const currencyformat = this._CommonService.currencysymbol;
  const rupeeImage = this._CommonService._getRupeeSymbol();

  const lMargin = 15;
  const rMargin = 15;

  let pdfInMM: number;

  autoTable(doc, {

    head: [gridheaders],
    body: gridData,

    bodyStyles: {
      lineColor: [0, 0, 0],
      textColor: [0, 0, 0]
    },

    theme: 'grid',

    headStyles: {
      fillColor: this._CommonService.pdfProperties("Header Color"),
      halign: this._CommonService.pdfProperties("Header Alignment") as 'center',
      fontSize: 10
      // Number(this._CommonService.pdfProperties("Header Fontsize"))
    },

    styles: {
      cellPadding: 1,
      fontSize: 10,
      // Number(this._CommonService.pdfProperties("Cell Fontsize")),
      cellWidth: 'wrap',
      overflow: 'linebreak'
    },

    margin: { left: 10 },

    columnStyles: colWidthHeight,

    startY: 48,

    showHead: 'everyPage',
    showFoot: 'lastPage',

    didDrawPage: (data) => {

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFont('Times', 'normal');

      if (doc.getNumberOfPages() === 1) {

        doc.setFontSize(15);

        if (pagetype === 'a4') {

          doc.addImage(kapil_logo, 'JPEG', 10, 5, 20, 20);

          doc.setTextColor('black');

          doc.text(
            Companyreportdetails.companyName,
            pageWidth / 2,
            10,
            { align: 'center' }
          );

          doc.setFontSize(8);

          const address1 = address.substr(0, 115);
          const address2 = address.substring(115);

          // doc.text(address1, pageWidth / 2, 15, { align: 'center' });
          doc.text(Companyreportdetails.registrationAddress, pageWidth / 2, 18, { align: 'center' });

          if (Companyreportdetails.cinNumber) {
            doc.text(
              'CIN : ' + Companyreportdetails.cinNumber,
              pageWidth / 2,
              22,
              { align: 'center' }
            );
          }

          doc.setFontSize(14);

          doc.text(reportName, pageWidth / 2, 30, { align: 'center' });

          doc.setFontSize(10);

          doc.text(
            'Branch : ' + Companyreportdetails.branchName,
            pageWidth - 10,   
  40,
  { align: 'right' }
          );

          if (betweenorason === "Between") {
            doc.text(`Between : ${fromdate} And ${todate}`, 15, 40);
          }

          if (betweenorason === "As On" && fromdate) {
            doc.text(`As on : ${fromdate}`, 15, 40);
          }

          pdfInMM = 233;

          doc.line(
            10,
            45,
            (pdfInMM - lMargin - rMargin),
            45
          );
        }

        if (pagetype === 'landscape') {

          doc.addImage(kapil_logo, 'JPEG', 20, 5, 20, 20);

          doc.text(
            Companyreportdetails.companyName,
            pageWidth / 2,
            10,
            { align: 'center' }
          );

          doc.setFontSize(10);

          const address1 = address.substr(0, 150);

          doc.text(Companyreportdetails.registrationAddress, pageWidth / 2, 15, { align: 'center' });

          if (Companyreportdetails.cinNumber) {
            doc.text(
              'CIN : ' + Companyreportdetails.cinNumber,
              pageWidth / 2,
              20,
              { align: 'center' }
            );
          }

          doc.setFontSize(14);

          doc.text(reportName, pageWidth / 2, 30, { align: 'center' });

          doc.setFontSize(10);

          doc.text(
            'Branch : ' + Companyreportdetails.branchName,
            pageWidth - 10,   
  40,
  { align: 'right' }
          );

          if (betweenorason === "Between") {
            doc.text(`Between : ${fromdate} And ${todate}`, 15, 40);
          }

          if (betweenorason === "As On" && fromdate) {
            doc.text(`As on : ${fromdate}`, 15, 40);
          }

          pdfInMM = 315;

          doc.line(
            10,
            45,
            (pdfInMM - lMargin - rMargin),
            45
          );
        }

      } else {

        data.settings.margin.top = 20;
        data.settings.margin.bottom = 15;

      }

      let page = "Page " + doc.getNumberOfPages();

      if (typeof doc.putTotalPages === 'function') {
        page += ' of ' + totalPagesExp;
      }

      doc.line(
        5,
        pageHeight - 10,
        (pdfInMM - lMargin - rMargin),
        pageHeight - 10
      );

      doc.setFontSize(10);

      doc.text(
        "Printed on : " + today,
        data.settings.margin.left - 5,
        pageHeight - 5
      );

      doc.text(
        page,
        pageWidth - data.settings.margin.right - 20,
        pageHeight - 5
      );

    }

  });

  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPagesExp);
  }

  if (printorpdf === "Pdf") {
    doc.save(reportName + '.pdf');
  }

  if (printorpdf === "Print") {
    this._CommonService.setiFrameForPrint(doc);
  }

}
  
}
