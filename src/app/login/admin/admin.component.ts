import { ReportModel } from './reportModel';
import { AdminService } from './admin.service';
import { Component, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/overlay/overlay-directives';
import { MatPaginator } from '@angular/material/paginator';
import {UntypedFormBuilder, FormControl, UntypedFormGroup, Validators} from "@angular/forms";
// Added By Abinash on 10.05.2022 start 1
import { RTOClass } from './rto-class';
import { StatusService } from 'src/app/main-contained/status/status.service';
import { MatRadioChange } from '@angular/material/radio';
import { RegistrationService } from 'src/app/main-contained/service-info/registration/registration.service';
// Added By Abinash on 10.05.2022 end 1
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  username !: string;

  fromDate !: Date;
  toDate !: Date;
  reportOptionSelect !: string;
  reportOptionBool : boolean = false;
  off_cd : any;
  // Added By Abinash on 10.05.2022 start 2
  rtoSelect: string = '0';
  rtoList: Array<RTOClass> = [];
  rtoDataList: Array<RTOClass> = [];
  rto: RTOClass = new RTOClass();
   // Added By Abinash on 10.05.2022 end 2
  reportModel = new ReportModel();
  selectOption!:any;
  filterForm= new UntypedFormGroup({});
  modelForm=new UntypedFormGroup({});
  dataSourceReport: MatTableDataSource<any> = new MatTableDataSource();
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  dataSourceModel: MatTableDataSource<any> = new MatTableDataSource();
  chasiFlag : boolean = true;
  statusTableFlag : boolean =false;
  statusModelTableFlag:boolean=false;
  reasonBool : boolean = false;
  a:any;
  ModelInfo: any;
  mobile_no !: string;
  displayedColumns: string[] = ['Application Number', 'Registration Number',
  'Owner Name','Bank Account Number','Application Status','Revert Status'];
  displayedColumnsReport: string[]=['Sl No.', 'Application Number', 'Registration Number','Vehicle Class','Owner Name','Bank Account Number','Subsidy Amount','RTO Code'];

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild('MatPaginator1') MatPaginator1!: MatPaginator;

  constructor(private routes: ActivatedRoute, private adminService: AdminService, private snackBar: MatSnackBar, private statusService: StatusService,private fb: UntypedFormBuilder,private router:Router,private registrationService: RegistrationService ) {
   }

  ngOnInit(): void {
    this.username = this.routes.snapshot.params["username"]
    this.off_cd = window.sessionStorage.getItem("off_cd");
    this.rtoSelect="0";
    this.ApplicationStatusForm();
    this.registrationService.getAllEVModelDetails().subscribe((data: any)=>{
      this.dataSourceModel = new MatTableDataSource(data);
      if(this.dataSourceModel != null){
        this.statusModelTableFlag = true;
      }
    })
    if(this.filterForm.value.selectOption=="appl"){
          this.filterForm.controls['appl_no'].setValidators(Validators.required);
          this.filterForm.controls['regn_no'].clearValidators();
          this.filterForm.controls['fr_date'].clearValidators();
          this.filterForm.controls['tr_date'].clearValidators();

          this.filterForm.controls['appl_no'].updateValueAndValidity();
          this.filterForm.controls['regn_no'].updateValueAndValidity();
          this.filterForm.controls['fr_date'].updateValueAndValidity();
          this.filterForm.controls['tr_date'].updateValueAndValidity();
    }
    // Added By Abinash on 10.05.2022 start 3
    let rtoCodeList = this.off_cd.split(',');
    rtoCodeList.forEach((data: any) => {
      this.rto = new RTOClass();
      this.rto.off_cd = data;
      this.rtoList.push(this.rto);
    });
    this.rtoList.filter((data: any) => {
      data.rtoName = this.getOffCdNumberToPlace(data.off_cd);
    });
    this.rtoDataList = this.rtoList;
    // Added By Abinash on 10.05.2022 end 3
    this.a = setTimeout(()=>{
      this.router.navigate(['/login']);
      sessionStorage.clear();
    },180000)
  }
    @HostListener('window:keydown')
    @HostListener('window:mousedown')
    @HostListener('window:keyup')
    @HostListener('window:mouseup')
    @HostListener('window:click')
    @HostListener('window:change')
    @HostListener('window:mousemove')
    checkUserActivity() {
      clearTimeout(this.a);
      this.a  = setTimeout(()=>{
        this.snackBar.open('You are inactive from the last 2 Minutes. You will be Auto logged out from the session if you will not perform any action for next 1 Minute!!!!', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition:'bottom'
        });
        this.callLogOut();
      },120000)
  }
  callLogOut(){
		this.a = setTimeout(()=>{
			//localStorage.removeItem('isLoggedin')
			sessionStorage.clear();
			this.router.navigate(['/login'])
		},60000)
	}
  onSearchForReport(){

this.snackBar.dismiss();

    if(this.reportOptionSelect != null){
      console.log(this.fromDate+" "+this.toDate+" "+this.reportOptionSelect);
      this.adminService.getTotalApplied(this.fromDate,this.toDate,this.reportOptionSelect).subscribe((data: any)=>{
         // Added By Abinash on 10.05.2022 start 4
        let output = this.rtoDataList.map( item => item.off_cd );
        data = data.filter((val:any) => {
          let bool = output.includes(val.off_cd);
          return bool;
        })
         // Added By Abinash on 10.05.2022 end 4
        this.dataSourceReport = data;
        console.log(data);
        // console.log(off_cd);

        if(data.length == 0){
          this.reportOptionBool = false;
          console.log(this.reportOptionBool);
          this.snackBar.open('No record found', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }else{
          this.dataSourceReport.paginator =  this.MatPaginator1;
          this.reportOptionBool = true;
        }
        // console.log(data);
      })
    }else{
      this.snackBar.open('Please select from the drop down.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      console.log(this.fromDate+" "+this.toDate+" "+this.reportOptionSelect);
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
  // Added By Abinash on 10.05.2022 start 5
  checkRtoWise(event:any){
    // console.log(event.value);
     this.rtoDataList = []
     this.rto = new RTOClass();
     this.rto.off_cd = event.value;
     this.rtoDataList.push(this.rto)
     if(event.value == '0' ){
       this.rtoDataList = this.rtoList;
     }
     //console.log(this.rtoSelect)
   }
   // Added By Abinash on 10.05.2022 end 5
   onSubmit(){
     if(this.filterForm.valid)
     {
     if(this.filterForm.value.selectOption != "drng"){
      this.filterForm.value.fr_date = "";
      this.filterForm.value.tr_date = "";
     }
     if(this.filterForm.value.selectOption=="appl"){
      this.filterForm.value.regn_no="";
     }
     else if(this.filterForm.value.selectOption=="regn"){
      this.filterForm.value.appl_no="";
     }
     else{
      this.filterForm.value.regn_no="";
      this.filterForm.value.appl_no="";
     }
    this.statusService.getApplicationStatusByAdmin(this.filterForm.value.regn_no,this.filterForm.value.appl_no,this.filterForm.value.fr_date,this.filterForm.value.tr_date).subscribe((data: any)=>{
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
  }
  ApplicationStatusForm() {
    this.filterForm = this.fb.group({
        fr_date: [''],
        tr_date: [''],
        appl_no:[''],
        regn_no:[''],
        selectOption:['appl',[Validators.required]]
    });
  }
  radioChange(event: MatRadioChange) {
    this.dataSource=new MatTableDataSource();
    switch (event.value) {
        case 'appl':
          this.filterForm.controls['appl_no'].setValidators(Validators.required);
          this.filterForm.controls['regn_no'].clearValidators();
          this.filterForm.controls['fr_date'].clearValidators();
          this.filterForm.controls['tr_date'].clearValidators();

          this.filterForm.controls['appl_no'].updateValueAndValidity();
          this.filterForm.controls['regn_no'].updateValueAndValidity();
          this.filterForm.controls['fr_date'].updateValueAndValidity();
          this.filterForm.controls['tr_date'].updateValueAndValidity();
          this.filterForm.controls['fr_date'].reset();
          this.filterForm.controls['regn_no'].reset();
          this.filterForm.controls['tr_date'].reset();
            break
        case 'regn':
          this.filterForm.controls['regn_no'].setValidators(Validators.required);
          this.filterForm.controls['appl_no'].clearValidators();
          this.filterForm.controls['fr_date'].clearValidators();
          this.filterForm.controls['tr_date'].clearValidators();

          this.filterForm.controls['appl_no'].updateValueAndValidity();
          this.filterForm.controls['regn_no'].updateValueAndValidity();
          this.filterForm.controls['fr_date'].updateValueAndValidity();
          this.filterForm.controls['tr_date'].updateValueAndValidity();
          this.filterForm.controls['appl_no'].reset();
          this.filterForm.controls['fr_date'].reset();
          this.filterForm.controls['tr_date'].reset();
            break
        case 'drng':
          this.filterForm.controls['fr_date'].setValidators(Validators.required);
          this.filterForm.controls['tr_date'].setValidators(Validators.required);
          this.filterForm.controls['appl_no'].clearValidators();
          this.filterForm.controls['regn_no'].clearValidators();

          this.filterForm.controls['appl_no'].updateValueAndValidity();
          this.filterForm.controls['regn_no'].updateValueAndValidity();
          this.filterForm.controls['fr_date'].updateValueAndValidity();
          this.filterForm.controls['tr_date'].updateValueAndValidity();
          this.filterForm.controls['appl_no'].reset();
          this.filterForm.controls['regn_no'].reset();
            break
        default:
          this.filterForm.controls['appl_no'].setValidators(Validators.required);
          this.filterForm.controls['regn_no'].clearValidators();
          this.filterForm.controls['fr_date'].clearValidators();
          this.filterForm.controls['tr_date'].clearValidators();

          this.filterForm.controls['appl_no'].updateValueAndValidity();
          this.filterForm.controls['regn_no'].updateValueAndValidity();
          this.filterForm.controls['fr_date'].updateValueAndValidity();
          this.filterForm.controls['tr_date'].updateValueAndValidity();
          this.filterForm.controls['fr_date'].reset();
          this.filterForm.controls['regn_no'].reset();
          this.filterForm.controls['tr_date'].reset();
    }
}
// Only AlphaNumeric
public keyPressAlphaNumeric(e: any) {
  const charCode = e.which ? e.which : e.keyCode;
  // if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //   return false
  // }
  console.log(charCode);
  if (
    (charCode > 64 && charCode < 91) ||
    (charCode > 96 && charCode < 123) ||
    (charCode > 47 && charCode < 58)
  ) {
    return true;
  } else {
    return false;
  }
}
onLogout() {
  sessionStorage.clear();
  this.router.navigate(['/login']);
}
  }


