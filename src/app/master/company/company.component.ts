import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {CompanyService} from '../../service/master/company.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {CustomValidator} from '../../shared/custom-validation';
import {HttpService} from '../../service/http.service';
import {ApiUrlService} from '../../service/api-url.service';
import {ToastrService} from 'ngx-toastr';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import {Country} from '../vessel/vessel.component';
import {Observable} from 'rxjs';

export interface Country {
    id: number;
    name: string;
}

@Component({
    selector: 'app-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
    form: FormGroup;
    addForm = true;
    btnSubmit = '';
    data: any;
    arrDataLookup: any;
    arrCompanyDetails = [];
    cid = 0;
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['name', 'org', 'action'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    // Autocompleted
    groupControl = new FormControl('', Validators.required);
    arrCountryList: Country[] = [];
    filteredOptions: Observable<Country[]>;
    key: number;

    constructor(private router: Router, private companyService: CompanyService, private fb: FormBuilder,
                public commonService: CommonService, private http: HttpService, private api: ApiUrlService,
                private toastrService: ToastrService) {
    }

    ngOnInit() {
        this.getCompanyDetails();
        this.getCountryList();

        this.form = this.fb.group({
            phone: ['', [Validators.required, CustomValidator.teleValidator]],
            email: ['', [Validators.required, Validators.email]],
            name: ['', [Validators.required]],
            street: ['', [Validators.required]],
            city: ['', [Validators.required, CustomValidator.alphaValidator]],
            state: ['', [Validators.required, CustomValidator.alphaValidator]],
            zipCode: ['', [Validators.required]],
            telephoneNo: ['', [Validators.required, CustomValidator.teleValidator]],
            defaultCurrency: ['', [Validators.required, CustomValidator.alphaValidator]],
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

    getCompanyDetails() {
        this.arrCompanyDetails = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getCompanyDetails).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.data[i]['srno'] = i + 1;
                    this.arrCompanyDetails.push(this.data[i]);
                }
                this.companyService.GCompanyDetails = this.arrCompanyDetails;
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

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    addOrganization(id, name) {
        this.companyService.action = 1;
        this.companyService.cmpID = id;
        this.companyService.cmpName = name;
        this.router.navigate(['/master/company/details']);
    }

    add() {
        this.addForm = false;
        this.companyService.disableText = false;
        this.btnSubmit = 'Save';
        this.groupControl.setValue('');
        this.cid = 0;
        this.form.reset();
    }

    edit(formData) {
        if (!(this.key > 0)) {
            this.commonService.toastr('error', 'Please select country');
            return false;
        }
        formData['country'] = this.key;
        let msg = 'added';
        this.companyService.disableText = false;
        this.commonService.toastr('warning', 'Please wait...');
        if (this.cid > 0) {
            msg = 'updated';
            formData['id'] = this.cid;
        }
        this.http.postRequest(this.api.updateCompanyDetails, formData).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Successfully ' + msg);
                this.addForm = true;
                this.form.reset();
                this.getCompanyDetails();
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 409) {
                    this.commonService.toastr('error', err.error.message);
                } else if (err.status !== 201) {
                    this.commonService.toastr('error', 'Please try again');
                }
            }
        );
    }

    update(id) {
        this.cid = id;
        this.addForm = false;
        this.companyService.disableText = false;
        this.btnSubmit = 'Update';
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getCompanyByID + id).subscribe(
            res => {
                this.data = res;
                this.commonService.toastr('clear');
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
        this.companyService.disableText = true;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getCompanyByID + id).subscribe(
            res => {
                this.data = res;
                this.commonService.toastr('clear');
                this.form.patchValue(res);
                for (let i = 0; i < this.arrCountryList.length; i++) {
                    if (this.arrCountryList[i].id === Number(this.data.country)) {
                        this.key = Number(this.data.country);
                        this.groupControl.setValue( {name: this.arrCountryList[i].name});
                    }
                }
                //this.companyService.countryName = this.data.country;
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    back() {
        this.addForm = true;
        this.paginationLoad();
    }
}
