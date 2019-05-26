import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CustomValidator} from '../../shared/custom-validation';
import {CommonService} from '../../service/common.service';
import {HttpService} from '../../service/http.service';
import {ApiUrlService} from '../../service/api-url.service';
import {Router} from '@angular/router';
import {CustomerService} from 'src/app/service/master/customer.service';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

    form: FormGroup;
    addForm = true;
    btnSubmit = '';
    vid = 0;
    data: any;
    arrDataLookup: any;
    arrCompanyDetails = [];
    displayedColumns: string[] = ['name', 'code', 'type', 'status', 'button', 'action'];
    dataSource: MatTableDataSource<any>;
    selectedOption = 'ACTIVE';

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private fb: FormBuilder, public commonService: CommonService, private http: HttpService, private api: ApiUrlService, private customerService: CustomerService, private router: Router) {
    }

    ngOnInit() {
        this.getCompanyDetails();
        this.getServiceDetails();
        this.getLookupDet();

        this.form = this.fb.group({
            name: ['', [Validators.required]],
            code: ['', [Validators.required]],
            type: ['', [Validators.required]],
            address: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            location: ['', [Validators.required, CustomValidator.alphaValidator]],
            currency: ['', [Validators.required, CustomValidator.alphaValidator]],
            tanNo: ['', [CustomValidator.tanValidator]],
            panNo: ['', [CustomValidator.panValidator]],
            status: ['', [Validators.required]]
        });
        this.setSelectedOption();
    }
    setSelectedOption(){
        return this.form.controls['status'].setValue(this.selectedOption, {onlySelf: true});
    }
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    getLookupDet() {
        this.arrDataLookup = [];
        this.http.getRequest(this.api.getCustLookupList).subscribe(
            res => {
                this.data = res;
                this.arrDataLookup = this.data;
                console.log(this.arrDataLookup);
            },
            err => {
                console.log('Hii');
            }
        );

    }

    getCompanyDetails() {
        this.arrCompanyDetails = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getCustomerList).subscribe(
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
        this.http.postRequest(this.api.saveCustomer, formData).subscribe(
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
        this.customerService.disableText = false;
        this.btnSubmit = 'Update';
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByCustomerID + id).subscribe(
            res => {
                console.log(res);
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
        this.http.getRequest(this.api.getFindByCustomerID + id).subscribe(
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
        this.http.deleteRequest(this.api.deleteCustomerID + id).subscribe(
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
        this.customerService.disableText = false;
    }

    bankdetails(res, res1) {
        this.customerService.custID = res1;
        this.customerService.custName = res;
        this.customerService.action = 1;
        this.router.navigate(['/master/customer/bank']);
    }

    grpdetails() {
        this.customerService.action = 1;
        this.router.navigate(['/master/customer/group']);
    }

    contactdetails(name, id) {
        this.customerService.custID = id;
        this.customerService.custName = name;
        this.customerService.action = 1;
        this.router.navigate(['/master/customer/contact']);
    }

    addService(name, id) {
        this.customerService.custID = id;
        this.customerService.custName = name;
        this.customerService.action = 1;
        this.router.navigate(['/master/customer/service']);
    }

    getServiceDetails() {
        this.customerService.arrServiceDetails = [];
        this.http.getRequest(this.api.getserviceList).subscribe(
            res => {
                this.data = res;
                for (const item of this.data) {
                    this.customerService.arrServiceDetails.push(item);
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
