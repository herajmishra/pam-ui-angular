import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {CustomerService} from 'src/app/service/master/customer.service';
import {HttpService} from 'src/app/service/http.service';
import {ApiUrlService} from 'src/app/service/api-url.service';
import {CommonService} from 'src/app/service/common.service';
import {CustomValidator} from 'src/app/shared/custom-validation';

@Component({
    selector: 'app-cust-contact',
    templateUrl: './cust-contact.component.html',
    styleUrls: ['./cust-contact.component.scss']
})
export class CustContactComponent implements OnInit {

    form: FormGroup;
    addForm = true;
    btnSubmit = '';
    vid = 0;
    data: any;
    arrCompanyDetails = [];

    displayedColumns: string[] = ['title', 'cntpersn', 'tele', 'fax', 'email', 'status'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private fb: FormBuilder, public commonService: CommonService, private http: HttpService, private api: ApiUrlService, private customerService: CustomerService, private router: Router) {
    }

    ngOnInit() {
        if (this.customerService.action === 0) {
            this.router.navigate(['/master/customer']);
        }
        this.getCompanyDetails();

        this.form = this.fb.group({
            title: ['', [Validators.required]],
            cntpersn: ['', [Validators.required]],
            tele: ['', [Validators.required, CustomValidator.numberValidator, Validators.maxLength(10), Validators.minLength(10)]],
            fax: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            status: ['', [Validators.required]]
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getCompanyDetails() {
        this.arrCompanyDetails = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getCustomercntList).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.data[i]['srno'] = i + 1;
                    this.arrCompanyDetails.push(this.data[i]);
                }
                this.customerService.GCustDetails = this.arrCompanyDetails;
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
        let msg = 'added';
        this.commonService.toastr('warning', 'Please wait...');
        if (this.vid > 0) {
            msg = 'updated';
            formData['id'] = this.vid;
        }
        this.http.postRequest(this.api.saveCustomercnt, formData).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Successfully' + msg);
                this.addForm = true;
                this.form.reset();
                this.getCompanyDetails();
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
    }

    update(id) {
        this.vid = id;
        this.addForm = false;
        this.customerService.disableText = false;
        this.btnSubmit = 'Update';
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByCustomercntID + id).subscribe(
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
        this.customerService.disableText = true;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByCustomercntID + id).subscribe(
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
        this.http.deleteRequest(this.api.deleteCustomercntID + id).subscribe(
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
        this.btnSubmit = 'Add';
    }

    back_main() {
        this.router.navigate(['master/customer']);
    }

}
