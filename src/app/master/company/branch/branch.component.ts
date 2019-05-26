import {Component, OnInit, ViewChild} from '@angular/core';
import {CompanyService} from '../../../service/master/company.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CustomValidator} from '../../../shared/custom-validation';
import {CommonService} from '../../../service/common.service';
import {ApiUrlService} from '../../../service/api-url.service';
import {HttpService} from '../../../service/http.service';

@Component({
    selector: 'app-branch',
    templateUrl: './branch.component.html',
    styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {
    form: FormGroup;
    btnText = '';
    addForm = true;
    arrBranchList = [];
    data: any;
    brcID = 0;

    displayedColumns: string[] = ['name', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(public companyService: CompanyService, private router: Router,
                private fb: FormBuilder, public commonService: CommonService,
                private api: ApiUrlService, private http: HttpService) {
    }

    ngOnInit() {
        if (this.companyService.action === 0) {
            this.router.navigate(['/master/company']);
        }

        this.getBranchDetails();

        this.form = this.fb.group({
            name: ['', [Validators.required, CustomValidator.alphaValidator]],
            head: ['', [Validators.required, CustomValidator.alphaValidator]],
            city: ['', [Validators.required, CustomValidator.alphaValidator]],
            contactNo: ['', [Validators.required, CustomValidator.teleValidator]],
            email: ['', [Validators.required, Validators.email]],
            state: ['', [Validators.required, CustomValidator.alphaValidator]],
            street: ['', [Validators.required]],
            mobileNo: ['', [Validators.required, CustomValidator.teleValidator]],

        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getBranchDetails() {
        this.arrBranchList = [];
        this.commonService.toastr('warning', 'Getting Branch details', 'Please wait...');
        this.http.getRequest(this.api.getBranchList + this.companyService.orgID).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.arrBranchList.push(this.data[i]);
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

    paginationLoad() {
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.arrBranchList);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    add() {
        this.addForm = false;
        this.form.reset();
        this.brcID = 0;
        this.companyService.disableText = false;
        this.btnText = 'Save';
    }

    save(formData) {
        if (this.brcID > 0) {
            formData['id'] = this.brcID;
        }
        formData['orgId'] = this.companyService.orgID;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.saveBranch, formData).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.form.reset();
                this.addForm = true;
                this.getBranchDetails();
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 409) {
                    this.commonService.toastr('error', err.error.message);
                } else if (err.status === 401 || err.status === 403) {
                    this.commonService.toastr('error', 'Please try again...');
                } else {
                    this.commonService.sessionExpired();
                }
            }
        );
    }

    back() {
        this.addForm = true;
        this.paginationLoad();
    }

    back_main() {
        this.router.navigate(['master/company/details']);
    }

    delete(id) {
        if (!confirm('Are you sure you want to delete!!!')) {
            return false;
        }
        this.commonService.toastr('warning', 'Please wait...');
        this.http.deleteRequest(this.api.deleteBranch + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.getBranchDetails();
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

    update(id) {
        this.addForm = false;
        this.brcID = id;
        this.form.reset();
        this.companyService.disableText = false;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByBrnchID + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.form.patchValue(res);
                this.btnText = 'Update';
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 409) {
                    this.commonService.toastr('error', err.error.message);
                } else if (err.status === 401 || err.status === 403) {
                    this.commonService.toastr('error', 'Please try again...');
                } else {
                    this.commonService.sessionExpired();
                }
            }
        );
    }

    view(id) {
        this.addForm = false;
        this.brcID = id;
        this.form.reset();
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByBrnchID + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.companyService.disableText = true;
                this.form.patchValue(res);
                this.btnText = '';
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 409) {
                    this.commonService.toastr('error', err.error.message);
                } else if (err.status === 401 || err.status === 403) {
                    this.commonService.toastr('error', 'Please try again...');
                } else {
                    this.commonService.sessionExpired();
                }
            }
        );
    }
}
