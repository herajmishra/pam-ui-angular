import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CustomValidator} from '../../shared/custom-validation';
import {CommonService} from '../../service/common.service';
import {HttpService} from '../../service/http.service';
import {ApiUrlService} from '../../service/api-url.service';
import {Router} from '@angular/router';
import {CountryService} from 'src/app/service/master/country.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

    form: FormGroup;
    addForm = true;
    btnSubmit = '';
    vid = 0;
    data: any;
    arrCountryDetails = [];
    selectedOption = 'ACTIVE';
    displayedColumns: string[] = ['countryisocode', 'countrysortcode', 'name', 'status', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private fb: FormBuilder, public commonService: CommonService, private http: HttpService, private api: ApiUrlService, private countryService: CountryService, private router: Router) {
    }

    ngOnInit() {
        this.getCompanyDetails();

        this.form = this.fb.group({
            alpha2Code: ['', [Validators.required, CustomValidator.alphaValidator]],
            alpha3Code: ['', [Validators.required, CustomValidator.alphaValidator]],
            name: ['', [Validators.required, CustomValidator.alphaValidator]],
            longitude: ['', [Validators.required, CustomValidator.meterLatitude]],
            latitude: ['', [Validators.required, CustomValidator.meterLatitude]],
            currency: ['', [Validators.required, CustomValidator.alphaValidator]],
            status: ['', [Validators.required]],
        });
        this.setSelectedOption();
    }

  setSelectedOption() {
    return this.form.controls['status'].setValue(this.selectedOption, {onlySelf: true});
  }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getCompanyDetails() {
        this.arrCountryDetails = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getCountryList).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.data[i]['srno'] = i + 1;
                    this.arrCountryDetails.push(this.data[i]);
                }
                this.countryService.GCountryDetails = this.arrCountryDetails;
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
            this.dataSource = new MatTableDataSource(this.arrCountryDetails);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }


    save(formData) {
        let msg = 'added';
        this.commonService.toastr('warning', 'Please wait...');
        if (this.vid > 0) {
            msg = 'updated';
            formData['id'] = this.vid;
        }
        this.http.postRequest(this.api.saveCountry, formData).subscribe(
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
        this.countryService.disableText = false;
        this.btnSubmit = 'Update';
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByCountryID + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.form.patchValue(res);
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
        this.countryService.disableText = true;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByCountryID + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.form.patchValue(res);
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
        this.http.deleteRequest(this.api.deleteCountryID + id).subscribe(
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
        this.vid = 0;
        this.countryService.disableText = false;
    }

}

