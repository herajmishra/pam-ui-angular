import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {DatePipe} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    public mainComponent = (window.location.pathname.split( '/' )[1]) ? window.location.pathname.split( '/' )[1] : '';
    public subComponent = (window.location.pathname.split( '/' )[2]) ? window.location.pathname.split( '/' )[2] : '';
    public nestedSubComponent = (window.location.pathname.split( '/' )[3]) ? window.location.pathname.split( '/' )[3] : '';


    // Validation Message
    public required = 'This field is ';
    public emailValid = 'Please enter the valid email';
    public numericValue = 'Please enter only numeric value';
    public latformat = 'Please enter proper value';
    public panNumber = 'Please enter valid pan number';
    public tanNumber = 'Please enter valid tan number';
    public gstNumber = 'Please enter valid gst number';
    public alphabet = 'Please enter only alphabets';

    // Status Array
    status: any[] = [
        {value: 'active', name: 'Active'},
        {value: 'inactive', name: 'Inactive'}
      ];

    public loggedOrgName = '';


    constructor(private toastrService: ToastrService, private datePipe: DatePipe) {
    }

    sessionExpired() {

    }

    toastr(type, msg = null, title = null) {
        setTimeout(() => {
            if (type === 'error') {
                this.toastrService.error(msg, title);
            } else if (type === 'success') {
                this.toastrService.success(msg, title);
            } else if (type === 'warning') {
                this.toastrService.warning(msg, title);
            } else if (type === 'info') {
                this.toastrService.info(msg, title);
            } else {
                this.toastrService.clear();
            }
        });
    }

    dateFormat(d) {
        return this.datePipe.transform(d, 'yyyy-MM-dd');
    }

    onlyNumber(evt) {
        evt = (evt) ? evt : window.event;
        const charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    onlyDecimalNumber(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    getDate(date) {
        return new Date(date).getDate();
    }

    getMonth(date) {
        return new Date(date).getMonth();
    }

    getYear(date) {
        return new Date(date).getFullYear();
    }
}
