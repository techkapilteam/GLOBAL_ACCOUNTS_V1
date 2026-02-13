import { inject, Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class SubscriberBalanceService {
  private _commonservice= inject(CommonService);
  _downloadPending_transferinReportsPdf(
  reportName: string,
  gridData: any[],
  gridheaders: any[],
  colWidthHeight: any,
  pagetype: any,
  printorpdf: string,
  branchname: string,
  typeofpaymentforreport: string
) {
  const address = this._commonservice.getcompanyaddress();
  const Companyreportdetails = this._commonservice._getCompanyDetails();
  const doc = new jsPDF(pagetype);
  const totalPagesExp = '{total_pages_count_string}';
  const today = this._commonservice.pdfProperties("Date");
  const currencyformat = this._commonservice.currencysymbol;
  const kapil_logo = this._commonservice.getKapilGroupLogo();
  const rupeeImage = this._commonservice._getRupeeSymbol();

  let lMargin = 15;
  let rMargin = 15;
  let pdfInMM = 0;

  (doc as any).autoTable({
    head: [gridheaders],
    body: gridData,
    theme: 'grid',
    headStyles: {
      fillColor: this._commonservice.pdfProperties("Header Color"),
      halign: this._commonservice.pdfProperties("Header Alignment"),
      fontSize: this._commonservice.pdfProperties("Header Fontsize")
    },
    styles: {
      cellWidth: 'wrap',
      fontSize: this._commonservice.pdfProperties("Cell Fontsize"),
      rowPageBreak: 'avoid',
      overflow: 'linebreak'
    },
    columnStyles: colWidthHeight,
    startY: 48,
    margins: { left: 10 },
    showHead: 'everyPage',
    showFoot: 'lastPage',

    didDrawPage: (data: any) => {
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width ?? pageSize.getWidth();
      const pageHeight = pageSize.height ?? pageSize.getHeight();

      doc.setFont("helvetica", "normal");

      if ((doc as any).internal.getNumberOfPages() === 1) {
        doc.setFontSize(15);

        if (pagetype === "a4") {
          if (kapil_logo) doc.addImage(kapil_logo, 'JPEG', 10, 5,20,20);

          doc.setTextColor('black');
          doc.text(Companyreportdetails.pCompanyName, 60, 10);
          doc.setFontSize(8);

          if (reportName === 'Pending Transfer In') {
            doc.text(address, pageWidth / 2, 17, { align: 'center' });
          } else {
            doc.text(address, 70, 17, { align: 'left' });
          }

          if (Companyreportdetails.pCinNo) {
            doc.text('CIN : ' + Companyreportdetails.pCinNo, 75, 22);
          }

          doc.setFontSize(14);
          doc.text(reportName, reportName === 'Pending Transfer In' ? 75 : 85, 32);

          doc.setFontSize(10);
          doc.text('Branch : ' + branchname, 163, 42);
          doc.text('Type of Payment : ' + typeofpaymentforreport, 10, 42);

          pdfInMM = 233;
          doc.setDrawColor(0, 0, 0);
          doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45);
        }

        if (pagetype === "landscape") {
          if (kapil_logo) doc.addImage(kapil_logo, 'JPEG', 10, 5,20,20);

          doc.setTextColor('black');
          doc.text(Companyreportdetails.pCompanyName, 110, 10);
          doc.setFontSize(10);
          doc.text(address, 80, 15, { align: 'left' });

          if (Companyreportdetails.pCinNo) {
            doc.text('CIN : ' + Companyreportdetails.pCinNo, 125, 20);
          }

          doc.setFontSize(14);
          doc.text(reportName, 130, 30);
          doc.setFontSize(10);
          doc.text('Branch : ' + branchname, 235, 40);

          pdfInMM = 315;
          doc.setDrawColor(0, 0, 0);
          doc.line(10, 45, (pdfInMM - lMargin - rMargin), 45);
        }
      } else {
        data.settings.margin.top = 20;
        data.settings.margin.bottom = 20;
      }

      const page = `Page ${(doc as any).internal.getNumberOfPages()}${typeof doc.putTotalPages === 'function' ? ' of ' + totalPagesExp : ''}`;

      doc.line(5, pageHeight - 10, (pdfInMM - lMargin - rMargin), pageHeight - 10);
      doc.setFontSize(10);
      doc.text("Printed on : " + today, data.settings.margin.left, pageHeight - 5);
      doc.text(page, pageWidth - data.settings.margin.right - 20, pageHeight - 5);
    },

    willDrawCell: (data: any) => {
      if (data.row.index === gridData.length - 1) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
      }
    },

    didDrawCell: (data: any) => {
      if (data.column.index === 11 && data.cell.section === 'body') {
        const td = data.cell.raw;
        if (td && currencyformat === "₹") {
          const textPos = (data.cell as any).textPos;
          doc.setFont("helvetica", "normal");
          doc.addImage(rupeeImage, textPos.x - data.cell.contentWidth, textPos.y + 0.5, 1.5, 1.5);
        }
      }
    }
  });

  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPagesExp);
  }

  if (printorpdf === "Pdf") {
    doc.save(reportName + '.pdf');
  }

  if (printorpdf === "Print") {
    this._commonservice.setiFrameForPrint(doc);
  }
}

  
}
