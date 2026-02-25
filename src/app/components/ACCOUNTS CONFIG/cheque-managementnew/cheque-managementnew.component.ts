import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { AccountingMasterService } from '../../../services/accounting-master.service';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-cheque-managementnew',
  imports: [CommonModule, ReactiveFormsModule, NgxDatatableModule, TableModule, ButtonModule, NgSelectModule],
  templateUrl: './cheque-managementnew.component.html',
  styleUrl: './cheque-managementnew.component.css',
})
export class ChequeManagementnewComponent implements OnInit {
  chequemanagementform!: FormGroup;

  bankdetails: any[] = [];
  gridData: any[] = [];

  recordid: any;
  selectedbank: any;

  totalcheques: any;
  noofcheque: any;
  fromcheqno: any;
  tocheqno: any;
  cheq: any;

  buttonname = 'Save';
  buttonnameactive = 'Save & Generate';

  disablesavebutton = false;
  disablesaveactivebutton = false;
  chequemanagementvalidations: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private accountingMasterService: AccountingMasterService
  ) { }





  ngOnInit() {
    this.chequemanagementform = this.fb.group({
      pBankId: [""],
      // pBankname: [null, Validators.required],
      bankName: ['', Validators.required],
      pNoofcheques: ["", Validators.required],
      pChequeto: ["", Validators.required],
      pChequefrom: ["", Validators.required],
      pChqegeneratestatus: [""],
      pStatusname: ["Active"],
      ptypeofoperation: ["CREATE"],
      pCreatedby: [this.commonService.getCreatedBy()],
      branchSchema: [this.commonService.getschemaname()],
      pipaddress: [this.commonService.getIpAddress()],
    });

    this.BlurEventAllControll(this.chequemanagementform);
    // this.accountingMasterService.GetBankDetails().subscribe((data:any) => {
    //   this.bankdetails = data;
    //   //console.log(this.bankdetails)
    // });

    this.accountingMasterService.GetBankNames(
      this.commonService.getschemaname(),
      this.commonService.getbranchname(),
      this.commonService.getCompanyCode(),
      this.commonService.getBranchCode(),

    )
      .subscribe({
        next: (res: any) => {
          // bankName
          console.log('data', res);

          this.bankdetails = res;

          console.log('SUCCESS:', res);
          alert('hello');
        },
        error: (err: any) => {
          console.log('ERROR:', err);
          alert('API Error');
        }
      });





  }
  validategridData(): boolean {
    debugger
    let isValid = true;

    // Clear previous validation messages
    this.chequemanagementvalidations = {};

    const noOfCheques = Number(this.chequemanagementform.controls['pNoofcheques'].value);
    const fromValue = this.chequemanagementform.controls['pChequefrom'].value;
    const toValue = this.chequemanagementform.controls['pChequeto'].value;

    // Required field validations
    if (!noOfCheques || noOfCheques <= 0) {
      this.chequemanagementvalidations['pNoofcheques'] = 'No of Cheques Required';
      isValid = false;
    }

    if (!fromValue) {
      this.chequemanagementvalidations['pChequefrom'] = 'Cheque From Required';
      isValid = false;
    }

    if (!toValue) {
      this.chequemanagementvalidations['pChequeto'] = 'Cheque To Required';
      isValid = false;
    }

    if (!isValid) {
      return false;
    }

    // Convert to numbers (remove commas if any)
    const fromcheq = Number(fromValue.toString().replace(/,/g, ''));
    const tocheq = Number(toValue.toString().replace(/,/g, ''));

    if (isNaN(fromcheq) || isNaN(tocheq)) {
      return false;
    }

    // Grid range validation
    const data = this.gridData ?? [];

    for (let i = 0; i < data.length; i++) {
      // if (this.selectedbank !== data[i].pBankname) {
      if (this.selectedbank !== data[i].bankName) {
        continue;
      }

      const existingFrom = Number(
        data[i].pChequefrom?.toString().replace(/,/g, '')
      );
      const existingTo = Number(
        data[i].pChequeto?.toString().replace(/,/g, '')
      );

      if (isNaN(existingFrom) || isNaN(existingTo)) {
        continue;
      }

      // Overlapping range check
      const isOverlap =
        fromcheq <= existingTo && tocheq >= existingFrom;

      if (isOverlap) {
        isValid = false;
        break;
      }
    }

    return isValid;
  }


  addtoGrid() {
    debugger;
    let validate = true;
    console.log("Form valid:", this.chequemanagementform.valid);

    const customValidation = this.checkValidations(this.chequemanagementform, validate);
    console.log("Custom validation result:", customValidation);
    if (this.checkValidations(this.chequemanagementform, validate)) {
      if (this.validategridData()) {
        this.accountingMasterService
          .GetExistingChequeCount(this.recordid, this.fromcheqno, this.tocheqno,
            this.commonService.getbranchname(), this.commonService.getCompanyCode(), this.commonService.getBranchCode(),
          )
          .subscribe((res) => {
            if (res) {
              debugger;
              //this.chequemanagementform['controls']['pCreatedby'].setValue(this._commonservice.pCreatedby)
              this.chequemanagementform["controls"]["pStatusname"].setValue(
                false
              );
              this.chequemanagementform["controls"][
                "ptypeofoperation"
              ].setValue("CREATE");
              //this.gridData.push(this.chequemanagementform.value)
              this.gridData = [
                ...this.gridData,
                this.chequemanagementform.value,
              ];
              this.totalcheques = "";
              this.fromcheqno = 0;
              this.tocheqno = 0;
              this.noofcheque = "";
              this.chequemanagementform["controls"]["pNoofcheques"].setValue(
                ""
              );
              this.chequemanagementform["controls"]["pChequefrom"].setValue("");
              this.chequemanagementform["controls"]["pChequeto"].setValue("");
              this.chequemanagementvalidations["pNoofcheques"] = "";
              this.chequemanagementvalidations["pChequefrom"] = "";
              this.chequemanagementvalidations["pChequeto"] = "";
            } else {
              this.commonService.showWarningMessage(
                "cheque No already exists"
              );
            }
          });
      }
    }
  }
  getrecordid(event: any) {
    debugger;
    // for (let i = 0; i < this.bankdetails.length; i++) {
    //   if (event.target.value == this.bankdetails[i].pBankname) {
    //     this.recordid = this.bankdetails[i].pRecordid;
    //     this.selectedbank = this.bankdetails[i].pBankname;
    //   }
    // }
    this.recordid = event.bankAccountId
    this.selectedbank = event.bankName

    // this.chequemanagementform.controls["pBankId"].setValue(this.recordid);
    this.gridData = [];
  }
  noofcheques(event: any) {
    this.totalcheques = 0;
    this.noofcheque = 0;
    this.cheq = 0;

    // Convert input to number safely
    const value = event?.target?.value;
    this.noofcheque = Number(value);

    if (isNaN(this.noofcheque) || this.noofcheque <= 0) {
      this.chequemanagementform.controls['pChequeto'].setValue('');
      return;
    }

    // If only 1 cheque
    if (this.noofcheque === 1) {
      this.chequemanagementform.controls['pChequeto'].setValue(this.fromcheqno);
      return;
    }

    // Calculate total cheques
    this.totalcheques = this.noofcheque - 1;
    this.cheq = this.totalcheques;

    const fromCheque = Number(this.chequemanagementform.controls['pChequefrom'].value);

    if (!isNaN(fromCheque)) {
      this.tocheqno = fromCheque + this.cheq;
      this.chequemanagementform.controls['pChequeto'].setValue(this.tocheqno);
    }
  }

  fromchequeno(event: any) {
    this.fromcheqno = event.target.value;
    if (event.target.value == "") {
      this.chequemanagementform.controls["pChequeto"].setValue("");
    } else if (this.noofcheque == 1) {
      this.chequemanagementform.controls["pChequeto"].setValue(this.fromcheqno);
    } else if (
      this.totalcheques == 0 ||
      this.totalcheques == undefined ||
      this.totalcheques == -1
    ) {
      this.chequemanagementform.controls["pChequeto"].setValue("");
    } else {
      this.fromcheqno = event.target.value;
      let ps = this.totalcheques;
      if (ps !== null && ps !== undefined && ps !== -1) {

        const psValue = ps.toString();

        if (psValue.includes(',')) {
          this.cheq = Number(this.functiontoRemoveCommas(psValue));
        } else {
          this.cheq = Number(psValue);
        }
      }

      this.tocheqno = +this.fromcheqno + this.cheq;
      this.chequemanagementform.controls["pChequeto"].setValue(this.tocheqno);
    }

    //console.log(this.tocheqno)
  }
  public functiontoRemoveCommas(value: any) {
    let a = value.split(",");
    let b = a.join("");
    let c = b;
    return c;
  }
  checkValidations(group: FormGroup, validate: boolean): boolean {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        validate = this.GetValidationByControl(group, key, validate);
      });
    } catch (e: any) {
      this.showErrorMessage(e);
      return false;
    }
    return validate;
  }
  GetValidationByControl(
    formGroup: FormGroup,
    key: string,
    validate: boolean
  ): boolean {
    try {
      let formcontrol;
      formcontrol = formGroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.checkValidations(formcontrol, validate);
        } else if (formcontrol.validator) {



          if (!this.chequemanagementvalidations) {
            this.chequemanagementvalidations = {};
          }
          this.chequemanagementvalidations[key] = "";
          if (
            formcontrol.errors ||
            formcontrol.invalid ||
            formcontrol.touched ||
            formcontrol.dirty
          ) {
            // let lablename;
            // lablename = (document.getElementById(key) as HTMLInputElement)
            //   .title;



            const element = document.getElementById(key) as HTMLInputElement | null;
            const lablename = element?.title || key;
            let errormessage;
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this.commonService.getValidationMessage(
                  formcontrol,
                  errorkey,
                  lablename,
                  key,
                  ""
                );
                this.chequemanagementvalidations[key] += errormessage + " ";
                validate = false;
              }
            }
          }
        }
      }
    } catch (e: any) {
      this.showErrorMessage(e);
      return false;
    }
    return validate;
  }
  showErrorMessage(errormsg: string) {
    this.commonService.showErrorMessage(errormsg);
  }

  BlurEventAllControll(fromgroup: FormGroup): any {
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      });
    } catch (e: any) {
      this.showErrorMessage(e);
      return false;
    }
  }
  setBlurEvent(fromgroup: FormGroup, key: string): any {
    try {
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol);
        } else {
          if (formcontrol.validator)
            fromgroup.get(key)?.valueChanges.subscribe((data) => {
              this.GetValidationByControl(fromgroup, key, true);
            });
        }
      }
    } catch (e: any) {
      this.showErrorMessage(e);
      return false;
    }
  }
  removeHandler(event: any) {
    this.gridData.splice(event.rowIndex, 1);
  }
  save(type: any) {
    let validate = true;
    let isActive;
    debugger;
    if (this.gridData.length > 0) {
      if (type == "Active") {
        this.disablesaveactivebutton = true;
        this.buttonnameactive = "Processing";
        isActive = "true";
      } else {
        this.disablesavebutton = true;
        this.buttonname = "Processing";
        isActive = "false";
      }

      this.chequemanagementform.controls['pCreatedby'].setValue(
        this.commonService.getCreatedBy()
      );
      this.chequemanagementform.controls['branchSchema'].setValue(
        this.commonService.getschemaname()
      );
      this.chequemanagementform.controls['pipaddress'].setValue(
        this.commonService.getIpAddress()
      );

      this.chequemanagementform["controls"]["pChqegeneratestatus"].setValue(
        isActive
      );
      let chequemanagement = { lstChequemanagementDTO: this.gridData };
      let chequemanagementdata = Object.assign(
        this.chequemanagementform.value,
        chequemanagement
      );

      //console.log(chequemanagementdata)
      let data = JSON.stringify(chequemanagementdata);
      this.accountingMasterService.SaveChequeManagement(data).subscribe(
        (saveddata) => {
          //debugger;
          if (saveddata) {
            //debugger
            this.disablesaveactivebutton = false;
            this.disablesavebutton = false;
            this.commonService.showSuccessMessage();
            this.router.navigateByUrl("/configuration/chequemanagement");
          }
        },
        (error) => {
          this.commonService.showErrorMessage(error);
          this.disablesaveactivebutton = false;
          this.disablesavebutton = false;
        }
      );
      //this.chequemanagementform.reset();
      //this.gridData=[]
    }
  }


  clear() {
    this.chequemanagementform.reset();
    this.gridData = [];
    this.chequemanagementform["controls"]["pNoofcheques"].setValue("");
    this.chequemanagementform["controls"]["pChequefrom"].setValue("");
    this.chequemanagementform["controls"]["pChequeto"].setValue("");
    this.totalcheques = "";
    this.fromcheqno = 0;
    this.tocheqno = 0;
    this.noofcheque = "";
    this.chequemanagementvalidations = {};
  }

}
