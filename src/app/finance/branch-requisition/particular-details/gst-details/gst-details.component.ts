import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ParticularDetailsComponent} from '../particular-details.component';
import {DialogData} from '../../../../pda/create/remark-modal/remark-modal.component';

@Component({
    selector: 'app-gst-details',
    templateUrl: './gst-details.component.html',
    styleUrls: ['./gst-details.component.scss']
})
export class GstDetailsComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<ParticularDetailsComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit() {
        console.log(this.data);
    }

}
