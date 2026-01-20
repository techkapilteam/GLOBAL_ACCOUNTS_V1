import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-account',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {
  accountData = {
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    email: '',
    phone: '',
    alternatePhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    idType: '',
    idNumber: '',
    ssn: '',
    employmentStatus: '',
    employer: '',
    occupation: '',
    annualIncome: '',
    accountType: '',
    initialDeposit: '',
    branch: '',
    referenceSource: '',
    termsAccepted: false
  };

  onSubmit() {
    console.log('Account Data:', this.accountData);
    alert('Account creation form submitted!');
  }
}
