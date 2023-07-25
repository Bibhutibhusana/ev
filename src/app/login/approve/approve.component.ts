import { SanctionOrder } from './sanctionOrder';

import { ApprovalService } from './approval.service';
import {
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserStatus } from './userStatus';
import { VehicleDetails } from './vehicleDetails';
import { BankDetailsToDelete } from './bankDetails';
import { UntypedFormControl, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { AmountToWordPipe } from '../amount-to-word.pipe';
import { FinalApprovalModel } from './finalApprovalModel';
import { ExcelService } from './excel-service';
import { VerifyService } from '../verify/verify.service';
import { IFMSIntegrationTrack } from './ifms_integration_track';
@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css'],
})


export class ApproveComponent implements OnInit {
  @ViewChild(MatTableExporterDirective)
  matTableExporter!: MatTableExporterDirective;
  elementObj: any;
  regn_no = new UntypedFormControl('', [
    Validators.minLength(9),
    Validators.maxLength(10),
    Validators.required,
  ]);
  statusTableFlag: boolean = false;
  reason: any;
  otherReason: any;
  off_cd: any;

  reasonBool: boolean = false;
  rejectBool: boolean = true;
  revertBool: boolean = true;
  cofirmRejectbool: boolean = true;
  username!: string;
  passbook: any;
  buttonCheck: boolean = true;
  searchBool: boolean = true;
  exportBool: boolean = true;
  subsidy_amnt!: number;
  cheq_no: string = '';

  statusDetails: UserStatus = new UserStatus();
  approvalModel: FinalApprovalModel = new FinalApprovalModel();
  VehicleDetails: VehicleDetails = new VehicleDetails();
  bankDetails: BankDetailsToDelete = new BankDetailsToDelete();
  revertInfo: any;

  fromDate!: Date;
  toDate!: Date;
  reportOptionSelect!: any;
  reportOptionBool: boolean = false;

  approvalDate!: Date;

  appl_no = new UntypedFormControl('', [Validators.required]);

  rtoName!: any;

  sanctionOrder: SanctionOrder = new SanctionOrder();

  rejectFinalBool: boolean = false;
  revertFinalBool: boolean = false;

  secConfirmbool: boolean = false;
  sanctionOrderBool: boolean = false;
  a: any;
  displayedColumns: string[] = [
    'Sl No.',
    'Application Number',
    'Registration Number',
    'Owner Name',
    'Account Number',
    'IFSC Code',
    'Branch Name',
    'Fuel',
    'Vehicle Class',
    'Purchase Date',
    'Passbook Image',
    'Subsidy Amount',
    'Action',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumnsFinal: string[] = [
    'Sl No.',
    'Application Number',
    'Registration Number',
    'Owner Name',
    'Account Number',
    'IFSC Code',
    'Bank Name',
    'Contact Number',
    'Subsidy Amount',
  ];
  finalDataSource: MatTableDataSource<FinalApprovalModel> = new MatTableDataSource();

  displayedColumnsRevert: string[] = [
    'Sl No.',
    'Application Number',
    'Registration Number',
    'Owner Name',
    'Account Number',
    'IFSC Code',
    'Action'
  ];
  revertDataSource: MatTableDataSource<any> = new MatTableDataSource();

  dataSourceReport: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumnsReport: string[] = [
    'Sl No.',
    'Application Number',
    'Registration Number',
    'Vehicle Class',
    'Owner Name',
    'Bank Account Number',
    'Subsidy Amount',
    'Approve Date',
  ];

  disburseDataSource: MatTableDataSource<any> = new MatTableDataSource();
  disbusereColumns: string[] = [
    'Sl No.',
    'Application Number',
    'Registration Number',
    'Owner Name',
    'Account Number',
    'IFSC Code',
    'Bank Name',
    'Contact Number',
    'Select',
  ];

  reasons = [
    'Owner Name mismatched',
    'Passbook Image not visible properly',
    'Wrong account information',
    'Other',
  ];

  displayedColumnsStatus: string[] = [
    'Application Number',
    'Registration Number',
    'Owner Name',
    'Bank Account Number',
    'Application Status',
    'Verify Date',
    'Approve Date',
    'Disbursement Status',
    'Revert Status',
  ];

  dataSourceStatus: MatTableDataSource<any> = new MatTableDataSource();

  selection = new SelectionModel<any>(true, []);
  constructor(
    private routes: ActivatedRoute,
    private approvalService: ApprovalService,
    private dialogImage: MatDialog,
    private datepipe: DatePipe,
    private snackBar: MatSnackBar,
    private amountPipe: AmountToWordPipe,
    private excelService: ExcelService,
    private router: Router,
    private verifyService: VerifyService
  ) { }

  list: string[] = [];
  dateOfApproval: Date = new Date();

  totalAmount: number = 0;
  totalAmountInWords!: string;
  columns: any[] = [];
  footerData: any[][] = [];
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  ngOnInit(): void {    
    this.username = this.routes.snapshot.params['username'];
    this.off_cd = window.sessionStorage.getItem('off_cd');
    console.log(this.off_cd)
    this.approvalService
      .getToApproveList(this.off_cd)
      .subscribe((data: any) => {
        (this.dataSource = new MatTableDataSource(data)),
          (this.dataSource.paginator = this.paginator.toArray()[0]);
      });
      this.fetchRevertInfo();
  }

  fetchRevertInfo() {
    this.verifyService.getAllRevertInfo(this.off_cd).subscribe(
      (data: any) => {
        console.log(data)
        this.revertDataSource = new MatTableDataSource(data),
          (this.revertDataSource.paginator = this.paginator.toArray()[2]);
      });
  }

  getImage(img: any, imagePopup: any) {
    this.passbook = 'data:image/jpg;base64,' + img;
    this.dialogImage.open(imagePopup, { height: '40%' });
  }

  closeDialog() {
    this.rejectBool = true;

    this.rejectFinalBool = false;
    this.revertFinalBool = false;
    this.reason = null;
    this.dialogImage.closeAll();
  }

  approveButton(element: any, confirm: any) {
    this.elementObj = element;
    let sale_amnt = this.elementObj.sale_amnt;
    let subsidy_amnt_temp = 0;
    subsidy_amnt_temp = sale_amnt * (15 / 100);

    if (
      this.elementObj.v_class == 'M-Cycle/Scooter-With Side Car' ||
      this.elementObj.v_class == 'M-Cycle/Scooter' ||
      this.elementObj.v_class == 'Moped'
    ) {
      if (subsidy_amnt_temp >= 5000) {
        this.subsidy_amnt = 5000;
      } else {
        this.subsidy_amnt = subsidy_amnt_temp;
      }
    } else if (
      this.elementObj.v_class == 'Three Wheeler (Passenger)' ||
      this.elementObj.v_class == 'Three Wheeler (Goods)'
    ) {
      if (subsidy_amnt_temp >= 10000) {
        this.subsidy_amnt = 10000;
      } else {
        this.subsidy_amnt = subsidy_amnt_temp;
      }
    } else {
      if (subsidy_amnt_temp >= 50000) {
        this.subsidy_amnt = 50000;
      } else {
        this.subsidy_amnt = subsidy_amnt_temp;
      }
    }

    this.dialogImage.open(confirm, { width: '50%' });
  }

  revertButton(element: any, reverted: any) {
    this.elementObj = element;
    if (this.elementObj.benefBillStatus != null) {
      if (this.elementObj.query  == "q2") {
        this.approvalService.findByErrCode(this.elementObj.billStatusString)
        .subscribe((data: any) => {
          console.log(data);
          this.revertInfo = data.evErr;
        });
      }
      else {
        this.approvalService.findByErrCode(this.elementObj.benefBillStatus)
        .subscribe((data: any) => {
          console.log(data);
          this.revertInfo = data.evErr;
        });
      }
    } else if (this.elementObj.billStatus != null) {
      this.approvalService.findByErrCode(this.elementObj.billStatus)
        .subscribe((data: any) => {
          console.log(data);
          this.revertInfo = data.evErr;
        });
    }
    this.dialogImage.open(reverted, { width: '50%' });
  }

  buttonChange(element: any) {
    if (element.approval == 'y') {
      return false;
    } else {
      return true;
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

  exportToPDF() {
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
        'Contact Number',
        'Subsidy Amount',
      ],
    ];

    let prepare: any[][] = [];
    this.finalDataSource.data.forEach((e) => {
      //update download status service

      this.approvalService.getUpdateDownloadStatus(e.regn_no).subscribe(
        (data: any) => { }
      );
      var tempObj = [];

      tempObj.push(row);
      tempObj.push(e.appl_no);
      tempObj.push(e.regn_no);
      tempObj.push(e.owner_name);
      tempObj.push(e.acc_no);
      tempObj.push(e.ifsc_code);
      tempObj.push(e.bank_name);

      tempObj.push(e.mob_no);
      tempObj.push(e.sub_amnt);
      prepare.push(tempObj);
      row = row + 1;
    });

    let today = new Date();
    let td = today.toDateString();

    var pdf = new jsPDF({ orientation: 'landscape', unit: 'pt' });

    function footer() {
      pdf.text('Signature:_____________', 196, 285, { align: 'right' });
    }

    let dt = this.datepipe.transform(this.fromDate, 'dd/MM/yyyy');

    pdf.setFontSize(14);
    pdf.text(
      'Regional Transport Office, ' + office,
      pdf.internal.pageSize.getWidth() / 2,
      20,
      { align: 'center' }
    );
    pdf.text(
      'Electric Vehicle Eligible Applicant List for Subsidy',
      pdf.internal.pageSize.getWidth() / 2,
      50,
      { align: 'center' }
    );
    pdf.line(265, 60, 578, 60);
    pdf.text('To,______________________ Bank', 20, 85, { align: 'left' });
    pdf.text(
      'Approve Date: ' + dt,
      pdf.internal.pageSize.getWidth() / 1.1,
      85,
      { align: 'right' }
    );

    (pdf as any).autoTable({
      head: header,
      body: prepare,
      margin: { top: 110, bottom: 50 },
    });

    let final = (pdf as any).autoTable.previous.finalY;
    // footer();

    pdf.setFontSize(10);

    pdf.text(
      'Total Amount : Rs. ' +
      this.totalAmount +
      '/- (' + this.amountPipe.transform(this.totalAmount) +
      ' only)',
      pdf.internal.pageSize.getWidth() / 1.1,
      final + 30,
      { align: 'right' }
    );
    pdf.text(
      'Signature of RTO, ' + office,
      pdf.internal.pageSize.getWidth() / 1.1,
      final + 70,
      { align: 'right' }
    );

    pdf.text(
      'Date:_____________',
      pdf.internal.pageSize.getWidth() / 1.1,
      final + 90,
      { align: 'right' }
    );

    pdf.save(today + '_FinalList' + '.pdf');
  }
  exportToReportPDF() {
    let office = this.getOffCdNumberToPlace(this.off_cd);

    let row = 1;

    let arList: any[][] = [];
    let header = [
      [
        'Sl No.',
        'Application Number',
        'Registration Number',
        'Vehicle Class',
        'Owner Name',
        'Bank Account Number',
        'Subsidy Amount',
        'Approve Date',
      ],
    ];

    let prepare: any[][] = [];
    this.dataSourceReport.data.forEach((e) => {
      var tempObj = [];
      tempObj.push(row);
      tempObj.push(e.appl_no);
      tempObj.push(e.regn_no);
      tempObj.push(e.v_class);
      tempObj.push(e.owner_name);
      tempObj.push(e.acc_no);
      tempObj.push(e.sub_amnt);
      tempObj.push(e.approve_dt);
      prepare.push(tempObj);
      row = row + 1;
    });

    let today = new Date();
    let td = today.toDateString();

    var pdf = new jsPDF({ orientation: 'landscape', unit: 'pt' });

    function footer() {
      pdf.text('Signature:_____________', 196, 285, { align: 'right' });
    }

    let frdt = this.datepipe.transform(this.fromDate, 'dd/MM/yyyy');
    let todt = this.datepipe.transform(this.toDate, 'dd/MM/yyyy');
    let purpose = this.reportOptionSelect;
    if (purpose == 'plvs') {
      purpose = 'Pending List at Verify Stage';
    } else if (purpose == 'plas') {
      purpose = 'Pending List at Approval Stage';
    } else if (purpose == 'taar') {
      purpose = 'Total Applied Application Report';
    } else if (purpose == 'tvar') {
      purpose = 'Total Verified Application Report';
    } else if (purpose == 'tapr') {
      purpose = 'Total Approved Application Report';
    } else {
    }
    pdf.setFontSize(14);
    pdf.text(
      'Regional Transport Office, ' + office,
      pdf.internal.pageSize.getWidth() / 2,
      20,
      { align: 'center' }
    );
    pdf.text(purpose, pdf.internal.pageSize.getWidth() / 2, 50, {
      align: 'center',
    });
    pdf.line(265, 60, 578, 60);
    pdf.text('From Date: ' + frdt, 275, 85, { align: 'left' });
    pdf.text('To Date: ' + todt, pdf.internal.pageSize.getWidth() / 1.5, 85, {
      align: 'right',
    });

    (pdf as any).autoTable({
      head: header,
      body: prepare,
      margin: { top: 110, bottom: 50 },
    });
    let final = (pdf as any).autoTable.previous.finalY;
    // footer();
    pdf.setFontSize(10);

    // pdf.text('Total Amount : Rs. '+this.totalAmount+'/- ('+this.totalAmountInWords+') only',pdf.internal.pageSize.getWidth()/1.1,final+30,{align: 'right'})
    pdf.text(
      'Signature of RTO, ' + office,
      pdf.internal.pageSize.getWidth() / 1.1,
      final + 50,
      { align: 'right' }
    );

    pdf.text(
      'Date:_____________',
      pdf.internal.pageSize.getWidth() / 1.1,
      final + 70,
      { align: 'right' }
    );

    pdf.save(today + '_Report' + '.pdf');
  }

  confirmButton() {
    this.cofirmRejectbool = false;
    let approvalStatus = 'y';
    this.elementObj.approval = 'y';

    if (this.reason == 'Other') {
      this.reason = this.otherReason;

      this.elementObj.approval = 'rev';
    }

    if (this.reason != null) {
      approvalStatus = 'rev';

      this.elementObj.approval = 'rev';
    }
    this.approvalService
      .updateApprovalStatus(
        this.elementObj.regn_no,
        this.username,
        this.reason,
        approvalStatus,
        this.cheq_no,
        this.getSubsidyAmount(this.elementObj),
        this.dateOfApproval
      )
      .subscribe((data: any) => {
        if (this.reason == null) {
          this.approvalService
            .sendApprovedMsg(
              this.elementObj.appl_no,
              this.getOffCdNumberToPlace(this.off_cd),
              this.elementObj.mob_no
            )
            .subscribe((data: any) => {
            });
        } else {
          this.approvalService
            .insertToRevertStatus(
              this.elementObj.regn_no,
              this.elementObj.appl_no,
              this.elementObj.verification,
              this.elementObj.approval,
              this.elementObj.op_dt,
              this.reason,
              this.username,
              this.elementObj.approve_user_id,
              this.dateOfApproval
            )
            .subscribe((data: any) => {
            });
        }

        // console.log(regn),
        this.buttonCheck = false;

        this.dialogImage.closeAll();
      });
  }

  rejectButton() {
    // this.elementObj.approval = 'n'

    this.cofirmRejectbool = false;
    let approvalStatus = 'y';
    this.elementObj.approval = 'rejected';

    if (this.reason == 'Other') {
      this.reason = this.otherReason;

      this.elementObj.approval = 'rejected';
    }

    if (this.reason != null) {
      approvalStatus = 'rejected';

      this.elementObj.approval = 'rejected';
    }

    this.approvalService
      .updateApprovalStatus(
        this.elementObj.regn_no,
        this.username,
        this.reason,
        approvalStatus,
        this.cheq_no,
        this.subsidy_amnt,
        this.dateOfApproval
      )
      .subscribe((data: any) => {
        this.buttonCheck = false;
        this.approvalService
          .getStatus(this.elementObj.regn_no)
          .subscribe((data: any) => {
            this.statusDetails = data;
            this.statusDetails.insertDt = new Date();
            this.statusDetails.approval = 'rejected';
            this.approvalService
              .insertToUserStatusHistory(this.statusDetails)
              .subscribe((data: any) => {
                this.approvalService
                  .getBankDetailsToDelete(this.elementObj.regn_no)
                  .subscribe((data: any) => {
                    this.bankDetails = data;
                    this.bankDetails.insertDt = new Date();

                    this.approvalService
                      .insertToBankDetailsHistory(this.bankDetails)
                      .subscribe((data: any) => {
                        this.approvalService
                          .getVehicleDetailsToDelete(this.elementObj.regn_no)
                          .subscribe((data: any) => {
                            this.VehicleDetails = data;
                            this.VehicleDetails.insertDt = new Date();
                            this.approvalService
                              .insertToVehicleDetailsHistory(
                                this.VehicleDetails
                              )
                              .subscribe((data: any) => {
                                this.approvalService
                                  .deleteFromVehicleDetails(
                                    this.elementObj.regn_no
                                  )
                                  .subscribe((data: any) => {
                                    this.approvalService
                                      .deleteFromBankDetails(
                                        this.elementObj.regn_no
                                      )
                                      .subscribe((data: any) => {
                                        this.approvalService
                                          .deleteFromUserStatus(
                                            this.elementObj.regn_no
                                          )
                                          .subscribe((data: any) => {
                                            this.approvalService
                                              .sendRejectedMsg(
                                                this.elementObj.appl_no,
                                                this.getOffCdNumberToPlace(
                                                  this.off_cd
                                                ),
                                                this.elementObj.mob_no,
                                                this.reason,
                                                this.elementObj.regn_no
                                              )
                                              .subscribe((data: any) => { });
                                          });
                                      });
                                  });
                              });
                          });
                      });
                  });
              });
          });
        this.dialogImage.closeAll();
      });
    this.dialogImage.closeAll();
  }

  saveRevert() {
    this.cofirmRejectbool = false;
    let approvalStatus = 'y';
    console.log(this.elementObj);

    this.verifyService.saveRevertInfo(
      this.elementObj.id,
      this.elementObj.fileRefId,
      this.elementObj.billNo,
      this.elementObj.billRefNo,
      this.elementObj.resFileName,
      this.elementObj.applNo,
      this.elementObj.regnNo,
      this.elementObj.accNo,
      this.elementObj.name,
      this.elementObj.ifsc,
      this.elementObj.submitStatus,
      this.elementObj.submitDate,
      this.elementObj.submitErr,
      this.elementObj.ackStatus,
      this.elementObj.ackDate,
      this.elementObj.ackErr,
      this.elementObj.billStatus,
      this.elementObj.billStatusErr,
      this.elementObj.checkStatus,
      this.elementObj.checkStatusErr,
      this.elementObj.checkStatusDate,
      this.elementObj.voucherNo,
      this.elementObj.voucherDare,
      this.elementObj.billStatusString,
      this.elementObj.utrNo,
      this.elementObj.utrDate,
      this.elementObj.benfPaymentStatus,
      this.elementObj.benefBillStatus,
      this.elementObj.ddoCheckStatus,
      this.elementObj.ddoCheckStatusDate,
      this.elementObj.revertStatus = 'y',
      this.elementObj.revertStatusDate = new Date,
      this.elementObj.updateDatetime = new Date,
      // this.elementObj.rtoCode = this.getOffCdNumberToPlace(this.off_cd)
    ).subscribe((data: any) => {
      this.verifyService.getStatus(this.elementObj.regnNo)
        .subscribe((data: any) => {
          console.log(data);
          console.log(this.elementObj.regnNo);
          
          if (data.regnNo == this.elementObj.regnNo) 
          {
            this.approvalService.insertToRevertStatus(
              this.elementObj.regnNo,
              this.elementObj.applNo,
              this.elementObj.verification,
              this.elementObj.approval,
              this.elementObj.opDt = new Date,
              this.reason,
              this.username,
              this.elementObj.approve_user_id,
              this.elementObj.insertDt = new Date
            ).subscribe((result: any) => {
              if (this.elementObj.benefBillStatus != null) {
                this.approvalService.findByErrCode(this.elementObj.benefBillStatus)
                  .subscribe((res: any) => {
                    console.log(res);
                    console.log(data.sub_amnt);
                    if (res.errCode == this.elementObj.benefBillStatus || res.errCode == this.elementObj.billStatus) {
                      this.approvalService.updateApprovalStatus(
                        this.elementObj.regnNo,
                        this.username,
                        this.revertInfo,
                        'rev',
                        this.cheq_no,
                        data.sub_amnt,
                        this.elementObj.approveDt = new Date
                      ).subscribe((data: any) => {
                        console.log(data);
                      });
                    }
                  });
              } else if (this.elementObj.billStatus != null) {
                this.approvalService.findByErrCode(this.elementObj.billStatus)
                  .subscribe((res: any) => {
                    console.log(res);
                    if (res.errCode == this.elementObj.benefBillStatus || res.errCode == this.elementObj.billStatus) {
                      console.log(data.sub_amnt);
                      this.approvalService.updateApprovalStatus(
                        this.elementObj.regnNo,
                        this.username,
                        this.revertInfo,
                        'rev',
                        this.cheq_no,
                        data.sub_amnt,
                        this.elementObj.approveDt = new Date
                      ).subscribe((data: any) => {
                        console.log(data);
                      });
                    }
                  });
              }
            });
          }

        });
      console.log(data);
    });
    this.buttonCheck = false;
    this.closeDialog();
  }

  onSelect(event: any) {
    this.reason = event;
  }

  onSearch() {
    this.searchBool = false;
    this.approvalService
      .getFinalApprovalList(this.fromDate, this.off_cd)
      .subscribe((data: any) => {
        (this.finalDataSource = new MatTableDataSource(data)),
          (this.rtoName = this.getOffCdNumberToPlace(this.off_cd));
        this.totalAmount = 0;
        data.forEach((element: any) => {
          this.totalAmount = this.totalAmount + Number(element.sub_amnt);
          //this.totalAmountInWords = converter.toWords(this.totalAmount);
        });
        this.finalDataSource.paginator = this.paginator.toArray()[1];
      });
  }

  onRevert() {
    this.rejectBool = false;
  }

  onYesNo(dialogYesNo: any) {
    this.dialogImage.open(dialogYesNo);
  }

  onChequeEnter() {
    if (this.cheq_no.length > 4 && this.subsidy_amnt != null) {
      this.secConfirmbool = true;
    } else {
      this.secConfirmbool = false;
    }
  }

  onSearchForSanctionOrder() {
    this.approvalService
      .getSanctionOrder(this.appl_no.value)
      .subscribe((data: any) => {
        this.sanctionOrder = data;

        this.rtoName = this.getOffCdNumberToPlace(this.off_cd);
        this.sanctionOrderBool = true;
      });
  }

  onPrint() {
    this.approvalService
      .updatePaymentStatus(this.sanctionOrder.appl_no)
      .subscribe((data: any) => { });
  }

  onReject() {
    this.rejectBool = false;
    this.rejectFinalBool = true;
  }

  onSearchForDisbursement() {
    this.searchBool = false;

    this.approvalService
      .getFinalDisbursementList(this.approvalDate, this.off_cd)
      .subscribe((data: any) => {
        (this.disburseDataSource = new MatTableDataSource(data)),
          (this.disburseDataSource.paginator = this.paginator.toArray()[2]);
      });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.disburseDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.disburseDataSource.data.forEach((row) =>
        this.selection.select(row)
      );
  }

  onSubmitDisbursement(dialogUpdate: any) {
    this.approvalService
      .updateDisbursementStatus(this.list)
      .subscribe((data: any) => {
        this.dialogImage.open(dialogUpdate);
      });
  }
  onCheck(event: any, data: any, c: any) {
    event.stopPropagation();
    if (c.checked == false) {
      this.list.push(data.regn_no);
    } else {
      this.list.splice(this.list.indexOf(data), 1);
    }
  }

  onAllSelect(c: any) {
    if (c.checked == false) {
      this.disburseDataSource.data.forEach((row) =>
        this.list.push(row.regn_no)
      );
    } else {
      this.list = [];
    }
  }

  getSubsidyAmount(data: any) {
    let temp = data.sale_amnt * (15 / 100);

    if (
      data.v_class == 'M-Cycle/Scooter-With Side Car' ||
      data.v_class == 'M-Cycle/Scooter' ||
      data.v_class == 'Moped' ||
      data.v_class == 'Motorised Cycle (CC > 25cc)' ||
      data.v_class == 'Motor Cycle/Scooter-SideCar(T)' ||
      data.v_class == 'Motor Cycle/Scooter-Used For Hire'
    ) {
      if (temp >= 5000) {
        this.subsidy_amnt = 5000;
      } else {
        this.subsidy_amnt = temp;
      }
    } else if (
      data.v_class == 'Three Wheeler (Passenger)' ||
      data.v_class == 'Three Wheeler (Goods)' ||
      data.v_class == 'e-Rickshaw with Cart (G)' ||
      data.v_class == 'e-Rickshaw(P)' ||
      data.v_class == 'Three Wheeler (Personal)'
    ) {
      if (temp >= 10000) {
        this.subsidy_amnt = 10000;
      } else {
        this.subsidy_amnt = temp;
      }
    } else if (
      data.v_class == 'Motor Car' ||
      data.v_class == 'Private Service Vehicle (Individual Use)' ||
      data.v_class == 'Camper Van / Trailer (Private Use)' ||
      data.v_class == 'Omni Bus (Private Use)' ||
      data.v_class == 'Quadricycle (Private)' ||
      data.v_class == 'Luxury Cab' ||
      data.v_class == 'Goods Carrier' ||
      data.v_class == 'Private Service Vehicle' ||
      data.v_class == 'Maxi Cab' ||
      data.v_class == 'Motor Cab' ||
      data.v_class == 'Bus' ||
      data.v_class == 'Educational Institution Bus' ||
      data.v_class == 'Ambulance' ||
      data.v_class == 'Animal Ambulance' ||
      data.v_class == 'Cash Van' ||
      data.v_class == 'Fire Tenders' ||
      data.v_class == 'Omni Bus' ||
      data.v_class == 'Dumper' ||
      data.v_class == 'Quadricycle (Commercial)'
    ) {
      if (temp >= 50000) {
        this.subsidy_amnt = 50000;
      } else {
        this.subsidy_amnt = temp;
      }
    } else {
      this.snackBar.open('No class found for subsidy', 'Close');
    }
    return this.subsidy_amnt;
  }
  onSearchForReport() {
    this.exportBool = false;
    if (this.reportOptionSelect != null) {
      this.approvalService
        .getTotalApplied(
          this.fromDate,
          this.toDate,
          this.off_cd,
          this.reportOptionSelect
        )
        .subscribe((data: any) => {
          this.dataSourceReport = new MatTableDataSource(data);

          if (data.length == 0) {
            this.reportOptionBool = false;
            this.snackBar.open('No record found', 'close');
          } else {
            this.dataSourceReport.paginator = this.paginator.toArray()[3];
            this.reportOptionBool = true;
          }
        });
    } else {
      this.snackBar.open('Please select from the drop down.', 'close');
    }
  }
  onSearchForStatus() {
    this.approvalService
      .getApplicationStatus(this.regn_no.value)
      .subscribe((data: any) => {
        this.dataSourceStatus = new MatTableDataSource(data);

        if (data.reason == null) {
          this.reasonBool = false;
        } else {
          this.reasonBool = true;
        }

        if (this.dataSourceStatus != null) {
          this.statusTableFlag = true;
        }
      });
  }
  exportToExcel() {
    this.matTableExporter.exportTable('xls', { fileName: 'report' });
  }
  exportToExcelSheet() {
    this.columns = ['Sl.No', 'Application Number', 'Registration Number', 'Owner Name', 'Account Number', 'IFSC Code', 'Bank Name', 'Contact Number', 'Subsidy Amount'];
    let row = 1;
    let prepare: any[][] = [];
    this.finalDataSource.data.forEach((e) => {
      //update download status service

      this.approvalService.getUpdateDownloadStatus(e.regn_no).subscribe(
        (data: any) => { }
      );
      var tempObj = [];

      tempObj.push(row);
      tempObj.push(e.appl_no);
      tempObj.push(e.regn_no);
      tempObj.push(e.owner_name);
      tempObj.push(e.acc_no);
      tempObj.push(e.ifsc_code);
      tempObj.push(e.bank_name);
      tempObj.push(e.mob_no);
      tempObj.push(e.sub_amnt);
      prepare.push(tempObj);
      row = row + 1;
    });
    this.footerData.push(['', '', '', '', '', '', '', 'Total Amount', this.totalAmount]);
    let office = this.getOffCdNumberToPlace(this.off_cd);
    let reportHeading = 'Regional Transport Office, ' + office;
    this.excelService.exportAsExcelFile(reportHeading, 'Electric Vehicle Eligible Applicant List for Subsidy', this.columns, prepare, this.footerData, 'finalapprovallist', 'Sheet1');
  }
  onLogout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
