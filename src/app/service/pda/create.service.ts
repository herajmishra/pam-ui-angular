import {Injectable} from '@angular/core';
import {CommonService} from '../common.service';
import {HttpService} from '../http.service';
import {ApiUrlService} from '../api-url.service';
import {Router} from '@angular/router';
import {AuthService} from '../../helper/auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CreateService {
    data: any;
    action = 0;
    pdaID = 0;
    mode = '';
    viewDisable = false;
    portId: number;
    savePDADTO: any;
    submit = false;
    generatePDF = false;
    fetchTariff = false;
    save = true;

    // Payload Object
    pdaType = {};
    currency = {};
    nextPort = {};
    previousPort = {};
    loadCargo = {};
    dischargeCargo = {};
    loadPort = {};
    dischargePort = {};
    uom = {};
    berth = {};
    operation = {};
    cargo = {};
    durationUom = {};
    bankName = {};
    pdaStatus = {};
    balance = {};
    vesselTrade = {};
    token = this.authService.token;

    sendForApproval = false;
    approved = false;
    ammend = false;
    sendToCustomer = false;
    currentPdaStatus = '';
    pdaStatusBasedEnableDisable = true;
    pdaStatusView = true;
    acceptRejectPdaStatus = false;

    subjectObj = new Subject<any>();

    statusCode = [
        {id: 0, name: 'ACC', 'ACC': 'ACCEPTED'},
        {id: 1, name: 'AMD', 'AMD': 'AMENDED'},
        {id: 2, name: 'APRPE', 'APRPE': 'APPROVAL PENDING'},
        {id: 3, name: 'APVD', 'APVD': 'APPROVED'},
        {id: 4, name: 'CL', 'CL': 'CLOSED'},
        {id: 5, name: 'DFT', 'DFT': 'DRAFT'},
        {id: 6, name: 'NEEDA', 'NEEDA': 'NEEDS AMMENDMENT'},
        {id: 7, name: 'REJ', 'REJ': 'REJECTED'},
        {id: 8, name: 'SUBM', 'SUBM': 'SUBMITTED'},
        {id: 9, name: 'DRAFT', 'DRAFT': 'DRAFT'}
    ];

    constructor(private commonService: CommonService,
                private http: HttpService,
                private _httpApi: HttpClient,
                private api: ApiUrlService,
                private router: Router,
                private authService: AuthService) {
    }

    createObservable() {
        return this.subjectObj.asObservable();
    }


    getPayloadDetails(token) {
        this.getDetails(token);
    }

    getDetails(token) {
        this.commonService.toastr('warning', 'Please wait...');
        var tokenStr = localStorage.getItem('token');
        const headers = new HttpHeaders({'token': tokenStr});
        this.http.getRequestWithHeaders(this.api.getPDApayload, headers).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                this.pdaType = (this.data.pdaType !== null) ? this.data.pdaType : {};
                this.currency = (this.data.currency !== null) ? this.data.currency : {};
                this.nextPort = (this.data.nextPort !== undefined) ? this.data.nextPort : {};
                this.previousPort = (this.data.previousPort !== null) ? this.data.previousPort : {};
                this.loadCargo = (this.data.loadCargo !== null) ? this.data.loadCargo : {};
                this.dischargeCargo = (this.data.dischargeCargo !== null) ? this.data.dischargeCargo : {};
                this.loadPort = (this.data.loadPort !== undefined) ? this.data.loadPort : {};
                this.dischargePort = (this.data.dischargePort !== undefined) ? this.data.dischargePort : {};
                this.uom = (this.data.uom !== null) ? this.data.uom : {};
                this.berth = (this.data.berth !== undefined) ? this.data.berth : {};
                this.operation = (this.data.operation !== null) ? this.data.operation : {};
                this.cargo = (this.data.cargo !== null) ? this.data.cargo : {};
                this.durationUom = (this.data.durationUom !== undefined) ? this.data.durationUom : {};
                this.bankName = (this.data.bank !== null) ? this.data.bank : {};
                this.pdaStatus = (this.data.pdaStatus !== null) ? this.data.pdaStatus : {};
                this.balance = (this.data.balance !== undefined) ? this.data.balance : {};
                this.vesselTrade = (this.data.vesselTrade !== undefined) ? this.data.vesselTrade : {};
            },
            err => {
                this.commonService.toastr('clear', );
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    checkPDA() {
        if (localStorage.getItem('pdaID') !== null) {
            this.pdaID = Number(atob(localStorage.getItem('pdaID')));
        } else {
            this.router.navigate(['pda/list']);
        }
    }

    generatePDFfunction(url) {
        this.downloadPDF(url).subscribe(
            (res) => {
                this.commonService.toastr('clear');
                const fileURL = URL.createObjectURL(res);
                window.open(fileURL);
            }
        );
    }

    downloadPDF(url): any {
        return this._httpApi.get(url, {responseType: 'blob' as 'json'}).pipe(
            map(res => {
                const data: any = res;
                return new Blob([data], {type: 'application/pdf'});
            })
        );
    }
}
