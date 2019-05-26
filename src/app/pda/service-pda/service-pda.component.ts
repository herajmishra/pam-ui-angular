import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../../service/http.service';
import {ApiUrlService} from '../../service/api-url.service';
import {CommonService} from '../../service/common.service';
import {CreateService} from '../../service/pda/create.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
    selector: 'app-service-pda',
    templateUrl: './service-pda.component.html',
    styleUrls: ['./service-pda.component.scss']
})
export class ServicePdaComponent implements OnInit {
    displayRecord = false;
    pdaObj = 0;
    arrVendorDetails = [];
    displayedColumns: string[] = ['pdaNo', 'jobNo', 'vesselName', 'portName', 'berthName', 'eta', 'ata', 'cargo', 'operation', 'action'];
    dataSource: MatTableDataSource<any>;
    selectTR = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private http: HttpService, private api: ApiUrlService,
                private commonService: CommonService, private createService: CreateService) {

    }

    ngOnInit() {
        this.getPDADetails();
        this.createService.getPayloadDetails('');
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getPDADetails() {
        this.commonService.toastr('warning', 'Please wait...');
        this.arrVendorDetails = [];
        this.http.getRequest(this.api.getPDAVendorDetails).subscribe(
            res => {
                this.commonService.toastr('clear');
                const data: any = res;
                this.arrVendorDetails = data;
                this.paginationLoad();
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

    paginationLoad() {
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.arrVendorDetails);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    clickPDADetails(obj) {
        this.displayRecord = true;
        this.pdaObj = obj;
        this.createService.subjectObj.next(obj);
    }
}
