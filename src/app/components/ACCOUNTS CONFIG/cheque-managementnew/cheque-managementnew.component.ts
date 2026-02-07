import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { AccountingMasterService } from '../../../services/accounting-master.service';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-cheque-managementnew',
  imports: [CommonModule,ReactiveFormsModule,NgxDatatableModule],
  templateUrl: './cheque-managementnew.component.html',
  styleUrl: './cheque-managementnew.component.css',
})
export class ChequeManagementnewComponent implements OnInit {
  chequemanagementform!: FormGroup;

  bankdetails: any[] = [];
  gridData: any[] = [];

  recordid: any;
  selectedbank: any;

  totalcheques = 0;
  noofcheque = 0;
  fromcheqno = 0;
  tocheqno = 0;
  cheq = 0;

  buttonname = 'Save';
  buttonnameactive = 'Save & Generate';

  disablesavebutton = false;
  disablesaveactivebutton = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private accountingMasterService: AccountingMasterService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    // this.loadBanks();
    this.bankdetails = [
    { pBankname: 'Collection Bank A/c 00166 - 18391101000166', pRecordid: 1 },
    { pBankname: 'Bidpayable - 021511010000051', pRecordid: 2 },
    { pBankname: 'Second Account - 18391101000176', pRecordid: 3 }
  ];
  }

  buildForm(): void {
    this.chequemanagementform = this.fb.group({
      pBankId: [''],
      pBankname: [null, Validators.required],
      pNoofcheques: ['', [Validators.required, Validators.min(1)]],
      pChequefrom: ['', Validators.required],
      pChequeto: [{ value: '', disabled: true }, Validators.required],
      pChqegeneratestatus: [''],
      pStatusname: ['Active'],
      ptypeofoperation: ['CREATE'],
      pCreatedby: [''],
      branchSchema: [''],
      pipaddress: ['']
    });
  }

  // loadBanks(): void {
  //   this.accountingMasterService.GetBankDetails().subscribe(data => {
  //     this.bankdetails = data ?? [];
  //   });
  // }

  getrecordid(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const bank = this.bankdetails.find(b => b.pBankname === value);

    if (bank) {
      this.recordid = bank.pRecordid;
      this.selectedbank = bank.pBankname;
      this.chequemanagementform.patchValue({
        pBankId: bank.pRecordid
      });
    }

    this.gridData = [];
  }

  noofcheques(event: Event): void {
    this.noofcheque = +(event.target as HTMLInputElement).value || 0;
    this.totalcheques = Math.max(this.noofcheque - 1, 0);

    if (this.fromcheqno && this.noofcheque) {
      this.tocheqno = this.fromcheqno + this.totalcheques;
      this.chequemanagementform.patchValue({ pChequeto: this.tocheqno });
    }
  }

  fromchequeno(event: Event): void {
    this.fromcheqno = +(event.target as HTMLInputElement).value || 0;

    if (!this.noofcheque) {
      this.chequemanagementform.patchValue({ pChequeto: '' });
      return;
    }

    this.tocheqno = this.fromcheqno + this.totalcheques;
    this.chequemanagementform.patchValue({ pChequeto: this.tocheqno });
  }

  validateGridRange(): boolean {
    for (const row of this.gridData) {
      if (row.pBankname === this.selectedbank) {
        const from = +row.pChequefrom;
        const to = +row.pChequeto;

        if (
          (this.fromcheqno >= from && this.fromcheqno <= to) ||
          (this.tocheqno >= from && this.tocheqno <= to) ||
          (this.fromcheqno <= from && this.tocheqno >= to)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  addtoGrid(): void {
    if (this.chequemanagementform.invalid) {
      this.chequemanagementform.markAllAsTouched();
      return;
    }

    if (!this.validateGridRange()) {
      this.commonService.showWarningMessage('Cheque range already exists');
      return;
    }

    this.accountingMasterService
      .GetExistingChequeCount(this.recordid, this.fromcheqno, this.tocheqno)
      .subscribe(res => {
        if (res !== 0) {
          this.commonService.showWarningMessage('Cheque No already exists');
          return;
        }

        const row = {
          ...this.chequemanagementform.getRawValue(),
          pStatusname: false,
          ptypeofoperation: 'CREATE'
        };

        this.gridData = [...this.gridData, row];
        this.resetChequeFields();
      });
  }

  resetChequeFields(): void {
    this.chequemanagementform.patchValue({
      pNoofcheques: '',
      pChequefrom: '',
      pChequeto: ''
    });

    this.noofcheque = 0;
    this.totalcheques = 0;
    this.fromcheqno = 0;
    this.tocheqno = 0;
  }

  save(type: 'Active' | 'InActive'): void {
    if (this.gridData.length === 0) {
      return;
    }

    const isActive = type === 'Active' ? 'true' : 'false';

    this.disablesavebutton = type === 'InActive';
    this.disablesaveactivebutton = type === 'Active';

    this.chequemanagementform.patchValue({
      pCreatedby: this.commonService.getCreatedBy(),
      branchSchema: this.commonService.getschemaname(),
      pipaddress: this.commonService.getIpAddress(),
      pChqegeneratestatus: isActive
    });

    const payload = {
      ...this.chequemanagementform.getRawValue(),
      lstChequemanagementDTO: this.gridData
    };

    this.accountingMasterService
      .SaveChequeManagement(JSON.stringify(payload))
      .subscribe({
        next: () => {
          this.commonService.showSuccessMsg("Success");
          this.router.navigateByUrl('/configuration/chequemanagement');
        },
        error: err => {
          this.commonService.showErrorMessage(err);
          this.disablesavebutton = false;
          this.disablesaveactivebutton = false;
        }
      });
  }

  clear(): void {
    this.chequemanagementform.reset();
    this.gridData = [];
    this.resetChequeFields();
  }

}
