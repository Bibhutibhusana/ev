
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { CommonService } from 'src/app/common-service.service';

@Injectable({
  providedIn: 'root'
})

export class VerifyService{


  baseURL:any;
  constructor(private http: HttpClient, private commonService: CommonService) {
    this.baseURL = this.commonService.getBaseUrl()
   }


  getToVerifyList(off_cd: any){

    return this.http.post(`${this.baseURL}/verify`,off_cd);
  }

  updateVerificationStatus(regn: any,username: any,reason: any,verification: any){
    return this.http.post(`${this.baseURL}/updateStatusVerification`,
    {"regn":regn,"user":username,"reason":reason,"verify":verification});
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

  sendRejectedMsg(applNo: any,rto: any,mob: any,reason: any,regn: any){


    return this.http.post(`${this.baseURL}/sendRejectedMsg`,{"applNo":applNo,"rto":rto,"mob":mob,"regn":regn,"reason":reason});
  }
  sendRevertedMsg(applNo: any,rto: any,mob: any,reason: any,regn: any){


    return this.http.post(`${this.baseURL}/sendRevertedMsg`,{"applNo":applNo,"rto":rto,"mob":mob,"regn":regn,"reason":reason});
  }
}
