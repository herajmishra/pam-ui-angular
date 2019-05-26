import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CommonService} from '../../service/common.service';
import {ApiUrlService} from '../../service/api-url.service';
import {HttpService} from '../../service/http.service';
import {CreateService} from '../../service/pda/create.service';
import {InflowService} from '../../service/finance/inflow.service';

export interface Bank {
    id: number;
    bank: string;
}
@Component({
    selector: 'app-inflow',
    templateUrl: './inflow.component.html',
    styleUrls: ['./inflow.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class InflowComponent implements OnInit {
    dataSource = [];
    columnsToDisplay = ['customerCode', 'customerName', 'country'];
    expandedElement: null;
    custId = 0;
    getSuspenseData = false;
    selectTR = 0;

    constructor(public commonService: CommonService, private api: ApiUrlService,
                private http: HttpService, private createService: CreateService,
                private inflowService: InflowService) {
        this.createService.getPayloadDetails(localStorage.getItem('token'));
    }



    ngOnInit() {
        this.getCustomerDetails();
        this.getSuspenseData = true;
    }

    // End Bank

    getCustomerDetails() {
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getInflowCustomerList).subscribe(
            res => {
                this.commonService.toastr('clear');
                const data: any = res;
                this.dataSource = data;
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

    open(obj) {
        this.custId = (obj !== null) ? obj.id : 0;
        this.selectTR = (obj !== null) ? obj.id : 0;
        this.inflowService.customerDetails = (obj !== null) ? obj : null;
    }

    updateChildData(e) {
        this.custId = 0;
        this.getCustomerDetails();
    }
}
