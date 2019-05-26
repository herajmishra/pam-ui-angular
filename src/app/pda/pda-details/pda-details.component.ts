import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {CommonService} from '../../service/common.service';
import {ApiUrlService} from '../../service/api-url.service';
import {HttpService} from '../../service/http.service';
import {CreateService} from '../../service/pda/create.service';

@Component({
    selector: 'app-pda-details',
    templateUrl: './pda-details.component.html',
    styleUrls: ['./pda-details.component.scss']
})
export class PdaDetailsComponent implements OnInit {
    data: any;
    arrPDADetails = [];
    displayedColumns: string[] = ['customerName', 'pdaNo', 'jobNo', 'portName', 'vesselName', 'eta', 'pdaStatus', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private router: Router,
                private commonService: CommonService,
                private api: ApiUrlService,
                private http: HttpService,
                private pdaService: CreateService,
                private createService: CreateService) {
        localStorage.removeItem('pdaID');
        localStorage.removeItem('mode');
    }

    ngOnInit() {
        this.getPDADetails();
        this.pdaService.getPayloadDetails(localStorage.getItem('token'));
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    add() {
        this.router.navigate(['pda/create']);
      this.createService.pdaStatusBasedEnableDisable = true;
      /*code added by shail as per bug-no-269*/
    }

    getPDADetails() {
        this.arrPDADetails = [];
        this.createService.action = 1;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getPDAList).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (const item of this.data) {
                    this.arrPDADetails.push(item);
                }
                this.paginationLoad();
            },
            err => {
                this.commonService.toastr('error', 'Please try again');
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please wait...');
                }
            }
        );
    }

    paginationLoad() {
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.arrPDADetails);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    update(id) {
        localStorage.setItem('pdaID', btoa(id));
        localStorage.setItem('mode', btoa('edit'));
        this.router.navigate(['pda/create']);
    }

    view(id) {
        localStorage.setItem('pdaID', btoa(id));
        localStorage.setItem('mode', btoa('view'));
        this.router.navigate(['pda/create']);
    }

    delete(id) {
        if (!confirm('Are you sure you want to delete!!!')) {
            return false;
        }
        this.commonService.toastr('warning', 'Please wait...');
        this.http.deleteRequest(this.api.deletePDA + id).subscribe(
            res => {
                this.getPDADetails();
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
}
