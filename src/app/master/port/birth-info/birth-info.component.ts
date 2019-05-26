import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {HttpService} from '../../../service/http.service';
import {ApiUrlService} from '../../../service/api-url.service';
import {ToastrService} from 'ngx-toastr';
import {PortService} from '../../../service/master/port.service';

@Component({
    selector: 'app-birth-info',
    templateUrl: './birth-info.component.html',
    styleUrls: ['./birth-info.component.scss']
})
export class BirthInfoComponent implements OnInit {

    data: any;
    arrBirthDetails = [];

    displayedColumns: string[] = ['code', 'desc', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private router: Router, public portService: PortService, private fb: FormBuilder,
                public commonService: CommonService, private http: HttpService, private api: ApiUrlService,
                private toastrService: ToastrService) {
    }

    ngOnInit() {
        if (this.portService.action === 0) {
            this.router.navigate(['/master/port/master']);
        } else {
            this.getBirthDetails();
        }
    }

    getBirthDetails() {
        this.arrBirthDetails = [];
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getBirthList + this.portService.portID).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.arrBirthDetails.push(this.data[i]);
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
            this.dataSource = new MatTableDataSource(this.arrBirthDetails);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    add() {
        this.portService.disableText = false;
        this.portService.btnText = 'Save';
        this.portService.addBirth.reset();
        this.portService.birthRestriction.reset();
        this.router.navigate(['master/port/birth/add']);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    view(id) {
        this.portService.addBirth.reset();
        this.portService.birthRestriction.reset();
        this.portService.btnText = '';
        this.portService.disableText = true;

        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByBirthID + id).subscribe(
            res => {
                this.getBirthRestrictionDetails(id);
                this.portService.addBirth.patchValue(res);
                this.portService.berthID = id;
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    getBirthRestrictionDetails(id) {
        this.http.getRequest(this.api.getBerthRestriction + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                this.portService.birthRestriction.patchValue(res);
                this.portService.berthRestrictionID = this.data.id;
                this.router.navigate(['master/port/birth/add']);
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    update(id) {
        this.portService.addBirth.reset();
        this.portService.birthRestriction.reset();
        this.portService.btnText = 'Update';
        this.portService.disableText = false;

        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByBirthID + id).subscribe(
            res => {
                this.getBirthRestrictionDetails(id);
                this.portService.addBirth.patchValue(res);
                this.portService.berthID = id;
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
        if (!confirm('Are you sure you want to delete')) {
            return false;
        }
        this.commonService.toastr('warning', 'Please wait...');
        this.http.deleteRequest(this.api.deleteBirthID + id).subscribe(
            res => {
                this.getBirthDetails();
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

    back_main() {
        this.router.navigate(['/master/port/master']);
    }
}
