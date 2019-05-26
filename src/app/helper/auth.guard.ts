import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {CommonService} from '../service/common.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private commonService: CommonService) {
    }

    canActivate(): boolean {
        if (this.authService.loggedIn()) {
            this.getOrganization();
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }

    getOrganization() {
        const org = JSON.parse(localStorage.getItem('org'));
        const id = JSON.parse(localStorage.getItem('selectOrg'));
        if (org !== null) {
            for (const item of org) {
                if (item.id == id) {
                    this.commonService.loggedOrgName = item.name;
                }
            }
        }
    }

}
