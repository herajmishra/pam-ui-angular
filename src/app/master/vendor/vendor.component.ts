import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CustomValidator} from '../../shared/custom-validation';
import {CommonService} from '../../service/common.service';
import {HttpService} from '../../service/http.service';
import {ApiUrlService} from '../../service/api-url.service';
import {VendorService} from '../../service/master/vendor.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface Port {
    id: number;
    description: string;
}
@Component({
    selector: 'app-vendor',
    templateUrl: './vendor.component.html',
    styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

    form: FormGroup;
    addForm = true;
    btnSubmit = '';
    vid = 0;
    data: any;
    arrCompanyDetails = [];
    displayedColumns: string[] = ['name', 'code', 'portId',  'status', 'button', 'action'];
    dataSource: MatTableDataSource<any>;
    editPortDisable = false;
    selectedOption = 'ACTIVE';

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    // Autocompleted
    groupControl = new FormControl();
    arrPortList: Port[] = [];
    filteredOptions: Observable<Port[]>;
    key: number;

    constructor(private fb: FormBuilder, public commonService: CommonService, private http: HttpService, private api: ApiUrlService, private vendorService: VendorService, private router: Router) {
    }

    ngOnInit() {
        this.getServiceDetails();
        this.getPortDetails();

        this.form = this.fb.group({
            name: ['', [Validators.required]],
            code: ['', [Validators.required]],
            status: ['', [Validators.required]],
            address: ['', [Validators.required]],
            location: ['', [Validators.required, CustomValidator.alphaValidator]],
            currency: ['', [Validators.required, CustomValidator.alphaValidator]],
            tanNo: ['', [CustomValidator.tanValidator]],
            panNo: ['', [CustomValidator.panValidator]],
            gst: ['', [CustomValidator.gstValidator]]
        });
        this.setSelectedOption();
    }

  setSelectedOption() {
    return this.form.controls['status'].setValue(this.selectedOption, {onlySelf: true});
  }

    displayFn(user?: Port): string | undefined {
        return user ? user.description : undefined;
    }

    selectVal(e) {
        this.key = e.id;
    }

    _filter(name: string): Port[] {
        const filterValue = name.toLowerCase();
        return this.arrPortList.filter(option => option.description.toLowerCase().indexOf(filterValue) === 0);
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
                console.log(res);
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.arrPortList.push(this.data[i]);
                }
                this.filteredOptions = this.groupControl.valueChanges
                    .pipe(
                        startWith<string | Port>(''),
                        map(value => typeof value === 'string' ? value : value.description),
                        map(name => name ? this._filter(name) : this.arrPortList.slice())
                    );
                this.getCompanyDetails();
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

    getCompanyDetails() {
        this.arrCompanyDetails = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getVendorList).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    for ( let j = 0; j < this.arrPortList.length; j++) {
                        if (Number(this.data[i].portId) === this.arrPortList[j].id) {
                            this.data[i].portId = this.arrPortList[j].description;
                        }
                    }
                    this.arrCompanyDetails.push(this.data[i]);
                }
                this.vendorService.GVendorDetails = this.arrCompanyDetails;
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
            this.dataSource = new MatTableDataSource(this.arrCompanyDetails);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }


    edit(formData) {
        if (!(this.key > 0)) {
            this.commonService.toastr('error', 'Please select port');
            return false;
        }
        formData['portId'] = this.key;
        let msg = 'added';
        this.commonService.toastr('warning', 'Please wait...');
        if (this.vid > 0) {
            msg = 'updated';
            formData['id'] = this.vid;
        }
        this.http.postRequest(this.api.saveVendor, formData).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Successfully' + msg);
                this.addForm = true;
                this.form.reset();
                this.getCompanyDetails();
                this.setSelectedOption();
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 401 || err.status === 403) {
                    this.commonService.sessionExpired();
                } else if (err.status === 409) {
                    this.commonService.toastr('error', err.error.message);
                } else if (err.status !== 201) {
                    this.commonService.toastr('error', 'Please try again');
                }
            }
        );
    }

    back() {
        this.addForm = true;
        this.form.reset();
        this.paginationLoad();
        this.setSelectedOption();
    }

    update(id) {
        this.vid = id;
        this.addForm = false;
        this.vendorService.disableText = false;
        this.btnSubmit = 'Update';
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByVendorID + id).subscribe(
            res => {
                this.data = res;
                this.commonService.toastr('clear');
                this.form.patchValue(res);
                for (let i = 0; i < this.arrPortList.length; i++) {
                    if (this.arrPortList[i].id === Number(this.data.portId)) {
                        this.key = Number(this.data.portId);
                        this.groupControl.setValue( {description: this.arrPortList[i].description});
                    }
                }
                this.editPortDisable = true;
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
        this.vendorService.disableText = true;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByVendorID + id).subscribe(
            res => {
                this.data = res;
                this.commonService.toastr('clear');
                this.form.patchValue(res);
                for (let i = 0; i < this.arrPortList.length; i++) {
                    if (this.arrPortList[i].id === Number(this.data.portId)) {
                        this.key = Number(this.data.portId);
                        this.groupControl.setValue( {description: this.arrPortList[i].description});
                    }
                }
                this.editPortDisable = true;
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
        this.http.deleteRequest(this.api.deleteVendorID + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.getCompanyDetails();
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

    add() {
        this.addForm = false;
        this.btnSubmit = 'Save';
        this.vendorService.disableText = false;
        this.editPortDisable = false;
        this.vid = 0;
        this.groupControl.setValue( {description: ''});
    }

    bankdetails(res, res1) {
        this.vendorService.venName = res;
        this.vendorService.venID = res1;
        this.vendorService.action = 1;
        this.router.navigate(['/master/vendor/bank']);
    }

    grpdetails() {
        this.vendorService.action = 1;
        this.router.navigate(['/master/vendor/group']);
    }

    servicedetails(res, res1) {
        this.vendorService.venName = res;
        this.vendorService.venID = res1;
        this.vendorService.action = 1;
        this.router.navigate(['/master/vendor/services']);
    }

    getServiceDetails() {
        this.vendorService.arrServiceDetails = [];
        this.http.getRequest(this.api.getserviceList).subscribe(
            res => {
                this.data = res;
                for (const item of this.data) {
                    this.vendorService.arrServiceDetails.push(item);
                }
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
}



