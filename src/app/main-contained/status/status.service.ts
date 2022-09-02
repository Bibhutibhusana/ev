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

  getOtp(){
    return this.http.get(`http://localhost:8089/otp`);
  }
  getOemValidate(id: number){

    return this.http.get(`http://localhost:8089/evValidate/${id}`);
  }

  getRegnChasiVerify(regn: string, chasi: string):any{

    return this.http.post(`${this.baseURL}/chasiVerification`,{regn: regn, chasi: chasi});

  }


  getApplicationStatus(regn: string){
    return this.http.post(`${this.baseURL}/applicationStatus`,regn);
  }
}
