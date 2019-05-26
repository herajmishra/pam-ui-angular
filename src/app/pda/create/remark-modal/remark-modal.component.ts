import {Component, Inject, OnInit} from '@angular/core';
import {CreateComponent} from '../create.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CommonService} from '../../../service/common.service';

export interface DialogData {
    name: string;
}

@Component({
    selector: 'app-remark-modal',
    templateUrl: './remark-modal.component.html',
    styleUrls: ['./remark-modal.component.scss']
})
export class RemarkModalComponent implements OnInit {
    remark = '';

    constructor(public dialogRef: MatDialogRef<CreateComponent>,
                @Inject(MAT_DIALOG_DATA) public data: DialogData,
                private commonService: CommonService) {

    }

    ngOnInit() {
        this.remark = this.data.name;
    }

    save() {
        if (this.remark.length > 2) {
            this.dialogRef.close(this.remark);
        } else {
            this.commonService.toastr('error', 'Please enter atleast 2 character.');
        }
    }
}
