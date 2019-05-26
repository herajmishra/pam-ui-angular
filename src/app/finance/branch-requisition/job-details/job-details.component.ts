import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {InflowService} from '../../../service/finance/inflow.service';
import {CommonService} from '../../../service/common.service';
import {HttpService} from '../../../service/http.service';
import {ApiUrlService} from '../../../service/api-url.service';

@Component({
    selector: 'app-job-details',
    templateUrl: './job-details.component.html',
    styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
    objPassing: any;
    selectTR = 0;
    arrJobList = [];
    displayJobDetails = false;
    displayedColumns: string[] = ['jobNo', 'vesselName', 'portName', 'berthName', 'eta', 'ata', 'cargo'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource: MatTableDataSource<any>;

    constructor(private inflowService: InflowService, private commonService: CommonService,
                private http: HttpService, private api: ApiUrlService) {
    }

    ngOnInit() {
        this.getJobList();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getJobList() {
        this.arrJobList = [];
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFinanceBranchJobList + '1').subscribe(
            res => {
                this.commonService.toastr('clear');
                const data: any = res;
                this.arrJobList = data;
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
            this.dataSource = new MatTableDataSource(this.arrJobList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    getRecord(e) {
        this.displayJobDetails = true;
        this.objPassing = e;
        this.inflowService.branchJobListObj.next(e);
    }
}
