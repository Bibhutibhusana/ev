import {Component, EventEmitter, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

 login: boolean = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  gotoServiceInfo(){
    console.log("clicked")
    this.router.navigate(["/service-info"]);
  }
  onLoginClick(){
    this.login = true;
  }

}
