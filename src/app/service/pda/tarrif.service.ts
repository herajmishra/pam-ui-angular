import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CommonService} from '../common.service';

@Injectable({
    providedIn: 'root'
})
export class TarrifService {
    portId = 0;
    portName = '';
    headerId = 0;
    tarrifHeaderDetails: any;
    foreignMinDate = [];
    coastalMinDate = [];


    calculationType = [{code: 'LS', value: 'LS'}, {code: 'FLAT', value: 'FLAT'}, {code: 'SINGLE_BAND', value: 'SINGLE_BAND'},
                        {code: 'DOUBLE_BAND', value: 'DOUBLE_BAND'}];

    public chargeBasis = [
        {code: 'LS', value: 'LS'},
        {code: 'FLAT', value: 'WEIGHT'},
        {code: 'FLAT', value: 'TIME'},
        {code: 'SINGLE_BAND', value: 'WEIGHT'},
        {code: 'SINGLE_BAND', value: 'TIME'},
        {code: 'DOUBLE_BAND', value: 'WEIGHT~TIME'}
    ];
    UOM = [
        {code: 'LS', value: 'FIXED', type: 'LS'},

        {code: 'FLAT', value: 'NRT', type: 'WEIGHT'},
        {code: 'FLAT', value: 'GRT', type: 'WEIGHT'},
        {code: 'FLAT', value: 'RGRT', type: 'WEIGHT'},
        {code: 'FLAT', value: 'HOUR', type: 'TIME'},
        {code: 'FLAT', value: 'DAY', type: 'TIME'},

        {code: 'SINGLE_BAND', value: 'NRT', type: 'WEIGHT'},
        {code: 'SINGLE_BAND', value: 'GRT', type: 'WEIGHT'},
        {code: 'SINGLE_BAND', value: 'RGRT', type: 'WEIGHT'},
        {code: 'SINGLE_BAND', value: 'HOUR', type: 'TIME'},
        {code: 'SINGLE_BAND', value: 'DAY', type: 'TIME'},

        {code: 'DOUBLE_BAND', value: 'NRT~HOUR', type: 'WEIGHT~TIME'},
        {code: 'DOUBLE_BAND', value: 'NRT~DAY', type: 'WEIGHT~TIME'},
        {code: 'DOUBLE_BAND', value: 'GRT~HOUR', type: 'WEIGHT~TIME'},
        {code: 'DOUBLE_BAND', value: 'GRT~DAY', type: 'WEIGHT~TIME'},
        {code: 'DOUBLE_BAND', value: 'RGRT~HOUR', type: 'WEIGHT~TIME'},
        {code: 'DOUBLE_BAND', value: 'RGRT~DAY', type: 'WEIGHT~TIME'}
    ];

    constructor(private router: Router, private commonService: CommonService) {
    }

    checkTarrif() {
        if (localStorage.getItem('portId') !== null) {
            this.portId = Number(atob(localStorage.getItem('portId')));
            this.portName = atob(localStorage.getItem('portName'));
        } else {
            this.router.navigate(['master/port/master']);
        }
    }

    checkTarrifHeader() {
        if (localStorage.getItem('actionId') !== null) {
            this.headerId = Number(atob(localStorage.getItem('actionId')));
        } else {
            this.router.navigate(['pda/tarif-info']);
        }
    }

    minDateSet(val, obj, index, lastindex, tab) {
        const setIndex = lastindex - 1;
        if (obj[index].currency === val) {
            const getDate = this.commonService.getDate(obj[index].date.end);
            const getMonth = this.commonService.getMonth(obj[index].date.end);
            const getYear = this.commonService.getYear(obj[index].date.end);
            if (tab > 0) {
                this.foreignMinDate[setIndex] = new Date(getYear, getMonth, getDate + 1);
            } else {
                this.coastalMinDate[setIndex] = new Date(getYear, getMonth, getDate + 1);
            }
        }
    }

    setMinDate(val, tab, obj) {
        if (obj.length === 1) {
            if (tab > 0) {
                this.foreignMinDate.push(new Date(1970, 1, 1));
            } else {
                this.coastalMinDate.push(new Date(1970, 1, 1));
            }
        } else {
            const arr = [];
            for (let i = 0; i < obj.length - 1; i++) {
                if (obj[i].currency === val) {
                    arr.push(obj[i]);
                }
            }
            if (arr.length > 0) {
                for (let j = 0; j < arr.length; j++) {
                    this.minDateSet(val, arr, j, obj.length, tab);
                }
            } else {
                const setIndex = obj.length - 1;
                if (tab > 0) {
                    this.foreignMinDate[setIndex] = new Date(1970, 1, 1);
                }
            }
        }
    }
}
