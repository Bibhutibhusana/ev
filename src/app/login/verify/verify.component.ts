import { BankDetailsToDelete } from './bankDetails';
import { VehicleDetails } from './vehicleDetails';

import { MatDialog } from '@angular/material/dialog';
import { VerifyService } from './verify.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserStatus } from './userStatus';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {


  username!: string
  off_cd : any;

  buttonCheck : boolean = true;

  elementObj: any;

  rejectFinalBool: boolean= false;
  reason : any;
  otherReason: any;


  rejectBool: boolean = true;
  cofirmRejectbool: boolean = true;

  statusDetails : UserStatus = new UserStatus();
  VehicleDetails : VehicleDetails = new VehicleDetails();
  bankDetails : BankDetailsToDelete = new BankDetailsToDelete();

  passbook : any;
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

  displayedColumns: string[] = ['Sl No.', 'Application Number', 'Registration Number',
  'Owner Name','Account Number','Branch Name','Fuel','Vehicle Class','Purchase Date', 'Passbook Image','Action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  reasons = ["Owner Name mismatched","Passbook Image not visible properly","Wrong account information","Other"];

  flag : number = 1;

  @ViewChild(MatPaginator) paginator !: MatPaginator;

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  constructor(private routes: ActivatedRoute, private verifyService: VerifyService, private dialogImage: MatDialog) { }

  ngOnInit(): void {
    this.username = this.routes.snapshot.params["username"]

    this.off_cd = window.sessionStorage.getItem("off_cd");
    console.log(this.off_cd);


    this.verifyService.getToVerifyList(this.off_cd).subscribe((data: any)=>{
      this.dataSource = new MatTableDataSource(data),

      console.log(data)
      this.dataSource.paginator = this.paginator;

      // console.log(data)

    } )




    // this.verifyService.getToVerifyList().subscribe((data:any)=>this.dataSource = new MatTableDataSource(data))
  }

  getImage(img: any,imagePopup: any){

    // console.log(img)

    this.passbook = "data:image/jpg;base64,"+img;
    this.dialogImage.open(imagePopup,{height: '40%'})

  }

  closeDialog() {
    // window.location.reload();
    this.rejectBool = true;
    this.rejectFinalBool = false;
    this.reason = null;
    this.dialogImage.closeAll();

  }

  verifyButton(element:any,confirm: any){

    this.elementObj = element;

    this.dialogImage.open(confirm,{ width:'50%'});


    // this.verifyService.updateVerificationStatus(element.regn_no,this.username).subscribe((data:any)=>{
    //   // console.log(regn),
    //   this.buttonCheck = false;
    //   element.verification = 'y';
    // })


  }

  confirmButton(){

    this.cofirmRejectbool = false;
    let verificationStatus = "y";
    this.elementObj.verification = 'y'

    if(this.reason == 'Other'){
      this.reason = this.otherReason;
    }

    if(this.reason != null){
      verificationStatus = 'rev';
      this.elementObj.verification = 'rev'
    }


    this.verifyService.updateVerificationStatus(this.elementObj.regn_no,this.username,this.reason,verificationStatus).subscribe((data:any)=>{

      this.buttonCheck = false;
      console.log("in confirm");

      if(this.reason != null){

        this.verifyService.sendRevertedMsg(this.elementObj.appl_no,this.getOffCdNumberToPlace(this.off_cd),this.elementObj.mob_no,this.reason,this.elementObj.regn_no).subscribe((data:any)=>{
          console.log(data);
        })
      }
      // this.elementObj.verification = 'y';
      this.dialogImage.closeAll();
    })




  }

  buttonChange(element: any){


    // console.log(element)
    if(element.verification == 'y'){
      return false;
    }else{
      return true;
    }
  }

  rejectButton(){


    this.elementObj.verification = 'n'

    this.cofirmRejectbool = false;
    let verificationStatus = "y";
    this.elementObj.verification = 'rejected'

    if(this.reason == 'Other'){
      this.reason = this.otherReason;
      verificationStatus = 'rejected';
      this.elementObj.verification = 'rejected'
    }

    if(this.reason != null){
      verificationStatus = 'rejected';
      this.elementObj.verification = 'rejected'
    }


    this.verifyService.updateVerificationStatus(this.elementObj.regn_no,this.username,this.reason,verificationStatus).subscribe((data:any)=>{

      this.buttonCheck = false;
      console.log("in confirm");
      // this.elementObj.verification = 'y';

      this.verifyService.getStatus(this.elementObj.regn_no).subscribe((data: any) => {

        console.log("in reject")
        console.log(data);

        this.statusDetails = data;
        this.statusDetails.insertDt = new Date();
        this.statusDetails.verification = "rejected";
        this.verifyService.insertToUserStatusHistory(this.statusDetails).subscribe((data: any)=> {
          console.log("data inserted to history");


          this.verifyService.getBankDetailsToDelete(this.elementObj.regn_no).subscribe((data : any)=>{

            this.bankDetails = data;

            console.log(this.bankDetails)

            this.bankDetails.insertDt = new Date();

            this.verifyService.insertToBankDetailsHistory(this.bankDetails).subscribe((data:any)=>{
              console.log("data inserted to bank history");

              this.verifyService.getVehicleDetailsToDelete(this.elementObj.regn_no).subscribe((data:any)=>{
                this.VehicleDetails = data;
                this.VehicleDetails.insertDt = new Date();
                console.log(data)

                this.verifyService.insertToVehicleDetailsHistory(this.VehicleDetails).subscribe((data : any)=>{
                  console.log(data)
                  this.verifyService.deleteFromVehicleDetails(this.elementObj.regn_no).subscribe((data:any)=>{
                console.log(data)

                this.verifyService.deleteFromBankDetails(this.elementObj.regn_no).subscribe((data: any)=>{
                  console.log("deleted bank details")
                  this.verifyService.deleteFromUserStatus(this.elementObj.regn_no).subscribe((data:any)=>{
                    console.log(data);
                    this.verifyService.sendRejectedMsg(this.elementObj.appl_no,this.getOffCdNumberToPlace(this.off_cd),this.elementObj.mob_no,this.reason,this.elementObj.regn_no).subscribe((data:any)=>{
                      console.log(data);
                    })
                  })
                })
              })
                })



              })




            })


          })


        })

     });
      this.dialogImage.closeAll();
    })



   console.log(this.buttonCheck)





    this.dialogImage.closeAll();



  }
//   rejectConfirmButton(){

//     this.cofirmRejectbool = false;

//     if(this.reason == 'Other'){
//       this.reason = this.otherReason;
//     }

// console.log(this.reason);

//     this.dialogImage.closeAll();
//   }

  onSelect(event: any){
    this.reason = event;
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


  onRevert(){
    this.rejectBool = false;
  }

  onYesNo(dialogYesNo: any){
    this.dialogImage.open(dialogYesNo);

  }

  onReject(){
    this.rejectBool = false;
    this.rejectFinalBool = true;
  }

}

