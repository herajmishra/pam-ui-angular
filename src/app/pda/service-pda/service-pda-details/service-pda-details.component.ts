import {Component, Input, OnInit} from '@angular/core';
import {CreateService} from '../../../service/pda/create.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../service/common.service';
import {TariffCalculationService} from '../../../service/calc/calc.service';
import {HttpService} from '../../../service/http.service';
import {ApiUrlService} from '../../../service/api-url.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {TarrifService} from '../../../service/pda/tarrif.service';

export interface ServiceCode {
    serviceCode: number;
    description: string;
    vendorName: string;
    serviceId: number;
    tariffHeaderId: number;
}

@Component({
    selector: 'app-service-pda-details',
    templateUrl: './service-pda-details.component.html',
    styleUrls: ['./service-pda-details.component.scss']
})
export class ServicePdaDetailsComponent implements OnInit {
    @Input() parentToChild;
    formPDAService: FormGroup;
    pdaServiceItem = new FormArray([]);
    deleteButton = true;
    arrDelete = [];
    objectKeys = Object.keys;

    // Service Code Autocomplete
    arrServiceCodeList: ServiceCode[] = [];
    serviceCodeCtrl = new FormControl();
    filteredServiceCode: Observable<ServiceCode[]>;

    constructor(private createService: CreateService, private commonService: CommonService,
                private calcService: TariffCalculationService, private http: HttpService,
                private api: ApiUrlService, private tarrifService: TarrifService) {
        this.filteredServiceCode = this.serviceCodeCtrl.valueChanges
            .pipe(
                startWith<string | ServiceCode>(''),
                map(value => typeof value === 'string' ? value : value.description),
                map(name => name ? this._filterServiceCode(name) : this.arrServiceCodeList.slice())
            );
    }

    ngOnInit() {
        if (this.parentToChild) {
            this.createService.savePDADTO = this.parentToChild;
            this.getPDADetails(this.parentToChild.id);
        }
        this.createService.createObservable().subscribe(
            res => {
                this.createService.savePDADTO = res;
                this.getPDADetails(res.id);
            }
        );
        this.formPDAService = new FormGroup({
            pdaServiceItem: this.pdaServiceItem
        });
    }

    displayFnServiceCode(user?: ServiceCode): string | undefined {
        return user ? user.description : undefined;
    }

    findServiceCode(val) {
        this.arrServiceCodeList = [];

        this.commonService.toastr('warning', 'Please wait...');
        if (val.length > 2) {
            this.http.getRequest(this.api.getFindByKeySuggestionServiceCode + this.createService.savePDADTO.port + '?key=' + val).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    const data: any = res;
                    const arr = [];
                    for (let i = 0; i < data.length; i++) {
                        arr.push(data[i]);
                    }
                    this.arrServiceCodeList = arr;
                    this.filteredServiceCode = this.serviceCodeCtrl.valueChanges
                        .pipe(
                            startWith<string | ServiceCode>(''),
                            map(value => typeof value === 'string' ? value : value.description),
                            map(name => name ? this._filterServiceCode(name) : this.arrServiceCodeList.slice())
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

    selectValServiceCode(e, i) {
        if (e.serviceId > 0) {
            if (!this.checkServiceHeaderId(e.tariffHeaderId, i)) {
                return false;
            }
            this.commonService.toastr('warning', 'Please wait...');
            const foreign = (this.createService.savePDADTO.vesselTrade === 'FOREIGN') ? '1' : '0';
            const hour = (this.createService.savePDADTO.hour !== null) ? this.createService.savePDADTO.hour : 0;
            const day = (this.createService.savePDADTO.day !== null) ? this.createService.savePDADTO.day : 0;
            const eta = this.commonService.dateFormat(this.createService.savePDADTO.eta) + 'T00:00:00';

            const str = 'portId=' + this.createService.savePDADTO.port +
                '&isForeign=' + foreign +
                '&nrt=' + this.createService.savePDADTO.nrt +
                '&grt=' + this.createService.savePDADTO.grt + '&rgrt=' + this.createService.savePDADTO.rgt +
                '&hour=' + hour +
                '&day=' + day +
                '&eta=' + eta +
                '&tariffHeaderIds=' + e.tariffHeaderId;
            this.http.getRequest(this.api.getFetchTariffDetailsBasedPDA + str).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    const data: any = res;
                    if (data.length === 0) {
                        this.commonService.toastr('error', 'Tariff service not found');
                        this.removeOrderItem(i);
                        return false;
                    }
                    const update = this.updateFormValue();
                    const cnt = update.controls[i] as FormGroup;

                    if (data.length > 0) {
                        if (!data[0].skipCalculations) {
                            cnt.controls['vendorID'].setValue(data[0].vendorName);
                            cnt.controls['calculationType'].setValue(data[0].calculationType, Validators.required);
                            cnt.controls['chargeBasis'].setValue(data[0].chargeBasis, Validators.required);
                            cnt.controls['uom'].setValue(data[0].uom, Validators.required);
                            cnt.controls['weight'].setValue('');
                            cnt.controls['time'].setValue('');
                            cnt.controls['currency'].setValue(data[0].currency, Validators.required);
                            cnt.controls['rate'].setValue(data[0].rate, Validators.required);
                            cnt.controls['gst'].setValue(data[0].gst);
                            cnt.controls['id'].setValue(null);
                            this.serviceCalculationChange(data[0].uom, i, data[0]);
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
    }

    checkServiceHeaderId(tariffHeaderId, index) {
        const formData = this.formPDAService.controls.pdaServiceItem.value;
        const checkHeaderId = [];
        for (let i = 0; i < formData.length; i++) {
            if (formData[i].serviceID.tariffHeaderId === tariffHeaderId) {
                checkHeaderId.push(formData[i]);
            }
        }
        if (checkHeaderId.length > 1) {
            this.removeOrderItem(index);
            this.commonService.toastr('error', 'Do not select same service with same vendor');
            return false;
        }
        return true;
    }

    removeOrderItem(index: number) {
        (<FormArray>this.formPDAService.get('pdaServiceItem')).removeAt(index);
    }

    getPDADetails(pdaID) {
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getPDAIDBasedDetails + pdaID + '?type=SPDA').subscribe(
            res => {
                this.commonService.toastr('clear');
                const data: any = res;
                const arr = [];
                const cnt = this.updateFormValue();
                cnt.controls = [];
                for (let i = 0; i < this.createService.statusCode.length; i++) {
                    const group = [];
                    for (let j = 0; j < data.length; j++) {
                        if (data[j].status === this.createService.statusCode[i].name) {
                            group.push(data[j]);
                        }
                    }
                    if (group.length > 0) {
                        arr.push(group);
                    }
                }
                for (let i = 0; i < arr.length; i++) {
                    for (let j = 0; j < arr[i].length; j++) {
                        if (j === 0) {
                            arr[i][j].groupStatus = true;
                        } else {
                            arr[i][j].groupStatus = false;
                        }
                        if (arr[i][j].status === 'DRAFT' ||
                            arr[i][j].status === 'APRPE' || arr[i][j].status === 'APVD' || arr[i][j].status === 'SUBM') {
                            arr[i][j].editable = true;
                        } else {
                            arr[i][j].editable = false;
                        }
                        arr[i][j]['groupLength'] = arr[i].length;
                        const obj = {
                            serviceId: arr[i][j].serviceId,
                            tariffHeaderId: arr[i][j].tariffId,
                            serviceCode: arr[i][j].serviceCode,
                            vendorName: arr[i][j].vendorName,
                            description: arr[i][j].description,
                        };
                        (<FormArray>this.formPDAService.get('pdaServiceItem')).push(
                            new FormGroup({
                                id: new FormControl(arr[i][j].id),
                                check: new FormControl(null),
                                serviceID: new FormControl(obj, Validators.required),
                                sacCode: new FormControl(null, Validators.required),
                                vendorID: new FormControl(arr[i][j].vendorName),
                                calculationType: new FormControl(arr[i][j].calculationType, Validators.required),
                                chargeBasis: new FormControl(arr[i][j].chargeBasis, Validators.required),
                                uom: new FormControl(arr[i][j].unitOfMeasure, Validators.required),
                                weight: new FormControl(arr[i][j].weight),
                                time: new FormControl(arr[i][j].time),
                                currency: new FormControl(arr[i][j].currency, Validators.required),
                                rate: new FormControl(arr[i][j].rate, Validators.required),
                                amount: new FormControl(arr[i][j].amount, Validators.required),
                                gst: new FormControl(arr[i][j].taxRate),
                                gstAmount: new FormControl(arr[i][j].taxAmount),
                                roe: new FormControl(arr[i][j].roe),
                                total: new FormControl(arr[i][j].totalAmount, Validators.required),
                                status: new FormControl(arr[i][j].status),
                                groupStatus: new FormControl(arr[i][j].groupStatus),
                                groupLength: new FormControl(arr[i][j].groupLength),
                                editable: new FormControl(arr[i][j].editable),
                                serviceGroup: new FormControl(arr[i][j].serviceGroup),
                            })
                        );
                        this.serviceCalculationChange(arr[i][j].unitOfMeasure, j, arr[i][j]);
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

    // End Find by Service Code

    savePDAService(formVal) {
        const formData = [formVal];
        const arr = [];
        for (let i = 0; i < formData.length; i++) {

            if (formData[i].chargeBasis === '' || formData[i].chargeBasis === null || formData[i].chargeBasis === undefined) {
                this.commonService.toastr('error', 'Please select charge basis');
                return false;
            }
            if (formData[i].uom === '' || formData[i].uom === null || formData[i].uom === undefined) {
                this.commonService.toastr('error', 'Please select uom');
                return false;
            }

            formData[i]['rateOfExchange'] = null;
            formData[i]['tax'] = null;
            formData[i]['time'] = formData[i].height;
            if (formData[i].chargeBasis === 'LS') {
                formData[i]['weight'] = null;
                formData[i]['time'] = null;
            } else if (formData[i].chargeBasis === 'TIME') {
                formData[i]['weight'] = null;
            } else if (formData[i].chargeBasis === 'WEIGHT') {
                formData[i]['time'] = null;
            } else if (formData[i].chargeBasis === 'WEIGHT~TIME') {
                if (formData[i]['time'] === undefined || formData[i]['weight'] === undefined) {
                    this.commonService.toastr('error', 'Please enter the weight and time');
                    return false;
                }
            }
            const data = {
                id: formData[i].id,
                sacCode: formData[i].sacCode,
                serviceId: formData[i].serviceID.serviceId,
                pdaId: this.createService.savePDADTO.id,
                serviceCode: formData[i].serviceID.serviceCode,
                vendorId: formData[i].serviceID.vendorId,
                tariffId: formData[i].serviceID.tariffHeaderId,
                unitOfMeasure: formData[i].uom,
                rate: formData[i].rate,
                calculationType: formData[i].calculationType,
                chargeBasis: formData[i].chargeBasis,
                amount: formData[i].amount,
                tax: formData[i].tax > 0 ? formData[i].tax : null,
                taxRate: formData[i].gst > 0 ? formData[i].gst : null,
                taxAmount: formData[i].gstAmount > 0 ? formData[i].gstAmount : null,
                totalAmount: formData[i].total,
                time: formData[i].time,
                weight: formData[i].weight,
                currency: formData[i].currency,
                rateOfExchange: formData[i].roe > 0 ? formData[i].roe : null,
                serviceGroup: null,
                type: 'SPDA',
                status: formData[i].status
            };
            arr.push(data);
        }
        this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.saveServicePDA + arr[0].status, arr).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Successfully inserted service');
                this.getPDADetails(this.createService.savePDADTO.id);
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

    updatedFormValues(obj, index) {
        const data = this.getFormValue();
        const update = this.updateFormValue();
        const cnt = update.controls[index] as FormGroup;
        const weight = Number(data[index].weight) > 0 ? Number(data[index].weight) : 1;
        const time = Number(data[index].time) > 0 ? Number(data[index].time) : 1;
        const qty = weight * time;
        const rate = Number(data[index].rate) > 0 ? Number(data[index].rate) : 0;
        const amt = Number(qty * rate).toFixed(2);
        const gst = Number(data[index].gst) > 0 ? Number(data[index].gst) : 0;
        const gstAmt = this.calcService.gstAmountCalculation(amt, gst);
        cnt.controls['amount'].setValue(amt);
        cnt.controls['gstAmount'].setValue(gstAmt);
        cnt.controls['total'].setValue(this.calcService.getTotalAmount(amt, gstAmt));
    }

    addNew() {
        this.arrServiceCodeList = [];
        (<FormArray>this.formPDAService.get('pdaServiceItem')).push(
            new FormGroup({
                id: new FormControl(null),
                check: new FormControl(null),
                serviceID: new FormControl(null, Validators.required),
                sacCode: new FormControl(null, Validators.required),
                vendorID: new FormControl(null),
                calculationType: new FormControl(null, Validators.required),
                chargeBasis: new FormControl(null, Validators.required),
                uom: new FormControl(null, Validators.required),
                weight: new FormControl(''),
                time: new FormControl(''),
                currency: new FormControl(null, Validators.required),
                rate: new FormControl(null, Validators.required),
                amount: new FormControl(null, Validators.required),
                gst: new FormControl(null),
                gstAmount: new FormControl(null),
                roe: new FormControl(null),
                total: new FormControl(null, Validators.required),
                status: new FormControl('DRAFT'),
                groupStatus: new FormControl(null),
                groupLength: new FormControl(null),
                editable: new FormControl(false),
                serviceGroup: new FormControl(null),
            })
        );
    }

    remove(i) {
        (<FormArray>this.formPDAService.get('pdaServiceItem')).removeAt(i);
    }

    deleteChangeEvent(id, i, event) {
        const checked = event.checked;
        if (checked) {
            this.arrDelete.push({id: i, service_id: id}); // push the Id in array if checked
        } else {
            const index = this.arrDelete.findIndex(list => list.id === i);
            this.arrDelete.splice(index, 1); // Then remove
        }
        this.deleteButton = this.arrDelete.length > 0 ? false : true;
    }

    serviceCalculationChange(val, index, obj) {
        const update = this.updateFormValue();
        const cnt = update.controls[index] as FormGroup;

        const splt = val.split('~');
        let qty: any;
        let arr1: any;
        if (splt.length === 1) {
            if (splt[0] === 'FIXED') {
                cnt.controls['time'].disable();
                cnt.controls['weight'].disable();
                cnt.controls['time'].setValue(1);
                cnt.controls['weight'].setValue(1);
                qty = 1;
            } else if (splt[0] === 'NRT') {
                cnt.controls['weight'].enable();
                cnt.controls['weight'].setValue(this.createService.savePDADTO.nrt);
                cnt.controls['time'].disable();
                cnt.controls['time'].setValue(1);
                qty = this.createService.savePDADTO.nrt;
            } else if (splt[0] === 'GRT') {
                cnt.controls['weight'].enable();
                cnt.controls['weight'].setValue(this.createService.savePDADTO.grt);
                cnt.controls['time'].disable();
                cnt.controls['time'].setValue(1);
                qty = this.createService.savePDADTO.grt;
            } else if (splt[0] === 'RGRT') {
                cnt.controls['weight'].enable();
                cnt.controls['weight'].setValue(this.createService.savePDADTO.rgt);
                cnt.controls['time'].disable();
                cnt.controls['time'].setValue(1);
                qty = this.createService.savePDADTO.rgt;
            } else if (splt[0] === 'HOUR') {
                cnt.controls['weight'].setValue(1);
                cnt.controls['weight'].disable();
                cnt.controls['time'].enable();
                if (this.createService.savePDADTO.day) {
                    cnt.controls['time'].setValue(this.createService.savePDADTO.day);
                    qty = this.createService.savePDADTO.day;
                } else {
                    cnt.controls['time'].setValue(this.createService.savePDADTO.hour);
                    qty = this.createService.savePDADTO.hour;
                }
            } else {
                cnt.controls['time'].enable();
                cnt.controls['weight'].setValue(1);
                cnt.controls['weight'].disable();
                if (this.createService.savePDADTO.hour) {
                    cnt.controls['time'].setValue(Number(this.createService.savePDADTO.day) * 24);
                    qty = Number(this.createService.savePDADTO.day) * 24;
                } else {
                    cnt.controls['time'].setValue(this.createService.savePDADTO.day);
                    qty = this.createService.savePDADTO.day;
                }
            }
        } else {
            cnt.controls['weight'].enable();
            cnt.controls['time'].enable();
            if (splt[0] === 'RGRT') {
                arr1 = this.createService.savePDADTO.rgt;
                cnt.controls['weight'].setValue(arr1);
            }
            if (splt[0] === 'GRT') {
                arr1 = this.createService.savePDADTO.grt;
                cnt.controls['weight'].setValue(arr1);
            } else if (splt[0] === 'NRT') {
                arr1 = this.createService.savePDADTO.nrt;
                cnt.controls['weight'].setValue(arr1);
            }
            if (this.createService.savePDADTO.day > 0 && splt[1] === 'DAY') {
                qty = Number(this.createService.savePDADTO.day);
                cnt.controls['time'].setValue(qty);
            } else if (this.createService.savePDADTO.day > 0 && splt[1] === 'HOUR') {
                qty = Number(this.createService.savePDADTO.day) * 24;
                cnt.controls['time'].setValue(qty);
            } else if (this.createService.savePDADTO.hour > 0 && splt[1] === 'HOUR') {
                qty = Number(this.createService.savePDADTO.hour);
                cnt.controls['time'].setValue(qty);
            } else {
                qty = Number(this.createService.savePDADTO.hour);
                cnt.controls['time'].setValue(qty);
            }
        }
        if (arr1 === undefined) {
            arr1 = 1;
        }
        if (obj.rate === null) {
            obj.rate = 1;
            cnt.controls['rate'].setValue(1);
        }
        const qtyData = Number(arr1) * Number(qty);
        const amount = this.calcService.rateCalculation(qtyData, obj.rate);
        const gstAmount = this.calcService.gstAmountCalculation(amount, (obj.gst) ? obj.gst : 0);
        const totAmount = this.calcService.getTotalAmount(amount, gstAmount);
        const roe = (this.createService.savePDADTO.roe !== null) ? this.createService.savePDADTO.value.roe : 1;
        cnt.controls['roe'].setValue(roe);
        cnt.controls['amount'].setValue(amount);
        cnt.controls['gstAmount'].setValue(gstAmount);
        cnt.controls['total'].setValue(Number(totAmount) * Number(roe));
    }

    sendForApproval(groupID, status) {
        const arr = [];
        const data = this.getFormValue();
        for (let i = 0; i < data.length; i++) {
            if (data[i].serviceGroup === groupID) {
                arr.push(data[i]);
            }
        }
        this.changeStatus(arr, status);
    }

    changeStatus(arr, status) {
        if (!confirm('Are you sure you want to change status?')) {
            return false;
        }
        const passData = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].chargeBasis === '' || arr[i].chargeBasis === null || arr[i].chargeBasis === undefined) {
                this.commonService.toastr('error', 'Please select charge basis');
                return false;
            }
            if (arr[i].uom === '' || arr[i].uom === null || arr[i].uom === undefined) {
                this.commonService.toastr('error', 'Please select uom');
                return false;
            }
            arr[i]['rateOfExchange'] = null;
            arr[i]['tax'] = null;
            arr[i]['time'] = arr[i].height;
            if (arr[i].chargeBasis === 'LS') {
                arr[i]['weight'] = null;
                arr[i]['time'] = null;
            } else if (arr[i].chargeBasis === 'TIME') {
                arr[i]['weight'] = null;
            } else if (arr[i].chargeBasis === 'WEIGHT') {
                arr[i]['time'] = null;
            } else if (arr[i].chargeBasis === 'WEIGHT~TIME') {
                if (arr[i]['time'] === undefined || arr[i]['weight'] === undefined) {
                    this.commonService.toastr('error', 'Please enter the weight and time');
                    return false;
                }
            }
            const data = {
                id: arr[i].id,
                sacCode: arr[i].sacCode,
                serviceId: arr[i].serviceID.serviceId,
                pdaId: this.createService.savePDADTO.id,
                vendorId: arr[i].serviceID.vendorId,
                serviceCode: arr[i].serviceID.serviceCode,
                tariffId: arr[i].serviceID.tariffHeaderId,
                unitOfMeasure: arr[i].uom,
                rate: arr[i].rate,
                calculationType: arr[i].calculationType,
                chargeBasis: arr[i].chargeBasis,
                amount: arr[i].amount,
                tax: arr[i].tax > 0 ? arr[i].tax : null,
                taxRate: arr[i].gst > 0 ? arr[i].gst : null,
                taxAmount: arr[i].gstAmount > 0 ? arr[i].gstAmount : null,
                totalAmount: arr[i].total,
                time: arr[i].time,
                weight: arr[i].weight,
                currency: arr[i].currency,
                rateOfExchange: arr[i].roe > 0 ? arr[i].roe : null,
                serviceGroup: null,
                type: 'SPDA',
                status: arr[i].status
            };
            passData.push(data);
        }
        this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.saveServicePDA + status, passData).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Successfully updated status');
                this.getPDADetails(this.createService.savePDADTO.id);
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

    deleteAll() {
        let joinArray: any = [];
        if (!confirm('Are you sure you want to delete!!!')) {
            return false;
        }
        this.commonService.toastr('warning', 'Please wait...');
        joinArray = this.arrDelete.map(function (elem) {
            return elem.service_id;
        }).join(',');
        this.http.deleteRequest(this.api.deleteAllPDAService + joinArray).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('sucess', 'Successfully Deleted');
                this.arrDelete = [];
                this.getPDADetails(this.createService.savePDADTO.id);
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

    getControls() {
        return (<FormArray>this.formPDAService.get('pdaServiceItem')).controls;
    }

    // FormArray ==============================

    getFormValue() {
        return <FormArray>this.formPDAService.controls.pdaServiceItem.value;
    }

    updateFormValue() {
        return <FormArray>this.formPDAService.controls.pdaServiceItem;
    }

    // Find By Service Code
    private _filterServiceCode(value: string): ServiceCode[] {
        const filterValue = value.toLowerCase();

        return this.arrServiceCodeList.filter(c => c.description.toLowerCase().indexOf(filterValue) === 0);
    }
}
