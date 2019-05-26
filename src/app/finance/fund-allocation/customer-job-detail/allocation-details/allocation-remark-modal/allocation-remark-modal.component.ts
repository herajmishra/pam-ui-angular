import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AllocationDetailsComponent} from '../allocation-details.component';


@Component({
    selector: 'app-allocation-remark-modal',
    templateUrl: './allocation-remark-modal.component.html',
    styleUrls: ['./allocation-remark-modal.component.scss']
})
export class AllocationRemarkModalComponent implements OnInit {
    isApproved = false;
    remarks = '';

    constructor(public dialogRef: MatDialogRef<AllocationDetailsComponent>,
                @Inject(MAT_DIALOG_DATA) public data) {
    }

    ngOnInit() {
        this.remarks = this.data.remark;
    }

    save() {
        this.dialogRef.close(this.remarks);
    }

}
