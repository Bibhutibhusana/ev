import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RegistrationService} from "../service-info/registration/registration.service";
import {StatusService} from "./status.service";
import {OemValidation} from "../service-info/registration/oemValidation";
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

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
  applNo !: any;
  enteredOtp = new FormControl('',
    [Validators.maxLength(4),
      Validators.minLength(4)
    ]);
  otpNotMatched: boolean = false;
  oemValidate = new OemValidation();
  sendOtp: boolean = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;

  chasiFlag : boolean = true;
  statusTableFlag : boolean =false;

  reasonBool : boolean = false;

  mobile_no !: string;
  displayedColumns: string[] = ['Application Number', 'Registration Number',
  'Owner Name','Bank Account Number','Application Status','Revert Status'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(private statusService: StatusService,private _formBuilder: FormBuilder,private dialog: MatDialog) {
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
        this.mobile_no = data
        console.log(data)

        // console.log(this.chasiVerification)
        if (this.mobile_no == null) {

          this.chasiFlag = false;

          // console.log("change() called")
        } else {
          this.sendOtp = false;
          this.chasiFlag = true;
        }
      });

    } else {
      this.sendOtp = true;
      console.log("not")
    }


  }

  onSubmit(){
    this.statusService.getApplicationStatus(this.regn_no.value).subscribe((data: any)=>{
      this.dataSource = new MatTableDataSource(data);

      if(data.reason == null){
        this.reasonBool = false;
      }else{
        this.reasonBool = true;
      }


      if(this.dataSource != null){
        this.statusTableFlag = true;
      }
    })
  }
  onSendOtp(){
    this.statusService.getOtp(this.regn_no.value, this.mobile_no).subscribe((data: any) => {
      // console.log(data)
      this.otp = data,
      this.sendOtpFirst = true;
      // this.time = 30;
    });
  }
  onSubmitOtp(dialogs: any){

    this.statusService.getToKnowApplicationNumber(this.regn_no.value).subscribe((data:any)=>{
      console.log(data);

      this.applNo = data[0].appl_no;
      console.log(this.applNo);
      this.dialog.open(dialogs)
    })
  }

  closeDialog() {
    window.location.reload();
    this.dialog.closeAll();
  }

}
