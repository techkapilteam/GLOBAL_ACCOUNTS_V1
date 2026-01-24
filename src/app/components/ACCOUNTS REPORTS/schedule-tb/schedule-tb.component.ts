



// import { Component, OnInit, ViewChild } from '@angular/core';
// import { Component, EnvironmentInjector } from '@angular/core';
// import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
// // import { PageCriteria } from 'src/app/Models/pagecriteria';
// // import { CommonService } from 'src/app/Services/common.service';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
// import { HttpClientModule } from '@angular/common/http';

//import { EmployeeDetailsComponent } from 'src/app/UI/Common/employee-details/employee-details.component';
// import { ActivatedRoute } from '@angular/router';
// import { filter } from 'rxjs-compat/operator/filter';
// import { filter } from 'rxjs/operators';
// import { saveAs } from '@progress/kendo-file-saver';
// import { Charges } from 'src/app/Models/legal-charges';
// import { ContacmasterService } from 'src/app/Services/Configuration/ContactConfiguration/contacmaster.service';
// import { ChartOptions } from 'chart.js';
// import { Psspecimen1Service } from 'src/app/Services/PSInfo/psspecimen1.service';
// import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
// import * as jsPDF from 'jspdf'; import { LoginService } from 'src/app/Services/Login/login.service';
// import { AccountingReportsService } from 'src/app/Services/Transactions/AccountingReports/accounting-reports.service';
// import { HttpClient } from '@angular/common/http';
//import { environment } from 'src/environments/environment';

//import { environment } from '../../environments/environment.development';

// import { mergeMap } from 'rxjs/operators';
// import { Observable } from 'rxjs';
// import { ReactiveFormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';




//   public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
//   public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
//   public dpConfig2: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
//   asonDate: boolean = true;
//   DocumentsForm!: FormGroup;
//   savebutton: string = "Show";
//   branchschema: any;
//   disabletransactiondate = false;
//   urldata = ''
//   LegalForm: any;
//   constructor(
//     //private _accountingreportservice:AccountingReportsService,
//     // private authenticationService: LoginService,
//     // private _psspecimenService: Psspecimen1Service,
//     private dataRoute: ActivatedRoute,
//     // private _commonService: CommonService,
//     private formbuilder: FormBuilder,
//     // private _contacmasterservice: ContacmasterService,
//     private http: HttpClient
//   ) {
//     this.dpConfig = {
//       containerClass: 'theme-dark-blue',
//       dateInputFormat: 'DD/MM/YYYY'
//     };
//     this.dpConfig.maxDate = new Date();
//     //this.dpConfig.minDate = new Date();
//     //this.dpConfig.dateInputFormat = this._commonService.datePickerPropertiesSetup("dateInputFormat");
//     //this.dpConfig.containerClass = this._commonService.datePickerPropertiesSetup("containerClass");
//     this.dpConfig.showWeekNumbers = false;
//     //this.dpConfig.maxDate = new Date();

//     this.dpConfig1.maxDate = new Date();
//     this.dpConfig1.minDate = new Date();
//     // this.dpConfig1.dateInputFormat = this._commonService.datePickerPropertiesSetup("dateInputFormat");
//     // this.dpConfig1.containerClass = this._commonService.datePickerPropertiesSetup("containerClass");
//     this.dpConfig1.showWeekNumbers = false;

//     // this.dpConfig2.dateInputFormat = this._commonService.datePickerPropertiesSetup("dateInputFormat");
//     // this.dpConfig2.containerClass = this._commonService.datePickerPropertiesSetup("containerClass");
//     this.dpConfig2.showWeekNumbers = false;
//     this.dpConfig2.maxDate = new Date();


//   }


//   ngOnInit(): void {
//     this.jsonmethod()
//     //   if (this._commonService.comapnydetails != null)
//     //   if(this._commonService.comapnydetails.pdatepickerenablestatus || this._commonService.comapnydetails.pfinclosingjvallowstatus){
//     //     this.disabletransactiondate=true
//     //   }
//     //   else{
//     //     this.disabletransactiondate=false
//     //   }
//     // this.branchschema=  this._commonService.getschemaname();
//     this.DocumentsForm = this.formbuilder.group({
//       fromdate: [new Date(), Validators.required],
//       todate: [new Date(), Validators.required],

//     });
//   }

//   checkox(event: any) {
//     if (event.target.checked) {
//       this.asonDate = false;
//     } else {
//       this.asonDate = true;
//     }
//     this.LegalForm['controls']['todate'].setValue(new Date);
//   }

//   jsonmethod() {
//     //   this.getJSON().subscribe(data => {
//     //     console.log(data[2]);
//     //     this.urldata=data[2]

//     // });
//   }

//   // public getJSON(): Observable<any> {
//   //     return this.http.get(environment.apiURL);
//   // }

//   onCLick() {
//     debugger
//     //   const currentUser = this.authenticationService._getUser();
//     //   const isLoggedIn = currentUser && currentUser.pToken;
//     //   let pToken="";
//     //   if (isLoggedIn) {
//     //     pToken=currentUser.pToken
//     //   }
//     //   var params = {
//     //     access_token: pToken,
//     // };

//     //const currentUser = this.authenticationService._getUser();
//     // if (currentUser != null) {
//     //   const isLoggedIn = currentUser.pUserID;
//     //   let asondate = this.DocumentsForm.controls.todate.value;
//     //     let date = this._commonService.getFormatDateNormal(asondate);
//     //     // let crystalUrl=this._commonservice.getCrystalReportsAPI.url
//     //   this._accountingreportservice.UpdateScheduleid(isLoggedIn,date).subscribe(res => {

//     //     if(res=="True"){
//     //     if (this.branchschema != undefined) {
//     //       //var url = ['http://host3.kapilit.com:42921/AccountsReports/GetScheduleTB/?fromDate='+date+'&BranchSchema='+this.branchschema+'', $.param(params)].join('?');
//     //       //window.open(this.auctionURL+'/#/Livebidding?id='+chitNo, '_blank', 'location=yes,scrollbars=yes,status=yes');
//     //       //window.open('http://host3.kapilit.com:42921/AccountsReports/GetScheduleTB/?fromDate=' + date + '&BranchSchema=' + this.branchschema + '&Empid=' + isLoggedIn + '', '_blank', 'location=yes,scrollbars=yes,status=yes')
//     //        window.open(this.urldata['CrystalReportsApiHostUrl']+'AccountsReports/GetScheduleTB/?fromDate=' + date + '&BranchSchema=' + this.branchschema + '&Empid=' + isLoggedIn + '', '_blank', 'location=yes,scrollbars=yes,status=yes')
//     //       //window.open('https://chit.kgms.in:8092/AccountsReports/GetScheduleTB/?fromDate=' + date + '&BranchSchema=' + this.branchschema + '&Empid=' + isLoggedIn + '', '_blank', 'location=yes,scrollbars=yes,status=yes')
//     //     }
//     //   }else{
//     //     // this._commonService.showWarningMessage("Please check the accounts(INTER COMPANY-CASHONHAND,CHEQUEONHAND-UNCLEARED CHEQUES,UNCLEARED CHEQUES<=0,CASHONHAND >=0) are mismatched ");
//     //     this._commonService.showWarningMessage("Schedule TB accounts not tallied. ");
//     //   }

//     //   }, (error) => {
//     //     this._commonService.showErrorMessage(error);
//     //   });
//     // }
//   }
// }




import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-schedule-tb',
   standalone: true,
  imports: [ReactiveFormsModule,
    BsDatepickerModule,
    
  ],
  templateUrl: './schedule-tb.component.html',
  styleUrl: './schedule-tb.component.css',
})



export class ScheduleTbComponent {

DocumentsForm!: FormGroup;

  // static values
  disabletransactiondate: boolean = false;
  savebutton: string = 'Save';

  // ngx-bootstrap datepicker config (static)
  dpConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    showWeekNumbers: false
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.DocumentsForm = this.fb.group({
      todate: [new Date()] // static default date
    });
  }

  checkox(event: any): void {
    console.log('Checkbox clicked', event.target.checked);
  }

  onCLick(): void {
    console.log('Form Value:', this.DocumentsForm.value);
    alert('Saved Successfully (Static Data)');
  }



}