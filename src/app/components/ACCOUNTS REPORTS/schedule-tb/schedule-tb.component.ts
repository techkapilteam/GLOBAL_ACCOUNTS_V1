
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccountingReportsService } from '../../../services/Transactions/AccountingReports/accounting-reports.service';
import { LoginService } from '../../../services/Login/login.service';
import { CommonService } from '../../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../envir/environment.prod';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule-tb',
   standalone: true,
  imports: [ReactiveFormsModule,
    BsDatepickerModule,CommonModule
    
  ],
  templateUrl: './schedule-tb.component.html',
  styleUrl: './schedule-tb.component.css',
})



export class ScheduleTbComponent {

// DocumentsForm!: FormGroup;
//   public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

//   // static values
//   disabletransactiondate: boolean = false;
//   savebutton: string = 'Save';

//   // ngx-bootstrap datepicker config (static)
//   // dpConfig = {
//   //   dateInputFormat: 'DD-MM-YYYY',
//   //   showWeekNumbers: false
//   // };

//   constructor(private fb: FormBuilder) {
//       this.dpConfig.maxDate = new Date();
//     this.dpConfig.containerClass = 'theme-dark-blue';
//     this.dpConfig.dateInputFormat = 'DD-MM-YYYY';
//     this.dpConfig.showWeekNumbers = false;
//   }

//   ngOnInit(): void {
//     this.DocumentsForm = this.fb.group({
//       todate: [new Date()] // static default date
//     });
//   }

//   checkox(event: any): void {
//     console.log('Checkbox clicked', event.target.checked);
//   }

//   onCLick(): void {
//     console.log('Form Value:', this.DocumentsForm.value);
//     alert('Saved Successfully (Static Data)');
//   }
private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private accountingService = inject(AccountingReportsService);
  private authService = inject(LoginService);
  private commonService = inject(CommonService);
  private route = inject(ActivatedRoute);

  documentsForm!: FormGroup;
  asOnDate = true;
  disableTransactionDate = false;
  branchSchema: string = '';
  crystalApiUrl: string = '';


  datePickerConfig: Partial<BsDatepickerConfig> = {
    containerClass: 'theme-dark-blue',
    dateInputFormat: 'DD-MMM-YYYY',
    showWeekNumbers: false,
    adaptivePosition: true
  };

  ngOnInit(): void {

    this.initializeForm();
    this.loadCompanySettings();
    this.loadBranchSchema();
    this.loadCrystalApiUrl();
  }

  private initializeForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.documentsForm = this.fb.group({
      fromdate: [today, Validators.required],
      todate: [today, Validators.required]
    });
  }

  private loadCompanySettings(): void {
    const company = this.commonService.comapnydetails;

    if (company) {
      this.disableTransactionDate =
        company.pdatepickerenablestatus ||
        company.pfinclosingjvallowstatus;
    }
  }

  private loadBranchSchema(): void {
    this.branchSchema = this.commonService.getschemaname();
  }

  private loadCrystalApiUrl(): void {
    this.http.get<any>(environment.apiURL).subscribe({
      next: (data) => {
        this.crystalApiUrl = data?.[2]?.CrystalReportsApiHostUrl || '';
      },
      error: (err) => {
        this.commonService.showErrorMessage(err);
      }
    });
  }

  onCheckboxChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.asOnDate = !checked;
  }

  onShow(): void {

    if (this.documentsForm.invalid) {
      this.documentsForm.markAllAsTouched();
      return;
    }

    const currentUser = this.authService._getUser();

    if (!currentUser?.pUserID) {
      this.commonService.showWarningMessage('User not logged in.');
      return;
    }

    const empId = currentUser.pUserID;
    const toDate = this.documentsForm.value.todate;
    const formattedDate = this.commonService.getFormatDateNormal(toDate)??'';

    this.accountingService.UpdateScheduleid(empId, formattedDate).subscribe({
      next: (res: string) => {

        if (res === 'True') {
          const url = `${this.crystalApiUrl}AccountsReports/GetScheduleTB/?fromDate=${formattedDate}&BranchSchema=${this.branchSchema}&Empid=${empId}`;
          window.open(url, '_blank');
        } else {
          this.commonService.showWarningMessage(
            'Schedule TB accounts not tallied.'
          );
        }
      },
      error: (err) => {
        this.commonService.showErrorMessage(err);
      }
    });
  }



}