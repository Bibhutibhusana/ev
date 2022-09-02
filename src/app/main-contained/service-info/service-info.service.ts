import { CommonService } from './../../common-service.service';
import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ServiceInfoService {


  baseURL : any;
  constructor(private http: HttpClient, private commonService: CommonService) {
    this.baseURL = this.commonService.getBaseUrl()
   }

  getDealerList(){
    return this.http.get(`${this.baseURL}/dealerList`);
  }

}
