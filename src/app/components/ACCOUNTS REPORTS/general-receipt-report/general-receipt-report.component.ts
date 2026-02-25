import { Component, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { NumberToWordsPipe } from '../re-print/number-to-words.pipe';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { CompanyDetailsService } from '../../../services/company-details.service';

@Component({
  selector: 'app-general-receipt-report',
  imports: [CommonModule,
    DatePipe,
    DecimalPipe,
    TitleCasePipe,NumberToWordsPipe],
  templateUrl: './general-receipt-report.component.html',
  styleUrl: './general-receipt-report.component.css',
  providers: [NumberToWordsPipe]
})
export class GeneralReceiptReportComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private commonService = inject(CommonService);
  private receiptService = inject(AccountingReportsService);
  private companyService = inject(CompanyDetailsService);
  private datePipe = inject(DatePipe);
  private numberToWords = inject(NumberToWordsPipe);

  // @ViewChild(CompanyDetailsComponent) companyDetailsComponent!: CompanyDetailsComponent;

  GeneralReceiptServiceData: any[] = [];
  generalreceiptID!: string;
  receiptName!: string;
  schemaName!: string;
  pBranchname: string ='CA-Hyderabad';
  pCinNo!: string;
  todayDate!: string;
  printFileName!: string;
  pCompanyName: string = '';
  pAddress1: string = '';
  printedon: string = '';
  currencySymbol: string = '₹';
  cancelled: boolean = false;
duplicate: string = '';
getTotalAmount(list: any[]): number {
  if (!list || list.length === 0) return 0;

  return list.reduce((total: number, item: any) => {
    return total + (Number(item?.pLedgeramount) || 0);
  }, 0);
}


  ngOnInit(): void {
    this.printedon = new Date().toLocaleDateString();
    this.todayDate = this.commonService.getFormatDateGlobal(new Date());
    this.loadCompanyDetails();
    // this.activatedRoute.queryParams.subscribe(params => {
    //   const routeParams = atob(params['id'].replace(/\s/g, '+'));
    //   const split = routeParams.split(',');
    //   this.generalreceiptID = split[0];
    //   this.receiptName = split[1];
    //   this.schemaName = split[3];
    //   this.getGeneralreceiptDatabyId(this.generalreceiptID);
    // });
    this.activatedRoute.queryParams.subscribe({
  next: (params) => {

    const encodedId = params?.['id'];

    if (!encodedId) {
      console.warn('No ID found in query params');
      return;
    }

    try {

      const cleaned = encodedId.replace(/\s/g, '+');
      const decoded = atob(cleaned);

      const split = decoded.split(',');

      this.generalreceiptID = split?.[0] ?? '';
      this.receiptName = split?.[1] ?? '';
      this.schemaName = split?.[3] ?? '';

      if (this.generalreceiptID) {
        this.getGeneralreceiptDatabyId(this.generalreceiptID);
      }

    } catch (error) {
      console.error('Invalid Base64 ID:', error);
    }

  }
});
  }

  loadCompanyDetails() {
    // this.companyService.GetCompanyData().subscribe(() => {
    //   this.commonService._setCompanyDetails();
    //   const company = this.commonService.comapnydetails;
    //   this.pCinNo = company?.pCinNo;
    //   this.pBranchname = company?.pBranchname;
    // });
  }

  getGeneralreceiptDatabyId(id: string) {
    this.receiptService
      // .GetGeneralReceiptbyId(id, this.schemaName)
      .GetGeneralReceiptbyId(id,'accounts','KAPILCHITS','KLC01','global')
      .subscribe((res: any) => {
        this.GeneralReceiptServiceData = res;
        const receiptDate = this.datePipe.transform(res?.[0].pReceiptdate, 'ddMMyyyy');
        const today = this.datePipe.transform(new Date(), 'ddMMyyyyhmmssa');
        this.printFileName = `GR_${res?.[0].pReceiptId}_RD_${receiptDate}_PD_${today}`;
      });
  }

  pdfOrprint(type: 'Pdf' | 'Print') {
    const gridheaders = ['S.No.', 'Particulars', 'Amount'];
    const columnStyles = {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 'auto', halign: 'left' },
      2: { cellWidth: 40, halign: 'right' }
    };
    this.createpdf(this.receiptName, gridheaders, columnStyles, type);
  }

  createpdf(
    reportname: string,
    gridheaders: any[],
    columnStyles: any,
    type: 'Pdf' | 'Print'
  ) {
    if (!this.GeneralReceiptServiceData?.length) return;

    const doc = new jsPDF('p', 'mm', 'a4');

    this.GeneralReceiptServiceData.forEach((data, index) => {

      doc.setFontSize(12);
      doc.text(reportname, 105, 20, { align: 'center' });

      doc.setFontSize(9);
      doc.text(`Receipt No : ${data.receiptid}`, 15, 30);
      doc.text(`Date : ${this.commonService.getFormatDateGlobal(data.receipt_date)}`, 150, 30);

      const tableRows: any[] = [];
      const subList = data.pGeneralReceiptSubDetailsList || [];

      subList.forEach((item: any, i: number) => {
        tableRows.push([
          i + 1,
          item.pAccountname,
          this.commonService.currencyFormat(item.ledger_amount)
        ]);
      });

      const total = subList.reduce(
        (sum: number, x: any) => sum + x.ledger_amount,
        0
      );

      tableRows.push([
        { content: 'Total', colSpan: 2, styles: { halign: 'right', fontStyle: 'bold' } },
        this.commonService.currencyFormat(total)
      ]);

      autoTable(doc, {
        head: [gridheaders],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        styles: { fontSize: 9 },
        columnStyles
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;

      const amountInWords =
        "Rupees " +
        this.titleCase(this.numberToWords.transform(total)) +
        " Only.";

      const content = `
Received With Thanks From : ${data.pContactname}
Amount In Words : ${amountInWords}
Narration : ${data.narration}
Mode Of Payment : ${data.typeofpayment}
      `;

      doc.text(content, 15, finalY);

      doc.text('(Approved By)', 25, 260);
      doc.text('(Verified By)', 90, 260);
      doc.text('(Posted By)', 160, 260);

      if (index < this.GeneralReceiptServiceData.length - 1) {
        doc.addPage();
      }
    });

    if (type === 'Pdf') {
      doc.save(`${reportname}.pdf`);
    } else {
      this.commonService.setiFrameForPrint(doc);
    }
  }

  titleCase(str: string): string {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  }

}
