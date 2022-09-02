import {Component, Inject, OnInit, TemplateRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ServiceInfoService} from "./service-info.service";
import {MatTableDataSource} from "@angular/material/table";
import {LoaderService} from "../../loaderService/loader.service";

@Component({
  selector: 'app-service-info',
  templateUrl: './service-info.component.html',
  styleUrls: ['./service-info.component.css']
})
export class ServiceInfoComponent implements OnInit {


  dataSource !: any;

  displayedColumns: string[] = ['position', 'dealerCd', 'dealerName'];

  constructor(private dialogDocReq:MatDialog, private infoService: ServiceInfoService,public loaderService: LoaderService) {
  }

  ngOnInit(): void {
    // this.infoService.getDealerList().subscribe((data:any)=>console.log(data))
  }
  openDialog(dialog: any){
    let dialogDocReq = this.dialogDocReq.open(dialog,{width: '500px'});
  }

  closeDialog(){
    this.dialogDocReq.closeAll();
  }

  openDealerDialog(dialogDealerList: TemplateRef<any>){

    this.infoService.getDealerList().subscribe((data:any)=>this.dataSource= new MatTableDataSource(data))
    let dialogDealer = this.dialogDocReq.open(dialogDealerList,{width:'900px'})
  }
  closeDealerDialog(){

    this.dialogDocReq.closeAll();
  }

}

