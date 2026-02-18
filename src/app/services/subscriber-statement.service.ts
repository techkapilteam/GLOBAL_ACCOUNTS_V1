import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SubscriberStatementService {
  constructor(private _commonService: CommonService) {}
  GetSubscriberGroups(caobranchschema: string): Observable<any> {

    const params = new HttpParams({
      fromObject: {
        localschema: this._commonService.getschemaname(),
        caoschema: caobranchschema
      }
    });

    return this._commonService.getAPI(
      '/ChitTransactions/ChitReports/getsubscribergroupcodes',
      params,
      'Yes'
    );
  }
  GetSubscriberExtractCodes(caobranchschema: string): Observable<any> {

    const params = new HttpParams({
      fromObject: {
        localschema: this._commonService.getschemaname(),
        caoschema: caobranchschema
      }
    });

    return this._commonService.getAPI(
      '/ChitTransactions/ChitReports/getsubscriberextractcodes',
      params,
      'Yes'
    );
  }
  
}
