import {Component, OnInit} from '@angular/core';
import {ApiUrlService} from '../../service/api-url.service';
import {CommonService} from '../../service/common.service';
import {CreateService} from '../../service/pda/create.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {CustomValidator} from '../../shared/custom-validation';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {HttpService} from '../../service/http.service';
import {TariffCalculationService} from '../../service/calc/calc.service';
import {TarrifService} from '../../service/pda/tarrif.service';
import {GrtNrtPdaServiceModalComponent} from './grt-nrt-pda-service-modal/grt-nrt-pda-service-modal.component';
import {RemarkModalComponent} from './remark-modal/remark-modal.component';

export interface Country {
    id: number;
    name: string;
}
export interface Port {
    id: number;
    isoPortCode: string;
    description: string;
}
export interface Branch {
    id: number;
    name: string;
}
export interface Customer {
    id: number;
    name: string;
}
export interface NextPort {
    id: number;
    isoPortCode: string;
}
export interface LastPort {
    id: number;
    isoPortCode: string;
}
export interface DischargePort {
    id: number;
    isoPortCode: string;
}
export interface LoadPort {
    id: number;
    isoPortCode: string;
}
export interface Vessel {
    id: number;
    name: string;
}

export interface ServiceCode {
    serviceCode: number;
    description: string;
    vendorName: string;
    serviceId: number;
    tariffHeaderId: number;
}

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
    objectKeys = Object.keys;
    myForm: FormGroup;
    form;
    actionID = 0;
    vesselSelect = false;
    vesselSelectEdit = false;
    imoMandatory = false;
  isBothCurrency = false;

    addTerrif = false;
    data: any;
    arrBerthList = [];
    arrDataLookup = [];
    deleteButton = true;
    arrDelete = [];
    editPort = false;
    addMoreService = false;
    currentDate = new Date();

    // Country Autocomplete
    arrCountryList: Country[] = [];
    vesselFlagCtrl = new FormControl();
    filteredStates: Observable<Country[]>;
    flagId = 0;

    // Port Autocomplete
    arrPortList: Port[] = [];
    portCtrl = new FormControl();
    filteredPort: Observable<Port[]>;
    portId = 0;

    // Branch Autocomplete
    arrBranchList: Branch[] = [];
    branchCtrl = new FormControl();
    filteredBranch: Observable<Branch[]>;
    branchId = 0;

    // Customer Autocomplete
    arrCustomerList: Customer[] = [];
    customerCtrl = new FormControl();
    filteredCustomer: Observable<Customer[]>;
    customerId = 0;

    // Next Port Autocomplete
    arrNextPortList: NextPort[] = [];
    nextPortCtrl = new FormControl();
    filteredNextport: Observable<NextPort[]>;
    nextPortId = 0;

    // Last Port Autocomplete
    arrLastPortList: LastPort[] = [];
    lastPortCtrl = new FormControl();
    filteredLastPort: Observable<LastPort[]>;
    lastPortId = 0;

    // Discharge Port Autocomplete
    arrDischargePortList: DischargePort[] = [];
    dischargePortCtrl = new FormControl();
    filteredDischargePort: Observable<DischargePort[]>;
    dischargePortId = 0;

    // Load Port Autocomplete
    arrLoadPortList: LoadPort[] = [];
    loadPortCtrl = new FormControl();
    filteredLoadPort: Observable<LoadPort[]>;
    loadPortId = 0;

    // Vessel Autocomplete
    arrVesselList: Vessel[] = [];
    vesselCtrl = new FormControl();
    filteredVessel: Observable<Vessel[]>;
    VesselId = 0;
    vesselName = '';

    // Service Code Autocomplete
    tarrifForm: FormGroup;
    tarrifItems = new FormArray([]);
    arrServiceCodeList: ServiceCode[] = [];
    serviceCodeCtrl = new FormControl();
    filteredServiceCode: Observable<ServiceCode[]>;

    constructor(private api: ApiUrlService,
                public commonService: CommonService,
                public createService: CreateService,
                private modal: MatDialog,
                private router: Router, private http: HttpService,
                private fb: FormBuilder,
                private tarrifService: TarrifService,
                private calcService: TariffCalculationService,
                private dialog: MatDialog) {
        this.filteredStates = this.vesselFlagCtrl.valueChanges
            .pipe(
                startWith<string | Country>(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this._filterStates(name) : this.arrCountryList.slice())
            );
        this.filteredPort = this.portCtrl.valueChanges
            .pipe(
                startWith<string | Port>(''),
                map(value => typeof value === 'string' ? value : value.description),
                map(name => name ? this._filterPort(name) : this.arrPortList.slice())
            );
        this.filteredBranch = this.branchCtrl.valueChanges
            .pipe(
                startWith<string | Branch>(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this._filterBranch(name) : this.arrBranchList.slice())
            );
        this.filteredCustomer = this.customerCtrl.valueChanges
            .pipe(
                startWith<string | Customer>(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this._filterCustomer(name) : this.arrCustomerList.slice())
            );
        this.filteredNextport = this.nextPortCtrl.valueChanges
            .pipe(
                startWith<string | NextPort>(''),
                map(value => typeof value === 'string' ? value : value.isoPortCode),
                map(name => name ? this._filterNextPort(name) : this.arrNextPortList.slice())
            );
        this.filteredLastPort = this.lastPortCtrl.valueChanges
            .pipe(
                startWith<string | LastPort>(''),
                map(value => typeof value === 'string' ? value : value.isoPortCode),
                map(name => name ? this._filterLastPort(name) : this.arrLastPortList.slice())
            );
        this.filteredDischargePort = this.dischargePortCtrl.valueChanges
            .pipe(
                startWith<string | DischargePort>(''),
                map(value => typeof value === 'string' ? value : value.isoPortCode),
                map(name => name ? this._filterDischargePort(name) : this.arrDischargePortList.slice())
            );
        this.filteredLoadPort = this.loadPortCtrl.valueChanges
            .pipe(
                startWith<string | LoadPort>(''),
                map(value => typeof value === 'string' ? value : value.isoPortCode),
                map(name => name ? this._filterLoadPort(name) : this.arrLoadPortList.slice())
            );
        this.filteredVessel = this.vesselCtrl.valueChanges
            .pipe(
                startWith<string | Vessel>(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this._filterVessel(name) : this.arrVesselList.slice())
            );
        this.filteredServiceCode = this.serviceCodeCtrl.valueChanges
            .pipe(
                startWith<string | ServiceCode>(''),
                map(value => typeof value === 'string' ? value : value.description),
                map(name => name ? this._filterServiceCode(name) : this.arrServiceCodeList.slice())
            );

        this.getCountryList();
    }

    // =======================================  Auto complete ============================================================
    // Country
    private _filterStates(value: string): Country[] {
        const filterValue = value.toLowerCase();

        return this.arrCountryList.filter(c => c.name.toLowerCase().indexOf(filterValue) === 0);
    }

    selectVal(e) {
        this.flagId = e.id;
    }

    displayFn(user?: Country): string | undefined {
        return user ? user.name : undefined;
    }

    // Port
    private _filterPort(value: string): Port[] {
        const filterValue = value.toLowerCase();

        return this.arrPortList.filter(c => c.isoPortCode.toLowerCase().indexOf(filterValue) === 0);
    }

    selectValPort(e) {
        this.getBerthList(e.id);
        this.portId = e.id;
        if (this.portId > 0) {
            this.createService.portId = this.portId;
        }
    }

    getBerthList(id, berth = null) {
        this.arrBerthList = [];
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getBirthList + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                this.arrBerthList = this.data;
                if (berth) {
                    this.form.controls['berth'].setValue(Number(berth));
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

    displayFnPort(user?: Port): string | undefined {
        return user ? user.description : undefined;
    }

    findPort(val) {
        this.portId = 0;
        this.arrPortList = [];

        this.commonService.toastr('warning', 'Please wait...');
        if (val.length > 2) {
            this.http.getRequest(this.api.getFindByKeyPort + val).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.data = res;
                    const arr = [];
                    for (let i = 0; i < this.data.length; i++) {
                        arr.push(this.data[i]);
                    }
                    this.arrPortList = arr;
                    this.filteredPort = this.portCtrl.valueChanges
                        .pipe(
                            startWith<string | Port>(''),
                            map(value => typeof value === 'string' ? value : value.description),
                            map(name => name ? this._filterPort(name) : this.arrPortList.slice())
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

    // Branch
    private _filterBranch(value: string): Branch[] {
        const filterValue = value.toLowerCase();

        return this.arrBranchList.filter(c => c.name.toLowerCase().indexOf(filterValue) === 0);
    }

    selectValBranch(e) {
        this.branchId = e.id;
    }

    displayFnBranch(user?: Branch): string | undefined {
        return user ? user.name : undefined;
    }

    findBranch(val) {
        this.branchId = 0;
        this.arrBranchList = [];
        this.commonService.toastr('warning', 'Please wait...');
        if (val.length > 2) {
            this.http.getRequest(this.api.getFindByKeyBranch + val).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.data = res;
                    const arr = [];
                    for (let i = 0; i < this.data.length; i++) {
                        arr.push(this.data[i]);
                    }
                    this.arrBranchList = arr;
                    this.filteredBranch = this.branchCtrl.valueChanges
                        .pipe(
                            startWith<string | Branch>(''),
                            map(value => typeof value === 'string' ? value : value.name),
                            map(name => name ? this._filterBranch(name) : this.arrBranchList.slice())
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

    // Customer
    private _filterCustomer(value: string): Customer[] {
        const filterValue = value.toLowerCase();

        return this.arrCustomerList.filter(c => c.name.toLowerCase().indexOf(filterValue) === 0);
    }

    selectValCustomer(e) {
        this.customerId = e.id;
    }

    displayFnCustomer(user?: Customer): string | undefined {
        return user ? user.name : undefined;
    }

    findCustomer(val) {
        this.customerId = 0;
        this.arrCustomerList = [];
        this.commonService.toastr('warning', 'Please wait...');
        if (val.length > 2) {
            this.http.getRequest(this.api.getFindByKeyCustomer + val).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.data = res;
                    const arr = [];
                    for (let i = 0; i < this.data.length; i++) {
                        arr.push(this.data[i]);
                    }
                    this.arrCustomerList = arr;
                    this.filteredCustomer = this.customerCtrl.valueChanges
                        .pipe(
                            startWith<string | Customer>(''),
                            map(value => typeof value === 'string' ? value : value.name),
                            map(name => name ? this._filterCustomer(name) : this.arrCustomerList.slice())
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

    // Next Port
    private _filterNextPort(value: string): NextPort[] {
        const filterValue = value.toLowerCase();

        return this.arrNextPortList.filter(c => c.isoPortCode.toLowerCase().indexOf(filterValue) === 0);
    }

    selectValNextPort(e) {
        this.nextPortId = e.id;
    }

    displayFnNextPort(user?: NextPort): string | undefined {
        return user ? user.isoPortCode : undefined;
    }

    findNextPort(val) {
        this.nextPortId = 0;
        this.arrNextPortList = [];

        this.commonService.toastr('warning', 'Please wait...');
        if (val.length > 2) {
            this.http.getRequest(this.api.getFindByKeyPort + val).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.data = res;
                    const arr = [];
                    for (let i = 0; i < this.data.length; i++) {
                        arr.push(this.data[i]);
                    }
                    this.arrNextPortList = arr;
                    this.filteredNextport = this.nextPortCtrl.valueChanges
                        .pipe(
                            startWith<string | NextPort>(''),
                            map(value => typeof value === 'string' ? value : value.isoPortCode),
                            map(name => name ? this._filterNextPort(name) : this.arrNextPortList.slice())
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

    // Last Port
    private _filterLastPort(value: string): LastPort[] {
        const filterValue = value.toLowerCase();

        return this.arrLastPortList.filter(c => c.isoPortCode.toLowerCase().indexOf(filterValue) === 0);
    }

    selectValLastPort(e) {
        this.lastPortId = e.id;
    }

    displayFnLastPort(user?: LastPort): string | undefined {
        return user ? user.isoPortCode : undefined;
    }

    findLastPort(val) {
        this.lastPortId = 0;
        this.arrLastPortList = [];

        this.commonService.toastr('warning', 'Please wait...');
        if (val.length > 2) {
            this.http.getRequest(this.api.getFindByKeyPort + val).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.data = res;
                    const arr = [];
                    for (let i = 0; i < this.data.length; i++) {
                        arr.push(this.data[i]);
                    }
                    this.arrLastPortList = arr;
                    this.filteredLastPort = this.lastPortCtrl.valueChanges
                        .pipe(
                            startWith<string | LastPort>(''),
                            map(value => typeof value === 'string' ? value : value.isoPortCode),
                            map(name => name ? this._filterLastPort(name) : this.arrLastPortList.slice())
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

    // Discharge Port
    private _filterDischargePort(value: string): DischargePort[] {
        const filterValue = value.toLowerCase();

        return this.arrDischargePortList.filter(c => c.isoPortCode.toLowerCase().indexOf(filterValue) === 0);
    }

    selectValDischargeport(e) {
        this.dischargePortId = e.id;
    }

    displayFnDischargePort(user?: DischargePort): string | undefined {
        return user ? user.isoPortCode : undefined;
    }

    findDischargePort(val) {
        this.dischargePortId = 0;
        this.arrDischargePortList = [];

        this.commonService.toastr('warning', 'Please wait...');
        if (val.length > 2) {
            this.http.getRequest(this.api.getFindByKeyPort + val).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.data = res;
                    const arr = [];
                    for (let i = 0; i < this.data.length; i++) {
                        arr.push(this.data[i]);
                    }
                    this.arrDischargePortList = arr;
                    this.filteredDischargePort = this.dischargePortCtrl.valueChanges
                        .pipe(
                            startWith<string | DischargePort>(''),
                            map(value => typeof value === 'string' ? value : value.isoPortCode),
                            map(name => name ? this._filterDischargePort(name) : this.arrDischargePortList.slice())
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

    // Load Port
    private _filterLoadPort(value: string): LoadPort[] {
        const filterValue = value.toLowerCase();

        return this.arrLoadPortList.filter(c => c.isoPortCode.toLowerCase().indexOf(filterValue) === 0);
    }

    selectValLoadPort(e) {
        this.loadPortId = e.id;
    }

    displayFnLoadPort(user?: LoadPort): string | undefined {
        return user ? user.isoPortCode : undefined;
    }

    findLoadPort(val) {
        this.loadPortId = 0;
        this.arrLoadPortList = [];

        this.commonService.toastr('warning', 'Please wait...');
        if (val.length > 2) {
            this.http.getRequest(this.api.getFindByKeyPort + val).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.data = res;
                    const arr = [];
                    for (let i = 0; i < this.data.length; i++) {
                        arr.push(this.data[i]);
                    }
                    this.arrLoadPortList = arr;
                    this.filteredLoadPort = this.loadPortCtrl.valueChanges
                        .pipe(
                            startWith<string | LoadPort>(''),
                            map(value => typeof value === 'string' ? value : value.isoPortCode),
                            map(name => name ? this._filterLoadPort(name) : this.arrLoadPortList.slice())
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

    selectValVessel(e) {
        if (e.id > 0) {
            this.form.controls['grt'].setValue(e.grt);
            this.form.controls['nrt'].setValue(e.nrt);
            this.form.controls['rgt'].setValue(e.reducedGrt);
            this.form.controls['vesselType'].setValue(e.type);
            this.form.controls['vesselTrade'].setValue(e.trade);
            this.arrCountryList.map(x => {
                if (x.id === Number(e.flag)) {
                    this.vesselFlagCtrl.setValue({name: x.name});
                    this.flagId = x.id;
                }
            });
            this.vesselSelect = true;
        } else {
            this.vesselSelect = false;
        }
        this.VesselId = e.id;
    }

    displayFnVessel(user?: Vessel): string | undefined {
        return user ? user.name : undefined;
    }

    findVessel(val) {
        this.VesselId = 0;
        this.arrVesselList = [];
        this.vesselName = val;

        this.commonService.toastr('warning', 'Please wait...');
        if (val.length > 2) {
            this.http.getRequest(this.api.getFindByKeyVessel + val).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.data = res;
                    const arr = [];
                    for (let i = 0; i < this.data.length; i++) {
                        arr.push(this.data[i]);
                    }
                    this.arrVesselList = arr;
                    if (this.arrVesselList.length === 0) {
                        this.form.controls['grt'].setValue('');
                        this.form.controls['nrt'].setValue('');
                        this.form.controls['rgt'].setValue('');
                        this.form.controls['vesselTrade'].setValue('');
                        this.vesselFlagCtrl.setValue({name: ''});
                        this.vesselSelect = false;
                        this.imoMandatory = true;
                    } else {
                        this.imoMandatory = false;
                    }
                    this.filteredVessel = this.vesselCtrl.valueChanges
                        .pipe(
                            startWith<string | Vessel>(''),
                            map(value => typeof value === 'string' ? value : value.name),
                            map(name => name ? this._filterVessel(name) : this.arrVesselList.slice())
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

    displayFnServiceCode(user?: ServiceCode): string | undefined {
        const display = (user.vendorName) ? ' (' + user.vendorName + ')' : '';
        return user ? user.description + display : undefined;
    }

    findServiceCode(val) {
        this.arrServiceCodeList = [];

        this.commonService.toastr('warning', 'Please wait...');
        if (val.length > 2) {
            this.http.getRequest(this.api.getFindByKeySuggestionServiceCode + this.createService.portId + '?key=' + val).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.data = res;
                    const arr = [];
                    for (let i = 0; i < this.data.length; i++) {
                        arr.push(this.data[i]);
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

    getPDADetails() {
        this.http.getRequest(this.api.getPDAFindByID + this.createService.pdaID).subscribe(
            res => {
                this.commonService.toastr('clear');
                const data: any = res;
                this.getBerthList(data.port, data.berth);
                delete data['berth'];
                data.enquiry = new Date(data.enquiry);
                data.eta = new Date(data.eta);
                if (data.pdaDate !== '' || data.pdaDate !== null) {
                    data.pdaDate = new Date(data.pdaDate);
                }
                this.form.patchValue(data);
                if (data.day > 0) {
                    this.form.controls['duration'].setValue('DAY');
                    this.form.controls['hour'].setValue(data.day);
                } else {
                    this.form.controls['duration'].setValue('HOUR');
                    this.form.controls['hour'].setValue(data.hour);
                }
                this.form.controls['bank'].setValue(data.bank.toString());
                this.branchId = data.branch;
                this.customerId = data.customer;
                this.portId = data.port;
                this.VesselId = data.vessel;
                this.flagId = data.vesselFlag;
                this.branchCtrl.setValue({name: data.branchName});
                this.customerCtrl.setValue({name: data.customerName});
                this.portCtrl.setValue({description: data.portName});
                this.nextPortCtrl.setValue({description: data.nextPortName});
                this.lastPortCtrl.setValue({description: data.lastPortName});
                this.dischargePortCtrl.setValue({description: data.lastPortName});
                this.loadPortCtrl.setValue({description: data.lastPortName});
                for (let i = 0; i < this.arrCountryList.length; i++) {
                    if (Number(this.arrCountryList[i].id) === Number(data.vesselFlag)) {
                        this.vesselFlagCtrl.setValue({name: this.arrCountryList[i].name});
                    }
                }
                this.vesselCtrl.setValue({name: data.vesselName});
                this.dischargePortId = (data.dischargePort) ? data.dischargePort : 0;
                this.nextPortId = (data.nextPort) ? data.nextPort : 0;
                this.lastPortId = (data.lastPort) ? data.lastPort : 0;
                this.loadPortId = (data.loadPort) ? data.loadPort : 0;
                this.createService.portId = this.portId;
                this.createService.savePDADTO = data;
                if (this.createService.mode === 'edit') {
                    this.createService.fetchTariff = true;
                    this.createService.submit = true;
                    this.vesselSelect = true;
                    this.vesselSelectEdit = false;
                    this.createService.save = false;
                    this.getFetchTariffDetails();
                    this.createService.viewDisable = false;
                    this.editPort = true;
                    this.pdaStatus(data.pdaStatus);
                } else {
                    this.createService.fetchTariff = false;
                    this.createService.submit = false;
                    this.createService.save = true;
                    this.getFetchTariffDetails();
                    this.vesselSelect = true;
                    this.createService.viewDisable = true;
                    this.editPort = true;
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

    ngOnInit() {
        if (this.createService.action === 0) {
            this.createService.getPayloadDetails(localStorage.getItem('token'));
        }
        this.form = new FormGroup({
            balance: new FormControl('0'),
            type: new FormControl(null, Validators.required),
            enquiry: new FormControl(null),
            enquiryTime: new FormControl(null),
            orgCurrency: new FormControl(null),
            pdaNo: new FormControl(null),
            pdaDate: new FormControl(new Date()),
            voyage: new FormControl(null),
            lengthLbp: new FormControl(null, Validators.compose([
                CustomValidator.beamLOALBPPDAValidators
            ])),
            loadCargo: new FormControl(null),
            quantity: new FormControl(null),
            dischargeCargo: new FormControl(null),
            dischargeQty: new FormControl(null),
            lengthLoa: new FormControl(null, CustomValidator.beamLOALBPPDAValidators),
            berth: new FormControl(null),
            eta: new FormControl(null),
            activityPurpose: new FormControl(null),
            operation: new FormControl(null),
            duration: new FormControl(null),
            hour: new FormControl(null),
            beam: new FormControl(null, CustomValidator.beamLOALBPPDAValidators),
            bank: new FormControl(null),
            pdaStatus: new FormControl(null),
            etaTime: new FormControl(null),
            roe: new FormControl(null, CustomValidator.roePDAValidators),
            jobNo: new FormControl(null),
            vesselTrade: new FormControl(null),
            grt: new FormControl(null),
            nrt: new FormControl(null),
            rgt: new FormControl(null),
            imo: new FormControl('NA'),
            cargo: new FormControl(null),
          vesselType: new FormControl(null),
          bothCurrency: new FormControl(null)
        });
        this.tarrifForm = new FormGroup({
            'tarrifItems': this.tarrifItems
        });
        this.createService.viewDisable = false;
        if (localStorage.getItem('pdaID') !== null) {
            this.createService.pdaID = Number(atob(localStorage.getItem('pdaID')));
            this.createService.mode = atob(localStorage.getItem('mode'));
        } else {
            this.createService.pdaID = 0;
        }
        this.getVesselType();
    }

  checkBothCurrency(val) {
    this.isBothCurrency = !val;
  }
    // =================================================== End Auto complete ============================================
    getVesselType() {
        this.arrDataLookup = [];
        this.http.getRequest(this.api.getVesselLookupList).subscribe(
            res => {
                const data: any = res;
                this.arrDataLookup = data.VESSEL_TYPE;
            },
            err => {
                this.commonService.toastr('error', 'Network Problem');
            }
        );
    }

    getCountryList() {
        this.commonService.toastr('warning', 'Please wait...');
        this.arrCountryList = [];
        this.http.getRequest(this.api.getCountryList).subscribe(
            res => {
                if (this.createService.pdaID > 0) {
                    this.getPDADetails();
                } else {
                    this.commonService.toastr('clear');
                    this.createService.submit = false;
                    this.createService.fetchTariff = false;
                    this.createService.save = false;
                    this.pdaStatus('');
                }
                this.data = res;
                this.arrCountryList = this.data;
                this.filteredStates = this.vesselFlagCtrl.valueChanges
                    .pipe(
                        startWith<string | Country>(''),
                        map(value => typeof value === 'string' ? value : value.name),
                        map(name => name ? this._filterStates(name) : this.arrCountryList.slice())
                    );
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 401 || err.status === 403) {
                    this.commonService.sessionExpired();
                } else if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again');
                }
            }
        );
    }

    getFetchTariffDetails() {
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getPDABasedFetchServiceDetails + this.createService.pdaID + '?type=PDA').subscribe(
            res => {
                this.addTerrif = true;
                const data: any = res;
                const singleBand = <FormArray>this.tarrifForm.controls.tarrifItems;
                singleBand.controls = [];
                for (let i = 0; i < data.length; i++) {
                    const service = {
                        description: data[i].description,
                        serviceCode: data[i].serviceCode,
                        tariffHeaderId: data[i].tariffId,
                        serviceId: data[i].serviceId
                    };
                    data[i]['uom'] = data[i].unitOfMeasure;
                    (<FormArray>this.tarrifForm.get('tarrifItems')).push(
                        new FormGroup({
                            check: new FormControl(''),
                            itemName: new FormControl(service),
                            calculationType: new FormControl(data[i].calculationType),
                            chargeBasis: new FormControl(data[i].chargeBasis),
                            uom: new FormControl(data[i].uom),
                            weight: new FormControl(data[i].weight),
                            height: new FormControl(data[i].height),
                            display: new FormControl(''),
                            currency: new FormControl(data[i].currency),
                            rate: new FormControl(data[i].rate),
                            amount: new FormControl(''),
                            gst: new FormControl((data[i].gst) ? data[i].gst : 0),
                            gstAmount: new FormControl(''),
                            roe: new FormControl(null, Validators.required),
                            total: new FormControl(''),
                            id: new FormControl(data[i].id),
                        })
                    );
                    this.serviceCalculationChange(data[i].uom, i, data[i]);
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

    save(formData) {
        if (!(this.branchId > 0)) {
            this.commonService.toastr('error', 'Please enter branch name');
            return false;
        }
        if (!(this.customerId > 0)) {
            this.commonService.toastr('error', 'Please enter customer name');
            return false;
        }
        if (!(this.portId > 0)) {
            this.commonService.toastr('error', 'Please enter port name');
            return false;
        }
        if (!(this.flagId > 0)) {
            this.commonService.toastr('error', 'Please enter vessel flag name');
            return false;
        }
        if (this.dischargePortId > 0) {
            formData.dischargePort = this.dischargePortId;
        }
        if (this.lastPortId > 0) {
            formData.lastPort = this.lastPortId;
        }
        if (this.loadPortId > 0) {
            formData.loadPort = this.loadPortId;
        }
        if (this.nextPortId > 0) {
            formData['nextPort'] = this.nextPortId;
        }
        formData.branch = this.branchId;
        formData.customer = this.customerId;
        formData.port = this.portId;
        formData.vesselFlag = this.flagId;
        if (this.VesselId > 0) {
            formData.vessel = this.VesselId;
            this.savePDA(formData);
        } else {
            const data = {
                name: this.vesselName,
                flag: this.flagId,
                trade: formData.vesselTrade,
                grt: formData.grt,
                nrt: formData.nrt,
                reducedGrt: formData.rgt,
                imo: (formData.imo) ? formData.imo : 'NA',
                status: 'ACTIVE',
                type: formData.vesselType
            };
            this.commonService.toastr('warning', 'Please wait...');
            this.http.postRequest(this.api.saveVessel, data).subscribe(
                res => {
                    this.data = res;
                    formData.vessel = this.data.id;
                    this.savePDA(formData);
                },
                err => {
                    this.commonService.toastr('clear');
                    if (err.status === 409) {
                        this.commonService.toastr('error', err.error.message);
                    } else if (err.status === 401 || err.status === 403) {
                        this.commonService.sessionExpired();
                    } else {
                        this.commonService.toastr('error', 'Please try again');
                    }
                }
            );
        }
    }

    savePDA(formData) {
        if (formData.eta !== '') {
            formData.eta = this.commonService.dateFormat(formData.eta) + ' 00:00:00';
        }
        if (formData.pdaDate !== null) {
            formData.pdaDate = this.commonService.dateFormat(formData.pdaDate) + ' 00:00:00';
        }
        if (formData.enquiry !== '') {
            formData.enquiry = this.commonService.dateFormat(formData.enquiry) + ' 00:00:00';
        }
        this.createService.savePDADTO = formData;
        if (formData.duration === 'HOUR') {
            formData['day'] = null;
        } else {
            formData['day'] = formData.hour;
            formData.hour = null;
        }
        if (this.createService.pdaID > 0) {
            formData['id'] = this.createService.pdaID;
        }
        delete formData['duration'];
        this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.createPDA, formData).subscribe(
            res => {
                this.commonService.toastr('clear');
                const data: any = res;
                this.createService.pdaID = data.id;
                this.form.controls['pdaNo'].setValue(data.pdaNo);
                localStorage.setItem('pdaID', btoa(data.id));
                localStorage.setItem('mode', btoa('edit'));
                if (data.pdaStatus === 'REJ') {
                    this.createService.pdaStatusView = true;
                } else if (data.pdaStatus === 'ACC') {
                    this.createService.pdaStatusView = false;
                }
                if (this.createService.acceptRejectPdaStatus === false) {
                    this.createService.fetchTariff = true;
                    this.createService.submit = true;
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

    // Vessel
    private _filterVessel(value: string): Vessel[] {
        const filterValue = value.toLowerCase();

        return this.arrVesselList.filter(c => c.name.toLowerCase().indexOf(filterValue) === 0);
    }

    checkServiceHeaderId(tariffHeaderId, index) {
        const formData = this.tarrifForm.controls.tarrifItems.value;
        const checkHeaderId = [];
        for (let i = 0; i < formData.length; i++) {
            if (formData[i].itemName.tariffHeaderId === tariffHeaderId) {
                checkHeaderId.push(formData[i]);
            }
        }
        if (checkHeaderId.length > 1) {
            this.removeOrderItem(index);
            this.commonService.toastr('error', 'Do not select same service with same verdor');
            return false;
        }
        return true;
    }

    selectValServiceCode(e, i) {
        if (e.serviceId > 0) {
            if (!this.checkServiceHeaderId(e.tariffHeaderId, i)) {
                return false;
            }
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
                    const data: any = res;
                    if (data.length === 0) {
                        this.commonService.toastr('error', 'Tariff service not found');
                        this.removeOrderItem(i);
                        return false;
                    }
                    const rateAmount = this.gettariffFormDetails();
                    const cnt = rateAmount.controls[i] as FormGroup;
                    if (data.length > 0) {
                        if (!data[0].skipCalculations) {
                            const amount = this.calcService.rateCalculation(1, data[0].rate);
                            const gstAmount = this.calcService.gstAmountCalculation(amount, (data[0].gst) ? data[0].gst : 0);
                            const totAmount = this.calcService.getTotalAmount(amount, gstAmount);
                            cnt.controls['calculationType'].setValue(data[0].calculationType);
                            cnt.controls['chargeBasis'].setValue(data[0].chargeBasis);
                            cnt.controls['uom'].setValue(data[0].uom);
                            cnt.controls['display'].setValue('');
                            cnt.controls['currency'].setValue(data[0].currency);
                            cnt.controls['rate'].setValue(data[0].rate);
                            cnt.controls['amount'].setValue(amount);
                            cnt.controls['gst'].setValue(data[0].gst);
                            cnt.controls['gstAmount'].setValue(gstAmount);
                            cnt.controls['roe'].setValue(data[0].roe);
                            cnt.controls['total'].setValue(totAmount);
                            cnt.controls['id'].setValue(null);
                            cnt.controls['minCharge'].setValue(data[0].minCharge > 0 ? data[0].minCharge : 0);
                            if (data[0].calculationType) {
                                this.serviceCalculationChange(data[0].uom, i, data[0]);
                            }
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

    setUpdateFetchTariff(data, index) {
        const checkMatch = [];
        const formData = this.tarrifForm.controls.tarrifItems.value;
        for (let i = 0; i < formData.length; i++) {
            if (Number(formData[i].itemName.tariffHeaderId) === data.tariffHeaderId) {
                checkMatch.push(i);
                return true;
            }
        }
        if (checkMatch.length === 0) {
            return false;
        }
    }

    fetchTarif() {
        this.addTerrif = true;
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
            '&eta=' + eta;
        this.http.getRequest(this.api.getFetchTariffDetailsBasedPDA + str).subscribe(
            res => {
                const data: any = res;
                const formData = this.tarrifForm.controls.tarrifItems.value;
                const confirmArray = [];
                if (formData.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const checkReturn = this.setUpdateFetchTariff(data[i], i);
                        if (!checkReturn) {
                            const service = {
                                serviceCode: data[i].serviceCode,
                                tariffHeaderId: data[i].tariffHeaderId,
                                serviceId: data[i].serviceId,
                                description: data[i].serviceDescription
                            };
                            (<FormArray>this.tarrifForm.get('tarrifItems')).push(
                                new FormGroup({
                                    check: new FormControl(''),
                                    itemName: new FormControl(service),
                                    calculationType: new FormControl(data[i].calculationType),
                                    chargeBasis: new FormControl(data[i].chargeBasis),
                                    uom: new FormControl(data[i].uom),
                                    weight: new FormControl(data[i].weight),
                                    height: new FormControl(data[i].height),
                                    display: new FormControl(''),
                                    currency: new FormControl(data[i].currency),
                                    rate: new FormControl(data[i].rate),
                                    amount: new FormControl(''),
                                    gst: new FormControl((data[i].gst) ? data[i].gst : 0),
                                    gstAmount: new FormControl(''),
                                    roe: new FormControl(null, Validators.required),
                                    total: new FormControl(''),
                                    id: new FormControl(null),
                                })
                            );
                            this.serviceCalculationChange(data[i].uom, i, data[i]);
                        } else {
                            confirmArray.push(data[i]);
                        }
                    }
                    if (confirmArray.length > 0) {
                        this.confirmDialogforFetchTariff(confirmArray, data);
                    }
                } else {
                    for (let i = 0; i < data.length; i++) {
                        const service = {
                            serviceCode: data[i].serviceCode,
                            tariffHeaderId: data[i].tariffHeaderId,
                            serviceId: data[i].serviceId,
                            description: data[i].serviceDescription
                        };

                        (<FormArray>this.tarrifForm.get('tarrifItems')).push(
                            new FormGroup({
                                check: new FormControl(''),
                                itemName: new FormControl(service),
                                calculationType: new FormControl(data[i].calculationType),
                                chargeBasis: new FormControl(data[i].chargeBasis),
                                uom: new FormControl(data[i].uom),
                                weight: new FormControl(data[i].weight),
                                height: new FormControl(data[i].height),
                                display: new FormControl(''),
                                currency: new FormControl(data[i].currency),
                                rate: new FormControl(data[i].rate),
                                amount: new FormControl(''),
                                gst: new FormControl((data[i].gst) ? data[i].gst : 0),
                                gstAmount: new FormControl(''),
                                roe: new FormControl(null, Validators.required),
                                total: new FormControl(''),
                                id: new FormControl(null),
                            })
                        );
                        this.serviceCalculationChange(data[i].uom, i, data[i]);
                    }
                }
                this.createService.submit = true;
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

    confirmDialogforFetchTariff(confirmArray, fetchData) {
        const arr = [];
        for (let i = 0; i < fetchData.length; i++) {
            for (let j = 0; j < confirmArray.length; j++) {
                if (fetchData[i].tariffHeaderId === confirmArray[j].tariffHeaderId) {
                    confirmArray[j]['itemName'] = {
                        serviceName: confirmArray[j].serviceDescription
                    };
                    arr.push(confirmArray[j]);
                }
            }
        }
        if (arr.length > 0) {
            const dialogRef = this.dialog.open(GrtNrtPdaServiceModalComponent, {
                width: '600px',
                data: {name: '', arrayValue: arr}
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    for (let i = 0; i < arr.length; i++) {
                        this.updatePDAServiceBasedOnGrtNrtRgt(arr[i], i);
                    }
                }
            });
        }
    }

    programmingLanguages(): FormArray {
        return <FormArray>this.tarrifForm.controls.tarrifItems;
    }

    back_main() {
        this.router.navigate(['pda']);
    }

    // ================================================ Fetch Tarrif ==========================================================

    serviceCalculationChange(val, i, obj) {
        const rateAmount = this.gettariffFormDetails();
        const cnt = rateAmount.controls[i] as FormGroup;
        const splt = val.split('~');
        let qty: any;
        let arr1: any;
        if (splt.length === 1) {
            if (splt[0] === 'FIXED') {
                cnt.controls['height'].disable();
                cnt.controls['weight'].disable();
                cnt.controls['height'].setValue(1);
                cnt.controls['weight'].setValue(1);
                qty = 1;
            } else if (splt[0] === 'NRT') {
                cnt.controls['weight'].enable();
                cnt.controls['weight'].setValue(this.createService.savePDADTO.nrt);
                cnt.controls['height'].disable();
                cnt.controls['height'].setValue(1);
                qty = this.createService.savePDADTO.nrt;
            } else if (splt[0] === 'GRT') {
                cnt.controls['weight'].enable();
                cnt.controls['weight'].setValue(this.createService.savePDADTO.grt);
                cnt.controls['height'].disable();
                cnt.controls['height'].setValue(1);
                qty = this.createService.savePDADTO.grt;
            } else if (splt[0] === 'RGRT') {
                cnt.controls['weight'].enable();
                cnt.controls['weight'].setValue(this.createService.savePDADTO.rgt);
                cnt.controls['height'].disable();
                cnt.controls['height'].setValue(1);
                qty = this.createService.savePDADTO.rgt;
            } else if (splt[0] === 'HOUR') {
                cnt.controls['weight'].setValue(1);
                cnt.controls['weight'].disable();
                cnt.controls['height'].enable();
                if (this.createService.savePDADTO.day) {
                    cnt.controls['height'].setValue(this.createService.savePDADTO.day);
                    qty = this.createService.savePDADTO.day;
                } else {
                    cnt.controls['height'].setValue(this.createService.savePDADTO.hour);
                    qty = this.createService.savePDADTO.hour;
                }
            } else {
                cnt.controls['height'].enable();
                cnt.controls['weight'].setValue(1);
                cnt.controls['weight'].disable();
                if (this.createService.savePDADTO.hour) {
                    cnt.controls['height'].setValue(Number(this.createService.savePDADTO.day) * 24);
                    qty = Number(this.createService.savePDADTO.day) * 24;
                } else {
                    cnt.controls['height'].setValue(this.createService.savePDADTO.day);
                    qty = this.createService.savePDADTO.day;
                }
            }
        } else {
            cnt.controls['weight'].enable();
            cnt.controls['height'].enable();
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
                cnt.controls['height'].setValue(qty);
            } else if (this.createService.savePDADTO.day > 0 && splt[1] === 'HOUR') {
                qty = Number(this.createService.savePDADTO.day) * 24;
                cnt.controls['height'].setValue(qty);
            } else if (this.createService.savePDADTO.hour > 0 && splt[1] === 'HOUR') {
                qty = Number(this.createService.savePDADTO.hour);
                cnt.controls['height'].setValue(qty);
            } else {
                qty = Number(this.createService.savePDADTO.hour);
                cnt.controls['height'].setValue(qty);
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
        this.form.value.roe = (this.form.value.roe > 0) ? this.form.value.roe : 1;
        cnt.controls['roe'].setValue(this.form.value.roe);
        cnt.controls['amount'].setValue(amount);
        cnt.controls['gstAmount'].setValue(gstAmount);
        let total = Number(totAmount) * Number(this.form.value.roe);
        if (total < obj.minCharge) {
            total = obj.minCharge;
        }
        cnt.controls['total'].setValue(total);
    }

    onAddItem() {
        this.arrServiceCodeList = [];
        (<FormArray>this.tarrifForm.get('tarrifItems')).push(
            new FormGroup({
                check: new FormControl(''),
                id: new FormControl(null),
                itemName: new FormControl(''),
                calculationType: new FormControl(''),
                chargeBasis: new FormControl(null, Validators.required),
                uom: new FormControl(null, Validators.required),
                weight: new FormControl(''),
                height: new FormControl(''),
                display: new FormControl(''),
                currency: new FormControl(null, Validators.required),
                rate: new FormControl(null, Validators.required),
                amount: new FormControl(null, Validators.required),
                gst: new FormControl(null, Validators.required),
                gstAmount: new FormControl(null, Validators.required),
                roe: new FormControl(null),
                total: new FormControl(null, Validators.required),
                minCharge: new FormControl(0)
            })
        );
    }

    getControls() {
        return (<FormArray>this.tarrifForm.get('tarrifItems')).controls;
    }

    qtyEnter(val, obj, i) {
        const amount = this.calcService.rateCalculation((val) ? val : 0, obj.rate);
        const gstAmount = this.calcService.gstAmountCalculation(amount, (obj.gst) ? obj.gst : 0);
        const totAmount = this.calcService.getTotalAmount(amount, gstAmount);
        const rateAmount = this.gettariffFormDetails();
        const cnt = rateAmount.controls[i] as FormGroup;
        cnt.controls['amount'].setValue(amount);
        cnt.controls['gstAmount'].setValue(gstAmount);
        cnt.controls['total'].setValue(totAmount);
    }

    rateEnter(val, obj, i) {
        const rateAmount = this.gettariffFormDetails();
        const cnt = rateAmount.controls[i] as FormGroup;
        let qty = 1;
        if (Number(obj.height) > 1 && Number(obj.weight) > 1) {
            qty = Number(obj.weight) + Number(obj.height);
        } else {
            if (obj.height !== undefined) {
                if (Number(obj.height) > 0) {
                    qty = Number(obj.height);
                } else {
                    qty = Number(obj.weight);
                }
            } else if (obj.weight !== undefined) {
                if (Number(obj.weight) > 0) {
                    qty = Number(obj.weight);
                } else {
                    qty = Number(obj.height);
                }
            }
        }
        const amount = this.calcService.rateCalculation(qty, val);
        const gstAmount = this.calcService.gstAmountCalculation(amount, (obj.gst) ? obj.gst : 0);
        const totAmount = this.calcService.getTotalAmount(amount, gstAmount);

        cnt.controls['amount'].setValue(amount);
        cnt.controls['gstAmount'].setValue(gstAmount);
        let total = Number(totAmount) * Number(obj.roe);
        if (total < obj.minCharge) {
            total = obj.minCharge;
        }
        cnt.controls['total'].setValue(total);
    }

    gstEnter(val, obj, i) {
        const gstAmount = this.calcService.gstAmountCalculation(obj.amount, (val) ? val : 0);
        const totAmount = this.calcService.getTotalAmount(obj.amount, gstAmount);
        const rateAmount = this.gettariffFormDetails();
        const cnt = rateAmount.controls[i] as FormGroup;
        cnt.controls['gstAmount'].setValue(gstAmount);
        let total = Number(totAmount) * Number(obj.roe);
        if (total < obj.minCharge) {
            total = obj.minCharge;
        }
        cnt.controls['total'].setValue(total);
    }

    roeEnter(val, obj, i) {
        const gstAmount = this.calcService.gstAmountCalculation(obj.amount, obj.gst);
        const totAmount = this.calcService.getTotalAmount(obj.amount, gstAmount);
        const rateAmount = this.gettariffFormDetails();
        const cnt = rateAmount.controls[i] as FormGroup;
        const roe = (val > 0) ? val : 1;
        cnt.controls['gstAmount'].setValue(gstAmount);
        let total = Number(totAmount) * Number(obj.roe);
        if (total < obj.minCharge) {
            total = obj.minCharge;
        }
        cnt.controls['total'].setValue(total);
    }

    gettariffFormDetails(): FormArray {
        return <FormArray>this.tarrifForm.controls.tarrifItems;
    }

    removeOrderItem(index: number) {
        (<FormArray>this.tarrifForm.get('tarrifItems')).removeAt(index);
    }

    submit() {
        const formData = this.tarrifForm.controls.tarrifItems.value;
        const arr = [];
        for (let i = 0; i < formData.length; i++) {
            if (formData[i].itemName === '' || formData[i].itemName === null || formData[i].itemName === undefined) {
                this.commonService.toastr('error', 'Please select service');
                return false;
            }
            if (formData[i].calculationType === '' || formData[i].calculationType === null || formData[i].calculationType === undefined) {
                this.commonService.toastr('error', 'Please select calculation type');
                return false;
            }
            if (formData[i].chargeBasis === '' || formData[i].chargeBasis === null || formData[i].chargeBasis === undefined) {
                this.commonService.toastr('error', 'Please select charge basis');
                return false;
            }
            if (formData[i].uom === '' || formData[i].uom === null || formData[i].uom === undefined) {
                this.commonService.toastr('error', 'Please select uom');
                return false;
            }
            if (formData[i].currency === '' || formData[i].currency === null || formData[i].currency === undefined) {
                this.commonService.toastr('error', 'Please select currency');
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
                type: 'PDA',
                status: null,
                id: formData[i].id,
                serviceId: formData[i].itemName.serviceId,
                pdaId: this.createService.pdaID,
                serviceCode: formData[i].itemName.serviceCode,
                tariffId: formData[i].itemName.tariffHeaderId,
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
                rateOfExchange: formData[i].roe > 0 ? formData[i].roe : null
            };
            arr.push(data);
        }
        if (arr.length === 0) {
            this.commonService.toastr('error', 'Please add atleast 1 PDA Service');
            return false;
        }
        this.commonService.toastr('warning', 'Please wait...');

        this.http.postRequest(this.api.savePDAService, arr).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Successfully inserted service');
                this.getFetchTariffDetails();
                this.createService.pdaStatusBasedEnableDisable = false;
                this.createService.sendForApproval = true;
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

    generatePDF() {
        const str = this.api.generatePDF;
        let link = '';
        if (str.split(':')[2] === '8081/pam/pda/generate/') {
            link = str.replace('8081', '8082');
        } else {
            link = str.replace('9091', '9092');
        }
        this.commonService.toastr('warning', 'Please wait...');
        this.createService.generatePDFfunction(link + this.createService.pdaID + '?type=PDA');
        // window.open(link + this.createService.pdaID);
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

    deleteMultiplePdaService(id) {
        const formData = <FormArray>this.tarrifForm.controls.tarrifItems.value;
        for (let i = 0; i < formData.length; i++) {
            if (formData[i].id === id) {
                (<FormArray>this.tarrifForm.get('tarrifItems')).removeAt(i);
            }
        }
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
                for (let i = 0; i < this.arrDelete.length; i++) {
                    this.deleteMultiplePdaService(this.arrDelete[i].service_id);
                }
                this.arrDelete = [];
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

    // Service Code

    setUpdatePDAService(val, field) {
        const formData = this.tarrifForm.controls.tarrifItems.value;
        const arr = [];
        for (let i = 0; i < formData.length; i++) {
            if (formData[i].calculationType === 'SINGLE_BAND') {
                if (field === formData[i].uom) {
                    arr.push(formData[i]);
                }
                if (field === 'DAY') {
                    if (formData[i].chargeBasis === 'TIME') {
                        arr.push(formData[i]);
                    }
                }
            } else if (formData[i].calculationType === 'DOUBLE_BAND') {
                if (field === formData[i].uom.split('~')[0]) {
                    arr.push(formData[i]);
                }
                if (field === 'DAY') {
                    if (formData[i].chargeBasis === 'WEIGHT~TIME') {
                        arr.push(formData[i]);
                    }
                }
            }
            if (field === 'ETA') {
                arr.push(formData[i]);
            }
        }
        if (arr.length > 0) {
            if (field === 'ETA') {
                this.checkETArangeOutornot(arr, field, val.value);
            } else {
                this.getUpdatedPDAService(arr, field, val);
            }
        }
    }

    // Service Code
    private _filterServiceCode(value: string): ServiceCode[] {
        const filterValue = value.toLowerCase();

        return this.arrServiceCodeList.filter(c => c.description.toLowerCase().indexOf(filterValue) === 0);
    }

    getUpdatedPDAService(arr, field, val) {
        const joinHeaderId = [];
        for (let i = 0; i < arr.length; i++) {
            joinHeaderId.push(arr[i].itemName.tariffHeaderId);
        }
        const foreign = (this.createService.savePDADTO.vesselTrade === 'FOREIGN') ? '1' : '0';
        const hour = (this.createService.savePDADTO.hour !== null) ? this.createService.savePDADTO.hour : 0;
        const day = (this.createService.savePDADTO.day !== null) ? this.createService.savePDADTO.day : 0;
        const eta = this.commonService.dateFormat(this.createService.savePDADTO.eta) + 'T00:00:00';
        const critereaCheck = (field === 'NRT' || field === 'RGT' || field === 'GRT') ? 'WEIGHT' :
            (field === 'DAY') ? 'TIME' : 'ETA';
        const oldWeight = (field === 'NRT') ? this.createService.savePDADTO.nrt :
            (field === 'RGRT') ? this.createService.savePDADTO.rgt :
                (field === 'GRT') ? this.createService.savePDADTO.grt : '';
        const newWeight = (field === 'NRT') ? val :
            (field === 'RGRT') ? val :
                (field === 'GRT') ? val : '';
        const oldDuration = (Number(this.createService.savePDADTO.day) > 0) ? this.createService.savePDADTO.day :
            Number(this.createService.savePDADTO.hour);
        const newDuration = this.form.value.hour;

        const str = 'portId=' + this.createService.savePDADTO.port +
            '&isForeign=' + foreign +
            '&nrt=' + this.createService.savePDADTO.nrt +
            '&grt=' + this.createService.savePDADTO.grt + '&rgrt=' + this.createService.savePDADTO.rgt +
            '&hour=' + hour +
            '&day=' + day +
            '&eta=' + eta +
            '&criteriaToCheck=' + critereaCheck +
            '&newWeight=' + oldWeight +
            '&newWeight=' + newWeight +
            '&oldEta=' + '' +
            '&oldDuration=' + oldDuration +
            '&newDuration=' + newDuration +
            '&tariffHeaderIds=' + joinHeaderId.join(',');
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFetchTariffDetailsBasedPDA + str).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    if (!this.data[i].skipCalculations) {
                        this.getTariffIndexServiceId(this.data[i]);
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

    getTariffIndexServiceId(data) {
        const formData = this.tarrifForm.controls.tarrifItems.value;
        for (let i = 0; i < formData.length; i++) {
            if (data.tariffHeaderId === formData[i].itemName.tariffHeaderId) {
                this.createService.savePDADTO.nrt = this.form.value.nrt;
                this.createService.savePDADTO.grt = this.form.value.grt;
                this.createService.savePDADTO.rgt = this.form.value.rgt;
                this.updatePDAServiceBasedOnGrtNrtRgt(data, i);
            }
        }
    }

    updatePDAServiceBasedOnGrtNrtRgt(data, i) {
        const update = this.gettariffFormDetails();
        const cnt = update.controls[i] as FormGroup;
        cnt.controls['calculationType'].setValue(data.calculationType);
        cnt.controls['chargeBasis'].setValue(data.chargeBasis);
        cnt.controls['uom'].setValue(data.uom);
        cnt.controls['weight'].setValue(data.weight);
        cnt.controls['height'].setValue(data.height);
        cnt.controls['display'].setValue('');
        cnt.controls['currency'].setValue(data.currency);
        cnt.controls['rate'].setValue(data.rate);
        cnt.controls['amount'].setValue('');
        cnt.controls['gst'].setValue(data.gst ? data.gst : 0);
        cnt.controls['gstAmount'].setValue('');
        cnt.controls['roe'].setValue(null);
        cnt.controls['total'].setValue('');
        this.serviceCalculationChange(data.uom, i, data);
    }

    checkETArangeOutornot(array, field, val) {
        const joinHeaderId = [];
        for (let i = 0; i < array.length; i++) {
            joinHeaderId.push(array[i].itemName.tariffHeaderId);
        }
        const foreign = (this.createService.savePDADTO.vesselTrade === 'FOREIGN') ? '1' : '0';
        const hour = (this.createService.savePDADTO.hour !== null) ? this.createService.savePDADTO.hour : 0;
        const day = (this.createService.savePDADTO.day !== null) ? this.createService.savePDADTO.day : 0;
        const oldEta = this.commonService.dateFormat(this.createService.savePDADTO.eta) + 'T00:00:00';
        const newEta = this.commonService.dateFormat(val) + 'T00:00:00';

        const str = 'portId=' + this.createService.savePDADTO.port +
            '&isForeign=' + foreign +
            '&nrt=' + this.createService.savePDADTO.nrt +
            '&grt=' + this.createService.savePDADTO.grt + '&rgrt=' + this.createService.savePDADTO.rgt +
            '&hour=' + hour +
            '&day=' + day +
            '&eta=' + newEta +
            '&criteriaToCheck=' + 'ETA' +
            '&oldEta=' + oldEta +
            '&tariffHeaderIds=' + joinHeaderId.join(',');
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFetchTariffDetailsBasedPDA + str).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                const arr = [];
                const displayModal = [];
                for (let i = 0; i < this.data.length; i++) {
                    if (!this.data[i].skipCalculations) {
                        for (let j = 0; j < array.length; j++) {
                            if (this.data[i].tariffHeaderId === array[j].itemName.tariffHeaderId) {
                                arr.push(this.data[i]);
                                displayModal.push(array[i]);
                            }
                        }
                    }
                }
                if (arr.length > 0) {
                    const dialogRef = this.dialog.open(GrtNrtPdaServiceModalComponent, {
                        width: '1200px',
                        data: {name: 'ETA', arrayValue: displayModal}
                    });

                    dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                            for (let i = 0; i < arr.length; i++) {
                                this.updatePDAServiceBasedOnGrtNrtRgt(arr[i], i);
                            }
                        } else if (result === undefined || result === false) {
                            const oldETA = new Date(this.createService.savePDADTO.eta);
                            this.form.controls['eta'].setValue(oldETA);
                        }
                    });
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

    setUpdatePDAServiceOnKeyup(val, field) {
        this.createService.fetchTariff = false;
        this.createService.submit = false;
        const formData = this.tarrifForm.controls.tarrifItems.value;
        for (let i = 0; i < formData.length; i++) {
            if (field === 'DAY') {
                if (formData[i].calculationType === 'SINGLE_BAND') {
                    if (formData[i].uom.split('~')[0] === 'DAY') {
                        this.createService.savePDADTO.day = val;
                    }
                    if (formData[i].uom.split('~')[0] === 'HOUR') {
                        this.createService.savePDADTO.hour = val;
                    }
                }
                if (formData[i].calculationType === 'DOUBLE_BAND') {
                    if (formData[i].uom.split('~')[1] === 'DAY') {
                        this.createService.savePDADTO.day = val;
                    }
                    if (formData[i].uom.split('~')[1] === 'HOUR') {
                        this.createService.savePDADTO.hour = val;
                    }
                }
                this.updatePDAServiceBasedOnGrtNrtRgt(formData[i], i);
            }
            if (formData[i].uom.split('~')[0] === field) {
                this.createService.savePDADTO.nrt = this.form.value.nrt;
                this.createService.savePDADTO.grt = this.form.value.grt;
                this.createService.savePDADTO.rgt = this.form.value.rgt;
                this.updatePDAServiceBasedOnGrtNrtRgt(formData[i], i);
            }
        }
    }

    sendMailFun() {
        this.commonService.toastr('warning', 'Please wait...');
      this.http.getRequest(this.api.sendMail + this.createService.pdaID + '?type=PDA' + '&bothCurrency=' + this.isBothCurrency).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Mailed successfully sent');
                this.http.getRequest(this.api.pdaStatus + this.createService.pdaID + '/SUBM?' + 'remark=null').subscribe(
                    r => {
                        this.pdaStatus('SUBM');
                        this.createService.generatePDF = true;

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

    pdaStatus(val) {
        this.createService.sendForApproval = false;
        this.createService.ammend = false;
        this.createService.approved = false;
        this.createService.sendToCustomer = false;
        this.createService.pdaStatusView = true;

      if (val === 'DFT' || val === 'NEEDA' /*|| val === ''*/) {       /*code changed by shail as per bug-no-269*/
            this.createService.sendForApproval = true;
            this.createService.currentPdaStatus = val;
            this.createService.viewDisable = false;
            this.editPort = false;
            this.vesselSelect = false;
        this.createService.pdaStatusBasedEnableDisable = false;
        } else if (val === 'APRPE') {
            this.createService.ammend = true;
            this.createService.approved = true;
            this.createService.currentPdaStatus = val;
            this.createService.viewDisable = true;
            this.editPort = true;
            this.vesselSelect = true;
            this.createService.pdaStatusBasedEnableDisable = false;
            this.addMoreService = false;
        } else if (val === 'APVD') {
            this.createService.sendToCustomer = true;
            this.createService.currentPdaStatus = val;
            this.createService.viewDisable = true;
            this.editPort = true;
            this.vesselSelect = true;
            this.createService.pdaStatusBasedEnableDisable = false;
            this.createService.generatePDF = true;
            this.deleteButton = true;
            this.addMoreService = true;
        } else if (val === 'SUBM') {
            this.createService.sendToCustomer = true;
            this.createService.currentPdaStatus = val;
            this.createService.viewDisable = true;
            this.editPort = true;
            this.vesselSelect = true;
            this.createService.pdaStatusBasedEnableDisable = false;
            this.createService.generatePDF = true;
            this.createService.pdaStatusView = false;
            this.deleteButton = true;
            this.addMoreService = true;
        } else if (val === 'REJ') {
            this.createService.pdaStatusView = true;
            this.createService.fetchTariff = false;
            this.createService.submit = false;
            this.createService.viewDisable = true;
            this.editPort = true;
            this.vesselSelect = true;
            this.deleteButton = true;
            this.addMoreService = true;
        } else if (val === 'ACC') {
            this.createService.pdaStatusView = false;
            this.createService.fetchTariff = false;
            this.createService.submit = false;
            this.createService.viewDisable = true;
            this.editPort = true;
            this.vesselSelect = true;
            this.deleteButton = true;
            this.addMoreService = true;
        }
        this.form.controls['pdaStatus'].setValue(val ? val.toString() : 'DFT');
    }

    senForApproval() {
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.pdaStatus + this.createService.pdaID + '/APRPE?' + 'remark=null').subscribe(
            res => {
                this.commonService.toastr('clear');
                this.pdaStatus('APRPE');
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

    pdaStatusApprove() {
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.pdaStatus + this.createService.pdaID + '/APVD?' + 'remark=null').subscribe(
            res => {
                this.commonService.toastr('clear');
                this.pdaStatus('APVD');
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

    sendToCustomer() {
        if (this.createService.currentPdaStatus === 'APVD') {
            this.sendMailFun();
        } else {
            this.commonService.toastr('success', 'Mailed already sent');
        }
    }

    pdaStatusAmmend() {
        const dialogRef = this.dialog.open(RemarkModalComponent, {
            width: '250px',
            data: {name: ''}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.commonService.toastr('warning', 'Please wait...');
                const str = this.createService.pdaID + '/NEEDA?' + 'remark=' + result;
                this.http.getRequest(this.api.pdaStatus + str).subscribe(
                    res => {
                        this.commonService.toastr('clear');
                        this.pdaStatus('NEEDA');
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
        });
    }

    pdaStatusChange(val) {
        console.log(val);
        this.commonService.toastr('clear');
        this.createService.pdaStatusBasedEnableDisable = false;
        this.createService.fetchTariff = false;
        this.createService.submit = false;
        this.createService.acceptRejectPdaStatus = false;

        if (val === 'ACC' || val === 'REJ') {
            this.createService.pdaStatusBasedEnableDisable = true;
            this.createService.fetchTariff = false;
            this.createService.submit = false;
            this.createService.acceptRejectPdaStatus = true;
        } else {
            this.commonService.toastr('error', 'Not allowed');
        }
    }
}
