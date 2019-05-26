import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LoginComponent} from '../login.component';
import {HttpService} from '../../service/http.service';
import {AuthService} from '../../helper/auth.service';
import {ToastrService} from 'ngx-toastr';
import {ApiUrlService} from '../../service/api-url.service';

@Component({
    selector: 'app-continue-login',
    templateUrl: './continue-login.component.html',
    styleUrls: ['./continue-login.component.scss']
})
export class ContinueLoginComponent implements OnInit {
    result: boolean;

    constructor(public dialogRef: MatDialogRef<LoginComponent>,
                @Inject(MAT_DIALOG_DATA) public data, private api: ApiUrlService,
                private http: HttpService, private authService: AuthService, private toastrService: ToastrService) {
    }

    ngOnInit() {
    }

    cancel() {
        this.result = false;
        this.dialogRef.close(this.result);
    }

    continue() {
        this.toastrService.warning('Please wait...');
        this.http.postRequest(this.api.continueLogin, {token: this.authService.token}).subscribe(
            res => {
                this.toastrService.clear();
                this.dialogRef.close(res);
            },
            err => {
                if (err.status !== 200) {
                    this.toastrService.error('You are not logged in, Please try again');
                }
            }
        );
    }

}
