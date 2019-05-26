import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CommonService} from '../../../service/common.service';
import {HttpService} from '../../../service/http.service';
import {ApiUrlService} from '../../../service/api-url.service';
import {Router} from '@angular/router';
import {CustomerService} from '../../../service/master/customer.service';

@Component({
    selector: 'app-cust-service',
    templateUrl: './cust-service.component.html',
    styleUrls: ['./cust-service.component.scss']
})
export class CustServiceComponent implements OnInit {
    form: FormGroup;
    addForm = true;
    btnSubmit = '';
    vid = 0;
    data: any;
    arrServiceDetails = [];

    displayedColumns: string[] = ['description'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private fb: FormBuilder, public commonService: CommonService, private http: HttpService, private api: ApiUrlService, private customerService: CustomerService, private router: Router) {
    }

    ngOnInit() {
        if (this.customerService.action === 0) {
            this.router.navigate(['/master/customer']);
        }

        this.getServiceDetails();

        this.form = this.fb.group({
            serviceId: ['', [Validators.required]],
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getServiceDetails() {
        this.arrServiceDetails = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getCustomerServiceList + this.customerService.custID).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.data[i]['srno'] = i + 1;
                    this.arrServiceDetails.push(this.data[i]);
                }
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
            this.dataSource = new MatTableDataSource(this.arrServiceDetails);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    edit(formData) {
        this.commonService.toastr('warning', 'Please wait...');
        formData['customerId'] = this.customerService.custID;
        this.http.postRequest(this.api.savecustomerService, formData).subscribe(
            res => {
                this.addForm = true;
                this.form.reset();
                this.getServiceDetails();
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

    back() {
        this.addForm = true;
        this.form.reset();
        this.paginationLoad();
    }

    back_main() {
        this.router.navigate(['master/customer']);
    }

    add() {
        this.addForm = false;
        this.btnSubmit = 'Add';
    }


}
