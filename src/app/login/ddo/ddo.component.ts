import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IfmsService } from 'src/app/main-contained/ifms-service/ifms.service';
import { VerifyService } from '../verify/verify.service';

@Component({
  selector: 'app-ddo',
  templateUrl: './ddo.component.html',
  styleUrls: ['./ddo.component.css']
})
export class DdoComponent implements OnInit {

  username!: string;
  off_cd: any;
  appl_no!: string;
  rectifiedSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = [
    'Sl No.',
    'Beneficiary ID',
    'Beneficiary Name',
    'Beneficiary Account Number',
    'IFSC',
    'Bill No.',
    'Subsidy Amount',
    'Revert Reason',
    'Action'
  ];
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  
  constructor(
    private routes: ActivatedRoute,
    private router: Router,
    private ifmsService:IfmsService
  ) { }

  ngOnInit(): void {
    this.username = this.routes.snapshot.params['username'];
    this.off_cd = window.sessionStorage.getItem('off_cd');
    this.reloadData();
  }

  reloadData() {
    this.ifmsService.getRectifiedBenfDetails(this.appl_no)
    .subscribe((data: any) => {
      console.log(data);
      (this.rectifiedSource = new MatTableDataSource(data)),
      (this.rectifiedSource.paginator = this.paginator.toArray()[0]);
    });
  }

  onCheck(element: any) {
    this.ifmsService.getIfmsTransactionByRegn(element.regnNo)
    .subscribe((result: any) => {
      if(result.regnNo == element.regnNo) {
        this.ifmsService.updateDdoStatus(
          element.regnNo,
          'y',
          new Date
        ).subscribe((res: any) => {
          this.rectifiedSource.data.forEach(value => {
            if(value.regnNo==res.regnNo){
              console.log(res)
              value.ddoCheckStatus = res.ddoCheckStatus;
              value.ddoCheckStatusDate = res.ddoCheckStatusDate;
            }
          });
          // this.reloadData();
        });
      }
    });    
  }

  onLogout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
