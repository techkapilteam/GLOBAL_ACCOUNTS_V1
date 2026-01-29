import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralReceiptCancelService {

  private baseUrl = 'YOUR_API_BASE_URL';  // <-- Change this

  constructor(private http: HttpClient) {}

  // GET RECEIPT NUMBER
  getReceiptNumber(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/receiptnumbers`);
  }

  // GET RECEIPT DATA
  getreceiptdata(receiptId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/receiptdata/${receiptId}`);
  }

  // SEARCH EMPLOYEE NAME
  getEmployeeName(term: string): Observable<any[]> {
    if (!term) {
      return of([]);
    }
    return this.http.get<any[]>(`${this.baseUrl}/employees?search=${term}`);
  }

  // SAVE CANCEL RECEIPT
  saveFixedDeposit(payload: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cancelreceipt`, payload);
  }
}

//saveFixedDeposit
//getreceiptdata
//getReceiptNumber
//getEmployeeName
