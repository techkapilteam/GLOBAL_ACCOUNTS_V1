// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class SubscriberjvService {
  
// }


import { Injectable, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { CommonService } from '../../common.service';

@Injectable({
    providedIn: 'root'
})
export class SubscriberjvService {

    constructor(private _commonService: CommonService) { }

    GetAccountHeads(trantype:any,accountheadname:any) {
        const params = new HttpParams().set('BranchSchema',  this._commonService.getschemaname()).set("accounttype",trantype).set('accountheadname',accountheadname );
        return this._commonService.getAPI('/ChitTransactions/GetSubscriberJVAccountHeads', params, 'Yes');

    }

    GetPartyDetails() {
        const params = new HttpParams().set('BranchSchema',  this._commonService.getschemaname());
        return this._commonService.getAPI('/AccountingTransactions/GetPartyList', params, 'Yes');

    }

    GetPartyDetailsByGroup(group:any) {
        const params = new HttpParams().set('BranchSchema',  this._commonService.getschemaname())
                                       .set('subledger',  group);
        return this._commonService.getAPI('/AccountingTransactions/GetPartyListByGroup', params, 'Yes');

    }

    GetSubcategories(accountheadid:any,chitgroupid:any,ticketno:any,accountid:any,accountheadtype:any,subcategoryname:any) {
        const params = new HttpParams().set('BranchSchema',  this._commonService.getschemaname())
                        .set('accountheadid', accountheadid)
                        .set('chitgroupid', chitgroupid)
                        .set('ticketno', ticketno)
                        .set('accountid', accountid)
                        .set('accountheadtype', accountheadtype)
                        .set('subcategoryname', subcategoryname);
        return this._commonService.getAPI('/ChitTransactions/GetSubscriberJVSubcategory', params, 'YES');
    }
    GetTDSSubcategoryDetails(subcategoryID:any,partyid:any) {
        debugger;
        const params = new HttpParams().set('BranchSchema', this._commonService.getschemaname())
            .set('subcategoryId', subcategoryID)
            .set('partyId', partyid);
        return this._commonService.getAPI('/ChitTransactions/GetTDSSubcategoryDetails', params, 'YES');
    }

    GetdebitchitCheckbalance(accountheadid:any, subcategory:any,subcategoryid:any) {
        const params = new HttpParams().set('BranchSchema', this._commonService.getschemaname())
            .set('accountheadId', accountheadid)
            .set('subcategory', subcategory)
            .set('subcategoryId', subcategoryid);
        return this._commonService.getAPI('/ChitTransactions/SubscriberJVCheckbalance', params, 'YES');
    }

    PartyStatusChecking(accounthead:any, subcategory:any) {
        const params = new HttpParams().set('BranchSchema', this._commonService.getschemaname())
            .set('accounthead', accounthead)
            .set('subcategory', subcategory)
            return this._commonService.getAPI('/ChitTransactions/PartyStatusChecking', params, 'YES');
    }

    saveChitReceipt(data:any) {
        return this._commonService.postAPI('/ChitTransactions/SaveSubscriberJV', data)
    }

    saveSubscriberVoucher(data:any) {
        return this._commonService.postAPI('/ChitTransactions/SaveSubscriberVoucher', data)
    }

    getSubscriberJVReport(jvnumber:any) {
        const params = new HttpParams().set('localSchema', this._commonService.getschemaname())
            .set('jvnumber', jvnumber);
        return this._commonService.getAPI('/ChitTransactions/ChitReports/getSubscriberJVReport', params, 'YES');
    }
    getSubscriberJVReportForLegal(jvnumber:any,localSchema:any) {
        const params = new HttpParams().set('localSchema', localSchema)
            .set('jvnumber', jvnumber);
        return this._commonService.getAPI('/ChitTransactions/ChitReports/getSubscriberJVReport', params, 'YES');
    }
    // Removal Filing Date by Ramakanth : 02-10-2021
    
    
    getRemovalFilingDetails(fromdate:any,todate:any,localschema:any,branchschema:any){
        const params = new HttpParams().set("BranchSchema",branchschema).set('fromdate', fromdate).set('todate', todate).set('Localschema', localschema);
        return this._commonService.getAPI('/ChitTransactions/GetSubscriberRemovalFilingDetails', params, 'YES');;
    }
    saveRemovalFilingDate(sremovaldata:any){
        return this._commonService.postAPI('/ChitTransactions/SaveSubscriberRemovalFiling', sremovaldata)
    }
}
