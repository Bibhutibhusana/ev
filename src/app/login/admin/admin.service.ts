import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "src/app/common-service.service";

@Injectable({
  providedIn: 'root'
})

export class AdminService{
  baseURL : any;

  constructor(private http: HttpClient, private commonService: CommonService) {
    this.baseURL = this.commonService.getBaseUrl()
   }


   getTotalApplied(fromdate: Date,todate: Date,type: any){
    return this.http.post(`${this.baseURL}/getReport`,{"fromdate":fromdate,"todate":todate,"type":type});
  }

}
