import {Injectable} from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import {Country} from '../../master/vessel/vessel.component';
import {HttpService} from '../http.service';
import {ApiUrlService} from '../api-url.service';
import {CommonService} from '../common.service';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    public action = 0;
    public GCompanyDetails: any;
    public cmpID: number;
    public cmpName = '';
    public orgID: number;
    public orgName: string;
    public disableDrpDwn = false;
    public disableText = false;


    countryName = '';

    constructor() {
    }
}
