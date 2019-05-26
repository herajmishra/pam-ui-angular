import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {TarrifService} from '../../../../service/pda/tarrif.service';
import {HttpService} from '../../../../service/http.service';
import {ApiUrlService} from '../../../../service/api-url.service';
import {CommonService} from '../../../../service/common.service';

@Component({
    selector: 'app-double-band-info',
    templateUrl: './double-band-info.component.html',
    styleUrls: ['./double-band-info.component.scss']
})
export class DoubleBandInfoComponent implements OnInit {
    arrCurrency = [];
    arrHeaderDetails: any;

    myForm: FormGroup;
    coastalForm: FormGroup;

    data: any;
    currencyLoop = 0;
    coastalLoop = 0;
    currencyForm = false;
    foreignPassing = 0;
    coastalPassing = 0;
    foreignWeightPassing = 0;
    coastalWeightPassing = 0;

    weightLoop = 0;
    weightPassingData = 0;
    weightForm = false;
    currencyMinLength = 0;
    currencyMaxLength = 0;
    weightMinlength = 0;
    weightMaxlength = 1;

    selectTR = 0;
    selectTRSub = 0;

    constructor(private router: Router,
                private fb: FormBuilder,
                public tarrifService: TarrifService,
                private http: HttpService,
                private api: ApiUrlService,
                private commonService: CommonService) {
        this.myForm = this.fb.group({
            currency: this.fb.array([]),
            singleBand: this.fb.array([]),
            doubleBand: this.fb.array([])
        });

        this.coastalForm = this.fb.group({
            currency: this.fb.array([]),
            singleBand: this.fb.array([]),
            doubleBand: this.fb.array([])
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

    tab(e) {
        this.currencyMinLength = 0;
        this.currencyMaxLength = 0;
        this.weightMinlength = 0;
        this.foreignPassing = 0;
        this.coastalPassing = 0;
        this.weightPassingData = 0;
        this.selectTRSub = 0;
        this.selectTR = 0;

        if (e.index > 0) {
            this.currencyForm = false;
            this.weightForm = false;
            this.fetchCoastalData();
        } else {
            this.fetchForeignData();
        }
    }

    getLookupData() {
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getLookupListData + 'CURRENCY').subscribe(
            res => {
                this.data = res;
                this.arrCurrency = this.data;
                this.getDoubleBandDetails();
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

    getDoubleBandDetails() {
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
                this.setWeightData(i);
            }
        }
    }

    getSingleBandData(i) {
        this.currencyForm = true;
        this.weightForm = true;
        this.selectTR = i;
        this.selectTRSub = 0;
        this.foreignPassing = i;
        this.setWeightData(i);
    }

    setWeightData(i) {
        let arrVal = [];
        arrVal = this.arrHeaderDetails.foreignTariffDetails.foreignCoastalData;
        const control = <FormArray>this.myForm.controls.singleBand;
        control.controls = [];
        if (arrVal[i] !== undefined) {
            if (arrVal[i].bandData.length > 0) {
                this.currencyForm = true;
            }
            const splt = this.tarrifService.tarrifHeaderDetails.uom.split('~');
            for (let j = 0; j < arrVal[i].bandData.length; j++) {
                control.push(
                    this.fb.group({
                        uom: [splt[1]],
                        timeFrom: [arrVal[i].bandData[j].timeFrom],
                        timeTo: [arrVal[i].bandData[j].timeTo],
                        calculationTypeID: i,
                        class: [true]
                    })
                );
                if (j === 0) {
                    this.setWeightBasedRateData(j, i);
                }
            }
        }
    }

    setRateData(i) {
        const control = <FormArray>this.myForm.controls.doubleBand;
        control.controls = [];
        let arrVal = [];
        arrVal = this.arrHeaderDetails.foreignTariffDetails.foreignCoastalData;
        if (arrVal[i] !== undefined) {
            if (arrVal[i].bandData[i].weightBandData.length > 0) {
                this.weightForm = true;
            }

            const splt = this.tarrifService.tarrifHeaderDetails.uom.split('~');
            for (let j = 0; j < arrVal[i].bandData[i].weightBandData.length; j++) {
                control.push(
                    this.fb.group({
                        id: [arrVal[i].bandData[i].weightBandData[j].id],
                        uom: [splt[0]],
                        weightFrom: [arrVal[i].bandData[i].weightBandData[j].weightFrom],
                        weightTo: [arrVal[i].bandData[i].weightBandData[j].weightTo],
                        rate: [arrVal[i].bandData[i].weightBandData[j].rate],
                        class: [true]
                    })
                );
            }
        }
    }

    getRateForm(i, parentID) {
        this.weightForm = true;
        this.selectTRSub = i;
        this.weightPassingData = i;
        this.foreignWeightPassing = i;
        this.setWeightBasedRateData(i, parentID);
    }

    setWeightBasedRateData(i, parentID) {
        const control = <FormArray>this.myForm.controls.doubleBand;
        control.controls = [];

        let arrVal = [];
        arrVal = this.arrHeaderDetails.foreignTariffDetails.foreignCoastalData;

        if (arrVal[parentID] !== undefined) {
            if (arrVal[parentID].bandData[i].weightBandData.length > 0) {
                this.weightForm = true;
            }
            const splt = this.tarrifService.tarrifHeaderDetails.uom.split('~');
            for (let j = 0; j < arrVal[parentID].bandData[i].weightBandData.length; j++) {
                control.push(
                    this.fb.group({
                        id: [arrVal[parentID].bandData[i].weightBandData[j].id],
                        uom: [splt[0]],
                        weightFrom: [arrVal[parentID].bandData[i].weightBandData[j].weightFrom],
                        weightTo: [arrVal[parentID].bandData[i].weightBandData[j].weightTo],
                        rate: [arrVal[parentID].bandData[i].weightBandData[j].rate],
                        class: [true]
                    })
                );
            }
        }
    }

    addNewTime() {
        const doubleBand = <FormArray>this.myForm.controls.doubleBand;
        doubleBand.controls = [];
        const splt = this.tarrifService.tarrifHeaderDetails.uom.split('~');
        const control = <FormArray>this.myForm.controls.singleBand;
        this.foreignWeightPassing = control.controls.length > 0 ? control.controls.length : 0;
        control.push(
            this.fb.group({
                uom: [splt[1]],
                timeFrom: [''],
                timeTo: [''],
                calculationTypeID: this.foreignPassing,
                class: [false]
            })
        );
        this.weightMinlength += 1;
    }

    addNewWeight() {
        const splt = this.tarrifService.tarrifHeaderDetails.uom.split('~');
        const control = <FormArray>this.myForm.controls.doubleBand;
        control.push(
            this.fb.group({
                id: [''],
                uom: [splt[0]],
                weightFrom: [''],
                weightTo: [''],
                rate: [''],
                class: [false]
            })
        );
    }

    addNewCurrency() {
        const singleBand = <FormArray>this.myForm.controls.singleBand;
        singleBand.controls = [];
        const doubleBand = <FormArray>this.myForm.controls.doubleBand;
        doubleBand.controls = [];
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
        this.currencyMinLength += 1;
    }

    save() {
        this.currencyLoop = this.foreignPassing;
        this.weightPassingData = this.foreignWeightPassing;

        const currencyData = this.myForm.controls.currency.value;
        const singleBandData = this.myForm.controls.singleBand.value;
        const doubleBandData = this.myForm.controls.doubleBand.value;
        if (!this.checkUOMTimeRange(singleBandData)) {
            return false;
        }
        // Validation
        if (currencyData[this.currencyLoop].currency === '' || currencyData[this.currencyLoop].currency === null) {
            this.commonService.toastr('error', 'Please select currency');
            return false;
        }
        if (currencyData[this.currencyLoop].date === '' || currencyData[this.currencyLoop].date === null) {
            this.commonService.toastr('error', 'Please select date');
            return false;
        }
        if (singleBandData[this.weightPassingData].timeFrom === '' || singleBandData[this.weightPassingData].timeFrom === null) {
            this.commonService.toastr('error', 'Please enter from time');
            return false;
        }
        if (singleBandData[this.weightPassingData].timeTo === '' || singleBandData[this.weightPassingData].timeTo === null) {
            this.commonService.toastr('error', 'Please enter to time');
            return false;
        }
        if (!(Number(singleBandData[this.weightPassingData].timeFrom) < Number(singleBandData[this.weightPassingData].timeTo))) {
            this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
            return false;
        }
        const arr = [];
        let rangeCheck = 0;
        for (let i = 0; i < doubleBandData.length; i++) {
            if (doubleBandData[i].rate === '' || doubleBandData[i].rate === null) {
                this.commonService.toastr('error', 'Please enter the rate');
                return false;
            }
            if (doubleBandData[i].weightFrom === '' || doubleBandData[i].weightFrom === null) {
                this.commonService.toastr('error', 'Please enter weight from');
                return false;
            }
            if (doubleBandData[i].weightTo === '' || doubleBandData[i].weightTo === null) {
                this.commonService.toastr('error', 'Please enter weight to');
                return false;
            }
            if (doubleBandData.length > 1) {
                if (!(rangeCheck < Number(doubleBandData[i].weightFrom))) {
                    this.commonService.toastr('error', 'Please enter valid range in Weight UOM.');
                    return false;
                } else if (!(Number(doubleBandData[i].weightFrom) < Number(doubleBandData[i].weightTo))) {
                    this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
                    return false;
                } else {
                    rangeCheck = Number(doubleBandData[i].weightTo);
                }
            } else {
                if (!(rangeCheck < Number(doubleBandData[i].weightFrom))) {
                    this.commonService.toastr('error', 'Please enter valid range in Weight UOM.');
                    return false;
                } else if (!(Number(doubleBandData[i].weightFrom) < Number(doubleBandData[i].weightTo))) {
                    this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
                    return false;
                } else {
                    rangeCheck = Number(doubleBandData[i].weightTo);
                }
            }
            const d = {
                id: doubleBandData[i].id,
                weightFrom: doubleBandData[i].weightFrom,
                weightTo: doubleBandData[i].weightTo,
                rate: doubleBandData[i].rate
            };
            arr.push(d);
        }
        if (arr.length === 0) {
            this.commonService.toastr('error', 'Please enter weight details');
            return false;
        }
        //
        const formData = {
            calculationType: this.tarrifService.tarrifHeaderDetails.calculationType,
            isForeign: currencyData[this.currencyLoop].isForeign,
            tariffHeaderId: this.tarrifService.tarrifHeaderDetails.id,
            foreignCoastalData: [
                {
                    currency: currencyData[this.currencyLoop].currency,
                    minCharge: currencyData[this.currencyLoop].minCharge,
                    rebatePercent: currencyData[this.currencyLoop].applicable === true ?
                        currencyData[this.currencyLoop].rebatePercent : 0,
                    effectiveFrom: this.commonService.dateFormat(currencyData[this.currencyLoop].date.begin) + 'T00:00:00',
                    effectiveTo: this.commonService.dateFormat(currencyData[this.currencyLoop].date.end) + 'T00:00:00',
                    bandData: [
                        {
                            timeFrom: singleBandData[this.weightPassingData].timeFrom,
                            timeTo: singleBandData[this.weightPassingData].timeTo,
                            weightBandData: arr
                        }
                    ]
                }
            ]
        };
      // this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.saveTarrifDetails, formData).subscribe(
            res => {
              this.commonService.toastr('success', 'Data Saved Successfully');
              /*edited and added by shail to stop routing to list page*/
              setTimeout(() => {
                this.commonService.toastr('clear');
              }, 1000);
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(["pda/double-band-info"]));
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

    // ================================================= Coastal ===================================================

    getCoastalSingleBandData(i) {
        this.currencyForm = true;
        this.weightForm = true;
        this.selectTR = i;
        this.selectTRSub = 0;
        this.coastalPassing = i;
        this.setCoastalWeightData(i);
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
                this.setCoastalWeightData(i);
            }
        }
    }

    setCoastalWeightData(i) {
        let arrVal = [];
        arrVal = this.arrHeaderDetails.coastalTariffDetails.foreignCoastalData;
        const control = <FormArray>this.coastalForm.controls.singleBand;
        control.controls = [];

        const double = <FormArray>this.coastalForm.controls.doubleBand;
        double.controls = [];
        if (arrVal[i] !== undefined) {
            if (arrVal[i].bandData.length > 0) {
                this.currencyForm = true;
            }
            for (let j = 0; j < arrVal[i].bandData.length; j++) {
                const splt = this.tarrifService.tarrifHeaderDetails.uom.split('~');
                control.push(
                    this.fb.group({
                        uom: [splt[1]],
                        timeFrom: [arrVal[i].bandData[j].timeFrom],
                        timeTo: [arrVal[i].bandData[j].timeTo],
                        class: [true],
                        calculationTypeID: i,
                    })
                );
                if (j === 0) {
                    this.setCoastalWeightBasedRateData(j, i);
                }
            }
        }
    }

    setCoastalWeightBasedRateData(i, parentID) {
        const control = <FormArray>this.coastalForm.controls.doubleBand;
        control.controls = [];
        let arrVal = [];
        arrVal = this.arrHeaderDetails.coastalTariffDetails.foreignCoastalData;

        if (arrVal[parentID] !== undefined) {
            if (arrVal[parentID].bandData[i].weightBandData.length > 0) {
                this.weightForm = true;
            }
            const splt = this.tarrifService.tarrifHeaderDetails.uom.split('~');
            for (let j = 0; j < arrVal[parentID].bandData[i].weightBandData.length; j++) {
                control.push(
                    this.fb.group({
                        id: [arrVal[parentID].bandData[i].weightBandData[j].id],
                        uom: [splt[0]],
                        weightFrom: [arrVal[parentID].bandData[i].weightBandData[j].weightFrom],
                        weightTo: [arrVal[parentID].bandData[i].weightBandData[j].weightTo],
                        rate: [arrVal[parentID].bandData[i].weightBandData[j].rate],
                        class: [true]
                    })
                );
            }
        }
    }

    getCoastalRateForm(i, parentID) {
        this.weightForm = true;
        this.selectTRSub = i;
        this.coastalWeightPassing = i;
        this.setCoastalWeightBasedRateData(i, parentID);
    }

    addNewCoastalCurrency() {
        const singleBand = <FormArray>this.coastalForm.controls.singleBand;
        singleBand.controls = [];
        const doubleBand = <FormArray>this.coastalForm.controls.doubleBand;
        doubleBand.controls = [];
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
        this.weightPassingData = 0;
        this.currencyMinLength += 1;
    }

    addCoastalNewTime() {
        const doubleBand = <FormArray>this.coastalForm.controls.doubleBand;
        doubleBand.controls = [];
        const splt = this.tarrifService.tarrifHeaderDetails.uom.split('~');
        const control = <FormArray>this.coastalForm.controls.singleBand;
        this.coastalWeightPassing = control.controls.length > 0 ? control.controls.length : 0;
        control.push(
            this.fb.group({
                uom: [splt[1]],
                timeFrom: [''],
                timeTo: [''],
                class: [false]
            })
        );
        this.weightMinlength += 1;
    }

    addCoastalNewWeight() {
        const splt = this.tarrifService.tarrifHeaderDetails.uom.split('~');
        const control = <FormArray>this.coastalForm.controls.doubleBand;
        control.push(
            this.fb.group({
                id: [''],
                uom: [splt[0]],
                weightFrom: [''],
                weightTo: [''],
                rate: [''],
                class: [false]
            })
        );
    }

    saveCoastal() {
        this.currencyLoop = this.coastalPassing;
        const currencyData = this.coastalForm.controls.currency.value;
        const singleBandData = this.coastalForm.controls.singleBand.value;
        const doubleBandData = this.coastalForm.controls.doubleBand.value;
        if (!this.checkUOMTimeRange(singleBandData)) {
            return false;
        }
        // Validation
        if (currencyData[this.currencyLoop].currency === '' || currencyData[this.currencyLoop].currency === null) {
            this.commonService.toastr('error', 'Please select currency');
            return false;
        }
        if (currencyData[this.currencyLoop].date === '' || currencyData[this.currencyLoop].date === null) {
            this.commonService.toastr('error', 'Please select date');
            return false;
        }
        if (singleBandData[this.coastalWeightPassing].timeFrom === '' || singleBandData[this.coastalWeightPassing].timeFrom === null) {
            this.commonService.toastr('error', 'Please enter from time');
            return false;
        }
        if (singleBandData[this.coastalWeightPassing].timeTo === '' || singleBandData[this.coastalWeightPassing].timeTo === null) {
            this.commonService.toastr('error', 'Please enter to time');
            return false;
        }

        if (!(Number(singleBandData[this.coastalWeightPassing].timeFrom) < Number(singleBandData[this.coastalWeightPassing].timeTo))) {
            this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
            return false;
        }

        const arr = [];
        let rangeCheck = 0;
        for (let i = 0; i < doubleBandData.length; i++) {
            if (doubleBandData[i].rate === '' || doubleBandData[i].rate === null) {
                this.commonService.toastr('error', 'Please enter the rate');
                return false;
            }
            if (doubleBandData[i].weightFrom === '' || doubleBandData[i].weightFrom === null) {
                this.commonService.toastr('error', 'Please enter weight from');
                return false;
            }
            if (doubleBandData[i].weightTo === '' || doubleBandData[i].weightTo === null) {
                this.commonService.toastr('error', 'Please enter weight to');
                return false;
            }
            if (doubleBandData.length > 1) {
                if (!(rangeCheck < Number(doubleBandData[i].weightFrom))) {
                    this.commonService.toastr('error', 'Please enter valid value in From Field');
                    return false;
                } else if (!(Number(doubleBandData[i].weightFrom) < Number(doubleBandData[i].weightTo))) {
                    this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
                    return false;
                } else {
                    rangeCheck = Number(doubleBandData[i].weightTo);
                }
            } else {
                if (!(rangeCheck < Number(doubleBandData[i].weightFrom))) {
                    this.commonService.toastr('error', 'Please enter valid value in From Field');
                    return false;
                } else if (!(Number(doubleBandData[i].weightFrom) < Number(doubleBandData[i].weightTo))) {
                    this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
                    return false;
                } else {
                    rangeCheck = Number(doubleBandData[i].weightTo);
                }
            }
            const d = {
                id: doubleBandData[i].id,
                weightFrom: doubleBandData[i].weightFrom,
                weightTo: doubleBandData[i].weightTo,
                rate: doubleBandData[i].rate
            };
            arr.push(d);
        }
        if (arr.length === 0) {
            this.commonService.toastr('error', 'Please enter weight details');
            return false;
        }

        const formData = {
            calculationType: this.tarrifService.tarrifHeaderDetails.calculationType,
            isForeign: currencyData[this.currencyLoop].isForeign,
            tariffHeaderId: this.tarrifService.tarrifHeaderDetails.id,
            foreignCoastalData: [
                {
                    currency: currencyData[this.currencyLoop].currency,
                    minCharge: currencyData[this.currencyLoop].minCharge,
                    rebatePercent: currencyData[this.currencyLoop].applicable === true ?
                        currencyData[this.currencyLoop].rebatePercent : 0,
                    effectiveFrom: this.commonService.dateFormat(currencyData[this.currencyLoop].date.begin) + 'T00:00:00',
                    effectiveTo: this.commonService.dateFormat(currencyData[this.currencyLoop].date.end) + 'T00:00:00',
                    bandData: [
                        {
                            timeFrom: singleBandData[this.coastalWeightPassing].timeFrom,
                            timeTo: singleBandData[this.coastalWeightPassing].timeTo,
                            weightBandData: arr
                        }
                    ]
                }
            ]
        };
      // this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.saveTarrifDetails, formData).subscribe(
            res => {
              this.commonService.toastr('success', 'Data Saved Successfully');
              /*edited and added by shail to stop routing to list page*/
              setTimeout(() => {
                this.commonService.toastr('clear');
              }, 1000);
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(["pda/double-band-info"]));
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

    // =================================================== Form Array ===============================================

    checkUOMTimeRange(arr) {
        let rangeCheck = 0;
        for (let i = 0; i < arr.length; i++) {
            if (!(rangeCheck < Number(arr[i].timeFrom))) {
                this.commonService.toastr('error', 'Please enter valid range in Day/Time UOM.');
                return false;
            } else if (!(Number(arr[i].timeFrom) < Number(arr[i].timeTo))) {
                this.commonService.toastr('error', 'Value in "To" field can not lesser than value in "From" field');
                return false;
            } else {
                rangeCheck = Number(arr[i].timeTo);
            }
        }
        return true;
    }

    getMyFormCurrencyControls() {
        return (<FormArray>this.myForm.get('currency')).controls;
    }

    getMyFormSingleBandControl() {
        return (<FormArray>this.myForm.get('singleBand')).controls;
    }

    getMyFormDoubleBandControl() {
        return (<FormArray>this.myForm.get('doubleBand')).controls;
    }

    validateNumber(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    getCoastalFormCurrencyControls() {
        return (<FormArray>this.coastalForm.get('currency')).controls;
    }

    getCoastalFormSingleBandControl() {
        return (<FormArray>this.coastalForm.get('singleBand')).controls;
    }

    getCoastalFormDoubleBandControl() {
        return (<FormArray>this.coastalForm.get('doubleBand')).controls;
    }

    back_main() {
        this.router.navigate(['pda/tarif-info']);
    }

}
