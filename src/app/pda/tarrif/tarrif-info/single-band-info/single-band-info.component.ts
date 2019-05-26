import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {TarrifService} from '../../../../service/pda/tarrif.service';
import {HttpService} from '../../../../service/http.service';
import {ApiUrlService} from '../../../../service/api-url.service';
import {CommonService} from '../../../../service/common.service';

@Component({
    selector: 'app-single-band-info',
    templateUrl: './single-band-info.component.html',
    styleUrls: ['./single-band-info.component.scss']
})
export class SingleBandInfoComponent implements OnInit {
    arrCurrency = [];
    arrSingleBandData = [];
    arrHeaderDetails: any;
    data: any;

    myForm: FormGroup;
    coastalForm: FormGroup;
    foreignMinDate = [];
    coastalMinDate = [];

    currencyMinLength = 0;
    currencyMaxLength = 0;
    rateForm = false;
    rateCoastalForm = false;
    rateLoop = 0;
    selectTR = 0;
    foreignPassing = 0;
    coastalPassing = 0;

    constructor(private router: Router,
                private fb: FormBuilder,
                public tarrifService: TarrifService,
                private http: HttpService,
                private api: ApiUrlService,
                private commonService: CommonService) {
        this.myForm = this.fb.group({
            currency: this.fb.array([]),
            singleBand: this.fb.array([])
        });

        this.coastalForm = this.fb.group({
            currency: this.fb.array([]),
            singleBand: this.fb.array([])
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
                this.getSingleBandDetails();
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

    getSingleBandDetails() {
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getTarrifheaderById + this.tarrifService.headerId).subscribe(
            res => {
                this.data = res;
                this.commonService.toastr('clear');
                if (this.data !== null || this.data !== '') {
                    this.arrHeaderDetails = this.data;
                    this.fetchForeignData();
                } else {
                    this.currencyMaxLength = this.arrHeaderDetails.foreignTariffDetails.foreignCoastalData.length + 1;
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

    fetchForeignData() {
        this.currencyMaxLength = this.arrHeaderDetails.foreignTariffDetails.foreignCoastalData.length + 1;
        let arrVal = [];
        arrVal = this.arrHeaderDetails.foreignTariffDetails.foreignCoastalData;
        const control = <FormArray>this.myForm.controls.currency;
        control.controls = [];

        for (let i = 0; i < arrVal.length; i++) {
            this.currencyMinLength += 1;
            const d = arrVal[i];
            const date = {
                begin: new Date(d.effectiveFrom),
                end: new Date(d.effectiveTo)
            };
            control.push(
                this.fb.group({
                    currency: [d.currency],
                    minCharge: [d.minCharge],
                    applicable: [(d.rebatePercent > 0) ? true : false],
                    rebatePercent: [d.rebatePercent],
                    isForeign: [1],
                    date: [date],
                    class: [true]
                })
            );
            if (i === 0) {
                this.selectTR = 0;
                this.setWeightData(i);
            }
            this.rateLoop = this.rateLoop + 1;
        }
    }

    setWeightData(i) {
        let arrVal = [];
        arrVal = this.arrHeaderDetails.foreignTariffDetails.foreignCoastalData;
        const control = <FormArray>this.myForm.controls.singleBand;
        control.controls = [];
        if (arrVal[i] !== undefined) {
            if (arrVal[i].bandData.length > 0) {
                this.rateForm = true;
            } else {
                this.rateForm = false;
            }
            for (let j = 0; j < arrVal[i].bandData.length; j++) {
                const from = (arrVal[i].bandData[j].timeFrom) ? arrVal[i].bandData[j].timeFrom : arrVal[i].bandData[j].weightFrom;
                const to = (arrVal[i].bandData[j].timeTo) ? arrVal[i].bandData[j].timeTo : arrVal[i].bandData[j].weightTo;
                control.push(
                    this.fb.group({
                        id: [arrVal[i].bandData[j].id],
                        weightFrom: [from],
                        weightTo: [to],
                        rate: [arrVal[i].bandData[j].rate],
                        class: [true]
                    })
                );
            }
        }
    }

    fetchCoastalData() {
        this.currencyMaxLength = this.arrHeaderDetails.coastalTariffDetails.foreignCoastalData.length + 1;
        let arrVal = [];
        arrVal = this.arrHeaderDetails.coastalTariffDetails.foreignCoastalData;
        const control = <FormArray>this.coastalForm.controls.currency;
        control.controls = [];

        for (let i = 0; i < arrVal.length; i++) {
            this.currencyMinLength += 1;
            const d = arrVal[i];
            const date = {
                begin: new Date(d.effectiveFrom),
                end: new Date(d.effectiveTo)
            };
            control.push(
                this.fb.group({
                    currency: [d.currency],
                    minCharge: [d.minCharge],
                    applicable: [(d.rebatePercent > 0) ? true : false],
                    rebatePercent: [d.rebatePercent],
                    isForeign: [0],
                    date: [date],
                    class: [true]
                })
            );
            if (i === 0) {
                this.selectTR = 0;
                this.setWeightCoastalData(i);
            }
            this.rateLoop = this.rateLoop + 1;
        }
    }

    setWeightCoastalData(i) {
        let arrVal = [];
        arrVal = this.arrHeaderDetails.coastalTariffDetails.foreignCoastalData;
        const control = <FormArray>this.coastalForm.controls.singleBand;
        control.controls = [];
        if (arrVal[i] !== undefined) {
            if (arrVal[i].bandData.length > 0) {
                this.rateCoastalForm = true;
            } else {
                this.rateCoastalForm = false;
            }
            for (let j = 0; j < arrVal[i].bandData.length; j++) {
                const from = (arrVal[i].bandData[j].timeFrom) ? arrVal[i].bandData[j].timeFrom : arrVal[i].bandData[j].weightFrom;
                const to = (arrVal[i].bandData[j].timeTo) ? arrVal[i].bandData[j].timeTo : arrVal[i].bandData[j].weightTo;
                control.push(
                    this.fb.group({
                        id: [arrVal[i].bandData[j].id],
                        weightFrom: [from],
                        weightTo: [to],
                        rate: [arrVal[i].bandData[j].rate],
                        class: [true]
                    })
                );
            }
        }
    }

    addNewCurrency() {
        const singleBand = <FormArray>this.myForm.controls.singleBand;
        singleBand.controls = [];

        const control = <FormArray>this.myForm.controls.currency;
        this.foreignPassing = control.value.length > 0 ? control.value.length : 0;
        control.push(
            this.fb.group({
                currency: [''],
                minCharge: [''],
                applicable: [true],
                rebatePercent: [0],
                isForeign: [1],
                date: [''],
                class: [false]
            })
        );
        this.rateLoop = (this.rateLoop > 0) ? this.rateLoop + 1 : 0;
        this.currencyMinLength += 1;
        this.rateForm = true;
    }

    addNewCoastal() {
        const singleBand = <FormArray>this.coastalForm.controls.singleBand;
        singleBand.controls = [];

        const control = <FormArray>this.coastalForm.controls.currency;
        this.coastalPassing = control.value.length > 0 ? control.value.length : 0;
        control.push(
            this.fb.group({
                currency: [''],
                minCharge: [''],
                applicable: [true],
                rebatePercent: [0],
                isForeign: [0],
                date: [''],
                class: [false]
            })
        );
        this.currencyMinLength += 1;
        this.rateLoop = (this.rateLoop > 0) ? this.rateLoop + 1 : 0;
        this.rateCoastalForm = true;
    }

    addNewRate() {
        const control = <FormArray>this.myForm.controls.singleBand;
        control.push(
            this.fb.group({
                id: [''],
                weightFrom: [''],
                weightTo: [''],
                rate: [''],
                class: [false]
            })
        );
    }

    addNewCoastalRate() {
        const control = <FormArray>this.coastalForm.controls.singleBand;
        control.push(
            this.fb.group({
                id: [''],
                weightFrom: [''],
                weightTo: [''],
                rate: [''],
                class: [false]
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
        if (formData.lenght > 1) {
            this.rateLoop = 0;
        } else {
            this.rateLoop = this.foreignPassing > 0 ? this.foreignPassing : 0;
        }
        const singleBand = this.myForm.controls.singleBand.value;

        if (singleBand.length === 0) {
            this.commonService.toastr('error', 'Please enter the weight or time details');
            return false;
        }
        this.commonService.toastr('clear');
        if (formData[this.rateLoop].currency === '') {
            this.commonService.toastr('error', 'Please select currency');
            return false;
        }
        if (formData[this.rateLoop].date === '' || formData[this.rateLoop].date === null) {
            this.commonService.toastr('error', 'Please select date');
            return false;
        }
        const singleArr = [];
        let rangeCheck = 0;
        for (let i = 0; i < singleBand.length; i++) {
            const a = {
                id: singleBand[i].id
            };
            if (singleBand[i].weightFrom === null || singleBand[i].weightFrom === '') {
                this.commonService.toastr('error', 'Please enter the from');
                return false;
            }
            if (singleBand[i].weightTo === null || singleBand[i].weightTo === '') {
                this.commonService.toastr('error', 'Please enter the to');
                return false;
            }
            if (singleBand[i].rate === null || singleBand[i].rate === '') {
                this.commonService.toastr('error', 'Please enter the rate');
                return false;
            }
            if (this.tarrifService.tarrifHeaderDetails.chargeBasis === 'TIME') {
                a['timeFrom'] = Number(singleBand[i].weightFrom);
                a['timeTo'] = Number(singleBand[i].weightTo);

                if (singleBand.length > 1) {
                    if (!(rangeCheck < a['timeFrom'])) {
                        this.commonService.toastr('error', 'Please enter valid value in From Field');
                        return false;
                    } else if (!(a['timeFrom'] < a['timeTo'])) {
                        this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
                        return false;
                    } else {
                        rangeCheck = a['timeTo'];
                    }
                } else {
                    if (!(rangeCheck < a['timeFrom'])) {
                        this.commonService.toastr('error', 'Please enter valid value in From Field');
                        return false;
                    } else if (!(a['timeFrom'] < a['timeTo'])) {
                        this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
                        return false;
                    } else {
                        rangeCheck = a['timeTo'];
                    }
                }
            } else {
                a['weightFrom'] = Number(singleBand[i].weightFrom);
                a['weightTo'] = Number(singleBand[i].weightTo);
                if (singleBand.length > 1) {
                    if (!(rangeCheck < a['weightFrom'])) {
                        this.commonService.toastr('error', 'Please enter valid value in From Field');
                        return false;
                    } else if (!(a['weightFrom'] < a['weightTo'])) {
                        this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
                        return false;
                    } else {
                        rangeCheck = a['weightTo'];
                    }
                } else {
                    if (!(rangeCheck < a['weightFrom'])) {
                        this.commonService.toastr('error', 'Please enter valid value in From Field');
                        return false;
                    } else if (!(a['weightFrom'] < a['weightTo'])) {
                        this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
                        return false;
                    } else {
                        rangeCheck = a['weightTo'];
                    }
                }
            }
            a['rate'] = singleBand[i].rate;
            singleArr.push(a);
        }
        const arr = {
            calculationType: this.tarrifService.tarrifHeaderDetails.calculationType,
            isForeign: formData[this.rateLoop].isForeign,
            tariffHeaderId: this.tarrifService.tarrifHeaderDetails.id,
        };
        arr['foreignCoastalData'] = [{
            effectiveFrom: this.commonService.dateFormat(formData[this.rateLoop].date.begin) + 'T00:00:00',
            effectiveTo: this.commonService.dateFormat(formData[this.rateLoop].date.end) + 'T00:00:00',
            currency: formData[this.rateLoop].currency,
            minCharge: formData[this.rateLoop].minCharge,
            rebatePercent: formData[this.rateLoop].applicable === true ? formData[this.rateLoop].rebatePercent : 0,
            bandData: singleArr
        }];
      // this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.saveTarrifDetails, arr).subscribe(
            res => {
              this.commonService.toastr('success', 'Data Saved Successfully');
              /*edited and added by shail to stop routing to list page*/
              setTimeout(() => {
                this.commonService.toastr('clear');
              }, 1000);
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(["pda/single-band-info"]));
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
        if (formData.lenght > 1) {
            this.rateLoop = 0;
        } else {
            this.rateLoop = this.coastalPassing > 0 ? this.coastalPassing : 0;
        }
        const singleBand = this.coastalForm.controls.singleBand.value;
        if (singleBand.length === 0) {
            this.commonService.toastr('error', 'Please enter the weight or time details');
            return false;
        }
        this.commonService.toastr('clear');
        if (formData[this.rateLoop].currency === '') {
            this.commonService.toastr('error', 'Please select currency');
            return false;
        }
        if (formData[this.rateLoop].date === '' || formData[this.rateLoop].date === null) {
            this.commonService.toastr('error', 'Please select date');
            return false;
        }
        const singleArr = [];
        let rangeCheck = 0;
        for (let i = 0; i < singleBand.length; i++) {
            const a = {
                id: singleBand[i].id
            };
            if (singleBand[i].weightFrom === null || singleBand[i].weightFrom === '') {
                this.commonService.toastr('error', 'Please enter the from');
                return false;
            }
            if (singleBand[i].weightTo === null || singleBand[i].weightTo === '') {
                this.commonService.toastr('error', 'Please enter the to');
                return false;
            }
            if (singleBand[i].rate === null || singleBand[i].rate === '') {
                this.commonService.toastr('error', 'Please enter the rate');
                return false;
            }
            if (this.tarrifService.tarrifHeaderDetails.chargeBasis === 'TIME') {
                a['timeFrom'] = Number(singleBand[i].weightFrom);
                a['timeTo'] = Number(singleBand[i].weightTo);

                if (singleBand.length > 1) {
                    if (!(rangeCheck < a['timeFrom'])) {
                        this.commonService.toastr('error', 'Please enter valid value in From Field');
                        return false;
                    } else if (!(a['timeFrom'] < a['timeTo'])) {
                        this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
                        return false;
                    } else {
                        rangeCheck = a['timeTo'];
                    }
                } else {
                    if (!(rangeCheck < a['timeFrom'])) {
                        this.commonService.toastr('error', 'Please enter valid value in From Field');
                        return false;
                    } else if (!(a['timeFrom'] < a['timeTo'])) {
                        this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
                        return false;
                    } else {
                        rangeCheck = a['timeTo'];
                    }
                }
            } else {
                a['weightFrom'] = Number(singleBand[i].weightFrom);
                a['weightTo'] = Number(singleBand[i].weightTo);

                if (singleBand.length > 1) {
                    if (!(rangeCheck < a['weightFrom'])) {
                        this.commonService.toastr('error', 'Please enter valid value in From Field');
                        return false;
                    } else if (!(a['weightFrom'] < a['weightTo'])) {
                        this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
                        return false;
                    } else {
                        rangeCheck = a['weightTo'];
                    }
                } else {
                    if (!(rangeCheck < a['weightFrom'])) {
                        this.commonService.toastr('error', 'Please enter valid value in From Field');
                        return false;
                    } else if (!(a['weightFrom'] < a['weightTo'])) {
                        this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
                        return false;
                    } else {
                        rangeCheck = a['weightTo'];
                    }
                }
            }
            a['rate'] = singleBand[i].rate;
            singleArr.push(a);
        }
        const arr = {
            calculationType: this.tarrifService.tarrifHeaderDetails.calculationType,
            isForeign: formData[this.rateLoop].isForeign,
            tariffHeaderId: this.tarrifService.tarrifHeaderDetails.id
        };
        arr['foreignCoastalData'] = [{
            effectiveFrom: this.commonService.dateFormat(formData[this.rateLoop].date.begin) + 'T00:00:00',
            effectiveTo: this.commonService.dateFormat(formData[this.rateLoop].date.end) + 'T00:00:00',
            currency: formData[this.rateLoop].currency,
            minCharge: formData[this.rateLoop].minCharge,
            rebatePercent: formData[this.rateLoop].applicable === true ? formData[this.rateLoop].rebatePercent : 0,
            bandData: singleArr
        }];
      // this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.saveTarrifDetails, arr).subscribe(
            res => {
              this.commonService.toastr('success', 'Data Saved Successfully');
              /*edited and added by shail to stop routing to list page*/
              setTimeout(() => {
                this.commonService.toastr('clear');
              }, 1000);
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(["pda/single-band-info"]));
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

    getSingleBandData(i) {
        this.rateLoop = i;
        this.arrSingleBandData = [];
        this.rateForm = true;
        this.selectTR = i;
        this.foreignPassing = i;
        this.setWeightData(i);
    }

    getSingleBandCoastalData(i) {
        this.rateLoop = i;
        this.selectTR = i;
        this.coastalPassing = i;
        this.arrSingleBandData = [];
        this.rateCoastalForm = true;
        this.setWeightCoastalData(i);
    }

    back_main() {
        this.router.navigate(['pda/tarif-info']);
    }

    tab(e) {
        this.rateLoop = 0;
        this.currencyMaxLength = 0;
        this.currencyMinLength = 0;
        if (e.index > 0) {
            this.fetchCoastalData();
        } else {
            this.fetchForeignData();
        }
    }

    getCoastalFormCurrencyControls() {
        return (<FormArray>this.coastalForm.get('currency')).controls;
    }

    getCoastalFormSingleBandControl() {
        return (<FormArray>this.coastalForm.get('singleBand')).controls;
    }

    getMyFormCurrencyControls() {
        return (<FormArray>this.myForm.get('currency')).controls;
    }

    getMyFormSingleBandControl() {
        return (<FormArray>this.myForm.get('singleBand')).controls;
    }
}
