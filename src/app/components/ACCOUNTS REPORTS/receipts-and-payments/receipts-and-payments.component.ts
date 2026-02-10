import { Component, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgClass } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-receipts-and-payments',
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    BsDatepickerModule,
    NgClass
  ],
  templateUrl: './receipts-and-payments.component.html',
  styleUrl: './receipts-and-payments.component.css',
})


export class ReceiptsAndPaymentsComponent {
  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  FormReceiptsandPaymentsGroup!: FormGroup
  FormReceiptsandPaymentsGroup1!: FormGroup
  // private fb = inject(FormBuilder);


  disablesavebutton = signal(false);
  disablesavebutton1 = signal(false);

  savebutton = signal('Show');
  savebutton1 = signal('Show Extract');


  GroupCodes = signal([
    { groupcode: 'GRP001' },
    { groupcode: 'GRP002' },
    { groupcode: 'GRP003' }
  ]);

  ExtractCodes = signal([
    { pparticulars: 'Cash Receipt' },
    { pparticulars: 'Bank Payment' },
    { pparticulars: 'Journal Entry' }
  ]);


  // dpConfig = {
  //   dateInputFormat: 'DD-MM-YYYY',
  //   showWeekNumbers: false
  // };
  // dpConfig: Partial<BsDatepickerConfig> = {
  //   containerClass: 'theme-default',
  //   dateInputFormat: 'DD/MM/YYYY'
  // };




  constructor(private fb: FormBuilder) {
    this.dpConfig.maxDate = new Date();
    this.dpConfig.containerClass = 'theme-dark-blue';
    this.dpConfig.dateInputFormat = 'DD-MMM-YYYY';
    this.dpConfig.showWeekNumbers = false;
  }

  ngOnInit(): void {
    this.FormReceiptsandPaymentsGroup = this.fb.group({
      groupcode: [null, Validators.required],
      fromdate: new Date(),
      todate: new Date()
    }, { validators: this.dateRangeValidator() });

    this.FormReceiptsandPaymentsGroup1 = this.fb.nonNullable.group({
      extractcode: [null, Validators.required]
    });
  }
  // FormReceiptsandPaymentsGroup = this.fb.nonNullable.group({
  //   groupcode: ['', Validators.required],
  //   fromdate: new Date(),
  //   todate: new Date()
  // });

  // FormReceiptsandPaymentsGroup1 = this.fb.nonNullable.group({
  //   extractcode: ['', Validators.required]
  // });


  formErrors = signal<Record<string, string>>({});
  formErrors1 = signal<Record<string, string>>({});
  dateRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {

      const from = group.get('fromdate')?.value;
      const to = group.get('todate')?.value;

      if (!from || !to) return null;

      const fromTime = new Date(from).setHours(0, 0, 0, 0);
      const toTime = new Date(to).setHours(0, 0, 0, 0);

      return fromTime > toTime
        ? { dateRangeInvalid: true }
        : null;
    };
  }


  GroupChange(): void {
    console.log(
      'Group changed:',
      this.FormReceiptsandPaymentsGroup.controls['groupcode'].value
    );
  }

  Show(): void {
    this.formErrors.set({});
    this.FormReceiptsandPaymentsGroup.markAllAsTouched();

  if (this.FormReceiptsandPaymentsGroup.errors?.['dateRangeInvalid']) {
    alert('From Date should not be greater than To Date');
    return;
  }

  if (this.FormReceiptsandPaymentsGroup.invalid) return;

    if (this.FormReceiptsandPaymentsGroup.invalid) {
      this.formErrors.set({
        groupcode: 'Group Code is required'
      });
      return;
    }

    console.log('Receipts & Payments:', this.FormReceiptsandPaymentsGroup.getRawValue());
    alert('Receipts & Payments shown (Static)');
  }

  ShowExtract(): void {
    this.formErrors1.set({});

    if (this.FormReceiptsandPaymentsGroup1.invalid) {
      this.formErrors1.set({
        extractcode: 'Extract Code is required'
      });
      return;
    }

    console.log('Extract:', this.FormReceiptsandPaymentsGroup1.getRawValue());
    alert('Extract shown (Static)');
  }
}