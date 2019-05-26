import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {TarrifService} from '../../../../service/pda/tarrif.service';
import {HttpService} from '../../../../service/http.service';
import {ApiUrlService} from '../../../../service/api-url.service';
import {CommonService} from '../../../../service/common.service';

@Component({
    selector: 'app-ls-flat-info',
    templateUrl: './ls-flat-info.component.html',
    styleUrls: ['./ls-flat-info.component.scss']
})
export class LsFlatInfoComponent implements OnInit {
    arrCurrency = [];
    arrLSFlatList: any;
    data: any;
    myForm: FormGroup;
    coastalForm: FormGroup;

    constructor(private router: Router,
                private fb: FormBuilder,
                public tarrifService: TarrifService,
                private http: HttpService,
                private api: ApiUrlService,
                private commonService: CommonService) {
        this.myForm = this.fb.group({
            currency: this.fb.array([])
        });

        this.coastalForm = this.fb.group({
            currency: this.fb.array([])
        });
    }

    ngOnInit() {

        if (this.tarrifService.tarrifHeaderDetails === undefined) {
            this.tarrifService.tarrifHeaderDetails = JSON.parse(localStorage.getItem('tarrifHeaderDetails'));
        }
        // getTarrifheaderById
        this.tarrifService.checkTarrifHeader();
        this.getLookupData();
    }

    getLookupData() {
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getLookupListData + 'CURRENCY').subscribe(
            res => {
                this.data = res;
                this.arrCurrency = this.data;
                this.getLSFlatDetails();
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

    getLSFlatDetails() {
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getTarrifheaderById + this.tarrifService.headerId).subscribe(
            res => {
                this.data = res;
                this.commonService.toastr('clear');
                if ((this.data !== null || this.data !== '') && (this.data.coastalTariffDetails.calculationType === 'LS' ||
                    this.data.coastalTariffDetails.calculationType === 'FLAT')) {
                    this.arrLSFlatList = this.data;
                    for (let i = 0; i < this.arrLSFlatList.coastalTariffDetails.foreignCoastalData.length; i++) {
                        const d = this.arrLSFlatList.coastalTariffDetails.foreignCoastalData[i];
                        const date = {
                            begin: new Date(d.effectiveFrom),
                            end: new Date(d.effectiveTo)
                        };
                        const control = <FormArray>this.coastalForm.controls.currency;
                        control.push(
                            this.fb.group({
                                id: [d.id],
                                currency: [d.currency],
                                rate: [d.rate],
                                minCharge: [d.minCharge],
                                applicable: [(d.rebatePercent > 0) ? true : false],
                                rebatePercent: [d.rebatePercent],
                                isForeign: [0],
                                date: [date]
                            })
                        );
                    }
                    for (let i = 0; i < this.arrLSFlatList.foreignTariffDetails.foreignCoastalData.length; i++) {
                        const d = this.arrLSFlatList.foreignTariffDetails.foreignCoastalData[i];
                        const date = {
                            begin: new Date(d.effectiveFrom),
                            end: new Date(d.effectiveTo)
                        };
                        const control = <FormArray>this.myForm.controls.currency;
                        control.push(
                            this.fb.group({
                                id: [d.id],
                                currency: [d.currency],
                                rate: [d.rate],
                                minCharge: [d.minCharge],
                                applicable: [(d.rebatePercent > 0) ? true : false],
                                rebatePercent: [d.rebatePercent],
                                isForeign: [1],
                                date: [date]
                            })
                        );
                    }
                }
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

    addNewCurrency() {
        const control = <FormArray>this.myForm.controls.currency;
        control.push(
            this.fb.group({
                id: [''],
                currency: [''],
                rate: [''],
                minCharge: [''],
                checkbox_value: [null],
                applicable: [true],
                rebatePercent: [0],
                isForeign: [1],
                date: ['']
            })
        );
    }

    removeEmptyRow(i, isForeign) {
        const control = (isForeign) ? <FormArray>this.myForm.controls.currency : <FormArray>this.coastalForm.controls.currency;
        control.removeAt(i);
    }

    addNewCoastal() {
        const control = <FormArray>this.coastalForm.controls.currency;
        control.push(
            this.fb.group({
                id: [''],
                currency: [''],
                rate: [''],
                minCharge: [''],
                checkbox_value: [null],
                applicable: [true],
                rebatePercent: [0],
                isForeign: [0],
                date: ['']
            })
        );
    }

    validateNumber(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    save() {
        const formData = this.myForm.controls.currency.value;
        this.commonService.toastr('clear');
        const decimalVal = /^[-+]?[0-9]+\.[0-9]+$/;
        const dataForm = [];
        const finalData = {};
        for (let i = 0; i < formData.length; i++) {
            const arr = {};
            if (formData[i].currency === '') {
                this.commonService.toastr('error', 'Please select currency');
                return false;
            }
            if (formData[i].rate === '') {
                this.commonService.toastr('error', 'Please enter rate');
                return false;
            }
            if (formData[i].date === '' || formData[i].date === null) {
                this.commonService.toastr('error', 'Please select date');
                return false;
            }
            arr['effectiveFrom'] = this.commonService.dateFormat(formData[i].date.begin) + 'T00:00:00';
            arr['effectiveTo'] = this.commonService.dateFormat(formData[i].date.end) + 'T00:00:00';
            arr['currency'] = formData[i].currency;
            arr['id'] = formData[i].id;
            arr['minCharge'] = formData[i].minCharge;
            arr['rate'] = formData[i].rate;
            arr['rebatePercent'] = formData[i].applicable === true ? formData[i].rebatePercent : 0;
            dataForm.push(arr);
        }
        finalData['tariffHeaderId'] = this.tarrifService.tarrifHeaderDetails.id;
        finalData['calculationType'] = this.tarrifService.tarrifHeaderDetails.calculationType;
        finalData['isForeign'] = formData[0].isForeign;
        finalData['foreignCoastalData'] = dataForm;

      // this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.saveTarrifDetails, finalData).subscribe(
            res => {
              this.commonService.toastr('success', 'Data Saved Successfully');
              /*edited and added by shail to stop routing to list page*/
              setTimeout(() => {
                this.commonService.toastr('clear');
              }, 1000);
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(["pda/ls-flat-info"]));
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

    saveCoastal() {
        const formData = this.coastalForm.controls.currency.value;
        this.commonService.toastr('clear');
        const decimalVal = /^[-+]?[0-9]+\.[0-9]+$/;
        const dataForm = [];
        const finalData = {};
        for (let i = 0; i < formData.length; i++) {
            const arr = {};
            if (formData[i].currency === '') {
                this.commonService.toastr('error', 'Please select currency');
                return false;
            }
            if (formData[i].rate === '') {
                this.commonService.toastr('error', 'Please enter rate');
                return false;
            }
            if (formData[i].date === '' || formData[i].date === null) {
                this.commonService.toastr('error', 'Please select date');
                return false;
            }
            arr['effectiveFrom'] = this.commonService.dateFormat(formData[i].date.begin) + 'T00:00:00';
            arr['effectiveTo'] = this.commonService.dateFormat(formData[i].date.end) + 'T00:00:00';
            arr['currency'] = formData[i].currency;
            arr['id'] = formData[i].id;
            arr['minCharge'] = formData[i].minCharge;
            arr['rate'] = formData[i].rate;
            arr['rebatePercent'] = formData[i].applicable === true ? formData[i].rebatePercent : 0;
            dataForm.push(arr);
        }
        finalData['tariffHeaderId'] = this.tarrifService.tarrifHeaderDetails.id;
        finalData['calculationType'] = this.tarrifService.tarrifHeaderDetails.calculationType;
        finalData['isForeign'] = formData[0].isForeign;
        finalData['foreignCoastalData'] = dataForm;

      // this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.saveTarrifDetails, finalData).subscribe(
            res => {
              this.commonService.toastr('success', 'Data Saved Successfully');
              /*edited and added by shail to stop routing to list page*/
              setTimeout(() => {
                this.commonService.toastr('clear');
              }, 1000);
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(["pda/ls-flat-info"]));
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

    back_main() {
        this.router.navigate(['pda/tarif-info']);
    }

    getMyFormCurrencyControls() {
        return (<FormArray>this.myForm.get('currency')).controls;
    }

    getCoastalFormCurrencyControls() {
        return (<FormArray>this.coastalForm.get('currency')).controls;
    }


}
