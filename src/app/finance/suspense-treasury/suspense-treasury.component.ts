import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {ApiUrlService} from '../../service/api-url.service';
import {HttpService} from '../../service/http.service';
import {CreateService} from '../../service/pda/create.service';
import {InflowService} from '../../service/finance/inflow.service';
import {Observable} from 'rxjs';
import {Bank} from '../inflow/inflow.component';
import {map, startWith} from 'rxjs/operators';

export interface Bank {
    id: number;
    bank: string;
}

@Component({
    selector: 'app-suspense-treasury',
    templateUrl: './suspense-treasury.component.html',
    styleUrls: ['./suspense-treasury.component.scss']
})
export class SuspenseTreasuryComponent implements OnInit {
    @Input() getSuspenseData;

    objectKeys = Object.keys;
    totAmount = 0;
    bankCharge = 0;
    amtRcv = 0;

    treasuryForm: FormGroup;
    treasuryItems = new FormArray([]);
    arrBankList: Bank[] = [];
    bankCtrl = new FormControl();
    filteredBank: Observable<Bank[]>;

    constructor(public commonService: CommonService, private api: ApiUrlService,
                private http: HttpService, private createService: CreateService,
                private inflowService: InflowService) {
        this.filteredBank = this.bankCtrl.valueChanges
            .pipe(
                startWith<string | Bank>(''),
                map(value => typeof value === 'string' ? value : value.bank),
                map(name => name ? this._filterBank(name) : this.arrBankList.slice())
            );
    }

    ngOnInit() {
        if (this.getSuspenseData) {
            this.treasuryForm = new FormGroup({
                'treasuryItems': this.treasuryItems
            });
            this.getSuspenseCustomerDetails();
        }
    }

    getSuspenseCustomerDetails() {
        this.http.getRequest(this.api.getInflowSuspenseCustomerList).subscribe(
            res => {
                this.totAmount = 0;
                this.amtRcv = 0;
                this.bankCharge = 0;
                const data: any = res;
                for (let i = 0; i < data.length; i++) {
                    this.totAmount += Number(data[i].netAmountReceivedLocal);
                    this.bankCharge += Number(data[i].bankCharges);
                    this.amtRcv += Number(data[i].grossAmountReceivedLocal);
                    const date = (data[i].date) ?
                        new Date(data[i].date) : null;
                    const bank = {
                        id: data[i].bankId,
                        bank: data[i].bankName
                    };
                    (<FormArray>this.treasuryForm.get('treasuryItems')).push(
                        new FormGroup({
                            id: new FormControl(data[i].id),
                            bankId: new FormControl(bank, Validators.required),
                            customerId: new FormControl(null),
                            type: new FormControl(data[i].type),
                            remitter: new FormControl(data[i].remitter, Validators.required),
                            date: new FormControl(date, Validators.required),
                            currency: new FormControl(data[i].currency),
                            bankReferenceNo: new FormControl(data[i].bankReferenceNo),
                            amountReceived: new FormControl(data[i].amountReceived),
                            bankCharges: new FormControl(data[i].bankCharges),
                            grossAmountReceivedLocal: new FormControl(data[i].grossAmountReceivedLocal),
                            netAmountReceivedLocal: new FormControl(data[i].netAmountReceivedLocal),
                            roe: new FormControl(data[i].roe),
                            remarks: new FormControl(data[i].remarks),
                            customerBank: new FormControl(data[i].customerBank),
                            pdaNo: new FormControl(data[i].pdaNo),
                        })
                    );
                }
            },
            err => {
                if (err.status === 401 || err.status === 403) {
                    this.commonService.sessionExpired();
                } else {
                    this.commonService.toastr('error', 'Please try again');
                }
            }
        );
    }

    saveTresury(formData) {
        if (formData.treasuryItems.length === 0) {
            this.commonService.toastr('error', 'Please enter atleast 1 record');
        } else {
            const arr = [];
            for (let i = 0; i < formData.treasuryItems.length; i++) {
                const obj = {
                    id: formData.treasuryItems[i].id,
                    bankId: formData.treasuryItems[i].bankId.id,
                    customerId: null,
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
                    customerBank: formData.treasuryItems[i].customerBank
                };
                arr.push(obj);
            }
            this.http.postRequest(this.api.saveInflowCustomerList, arr).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.commonService.toastr('success', 'Successfully inserted');
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

    onAddItem() {
        (<FormArray>this.treasuryForm.get('treasuryItems')).push(
            new FormGroup({
                id: new FormControl(null),
                bankId: new FormControl('', Validators.required),
                customerBank: new FormControl('', Validators.required),
                remitter: new FormControl('', Validators.required),
                bankReferenceNo: new FormControl(''),
                date: new FormControl('', Validators.required),
                currency: new FormControl('', Validators.required),
                amountReceived: new FormControl('', Validators.required),
                roe: new FormControl(''),
                grossAmountReceivedLocal: new FormControl('', Validators.required),
                bankCharges: new FormControl('', Validators.required),
                netAmountReceivedLocal: new FormControl('', Validators.required),
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
            this.amtRcv += Number(v.grossAmountReceivedLocal);
        });
        this.setROE(i);
    }

    setROE(i) {
        let roe = 0;
        const data = this.getFormTresuryArray();
        const update = this.updateFormTresuryArray();
        if (Number(data[i].amountReceived) > 0) {
            roe = Number(data[i].grossAmountReceivedLocal) / Number(data[i].amountReceived);
        }
        const cnt = update.controls[i] as FormGroup;
        cnt.controls['roe'].setValue(roe.toFixed(2));
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
            this.bankCharge += Number(v.bankCharges);
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
            this.totAmount += Number(v.netAmountReceivedLocal);
        });
    }

    remove(i) {
        const data = this.getFormTresuryArray();
        this.totAmount = Number(this.totAmount) - Number(data[i].netAmountReceivedLocal);
        this.bankCharge = Number(this.bankCharge) - Number(data[i].bankCharges);
        this.amtRcv = Number(this.amtRcv) - Number(data[i].grossAmountReceivedLocal);
        (<FormArray>this.treasuryForm.get('treasuryItems')).removeAt(i);
    }

    // Form Array ==========================================================================================================================

    getFormTresuryArray() {
        return <FormArray>this.treasuryForm.controls.treasuryItems.value;
    }

    updateFormTresuryArray() {
        return <FormArray>this.treasuryForm.controls.treasuryItems;
    }

    getControls() {
        return (<FormArray>this.treasuryForm.get('treasuryItems')).controls;
    }

    // Bank
    private _filterBank(value: string): Bank[] {
        const filterValue = value.toLowerCase();
        return this.arrBankList.filter(c => c.bank.toLowerCase().indexOf(filterValue) === 0);
    }
}
