import { Component, OnInit } from '@angular/core';
import { RegistrationService } from './registration.service';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { OemValidation } from './oemValidation';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { VehicleDetailsModel } from './vehicleDetailsModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserStatus } from './userStatus';
import { BankDetails } from './bank-details';
import { IfmsMaster } from './ifms-master';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  regn_no = new UntypedFormControl('', [
    Validators.minLength(9),
    Validators.maxLength(10),
    Validators.required,
  ]);
  chasi_no = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(5),
  ]);

  sendOtp: boolean = true;

  bankNames: IfmsMaster[] = [];
  branchList: IfmsMaster[] = [];
  ifscDetail!: IfmsMaster;
  selectedBankName!: string;
  selectedIFSC!: string;
  selectedBranch!: string;

  sendOtpFirst: boolean = false;
  disabledAgreement: boolean = true;
  confirmDetails: boolean = false;
  uploadedFile!: string;
  submitCheck: boolean = true;
  bankCheck: boolean = false;
  regChasCheck: boolean = true;
  confirmDetailsCheck: boolean = false;
  otp!: string;
  enteredOtp = new UntypedFormControl('', [
    Validators.maxLength(4),
    Validators.minLength(4),
  ]);
  otpNotMatched: boolean = false;

  oemValidate = new OemValidation();
  vehicleDetails = new VehicleDetailsModel();
  chasiVerification!: boolean;
  mobile_no!: string;
  chasiFlag: boolean = true;

  skeletonFlag: boolean = true;
  bankName: any;
  accNo: any;
  branchName: any;
  name: any;
  ifscCode: any;

  bankDetails = new UntypedFormGroup({});
  bankInfo: BankDetails =new BankDetails();

  passbookImg: any;

  check!: boolean;

  oemCheck: boolean = true;
  oemCheckAcc: boolean = true;
  oemCheckspeed: boolean = true;
  oemCheckwarr: boolean = true;
  oemCheckEnergy: boolean = true;

  nameCheck: boolean = false;  
  ifscCheck: boolean = true;

  oemcheck: boolean = true;

  twoWheelerCheck: boolean = true;
  applNo!: string;

  checkBankDetails!: boolean;

  dialogMsg: string = '';

  userStatus: UserStatus = new UserStatus();

  resentBtnCheck = true;
  accountType: any;

  changeCheck(event: MatCheckboxChange) {
    this.disabledAgreement = !event.checked;
  }

  changeCheckSubmit(event: { checked: any }) {
    this.submitCheck = !event.checked;
  }

  constructor(
    private registrationService: RegistrationService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.interval = setInterval(
      () => {
        if (this.time != 0) {
          this.time--;
        } else {
          this.time = 0;
          this.resentBtnCheck = false;
        }
      },
      1000,
      (this.resentBtnCheck = false)
    );
    this.resentBtnCheck = false;

    this.registrationService.findAllBankNames().subscribe((data: any) => {
      console.log("hit Bank");
      this.bankNames = data;
    });
  }

  createForm() {
    this.bankDetails = this.fb.group({
      regnNo: this.regn_no,
      bankName: [null],
      accType: [null],
      branchName: [null],
      name: [null],
      accNo: [null],
      ifscCode: [null],
      opDt: new Date(),
      passbookImg: [null],
    });
  }

  onSendOtp() {
    this.registrationService
      .getOtp(this.regn_no.value, this.mobile_no)
      .subscribe((data: any) => {
        console.log(data);
        (this.otp = data), (this.sendOtpFirst = true);
      });
  }

  onSubmitOtp(dialogCommon2: any, dialogCommon: any) {
    let date = new Date('2021-08-31');
    let purchaseDt;

    if (this.otp == this.enteredOtp.value) {
      this.registrationService
        .getVehicleDetials(this.regn_no.value)
        .subscribe((data: any) => {
          this.vehicleDetails = data;
          purchaseDt = new Date(this.vehicleDetails.purchaseDt);

          if (purchaseDt < date) {
            this.dialogMsg =
              'You are not eligible for subsidy under Odisha Electric Vehicle policy 2021 as purchase date of your vehicle is before 1st September 2021';
            this.dialog.open(dialogCommon2);
          } else {
            if (
              this.vehicleDetails.vClass == 'M-Cycle/Scooter-With Side Car' ||
              this.vehicleDetails.vClass == 'M-Cycle/Scooter' ||
              this.vehicleDetails.vClass == 'Moped' ||
              this.vehicleDetails.vClass == 'Motorised Cycle (CC > 25cc)' ||
              data.v_class == 'Motor Cycle/Scooter-SideCar(T)' ||
              data.v_class == 'Motor Cycle/Scooter-Used For Hire'
            ) {
              this.twoWheelerCheck = true;
              this.registrationService
                .getOemValidate(this.vehicleDetails.vmodel)
                .subscribe((data: any) => {
                  if (data == null) {
                    this.oemcheck = false;
                    this.dialogMsg =
                      'Either this model is not registered by manufacturer or not meeting the technical specification 4.1.7 of Odisha EV Policy 2021, kindly contact to the manufacturer';
                    this.dialog.open(dialogCommon);
                  } else {
                    this.oemValidate = data;

                    if (this.oemValidate.minTopSpeed < 40) {
                      this._snackBar.open(
                        'The Top Speed criteria >= 40 is not meeting by your vehicle for subsidy of 4.1.7 of Odisha EV Policy 2021',
                        'Close'
                      );
                      this.oemCheck = false;
                      this.oemCheckspeed = false;
                    }
                    if (this.oemValidate.minAcceleration < 0.65) {
                      this._snackBar.open(
                        'The Minimum Acceleration criteria >= 0.65 is not meeting by your vehicle for subsidy of 4.1.7 of Odisha EV Policy 2021',
                        'Close'
                      );
                      this.oemCheck = false;
                      this.oemCheckAcc = false;
                    }
                    if (this.oemValidate.warranty < 3) {
                      this._snackBar.open(
                        'The Warranty criteria >= 3 is not meeting by your vehicle for subsidy of 4.1.7 of Odisha EV Policy 2021',
                        'Close'
                      );
                      this.oemCheck = false;
                      this.oemCheckwarr = false;
                    }
                    if (this.oemValidate.maxEnergyConsumption > 7) {
                      this._snackBar.open(
                        'The Maximum Energy Consumption criteria < 7 is not meeting by your vehicle for subsidy of 4.1.7 of Odisha EV Policy 2021',
                        'Close'
                      );
                      this.oemCheck = false;
                      this.oemCheckEnergy = false;
                    }
                    if (
                      !this.oemCheckwarr ||
                      !this.oemCheckspeed ||
                      !this.oemCheckAcc ||
                      !this.oemCheckEnergy
                    ) {
                      this.oemCheck = false;
                    } else {
                      this.oemCheck = true;
                    }
                  }
                });
            } else {
              this.twoWheelerCheck = false;
            }
          }
          this.skeletonFlag = false;
        });
      this.sendOtpFirst = false;
      this.confirmDetails = true;
      this.regChasCheck = false;
      this.confirmDetailsCheck = true;
    } else {
      this.otpNotMatched = true;
    }
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
    this.vehicleDetails.op_dt = new Date();
    this.registrationService
      .checkRegnExist(this.regn_no.value)
      .subscribe((data: any) => {
        if (data == null) {
          this.check = true;
          if (this.oemCheck) {
            this.registrationService
              .insertVehicleDetails(this.vehicleDetails)
              .subscribe((data: any) => {
                (this.vehicleDetails = data), (this.bankCheck = true);
                this.confirmDetailsCheck = false;
              });
          } else {
            this._snackBar.open(
              'Your vehicle is not qualified in OEM validation.',
              'Close'
            );
          }
        } else {
          this.check = false;
          this.bankCheck = true;
          this.confirmDetailsCheck = false;
          this.dialogMsg = 'You have already verified your details';
          this.dialog.open(dialogCommon);
        }
      });
  }

  onChangeBank(bank: any) {
    console.log(this.branchList.length)
    console.log(this.bankDetails.value.ifscCode == null)
    this.registrationService.getAllBankDetailByBankName(bank.value).subscribe((data: any) => {
      this.branchList = data;
    })
    // this.branchName = this.bankNames.filter(data => data.branch == value.target.value)?.branch;
  }

  openConfirmDialog(confirm: any, element: any) {
    this.accountType = element;
    this.dialog.open(confirm);
    console.log(element)
  }


  confirmOption() {
    this.dialog.closeAll();
  }

  cancelDialog() {
    this.bankDetails.controls['accType'].reset();
    this.dialog.closeAll();
  }

  onChangeBranch(branch: any) {
    console.log(branch)
    console.log(branch.value.ifsc)
    this.branchName = branch.value.branch
    this.bankDetails.controls["ifscCode"].setValue(branch.value.ifsc);
  }

  uploadFile(event: any) {
    this.uploadedFile = event.target.files[0].name;
  }

  onChassisEnter() {
    if (this.chasi_no.valid) {
      this.registrationService
        .getRegnChasiVerify(this.regn_no.value, this.chasi_no.value)
        .subscribe((data: any) => {
          this.mobile_no = data;
          if (this.mobile_no == null) {
            this.chasiFlag = false;
          } else {
            this.sendOtp = false;
            this.chasiFlag = true;
          }
        });
    } else {
      this.sendOtp = true;
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
    if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/jpg') {
      this.submitCheck = false;
      this.uploadedFile = event.target.files[0].name;
      reader.onload = (e: any) => {
        const bytes = e.target.result.split('base64,')[1];
        this.passbookImg = bytes;
      };
      reader.readAsDataURL(file);
    } else {
      this._snackBar.open('Upload file type is not supported', 'Close');
    }
  }

  getOffCdNumberToPlace(offCd: string) {
    let place;

    switch (offCd) {
      case '1':
        place = 'Balasore';
        break;
      case '2':
        place = 'Bhubaneswar-I';
        break;
      case '3':
        place = 'Bolangir';
        break;
      case '4':
        place = 'Chandikhol';
        break;
      case '5':
        place = 'Cuttack';
        break;
      case '6':
        place = 'Dhenkanal';
        break;
      case '7':
        place = 'Ganjam';
        break;
      case '8':
        place = 'Kalahandi';
        break;
      case '9':
        place = 'Keonjhar';
        break;
      case '10':
        place = 'Koraput';
        break;
      case '11':
        place = 'Mayurbhanj';
        break;
      case '12':
        place = 'Phulabani';
        break;
      case '13':
        place = 'Puri';
        break;
      case '14':
        place = 'Rourkela';
        break;
      case '15':
        place = 'Sambalpur';
        break;
      case '16':
        place = 'Sundergarh';
        break;
      case '17':
        place = 'Baragarh';
        break;
      case '18':
        place = 'Rayagada';
        break;
      case '19':
        place = 'Angul';
        break;
      case '20':
        place = 'Gajapati';
        break;
      case '21':
        place = 'Jagatsinghpur';
        break;
      case '22':
        place = 'Bhadrak';
        break;
      case '23':
        place = 'Jharsuguda';
        break;
      case '24':
        place = 'Nabarangpur';
        break;
      case '25':
        place = 'Nayagarh';
        break;
      case '26':
        place = 'Nuapada';
        break;
      case '27':
        place = 'Boudh';
        break;
      case '28':
        place = 'Debagarh';
        break;
      case '29':
        place = 'Kendrapada';
        break;
      case '30':
        place = 'Malkangiri';
        break;
      case '31':
        place = 'Sonepur';
        break;
      case '32':
        place = 'Bhanjanagar';
        break;
      case '33':
        place = 'Bhubaneswar-II';
        break;
      case '34':
        place = 'Jajpur';
        break;
      case '35':
        place = 'Talcher';
        break;
      case '111':
        place = 'ARTO Rairangpur';
        break;
      case '201':
        place = 'ARTO Khordha';
        break;
      case '901':
        place = 'ARTO Barbil';
        break;
    }

    return place;
  }

  onSaveBankDetails(dialogCommon2: any, dialogCommon: any) {
    let reg = this.regn_no.value;
    this.bankInfo = this.bankDetails.value;
    this.bankInfo.branchName = this.branchName;
    console.log(this.bankInfo)
    this.bankInfo.passbookImg = this.passbookImg;

    if (this.bankInfo.bankName == null) {
      this._snackBar.open('Please select Bank Name', 'Close');
    } else if (this.bankInfo.branchName == null) {
      this._snackBar.open('Please enter Branch Name', 'Close');
    } else if (this.bankInfo.accNo == null) {
      this._snackBar.open('Please enter Bank Account Number', 'Close');
    } else if (this.bankInfo.ifscCode == null) {
      this._snackBar.open('Please enter IFSC Code', 'Close');
    } else if (this.bankInfo.passbookImg == null) {
      this._snackBar.open('Please Upload Passbook Image', 'Close');
    }
    else if (this.bankInfo.accType == null) {
      this._snackBar.open('Please Select Account Type', 'Close');
    }
    // else{
    //   this.registrationService.checkBankDetailsExist(reg).subscribe((data: any) => {
    //     if (data == null) {
    //       this.checkBankDetails = true;
    //       let temp = this.regn_no.value;
    //       // this.registrationService.getApplNo(temp).subscribe((data:any)=>{this.applNo = data})
    //       this.registrationService.getApplNo(temp).subscribe((data: any) => {
    //         this.applNo = data.applNo,
    //           this.bankInfo.applNo = this.applNo,
    //           this.registrationService.insertBankDetails(this.bankInfo).subscribe((data: any) => {
    //             this.registrationService.findUserStatusByRegnNo(this.regn_no.value).subscribe((data: any) => {
    //               if (data == null) {
    //                 this.userStatus.regnNo = this.regn_no.value
    //                 this.userStatus.applNo = this.applNo
    //                 this.userStatus.userRegistered = "y"
    //                 this.userStatus.opDt = new Date()
    //                 this.registrationService.insertUserStatus(this.userStatus).subscribe((data: any) => {
    //                   this.registrationService.sendSuccessRegistrationMsg(this.applNo,reg,this.getOffCdNumberToPlace(this.vehicleDetails.off_cd),this.vehicleDetails.mob_no).subscribe((data:any)=>{
    //                   })
    //                 })
    //               } else {
    //                 this.userStatus.regnNo = data.regnNo;
    //                 this.registrationService.insertUserStatus(this.userStatus).subscribe((data: any) => {
    //                 })
    //               }
    //             })
    //             this.dialogMsg = "You have successfully registered for Eletric Vehicle subsidy with Application No: ",
    //               this.dialog.open(dialogCommon2)
    //           })
    //       })

    //     } else {

    //       this.registrationService.findUserStatusByRegnNo(this.regn_no.value).subscribe((data: any)=>{
    //         this.userStatus = data;
    //         this.bankInfo.applNo = this.userStatus.applNo;
    //         if(this.userStatus.approval=='rev' || this.userStatus.verification=='rev'){
    //           this.userStatus.regnNo = this.regn_no.value
    //                 this.userStatus.userRegistered = "y"
    //                 this.userStatus.approval = null;
    //                 this.userStatus.verification = null;
    //                 this.userStatus.reason = null;
    //                 this.userStatus.sub_amnt = null;
    //                 this.userStatus.opDt = new Date()

    //                 this.registrationService.insertUserStatus(this.userStatus).subscribe((data: any) => {

    //                   this.registrationService.insertBankDetails(this.bankInfo).subscribe((data: any) => {
    //                   })
    //                   this.dialogMsg = "Corrected data updated successfully";
    //                   this.dialog.open(dialogCommon)
    //                 });
    //         }else{

    //           this.checkBankDetails = false
    //       this.dialogMsg = "You have already registered. Check your status for further information. ",
    //         this.dialog.open(dialogCommon)
    //         }
    //       })

    //     }
    //   })
    // }
    else {
      this.registrationService
        .checkBankAndStatusDetails(reg)
        .subscribe((data: any) => {
          if (data.regn_no == undefined) {
            this.checkBankDetails = true;
            let temp = this.regn_no.value;
            this.registrationService
              .getApplNo(temp)
              .subscribe((appldata: any) => {
                (this.applNo = appldata.applNo),
                  (this.bankInfo.applNo = this.applNo);
                  this.bankInfo.opDt = new Date();
                this.userStatus = new UserStatus();
                this.userStatus.regnNo = temp;
                this.userStatus.applNo = this.applNo;
                this.userStatus.userRegistered = 'y';
                this.userStatus.opDt = new Date();
                //insert bank and status details using single api
                this.registrationService
                  .insertBankAndStatusDetails(this.userStatus, this.bankInfo)
                  .subscribe(
                    (data: any) => {
                      this.registrationService
                        .sendSuccessRegistrationMsg(
                          this.applNo,
                          reg,
                          this.getOffCdNumberToPlace(
                            this.vehicleDetails.off_cd
                          ),
                          this.vehicleDetails.mob_no
                        )
                        .subscribe((data: any) => {
                          (this.dialogMsg =
                            'You have successfully registered for Eletric Vehicle subsidy with Application No: '),
                            this.dialog.open(dialogCommon2);
                        });
                    },
                    (err: any) => {
                      this.dialogMsg =
                        'Registration for Eletric Vehicle subsidy failed';
                      this.dialog.open(dialogCommon);
                    }
                  );
              });
          } else {
            this.bankInfo.applNo = data.appl_no;
            this.bankInfo.opDt = new Date();
            if (data.approval == 'rev' || data.verification == 'rev') {
              this.userStatus.regnNo = this.regn_no.value;
              this.userStatus.applNo = data.appl_no;
              this.userStatus.userRegistered = 'y';
              this.userStatus.approval = null;
              this.userStatus.verification = null;
              this.userStatus.reason = null;
              this.userStatus.sub_amnt = null;
              this.userStatus.opDt = new Date();
              //update status and bank details using single api
              console.log(this.bankInfo)
              this.registrationService
                .insertBankAndStatusDetails(this.userStatus, this.bankInfo)
                .subscribe(
                  (data: any) => {
                    this.dialogMsg = 'Corrected data updated successfully';
                    this.dialog.open(dialogCommon);
                  },
                  (err: any) => {
                    this.dialogMsg = 'Corrected data updation failed';
                    this.dialog.open(dialogCommon);
                  }
                );
            } else {
              this.checkBankDetails = false;
              (this.dialogMsg =
                'You have already registered. Check your status for further information. '),
                this.dialog.open(dialogCommon);
            }
          }
        });
    }
  }

  checkAccName() {
    console.log(this.vehicleDetails.ownerName === this.bankDetails.value.name);

    if (this.vehicleDetails.ownerName === this.bankDetails.value.name) {
      console.log("namecheck true")
      this.nameCheck = true;
    } else {
      this.nameCheck = false;
    }
  }

  checkIFSCCode(dialogCommon: any) {
    this.ifscCheck = false;
    if (this.bankDetails.value.ifscCode.length == 11) {
      this.registrationService
        .getIFSCCodeVerify(this.bankDetails.value.ifscCode)
        .subscribe((data: any) => {
          if (data == null) {
            this.ifscCheck = false;
            console.log("invalid IFSC code");
            (this.dialogMsg =
              'Invalid IFSC Code. '),
              this.dialog.open(dialogCommon);
          } else {
            if (data.ifsc == this.bankDetails.value.ifscCode) {
              console.log("valid IFSC code");
              this.ifscCheck = true;
            } else {
              this.ifscCheck = false;
              console.log("invalid IFSC code");
              (this.dialogMsg =
                'Invalid IFSC Code. '),
                this.dialog.open(dialogCommon);
            }
          }
        });
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
    console.log('=====>');
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
    const minutes: number = value - hours * 60;

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
}
