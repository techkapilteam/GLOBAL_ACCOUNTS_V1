import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NumberToWordsPipe } from '../re-print/number-to-words.pipe';
import { FormBuilder } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { CompanyDetailsService } from '../../../services/company-details.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { take } from 'rxjs';

@Component({
  selector: 'app-payment-voucher-report',
  imports: [CommonModule, DatePipe, NumberToWordsPipe, TitleCasePipe, DecimalPipe],
  templateUrl: './payment-voucher-report.component.html',
  styleUrl: './payment-voucher-report.component.css',
  providers: [NumberToWordsPipe]
})
export class PaymentVoucherReportComponent implements OnInit {

  loading = false;
  paymentVouecherServicesData: any = [];
  today: number = Date.now();
  todayDate: any;
  paymentDate: any;
  @Output() printedDate: any;

  tempPaymentData: any[] = [];
  pvnumber: any;
  receiptName: any;

  currencysymbol: any;
  comapnydata: any;
  pCompanyName: any;
  todaydate: any;

  pAddress1: any;
  pAddress2: any;
  pCinNo: any;
  pGstinNo: any;
  pBranchname: any;

  printedon: any;
  duplicate: any;
  showgrid = false;
  Gstinn: any;
  companyName: string | undefined;
  registrationAddress!: string;
  cinNumber!: string;
  branchName!: string;
  branchAddress: any;
  gstNumber: any;

  constructor(
    private router: Router,
    private numbertowords: NumberToWordsPipe,
    private fb: FormBuilder,
    private commonService: CommonService,
    private paymentService: AccountingReportsService,
    private datePipe: DatePipe,
    private activatedroute: ActivatedRoute,
    private companyService: CompanyDetailsService
  ) {
    this.currencysymbol =
      this.commonService.datePickerPropertiesSetup('currencysymbol');
    this.printedon = this.commonService.pdfProperties('Date');
  }

  ngOnInit(): void {

    this.getComapnyName();

    this.todaydate = new Date();
    this.printedDate = true;

    this.todayDate = this.datePipe.transform(
      this.today,
      'dd-MMM-yyyy h:mm:ss a'
    );

    this.activatedroute.queryParams.pipe(take(1)).subscribe(params => {

      const routeParams = atob(params['id'].replace(/\s/g, '+'));
      const splitData = routeParams.split(',');

      this.pvnumber = splitData[0];
      this.receiptName = splitData[1];

      if (splitData.length === 3) {
        this.duplicate = splitData[2];
      }

      if (this.receiptName === 'Petty Cash') {
        this.GetPettyCashReportDataById(this.pvnumber);
        this.showgrid = true;
      } else if (this.receiptName === 'Chit Payment') {
        this.GetChitPaymentVoucherReportDataById(this.pvnumber);
        this.showgrid = false;
      } else {
        this.GetPaymentVoucherReportDataById(this.pvnumber);
        this.showgrid = true;
      }
    });
  }

  showErrorMessage(msg: string) {
    this.commonService.showErrorMessage(msg);
  }

  getComapnyName() {

    this.companyService.GetCompanyData().subscribe({
      next: (json: any) => {

        sessionStorage.setItem(
          'CompanyDetails',
          JSON.stringify(json)
        );

        // this.commonService._setCompanyDetails();

        // this.comapnydata =
        //   this.commonService.comapnydetails;

        // this.pCompanyName =
        //   this.comapnydata['pCompanyName'];

        // this.pAddress1 =
        //   this.comapnydata['pAddress1'];

        // this.pAddress2 =
        //   this.comapnydata['pAddress2'];

        // this.pCinNo =
        //   this.comapnydata['pCinNo'];

        // this.pGstinNo =
        //   this.comapnydata['pGstinNo'];

        // this.pBranchname =
        //   this.comapnydata['pBranchname'];

        // const l = this.pGstinNo.split('');
        // this.Gstinn = (l[0] + l[1]).toString();
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
      error: err => this.commonService.showErrorMessage(err)
    });
  }

  GetPaymentVoucherReportDataById(id: any) {

    this.paymentService
      .GetPaymentVoucherbyId(id, 'accounts', 'KAPILCHITS', 'KLC01', 'global')
      .subscribe({
        next: (res: any) => {
          const unique = res.filter(
            (item: any, index: number, self: any[]) =>
              index === self.findIndex((t: any) => t.ppaymentid === item.ppaymentid)
          );
          // this.tempPaymentData = res;
          this.tempPaymentData = unique;

          this.tempPaymentData.forEach((x: any) => {

            const tot = x.ppaymentslist.reduce(
              (s: number, i: any) =>
                s + i.pLedgeramount - i.ptdsamount + i.pcgstamount,
              0
            );
            x.totvalue = tot;

            const gst = x.ppaymentslist.reduce(
              (s: number, i: any) =>
                s + i.pcgstamount + i.psgstamount + i.pigstamount,
              0
            );

            const tds = x.ppaymentslist.reduce(
              (s: number, i: any) => s + i.ptdsamount,
              0
            );

            x.totvalue = tot;
            x.gstvalue = gst;
            x.tdsvalue = tds;
          });

          if (!this.tempPaymentData.length) {
            this.tempPaymentData.push({});
          }
        },
        error: err => this.showErrorMessage(err)
      });
  }

  GetPettyCashReportDataById(id: any) {

    this.paymentService
      .GetPettyCashbyId(id, 'accounts', 'KAPILCHITS', 'KLC01', 'global')
      .subscribe({
        next: (res: any) => {
          this.tempPaymentData = res.filter(
            (item: any, index: number, self: any[]) =>
              index === self.findIndex((t: any) => t.ppaymentid === item.ppaymentid)
          );


          this.tempPaymentData = res;

          this.tempPaymentData.forEach((x: any) => {

            const tot = x.ppaymentslist.reduce(
              (s: number, i: any) =>
                s + i.pLedgeramount - i.ptdsamount + i.pcgstamount,
              0
            );

            const gst = x.ppaymentslist.reduce(
              (s: number, i: any) =>
                s + i.pcgstamount + i.psgstamount + i.pigstamount,
              0
            );

            const tds = x.ppaymentslist.reduce(
              (s: number, i: any) => s + i.ptdsamount,
              0
            );

            x.totvalue = tot;
            x.gstvalue = gst;
            x.tdsvalue = tds;
          });

          if (!this.tempPaymentData.length) {
            this.tempPaymentData.push({});
          }
        },
        error: err => this.showErrorMessage(err)
      });
  }

  GetChitPaymentVoucherReportDataById(id: any) {

    this.paymentService
      .GetChitPaymentReportData(id, 'accounts', 'KAPILCHITS', 'KLC01', 'global')
      .subscribe({
        next: (res: any) => {

          if (!res || res.length === 0) {
            this.tempPaymentData = [];
            return;
          }
          const unique = res.filter(
            (item: any, index: number, self: any[]) =>
              index === self.findIndex((t: any) => t.ppaymentid === item.ppaymentid)
          );

          const data = res[0];
          this.tempPaymentData = unique;

          data.ppaymentslist = [{
            pLedgeramount: data?.transaction_amount ?? 0,
            pAccountname: data?.parentaccountname ?? '',
            pcgstamount: 0,
            psgstamount: null,
            pigstamount: null,
            ptdsamount: 0
          }];

          res[0].pcontactname =
            res[0].pcontactname +
            '( ' +
            res[0].accountname +
            ' )';

          this.tempPaymentData = res;

          this.tempPaymentData.forEach((x: any) => {

            x.totvalue =
              x.ppaymentslist.reduce(
                (s: number, i: any) =>
                  s + i.pLedgeramount,
                0
              );
          });

          if (!this.tempPaymentData.length) {
            this.tempPaymentData.push({});
          }
        },
        error: err => this.showErrorMessage(err)
      });
  }

  titleCase(str: string) {

    return str
      .toLowerCase()
      .split(' ')
      .map(
        w =>
          w.charAt(0).toUpperCase() +
          w.substring(1)
      )
      .join(' ');
  }
  pdfOrprint(type: 'Pdf' | 'Print'): void {

    const element = document.getElementById('temp-box');

    if (!element) return;

    html2canvas(element, {
      scale: 2,
      useCORS: true
    }).then((canvas: any) => {

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = 210;
      const pageHeight = 295;

      const imgWidth = pageWidth;
      const imgHeight =
        (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(
        imgData,
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;

      while (heightLeft > 0) {

        position = heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(
          imgData,
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight
        );

        heightLeft -= pageHeight;
      }

      if (type === 'Pdf') {

        pdf.save(
          `PaymentVoucherReport_${this.pvnumber}.pdf`
        );

      } else {

        const blobUrl =
          pdf.output('bloburl');

        const iframe =
          document.createElement('iframe');

        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.src = blobUrl.toString();

        document.body.appendChild(iframe);

        iframe.onload = () => {
          iframe.contentWindow?.print();
        };

      }

    });

  }

}