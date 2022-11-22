import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { CommonService } from '../common-service.service';

@Injectable({providedIn: 'root'})
export class LoginService{

  baseURL : any;
  constructor(private http: HttpClient, private commonService: CommonService) {
    this.baseURL = this.commonService.getBaseUrl()
   }

  loginAuthenticate(username: string, password: string):any{

    return this.http.post(`${this.baseURL}/login`,{username:username, password:password});

  }
  getTocken(username: string, password: string):any{

    return this.http.post(`${this.baseURL}/authenticate`,{username:username, password:password})
  }

}
