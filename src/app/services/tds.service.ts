import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class TdsService {
  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {}

  getTdsReport(
    fromDate: string,
    toDate: string,
    sectionName: string
  ): Observable<any> {

    const params = new HttpParams()
      .set('FromDate', fromDate)
      .set('ToDate', toDate)
      .set('SectionName', sectionName);

    return this.commonService.getAPI('/TDS/GetTdsReportDetails', params, 'YES');
  }
  getTdsSectionDetails(): Observable<any> {
  return this.commonService
    .getAPI('/Tds/getTdsSectionNo', '', 'NO')
    .pipe(
      catchError((error: any) => {
        this.commonService.showErrorMessage(error);
        return of(null);
      })
    );
}
  
}
