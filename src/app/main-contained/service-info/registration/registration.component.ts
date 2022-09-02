import {Component, OnInit} from '@angular/core';
import {RegistrationService} from "./registration.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {OemValidation} from "./oemValidation";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {VehicleDetailsModel} from "./vehicleDetailsModel";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {UserStatus} from "./userStatus";
import { BankNames } from './banks';
import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  regn_no = new FormControl('',
    [Validators.minLength(9), Validators.maxLength(10), Validators.required]);
  chasi_no = new FormControl('',
    [Validators.required, Validators.minLength(5), Validators.maxLength(5)]);

  sendOtp: boolean = true;

  bankNames : BankNames[] = [];

  selectedBankName !: string;


  sendOtpFirst: boolean = false;
  disabledAgreement: boolean = true;
  confirmDetails: boolean = false;
  uploadedFile!: string;
  submitCheck: boolean = true;
  bankCheck: boolean = false;
  regChasCheck: boolean = true;
  confirmDetailsCheck: boolean = false;
  otp !: string;
  enteredOtp = new FormControl('',
    [Validators.maxLength(4),
      Validators.minLength(4)
    ]);
  otpNotMatched: boolean = false;

  oemValidate = new OemValidation();
  vehicleDetails = new VehicleDetailsModel();
  chasiVerification !: boolean;
  mobile_no !: string;
  chasiFlag: boolean = true;

  skeletonFlag: boolean = true;
  bankName: any;
  accNo: any;
  branchName: any;
  name: any;
  ifscCode: any;

  bankDetails = new FormGroup({})
  bankInfo: any;

  passbookImg: any

  check !: boolean

  oemCheck: boolean = true;
  oemCheckAcc: boolean = true;
  oemCheckspeed: boolean = true
  oemCheckwarr: boolean = true
  oemCheckEnergy: boolean = true

  nameCheck : boolean = false;

  oemcheck : boolean = true;

  twoWheelerCheck : boolean = true;
  applNo !: string;

  checkBankDetails !: boolean;

  dialogMsg: string = "";

  userStatus: UserStatus = new UserStatus();

  resentBtnCheck = true;
  changeCheck(event: MatCheckboxChange) {
    this.disabledAgreement = !event.checked;
  }

  changeCheckSubmit(event: { checked: any; }) {
    this.submitCheck = !event.checked;
  }

  constructor(private registrationService: RegistrationService,
              private fb: FormBuilder, private _snackBar: MatSnackBar, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.createForm()

    console.log("=====>");
    this.interval = setInterval(() => {
      if (this.time != 0) {
        this.time--;
      } else {
        this.time = 0;
        this.resentBtnCheck = false;
      }
    }, 1000, this.resentBtnCheck = false);
    this.resentBtnCheck = false;

    this.registrationService.getBankNames().subscribe((data:any)=>{
      this.bankNames = data
      console.log(this.bankNames);


    })
  }



  createForm() {
    this.bankDetails = this.fb.group({
      'regnNo': this.regn_no,
      'bankName': [null],
      'branchName': [null],
      'name': [null],
      'accNo': [null],
      'ifscCode': [null],
      'op_dt': new Date(),
      'passbookImg': [null]
    })
  }

  onSendOtp() {

    // console.log(this.regn_no, this.mobile_no)

    this.registrationService.getOtp(this.regn_no.value, this.mobile_no).subscribe((data: any) => {
      // console.log(data)
      this.otp = data,
      this.sendOtpFirst = true;
      // this.time = 30;
    });
  }

  onSubmitOtp(dialogCommon2: any, dialogCommon: any) {

    let date = new Date('2021-08-31');
    let purchaseDt;

    if (this.otp == this.enteredOtp.value) {


      this.registrationService.getVehicleDetials(this.regn_no.value).subscribe((data: any) => {
        this.vehicleDetails = data
        purchaseDt = new Date(this.vehicleDetails.purchaseDt)

        if(purchaseDt<date){
          console.log("inside date");
          this.dialogMsg = "You are not eligible for subsidy under Odisha Electric Vehicle policy 2021 as purchase date of your vehicle is before 1st September 2021";
          this.dialog.open(dialogCommon2);

        }else{

          if(this.vehicleDetails.vClass=='M-Cycle/Scooter-With Side Car' || this.vehicleDetails.vClass=='M-Cycle/Scooter' || this.vehicleDetails.vClass=='Moped' || this.vehicleDetails.vClass=='Motorised Cycle (CC > 25cc)')
        {
          this.twoWheelerCheck = true;
          this.registrationService.getOemValidate(this.vehicleDetails.vmodel).subscribe((data: any) => {

            // this.oemValidate = data;
            // console.log(this.oemValidate)
            if(data == null){
              this.oemcheck = false;
              this.dialogMsg = "Either this model is not registered by manufacturer or not meeting the technical specification 4.1.7 of Odisha EV Policy 2021, kindly contact to the manufacturer";
              console.log(this.dialogMsg);
          this.dialog.open(dialogCommon);
            }else{
              this.oemValidate = data;

              if (this.oemValidate.minTopSpeed < 40) {
                this._snackBar.open('The Top Speed criteria >= 40 is not meeting by your vehicle for subsidy of 4.1.7 of Odisha EV Policy 2021', 'Close')
                this.oemCheck = false
                this.oemCheckspeed = false;
              }
              if (this.oemValidate.minAcceleration < 0.65) {
                this._snackBar.open('The Minimum Acceleration criteria >= 0.65 is not meeting by your vehicle for subsidy of 4.1.7 of Odisha EV Policy 2021', 'Close')
                this.oemCheck = false
                this.oemCheckAcc = false
              }
              if (this.oemValidate.warranty < 3) {
                this._snackBar.open('The Warranty criteria >= 3 is not meeting by your vehicle for subsidy of 4.1.7 of Odisha EV Policy 2021', 'Close')
                this.oemCheck = false
                this.oemCheckwarr = false;
              }
              if (this.oemValidate.maxEnergyConsumption > 7) {
                this._snackBar.open('The Maximum Energy Consumption criteria < 7 is not meeting by your vehicle for subsidy of 4.1.7 of Odisha EV Policy 2021', 'Close')
                this.oemCheck = false
                this.oemCheckEnergy = false;
              }
              if (!this.oemCheckwarr || !this.oemCheckspeed || !this.oemCheckAcc || !this.oemCheckEnergy) {
                this.oemCheck = false
                console.log("first oem", this.oemCheck)
                console.log("warr", this.oemCheckwarr)
                console.log("speed", this.oemCheckspeed)
                console.log("acc", this.oemCheckAcc)
                console.log("energy", this.oemCheckEnergy)

              } else {
                this.oemCheck = true;
              }
            }


          })

        }else{
          this.twoWheelerCheck = false;

        }
        }



        this.skeletonFlag = false;


      })


      this.sendOtpFirst = false;
      this.confirmDetails = true;
      this.regChasCheck = false;
      this.confirmDetailsCheck = true;

    } else {
      this.otpNotMatched = true;
    }

    console.log("second oem", this.oemCheck)

  }

  onCancelDetails() {
    this.sendOtpFirst = false;
    this.confirmDetails = false;
    this.regChasCheck = true;
    this.confirmDetailsCheck = false;
  }

  getErrorMessage(): any {
    return 'OTP Mis-Matched ';

  }

  onConfirmDetails(dialogCommon: any) {
    // this.confirmDetails = false;


    this.vehicleDetails.op_dt = new Date();

    this.registrationService.checkRegnExist(this.regn_no.value).subscribe((data: any) => {
      if (data == null) {
        this.check = true;
        if (this.oemCheck) {
          this.registrationService.insertVehicleDetails(this.vehicleDetails).subscribe((data: any) => {
            this.vehicleDetails = data,
              this.bankCheck = true;
            this.confirmDetailsCheck = false;
          })
        } else {
          this._snackBar.open('Your vehicle is not qualified in OEM validation.', 'Close')
        }
      } else {
        this.check = false;
        this.bankCheck = true;
      this.confirmDetailsCheck = false;

      this.dialogMsg = "You have already verified your details"

      this.dialog.open(dialogCommon)
      }
    })




  }

  uploadFile(event: any) {
    this.uploadedFile = event.target.files[0].name;
    console.log(event.target.files);
  }

  onChassisEnter() {

    console.log(this.chasi_no.valid)
    if (this.chasi_no.valid) {

      this.registrationService.getRegnChasiVerify(this.regn_no.value, this.chasi_no.value).subscribe((data: any) => {
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

  convertDataURIToBinary(dataURI: any) {

    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  upload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    this.uploadedFile = event.target.files[0].name;
    reader.onload = (e: any) => {
      const bytes = e.target.result.split('base64,')[1];
      this.passbookImg = bytes;
      // console.log(bytes)
    };
    reader.readAsDataURL(file);

  }

  getOffCdNumberToPlace(offCd: string){

    let place;

    switch(offCd){
      case "1":
        place = "Balasore";
      break;
      case "2":
        place = "Bhubaneswar-I";
        break;

        case "3":
        place = "Bolangir";
      break;
      case "4":
        place = "Chandikhol";
        break;
        case "5":
        place = "Cuttack";
      break;
      case "6":
        place = "Dhenkanal";
        break;
        case "7":
        place = "Ganjam";
      break;
      case "8":
        place = "Kalahandi";
        break;
        case "9":
        place = "Keonjhar";
      break;
      case "10":
        place = "Koraput";
        break;
        case "11":
        place = "Mayurbhanj";
      break;
      case "12":
        place = "Phulabani";
        break;
        case "13":
        place = "Puri";
      break;
      case "14":
        place = "Rourkela";
        break;
        case "15":
        place = "Sambalpur";
      break;
      case "16":
        place = "Sundergarh";
        break;
        case "17":
        place = "Baragarh";
      break;
      case "18":
        place = "Rayagada";
        break;
        case "19":
        place = "Angul";
      break;
      case "20":
        place = "Gajapati";
        break;
        case "21":
        place = "Jagatsinghpur";
      break;
      case "22":
        place = "Bhadrak";
        break;
        case "23":
        place = "Jharsuguda";
      break;
      case "24":
        place = "Nabarangpur";
        break;
        case "25":
        place = "Nayagarh";
      break;
      case "26":
        place = "Nuapada";
        break;
        case "27":
        place = "Boudh";
      break;
      case "28":
        place = "Debagarh";
        break;
        case "29":
        place = "Kendrapada";
      break;
      case "30":
        place = "Malkangiri";
        break;
        case "31":
        place = "Sonepur";
      break;
      case "32":
        place = "Bhanjanagar";
        break;
        case "33":
        place = "Bhubaneswar-II";
      break;
      case "34":
        place = "Jajpur";
        break;
      case "35":
        place = "Talcher";
        break;
        case "111":
        place = "ARTO Rairangpur";
        break;
        case "201":
        place = "ARTO Khordha";
        break;
        case "901":
        place = "ARTO Barbil";
        break;
    }

    return place;
  }

  onSaveBankDetails(dialogCommon2: any, dialogCommon: any) {

    let reg = this.regn_no.value;
    this.registrationService.checkBankDetailsExist(reg).subscribe((data: any) => {

      if (data == null) {

        this.checkBankDetails = true
        this.bankInfo = this.bankDetails.value;
        this.bankInfo.passbookImg = this.passbookImg

        let temp = this.regn_no.value;
        // this.registrationService.getApplNo(temp).subscribe((data:any)=>{this.applNo = data})
        this.registrationService.getApplNo(temp).subscribe((data: any) => {
          this.applNo = data.applNo,
            console.log(this.applNo)
            this.bankInfo.applNo = this.applNo,
            this.registrationService.insertBankDetails(this.bankInfo).subscribe((data: any) => {
              this.registrationService.findUserStatusByRegnNo(this.regn_no.value).subscribe((data: any) => {
                console.log(data)
                if (data == null) {

                  this.userStatus.regnNo = this.regn_no.value
                  this.userStatus.applNo = this.applNo
                  this.userStatus.userRegistered = "y"
                  this.userStatus.opDt = new Date()
                  this.registrationService.insertUserStatus(this.userStatus).subscribe((data: any) => {
                    console.log("user Status insert", data);

                    this.registrationService.sendSuccessRegistrationMsg(this.applNo,reg,this.getOffCdNumberToPlace(this.vehicleDetails.off_cd),this.vehicleDetails.mob_no).subscribe((data:any)=>{
                      console.log(data);
                    })


                  })
                } else {
                  this.userStatus.regnNo = data.regnNo;

                  this.registrationService.insertUserStatus(this.userStatus).subscribe((data: any) => {
                    console.log("user Status updated", data)
                  })
                }
              })


              this.dialogMsg = "You have successfully registered for Eletric Vehicle subsidy with Application No: ",
                this.dialog.open(dialogCommon2)
            })

        })


      } else {

        this.registrationService.findUserStatusByRegnNo(this.regn_no.value).subscribe((data: any)=>{
          this.userStatus = data;
          console.log(this.userStatus.applNo)
          if(this.userStatus.approval=='rev' || this.userStatus.verification=='rev'){
            this.userStatus.regnNo = this.regn_no.value
                  this.userStatus.userRegistered = "y"
                  this.userStatus.approval = null;
                  this.userStatus.verification = null;
                  this.userStatus.reason = null;
                  this.userStatus.sub_amnt = null;


                  this.userStatus.opDt = new Date()
                  this.registrationService.insertUserStatus(this.userStatus).subscribe((data: any) => {
                    console.log("user Status insert", data)

                    this.dialogMsg = "Corrected data updated successfully";
          this.dialog.open(dialogCommon)
                  })

          }else{

            this.checkBankDetails = false
        this.dialogMsg = "You have already registered. Check your status for further information. ",
          this.dialog.open(dialogCommon)
          }
        })

      }
    })


  }

  checkAccName() {
    console.log(this.vehicleDetails.ownerName);

    if (this.vehicleDetails.ownerName == this.bankDetails.value.name) {
      this.nameCheck = true;

      console.log(this.vehicleDetails.ownerName);
    } else {
      this.nameCheck = false;
      console.log(this.nameCheck)
      console.log(this.vehicleDetails.ownerName);
    }


  }

  closeDialog() {
    // window.location.reload();
    this.dialog.closeAll();
  }

  closeDialogWithRefresh() {
    window.location.reload();
    this.dialog.closeAll();
  }
  time: number = 0;
  interval: any;

  startTimer() {
    console.log("=====>");
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
    }, 1000);

  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  transform(value: number, args?: any): any {

    const hours: number = Math.floor(value / 60);
    const minutes: number = (value - hours * 60);

    if (hours < 10 && minutes < 10) {
      return '0' + hours + ' : 0' + (value - hours * 60);
    }
    if (hours > 10 && minutes > 10) {
      return '0' + hours + ' : ' + (value - hours * 60);
    }
    if (hours > 10 && minutes < 10) {
      return hours + ' : 0' + (value - hours * 60);
    }
    if (minutes > 10) {
      return '0' + hours + ' : ' + (value - hours * 60);
    }


  }
  onSelectBank(){
    console.log(this.bankDetails.value.bankName)
  }
}

