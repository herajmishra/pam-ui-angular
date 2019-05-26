import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {InflowService} from '../../service/finance/inflow.service';
import {CommonService} from '../../service/common.service';
import {HttpService} from '../../service/http.service';
import {ApiUrlService} from '../../service/api-url.service';

@Component({
    selector: 'app-fund-allocation',
    templateUrl: './fund-allocation.component.html',
    styleUrls: ['./fund-allocation.component.scss']
})
export class FundAllocationComponent implements OnInit {
    getSuspenseData = false;
    displayJobDetails = false;
    objPassing: any;
    selectTR = 0;
    arrCustomerList = [];
    displayedColumns: string[] = ['customerName', 'remitter', 'currency', 'amountReceived', 'roe', 'netAmountReceivedLocal'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource: MatTableDataSource<any>;

    constructor(private inflowService: InflowService, private commonService: CommonService,
                private http: HttpService, private api: ApiUrlService) {
    }

    ngOnInit() {
        this.getSuspenseData = true;
        this.getCustomerList();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getCustomerList() {
        this.arrCustomerList = [];
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFinanceCustomerList).subscribe(
            res => {
                this.commonService.toastr('clear');
                const data: any = res;
                this.arrCustomerList = data;
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
            this.dataSource = new MatTableDataSource(this.arrCustomerList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    getRecord(e) {
        this.objPassing = e;
        this.displayJobDetails = true;
        this.inflowService.subjectObj.next(e);
    }
}
