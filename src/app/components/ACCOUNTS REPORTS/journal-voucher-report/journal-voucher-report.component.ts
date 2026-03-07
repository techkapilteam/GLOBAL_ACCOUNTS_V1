import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { CommonService } from '../../../services/common.service';
import { CompanyDetailsService } from '../../../services/company-details.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { CompanyDetailsComponent } from 'src/app/common/company-details/company-details.component';
@Component({
  selector: 'app-journal-voucher-report',
  imports: [ CommonModule,
    DatePipe,
    TitleCasePipe],
  templateUrl: './journal-voucher-report.component.html',
  styleUrl: './journal-voucher-report.component.css',
})
export class JournalVoucherReportComponent {
  loading = false;

  // @Output() printedDate = new EventEmitter<boolean>();

  @ViewChild('pdf', { static: false })
  pdf!: ElementRef;

  submitted = false;
  JournalVoucherForm!: FormGroup;

  savebutton = 'Generate Report';
  isLoading = false;

  today: number = Date.now();
  todayDate: any;

  JournalVoucherData: any[] = [];

  PostedBY: any;
  paymentVouecherServicesData: any = {};

  pJvDate: any;
  pJvnumber: any;
  pNarration: any;

  pDebitamount = 0;
  pCreditAmount = 0;

  receiptName: any;

  currencySymbol: any;
  comapnydata: any;

  pCompanyName: any;
  todaydate: any;

  pAddress1: any;
  pAddress2: any;
  pCinNo: any;
  pGstinNo: any;
  pBranchname: any;

  pCreatedby: any;
  duplicate: any;
  companyName: string = '';
registrationAddress: string = '';
cinNumber: string = '';
branchName:string='';
printedDate: boolean = true;
  gstNumber: any;
  branchAddress: any;
  Gstinn: any;

  constructor(
    private datepipe: DatePipe,
    private router: Router,
    private formbuilder: FormBuilder,
    private commonService: CommonService,
    private jvReportService: AccountingReportsService,
    private activatedroute: ActivatedRoute,
    private companyDetailsService: CompanyDetailsService
  ) {}

  ngOnInit(): void {

    this.getCompanyName();

    this.todaydate = new Date();
    // this.printedDate.emit(true);

    this.currencySymbol = this.commonService.currencysymbol;
    this.pCreatedby = this.commonService.pCreatedby;

    this.todayDate =
      this.commonService.getFormatDateGlobal(this.today);

    this.activatedroute.queryParams.subscribe(params => {

      if (!params['id']) return;

      const routeParams =
        atob(params['id'].replace(/\s/g, '+'));

      const splitData = routeParams.split(',');

      this.pJvnumber = splitData[0];
      this.receiptName = splitData[1];

      if (splitData.length === 3) {
        this.duplicate = splitData[2];
      }

      this.GetJvReportbyid(this.pJvnumber);
    });
  }

  getCompanyName(): void {

    this.companyDetailsService
      .GetCompanyData()
      .subscribe({

        next: (json: any) => {

          sessionStorage.setItem(
            'CompanyDetails',
            JSON.stringify(json)
          );

        //  const comapnydata= this.commonService._setCompanyDetails();

        //   // this.comapnydata =
        //   //   this.commonService.comapnydetails;

        //   this.companyName =
        //     this.comapnydata?.companyName;

        //   this.registrationAddress =
        //     this.comapnydata?.registrationAddress;

        //   // this.pAddress2 =
        //   //   this.comapnydata?.pAddress2;

        //   this.cinNumber =
        //     this.comapnydata?.cinNumber;

        //   this.gstNumber =
        //     this.comapnydata?.gstNumber;

        //   this.branchName =
        //     this.comapnydata?.branchName;
        const company = json[0];

        this.companyName = company.companyName;
        this.branchAddress = company.branchAddress;
        this.registrationAddress = company.registrationAddress;
        this.cinNumber = company.cinNumber;
        this.gstNumber = company.gstNumber;
        this.branchName = company.branchName;

        if (this.gstNumber) {
          const l = this.gstNumber.split('');
          this.Gstinn = (l[0] + l[1]).toString();
        }
        },

        error: err =>
          this.commonService.showErrorMessage(err)
      });
  }

  downloadPdf(): void {

    const data =
      document.getElementById('temp-box');

    if (!data) return;

    html2canvas(data).then((canvas:any) => {

      const imgData =
        canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'landscape'
      });

      const imgProps =
        pdf.getImageProperties(imgData);

      const pdfWidth =
        pdf.internal.pageSize.getWidth();

      const pdfHeight =
        (imgProps.height * pdfWidth) /
        imgProps.width;

      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save('Journal-Voucher-Report.pdf');
    });
  }

  GetJvReportbyid(receiptId: any): void {

    this.jvReportService
      .GetJvReport(receiptId,'accounts','global','KAPILCHITS','KLC01')
      .subscribe({

        next: (res: any[]) => {

          this.JournalVoucherData = res ?? [];

          if (!this.JournalVoucherData.length)
            return;

          this.pDebitamount =
            res.reduce(
              (sum, x) =>
                sum + (x.pDebitamount ?? 0),
              0
            );

          this.pCreditAmount =
            res.reduce(
              (sum, x) =>
                sum + (x.pCreditAmount ?? 0),
              0
            );

          this.pJvDate =
            this.commonService.getFormatDateGlobal(
              res[0].pJvDate
            );

          this.pNarration =
            res[0].pNarration;

          this.PostedBY =
            res[0].pContactName;
        },

        error: err =>
          this.commonService.showErrorMessage(err)
      });
  }

  print(): void {

    const printContents =
      document.getElementById('temp-box')
        ?.innerHTML;

    if (!printContents) return;

    const popupWin =
      window.open(
        '',
        '_blank',
        'top=0,left=0,height=100%,width=auto'
      );

    popupWin?.document.open();

    popupWin?.document.write(`
      <html>
      <head>
      <title>Journal Voucher</title>
      <link rel="stylesheet"
       href="assets/css/bootstrap.min.css"/>
      </head>
      <body onload="window.print();window.close()">
      ${printContents}
      </body>
      </html>
    `);

    popupWin?.document.close();
  }

  pdfOrprint(printorpdf: string): void {

    const rows: any[] = [];

    const gridheaders = [
      'Particulars',
      'Debit Amount',
      'Credit Amount'
    ];

    const postedby =
      this.JournalVoucherData[0]?.pContactName;

    const columnStyle = {
      0: { halign: 'left' },
      1: { halign: 'right' },
      2: { halign: 'right' }
    };

    this.JournalVoucherData.forEach(x => {

      rows.push([
        x.pParticulars,
        this.commonService.currencyFormat(
          x.pDebitamount
        ),
        this.commonService.currencyFormat(
          x.pCreditAmount
        )
      ]);
    });

    rows.push([
      'Total',
      this.commonService.currencyFormat(
        this.pDebitamount
      ),
      this.commonService.currencyFormat(
        this.pCreditAmount
      )
    ]);

    this.commonService._downloadGridPdf1(
      this.receiptName,
      rows,
      gridheaders,
      columnStyle,
      'a4',
      printorpdf,
      this.pNarration,
      this.pJvnumber,
      this.pJvDate,
      this.todayDate,
      postedby
    );
  }

//   createpdf(
//   reportname: any,
//   gridData: any,
//   gridheaders: any,
//   colWidthHeight: any,
//   printorpdf: string
// ) {

//   if (!this.JournalVoucherData?.length) return;

//   const doc = new jsPDF('p', 'mm', 'a4');

//   const tempgrid: any[] = [];

//   this.JournalVoucherData.forEach((element: any, index:number) => {

//     tempgrid.push([
//       index + 1,
//       element.pParticulars,
//       this.commonService.currencyFormat(element.pDebitamount),
//       this.commonService.currencyFormat(element.pCreditAmount)
//     ]);

//   });

//   autoTable(doc,{
//     head:[gridheaders],
//     body: tempgrid,
//     startY:63
//   });

//   if (printorpdf === 'Pdf') {
//     doc.save(reportname + '.pdf');
//   }

//   if (printorpdf === 'Print') {
//     this.commonService.setiFrameForPrint(doc);
//   }

// }
}


