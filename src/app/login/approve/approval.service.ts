import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { CommonService } from 'src/app/common-service.service';

@Injectable({
  providedIn: 'root'
})

export class ApprovalService{


  baseURL : any;

  constructor(private http: HttpClient, private commonService: CommonService) {
    this.baseURL = this.commonService.getBaseUrl()
   }
  getToApproveList(off_cd: any){


    return this.http.post(`${this.baseURL}/approve`,off_cd);
  }

  updateApprovalStatus(regn: any,username: any,reason: any,verification: any,cheq: any, subamnt: any){

    return this.http.post(`${this.baseURL}/updateStatusApproval`, {"regn":regn,"user":username,"reason":reason,"verify":verification,"cheqNo":cheq,"subAmnt":subamnt});

  }

  getFinalApprovalList(date: Date, off_cd: any){

    console.log(off_cd,date);

    return this.http.post(`${this.baseURL}/approveListFinal`,{"date":date,"off_cd":off_cd});
  }

  getUpdateDownloadStatus(regn: any){
    return this.http.post(`${this.baseURL}/updateDownloadStatus`,regn);
  }


  getStatus(regn: string){

    return this.http.get(`${this.baseURL}/findByRegn/${regn}`);
  }
  insertToUserStatusHistory(userStatusHistory: any): any{

    return this.http.post(`${this.baseURL}/insertUserStatusHistory`, userStatusHistory);
  }

  getVehicleDetailsToDelete(regn: any){

    return this.http.post(`${this.baseURL}/getVehicleDetailsToDelete`, regn);
  }

  insertToVehicleDetailsHistory(vdHistory: any): any{

    return this.http.post(`${this.baseURL}/insertToVehicleDetailsHistory`, vdHistory);
  }

  getBankDetailsToDelete(regn: any){

    return this.http.get(`${this.baseURL}/checkExistBankDetails/${regn}`);
  }

  insertToBankDetailsHistory(bdHistory:any){
    return this.http.post(`${this.baseURL}/insertToBankDetailsHistory`, bdHistory);
  }

  deleteFromUserStatus(regn: any){
    return this.http.delete(`${this.baseURL}/deleteByRegn/${regn}` );
  }

  deleteFromVehicleDetails(regn: any){
    return this.http.delete(`${this.baseURL}/deleteVehicleDetailsByRegn/${regn}` );
  }

  deleteFromBankDetails(regn: any){
    return this.http.delete(`${this.baseURL}/deleteBankDetailsByRegn/${regn}` );
  }

  getSaleAmount(regn: any){
    return this.http.post(`${this.baseURL}/getSaleAmout`, regn);
  }

  getSanctionOrder(applNo: any){
    return this.http.post(`${this.baseURL}/sanctionOrder`, applNo);
  }

  updatePaymentStatus(applNo: any){

    return this.http.post(`${this.baseURL}/updatePaymentStatus`, {"applNo":applNo});

  }

  getFinalDisbursementList(date: Date, off_cd: any){

    console.log(off_cd,date);

    return this.http.post(`${this.baseURL}/disbursementListFinal`,{"date":date,"off_cd":off_cd});
  }

  updateDisbursementStatus(list: any){


    return this.http.post(`${this.baseURL}/disbursementStatusUpdate`,list);
  }

  sendApprovedMsg(applNo: any,rto: any,mob: any){


    return this.http.post(`${this.baseURL}/sendApprovedMsg`,{"applNo":applNo,"rto":rto,"mob":mob});
  }

  sendRejectedMsg(applNo: any,rto: any,mob: any,reason: any,regn: any){


    return this.http.post(`${this.baseURL}/sendRejectedMsg`,{"applNo":applNo,"rto":rto,"mob":mob,"regn":regn,"reason":reason});
  }
  sendRevertedMsg(applNo: any,rto: any,mob: any,reason: any,regn: any){


    return this.http.post(`${this.baseURL}/sendRevertedMsg`,{"applNo":applNo,"rto":rto,"mob":mob,"regn":regn,"reason":reason});
  }

}
