
import { Injectable, EventEmitter } from '@angular/core';
import { CommonService } from '../common.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class UserRightsService {

    constructor(private commonService: CommonService) { }
    getUserCreationContactData = new EventEmitter();
    GetAllMenuForms():any {
        try {
            return this.commonService.getAPI('/setting/AddFormtomenu/GetAllMenuForms', '', 'NO');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }
    GetRoles():any {
        try {
           // const params = new HttpParams().set('roleId', roleId);
            return this.commonService.getAPI('/Settings/Users/UserRights/GetRoles','', 'NO');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }
    GetRolesUserCreation(roleId:any):any {
        try {
            const params = new HttpParams().set('roleId', roleId);
            return this.commonService.getAPI('/Settings/Users/UserRights/GetRolesusercreation', params, 'YES');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }
    // GetUsers() {
    //     try {
    //         return this.commonService.getAPI('/Settings/Users/UserRights/GetUsers', '', 'NO');
    //     }
    //     catch (e) {
    //         this.commonService.showErrorMessage(e);
    //     }
    // }
    SaveUserRights(_AllmenuformsDTO:any, roleid:any, userid:any, branchId:any):any {
        debugger
        try {
            return this.commonService.postAPI('/Settings/Users/AddFormToMenu/SaveUserRights?roleId=' + roleid + '&userId=' + userid + '&branchId=' + branchId + '', _AllmenuformsDTO);
        }

        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
        //let path = '/Settings/Users/AddFormToMenu/SaveUserRights?_AllmenuformsDTO=' + Formsdata + '&roleid=' + roleid + '&userid=' + userid + '';
    }
    GetExistingUsers(branch_code:any):any{
        try {
            const params = new HttpParams().set('branch_code', branch_code);
            return this.commonService.getAPI('/Settings/Users/UserRights/GetExistingUsers', params, 'YES');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }
    GetuserwiseBranches(contactid:any):any {
        try {
            const params = new HttpParams().set('contactid', contactid);
            return this.commonService.getAPI('/setting/AddFormtomenu/GetuserwiseBranches', params, 'YES');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }
    GetAllMenuFormsRoleAndUserWise(roleId:any, userId:any, branchId:any):any {
        try {
            const params = new HttpParams().set('roleId', roleId).set("userId", userId).set("branchid", branchId);
            return this.commonService.getAPI('/setting/AddFormtomenu/GetAllMenuFormsRoleandUserWise', params, 'YES');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }
    GetBranchWiseUsers(branchId:any):any {
        try {
            const params = new HttpParams().set('branch_Id', branchId);
            return this.commonService.getAPI('/setting/AddFormtomenu/GetBranchWiseUsers', params, 'YES');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }

    GetBranchWiseCAO(branchcode:any) :any{
        try {
            const params = new HttpParams().set('BranchSchema', branchcode);
            return this.commonService.getAPI('/setting/AddFormtomenu/GetAllBranchesPriority', params, 'YES');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }

    sendpriority(data:any):any{
        return this.commonService.postAPI("/settings/AddFormtomenu/UpdateBranchesPriority",data);
      }
      GetNewUserBranches():any {
        try {
            return this.commonService.getAPI('/Settings/Users/UserRights/GetNewUserBranches', '', 'NO');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }
    GetUsers(branch_code:any):any {
        try {
            const params = new HttpParams().set('branch_code', branch_code);
            return this.commonService.getAPI('/Settings/Users/UserRights/GetUsers', params, 'YES');

        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }
    GetBranches(branchId:any) :any{

        try {
            // const params = new HttpParams().set('LocalSchema', branchId);
            // return this.commonService.getAPI('/Common/GetOtherBranches', params, 'YES');

            return this.commonService.getAPI('/Common/GetBranchNames', '', 'NO');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }

    }
    GetAllBranchesMultiselect(branchId:any):any {

        try {
            const params = new HttpParams().set('LocalSchema', branchId);
            return this.commonService.getAPI('/setting/AddFormtomenu/GetAllBranches', params, 'YES');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }

    }

    SaveUserRegistration(_UserRegistration:any):any {
        debugger
        try {
            return this.commonService.postAPI('/Settings/Users/SaveUserRegistration', _UserRegistration);
        }

        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }

    }
    SendEmailToSetpassWord(data:any):any {
        debugger;
        try {
            return this.commonService.postAPI('/Settings/Users/SendEmailToSetpassWord', data);
        }

        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }

    }
    GeneratepassWord(data:any):any {
        debugger;
        try {
            return this.commonService.postAPI('/Settings/Users/UpdateUserPassword', data);
        }

        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }

    }
    CheckUserExist(userId:any):any {
        try {
            const params = new HttpParams().set('UserId', userId);
            return this.commonService.getAPI('/setting/Users/CheckUserExist', params, 'YES');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }

    }
    Forgotpassword(userId:any, randomno:any):any {
        try {
            const params = new HttpParams().set('Username', userId).set('Randomno', randomno);
            return this.commonService.getAPI('/Settings/Users/UserRights/ForGetPassword', params, 'YES');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }

    }
    CheckUsernameExists(Username:any,Contactno:any) :any{
        try {
            const params = new HttpParams().set('Username', Username).set('Contactno', Contactno);
            return this.commonService.getAPI('/setting/AddFormtomenu/CheckUserNameExistorNot', params, 'YES');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }

    SaveUserCreation(_UserRegistration:any):any {
        debugger
        try {
            return this.commonService.postAPI('/Settings/Users/SaveUserCreation', _UserRegistration);
        }

        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }

    }


    validateotp(username:any,otp:any):any {
        try {
            const params = new HttpParams().set('username', username).set("otp",otp);
            return this.commonService.getAPI('/settings/Users/validateotp', params, 'YES');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }

    changepassWord(data:any):any {
        debugger;
        try {
            return this.commonService.postAPI('/Settings/Users/ChangeUserPassword', data);
        }

        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }

    }
    GetUserActivityReport(schema:any,userName:any,type:any,fromDate:any,toDate:any,):any{
        try {
            const params = new HttpParams().set('LocalSchema', schema).set("userid",userName).set("type",type).set("fromdate",fromDate).set("todate",toDate);
            return this.commonService.getAPI('/DeviceManagement/GetUserActivityReport', params, 'YES');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }
    GetAuditLogUsers(branch_code:any,fromDate:any,toDate:any,formType:any):any{
        try {
            const params = new HttpParams().set('branch_code', branch_code).set("fromDate",fromDate).set("toDate",toDate).set("formType",formType);
            return this.commonService.getAPI('/Settings/Users/UserRights/GetAuditLogUsers', params, 'YES');
        }
        catch (e:any) {
            this.commonService.showErrorMessage(e);
        }
    }
}