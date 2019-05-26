import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {ApiUrlService} from '../../../service/api-url.service';
import {HttpService} from '../../../service/http.service';
import {CreateService} from '../../../service/pda/create.service';
import {TarrifService} from '../../../service/pda/tarrif.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-tarrif-info',
    templateUrl: './tarrif-info.component.html',
    styleUrls: ['./tarrif-info.component.scss']
})
export class TarrifInfoComponent implements OnInit {
    myForm: FormGroup;
    chargebasis = '';
    uom = '';

    arrPageLoadList = [];
    arrVendorList = [];
    arrBindDataofVendorList = [];
    arrServiceVendorsMappingList = [];
    arrTarrifList = [];

    data: any;
    vendorListId = 0;
    constructor(private router: Router,
                private commonService: CommonService,
                private api: ApiUrlService,
                private http: HttpService,
                private pdaService: CreateService,
                private createService: CreateService,
                public tarrifService: TarrifService,
                private fb: FormBuilder) {
        this.myForm = this.fb.group({
            tariif: this.fb.array([])
        });
    }

    ngOnInit() {
        this.tarrifService.checkTarrif();
        this.getPageLoadData();
    }

    getTarrifData() {
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getTarrifMaster + this.tarrifService.portId).subscribe(
            res => {
                this.data = res;
                this.commonService.toastr('clear');
                this.arrTarrifList = this.data;
                // console.log(this.data);
                for (let i = 0; i < this.data.length; i++) {
                    this.getVendorData(this.data[i].serviceId, i);
                    this.getChargeBasis(this.data[i].calculationType);
                    this.getUOMBasis(this.data[i].chargeBasis);
                    const control = <FormArray>this.myForm.controls.tariif;
                    control.push(
                        this.fb.group({
                            id: [this.data[i].id],
                            serviceId: [this.data[i].serviceId],
                            vendorId: [this.data[i].vendorId],
                            skipCalculations: [this.data[i].skipCalculations],
                            calculationType: [this.data[i].calculationType],
                            chargeBasis: [this.data[i].chargeBasis],
                            uom: [this.data[i].uom],
                            status: [this.data[i].status],
                            remarks: [this.data[i].remarks]
                        })
                    );
                    // console.log(control);
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

    getChargeBasis(e) {
        this.chargebasis = e;
    }

    getUOMBasis(e) {
        this.uom = e;
    }

    getTarrifDetails(i) {
        this.tarrifService.tarrifHeaderDetails = this.arrTarrifList[i];
        if (this.tarrifService.tarrifHeaderDetails.calculationType === 'LS' || this.tarrifService.tarrifHeaderDetails.calculationType === 'FLAT') {
            localStorage.setItem('tarrifHeaderDetails', JSON.stringify(this.tarrifService.tarrifHeaderDetails));
            this.tarrifService.headerId = this.tarrifService.tarrifHeaderDetails.id;
            localStorage.setItem('actionId', btoa(this.tarrifService.tarrifHeaderDetails.id));
            this.router.navigate(['pda/ls-flat-info']);
        } else if (this.tarrifService.tarrifHeaderDetails.calculationType === 'SINGLE_BAND') {
            localStorage.setItem('tarrifHeaderDetails', JSON.stringify(this.tarrifService.tarrifHeaderDetails));
            this.tarrifService.headerId = this.tarrifService.tarrifHeaderDetails.id;
            localStorage.setItem('actionId', btoa(this.tarrifService.tarrifHeaderDetails.id));
            this.router.navigate(['pda/single-band-info']);
        } else if (this.tarrifService.tarrifHeaderDetails.calculationType === 'DOUBLE_BAND') {
            localStorage.setItem('tarrifHeaderDetails', JSON.stringify(this.tarrifService.tarrifHeaderDetails));
            this.tarrifService.headerId = this.tarrifService.tarrifHeaderDetails.id;
            localStorage.setItem('actionId', btoa(this.tarrifService.tarrifHeaderDetails.id));
            this.router.navigate(['pda/double-band-info']);
        }
    }

    addNewCompany() {
        const control = <FormArray>this.myForm.controls.tariif;
      control.insert(0,
            this.fb.group({
                id: [''],
                serviceId: [''],
                vendorId: [''],
                skipCalculations: [''],
                calculationType: [''],
                chargeBasis: [''],
                uom: [''],
                status: [''],
                remarks: ['']
            })
        );
    }

    removeEmptyRow(i) {
        const control = <FormArray>this.myForm.controls.tariif;
        control.removeAt(i);
    }

    getPageLoadData() {
        this.arrPageLoadList = [];
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getPageLoadDataMaster + this.tarrifService.portId).subscribe(
            res => {
                this.data = res;
                this.arrPageLoadList = this.data;
                this.arrVendorList = this.data.vendorList;
                this.arrServiceVendorsMappingList = this.data.serviceVendorsMappingList;
                this.getTarrifData();
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

    getVendorData(e, index) {
        const arr = [];
        this.vendorListId = index;
        for (let i = 0; i < this.arrServiceVendorsMappingList.length; i++) {
            if (this.arrServiceVendorsMappingList[i].serviceId === e) {
                for (let j = 0; j < this.arrVendorList.length; j++) {
                    if ((this.arrServiceVendorsMappingList[i].vendorId === this.arrVendorList[j].id) &&
                        this.arrVendorList[j].portId === this.tarrifService.portId) {
                        arr.push(this.arrVendorList[j]);
                    }
                }
                this.arrBindDataofVendorList[index] = arr;
            }
        }
    }

    save() {
        const formData = this.myForm.controls.tariif.value;
        this.commonService.toastr('clear');
        for (let i = 0; i < formData.length; i++) {
            if (!(formData[i].serviceId > 0) || formData[i].serviceId === '') {
                this.commonService.toastr('error', 'Please select service code');
                return false;
            }
            if (!(formData[i].vendorId > 0) || formData[i].vendorId === '') {
                this.commonService.toastr('error', 'Please select vendor name');
                return false;
            }
            if (formData[i].calculationType === '') {
                this.commonService.toastr('error', 'Please select calculate type');
                return false;
            }
            if (formData[i].chargeBasis === '') {
                this.commonService.toastr('error', 'Please select charge basis');
                return false;
            }
            if (formData[i].uom === '') {
                this.commonService.toastr('error', 'Please select uom');
                return false;
            }
            if (formData[i].status === '') {
                this.commonService.toastr('error', 'Please select status');
                return false;
            }
        }
        this.http.postRequest(this.api.saveTarrifMasterProfile, formData).subscribe(
            res => {
              this.commonService.toastr('success', 'Data Saved Successfully');
              /*edited and added by shail to stop routing to list page*/
              setTimeout(() => {
                this.commonService.toastr('clear');
              }, 1000);
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
                this.router.navigate(["pda/tarif-info"]));

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

    gettariffFormDetails() {
        return (<FormArray>this.myForm.get('tariif')).controls;
    }

    back_main() {
        this.router.navigate(['master/port/master']);
    }
}
