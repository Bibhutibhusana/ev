import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class XmlBankDetailsService {

	constructor(private http: HttpClient){}

	getXmlFormatBankDetailsWithZipFile():any{
		return this.http.get(`http://localhost:8089/eVehiclePortalServer/xmlBankDetails`);
	}
}
