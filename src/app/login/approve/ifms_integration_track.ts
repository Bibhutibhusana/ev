export class IFMSIntegrationTrack {
    id!: number;
	
	fileRefId!: string;
	
	billNo!: string;
	
	billRefNo!: string;
	
	resFileName!: string;
	
	applNo!: string;
	 
	regnNo!: string;

	accNo!: string;
	 
	name!: string;
	
	ifsc!: string;
	
	submitStatus!: string;
	
	submitDate!: Date;
	
	submitErr!: string;
	
	ackStatus!: string;
	
	ackDate!: Date;
	
	ackErr!: string;
	
	billStatus!: string;
	
	
	billStatusErr!: string;
	
	checkStatus!: string;
	
	checkStatusErr!: Date;
	
	checkStatusDate!: Date;
	
	voucherNo!: string;
	
	voucherDate!: Date;
	
	billStatusString!: string;
	
	utrNo!: string;

	utrDate!: Date;
	
	benfPaymentStatus!: string;
	
	benefBillStatus!: string;
	
	revertStatus!: string;
	
	revertStatusDate!: Date;
	
	ddoCheckStatus!: string;
	
	ddoCheckStatusDate!: Date;
	
	offCd!: string;
}