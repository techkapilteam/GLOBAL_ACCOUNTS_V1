import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

//import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule, ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
// import { PageCriteria } from '../Models/pageCriteria';
import { PageCriteria } from '../../../Models/pageCriteria';
// import { ValidationMessage } from "../shared/validation-message/validation-message";
@Component({
  selector: 'app-tds-jv',
 imports: [
    CommonModule,
    ReactiveFormsModule,
    //NgSelectModule,
    NgxDatatableModule,
    BsDatepickerModule,
   
    // ValidationMessage
],
  standalone: true,
  templateUrl: './tds-jv.component.html',
  styleUrl: './tds-jv.component.css',
})

export class TdsJvComponent {
  tdsJvDetailsForm!: FormGroup;
  formValidationMessages: any = {};
  calendarYearData: any = [];
  calendarMonthData: any = [];
  currencysymbol: any;
  tdsJvDetailsGrid: any = [];
  today!: string;
  splidate: any = [];
  MonthName: any;
  CalendarYear: any;
  showEmployeeGrid: any = false;
  employeeList: any = [];
  contactsSelected: any = [];
  totalContactsList!: any[];
  pageeventstatus: any = false;
  controleventstatus: any = false;
  dropDownControlName: any = '';
  dropDownDataSearchLength: any = 2;
  BranchId: any;
  CalendarId: any;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  public dpConfig1: Partial<BsDatepickerConfig> = new BsDatepickerConfig();
  disabletransactiondate = false;
  allRowsSelected: any;
  MonthId: any;
  pageCriteria!: PageCriteria;
  public pageSize = 10;
  employeeCode: any;
  totalcreditamount: any = 0;
  totaldebitamount: any = 0;
  disablesavebutton = false;
  savebutton = "Save";
  disablesavebutton1 = false;
  savebutton1 = "Show";
  jvType: any;
  jvdetailslist: any = [];
  ledgeraccountslist: any;
  tdsledgeraccountslist: any;
  selected1 = [];
  notselected: any = "btn btn-default border";
  selected: string = "btn btn-primary text-white";
  cmonth: any;
  pmonth: any;
  //employee: any;
  dataisempty: any;
  showhidetable: any;
  isExists: any;
  selectedValues = [];
  // private _commonService: any;
  // private _AccountingTransactionsService: any;
  // private _employeeAttendService: any;
  JvDetailsGrid: any;
  constructor(private _FormBuilder: FormBuilder,
    //  private _commonService: CommonService,
    // private sscAgendaService: SscagendsService, 
    // private _employeeAttendService: HrmseployeeattendanceService, 
    private datePipe: DatePipe,
    //  private _hrmsPayrollprocess: HrmspayrollprocessService, 
    //  private _AccountingTransactionsService: AccountingTransactionsService
  ) {
   // this.currencysymbol = this._commonService.datePickerPropertiesSetup("currencysymbol");
    this.pageCriteria = new PageCriteria()
    // this.dpConfig1.containerClass = this._commonService.datePickerPropertiesSetup('containerClass');;
    // this.dpConfig1.dateInputFormat = this._commonService.datePickerPropertiesSetup('dateInputFormat');;
    this.dpConfig1.maxDate = new Date();
    // // this.dpConfig1.showWeekNumbers = this._commonService.datePickerPropertiesSetup('showWeekNumbers');;
    // if (this._commonService.comapnydetails != null)
    //   //this.disabletransactiondate = this._commonService.comapnydetails.pdatepickerenablestatus;
    //   if (this._commonService.comapnydetails.pdatepickerenablestatus || this._commonService.comapnydetails.pfinclosingjvallowstatus) {
    //     this.disabletransactiondate = true
    //   }
    //   else {
    //     this.disabletransactiondate = false
    //   }
  }

  ngOnInit(): void {
    // this.BranchId = this._commonService.comapnydetails.pbranchid;
    this.cmonth = this.selected;
    this.pmonth = this.notselected;
    this.showhidetable = false;
    this.dataisempty = false;
    this.allRowsSelected = false;
    this.bindformControls();
    this.setPageModel();
    this.BindCalendarYear();
    this.gettdsaccountsledger();
    // this.jvdetailslist = this._commonService.hrmsjvtypes;
    this.getCurrentMonthdetails();
    this.getaccountsledger();
    this.BlurEventAllControll(this.tdsJvDetailsForm);
    let date = new Date();
    this.tdsJvDetailsForm['controls']['preceiptdate'].setValue(date);

  }
  //initializing page model
  setPageModel() {
    // this.pageCriteria.pageSize = this._commonService.pageSize;
    this.pageCriteria.offset = 0;
    this.pageCriteria.pageNumber = 1;
    this.pageCriteria.footerPageHeight = 50;
  }

  //for ngx table footer page navigation purpose
  onFooterPageChange(event: any): void {
    this.pageCriteria.offset = event.page - 1;
    if (this.pageCriteria.totalrows < event.page * this.pageCriteria.pageSize) {
      this.pageCriteria.currentPageRows = this.pageCriteria.totalrows % this.pageCriteria.pageSize;
    }
    else {
      this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
    }
  }

  gettdsaccountsledger() {
    debugger;
    // this._AccountingTransactionsService.GettdsLedgerAccountsList('TDS JV').subscribe((json: null) => {
    //   debugger;
    //   let JSONDATA = json
    //   if (json != null) {
    //     this.tdsledgeraccountslist = json;
    //   }
    // },
    //   (error: any) => {
    //     this._commonService.showErrorMessage(error);
    //   });
  }

  getaccountsledger() {
    debugger;
    // this._AccountingTransactionsService.GettdsLedgerAccountsList('PAYMENT VOUCHER').subscribe((json: null) => {
    //   debugger;
    //   let JSONDATA = json
    //   if (json != null) {
    //     this.ledgeraccountslist = json;
    //   }
    // },
    //   (error: any) => {
    //     this._commonService.showErrorMessage(error);
    //   });
  }

  bindformControls() {
    this.tdsJvDetailsForm = this._FormBuilder.group({

      pPeriodType: [null, Validators.required],
      DebitLedger: [null, Validators.required],
      pCalendarMonth: [null, Validators.required],
      CreditLedger: [null, Validators.required],
      preceiptdate: [''],
    })
  }
  click_jvtype(event: { value: any; } | undefined) {
    debugger;

    if (event == undefined) {
      this.tdsJvDetailsGrid = [];
    }
    else {
      let jv_type = event.value;
      this.jvType = jv_type;
    }
  }

  gettdsjvdetails() {
    debugger;
    //this.employee = 'All';
    this.selected1 = [];
    this.selectedValues = [];
    this.totaldebitamount = 0;
    this.totalcreditamount = 0;
    if (this.checkValidations(this.tdsJvDetailsForm, true)) {

      let creditledger = this.tdsJvDetailsForm.controls['CreditLedger'].value;
      let monthYear = this.MonthName.toUpperCase();
      let debitledger = this.tdsJvDetailsForm.controls['DebitLedger'].value;

      // if (this.checkValidations(this.tdsJvDetailsForm, true)) {
      if (monthYear != '') {
        this.savebutton1 = 'Processing';
        this.disablesavebutton1 = true;
        // this._AccountingTransactionsService.GettdsJVDetails(creditledger, monthYear, debitledger).subscribe((res: null) => {
        //   debugger;
        //   if (res != null)
        //     this.tdsJvDetailsGrid = res;
        //   if (this.tdsJvDetailsGrid.length > 0) {
        //     this.showhidetable = true;
        //     this.dataisempty = false;
        //     //    this.totaldebitamount = this.tdsJvDetailsGrid.reduce((sum, c) => sum + parseFloat(c.debit_amount), 0);
        //     this.totalcreditamount = this.tdsJvDetailsGrid.reduce((sum: number, c: { credit_amount: string; }) => sum + parseFloat(c.credit_amount), 0);

        //     this._AccountingTransactionsService.GetTDSJVDetailsDuplicateCheck(monthYear, debitledger).subscribe((result: number) => {
        //       debugger;
        //       if (result > 0) {
        //         this.isExists = false;
        //       }
        //       else {
        //         this.isExists = true;
        //       }
        //     })
        //     // custom page navigation
        //     this.pageCriteria.totalrows = this.tdsJvDetailsGrid.length;
        //     this.pageCriteria.TotalPages = 1;
        //     if (this.pageCriteria.totalrows > 10)
        //       this.pageCriteria.TotalPages = parseInt((this.pageCriteria.totalrows / 10).toString()) + 1;
        //     if (this.tdsJvDetailsGrid.length < this.pageCriteria.pageSize) {
        //       this.pageCriteria.currentPageRows = this.tdsJvDetailsGrid.length;
        //     }
        //     else {
        //       this.pageCriteria.currentPageRows = this.pageCriteria.pageSize;
        //     }
        //   }
        //   else {
        //     this.showhidetable = false;
        //     this.dataisempty = true;
        //   }
        //   this.savebutton1 = 'Show';
        //   this.disablesavebutton1 = false;
        // })
      }
      else {
        this.tdsJvDetailsGrid = null;
        this.showhidetable = false;
        this.dataisempty = true;
      }
    }
    else {
      this.tdsJvDetailsGrid = null;
      this.showhidetable = false;
      this.dataisempty = false;
    }

  }

  getPreviousMonthdetails() {
    debugger;
    this.formValidationMessages = {};
    this.pmonth = this.selected;
    this.cmonth = this.notselected;
    let currentdate = new Date();
    let previousMonth = new Date();
    previousMonth.setMonth(currentdate.getMonth() - 1);

    // this.today = this.datePipe.transform(previousMonth, "dd-MMM-yyyy");
    this.splidate = this.today.split('-');
    this.MonthName = this.splidate[1] + '-' + this.splidate[2];
    let year = parseInt(this.splidate[2]) - 1;
    this.CalendarYear = year + '-' + this.splidate[2];

    this.tdsJvDetailsForm.controls['pPeriodType'].setValue(null);
    this.tdsJvDetailsForm.controls['pCalendarMonth'].setValue(null);
    // this.GetValidationByControl(this.tdsJvDetailsForm,'pPeriodType',true);
    // this.GetValidationByControl(this.tdsJvDetailsForm,'pCalendarMonth',true);
    let periodtypecontrol = this.tdsJvDetailsForm.controls['pPeriodType'];
    let Monthcontrol = this.tdsJvDetailsForm.controls['pCalendarMonth'];

    periodtypecontrol.clearValidators();
    Monthcontrol.clearValidators();
  }

  clearJVDetails() {
    this.clearAllFields();
  }

  BindCalendarYear() {
    // this._employeeAttendService.GetCalendarYear().subscribe((res: null) => {
    //   if (res != null) {
    //     this.calendarYearData = res;

    //   }
    // })
  }

  BindCalendarMonth() {
    debugger;
    this.calendarMonthData = [];
    let employeecontactid = ""
    // this._employeeAttendService.GetTDSJVCalendarYearMonth(this.CalendarId).subscribe((res: null) => {
    //   if (res != null) {
    //     this.calendarMonthData = res;

    //   }
    // })
    let pCalendarMonthControl = <FormGroup>this.tdsJvDetailsForm.controls['pCalendarMonth'];
    pCalendarMonthControl.setValidators([Validators.required]);
    pCalendarMonthControl.updateValueAndValidity;
    // this.GetValidationByControl(this.tdsJvDetailsForm,'pCalendarMonth',true);
    // this.GetValidationByControl(this.tdsJvDetailsForm,'pCalendarMonth',true);
    this.tdsJvDetailsForm.controls['pCalendarMonth'].setValue(null);
  }

  getCurrentMonthdetails() {
    debugger;
    this.formValidationMessages = {};
    this.pmonth = this.notselected;
    this.cmonth = this.selected;
    // this.today = this.datePipe.transform(new Date(), "dd-MMM-yyyy");
    this.splidate = this.today.split('-');
    this.MonthName = this.splidate[1] + '-' + this.splidate[2];
    let year = parseInt(this.splidate[2]) - 1;
    this.CalendarYear = year + '-' + this.splidate[2];

    this.tdsJvDetailsForm.controls['pPeriodType'].setValue(null);
    this.tdsJvDetailsForm.controls['pCalendarMonth'].setValue(null);
    // this.GetValidationByControl(this.tdsJvDetailsForm,'pPeriodType',true);
    // this.GetValidationByControl(this.tdsJvDetailsForm,'pCalendarMonth',true);
    let periodtypecontrol = this.tdsJvDetailsForm.controls['pPeriodType'];
    let Monthcontrol = this.tdsJvDetailsForm.controls['pCalendarMonth'];

    // periodtypecontrol.clearValidators();
    // Monthcontrol.clearValidators();
  }
  CalendarYear_change(event: any) {
    debugger;
    this.pmonth = this.notselected;
    this.cmonth = this.notselected;
    if (event != undefined) {
      this.CalendarId = event.pCalenderPeriodId;
      this.CalendarYear = event.pPeriodType;
    }
    this.MonthName = '';
    this.tdsJvDetailsForm.controls['pCalendarMonth'].setValue(null);


    if (event != undefined) {
      this.BindCalendarMonth();
      this.formValidationMessages = [];
    }
    else {
      this.calendarMonthData = [];
      this.formValidationMessages = [];
      this.tdsJvDetailsGrid = [];
      let Monthcontrol = this.tdsJvDetailsForm.controls['pCalendarMonth'];
      //Monthcontrol.clearValidators();
    }
  }

  CalendarYearMOnth_change(event: any) {
    debugger;

    this.MonthId = event.pCalenderPeriodDetailsId;
    this.MonthName = event.pCalendarMonth;
    //this.GetPayRollProcessDetails("");
  }

  //search 
  ContactGridRowSelect(selected: any) {
    debugger;
    try {
      let ContactData = selected[0];

      this.employeeCode = ContactData.pEmployeecode;
      this.tdsJvDetailsForm.controls['pEmployeecode'].setValue(ContactData.pEmployeeName);
      console.log(this.employeeCode);
    }
    catch (error) {
     // this._commonService.exceptionHandlingMessages('SSC Agenda', 'ContactGridRowSelect', error);
    }
  }

  onSelect(selected: any) {
    // console.log('Select Event', selected, this.selected1);
    debugger;
    //this.selected.splice(0, this.selected1.length);
    this.selected1 = selected;
    // this.totaldebitamount = this.selected1.reduce((sum, c) => sum + parseFloat(c.debit_amount), 0);
    //  if(this.selected1.length === this.tdsJvDetailsGrid.length){
    //   this.totalcreditamount = this.tdsJvDetailsGrid.reduce((sum, c) => sum + parseFloat(c.credit_amount), 0)-;
    //  }else
    // this.totalcreditamount = this.selected1.reduce((sum, c) => sum + parseFloat(c.debit_amount), 0);
    // this.selectedValues = [...selected];
  }

  onActivate(event: any) {
    console.log('Activate Event', event);
  }

  saveJVDetails() {
    try {
      this.disablesavebutton = true;
      this.savebutton = 'Processing';

      debugger;
      //this.tdsJvDetailsGrid = this.selected1;
      let isValid = true;
      if (this.checkValidations(this.tdsJvDetailsForm, isValid)) {
        let creditrows = 0;
        let debitrows = 0;
        // if (this.selectedValues.length > 0) {
        //   for (let i = 0; i < this.selectedValues.length; i++){
        //     if(this.selectedValues[i].account_trans_type == "C"){
        //       creditrows = creditrows + 1;
        //     }
        //     else if(this.selectedValues[i].account_trans_type == "D"){
        //       debitrows = debitrows + 1;
        //     }
        //   }
        //   if(creditrows > 0 && debitrows > 0){
        //   if (confirm("Do you want to save ?")) {
        //     debugger;
        //     for (let i = 0; i < this.selectedValues.length; i++) {
        //       if(this.selectedValues[i].account_trans_type == "C"){
        //         this.selectedValues[i].credit_amount = this.totalcreditamount;
        //       }
        //       this.selectedValues[i].payroll_month = this.MonthName;
        //       this.selectedValues[i].transaction_date = this._commonService.getFormatDateNormal(this.tdsJvDetailsForm.controls.preceiptdate.value);
        //       this.selectedValues[i].jv_type = this.tdsJvDetailsForm.controls.DebitLedger.value;
        //       // this.tdsJvDetailsGrid[i].employee_code = this.tdsJvDetailsGrid[i].pEmployeeId;
        //       this.selectedValues[i].schemaname = this._commonService.getschemaname();
        //       this.selectedValues[i].pCreatedby = this._commonService.getcreatedby();
        //       this.selectedValues[i].pipaddress = this._commonService.getipaddress();
        //     }
        //     debugger;
        //     let formdata = JSON.stringify(this.selectedValues);
        //     console.log(formdata)
        //     this._AccountingTransactionsService.saveTDSjvdetails(formdata).subscribe((res: null) => {
        //       if (res != null) {
        //         this._commonService.showSuccessMessage();
        //         this.clearAllFields();
        //         this.disablesavebutton = false;
        //         this.savebutton = 'Save';
        //       }
        //     },(error: any)=>{
        //       this.disablesavebutton = false;
        //       this.savebutton = 'Save';
        //     });
        //   }
        //   else {
        //     this.disablesavebutton = false;
        //     this.savebutton = 'Save';
        //   }
        // }
        // else{
        //   this._commonService.showWarningMessage("Please Select Atleast One Debit And One Credit Rows");
        //   this.disablesavebutton = false;
        //   this.savebutton = 'Save';
        //  } 
        // }
        // else {
        //   this.disablesavebutton = false;
        //   this.savebutton = 'Save';
        // }
      }
      else {
        this.disablesavebutton = false;
        this.savebutton = 'Save';
        this.allRowsSelected = false;
      }
    }
    catch (error) {
      this.disablesavebutton = false;
      this.savebutton = 'Save';
      // this._commonService.exceptionHandlingMessages('JVDetails', 'SavePayrollProcess', error);
    }
  }
  ClearAll() {
    this.clearAllFields();
  }
  clearAllFields() {
    this.bindformControls();
    this.tdsJvDetailsGrid = [];
    this.calendarMonthData = [];
    this.formValidationMessages = {};
    let date = new Date();
    this.tdsJvDetailsForm['controls']['preceiptdate'].setValue(date);
    this.MonthName = "";
    this.CalendarYear = "";
    this.getCurrentMonthdetails();
    this.employeeList = [];
    this.employeeCode = "All";
    this.selected1 = [];
  }
  ///-------------------Validations
  BlurEventAllControll(fromgroup: FormGroup) :void{

    try {

      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })

    }
    catch (error) {
      // this._commonService.exceptionHandlingMessages('JVDetails', 'BlurEventAllControll', error);

      //return false;
    }
  }
  setBlurEvent(fromgroup: FormGroup, key: string):void {

    try {
      let formcontrol;

      formcontrol = fromgroup.get(key);


      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {

          this.BlurEventAllControll(formcontrol)
        }
        else {
          const control = fromgroup.get(key);
          if (control && control.validator) {
            control.valueChanges.subscribe(() => {
              this.GetValidationByControl(fromgroup, key, true);
            });
          }
        }
      }

    }
    catch (error) {
      // this._commonService.exceptionHandlingMessages('JVDetails', 'setBlurEvent', error);

     // return false;
    }
  }

  checkValidations(group: FormGroup, isValid: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        isValid = this.GetValidationByControl(group, key, isValid);
        if (!isValid)
          console.log(key + ' : ' + isValid);
      })

    }
    catch (error) {
      // this._commonService.exceptionHandlingMessages('TDSJVDetails', 'checkValidations', error);

      // return false;
      // this._commonService.showErrorMessage(error);
      return false;
    }
    return isValid;
  }
  GetValidationByControl(formGroup: FormGroup, key: string, isValid: boolean): boolean {
    try {
      let formcontrol;

      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {

          this.checkValidations(formcontrol, isValid)
        }
        else if (formcontrol.validator) {
          this.formValidationMessages[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {
            let lablename;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                lablename = (document.getElementById(key) as HTMLInputElement).title;
                // errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.formValidationMessages[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (error) {
      // this._commonService.exceptionHandlingMessages('JV Details', 'GetValidationByControl', error);
      // this._commonService.showErrorMessage(key);
      return false;
    }
    return isValid;
  }

  export(): void {
    let rows: { Particulars: any; "Debit Amount": number; "Credit Amount": number; }[] = [];
    this.tdsJvDetailsGrid.forEach((element: { debit_amount: number; credit_amount: number; particulars: any; }) => {
      debugger;
      let pdebitamount = 0;
      let pcreditamount = 0;


      if (element.debit_amount != 0) {
        //pdebitamount = this._commonService.currencyformat(element.debit_amount);
        //pdebitamount = this._commonService.convertAmountToPdfFormat(pdebitamount);
        pdebitamount = element.debit_amount;
      }
      if (element.credit_amount != 0) {
        //pcreditamount = this._commonService.currencyformat(element.credit_amount);
        //pcreditamount = this._commonService.convertAmountToPdfFormat(pcreditamount);
        pcreditamount = element.credit_amount;
      }

      let temp;
      let dataobject;
      dataobject = {
        "Particulars": element.particulars,
        "Debit Amount": pdebitamount,
        "Credit Amount": pcreditamount

      }
      rows.push(dataobject);
    });
    // this._commonService.exportAsExcelFile(rows, 'TDS-Jv');

  }
}