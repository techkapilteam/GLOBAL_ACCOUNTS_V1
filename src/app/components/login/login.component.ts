import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyDetailsService } from 'src/app/services/company-details.service';

// PrimeNG
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { environment } from 'src/app/envir/environment.prod';

interface CompanyCode {
  tbl_mst_chit_company_configuration_id: number;
  company_code: string;
}

interface BranchCode {
  tbl_mst_branch_configuration_id: number;
  branch_code: string;
}

// ── Update field names here if your API returns different keys ──
interface LoginResponse {
  token:    string;
  username: string;   // change to e.g. user_name if your API uses that
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  step = 1;

  companyOptions: { label: string; value: number }[] = [];
  branchOptions:  { label: string; value: string }[] = [];
  companyCodes:   CompanyCode[] = [];

  selectedCompanyId:   number | null = null;
  selectedCompanyCode  = '';
  selectedBranchCode   = '';

  username = '';
  password = '';

  errorMessage = '';
  loading      = false;

  private apiBase = environment.apiURL;

  constructor(
    private http:           HttpClient,
    private router:         Router,
    private authService:    AuthService,
    private messageService: MessageService,
    private companyService: CompanyDetailsService
  ) {}

  ngOnInit(): void {
    // If already logged in, go straight to dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loadCompanyCodes();
  }

  // ── Step 1: Load Companies ────────────────────────────────────────────────

  loadCompanyCodes(): void {
    this.http.get<CompanyCode[]>(`${this.apiBase}/Accounts/GetUsersCompanyCodes`)
      .subscribe({
        next: (data) => {
          this.companyCodes   = data;
          this.companyOptions = data.map(c => ({
            label: c.company_code,
            value: c.tbl_mst_chit_company_configuration_id
          }));
        },
        error: () => this.showToast('error', 'Error', 'Failed to load company codes')
      });
  }

  // ── Step 1: Company change → load branches ────────────────────────────────

  onCompanyChange(): void {
    this.branchOptions      = [];
    this.selectedBranchCode = '';
    this.errorMessage       = '';

    if (!this.selectedCompanyId) return;

    const found = this.companyCodes.find(
      c => c.tbl_mst_chit_company_configuration_id === this.selectedCompanyId
    );
    this.selectedCompanyCode = found?.company_code ?? '';

    this.loading = true;

    this.http.get<BranchCode[]>(
      `${this.apiBase}/Accounts/GetUsersBranchCodes?companyConfigurationId=${this.selectedCompanyId}`
    ).subscribe({
      next: (data) => {
        this.branchOptions = data.map(b => ({ label: b.branch_code, value: b.branch_code }));
        this.loading = false;
      },
      error: () => {
        this.showToast('error', 'Error', 'Failed to load branch codes');
        this.loading = false;
      }
    });
  }

  // ── Step 1: Next ──────────────────────────────────────────────────────────

  onStep1Next(): void {
    this.errorMessage = '';
    if (!this.selectedCompanyId)  { this.errorMessage = 'Please select a company.'; return; }
    if (!this.selectedBranchCode) { this.errorMessage = 'Please select a branch.';  return; }
    this.step = 2;
  }

  // ── Step 2: Login → POST /api/Accounts/login ─────────────────────────────

  onLogin(): void {
    this.errorMessage = '';

    if (!this.username.trim()) { this.errorMessage = 'Please enter your username.'; return; }
    if (!this.password.trim()) { this.errorMessage = 'Please enter your password.'; return; }

    this.loading = true;

    this.http.post<LoginResponse>(`${this.apiBase}/Accounts/login`, {
      user_name:   this.username.trim(),
      password:    this.password.trim(),
      companyCode: this.selectedCompanyCode,
      branchCode:  this.selectedBranchCode
    }).subscribe({
      next: (response) => {
        this.loading = false;

        // ── Defensive: normalise username field in case API returns user_name ──
        const resolvedUsername: string =
          (response as any).user_name ?? response.username ?? this.username.trim();

        // ── Store token + username + companyCode + branchCode in sessionStorage ──
        this.authService.setSession(
          response.token,
          resolvedUsername,
          this.selectedCompanyCode,
          this.selectedBranchCode
        );

        // ── Verify storage (remove in production if desired) ──
        console.log('[Login] Session stored:');
        console.log('  token       =>', sessionStorage.getItem('token'));
        console.log('  username    =>', sessionStorage.getItem('username'));
        console.log('  companyCode =>', sessionStorage.getItem('companyCode'));
        console.log('  branchCode  =>', sessionStorage.getItem('branchCode'));
        console.log('  isLoggedIn  =>', sessionStorage.getItem('isLoggedIn'));

        // ── Store company details ──
        this.companyService.GetCompanyData().subscribe({
          next: (companyData: any) => {
            if (companyData?.length > 0) {
              sessionStorage.setItem('CompanyDetails', JSON.stringify(companyData[0]));
            }
          }
        });

        this.showToast('success', 'Login Successful', `Welcome back, ${resolvedUsername}!`);

        // ── Navigate after toast renders ──
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },

      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.errorMessage = 'Invalid username or password.';
          this.showToast('error', 'Login Failed', 'Invalid credentials. Please try again.');
        } else {
          this.errorMessage = 'Login failed. Please try again.';
          this.showToast('error', 'Error', 'Something went wrong. Please try again.');
        }
      }
    });
  }

  showToast(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }
}