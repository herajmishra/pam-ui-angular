import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {CustomValidator} from '../../shared/custom-validation';
import {CommonService} from '../../service/common.service';

@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['./commodity.component.scss']
})
export class CommodityComponent implements OnInit {

  form: FormGroup;
  addForm = true;
  displayedColumns: string[] = ['id', 'name', 'action'];
    dataSource: MatTableDataSource<any>;
    users = [
        {id: 1, name: 'Harish', progress: '11'},
        {id: 1, name: 'Harish', progress: '10'},
        {id: 1, name: 'Harish', progress: '12'},
        {id: 3, name: 'Dhawal', progress: '10'},
        {id: 1, name: 'Suraj', progress: '60'},
        {id: 4, name: 'Harish', progress: '50'},
        {id: 5, name: 'Harish', progress: '52'}
    ];

  @ViewChild(MatPaginator) paginator: MatPaginator;  
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fb: FormBuilder,public commonService: CommonService) { }

  ngOnInit() {
    //this.getCompanyDetails();

        this.form = this.fb.group({
            name: ['', [Validators.required]],
            comtyp: ['', [Validators.required]],
            status: ['active']
            //code: ['', [Validators.required, CustomValidator.numberValidator]],
            //commIsoCode: ['', [Validators.required]]
        });
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.users);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
}

  add(){
    this.addForm = false;
  }

}
