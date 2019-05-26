import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CreateComponent} from '../create.component';

export interface DialogData {
    arrayValue: any;
    name: string;
}

@Component({
    selector: 'app-grt-nrt-pda-service-modal',
    templateUrl: './grt-nrt-pda-service-modal.component.html',
    styleUrls: ['./grt-nrt-pda-service-modal.component.scss']
})
export class GrtNrtPdaServiceModalComponent implements OnInit {

    displayedColumns: string[] = ['service'];
    dataSource = this.data.arrayValue;

    constructor(public dialogRef: MatDialogRef<CreateComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit() {
        // console.log(this.data.arrayValue);
    }

    yes() {
        this.dialogRef.close(true);
    }

    no() {
        this.dialogRef.close(false);
    }
}
