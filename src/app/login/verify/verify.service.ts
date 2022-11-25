
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

   getAllRevertInfo(){
    return this.http.get(`${this.baseURL}/pendingifmstransactionlist`);
   }

   saveRevertInfo(id: any, fileRefId: any, billNo: any, billRefNo: any, resFileName: any, applNo: any, regnNo: any, accNo: any, name: any, ifsc: any, submitStatus: any, submitDate: Date, submitErr: any, ackStatus: any, ackDate: Date, ackErr: any, billStatus: any, billStatusErr: any, checkStatus: any, checkStatusErr: any, checkStatusDate: Date, voucherNo: any, voucherDare: Date, billStatusString: any, utrNo: any, utrDate: Date, benfPaymentStatus: any, benefBillStatus: any, ddoCheckStatus: any, ddoCheckStatusDate: Date, revertStatus: any, revertStatusDate: Date, updateDatetime: Date) {
    return this.http.put(`${this.baseURL}/save`, {"id": id, "fileRefId": fileRefId, "billNo": billNo, "billRefNo": billRefNo, "resFileName": resFileName, "applNo": applNo, "regnNo": regnNo, "accNo": accNo, "name": name, "ifsc": ifsc, "submitStatus": submitStatus, "submitDate": submitDate, "submitErr": submitErr, "ackStatus": ackStatus, "ackDate": ackDate, "ackErr": ackErr, "billStatus": billStatus, "billStatusErr": billStatusErr, "checkStatus": checkStatus, "checkStatusErr": checkStatusErr, "checkStatusDate": checkStatusDate, "voucherNo": voucherNo, "voucherDare": voucherDare, "billStatusString": billStatusString, "utrNo": utrNo, "utrDate": utrDate, "benfPaymentStatus": benfPaymentStatus, "benefBillStatus": benefBillStatus, "ddoCheckStatus": ddoCheckStatus, "ddoCheckStatusDate": ddoCheckStatusDate, "revertStatus":revertStatus, "revertStatusDate":revertStatusDate, "updateDatetime":updateDatetime});
   }

  getToVerifyList(off_cd: any){
    return this.http.post(`${this.baseURL}/verify`,off_cd);
  }

  updateVerificationStatus(regn: any,username: any,reason: any,verification: any,date: Date){
    return this.http.post(`${this.baseURL}/updateStatusVerification`,
    {"regn":regn,"user":username,"reason":reason,"verify":verification,"date":date});
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

  getTotalApplied(fromdate: Date,todate: Date,off_cd: any,type: any){


    return this.http.post(`${this.baseURL}/totalApplied`,{"fromdate":fromdate,"todate":todate,"off_cd":off_cd,"type":type});
  }
  getApplicationStatus(regn: string){
    return this.http.post(`${this.baseURL}/applicationStatus`,regn);
  }

  insertToRevertStatus(regn: any,applNo: any, verification: any,approval: any,opdt: Date,reason: any,verifyUserId: any,approveUserId: any, insertDt: Date){
    return this.http.post(`${this.baseURL}/insertToRevertStatus`,{"regn":regn,"applNo":applNo,"verification": verification,"approval":approval,"opDt":opdt,"reason":reason,"verfiyUserId":verifyUserId,
  "approveUserId":approveUserId,"insertDt":insertDt});
  }
}
