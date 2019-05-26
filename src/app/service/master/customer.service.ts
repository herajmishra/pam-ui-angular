import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
    public action = 0;
    public GCustDetails: any;
    public custID: number;
    public custName = '';
    public disableText = false;
    public arrServiceDetails = [];
    constructor() {}

}
