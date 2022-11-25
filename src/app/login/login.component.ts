import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { LoginService } from "./login.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: boolean = true;
  hide = true;
  errMsg = false;
  username = new FormControl('');
  password = new FormControl('');
  role!: string;
  off_cd: any;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  onSignIn() {
    this.loginService.loginAuthenticate(this.username.value, this.password.value).subscribe(
      (data: any) => {
        this.loginService.getTocken(this.username.value, this.password.value).subscribe(
          (data: any) => {
            let tokenStr = 'Bearer ' + data.token;
            window.sessionStorage.setItem("token", tokenStr);
          }
        )
        if (data.length == 0) {
          this.errMsg = true;
        } else {

          switch (data[0].role) {
            case "Verify":
              var setOffCd = window.sessionStorage.setItem("off_cd", data[0].off_cd);
              this.router.navigate(['/verify', data[0].username])
              break;
            case "Approve":
              var setOffCd = window.sessionStorage.setItem("off_cd", data[0].off_cd);
              this.router.navigate(['/approve', data[0].username])
              break;
            case "Admin":
              var setOffCd = window.sessionStorage.setItem("off_cd", data[0].off_cd);
              this.router.navigate(['/admin', data[0].username])
              break;
            case "DDO":
              var setOffCd = window.sessionStorage.setItem("off_cd", data[0].off_cd);
              this.router.navigate(['/ddo', data[0].username])
              break;
            default:
              this.router.navigate(['/login'])
          }
        }

      },

    );
  }
}
