import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TariffCalculationService {
    roe: any;
    qty: any;
    rate: any;
    amount: any;
    gstPer: any;
    gstAmnt: any;
    totalAmount: any;

    constructor() {
    }

    rateCalculation(qty = null, rate = null) {
        this.amount = Number(qty) * Number(rate);
        return this.amount.toFixed(2);
    }

    gstAmountCalculation(amount, gst) {
        this.gstAmnt = Number(Number(amount) * Number(gst)) / 100;
        return this.gstAmnt.toFixed(2);
    }

    getTotalAmount(amount, gstAmount) {
        this.totalAmount = Number(amount) + Number(gstAmount);
        return this.totalAmount.toFixed(2);
    }
}
