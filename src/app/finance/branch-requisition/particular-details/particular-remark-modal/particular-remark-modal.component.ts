import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogData} from '../../../../pda/create/remark-modal/remark-modal.component';
import {ParticularDetailsComponent} from '../particular-details.component';

@Component({
    selector: 'app-particular-remark-modal',
    templateUrl: './particular-remark-modal.component.html',
    styleUrls: ['./particular-remark-modal.component.scss']
})
export class ParticularRemarkModalComponent implements OnInit {
    remarks = '';

    constructor(public dialogRef: MatDialogRef<ParticularDetailsComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit() {
        const data: any = this.data;
        this.remarks = data.remark;
    }

    save() {
        this.dialogRef.close(this.remarks);
    }
}
