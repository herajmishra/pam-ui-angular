import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../service/common.service';
import { HttpService } from '../../service/http.service';
import { ApiUrlService } from '../../service/api-url.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-field-show',
  templateUrl: './field-show.component.html',
  styleUrls: ['./field-show.component.scss']
})
export class FieldShowComponent implements OnInit {

  action: string;
  fields: any = [];
  fieldsValue: any = [];
  vessel: any;
  property: any;
  printObj: any;
  constructor(
    public commonService: CommonService,
    private http: HttpService,
    private api: ApiUrlService,
    private _httpApi: HttpClient,
    public dialogRef: MatDialogRef<FieldShowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.action = this.data.action;
    this.fields = this.data.fields;
    this.vessel = this.data.vessel;
    delete this.vessel['status'];
  }

  close() {
    this.dialogRef.close(); 
  }

  sendEmail() {
    alert('Email');
  }

  print() {
    this.printObj = new Object();
    this.printObj = this.vessel;
    this.commonService.toastr('warning', 'Please wait...');
    const link = this.api.printVessel;
    this._httpApi.post(link, this.printObj, { responseType: 'arraybuffer' }).subscribe(
      res => {
        this.commonService.toastr('clear');
        this.generatePDFfunction(res);
      },
      err => {
        this.commonService.toastr('clear');
        if (err.status === 401 || err.status === 403) {
          this.commonService.sessionExpired();
        } else if (err.status !== 200) {
          this.commonService.toastr('error', 'Please try again...');
        }
      }
    );
  }

  removeField(e: Event, elem: string) {
    var index = this.fields.indexOf(elem);
    if (index > -1) {
      this.fields.splice(index, 1);
      this.property = elem.toLocaleLowerCase();
      if (this.property == 'length(loa)')
        this.property = 'lengthLoa';
      if (this.property == 'length(lbp)')
        this.property = 'lengthLbp';
      if (this.property == 'reduced grt')
        this.property = 'reducedGrt';

      delete this.vessel[this.property];
    }
  }

  generatePDFfunction(res) {
    var file = new Blob([res], { type: 'application/pdf' });
    var fileURL = URL.createObjectURL(file);
    var printWindow = window.open(fileURL);
    printWindow.print();
  }


}
