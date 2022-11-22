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
  increaseFontSize(){
    console.log(document.body.style.fontSize.substring(0,document.body.style.fontSize.length-2))
    if(document.body.style.fontSize.length != 0){
      document.body.style.fontSize = String(Number(document.body.style.fontSize.substring(0,document.body.style.fontSize.length-2)) + 1)+"px";
    }
    else{
      document.body.style.fontSize = "16px";
    }

  }
  setNormalFontSize(){
    document.body.style.fontSize ="16px";
  }
  decreaseFontSize(){
    console.log(document.body.style.fontSize.length != 0)
    if(document.body.style.fontSize != null){
      document.body.style.fontSize = String(Number(document.body.style.fontSize.substring(0,document.body.style.fontSize.length-2)) - 1)+"px";
    }
    else{
      document.body.style.fontSize = "16px";
    }
  }

}
