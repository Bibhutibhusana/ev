import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserStatus} from "./userStatus";
import { CommonService } from 'src/app/common-service.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  baseURL : any;
  constructor(private http: HttpClient, private commonService: CommonService) {

    this.baseURL = this.commonService.getBaseUrl()
   }

  getOtp(regn: any, mobile_no: any){
    return this.http.post(`${this.baseURL}/otp`,{"regn_no": regn, "mobile_no": mobile_no});
  }
  getOemValidate(model: string){

    return this.http.get(`${this.baseURL}/evValidate/${model}`);
  }

  getRegnChasiVerify(regn: string, chasi: string):any{

    return this.http.post(`${this.baseURL}/chasiVerification`,{regn: regn, chasi: chasi});

  }
  getIFSCCodeVerify(ifscCode: string):any{

    return this.http.post(`${this.baseURL}/ifscVerification`,ifscCode);

  }

  getVehicleDetials(regn: string):any{
    return this.http.post(`${this.baseURL}/vehicleDetails`,regn);
  }

  insertVehicleDetails(vehiclDetails: any): any{

    return this.http.post(`${this.baseURL}/insertVehicleDetails`, vehiclDetails)
  }

  insertBankDetails(bankDetails: any): any{
    return this.http.post(`${this.baseURL}/insertBankDetails`, bankDetails)
  }

  checkRegnExist(regn: any){
    return this.http.get(`${this.baseURL}/checkExist/${regn}`)
  }

  getApplNo(regn: any): any{
    return this.http.get(`${this.baseURL}/applNoGeneration/${regn}`)
  }

  checkBankDetailsExist(regn: any): any{
    return this.http.get(`${this.baseURL}/checkExistBankDetails/${regn}`)
  }

  checkBankAndStatusDetails(regn:any){
    return this.http.get(`${this.baseURL}/checkExistBankAndStatusDetails/${regn}`)
  }
  checkBankAndStatusDetailsExist(regn: any): any{
    return this.http.get(`${this.baseURL}/checkBankAndStatusDetails/${regn}`)
  }

  insertUserStatus(userStatus: any):any{
    return this.http.post(`${this.baseURL}/insertUserStatus`, userStatus )
  }

  findUserStatusByRegnNo(regn: string){
    return this.http.get(`${this.baseURL}/findByRegn/${regn}` )
  }



  findAllBankNames(){
    return this.http.get(`${this.baseURL}/bankNames` )
  }

  getAllBankDetailByBankName(bank: any) {
    return this.http.post(`${this.baseURL}/bankByName`, {"bank":bank})
  }

  sendSuccessRegistrationMsg(applNo:any,regn: any,rto: any,mob: any){
    return this.http.post(`${this.baseURL}/sendSuccessRegistrationMsg`,{"applNo":applNo,"regn":regn,"rto":rto,"mob":mob} )
  }
  insertBankAndStatusDetails(userStatus:UserStatus,bankDetails:any){
    return this.http.post(`${this.baseURL}/insertBankAndStatusDetails`,{"bankDetails":bankDetails, "userStatus":userStatus})
  }
  getAllEVModelDetails(){
    return this.http.get(`${this.baseURL}/evValidate` )
  }

}
