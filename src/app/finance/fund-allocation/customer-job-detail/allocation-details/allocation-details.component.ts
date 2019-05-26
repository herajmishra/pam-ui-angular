import {Component, Input, OnInit} from '@angular/core';
import {InflowService} from '../../../../service/finance/inflow.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {AllocationRemarkModalComponent} from './allocation-remark-modal/allocation-remark-modal.component';
import {CommonService} from '../../../../service/common.service';
import {HttpService} from '../../../../service/http.service';
import {ApiUrlService} from '../../../../service/api-url.service';

@Component({
    selector: 'app-allocation-details',
    templateUrl: './allocation-details.component.html',
    styleUrls: ['./allocation-details.component.scss']
})
export class AllocationDetailsComponent implements OnInit {
    @Input() objPassing;
    jobDetail: any;
    jobNo = '';
    arrAllocationDetails = [];

    allocationForm: FormGroup;
    allocationItems = new FormArray([]);
    arrBankReferenceList = [];

    constructor(private inflowService: InflowService,
                private dialog: MatDialog, private commonService: CommonService,
                private http: HttpService, private api: ApiUrlService) {
    }

    ngOnInit() {
        if (this.objPassing) {
            this.jobDetail = this.objPassing;
            this.jobNo = this.jobDetail.jobNo;
            this.getAllocationDetails(this.jobNo);
        }
        this.inflowService.customerObservable().subscribe(
            res => {
                this.jobDetail = res;
                this.jobNo = this.jobDetail.jobNo;
                this.getAllocationDetails(this.jobNo);
            }
        );
        this.allocationForm = new FormGroup({
            'allocationItems': this.allocationItems
        });
        this.setBankReferenceNo();
    }

    setBankReferenceNo() {
        this.inflowService.bankreferenceList.map((res, i) => {
            this.inflowService.bankreferenceList[i]['disable'] = true;
            const data = this.getFormAllocationValue();
            if (data.length === 0) {
                this.inflowService.bankreferenceList[0]['disable'] = false;
            }
        });
    }

    getAllocationDetails(jobNo) {
        this.arrAllocationDetails = [];
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getAllocationDetails + jobNo).subscribe(
            res => {
                this.commonService.toastr('clear');
                const data: any = res;
                this.arrAllocationDetails = data;
                this.arrBankReferenceList = [];
                const cnt = this.updateFormAllocationArray();
                cnt.controls = [];
                for (let i = 0; i < this.arrAllocationDetails.length; i++) {
                    const getAmtINR = this.getSavedAmtINRValue(this.arrAllocationDetails[i], i);

                    (<FormArray>this.allocationForm.get('allocationItems')).push(
                        new FormGroup({
                            id: new FormControl(this.arrAllocationDetails[i].id),
                            date: new FormControl(new Date(this.arrAllocationDetails[i].date), Validators.required),
                            bankPaymentId: new FormControl(this.arrAllocationDetails[i].bankPaymentDto, Validators.required),
                            currency: new FormControl(this.arrAllocationDetails[i].bankPaymentDto.currency, Validators.required),
                            amount: new FormControl(this.arrAllocationDetails[i].bankPaymentDto.amountReceived, Validators.required),
                            roe: new FormControl(this.arrAllocationDetails[i].bankPaymentDto.roe, Validators.required),
                            amtINR: new FormControl(getAmtINR, Validators.required),
                            allocatedFund: new FormControl(this.arrAllocationDetails[i].allocatedFund, Validators.required),
                            prefundedAmount: new FormControl(this.arrAllocationDetails[i].prefundedAmount, Validators.required),
                            remark: new FormControl(this.arrAllocationDetails[i].remark),
                            jobNo: new FormControl(this.jobNo),
                            pdaAmount: new FormControl(this.jobDetail.pdaAmount),
                            isApproved: new FormControl(this.arrAllocationDetails[i].isApproved)
                        })
                    );
                }
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 401 || err.status === 403) {
                    this.commonService.sessionExpired();
                } else {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    getSavedAmtINRValue(obj, index) {
        const data = this.getFormAllocationValue();
        if (data.length === 0) {
            return obj.bankPaymentDto.netAmountReceivedLocal;
        }
        let amtINR = 0;
        let sum = 0;
        const arr = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].bankPaymentId.id === obj.bankPaymentDto.id) {
                arr.push(data[i]);
            }
        }
        for (let j = 0; j < arr.length; j++) {
            if (j === 0) {
                amtINR = data[j].bankPaymentId.netAmountReceivedLocal;
            }
            sum = sum + data[j].allocatedFund;
        }
        return amtINR - sum;
    }

    getControls() {
        return (<FormArray>this.allocationForm.get('allocationItems')).controls;
    }

    addNew() {
        this.arrBankReferenceList = [];
        (<FormArray>this.allocationForm.get('allocationItems')).push(
            new FormGroup({
                id: new FormControl(null),
                date: new FormControl(null, Validators.required),
                bankPaymentId: new FormControl(null, Validators.required),
                currency: new FormControl(null, Validators.required),
                amount: new FormControl(null, Validators.required),
                roe: new FormControl(null, Validators.required),
                amtINR: new FormControl(null, Validators.required),
                allocatedFund: new FormControl(null, Validators.required),
                prefundedAmount: new FormControl(null, Validators.required),
                remark: new FormControl(null),
                jobNo: new FormControl(this.jobNo),
                pdaAmount: new FormControl(this.jobDetail.pdaAmount),
                isApproved: new FormControl(null)
            })
        );
    }

    saveAllocation(formData) {
        if (formData.allocationItems.length === 0) {
            this.commonService.toastr('error', 'Please enter atleast 1 record');
        }
        const arr = [];
        for (let i = 0; i < formData.allocationItems.length; i++) {
            const obj = {
                id: formData.allocationItems[i].id,
                bankPaymentId: formData.allocationItems[i].bankPaymentId.id,
                allocatedFund: formData.allocationItems[i].allocatedFund,
                prefundedAmount: formData.allocationItems[i].prefundedAmount,
                remark: formData.allocationItems[i].remark,
                jobNo: formData.allocationItems[i].jobNo,
                isApproved: formData.allocationItems[i].isApproved,
                date: this.commonService.dateFormat(formData.allocationItems[i].date) + ' 00:00:00'
            };
            arr.push(obj);
        }
        this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.saveFundAllocation, arr).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.getAllocationDetails(this.jobNo);
                this.commonService.toastr('success', 'Successfully updated record');
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

    remove(i) {
        (<FormArray>this.allocationForm.get('allocationItems')).removeAt(i);
    }

    remark(obj, i) {
        const dialogRef = this.dialog.open(AllocationRemarkModalComponent, {
            width: '400px',
            data: obj
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                const update = this.updateFormAllocationArray();
                const cnt = update.controls[i] as FormGroup;
                cnt.controls['remark'].setValue(result);
            }
        });
    }

    allocatedFundAmt(val, i, obj) {
        const data = this.getFormAllocationValue();
        const update = this.updateFormAllocationArray();
        const cnt = update.controls[i] as FormGroup;
        if (!(Number(data[i].amtINR) >= Number(val))) {
            this.commonService.toastr('error', 'Not allow greater than allocated amount from Amt (INR)');
            cnt.controls['allocatedFund'].setValue('');
            cnt.controls['prefundedAmount'].setValue('');
        } else {
            this.checkFundAllocationAmt(val, i);
            let prefundedAmount = 0;
            for (let j = 0; j < data.length; j++) {
                prefundedAmount += Number(data[j].allocatedFund);
            }
            cnt.controls['prefundedAmount'].setValue(Number(data[i].pdaAmount) - prefundedAmount);
        }

        let amtINR = 0;
        let sum = 0;
        const arr = [];

        for (let j = 0; j < data.length; j++) {
            if (Number(obj.bankPaymentId.id) === Number(data[j].bankPaymentId.id)) {
                arr.push(data[j]);
            }
        }

        for (let k = 0; k < arr.length; k++) {
            if (k === 0) {
                amtINR = Number(arr[k].bankPaymentId.netAmountReceivedLocal);
            }
            sum = sum + Number(arr[k].allocatedFund);
        }
        if (amtINR === sum) {
            this.inflowService.bankreferenceList.map((item, index) => {
                if (item.id === obj.bankPaymentId.id) {
                    this.inflowService.bankreferenceList[index].disable = true;
                    this.inflowService.bankreferenceList[index + 1].disable = false;
                    return false;
                }
            });
        }
    }

    checkFundAllocationAmt(val, index) {
        const data = this.getFormAllocationValue();

        const bankReferenceID = data[index].bankPaymentId.id;
        const arr = [];
        let totalAmt = 0;
        let sumAmt = 0;
        for (let i = 0; i < data.length; i++) {
            if (Number(bankReferenceID) === Number(data[i].bankPaymentId.id)) {
                arr.push(data[i]);
            }
        }
        if (arr.length > 1) {
            for (let j = 0; j < arr.length; j++) {
                if (j === 0) {
                    totalAmt = Number(data[j].amtINR);
                }
                sumAmt += Number(data[j].allocatedFund);
            }
            if (Number(totalAmt) < Number(sumAmt)) {
                const update = this.updateFormAllocationArray();
                const cnt = update.controls[index] as FormGroup;
                this.commonService.toastr('error', 'Do not allow greate than allocated amount');
                cnt.controls['allocatedFund'].setValue('');
            }
        }
    }

    updateFormAllocationArray() {
        return <FormArray>this.allocationForm.controls.allocationItems;
    }

    getFormAllocationValue() {
        return <FormArray>this.allocationForm.controls.allocationItems.value;
    }

    status(index, action, id, bankReferenceNo) {
        if (!confirm('Are you sure you want to change status?')) {
            return false;
        }
        this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.getAllocationChangeStatus, {id: id, isApproved: action, bankReferenceNo: bankReferenceNo}).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Successfully updated status');
                this.inflowService.getBankReferenceList(this.inflowService.customerNo);
                this.getAllocationDetails(this.jobNo);
                const int = setInterval(() => {
                    if (this.inflowService.bankReferenceStatus) {
                        this.inflowService.bankReferenceStatus = false;
                        this.setBankReferenceNo();
                        clearInterval(int);
                    }
                }, 1000);
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 401 || err.status === 403) {
                    this.commonService.sessionExpired();
                } else {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    getBankRefereneceBasedValue(obj, index) {
        const data = this.getFormAllocationValue();
        const update = this.updateFormAllocationArray();
        const cnt = update.controls[index] as FormGroup;
        let amtINR = 0;
        let sum = 0;
        const arr = [];

        for (let i = 0; i < data.length; i++) {
            if (Number(obj.bankPaymentId.id) === Number(data[i].bankPaymentId.id)) {
                arr.push(data[i]);
            }
        }

        for (let i = 0; i < arr.length; i++) {
            if (i === 0) {
                amtINR = Number(arr[i].bankPaymentId.netAmountReceivedLocal);
                sum = sum + Number(arr[i].allocatedFund);
                cnt.controls['amtINR'].setValue(amtINR);
            } else {
                sum = sum + Number(arr[i].allocatedFund);
                const tot = amtINR - sum;
                cnt.controls['amtINR'].setValue(tot);
            }
            cnt.controls['currency'].setValue(arr[i].bankPaymentId.currency);
            cnt.controls['amount'].setValue(arr[i].bankPaymentId.amountReceived);
            cnt.controls['roe'].setValue(arr[i].bankPaymentId.roe);
        }
    }
}
