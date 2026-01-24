// // import { Injectable } from '@angular/core';

// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class AddFormToMenuService {
  
// // }
// import { Injectable } from '@angular/core';
// import { CommonService } from '../../Services/common.service';
// import { HttpHeaders, HttpParams } from '@angular/common/http';
// @Injectable({
//     providedIn: 'root'
// })
// export class AddFotmToMenuService {

//     constructor(private commonService: CommonService) { }
//     GetModules(parentmodulename:any) {
//         try {
//             const params = new HttpParams().set('Modulename', parentmodulename);
//             return this.commonService.getAPI('/Settings/Users/RolesCreation/GetallRolesModules', params, 'YES');
//         }
//         catch (e) {
//             this.commonService.showErrorMessage(e);
//         }
//     }
//     GetParentModules() {
//         try {
//             return this.commonService.getAPI('/Settings/Users/RolesCreation/GetParentModules', '', 'NO');
//         }
//         catch (e) {
//             this.commonService.showErrorMessage(e);
//         }
//     }
//     GetNavigation() {
//         try {
//             return this.commonService.getAPI('/Settings/Users/RolesCreation/GetMenuandSubmenuDetails', '', 'NO');
//         }
//         catch (e) {
//             this.commonService.showErrorMessage(e);
//         }
//     }
//     saveModuleTitle(data:any) {

//         try {
//             return this.commonService.postAPI('/Settings/Users/AddFormToMenu/SaveModule', data);
//         }
//         catch (e) {
//             this.commonService.showErrorMessage(e);
//         }

//     }
//     saveParentModuleTitle(data:any) {

//         try {
//             return this.commonService.postAPI('/Settings/Users/AddFormToMenu/SaveParentModule', data);
//         }
//         catch (e) {
//             this.commonService.showErrorMessage(e);
//         }

//     }
//     CheckDuplicatesModule(Modulename:any) {
//         const params = new HttpParams().set('Modulename', Modulename);
//         return this.commonService.getAPI('/Settings/Users/RolesCreation/GetModulecount', params, 'YES');

//     }
//     CheckDuplicatesParentModule(Modulename:any){
//         const params = new HttpParams().set('Modulename', Modulename);
//         return this.commonService.getAPI('/Settings/Users/RolesCreation/GetParentModulecount', params, 'YES');

//     }
//     SubModuleTitle(data:any) {
//         try {
//             const params = new HttpParams().set('Moduleid', data);
//             return this.commonService.getAPI('/Settings/Users/RolesCreation/GetRolesSubModulesbyModule', params, 'YES');
//         }
//         catch (e) {
//             this.commonService.showErrorMessage(e);
//         }
//     }
//     saveSubModuleTitle(data:any) {

//         try {
//             return this.commonService.postAPI('/Settings/Users/AddFormToMenu/SaveSubModule', data);
//         }
//         catch (e) {
//             this.commonService.showErrorMessage(e);
//         }

//     }
//     CheckDuplicatesSubModule(Modulename:any, Submodulename:any) {
//         try {
//             const params = new HttpParams().set('Modulename', Modulename).set('Submodulename', Submodulename);
//             return this.commonService.getAPI('/Settings/Users/RolesCreation/GetSubmenucountbyMenu', params, 'YES');
//         }
//         catch (e) {
//             this.commonService.showErrorMessage(e);
//         }

//     }
//     saveMenu(data:any) {
//         try {
//             return this.commonService.postAPI('/Settings/Users/RolesCreation/SaveMenu', data);
//         }
//         catch (e) {
//             this.commonService.showErrorMessage(e);
//         }
//     }
//     DeleteMenu(data:any) {
//         try {
//             return this.commonService.postAPI('/Settings/Users/RolesCreation/SaveMenu', data);
//         }
//         catch (e) {
//             this.commonService.showErrorMessage(e);
//         }
//     }
// }
