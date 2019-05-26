import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VendorService {
    public action = 0;
    public GVendorDetails: any;
    public venID: number;
    public venName = '';
    public disableText = false;
    public arrServiceDetails = [];

    constructor() {
    }
}
