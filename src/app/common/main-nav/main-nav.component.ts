import {Component} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CommonService} from '../../service/common.service';
import {Router} from '@angular/router';
import {HttpService} from '../../service/http.service';
import {ApiUrlService} from '../../service/api-url.service';
import {AuthService} from '../../helper/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent {
    data: any;
    openCollabs = '';
    subOpenCollabs = '';
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches)
        );

    constructor(private breakpointObserver: BreakpointObserver, public commonService: CommonService,
                private router: Router, private http: HttpService, private api: ApiUrlService,
                private authService: AuthService, private toastr: ToastrService) {
    }

    logout() {
        this.http.postRequest(this.api.logout, {token: this.authService.token}).subscribe(
            res => {
                this.data = res;
                if (this.data.status === 1) {
                    this.toastr.clear();
                    localStorage.clear();
                    this.router.navigate(['/login']);
                } else {
                    this.toastr.error('Please try again');
                }
            },
            err => {
                if (err.status !== 200) {
                    this.toastr.error('Please try again');
                }
            }
        );
        // localStorage.clear();
        // this.router.navigate(['/']);
    }

    changeName(sub, main) {
        this.commonService.mainComponent = main;
        this.commonService.subComponent = sub;
        // alert(main)
    }

    openGroup(val) {
        this.openCollabs = val;
    }

    setSubCollabs(val) {
        this.subOpenCollabs = val;
    }

}
