import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InflowService} from '../../../service/finance/inflow.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {CreateService} from '../../../service/pda/create.service';
import {CommonService} from '../../../service/common.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {HttpService} from '../../../service/http.service';
import {ApiUrlService} from '../../../service/api-url.service';
import {MatDialog} from '@angular/material';
import {RemarkModalComponent} from './remark-modal/remark-modal.component';

export interface Bank {
    id: number;
    bank: string;
}

@Component({
    selector: 'app-customer-payment-status',
    templateUrl: './customer-payment-status.component.html',
    styleUrls: ['./customer-payment-status.component.scss']
})
export class CustomerPaymentStatusComponent implements OnInit {
    @Input() custID;
    @Output() updateData = new EventEmitter<any>();
    totAmount = 0;
    bankCharge = 0;
    amtRcv = 0;
    objectKeys = Object.keys;

    treasuryForm: FormGroup;
    treasuryItems = new FormArray([]);
    arrBankList: Bank[] = [];
    bankCtrl = new FormControl();
    filteredBank: Observable<Bank[]>;

    constructor(private inflowService: InflowService, private createService: CreateService,
                private commonService: CommonService, private http: HttpService, private api: ApiUrlService,
                public dialog: MatDialog) {
        this.filteredBank = this.bankCtrl.valueChanges
            .pipe(
                startWith<string | Bank>(''),
                map(value => typeof value === 'string' ? value : value.bank),
                map(name => name ? this._filterBank(name) : this.arrBankList.slice())
            );
    }

    findBank(val) {
        this.arrBankList = [];

        this.commonService.toastr('warning', 'Please wait...');
        if (val.length > 2) {
            this.http.getRequest(this.api.getInflowBankNameKey + val).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    const data: any = res;
                    const arr = [];
                    for (let i = 0; i < data.length; i++) {
                        arr.push(data[i]);
                    }
                    this.arrBankList = arr;
                    this.filteredBank = this.bankCtrl.valueChanges
                        .pipe(
                            startWith<string | Bank>(''),
                            map(value => typeof value === 'string' ? value : value.bank),
                            map(name => name ? this._filterBank(name) : this.arrBankList.slice())
                        );
                },
                err => {
                    this.commonService.toastr('clear');
                    if (err.status === 401 || err.status === 403) {
                        this.commonService.sessionExpired();
                    } else {
                        this.commonService.toastr('error', 'Please try again');
                    }
                }
            );
        }
    }

    displayFnBank(user?: Bank): string | undefined {
        return user ? user.bank : undefined;
    }

    ngOnInit() {
        this.treasuryForm = new FormGroup({
            'treasuryItems': this.treasuryItems
        });
        this.removeFormArray();
    }

    // End Bank

    removeFormArray() {
        const remove = this.updateFormTresuryArray();
        remove.controls = [];
        this.displayCustomerPaymentHistory();
    }

    displayCustomerPaymentHistory() {
        this.totAmount = 0;
        this.amtRcv = 0;
        this.bankCharge = 0;
        if (this.inflowService.customerDetails !== null) {
            for (let i = 0; i < this.inflowService.customerDetails.paymentList.length; i++) {
                if (this.inflowService.customerDetails.paymentList[i].isApproved !== false) {
                    this.totAmount += Number(this.inflowService.customerDetails.paymentList[i].netAmountReceivedLocal);
                    this.bankCharge += Number(this.inflowService.customerDetails.paymentList[i].bankCharges);
                    this.amtRcv += Number(this.inflowService.customerDetails.paymentList[i].grossAmountReceivedLocal);
                }
                const date = (this.inflowService.customerDetails.paymentList[i].date) ?
                    new Date(this.inflowService.customerDetails.paymentList[i].date) : null;
                const bank = {
                    id: this.inflowService.customerDetails.paymentList[i].bankId,
                    bank: this.inflowService.customerDetails.paymentList[i].bankName
                };

                (<FormArray>this.treasuryForm.get('treasuryItems')).push(
                    new FormGroup({
                        id: new FormControl(this.inflowService.customerDetails.paymentList[i].id),
                        bankId: new FormControl(bank, Validators.required),
                        type: new FormControl(this.inflowService.customerDetails.paymentList[i].type),
                        remitter: new FormControl(this.inflowService.customerDetails.paymentList[i].remitter, Validators.required),
                        date: new FormControl(date, Validators.required),
                        currency: new FormControl(this.inflowService.customerDetails.paymentList[i].currency, Validators.required),
                        bankReferenceNo:
                            new FormControl(this.inflowService.customerDetails.paymentList[i].bankReferenceNo, Validators.required),
                        amountReceived:
                            new FormControl(this.inflowService.customerDetails.paymentList[i].amountReceived, Validators.required),
                        bankCharges: new FormControl(this.inflowService.customerDetails.paymentList[i].bankCharges, Validators.required),
                        grossAmountReceivedLocal:
                            new FormControl(this.inflowService.customerDetails.paymentList[i].grossAmountReceivedLocal,
                                Validators.required),
                        netAmountReceivedLocal:
                            new FormControl(this.inflowService.customerDetails.paymentList[i].netAmountReceivedLocal, Validators.required),
                        roe: new FormControl(this.inflowService.customerDetails.paymentList[i].roe, Validators.required),
                        remarks: new FormControl(this.inflowService.customerDetails.paymentList[i].remarks),
                        customerBank: new FormControl(this.inflowService.customerDetails.paymentList[i].customerBank),
                        pdaNo: new FormControl(this.inflowService.customerDetails.paymentList[i].pdaNo),
                        isApproved: new FormControl(this.inflowService.customerDetails.paymentList[i].isApproved),
                    })
                );
            }
        }
    }

    onAddItem() {
        (<FormArray>this.treasuryForm.get('treasuryItems')).push(
            new FormGroup({
                id: new FormControl(null),
                bankId: new FormControl(null, Validators.required),
                type: new FormControl(null),
                remitter: new FormControl(null, Validators.required),
                date: new FormControl(null, Validators.required),
                currency: new FormControl(null, Validators.required),
                bankReferenceNo: new FormControl(null, Validators.required),
                amountReceived: new FormControl(null, Validators.required),
                bankCharges: new FormControl(null, Validators.required),
                grossAmountReceivedLocal: new FormControl(null, Validators.required),
                netAmountReceivedLocal: new FormControl(null, Validators.required),
                roe: new FormControl(null, Validators.required),
                remarks: new FormControl(null),
                customerBank: new FormControl(null),
                pdaNo: new FormControl(null),
                isApproved: new FormControl(null),
            })
        );
    }

    getTresuryFormDetails(): FormArray {
        return <FormArray>this.treasuryForm.controls.treasuryItems;
    }

    tresuryAmtRcv(i) {
        this.amtRcv = 0;
        const formData: any = this.getFormTresuryArray();
        formData.map(v => {
            if (v.isApproved !== false) {
                this.amtRcv += Number(v.grossAmountReceivedLocal);
            }
        });
        this.setROE(i);
    }

    setROE(i) {
        let roe = 0;
        const data = this.getFormTresuryArray();
        const update = this.updateFormTresuryArray();
        if (Number(data[i].grossAmountReceivedLocal) > 0) {
            roe = Number(data[i].grossAmountReceivedLocal) / Number(data[i].amountReceived);
        }
        const cnt = update.controls[i] as FormGroup;
        cnt.controls['roe'].setValue(roe.toFixed(6));
        this.setTotAmt(i);
    }

    tresuryBankCharge(i) {
        this.bankCharge = 0;
        const formData: any = this.getFormTresuryArray();
        if (formData[i].grossAmountReceivedLocal < Number(formData[i].bankCharges)) {
            const update = this.updateFormTresuryArray();
            const cnt = update.controls[i] as FormGroup;
            cnt.controls['bankCharges'].setValue(0);
            this.commonService.toastr('error', 'Do not allow maximum amount from Amount(INR)');
            this.setTotAmt(i);
            return false;
        }
        formData.map(v => {
            if (v.isApproved !== false) {
                this.bankCharge += Number(v.bankCharges);
            }
        });
        this.setTotAmt(i);
    }

    setTotAmt(i) {
        let tot = 0;
        const data = this.getFormTresuryArray();
        const update = this.updateFormTresuryArray();
        tot = Number(data[i].bankCharges > 0) ? Number(data[i].grossAmountReceivedLocal) - Number(data[i].bankCharges)
            : Number(data[i].grossAmountReceivedLocal);
        const cnt = update.controls[i] as FormGroup;
        cnt.controls['netAmountReceivedLocal'].setValue(tot.toFixed(2));
        this.tresuryTotAmt();
    }

    tresuryTotAmt() {
        this.totAmount = 0;
        const formData: any = this.getFormTresuryArray();
        formData.map(v => {
            if (v.isApproved !== false) {
                this.totAmount += Number(v.netAmountReceivedLocal);
            }
        });
    }

    remove(i) {
        const data = this.getFormTresuryArray();
        this.totAmount = this.totAmount - Number(data[i].netAmountReceivedLocal);
        this.bankCharge = this.bankCharge - Number(data[i].bankCharges);
        this.amtRcv = this.amtRcv - Number(data[i].grossAmountReceivedLocal);
        (<FormArray>this.treasuryForm.get('treasuryItems')).removeAt(i);
    }

    remark(obj, i) {
        const dialogRef = this.dialog.open(RemarkModalComponent, {
            width: '550px',
            data: obj
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                const update = this.updateFormTresuryArray();
                const cnt = update.controls[i] as FormGroup;
                cnt.controls['remarks'].setValue(result);
            }
        });
    }

    saveTresury(formData) {
        const arr = [];
        if (formData.treasuryItems.length > 0) {
            for (let i = 0; i < formData.treasuryItems.length; i++) {
                const obj = {
                    id: formData.treasuryItems[i].id,
                    bankId: formData.treasuryItems[i].bankId.id,
                    customerId: this.custID,
                    type: 'CREDIT',
                    remitter: formData.treasuryItems[i].remitter,
                    date: this.commonService.dateFormat(formData.treasuryItems[i].date) + ' 00:00:00',
                    currency: formData.treasuryItems[i].currency,
                    bankReferenceNo: formData.treasuryItems[i].bankReferenceNo,
                    amountReceived: formData.treasuryItems[i].amountReceived,
                    bankCharges: formData.treasuryItems[i].bankCharges,
                    grossAmountReceivedLocal: formData.treasuryItems[i].grossAmountReceivedLocal,
                    netAmountReceivedLocal: formData.treasuryItems[i].netAmountReceivedLocal,
                    roe: formData.treasuryItems[i].roe,
                    remarks: formData.treasuryItems[i].remarks,
                    customerBank: formData.treasuryItems[i].customerBank,
                    isApproved: (formData.treasuryItems[i].isApproved > 0 || formData.treasuryItems[i].isApproved === true) ? 1 : 0,
                };
                arr.push(obj);
            }
            this.http.postRequest(this.api.saveInflowCustomerList, arr).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.commonService.toastr('success', 'Successfully inserted');
                    this.inflowService.customerDetails = null;
                    this.updateRecordFromParentTable();
                },
                err => {
                    this.commonService.toastr('clear');
                    if (err.status === 401 || err.status === 403) {
                        this.commonService.sessionExpired();
                    } else {
                        this.commonService.toastr('error', 'Please try again');
                    }
                }
            );
            // console.log(arr)
        }
    }

    updateRecordFromParentTable() {
        this.updateData.emit(true);
    }

    actionStatus(status, obj, i) {
        if (!confirm('Are you sure you want to change status?')) {
            return false;
        }
        const arr = {
            id: obj.id,
            bankId: obj.bankId.id,
            customerId: obj.customerId,
            type: 'CREDIT',
            remitter: obj.remitter,
            date: this.commonService.dateFormat(obj.date) + ' 00:00:00',
            currency: obj.currency,
            bankReferenceNo: obj.bankReferenceNo,
            amountReceived: obj.amountReceived,
            bankCharges: obj.bankCharges,
            grossAmountReceivedLocal: obj.grossAmountReceivedLocal,
            netAmountReceivedLocal: obj.netAmountReceivedLocal,
            roe: obj.roe,
            remarks: obj.remarks,
            customerBank: obj.customerBank,
            isApproved: status
        };
        this.http.postRequest(this.api.updateStatusInflowCustomer, arr).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Successfully updated');
                this.updateRecordFromParentTable();
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 401 || err.status === 403) {
                    this.commonService.sessionExpired();
                } else {
                    this.commonService.toastr('error', 'Please try again');
                }
            }
        );
    }

    // Form Array ==========================================================================================================================
    getControls() {
        return (<FormArray>this.treasuryForm.get('treasuryItems')).controls;
    }

    getFormTresuryArray() {
        return <FormArray>this.treasuryForm.controls.treasuryItems.value;
    }

    updateFormTresuryArray() {
        return <FormArray>this.treasuryForm.controls.treasuryItems;
    }

    // Bank
    private _filterBank(value: string): Bank[] {
        const filterValue = value.toLowerCase();
        return this.arrBankList.filter(c => c.bank.toLowerCase().indexOf(filterValue) === 0);
    }
}
