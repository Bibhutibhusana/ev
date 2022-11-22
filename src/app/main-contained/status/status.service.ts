import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { CommonService } from "src/app/common-service.service";
@Injectable({
  providedIn: 'root'
})
export class StatusService{
  baseURL : any;
  constructor(private http: HttpClient, private commonService: CommonService) {

    this.baseURL = this.commonService.getBaseUrl()
  }


  getRegnChasiVerify(regn: string, chasi: string):any{

    return this.http.post(`${this.baseURL}/chasiVerification`,{regn: regn, chasi: chasi});

  }


  getApplicationStatus(regn: string){
    return this.http.post(`${this.baseURL}/applicationStatus`,regn);
  }
  getOtp(regn: any, mobile_no: any){
    return this.http.post(`${this.baseURL}/otp`,{"regn_no": regn, "mobile_no": mobile_no});
  }

  getToKnowApplicationNumber(regn: any){
    return this.http.post(`${this.baseURL}/api/knowApplicationNumber`,regn);
  }
  // Added By Abinash Nayak for Application Status Search start
  getApplicationStatusByAdmin(regn: string,appl:string,fr_date:Date,to_date:Date){
    return this.http.post(`${this.baseURL}/applicationStatusByAdmin`,{"regn":regn,"appl":appl,"fr_date":fr_date,"to_date":to_date});
  }
}
