import { SanctionOrder } from './sanctionOrder';

import { ApprovalService } from './approval.service';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {ActivatedRoute} from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import  jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserStatus } from './userStatus';
import { VehicleDetails } from './vehicleDetails';
import { BankDetailsToDelete } from './bankDetails';
import { FormControl, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css']
})
export class ApproveComponent implements OnInit {


  elementObj: any;


  reason : any;
  otherReason: any;
  off_cd : any;

  rejectBool: boolean = true;
  cofirmRejectbool: boolean = true;
  username !: string;
  passbook : any;
  buttonCheck : boolean = true;
  searchBool: boolean = true;

  subsidy_amnt !: number;
  cheq_no : string = "";


  statusDetails : UserStatus = new UserStatus();
  VehicleDetails : VehicleDetails = new VehicleDetails();
  bankDetails : BankDetailsToDelete = new BankDetailsToDelete();

  fromDate!: Date;
  toDate !: Date;

  approvalDate !: Date;

  appl_no = new FormControl('',
    [ Validators.required]);

  rtoName !: any;


 sanctionOrder : SanctionOrder = new SanctionOrder();

 rejectFinalBool : boolean = false;

  secConfirmbool: boolean = false;
  sanctionOrderBool: boolean = false;

  displayedColumns: string[] = ['Sl No.', 'Application Number', 'Registration Number',
  'Owner Name','Account Number','Branch Name','Fuel','Vehicle Class','Purchase Date', 'Passbook Image','Subsidy Amount','Action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumnsFinal: string[]=['Sl No.', 'Application Number', 'Registration Number', 'Owner Name','Account Number','IFSC Code','Bank Name','Subsidy Amount','Contact Number'];
  finalDataSource: MatTableDataSource<any> = new MatTableDataSource();

  disburseDataSource: MatTableDataSource<any> = new MatTableDataSource();
  disbusereColumns : string[]=['Sl No.', 'Application Number', 'Registration Number', 'Owner Name','Account Number','IFSC Code','Bank Name','Contact Number','Select'];

  reasons = ["Owner Name mismatched","Passbook Image not visible properly","Wrong account information","Other"];

  selection = new SelectionModel<any>(true, []);
  constructor(private routes: ActivatedRoute, private approvalService: ApprovalService, private dialogImage: MatDialog, private datepipe: DatePipe) { }


  list : string[]=[];


  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  ngOnInit(): void {
    this.username = this.routes.snapshot.params["username"]
    // console.log(this.routes.snapshot.params["username"])
    this.off_cd = window.sessionStorage.getItem("off_cd");


    this.approvalService.getToApproveList(this.off_cd).subscribe((data: any)=>{
      this.dataSource = new MatTableDataSource(data),
      this.dataSource.paginator = this.paginator.toArray()[0];



    } )

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

  approveButton(element: any,confirm: any){

    this.elementObj = element;


    console.log(this.elementObj.sale_amnt);

    let sale_amnt = this.elementObj.sale_amnt;
    let subsidy_amnt_temp = 0;
    subsidy_amnt_temp = sale_amnt*(15/100);
    console.log(subsidy_amnt_temp)

    if(this.elementObj.v_class=='M-Cycle/Scooter-With Side Car' || this.elementObj.v_class=='M-Cycle/Scooter' || this.elementObj.v_class=='Moped'){

      if(subsidy_amnt_temp>=5000){

        this.subsidy_amnt = 5000;
      }else{
        this.subsidy_amnt = subsidy_amnt_temp;
      }
    }else if(this.elementObj.v_class=='Three Wheeler (Passenger)' || this.elementObj.v_class=='Three Wheeler (Goods)'){
      if(subsidy_amnt_temp>=10000){

        this.subsidy_amnt = 10000;
      }else{
        this.subsidy_amnt = subsidy_amnt_temp;
      }
    }else{
      if(subsidy_amnt_temp>=50000){

        this.subsidy_amnt = 50000;
      }else{
        this.subsidy_amnt = subsidy_amnt_temp;
      }
    }


    this.dialogImage.open(confirm,{ width:'50%'});

    // this.approvalService.updateApprovalStatus(element.regn_no,this.username).subscribe((data:any)=>{

    //   element.approval = 'y';

    //   this.approvalService.getFinalApprovalList().subscribe((data: any)=>{
    //     this.finalDataSource = new MatTableDataSource(data),
    //     this.finalDataSource.paginator = this.paginator;
    //   })
    // })


  }

  buttonChange(element: any){


    console.log(element)
    if(element.approval == 'y'){
      return false;
    }else{
      return true;
    }
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

  exportToPDF(){

    let office = this.getOffCdNumberToPlace(this.off_cd);



    let row = 1;

    let arList: any[][] = [];
    let header = [
      [
        'Sl No.',
        'Application Number',
        'Registration Number',
        'Applicant Name',
        'Bank Account Number',
        'Bank IFSC Code',
        'Bank Name',
        'Subsidy Amount',
        'Contact Number'

      ],
    ];

    let prepare: any[][] =[];
    this.finalDataSource.data.forEach((e) =>{
//update download status service

      this.approvalService.getUpdateDownloadStatus(e.regn_no).subscribe((data: any)=>{},(err: any)=>console.log(err))


      var tempObj = [];

      tempObj.push(row);
      tempObj.push(e.appl_no);
      tempObj.push(e.regn_no);
      tempObj.push(e.owner_name);
      tempObj.push(e.acc_no);
      tempObj.push(e.ifsc_code);
      tempObj.push(e.bank_name);
      tempObj.push(e.sub_amnt);
      tempObj.push(e.mob_no);
      prepare.push(tempObj);
      row=row + 1;
    });

    let today = new Date();
    let td = today.toDateString();

    var pdf = new jsPDF({orientation: 'landscape',unit:'pt', });


    function footer(){

      pdf.text('Signature:_____________',196,285,{align: 'right'})
    }


    let dt = this.datepipe.transform(this.fromDate, 'dd/MM/yyyy');

    pdf.setFontSize(14);
    pdf.text('Regional Transport Office, '+office,pdf.internal.pageSize.getWidth()/2,20,{align:'center'});
    pdf.text('Electric Vehicle Eligible Applicant List for Subsidy',pdf.internal.pageSize.getWidth()/2,50,{align: 'center'});
    pdf.line(265, 60, 578, 60);
    pdf.text('To,______________________ Bank',20,85,{align: 'left'});
    pdf.text('Approve Date: '+dt,pdf.internal.pageSize.getWidth()/1.1,85,{align: 'right'});

    (pdf as any).autoTable({
      head: header,
      body: prepare,
      margin: {top: 110, bottom: 50}

    });


    let final = (pdf as any).autoTable.previous.finalY;
    // footer();

    pdf.setFontSize(10);
    pdf.text('Signature of RTO, '+office,pdf.internal.pageSize.getWidth()/1.1,final+50,{align: 'right'})

    pdf.text('Date:_____________',pdf.internal.pageSize.getWidth()/1.1,final+70,{align: 'right' })



    pdf.save(today+'_FinalList'+'.pdf');
  }

  confirmButton(){

    this.cofirmRejectbool = false;
    let approvalStatus = "y";
    this.elementObj.approval = 'y';

    if(this.reason == 'Other'){
      this.reason = this.otherReason;

      this.elementObj.approval = 'rev';
    }

    if(this.reason != null){
      approvalStatus = 'rev';

      this.elementObj.approval = 'rev';
    }

    console.log(this.cheq_no);

    this.approvalService.updateApprovalStatus(this.elementObj.regn_no,this.username,this.reason,approvalStatus,this.cheq_no,this.getSubsidyAmount(this.elementObj)).subscribe((data:any)=>{

      if(this.reason == null){
        this.approvalService.sendApprovedMsg(this.elementObj.appl_no,this.getOffCdNumberToPlace(this.off_cd),this.elementObj.mob_no).subscribe((data:any)=>{
          console.log(data)
        })
      }else{

        this.approvalService.sendRevertedMsg(this.elementObj.appl_no,this.getOffCdNumberToPlace(this.off_cd),this.elementObj.mob_no,this.reason,this.elementObj.regn_no).subscribe((data:any)=>{
          console.log(data);
        })
      }


      // console.log(regn),
      this.buttonCheck = false;

      this.dialogImage.closeAll();
    })




  }

  rejectButton(){
    // this.elementObj.approval = 'n'

    this.cofirmRejectbool = false;
    let approvalStatus = "y";
    this.elementObj.approval = 'rejected';

    if(this.reason == 'Other'){
      this.reason = this.otherReason;

      this.elementObj.approval = 'rejected';
    }

    if(this.reason != null){
      approvalStatus = 'rejected';

      this.elementObj.approval = 'rejected';
    }

    console.log(this.cheq_no);

    this.approvalService.updateApprovalStatus(this.elementObj.regn_no,this.username,this.reason,approvalStatus,this.cheq_no,this.subsidy_amnt).subscribe((data:any)=>{

    console.log(this.cheq_no);
      // console.log(regn),
      this.buttonCheck = false;

      this.approvalService.getStatus(this.elementObj.regn_no).subscribe((data: any) => {

        this.statusDetails = data;
        this.statusDetails.insertDt = new Date();
        this.statusDetails.approval = "rejected";
        this.approvalService.insertToUserStatusHistory(this.statusDetails).subscribe((data: any)=> {
          console.log("data inserted to history");


          this.approvalService.getBankDetailsToDelete(this.elementObj.regn_no).subscribe((data : any)=>{

            this.bankDetails = data;

            console.log(this.bankDetails)

            this.bankDetails.insertDt = new Date();

            this.approvalService.insertToBankDetailsHistory(this.bankDetails).subscribe((data:any)=>{
              console.log("data inserted to bank history");

              this.approvalService.getVehicleDetailsToDelete(this.elementObj.regn_no).subscribe((data:any)=>{
                this.VehicleDetails = data;
                this.VehicleDetails.insertDt = new Date();
                console.log(data)

                this.approvalService.insertToVehicleDetailsHistory(this.VehicleDetails).subscribe((data : any)=>{
                  console.log(data)
                  this.approvalService.deleteFromVehicleDetails(this.elementObj.regn_no).subscribe((data:any)=>{
                console.log(data)

                this.approvalService.deleteFromBankDetails(this.elementObj.regn_no).subscribe((data: any)=>{
                  console.log("deleted bank details")
                  this.approvalService.deleteFromUserStatus(this.elementObj.regn_no).subscribe((data:any)=>{
                    console.log(data)

                    this.approvalService.sendRejectedMsg(this.elementObj.appl_no,this.getOffCdNumberToPlace(this.off_cd),this.elementObj.mob_no,this.reason,this.elementObj.regn_no).subscribe((data:any)=>{
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

      })


      this.dialogImage.closeAll();
    })







    this.dialogImage.closeAll();



  }
  onSelect(event: any){
    this.reason = event;
  }

  onSearch(){

    this.searchBool = false;


    this.approvalService.getFinalApprovalList(this.fromDate, this.off_cd).subscribe((data: any)=>{
      this.finalDataSource = new MatTableDataSource(data),
      this.rtoName = this.getOffCdNumberToPlace(this.off_cd);
      // if(data == null){


      // }else{
      //   this.searchBool = false;
      // }

      console.log(data)
      this.finalDataSource.paginator = this.paginator.toArray()[1];
    })
  }

  onRevert(){
    this.rejectBool = false;
  }

  onYesNo(dialogYesNo: any){
    this.dialogImage.open(dialogYesNo);


  }

  onChequeEnter(){
    if(this.cheq_no.length > 4 && this.subsidy_amnt != null){
      this.secConfirmbool = true;
    }else{
      this.secConfirmbool = false;
    }
  }

  onSearchForSanctionOrder(){
    this.approvalService.getSanctionOrder(this.appl_no.value).subscribe((data:any)=>{
      this.sanctionOrder = data;

      this.rtoName = this.getOffCdNumberToPlace(this.off_cd);
      this.sanctionOrderBool = true;

    })

  }

  onPrint(){

    this.approvalService.updatePaymentStatus(this.sanctionOrder.appl_no).subscribe((data:any)=>{
      console.log("payment status update");
    })
  }

  onReject(){
    this.rejectBool = false;
    this.rejectFinalBool = true;
  }

  onSearchForDisbursement(){
    this.searchBool = false;

    this.approvalService.getFinalDisbursementList(this.approvalDate, this.off_cd).subscribe((data: any)=>{
      this.disburseDataSource = new MatTableDataSource(data),


      this.disburseDataSource.paginator = this.paginator.toArray()[2];
    })
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.disburseDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.disburseDataSource.data.forEach(row => this.selection.select(row));
  }

  onSubmitDisbursement(dialogUpdate: any){
    console.log(this.list);

    this.approvalService.updateDisbursementStatus(this.list).subscribe((data:any)=>{
      console.log(data);
      this.dialogImage.open(dialogUpdate);

      // this.onSearchForDisbursement();

    })

  }
  onCheck(event:any,data:any,c:any){
    event.stopPropagation()
    console.log(c.checked);

    if(c.checked == false){

      this.list.push(data.regn_no)
    }else{

      this.list.splice(this.list.indexOf(data), 1);

    }

    console.log(this.list);


  }

  onAllSelect(c:any){
    // console.log(this.disburseDataSource.data)
    if(c.checked == false){
      console.log(this.disburseDataSource.data)
      this.disburseDataSource.data.forEach((row) => this.list.push(row.regn_no))



    }else{
      this.list = [];
    }
  }

  getSubsidyAmount(data: any){
    let temp = (data.sale_amnt)*(15/100);

    if(data.v_class=='M-Cycle/Scooter-With Side Car' || data.v_class=='M-Cycle/Scooter' || data.v_class=='Moped'){

      if(temp>=5000){

        this.subsidy_amnt = 5000;
      }else{
        this.subsidy_amnt = temp;
      }
    }else if(data.v_class=='Three Wheeler (Passenger)' || data.v_class=='Three Wheeler (Goods)'){
      if(temp>=10000){

        this.subsidy_amnt = 10000;
      }else{
        this.subsidy_amnt = temp;
      }
    }else{
      if(temp>=50000){

        this.subsidy_amnt = 50000;
      }else{
        this.subsidy_amnt = temp;
      }
    }
    return this.subsidy_amnt;
  }

}

