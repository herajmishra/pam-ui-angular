import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {CommonService} from '../../service/common.service';
import {HttpService} from '../../service/http.service';
import {ApiUrlService} from '../../service/api-url.service';
import {PortService} from '../../service/master/port.service';
import {TarrifService} from '../../service/pda/tarrif.service';

@Component({
    selector: 'app-port',
    templateUrl: './port.component.html',
    styleUrls: ['./port.component.scss']
})
export class PortComponent implements OnInit {
    data: any;
    pilotData: any;
    arrowAction = 0;
    arrPortDetails = [];

    displayedColumns: string[] = ['desc', 'iso', 'add_birth', 'status', 'action'];
    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private router: Router, private fb: FormBuilder,
                public commonService: CommonService, private http: HttpService, private api: ApiUrlService,
                private portService: PortService, private tarrifService: TarrifService) {
        localStorage.removeItem('portId');
        localStorage.removeItem('portName');
    }

    ngOnInit() {
        this.getPortDetails();
    }

    back() {
        this.paginationLoad();
    }

    add() {
        this.portService.btnText = 'Save';
        this.portService.form.reset();
        this.portService.secondFormGroup.reset();
        this.portService.portID = 0;
        this.portService.pilotID = 0;
        this.portService.postalCode = '';
        this.portService.portAction = 1;
        this.portService.disableText = false;
        this.portService.arrowAction = 1;
        this.router.navigate(['/master/port/add']);
    }

    getPortDetails() {
        this.arrPortDetails = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getPortList).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.data[i]['srno'] = i + 1;
                    this.arrPortDetails.push(this.data[i]);
                }
                this.portService.PortDetails = this.arrPortDetails;
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
            this.dataSource = new MatTableDataSource(this.arrPortDetails);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    update(id) {
        this.portService.disableText = false;
        this.portService.form.reset();
        this.portService.secondFormGroup.reset();
        this.portService.btnText = 'Update';
        this.portService.portID = id;
        this.portService.arrowAction = 1;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByPortID + id).subscribe(
            res => {
                this.getPilotDetails(id);
                this.data = res;
                this.portService.postalCode = this.data.isoPortCode;
                this.portService.form.patchValue(res);
                this.portService.portAction = 1;
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }
    getPilotDetails(id) {
        this.http.getRequest(this.api.getFindByPilotID + id).subscribe(
            res => {
                this.pilotData = res;
                this.commonService.toastr('clear');
                this.portService.secondFormGroup.patchValue(res);
                this.portService.pilotID = this.pilotData.id;
                this.router.navigate(['master/port/add']);
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
        this.portService.disableText = true;
        this.portService.form.reset();
        this.portService.secondFormGroup.reset();
        this.portService.btnText = '';
        this.portService.arrowAction = 1;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByPortID + id).subscribe(
            res => {
                this.viewPilotDetails(id);
                this.portService.form.patchValue(res);
                this.portService.portAction = 1;
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    viewPilotDetails(id) {
        this.http.getRequest(this.api.getFindByPilotID + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.portService.secondFormGroup.patchValue(res);
                this.router.navigate(['master/port/add']);
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    addBirth(id, postalCode) {
        this.portService.portID = id;
        this.portService.action = 1;
        this.portService.postalCode = postalCode;
        this.router.navigate(['/master/port/birth']);
    }

    addTarrif(id, description) {
        this.tarrifService.portId = id;
        localStorage.setItem('portId', btoa(id));
        localStorage.setItem('portName', btoa(description));
        this.router.navigate(['/pda/tarif-info']);
    }

    delete(id) {
        if (!confirm('Are you sure you want to delete!!!')) {
            return false;
        }
        this.commonService.toastr('warning', 'Please wait...');
        this.http.deleteRequest(this.api.deletePort + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.getPortDetails();
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 401 || err.status === 403) {
                    this.commonService.sessionExpired();
                } else if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }
}
