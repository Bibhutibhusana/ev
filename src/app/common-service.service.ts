import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable ({
  providedIn : 'root'
})
export class CommonService{


  constructor(http: HttpClient) {}
 //baseURL = "https://odtransportmis.nic.in/eVehiclePortalServer";
//  baseURL = "https://odtransportmis.nic.in/StagingEV";

  baseURL = "http://localhost:8089/eVehiclePortalServer";

  getBaseUrl(){
    return this.baseURL;
  }
}
