import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { ContactmasterService } from '../../../services/Configuration/contactmaster.service';
import { CommonModule } from '@angular/common';
import { ValidationMessageComponent } from '../../validation-message/validation-message.component';
@Component({
  selector: 'app-address',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css',
})
// export class AddressComponent {

// }


export class AddressComponent implements OnInit {
  addressForm!:FormGroup

  countryDetails: any;
  stateDetails: any;
  districtDetails: any;
  addressformErrorMessage: any;
  addressdetails:any;
  Form:any;
  arrow!:boolean;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private _contacmasterservice: ContactmasterService, 
    private _commonService: CommonService 
  ) { }

  ngOnInit() {
    this.addressformErrorMessage={}
    this.addressForm = this.formBuilder.group({
    paddress1: [''],
    paddress2: [''],
    pcity: ['', Validators.required],
    pRecordid:[0],
    pCountryId: [''],
    pStateId: [''],
    pDistrictId: [0],
    pCountry: ['',Validators.required],
    pState: ['',Validators.required],
    pDistrict: ['',Validators.required],
    Pincode: ['', Validators.required],
    })
    this.BlurEventAllControll(this.addressForm);

    this.getCountryDetails()
  }
/**<-------(start) binding address data to form (start)------> */
  bindingdata(data:any)
  {
    console.log(data);
    debugger;
   if((data[0].pAddress1)=="")
  {
    this.addressForm.controls['paddress1'].clearValidators();
    this.addressForm.controls['paddress1'].updateValueAndValidity();
  }
  else{
    this.addressForm.controls['paddress1'].setValue(data[0].pAddress1)
  }
  if(data[0].pAddress2=="")
  {
    this.addressForm.controls['paddress2'].clearValidators();
    this.addressForm.controls['paddress2'].updateValueAndValidity();
  }
  else{
    this.addressForm.controls['paddress2'].setValue(data[0].pAddress2)
  }
  if(data[0].pPincode=="")
  {
    this.addressForm.controls['Pincode'].clearValidators();
    this.addressForm.controls['Pincode'].updateValueAndValidity();
  }
  else{
    this.addressForm.controls['Pincode'].setValue(data[0].pPincode)
  }
  if(data[0].pcity=="")
  {
    this.addressForm.controls['pcity'].clearValidators();
    this.addressForm.controls['pcity'].updateValueAndValidity();
  }
  else{
    this.addressForm.controls['pcity'].setValue(data[0].pcity)
  }
  if((data[0].pcountryid)==0)
  {
    this.addressForm.controls['pState'].clearValidators();
    this.addressForm.controls['pState'].updateValueAndValidity();

  }
  else{
    this._contacmasterservice.getSateDetails((data[0].pcountryid)).subscribe((json:any) => {
      this.stateDetails = json;
    })
    
  }
  // if((data[0].pcountryid)==0)
  // {
  //   this.addressForm.controls.pCountry.clearValidators();
  //   this.addressForm.controls.pCountry.updateValueAndValidity();

  // }
  // else{
  //   this._contacmasterservice.getCountryDetails().subscribe(json => {
  //     if (json != null) {
  //       this.countryDetails = json;
  //     }
  //   })
  // }
 
 
  if((data[0].pstateid==0))
  {
    this.addressForm.controls['pDistrict'].clearValidators();
    this.addressForm.controls['pDistrict'].updateValueAndValidity();
  }
  else{
    this._contacmasterservice.getDistrictDetails(data[0].pstateid).subscribe((json:any) => {
      this.districtDetails = json;
    })
  }
  if((data[0].pdistrictid==0))
  {
    this.addressForm.controls['pDistrict'].clearValidators();
    this.addressForm.controls['pDistrict'].updateValueAndValidity();
  }
 this.addressForm.controls['pStateId'].setValue(data[0].pstateid)
 this.addressForm.controls['pCountry'].setValue(data[0].pCountry)
 this.addressForm.controls['pDistrict'].setValue(data[0].pDistrict)
 this.addressForm.controls['pState'].setValue(data[0].pState)
 this.addressForm.controls['pDistrictId'].setValue(data[0].pdistrictid)
 this.addressForm.controls['pCountryId'].setValue(data[0].pcountryid)  
}
/**<-------(end) binding address data to form (end)------> */

/**<-------(start) binding company config address data to form (start)------> */
 bindingcompanydata(data:any)
 {
  if((data.pAddress1)=="")
  {
    this.addressForm.controls['paddress1'].clearValidators();
    this.addressForm.controls['paddress1'].updateValueAndValidity();
  }
  else{
    this.addressForm.controls['paddress1'].setValue(data.pAddress1)
  }
  if(data.pAddress2=="")
  {
    this.addressForm.controls['paddress2'].clearValidators();
    this.addressForm.controls['paddress2'].updateValueAndValidity();
  }
  else{
    this.addressForm.controls['paddress2'].setValue(data.pAddress2)
  }
  if(data.pPincode=="")
  {
    this.addressForm.controls['Pincode'].clearValidators();
    this.addressForm.controls['Pincode'].updateValueAndValidity();
  }
  else{
    this.addressForm.controls['Pincode'].setValue(data.pPinCode)
  }
  if(data.pCity=="")
  {
    this.addressForm.controls['pcity'].clearValidators();
    this.addressForm.controls['pcity'].updateValueAndValidity();
  }
  else{
    this.addressForm.controls['pcity'].setValue(data.pCity)
  }
  if((data.pCountryId)==0)
  {
    this.addressForm.controls['pState'].clearValidators();
    this.addressForm.controls['pState'].updateValueAndValidity();
  
  }
  else{
    this._contacmasterservice.getSateDetails((data.pCountryId)).subscribe((json:any) => {
      this.stateDetails = json;
    })
    
  }
  if((data.pCountryId)==0)
  {
    this.addressForm.controls['pCountry'].clearValidators();
    this.addressForm.controls['pCountry'].updateValueAndValidity();

  }
  else{
    this._contacmasterservice.getCountryDetails().subscribe((json:any) => {
      if (json != null) {
        this.countryDetails = json;
      }
    })
  }
 
 
  if((data.pStateId==0))
  {
    this.addressForm.controls['pDistrict'].clearValidators();
    this.addressForm.controls['pDistrict'].updateValueAndValidity();
  }
  else{
    this._contacmasterservice.getDistrictDetails(data.pStateId).subscribe((json:any) => {
      this.districtDetails = json;
    })
  }
  if((data.pDistrictId==0))
  {
    this.addressForm.controls['pDistrict'].clearValidators();
    this.addressForm.controls['pDistrict'].updateValueAndValidity();
  }

  this.addressForm.controls['pStateId'].setValue(data.pStateId)
  this.addressForm.controls['pCountry'].setValue(data.pCountry)
  this.addressForm.controls['pDistrict'].setValue(data.pDistrict)
  this.addressForm.controls['pState'].setValue(data.pState)
  this.addressForm.controls['pDistrictId'].setValue(data.pDistrictId)
  this.addressForm.controls['pCountryId'].setValue(data.pCountryId)
  
}
/**<-------(end) binding company config address data to form (end)------> */

/**<-------(start) update data of address form (append to form) (start)------> */
 editdata(data:any,formname:any) 
 {
  this.Form=formname
  if(this.Form=="companyconfig")
  {
    this.addressForm.controls['pRecordid'].setValue(data.pRecordId)
    this.bindingcompanydata(data)
  }
  else if(this.Form=="Bank")
  {
    debugger;
    this.addressForm.controls['pRecordid'].setValue(data[0].pRecordid)
    this.bindingdata(data)
  }
}
/**<-------(end) update data of address form (append to form) (end)------> */

/**<-------(start) checking validations based on form group (start)------> */
  checkValidations(group: FormGroup, isValid: boolean): boolean {  
    try {
      Object.keys(group.controls).forEach((key: string) => {       
        isValid = this.GetValidationByControl(group, key, isValid);
      })
    }
    catch (e) {
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
          this.addressformErrorMessage[key] = '';
          if (formcontrol.errors || formcontrol.invalid || formcontrol.touched || formcontrol.dirty) {            
            let lablename;
            lablename = (document.getElementById(key) as HTMLInputElement).title;
            let errormessage;            
            for (const errorkey in formcontrol.errors) {
              if (errorkey) {
                errormessage = this._commonService.getValidationMessage(formcontrol, errorkey, lablename, key, '');
                this.addressformErrorMessage[key] += errormessage + ' ';
                isValid = false;
              }
            }
          }
        }
      }
    }
    catch (e) {

      return false;
    }
    return isValid;
  }
  BlurEventAllControll(fromgroup: FormGroup) :any{
    try {
      Object.keys(fromgroup.controls).forEach((key: string) => {
        this.setBlurEvent(fromgroup, key);
      })
    }
    catch (e) {
      return false;
    }
  }
  setBlurEvent(fromgroup: FormGroup, key: string):any {
    try {
      let formcontrol;
      formcontrol = fromgroup.get(key);
      if (formcontrol) {
        if (formcontrol instanceof FormGroup) {
          this.BlurEventAllControll(formcontrol)
        }
        else {
          if (formcontrol.validator)
            fromgroup.get(key)?.valueChanges.subscribe((data) => { this.GetValidationByControl(fromgroup, key, true) })
        }
      }
    }
    catch (e) {
      return false;
    }
  }
  showErrorMessage(errormsg: string) {
    this._commonService.showErrorMessage(errormsg);
  }
/**<-------(end) checking validations based on form group (end)------> */
  pCountry_Change($event: any): void {

    const countryid = $event.target.value;
    
    if (countryid && countryid != '') {
          this.getSateDetails(countryid);
          const countryName = $event.target.options[$event.target.selectedIndex].text;
          this.addressForm['controls']['pCountry'].setValue(countryName);
    }
    else {
      this.stateDetails = [];
      this.districtDetails = [];
      this.addressForm['controls']['pStateId'].setValue('');
      this.addressForm['controls']['pDistrictId'].setValue('');      

    }
  }

 
  pState_Change($event: any): void {

    const stateid = $event.target.value;
    if (stateid && stateid != '') {
      const statename = $event.target.options[$event.target.selectedIndex].text;
      this.addressForm['controls']["pStateId"].value;
      if(statename)
       this.addressForm['controls']['pState'].setValue(statename);
      this.getDistrictDetails(stateid);

    }
    else {
      this.districtDetails = [];
      this.addressForm['controls']['pDistrictId'].setValue('');
    }

  }
  getCountryDetails(): void {
    this._contacmasterservice.getCountryDetails().subscribe((json:any) => {
      if (json != null) {
        this.countryDetails = json;
      }
    },
      (error:any) => {

        this.showErrorMessage(error);
      });
  }
  getSateDetails(countryid:any) {
    this._contacmasterservice.getSateDetails(countryid).subscribe((json:any) => {
      this.stateDetails = json;
    },
      (error:any) => {

        this.showErrorMessage(error);
      });
  }

  getDistrictDetails(stateid:any) {
    this._contacmasterservice.getDistrictDetails(stateid).subscribe((json:any) => {
      this.districtDetails = json;
    },
      (error:any) => {

        this.showErrorMessage(error);
      });
  }
  pDistrict_Change($event: any): void {

    const districtid = $event.target.value;

    if (districtid && districtid != '') {
      const districtname = $event.target.options[$event.target.selectedIndex].text;

      this.addressForm['controls']['pDistrict'].setValue(districtname);
    }
    else {
      this.addressForm['controls']['pDistrict'].setValue('');
    }

  }

  clear()
  {
    this.addressForm.reset();
    this.addressformErrorMessage={}
  }
  
}
