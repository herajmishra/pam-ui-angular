import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {CommonService} from 'src/app/service/common.service';
import {HttpService} from 'src/app/service/http.service';
import {ApiUrlService} from 'src/app/service/api-url.service';
import {VendorService} from 'src/app/service/master/vendor.service';

@Component({
    selector: 'app-vendor-services',
    templateUrl: './vendor-services.component.html',
    styleUrls: ['./vendor-services.component.scss']
})
export class VendorServicesComponent implements OnInit {

    form: FormGroup;
    addForm = true;
    btnSubmit = '';
    vid = 0;
    data: any;
    arrServiceDetails = [];

    displayedColumns: string[] = ['description', 'code'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private fb: FormBuilder, public commonService: CommonService, private http: HttpService, private api: ApiUrlService, private vendorService: VendorService, private router: Router) {
    }

    ngOnInit() {
        if (this.vendorService.action === 0) {
            this.router.navigate(['/master/vendor']);
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
        this.http.getRequest(this.api.getVendorServiceList + this.vendorService.venID).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.data[i]['srno'] = i + 1;
                    this.arrServiceDetails.push(this.data[i]);
                }
                this.vendorService.GVendorDetails = this.arrServiceDetails;
                this.paginationLoad();
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

    paginationLoad() {
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.arrServiceDetails);
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
        formData['vendorId'] = this.vendorService.venID;
        this.http.postRequest(this.api.saveVendorService, formData).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Successfully' + msg);
                this.addForm = true;
                this.form.reset();
                this.getServiceDetails();
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

    back_main() {
        this.router.navigate(['master/vendor']);
    }

    update(id) {
        this.vid = id;
        this.addForm = false;
        this.vendorService.disableText = false;
        this.btnSubmit = 'Update';
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByVendorID + id).subscribe(
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
        this.vendorService.disableText = true;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByVendorID + id).subscribe(
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
        this.http.getRequest(this.api.deleteVendorID + id).subscribe(
            res => {
                this.commonService.toastr('clear');
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 200) {
                    this.getServiceDetails();
                } else if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    add() {
        this.addForm = false;
        this.btnSubmit = 'Save';
        this.vid = 0;
    }

}
