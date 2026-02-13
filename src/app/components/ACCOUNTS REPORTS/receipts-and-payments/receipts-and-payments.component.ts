import { Component, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LoginService } from '../../../services/Login/login.service';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { CommonService } from '../../../services/common.service';
import { finalize } from 'rxjs';
import { SubscriberStatementService } from '../../../services/subscriber-statement.service';

@Component({
  selector: 'app-receipts-and-payments',
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    BsDatepickerModule,
    NgClass,CommonModule
  ],
  templateUrl: './receipts-and-payments.component.html',
  styleUrl: './receipts-and-payments.component.css',
})


export class ReceiptsAndPaymentsComponent {
  // public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  // FormReceiptsandPaymentsGroup!: FormGroup
  // FormReceiptsandPaymentsGroup1!: FormGroup
  // // private fb = inject(FormBuilder);


  // disablesavebutton = signal(false);
  // disablesavebutton1 = signal(false);

  // savebutton = signal('Show');
  // savebutton1 = signal('Show Extract');


  // GroupCodes = signal([
  //   { groupcode: 'GRP001' },
  //   { groupcode: 'GRP002' },
  //   { groupcode: 'GRP003' }
  // ]);

  // ExtractCodes = signal([
  //   { pparticulars: 'Cash Receipt' },
  //   { pparticulars: 'Bank Payment' },
  //   { pparticulars: 'Journal Entry' }
  // ]);


  // // dpConfig = {
  // //   dateInputFormat: 'DD-MM-YYYY',
  // //   showWeekNumbers: false
  // // };
  // // dpConfig: Partial<BsDatepickerConfig> = {
  // //   containerClass: 'theme-default',
  // //   dateInputFormat: 'DD/MM/YYYY'
  // // };




  // constructor(private fb: FormBuilder) {
  //   this.dpConfig.maxDate = new Date();
  //   this.dpConfig.containerClass = 'theme-dark-blue';
  //   this.dpConfig.dateInputFormat = 'DD-MMM-YYYY';
  //   this.dpConfig.showWeekNumbers = false;
  // }

  // ngOnInit(): void {
  //   this.FormReceiptsandPaymentsGroup = this.fb.group({
  //     groupcode: [null, Validators.required],
  //     fromdate: new Date(),
  //     todate: new Date()
  //   }, { validators: this.dateRangeValidator() });

  //   this.FormReceiptsandPaymentsGroup1 = this.fb.nonNullable.group({
  //     extractcode: [null, Validators.required]
  //   });
  // }
  // // FormReceiptsandPaymentsGroup = this.fb.nonNullable.group({
  // //   groupcode: ['', Validators.required],
  // //   fromdate: new Date(),
  // //   todate: new Date()
  // // });

  // // FormReceiptsandPaymentsGroup1 = this.fb.nonNullable.group({
  // //   extractcode: ['', Validators.required]
  // // });


  // formErrors = signal<Record<string, string>>({});
  // formErrors1 = signal<Record<string, string>>({});
  // dateRangeValidator(): ValidatorFn {
  //   return (group: AbstractControl): ValidationErrors | null => {

  //     const from = group.get('fromdate')?.value;
  //     const to = group.get('todate')?.value;

  //     if (!from || !to) return null;

  //     const fromTime = new Date(from).setHours(0, 0, 0, 0);
  //     const toTime = new Date(to).setHours(0, 0, 0, 0);

  //     return fromTime > toTime
  //       ? { dateRangeInvalid: true }
  //       : null;
  //   };
  // }


  // GroupChange(): void {
  //   console.log(
  //     'Group changed:',
  //     this.FormReceiptsandPaymentsGroup.controls['groupcode'].value
  //   );
  // }

  // Show(): void {
  //   this.formErrors.set({});
  //   this.FormReceiptsandPaymentsGroup.markAllAsTouched();

  // if (this.FormReceiptsandPaymentsGroup.errors?.['dateRangeInvalid']) {
  //   alert('From Date should not be greater than To Date');
  //   return;
  // }

  // if (this.FormReceiptsandPaymentsGroup.invalid) return;

  //   if (this.FormReceiptsandPaymentsGroup.invalid) {
  //     this.formErrors.set({
  //       groupcode: 'Group Code is required'
  //     });
  //     return;
  //   }

  //   console.log('Receipts & Payments:', this.FormReceiptsandPaymentsGroup.getRawValue());
  //   alert('Receipts & Payments shown (Static)');
  // }

  // ShowExtract(): void {
  //   this.formErrors1.set({});

  //   if (this.FormReceiptsandPaymentsGroup1.invalid) {
  //     this.formErrors1.set({
  //       extractcode: 'Extract Code is required'
  //     });
  //     return;
  //   }

  //   console.log('Extract:', this.FormReceiptsandPaymentsGroup1.getRawValue());
  //   alert('Extract shown (Static)');
  // }
  private fb = inject(FormBuilder);
  private subscriberService = inject(SubscriberStatementService);
  private authService = inject(LoginService);
  private accountingService = inject(AccountingReportsService);
  private commonService = inject(CommonService);

  FormReceiptsandPaymentsGroup!: FormGroup;
  FormReceiptsandPaymentsGroup1!: FormGroup;

  GroupCodes: any[] = [];
  ExtractCodes: any[] = [];

  caoschema: string | null = null;

  disablesavebutton = false;
  disablesavebutton1 = false;

  savebutton = 'Show';
  savebutton1 = 'Extract Show';
  dpConfig: Partial<BsDatepickerConfig> = {
  dateInputFormat: 'DD-MMM-YYYY',
  containerClass: 'theme-dark-blue',
  showWeekNumbers: false,
  adaptivePosition: true
};

  ngOnInit(): void {
    this.initForms();
    this.caoschema = sessionStorage.getItem('loginBranchSchemaname');
    this.getGroupcodes();
  }

  private initForms(): void {
    this.FormReceiptsandPaymentsGroup = this.fb.group({
      groupcode: ['', Validators.required],
      fromdate: [new Date(), Validators.required],
      todate: [new Date(), Validators.required]
    });

    this.FormReceiptsandPaymentsGroup1 = this.fb.group({
      extractcode: ['', Validators.required]
    });
  }

  getGroupcodes(): void {
    if (!this.caoschema) return;

    this.subscriberService
      .GetSubscriberGroups(this.caoschema)
      .subscribe({
        next: (data: any[]) => this.GroupCodes = data,
        error: (err: any) => this.commonService.showErrorMessage(err)
      });
  }

  getExtractcodes(): void {
    if (!this.caoschema) return;

    this.subscriberService
      .GetSubscriberExtractCodes(this.caoschema)
      .subscribe({
        next: (data: any[]) => this.ExtractCodes = data,
        error: (err: any) => this.commonService.showErrorMessage(err)
      });
  }

  GroupChange(): void {
    this.FormReceiptsandPaymentsGroup1.patchValue({ extractcode: '' });
    this.ExtractCodes = [];
  }

  Show(): void {

    if (this.FormReceiptsandPaymentsGroup.invalid) {
      this.FormReceiptsandPaymentsGroup.markAllAsTouched();
      return;
    }

    const currentUser = this.authService._getUser();
    if (!currentUser) return;

    this.disablesavebutton = true;
    this.savebutton = 'Processing';

    const { fromdate, todate, groupcode } =
      this.FormReceiptsandPaymentsGroup.value;

    const branchschema = this.caoschema??'';
    const userid = sessionStorage.getItem('LoginUserid')??'';

    const formattedFrom =
      this.commonService.getFormatDateYYYMMDD(fromdate)??'';
    const formattedTo =
      this.commonService.getFormatDateYYYMMDD(todate)??'';

    this.accountingService
      .GetReceiptsandPayments(
        formattedFrom,
        formattedTo,
        groupcode,
        branchschema,
        userid
      )
      .pipe(
        finalize(() => {
          this.disablesavebutton = false;
          this.savebutton = 'Show';
        })
      )
      .subscribe({
        next: res => {
          if (res === 'True') {
            this.getExtractcodes();

            window.open(
              `https://chit.kgms.in:8092/AccountsReports/KGMSReceiptsandExpenditure/?fromDate=${formattedFrom}&toDate=${formattedTo}&BranchSchema=${branchschema}&GroupCode=${groupcode}`,
              '_blank'
            );

            window.open(
              `https://chit.kgms.in:8092/AccountsReports/KGMSComparisionTB/?fromDate=${formattedFrom}&toDate=${formattedTo}&BranchSchema=${branchschema}&GroupCode=${groupcode}`,
              '_blank'
            );
          } else {
            this.commonService.showWarningMessage(
              'Receipts and payments not Available.'
            );
          }
        },
        error: err => this.commonService.showErrorMessage(err)
      });
  }

  ShowExtract(): void {

    if (this.FormReceiptsandPaymentsGroup1.invalid) {
      this.FormReceiptsandPaymentsGroup1.markAllAsTouched();
      return;
    }

    const currentUser = this.authService._getUser();
    if (!currentUser) return;

    this.disablesavebutton1 = true;
    this.savebutton1 = 'Processing';

    const { fromdate, todate, groupcode } =
      this.FormReceiptsandPaymentsGroup.value;

    const extractcode =
      this.FormReceiptsandPaymentsGroup1.value.extractcode;

    const branchschema = this.caoschema??'';
    const userid = sessionStorage.getItem('LoginUserid')??'';

    const formattedFrom =
      this.commonService.getFormatDateYYYMMDD(fromdate)??'';
    const formattedTo =
      this.commonService.getFormatDateYYYMMDD(todate)??'';

    this.accountingService
      .GetReceiptsandPaymentsExtractCode(
        formattedFrom,
        formattedTo,
        groupcode,
        branchschema,
        userid,
        extractcode
      )
      .pipe(
        finalize(() => {
          this.disablesavebutton1 = false;
          this.savebutton1 = 'Extract Show';
        })
      )
      .subscribe({
        next: res => {
          if (res === 'True') {

            window.open(
              `https://chit.kgms.in:8092/AccountsReports/ReceiptsandPaymentsdetails/?fromDate=${formattedFrom}&toDate=${formattedTo}&BranchSchema=${branchschema}&GroupCode=${groupcode}&Extractcode=${extractcode}`,
              '_blank'
            );

          } else {
            this.commonService.showWarningMessage(
              'Receipts and payments not Available.'
            );
          }
        },
        error: err => this.commonService.showErrorMessage(err)
      });
  }
}