import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {HttpService} from '../../../service/http.service';
import {ApiUrlService} from '../../../service/api-url.service';
import {PortService} from '../../../service/master/port.service';

@Component({
    selector: 'app-add-port',
    templateUrl: './add-port.component.html',
    styleUrls: ['./add-port.component.scss']
})
export class AddPortComponent implements OnInit {
    isLinear = true;
    pid = 0;
    data: any;
    pilotData: any;
    selectedOption = 'ACTIVE';

    constructor(private router: Router, private fb: FormBuilder,
                public commonService: CommonService, private http: HttpService, private api: ApiUrlService,
                public portService: PortService) {
    }

    ngOnInit() {
        if (this.portService.portAction === 0) {
            this.router.navigate(['master/port/master']);
        }
        if (this.portService.form.value.status == null) {
          this.setSelectedOption();
        }
    }
    setSelectedOption() {
      return this.portService.form.controls['status'].setValue(this.selectedOption, {onlySelf: true});
    }
    arrow() {
        this.portService.arrowAction = 1;
    }

    savePort(formData) {
        let msg = 'added';
        formData['countryId'] = 1;
        if (this.portService.portID > 0) {
            msg = 'updated';
            formData['id'] = this.portService.portID;
        }
        if (!this.portService.disableText) {
            this.commonService.toastr('warning', 'Please wait...');
            this.http.postRequest(this.api.savePort, formData).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.commonService.toastr('success', 'Successfully port details ' + msg);
                    setTimeout(() => {
                        this.commonService.toastr('clear');
                    }, 3000);
                    this.data = res;
                    this.pid = this.data.id;
                    this.portService.portID = this.data.id;
                    this.getBirthRestrictionDetails(this.pid);
                    this.getPilotDetails(this.portService.portID);
                    this.setSelectedOption();
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
        this.http.getRequest(this.api.getFindByPilotID + id).subscribe(
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

    getPilotDetails(id) {
        this.portService.secondFormGroup.reset();
        this.commonService.toastr('warning', 'Please wait...');
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

    restrictionSave(formData) {
        formData['portId'] = this.portService.portID;
        formData['id'] = this.portService.berthRestrictionID;
        let msg = '';
        if (this.portService.pilotID > 0) {
            msg = 'updated';
            // formData['id'] = this.portService.pilotID;
        } else {
            msg = 'added';
        }
        if (!this.portService.disableText) {
            this.commonService.toastr('warning', 'Please wait...');
            this.http.postRequest(this.api.savePilot, formData).subscribe(
                res => {
                    this.commonService.toastr('clear');
                    this.commonService.toastr('success', 'Successfully pilot details ' + msg);
                    setTimeout(() => {
                        this.commonService.toastr('clear');
                    }, 3000);
                    this.router.navigate(['master/port/master']);
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
        this.router.navigate(['master/port/master']);
        this.setSelectedOption();
    }
}
