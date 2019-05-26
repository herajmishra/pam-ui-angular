import {Component, OnInit, ViewChild} from '@angular/core';
import {CompanyService} from '../../../service/master/company.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CustomValidator} from '../../../shared/custom-validation';
import {CommonService} from '../../../service/common.service';
import {ApiUrlService} from '../../../service/api-url.service';
import {HttpService} from '../../../service/http.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface Country {
    id: number;
    name: string;
}

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
    form: FormGroup;
    btnText = '';
    addForm = true;
    arrOrgList = [];
    arrCompanyDetails = [];
    data: any;
    orgID = 0;

    displayedColumns: string[] = ['name', 'branch', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    // Autocompleted
    groupControl = new FormControl('', Validators.required);
    arrCountryList: Country[] = [];
    filteredOptions: Observable<Country[]>;
    key: number;

    constructor(public companyService: CompanyService, private router: Router,
                private fb: FormBuilder, public commonService: CommonService,
                private api: ApiUrlService, private http: HttpService) {
    }

    ngOnInit() {
        if (this.companyService.action === 0) {
            this.router.navigate(['/master/company']);
        }

        this.getOrganizationDetails();
        this.getCountryList();

        this.form = this.fb.group({
            name: ['', [Validators.required, CustomValidator.alphaValidator]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, CustomValidator.teleValidator]],
            street: ['', [Validators.required]],
            city: ['', [Validators.required, CustomValidator.alphaValidator]],
            state: ['', [Validators.required, CustomValidator.alphaValidator]],
            zipcode: ['', [Validators.required]],
            panNo: ['', [Validators.required, CustomValidator.panValidator]],
            tanNo: ['', [Validators.required, CustomValidator.tanValidator]],
            telephoneNo: ['', [Validators.required, CustomValidator.teleValidator]],
            gstNo: ['', [Validators.required, CustomValidator.gstValidator]]
        });
    }

    displayFn(user?: Country): string | undefined {
        return user ? user.name : undefined;
    }

    selectVal(e) {
        this.key = e.id;
    }

    _filter(name: string): Country[] {
        const filterValue = name.toLowerCase();
        return this.arrCountryList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    getCountryList() {
        this.arrCountryList = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getCountryComList).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.arrCountryList.push(this.data[i]);
                }
                this.filteredOptions = this.groupControl.valueChanges
                    .pipe(
                        startWith<string | Country>(''),
                        map(value => typeof value === 'string' ? value : value.name),
                        map(name => name ? this._filter(name) : this.arrCountryList.slice())
                    );
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

    getOrganizationDetails() {
        this.arrOrgList = [];
        this.commonService.toastr('warning', 'Getting organization details', 'Please wait...');
        this.http.getRequest(this.api.getOrgList + this.companyService.cmpID).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.arrOrgList.push(this.data[i]);
                }
                this.paginationLoad();
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 401 || err.status === 403) {
                    this.commonService.toastr('error', 'Please try again...');
                } else {
                    this.commonService.sessionExpired();
                }
            }
        );
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }


    add() {
        this.addForm = false;
        this.btnText = 'Save';
        this.form.reset();
        this.orgID = 0;
        this.groupControl.setValue('');
        this.companyService.disableText = false;
    }

    addBranch(id, name) {
        this.companyService.orgID = id;
        this.companyService.orgName = name;
        this.router.navigate(['/master/company/branch']);
    }

    back() {
        this.addForm = true;
        this.paginationLoad();
    }

    paginationLoad() {
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.arrOrgList);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    back_main() {
        this.companyService.action = 0;
        this.router.navigate(['/master/company']);
    }

    save(formData) {
        if (this.orgID > 0) {
            formData['id'] = this.orgID;
        }
        formData['companyId'] = this.companyService.cmpID;
        formData['country'] = this.key;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.saveOrganization, formData).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Successfully added');
                this.getOrganizationDetails();
                this.form.reset();
                this.addForm = true;
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

    edit(id) {
        this.orgID = id;
        this.btnText = 'Update';
        this.companyService.disableText = false;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByOrgID + id).subscribe(
            res => {
                this.data = res;
                this.commonService.toastr('clear');
                this.addForm = false;
                this.form.patchValue(res);
                for (let i = 0; i < this.arrCountryList.length; i++) {
                    if (this.arrCountryList[i].id === Number(this.data.country)) {
                        this.key = Number(this.data.country);
                        this.groupControl.setValue( {name: this.arrCountryList[i].name});
                    }
                }
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

    view(id) {
        this.form.reset();
        this.orgID = id;
        this.companyService.disableText = true;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByOrgID + id).subscribe(
            res => {
                this.data = res;
                this.commonService.toastr('clear');
                this.addForm = false;
                this.form.patchValue(res);
                for (let i = 0; i < this.arrCountryList.length; i++) {
                    if (this.arrCountryList[i].id === Number(this.data.country)) {
                        this.key = Number(this.data.country);
                        this.groupControl.setValue( {name: this.arrCountryList[i].name});
                    }
                }
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

    delete(id) {
        if (!confirm('Are you sure you want to delete!!!')) {
            return false;
        }
        this.orgID = id;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.deleteRequest(this.api.deleteOrganization + id).subscribe(
            res => {
                this.getOrganizationDetails();
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
}
