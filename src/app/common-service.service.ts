import { Injectable } from "@angular/core";

@Injectable ({
  providedIn : 'root'
})
export class CommonService{
  baseURL = "https://odtransportmis.nic.in/eVehiclePortalServer";

  // baseURL = "http://localhost:8089/eVehiclePortalServer"

  getBaseUrl(){
    return this.baseURL;
  }

}
