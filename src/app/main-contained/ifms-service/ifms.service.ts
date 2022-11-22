import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/common-service.service';

@Injectable({
  providedIn: 'root'
})
export class IfmsService {

  baseURL: any;

  constructor(
    private http: HttpClient, 
    private commonService: CommonService
  ) {
    this.baseURL = this.commonService.getBaseUrl()
  }

  getRectifiedBenfDetails(applNo: any) {
    return this.http.post(`${this.baseURL}/rectifiedbenfdetails`, applNo);
  }

  updateDdoStatus(regnNo: any, ddoStatusCheck: any, ddoStatusCheckDate: Date) {
    return this.http.put(`${this.baseURL}/updateDdoByRegn`, {"regnNo":regnNo, "ddoStatusCheck":ddoStatusCheck,"ddoStatusCheckDate":ddoStatusCheckDate});
  }

  getIfmsTransactionByRegn(regnNo: any) {
    return this.http.post(`${this.baseURL}/findbyregn`, regnNo);
  }
}
