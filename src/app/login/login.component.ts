import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../service/http.service';
import {ApiUrlService} from '../service/api-url.service';
import {MatDialog} from '@angular/material';
import {LoginModalComponent} from './login-modal/login-modal.component';
import {Router} from '@angular/router';
import {LoginService} from '../service/login.service';
import {CommonService} from '../service/common.service';
import {ContinueLoginComponent} from './continue-login/continue-login.component';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../helper/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [LoginService]
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    hide = true;
    data: any;
    errorMsg = '';

    constructor(private http: HttpService, private api: ApiUrlService, public dialog: MatDialog, private router: Router,
        private loginService: LoginService, private fb: FormBuilder, public commonService: CommonService,
        private toastr: ToastrService, private authService: AuthService) {
        this.loginService.checkLogin();
    }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(20)
            ]]
        });
    }

    login(formData) {
        // UserName
        const emailValidate = this.emailValidate(formData.email);
        const alphaNumeric = this.alphaNumeric(formData.email);

        if (!alphaNumeric && !emailValidate) {
            this.errorMsg = 'Please enter valid user name';
            return false;
        }
        // Password
        const hasLowerCase = this.hasLowerCase(formData.password);
        const hasUpperCase = this.hasUpperCase(formData.password);
        const hasNumberCase = this.hasNumberCase(formData.password);
        const hasSpecialCase = this.hasSpecialCase(formData.password);
        const hasSpaceCase = this.hasSpaceCase(formData.password);

        if (hasLowerCase === false || hasUpperCase === false || hasNumberCase === false || hasSpaceCase === false) {
            this.errorMsg = 'Invalid Password';
            return false;
        } else {
            this.errorMsg = '';
        }
        const login = {
            username: formData.email.trim(),
            password: formData.password
        }
        this.toastr.warning('Please wait...');
        this.http.postRequest(this.api.login, login).subscribe(
            res => {
                this.toastr.clear();
                this.data = res;
                if ((this.data.organizations === undefined || this.data.organizations.length === 0) && this.data.status === 1) {
                    localStorage.setItem('token', this.data.token);
                    localStorage.setItem('link', 'dashboard');
                    this.router.navigate(['/dashboard']);
                } else if (this.data.organizations === undefined && this.data.status === 0) {
                    this.authService.token = this.data.token;
                    this.openContinueDialog();
                } else if (this.data.organizations === undefined && this.data.status === 2) {
                    this.authService.token = this.data.token;
                    this.openContinueDialog();
                } else if (this.data.organizations.length > 0 && this.data.status === 1) {
                    this.authService.token = this.data.token;
                    this.openDialog(res);
                }
            },
            err => {
                this.toastr.clear();
                if (err.status !== 200) {
                    this.form['controls']['password'].patchValue('');
                    this.errorMsg = 'Invalid username and password';
                }
            }
        );
    }

    openContinueDialog() {
        const dialogRef = this.dialog.open(ContinueLoginComponent, {
            width: '400px',
            panelClass: 'modalPopupClass'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                if (result.status === 1) {
                    localStorage.setItem('cid', btoa(result.companyId));
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('link', 'dashboard');
                    this.router.navigate(['/dashboard']);
                }
            }
        });
    }

    openDialog(res) {
        localStorage.setItem('org', JSON.stringify(res.organizations));
        const dialogRef = this.dialog.open(LoginModalComponent, {
            width: '250px',
            panelClass: 'modalPopupClass',
            data: {org: res.organizations}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                if (result.status === 0) {
                    this.openContinueDialog();
                } else {
                    localStorage.setItem('cid', btoa(result.companyId));
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('link', 'dashboard');
                    this.router.navigate(['/dashboard']);
                }
            }
        });
    }

    hasLowerCase(str) {
        return (/[a-z]/.test(str));
    }
    hasUpperCase(str) {
        return (/[A-Z]/.test(str));
    }
    hasNumberCase(str) {
        return (/[0-9]/.test(str));
    }
    hasSpecialCase(str) {
        return (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str));
    }
    hasSpaceCase(str) {
        return (/^\S*$/.test(str));
    }

    alphaNumeric(email) {
        const check = this.hasLowerCase(email);
        if (check) {
            const numeric = this.hasNumberCase(email);
            if (numeric) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    emailValidate(email) {
        return (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email));
    }
}
