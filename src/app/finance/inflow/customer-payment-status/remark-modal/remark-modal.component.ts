import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CustomerPaymentStatusComponent} from '../customer-payment-status.component';
import {DialogData} from '../../../../pda/create/remark-modal/remark-modal.component';

@Component({
    selector: 'app-remark-modal',
    templateUrl: './remark-modal.component.html',
    styleUrls: ['./remark-modal.component.scss']
})
export class RemarkModalComponent implements OnInit {
    remarks = '';
    isApproved: any;

    constructor(public dialogRef: MatDialogRef<CustomerPaymentStatusComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit() {
        const data: any = this.data;
        this.isApproved = data.isApproved;
        this.remarks = data.remarks;
    }

    save() {
        this.dialogRef.close(this.remarks);
    }

}
