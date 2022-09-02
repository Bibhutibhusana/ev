import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RegistrationService} from "../service-info/registration/registration.service";
import {StatusService} from "./status.service";
import {OemValidation} from "../service-info/registration/oemValidation";
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  submitted = false;

  appl_no = new FormControl('',[Validators.required]);
  regn_no = new FormControl('',
  [Validators.minLength(9), Validators.maxLength(10), Validators.required]);
chasi_no = new FormControl('',
  [Validators.required, Validators.minLength(5), Validators.maxLength(5)]);

  sendOtpFirst: boolean = false;
  otp !: string;
  enteredOtp = new FormControl('',
    [Validators.maxLength(4),
      Validators.minLength(4)
    ]);
  otpNotMatched: boolean = false;
  oemValidate = new OemValidation();
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;

  chasiFlag : boolean = false;
  statusTableFlag : boolean =false;

  displayedColumns: string[] = ['Application Number', 'Registration Number',
  'Owner Name','Bank Account Number','Application Status'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(private statusService: StatusService,private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onChassisEnter() {

    console.log(this.chasi_no.valid)
    if (this.chasi_no.valid) {

      this.statusService.getRegnChasiVerify(this.regn_no.value, this.chasi_no.value).subscribe((data: any) => {
        // console.log(this.chasiVerification)
        if (data == null) {

          this.chasiFlag = false;

          // console.log("change() called")
        } else {
          this.chasiFlag = true;
        }
      });

    } else {
    }


  }

  onSubmit(){
    this.statusService.getApplicationStatus(this.regn_no.value).subscribe((data: any)=>{
      this.dataSource = new MatTableDataSource(data);

      if(this.dataSource != null){
        this.statusTableFlag = true;
      }
    })
  }
}
