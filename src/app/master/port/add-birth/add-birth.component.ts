import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {PortService} from '../../../service/master/port.service';
import {CommonService} from '../../../service/common.service';
import {HttpService} from '../../../service/http.service';
import {ApiUrlService} from '../../../service/api-url.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-add-birth',
    templateUrl: './add-birth.component.html',
    styleUrls: ['./add-birth.component.scss']
})
export class AddBirthComponent implements OnInit {
    isLinear = true;
    data: any;
    bid: number;


    constructor(private router: Router, public portService: PortService, private fb: FormBuilder,
                public commonService: CommonService, private http: HttpService, private api: ApiUrlService,
                private toastrService: ToastrService) {
    }

    ngOnInit() {
        if (this.portService.action === 0) {
            this.router.navigate(['/master/port/master']);
        }
    }

    save(formData) {

        if (!this.portService.disableText) {
            this.commonService.toastr('warning', 'Please wait...');
            formData['portId'] = this.portService.portID;
            if (this.portService.berthID > 0) {
                formData['id'] = this.portService.berthID;
            }
            this.http.postRequest(this.api.saveBerth, formData).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    if (!(this.portService.berthID > 0)) {
                        this.portService.addBirth.reset();
                    }
                    this.data = res;
                    this.bid = this.data.id;
                    this.getBirthRestrictionDetails(this.bid);
                    this.portService.berthID = null;
                },
                err => {
                    this.commonService.toastr('clear');
                    if (err.status === 409) {
                        this.commonService.toastr('error', err.error.message);
                    } else if (err.status !== 201) {
                        this.commonService.toastr('error', 'Please try again');
                    }
                }
            );
        }
    }

    getBirthRestrictionDetails(id) {
        this.portService.birthRestriction.reset();
        this.http.getRequest(this.api.getBerthRestriction + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                this.portService.birthRestriction.patchValue(res);
                this.portService.berthRestrictionID = this.data.id;
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    restrictionSave(formData) {

        if (!this.portService.disableText) {
            this.portService.disableText = false;
            this.commonService.toastr('warning', 'Please wait...');
            formData['berthId'] = this.bid;
            if (this.portService.berthRestrictionID > 0) {
                formData['id'] = this.portService.berthRestrictionID;
            }
            this.http.postRequest(this.api.saveBerthRestriction, formData).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.router.navigate(['master/port/birth']);
                },
                err => {
                    this.commonService.toastr('clear');
                    if (err.status !== 201) {
                        this.commonService.toastr('error', 'Please try again');
                    }
                }
            );
        }
    }

    back() {
        this.router.navigate(['master/port/birth']);
    }
}
