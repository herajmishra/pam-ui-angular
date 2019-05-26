import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {CustomValidator} from 'src/app/shared/custom-validation';
import {CommonService} from 'src/app/service/common.service';
import {HttpService} from 'src/app/service/http.service';
import {ApiUrlService} from 'src/app/service/api-url.service';
import {VendorService} from 'src/app/service/master/vendor.service';

@Component({
    selector: 'app-vendor-bank-details',
    templateUrl: './vendor-bank-details.component.html',
    styleUrls: ['./vendor-bank-details.component.scss']
})
export class VendorBankDetailsComponent implements OnInit {

    form: FormGroup;
    addForm = true;
    btnSubmit = '';
    vid = 0;
    data: any;
    arrDataLookup: any;
    arrCompanyDetails = [];

    displayedColumns: string[] = ['beneficiaryName', 'bank', 'bankAccountNo', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private fb: FormBuilder, public commonService: CommonService, private http: HttpService, private api: ApiUrlService, private vendorService: VendorService, private router: Router) {
    }

    ngOnInit() {
        if (this.vendorService.action === 0) {
            this.router.navigate(['/master/vendor']);
        }

        this.getCompanyDetails();
        this.getLookupDet();

        this.form = this.fb.group({
            beneficiaryName: ['', [Validators.required]],
            bank: ['', [Validators.required]],
            bankAddress: ['', [Validators.required]],
            bankAccountNo: ['', [Validators.required, CustomValidator.numberValidator]],
            ifscCode: [null],
            modeOfPayment: ['', [Validators.required]],
            micrNo: [null, [CustomValidator.numberValidator]],
            typeOfAccount: ['', [Validators.required, CustomValidator.alphaValidator]],
            swiftCode: ['', [Validators.required, CustomValidator.swiftCodeValidator]]
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getLookupDet() {
        this.arrDataLookup = [];
        this.http.getRequest(this.api.getVendBankLookupList).subscribe(
            res => {
                this.data = res;
                this.arrDataLookup = this.data;
            },
            err => {
                console.log('Hii');
            }
        );

    }

    getCompanyDetails() {
        this.arrCompanyDetails = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getFindByVendorbankID + this.vendorService.venID).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    console.log(this.data[i].ifscCode)
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
        if (formData.modeOfPayment === 'NEFT' || formData.modeOfPayment === 'RTGS') {
            if (formData.ifscCode === '' || formData.ifscCode === null) {
                this.commonService.toastr('error', 'Please enter IFSC code');
                return false;
            }
        } else if (formData.modeOfPayment === 'CHEQUE') {
            if (formData.micrNo === '' || formData.micrNo === null) {
                this.commonService.toastr('error', 'Please enter MICR No');
                return false;
            }
        } else if (formData.modeOfPayment === 'IMPS') {
            if (formData.ifscCode === '' || formData.ifscCode === null) {
                this.commonService.toastr('error', 'Please enter IFSC No');
                return false;
            }
        }
        let msg = 'added';
        this.commonService.toastr('warning', 'Please wait...');
        if (this.vid > 0) {
            msg = 'updated';
            formData['id'] = this.vid;
        }
        formData['vendorId'] = this.vendorService.venID;
        this.http.postRequest(this.api.saveVendorbank, formData).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Successfully' + msg);
                this.addForm = true;
                this.form.reset();
                this.getCompanyDetails();
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
    }

    update(id) {
        this.vid = id;
        this.addForm = false;
        this.vendorService.disableText = false;
        this.btnSubmit = 'Update';
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByBankID + id).subscribe(
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
        this.http.getRequest(this.api.getFindByBankID + id).subscribe(
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
        this.http.deleteRequest(this.api.deleteVendorbankID + id).subscribe(
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
        this.vendorService.disableText = false;
    }

    back_main() {
        this.router.navigate(['/master/vendor']);
    }

}
