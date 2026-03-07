import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { CompanyDetailsService } from 'src/app/services/company-details.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-company-details',
  imports: [TitleCasePipe],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.css',
})
export class CompanyDetailsComponent implements OnInit {

  private _CommonService = inject(CommonService);
  private _CompanyDetailsService = inject(CompanyDetailsService);

  comapnydata: any;
  comapnydetails: any;

  pCompanyName: string | null = null;
  todaydate: Date = new Date();

  @Input() PrintedDateShowhide: boolean = false;

  address: string | null = null;

  pAddress1: string | null = null;
  pAddress2: string | null = null;
  pcity: string | null = null;
  pCountry: string | null = null;
  pState: string | null = null;
  pDistrict: string | null = null;
  pPincode: string | null = null;
  pCinNo: string | null = null;
  pGstinNo: string | null = null;
  pBranchname: string | null = null;
  pVersionno: string | null = null;
  pSjvAllowstatus: any;

  ngOnInit(): void {
    this.getComapnyName();
  }

  // getComapnyName(): void {

  //   this._CompanyDetailsService.GetCompanyData().subscribe({
  //     next: (json) => {

  //       sessionStorage.setItem('companydetails', JSON.stringify(json));
  //       this._CommonService._setCompanyDetails();

  //       this.comapnydata = this._CommonService.comapnydetails;

  //       this.pCompanyName = this.comapnydata['pCompanyName'];
  //       this.pAddress1 = this.comapnydata['pAddress1'];
  //       this.pAddress2 = this.comapnydata['pAddress2'];
  //       this.pCinNo = this.comapnydata['pCinNo'];
  //       this.pGstinNo = this.comapnydata['pGstinNo'];
  //       this.pBranchname = this.comapnydata['pBranchname'];
  //       this.pSjvAllowstatus = this.comapnydata['puncommenced_sjv_allow_status'];

  //       this.address = this._CommonService.getcompanyaddress();
  //     },
  //     error: (error) => {
  //       this._CommonService.showErrorMessage(error);
  //     }
  //   });

  // }
companyName: string = '';
registrationAddress: string = '';
cinNumber: string = '';
branchName: string = '';


getComapnyName(): void {

  this._CompanyDetailsService.GetCompanyData().subscribe(
    (data: any) => {

      if (data && data.length > 0) {

        const company = data[0];

        this.companyName = company.companyName;
        this.registrationAddress = company.registrationAddress;
        this.cinNumber = company.cinNumber;
        this.branchName = company.branchName;

      }

    },
    (error) => {
      this._CommonService.showErrorMessage(error);
    }
  );

}


  showErrorMessage(errormsg: string): void {
    this._CommonService.showErrorMessage(errormsg);
  }

  showInfoMessage(errormsg: string): void {
    this._CommonService.showInfoMessage(errormsg);
  }

}
