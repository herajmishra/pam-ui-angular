import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../../../service/common.service';
import {MatTableDataSource} from '@angular/material';

@Component({
    selector: 'app-bill-details',
    templateUrl: './bill-details.component.html',
    styleUrls: ['./bill-details.component.scss']
})
export class BillDetailsComponent implements OnInit {
    displayedColumns: string[] = ['position', 'name', 'weight', 'date', 'action'];
    dataSource: MatTableDataSource<any>;
    arrFiles = [];

    constructor(private commonService: CommonService) {
    }

    ngOnInit() {
    }

    fileEvent(e) {
        let arr = [];
        for (const i of e.target.files) {
            const fileName = i.name.split('.');
            if (fileName[1] === 'png' || fileName[1] === 'jpg' || fileName[1] === 'jpeg' || fileName[1] === 'pdf') {
                arr.push(e);
            } else {
                arr = [];
                this.commonService.toastr('error', 'Allow only extention is png, jpg, jpeg, pdf');
                return false;
            }
        }
        for (let i = 0; i < arr.length; i++) {
            const obj = {
                position: 1,
                name: 'Test',
                weight: 123,
                date: new Date(),
                file: arr[i]
            };
            this.arrFiles.push(obj);
            this.paginationLoad();
        }
        console.log(this.dataSource);
        // const uploadFile = this.inflowService.uploadFile($event.target);
        // const update = this.updateFormValue();
        // const cnt = update.controls[i] as FormGroup;
        // cnt.controls['file'].setValue(uploadFile);
    }

    paginationLoad() {
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.arrFiles);
        });
    }

}
