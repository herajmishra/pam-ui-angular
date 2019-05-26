import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VesselService {
    public action = 0;
    public GCompanyDetails: any;
    public cmpID: number;
    public cmpName = '';
    public orgID: number;
    public disableDrpDwn = false;
    public disableText = false;
    public countryName = '';
    constructor() {
    }
}
