import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {InflowService} from '../../../service/finance/inflow.service';
import {CommonService} from '../../../service/common.service';
import {ApiUrlService} from '../../../service/api-url.service';
import {HttpService} from '../../../service/http.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
    selector: 'app-service-details',
    templateUrl: './service-details.component.html',
    styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit {
    @Input() parentToChildPassing;
    arrServiceDetails = [];

    displayParticular = false;
    objPassing: any;
    selectTR = 0;

    displayedColumns: string[] = ['serviceCode', 'sacCode', 'chargeBasis', 'amtRequested', 'amtApproved', 'amtDisbursed'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource: MatTableDataSource<any>;

    constructor(private inflowService: InflowService, private commonService: CommonService,
                private api: ApiUrlService, private http: HttpService) {
    }

    ngOnInit() {
        if (this.parentToChildPassing) {
            this.getServiceDetails(this.parentToChildPassing);
        }
        this.inflowService.branchJobListObservable().subscribe(
            res => {
                this.parentToChildPassing = res;
                this.getServiceDetails(res);
            }
        );
        this.inflowService.objBranchRequisitionJobList = this.parentToChildPassing;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getServiceDetails(obj) {
        this.displayParticular = false;
        this.selectTR = 0;
        this.arrServiceDetails = [];
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFinanceServiceList + obj.id).subscribe(
            res => {
                this.commonService.toastr('clear');
                const data: any = res;
                this.arrServiceDetails = data;
                this.paginationLoad();
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

    paginationLoad() {
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.arrServiceDetails);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    getRecord(e) {
        this.displayParticular = true;
        this.objPassing = e;
        this.inflowService.branchServiceListObj.next(e);
    }

}
