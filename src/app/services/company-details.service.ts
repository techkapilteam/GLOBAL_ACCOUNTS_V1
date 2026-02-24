import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyDetailsService {
  private http = inject(HttpClient);
  private commonService = inject(CommonService);

  GetCompanyData(): Observable<any> {
    const params = new HttpParams()
      .set('LocalSchema', this.commonService.getschemaname());

    return this.commonService.getAPI(
      '/Common/GetcompanyNameandaddressDetails',
      params,
      'YES'
    );
  }

  SaveTextData(data: any): Observable<any> {
    return this.commonService.postAPI1(
      '/Common/SaveTextData',
      data
    );
  }
  
}
