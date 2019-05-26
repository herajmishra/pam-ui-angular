import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../service/common.service';
import {HttpService} from '../../../service/http.service';
import {ApiUrlService} from '../../../service/api-url.service';
import {MatDialog} from '@angular/material';
import {ParticularRemarkModalComponent} from './particular-remark-modal/particular-remark-modal.component';
import {InflowService} from '../../../service/finance/inflow.service';
import {GstDetailsComponent} from './gst-details/gst-details.component';
import {BillDetailsComponent} from './bill-details/bill-details.component';

@Component({
    selector: 'app-particular-details',
    templateUrl: './particular-details.component.html',
    styleUrls: ['./particular-details.component.scss']
})
export class ParticularDetailsComponent implements OnInit {
    @Input() passingObj;
    particularForms: FormGroup;
    particularItems = new FormArray([]);
    arrLookupList = [];

    constructor(private commonService: CommonService, private http: HttpService,
                private api: ApiUrlService, private openDialog: MatDialog, private inflowService: InflowService) {
    }

    ngOnInit() {
        this.getModeOfPayment();
        this.particularForms = new FormGroup({
            particularItems: this.particularItems
        });
        if (this.passingObj) {

        }
        this.inflowService.branchServiceObservable().subscribe(
            res => {
                this.passingObj = res;
            }
        );
    }

    getModeOfPayment() {
        this.arrLookupList = [];
        this.commonService.toastr('warning');
        this.http.getRequest(this.api.getLookupListData + 'MODE_OF_PAYMENT~CURRENCY').subscribe(
            res => {
                this.commonService.toastr('clear');
                const data: any = res;
                this.arrLookupList = data;
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

    addnew() {
        (<FormArray>this.particularForms.get('particularItems')).push(
            new FormGroup({
                id: new FormControl(null),
                serviceId: new FormControl(this.passingObj.id),
                vendor: new FormControl(null),
                currency: new FormControl(null),
                pdaNo: new FormControl(this.inflowService.objBranchRequisitionJobList.pdaNo),
                jobNo: new FormControl(this.inflowService.objBranchRequisitionJobList.jobNo),
                amountRequested: new FormControl(this.passingObj.amtRequested),
                amountApproved: new FormControl(this.passingObj.amtApproved),
                amountDisbursed: new FormControl(this.passingObj.amtDisbursed),
                date: new FormControl(null, Validators.required),
                rate: new FormControl(null, Validators.required),
                amount: new FormControl(null, Validators.required),
                gst: new FormControl(18),
                gstAmount: new FormControl(null),
                tds: new FormControl(null),
                tdsAmount: new FormControl(null),
                mode: new FormControl(null, Validators.required),
                roe: new FormControl(null),
                totalAmount: new FormControl(null),
                remark: new FormControl(null),
                isApproved: new FormControl(null),
                isBranchApproved: new FormControl(null),
                file: new FormControl(null),
                gstDetails: new FormControl(false),
            })
        );
    }

    updateTotalAmount(i) {
        const data = this.getFormValue();
        const update = this.updateFormValue();
        const cnt = update.controls[i] as FormGroup;

        const amount = (Number(data[i].amount) > 0) ? Number(data[i].amount) : 1;
        let gstAmount = 0;
        let tdsAmount = 0;

        if (Number(data[i].gst) > 0) {
            gstAmount = (amount * Number(data[i].gst)) / 100;
            cnt.controls['gstAmount'].setValue(gstAmount.toFixed(2));
        } else {
            cnt.controls['gstAmount'].setValue('');
        }
        if (Number(data[i].tds) > 0) {
            tdsAmount = (amount * Number(data[i].tds)) / 100;
            cnt.controls['tdsAmount'].setValue(tdsAmount.toFixed(2));
        } else {
            cnt.controls['tdsAmount'].setValue('');
        }
        const totAmount = Number(amount) + Number(gstAmount) - Number(tdsAmount);
        cnt.controls['totalAmount'].setValue(totAmount.toFixed(2));
    }

    remove(i) {
        (<FormArray>this.particularForms.controls.particularItems).removeAt(i);
    }

    remark(i) {
        const data = this.getFormValue();
        const update = this.updateFormValue();
        const cnt = update.controls[i] as FormGroup;
        const dialogRef = this.openDialog.open(ParticularRemarkModalComponent, {
            width: '400px',
            data: data[i]
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res !== undefined) {
                cnt.controls['remark'].setValue(res);
            }
        });
    }

    displayGSTDetails(obj, i) {
        const update = this.updateFormValue();
        const cnt = update.controls[i] as FormGroup;
        const dialogRef = this.openDialog.open(GstDetailsComponent, {
            width: '200px',
            height: '120px',
            data: obj
        });
    }

    billDetails(i) {
        const data = this.getFormValue();
        const update = this.updateFormValue();
        const cnt = update.controls[i] as FormGroup;
        const dialogRef = this.openDialog.open(BillDetailsComponent, {
            width: '1000px',
            data: data[i]
        });

        dialogRef.afterClosed().subscribe(res => {
            console.log(res);
            // if (res !== undefined) {
            //     cnt.controls['remark'].setValue(res);
            // }
        });
    }
    // fileEvent($event, i) {
    //     const uploadFile = this.inflowService.uploadFile($event.target);
    //     const update = this.updateFormValue();
    //     const cnt = update.controls[i] as FormGroup;
    //     cnt.controls['file'].setValue(uploadFile);
    // }

    formSubmit(formData) {
        console.log(formData);
        // if (formData.particularItems.length === 0) {
        //     this.commonService.toastr('error', 'Please enter atleast one record');
        //     return false;
        // }
        // this.commonService.toastr('warning', 'Please wait...');
        // const arr = [];
        // for (let i = 0; i < formData.particularItems.length; i++) {
        //     const obj = {
        //         id: formData.particularItems[i].id,
        //         serviceId: formData.particularItems[i].serviceId,
        //         pdaNo: formData.particularItems[i].pdaNo,
        //         jobNo: formData.particularItems[i].jobNo,
        //         vendor: formData.particularItems[i].vendor,
        //         amountRequested: formData.particularItems[i].amountRequested,
        //         amountApproved: formData.particularItems[i].amountApproved,
        //         amountDisbursed: formData.particularItems[i].amountDisbursed,
        //         date: this.commonService.getDate(formData.particularItems[i].date),
        //         rate: formData.particularItems[i].rate,
        //         amount: formData.particularItems[i].amount,
        //         gstRate: formData.particularItems[i].gst,
        //         gstAmount: formData.particularItems[i].gstAmount,
        //         tdsRate: formData.particularItems[i].tds,
        //         tdsAmount: formData.particularItems[i].tdsAmount,
        //         roe: formData.particularItems[i].roe,
        //         mode: formData.particularItems[i].mode,
        //         calculationRemark: formData.particularItems[i].remark,
        //         isApproved: formData.particularItems[i].isApproved,
        //         isBranchApproved: formData.particularItems[i].isBranchApproved,
        //         file: formData.particularItems[i].file
        //     };
        //     arr.push(obj);
        // }
        // this.http.postRequest(this.api.saveParticularList, arr).subscribe(
        //     res => {
        //         this.commonService.toastr('clear');
        //     },
        //     err => {
        //         this.commonService.toastr('clear');
        //         if (err.status === 401 || err.status === 403) {
        //             this.commonService.sessionExpired();
        //         } else {
        //             this.commonService.toastr('error', 'Please try again');
        //         }
        //     }
        // );
    }

    getControls() {
        return (<FormArray>this.particularForms.get('particularItems')).controls;
    }

    getFormValue() {
        return <FormArray>this.particularForms.controls.particularItems.value;
    }

    updateFormValue() {
        return <FormArray>this.particularForms.controls.particularItems;
    }
}
