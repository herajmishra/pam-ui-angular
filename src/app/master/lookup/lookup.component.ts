import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {CommonService} from '../../service/common.service';
import {HttpService} from '../../service/http.service';
import {ApiUrlService} from '../../service/api-url.service';
import {LookupService} from '../../service/master/lookup.service';

@Component({
    selector: 'app-lookup',
    templateUrl: './lookup.component.html',
    styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {
    data: any;
    lookupData: any;
    arrLookupDetails = [];
    arrOrgList = [];

    displayedColumns: string[] = ['groupKey', 'code', 'value', 'status', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private router: Router, private fb: FormBuilder,
                public commonService: CommonService, private http: HttpService, private api: ApiUrlService,
                private lookupService: LookupService) {
    }

    ngOnInit() {
        this.getLookupDetails();
        this.getOrganizationList();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    add() {
        this.lookupService.groupControl = '';
        this.lookupService.code = '';
        this.lookupService.clickAction = true;
        this.lookupService.btnText = 'Save';
        this.lookupService.lookupAction = 1;
        this.lookupService.orgID = '';
        this.lookupService.disableText = false;
        this.lookupService.lookupID = 0;
        this.router.navigate(['/master/lookup/add']);
    }

    getOrganizationList() {
        this.arrOrgList = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getFindAllOrgList).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.data[i]['srno'] = i + 1;
                    this.arrOrgList.push(this.data[i]);
                }
                this.lookupService.organizationList = this.arrOrgList;
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

    getLookupDetails() {
        this.arrLookupDetails = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getLookupDetails).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.lookupData = res;
                for (let i = 0; i < this.lookupData.length; i++) {
                    this.arrLookupDetails.push(this.lookupData[i]);
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
            this.dataSource = new MatTableDataSource(this.arrLookupDetails);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    update(id) {
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getLookupByID + id).subscribe(
            res => {
                this.lookupData = res;
                this.lookupService.btnText = 'Update';
                this.commonService.toastr('clear');
                this.lookupService.lookupAction = 1;
                this.lookupService.groupControl = this.lookupData.groupKey;
                this.lookupService.code = this.lookupData.code;
                this.lookupService.orgID = this.lookupData.orgId.toString();
                this.lookupService.clickAction = false;
                this.lookupService.lookupDetails = res;
                this.lookupService.lookupID = this.lookupData.id;
                this.lookupService.disableText = false;
                // this.lookupService.form.controls['orgId'].setValue(this.lookupData.orgId);
                this.router.navigate(['/master/lookup/add']);
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

    view(id) {
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getLookupByID + id).subscribe(
            res => {
                this.lookupData = res;
                this.lookupService.btnText = '';
                this.commonService.toastr('clear');
                this.lookupService.lookupAction = 1;
                this.lookupService.groupControl = this.lookupData.groupKey;
                this.lookupService.code = this.lookupData.code;
                this.lookupService.orgID = this.lookupData.orgId.toString();
                this.lookupService.clickAction = false;
                this.lookupService.lookupDetails = res;
                this.lookupService.lookupID = this.lookupData.id;
                this.lookupService.disableText = true;
                // this.lookupService.form.controls['orgId'].setValue(this.lookupData.orgId);
                this.router.navigate(['/master/lookup/add']);
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

    delete(id) {
        if (!confirm('Are you sure you want to delete!!!')) {
            return false;
        }
        this.commonService.toastr('warning', 'Please wait...');
        this.http.deleteRequest(this.api.deleteLookup + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.getLookupDetails();
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
}
