import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LoginComponent} from '../login.component';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../helper/auth.service';
import {HttpService} from '../../service/http.service';
import {ApiUrlService} from '../../service/api-url.service';

@Component({
    selector: 'app-login-modal',
    templateUrl: './login-modal.component.html',
    styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
    selectedValue: number;
    organization = [];

    constructor(public dialogRef: MatDialogRef<LoginComponent>,
                @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService, private authService: AuthService,
                private http: HttpService, private api: ApiUrlService) {
    }

    ngOnInit() {
        this.organization = this.data.org;
    }

    go() {
        if (this.selectedValue > 0) {
            localStorage.setItem('selectOrg', JSON.stringify(this.selectedValue));
            this.toastr.warning('Please wait...');
            this.http.postRequest(this.api.selectorg, {token: this.authService.token, orgId: this.selectedValue}).subscribe(
                res => {
                    this.toastr.clear();
                    this.dialogRef.close(res);
                },
                err => {
                    if (err.status !== 200) {
                        this.toastr.error('You are not logged in right now, Please try again')
                    }
                }
            );
        } else {
            this.toastr.error('Please select Organization');
        }
    }
}
