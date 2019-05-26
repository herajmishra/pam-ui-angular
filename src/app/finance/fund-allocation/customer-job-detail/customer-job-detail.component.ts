import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {InflowService} from '../../../service/finance/inflow.service';
import {CommonService} from '../../../service/common.service';
import {HttpService} from '../../../service/http.service';
import {ApiUrlService} from '../../../service/api-url.service';

@Component({
    selector: 'app-customer-job-detail',
    templateUrl: './customer-job-detail.component.html',
    styleUrls: ['./customer-job-detail.component.scss']
})
export class CustomerJobDetailComponent implements OnInit {
    @Input() parentToChildPassing;
    getAllocationData = false;
    selectTR = 0;
    objPassing: any;
    jobList = [];

    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'remark'];
    dataSource: MatTableDataSource<any>;

    constructor(private inflowService: InflowService, private commonService: CommonService,
                private http: HttpService, private api: ApiUrlService) {
    }

    ngOnInit() {
        if (this.parentToChildPassing) {
            this.getCustomerJobDetails(this.parentToChildPassing);
        }
        this.inflowService.createObservable().subscribe(
            res => {
                this.getCustomerJobDetails(res);
            }
        );
    }

    getCustomerJobDetails(e) {
        this.jobList = [];
        this.selectTR = 0;
        this.getAllocationData = false;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getCustomerJobDetails + e.customerId).subscribe(
            res => {
                this.commonService.toastr('clear');
                const data: any = res;
                this.jobList = data;
                this.inflowService.customerJobDetails = data;
                this.paginationLoad();
                this.inflowService.customerNo = e.customerId;
                this.inflowService.getBankReferenceList(e.customerId);
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

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    paginationLoad() {
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.jobList);
        });
    }

    getRecord(e) {
        this.objPassing = e;
        this.inflowService.customerObj.next(e);
    }
}
