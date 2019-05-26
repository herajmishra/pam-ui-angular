import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {CommonService} from '../common.service';
import {ApiUrlService} from '../api-url.service';
import {HttpService} from '../http.service';

@Injectable({
    providedIn: 'root'
})
export class InflowService {
    customerDetails: any;
    customerJobDetails: any;
    bankreferenceList: any;
    customerNo: number;
    bankReferenceStatus = false;

    objBranchRequisitionJobList: any;

    subjectObj = new Subject<any>();
    customerObj = new Subject<any>();
    branchJobListObj = new Subject<any>();
    branchServiceListObj = new Subject<any>();

    createObservable() {
        return this.subjectObj.asObservable();
    }

    customerObservable() {
        return this.customerObj.asObservable();
    }

    branchServiceObservable() {
        return this.branchServiceListObj.asObservable();
    }

    constructor(private commonService: CommonService, private api: ApiUrlService,
                private http: HttpService) {
    }

    branchJobListObservable() {
        return this.branchJobListObj.asObservable();
    }

    getBankReferenceList(customerId) {
        this.bankreferenceList = [];
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getBankReferenceList + customerId).subscribe(
            res => {
                this.commonService.toastr('clear');
                const data: any = res;
                this.bankreferenceList = data;
                this.bankReferenceStatus = true;
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

    // uploadFile(inputValue) {
    //     const arr = [];
    //     for (let i = 0; i < inputValue.files.length; i++) {
    //         arr.push(inputValue.files[i]);
    //     }
    //     return arr;
    // }
}
