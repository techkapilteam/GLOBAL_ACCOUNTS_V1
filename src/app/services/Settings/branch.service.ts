
import { Injectable } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class BranchService {
    constructor(private commonService: CommonService) { }

    _getUserWiseBranches(contactid:any) {

        const params = new HttpParams().set('contactid', contactid);
        return this.commonService.getAPI('/setting/AddFormtomenu/GetuserwiseBranches', params, 'YES');

    }
    updatelogindatetime(ContactId:any, branchId:any,browserName:any,ipaddress:any):any {
        debugger
        try {
            let object2 ={
                ContactId: ContactId,
                branchId : branchId,
                browserName : browserName,
                ipaddress : ipaddress
              }
              let data = JSON.stringify(object2);
            return this.commonService.postAPI('/Settings/AddFormtomenu/updatelogindatetime' ,data);
        }

        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
        //let path = '/Settings/Users/AddFormToMenu/SaveUserRights?_AllmenuformsDTO=' + Formsdata + '&roleid=' + roleid + '&userid=' + userid + '';
    }
}