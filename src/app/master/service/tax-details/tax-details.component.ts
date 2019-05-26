import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {HttpService} from 'src/app/service/http.service';
import {ApiUrlService} from 'src/app/service/api-url.service';
import {CommonService} from 'src/app/service/common.service';
import {ServicesService} from 'src/app/service/master/services.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface Port {
    id: number;
    isoPortCode: string;
}
@Component({
    selector: 'app-tax-details',
    templateUrl: './tax-details.component.html',
    styleUrls: ['./tax-details.component.scss']
})
export class TaxDetailsComponent implements OnInit {

    form: FormGroup;
    addForm = true;
    btnSubmit = '';
    vid = 0;
    data: any;
    minDate: Date;
    arrTaxDetails = [];

    displayedColumns: string[] = ['code', 'description', 'portId', 'rate', 'validFrom', 'validTo', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    // Autocompleted
    groupControl = new FormControl();
    arrPortList: Port[] = [];
    filteredOptions: Observable<Port[]>;
    key: number;

    constructor(private fb: FormBuilder, public commonService: CommonService, private http: HttpService, private api: ApiUrlService, private services: ServicesService, private router: Router) {
    }

    ngOnInit() {
        if (this.services.action === 0) {
            this.router.navigate(['/master/service']);
        }
        this.getPortDetails();

        this.form = this.fb.group({
            code: ['', [Validators.required]],
            description: ['', [Validators.required]],
            rate: ['', [Validators.required]],
            validFrom: ['', [Validators.required]],
            validTo: ['', [Validators.required]]
        });

    }

    dateInput(e) {
        this.minDate = new Date(new Date(e).getFullYear(), new Date(e).getMonth(), new Date(e).getDate());
    }

    displayFn(user?: Port): string | undefined {
        return user ? user.isoPortCode : undefined;
    }

    selectVal(e) {
        this.key = e.id;
    }

    _filter(name: string): Port[] {
        const filterValue = name.toLowerCase();
        return this.arrPortList.filter(option => option.isoPortCode.toLowerCase().indexOf(filterValue) === 0);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getPortDetails() {
        this.arrPortList = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getPortList).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.arrPortList.push(this.data[i]);
                }
                this.filteredOptions = this.groupControl.valueChanges
                    .pipe(
                        startWith<string | Port>(''),
                        map(value => typeof value === 'string' ? value : value.isoPortCode),
                        map(name => name ? this._filter(name) : this.arrPortList.slice())
                    );
                this.getTaxDetails();
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 401 || err.status === 403 || err.status === 404) {
                    this.commonService.toastr('error', 'Please wait...', '');
                } else {
                    this.commonService.sessionExpired();
                }
            }
        );

    }

    getTaxDetails() {
        this.arrTaxDetails = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getTaxdetListid + this.services.servTaxID).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    for ( let j = 0; j < this.arrPortList.length; j++) {
                        console.log(this.arrPortList[j])
                        if (Number(this.data[i].isoPortCode) === this.arrPortList[j].id) {

                            this.data[i].portId = this.arrPortList[j].isoPortCode;
                        }
                    }
                    this.arrTaxDetails.push(this.data[i]);
                }
                // this.services.taxDetails = this.arrTaxDetails;
                this.paginationLoad();
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 401 || err.status === 403 || err.status === 404) {
                    this.commonService.toastr('error', 'Please wait...', '');
                } else {
                    this.commonService.sessionExpired();
                }
            }
        );
    }

    paginationLoad() {
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.arrTaxDetails);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    edit(formData) {
        if (!(this.key > 0)) {
            this.commonService.toastr('error', 'Please select port');
            return false;
        }
        formData['isoPortCode'] = this.key;
        let msg = 'added';
        this.commonService.toastr('warning', 'Please wait...');
        if (this.vid > 0) {
            msg = 'updated';
            formData['id'] = this.vid;
        }
        formData['serviceId'] = this.services.servTaxID;
        this.http.postRequest(this.api.saveTaxdet, formData).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Successfully' + msg);
                this.addForm = true;
                this.form.reset();
                this.getTaxDetails();
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status !== 201) {
                    this.commonService.toastr('error', 'Please try again');
                }
            }
        );
    }

    back() {
        this.addForm = true;
        this.form.reset();
        this.paginationLoad();
    }

    update(id) {
        this.vid = id;
        this.addForm = false;
        this.services.disableText = false;
        this.btnSubmit = 'Update';
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getTaxdetList + id).subscribe(
            res => {
                this.data = res;
                this.commonService.toastr('clear');
                this.form.patchValue(res);
                for (let i = 0; i < this.arrPortList.length; i++) {
                    if (this.arrPortList[i].id === Number(this.data.isoPortCode)) {
                        this.key = Number(this.data.isoPortCode);
                        this.groupControl.setValue( {isoPortCode: this.arrPortList[i].isoPortCode});
                    }
                }
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    view(id) {
        this.form.reset();
        this.addForm = false;
        this.btnSubmit = '';
        this.services.disableText = true;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getTaxdetList + id).subscribe(
            res => {
                this.data = res;
                this.commonService.toastr('clear');
                this.form.patchValue(res);
                for (let i = 0; i < this.arrPortList.length; i++) {
                    if (this.arrPortList[i].id === Number(this.data.isoPortCode)) {
                        this.key = Number(this.data.isoPortCode);
                        this.groupControl.setValue( {isoPortCode: this.arrPortList[i].isoPortCode});
                    }
                }
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    delete(id) {
        if (!confirm('Are you sure you want delete!!!')) {
            return false;
        }
        this.commonService.toastr('warning', 'Please wait...');
        this.http.deleteRequest(this.api.deleteTaxdet + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.getTaxDetails();
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 401 || err.status === 403) {
                    this.commonService.sessionExpired();
                } else if (err.status === 200) {
                    this.getTaxDetails();
                } else if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    add() {
        this.addForm = false;
        this.btnSubmit = 'Save';
        this.services.disableText = false;
        this.vid = 0;
        this.groupControl.setValue( {isoPortCode: ''});
    }

    back_main() {
        this.router.navigate(['/master/service']);
    }

}
