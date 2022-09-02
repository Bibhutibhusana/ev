import { ChangeDetectionStrategy, Component,OnInit } from '@angular/core';
import {LoaderService} from "./loaderService/loader.service";
import { XmlBankDetailsService } from './main-contained/bank-info/xml-bank-details-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  title = 'ev1';

  constructor(public loaderService: LoaderService,private bankService: XmlBankDetailsService) {
  }
  ngOnInit(){
    let count = 0;
  setInterval(() => { // Set interval for checking
      let date = new Date();
      //console.log(date.getHours(), date.getMinutes()) // Create a Date object to find out what time it is
      if(date.getHours() === 17 && date.getMinutes() === 11){ // Check the time
        //alert("Tea Break")
        count = count +1;
		this.bankService.getXmlFormatBankDetailsWithZipFile().subscribe((data:any) => {console.log(data)},
		(err:any) => console.log(err.message));        // Do stuff
  }}, 1000);
  }
}
