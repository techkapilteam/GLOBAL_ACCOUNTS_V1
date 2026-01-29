// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class NavigationService {
  
// }
import { Injectable } from '@angular/core';
// import { CommonService } from '../../Services/common.service';
import { CommonService } from '../common.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    constructor(private commonService: CommonService) { }

    GetUserRightsBasedonRoleAnduserId(roleId:any, userId:any, branchId:any) {
        debugger;
        const params = new HttpParams().set('roleId', roleId).set('userId', userId).set('branchId', branchId);
        return this.commonService.getAPI('/Settings/Users/UserRights/GetUserRightsBasedonRoleAnduserId', params, 'YES');
    }
    getUnclearedChequesNotification(BranchSchema:any) {
        debugger;
        const params = new HttpParams().set('BranchSchema', BranchSchema);
        return this.commonService.getAPI('/Dashboard/getUnclearedChequesNotification', params, 'YES');
    }
    getUnclearedChequesNotificationDiffData(BranchSchema:any) {
        debugger;
        const params = new HttpParams().set('BranchSchema', BranchSchema);
        return this.commonService.getAPI('/Dashboard/getUnclearedChequesNotificationDiffData', params, 'YES');
    }
    getSubscriberBalanceNotificationDiffData(BranchSchema:any) {
        debugger;
        const params = new HttpParams().set('BranchSchema', BranchSchema);
        return this.commonService.getAPI('/Dashboard/getSubscriberBalanceNotificationDiffData', params, 'YES');
    }

    ShowApplicationVersionNo() {
        debugger;
        return this.commonService.getAPI('/Common/GetApplicationVersiono','','NO')
      }
    getSubscriberBalanceNotificationDiffReport(BranchSchema:any) {
        debugger;
        const params = new HttpParams().set('BranchSchema', BranchSchema);
        return this.commonService.getAPI('/Dashboard/getSubscriberBalanceNotificationDiffReport', params, 'YES');
    }
}
