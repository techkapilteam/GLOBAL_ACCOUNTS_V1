import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SubscriberConfigurationService {
  constructor(private _commonService: CommonService) {}

  GetSubInterducedDetails(searchtype: string): Observable<any[]> {
    const params = new HttpParams()
      .set('localSchema', this._commonService.getschemaname())
      .set('searchtype', searchtype ?? '');

    return this._commonService.getAPI('/Subscriber/GetSubInterducedDetails', params, 'YES');
  }
  
}
