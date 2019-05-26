import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog} from '@angular/material';
import {CustomValidator} from '../../shared/custom-validation';
import {CommonService} from '../../service/common.service';
import {HttpService} from '../../service/http.service';
import {ApiUrlService} from '../../service/api-url.service';
import {VesselService} from '../../service/master/vessel.service';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import { FieldShowComponent } from '../field-show/field-show.component';
import { Vessel } from '../model/vessel';

export interface Country {
    id: number;
    name: string;
}
export interface Owner {
  id: number;
  name: string;
}

@Component({
    selector: 'app-vessel',
    templateUrl: './vessel.component.html',
    styleUrls: ['./vessel.component.scss']
})
export class VesselComponent implements OnInit {
    form: FormGroup;
    addForm = true;
    btnSubmit = '';
    data: any;
    arrDataLookup: any;
    show = false;
    vid = 0;
    arrCompanyDetails = [];
    ownerId = null;
    arrOwnerList: Owner[] = [];
    filteredOwner: Observable<Owner[]>;
    ownerCtrl = new FormControl();
    displayedColumns: string[] = ['title','name', 'imo', 'type', 'trade', 'grt', 'nrt','reducedGrt', 'flag', 'status', 'action'];
    dataSource: MatTableDataSource<any>;
    selectedOption = 'ACTIVE';

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    // Autocompleted
    groupControl = new FormControl();
    arrCountryList: Country[] = [];
    filteredOptions: Observable<Country[]>;
    key: number;

    constructor(
        private fb: FormBuilder,
        public commonService: CommonService,
        private http: HttpService,
        private api: ApiUrlService,
        private vesselService: VesselService,
        private fieldShowDialog: MatDialog) {
        this.filteredOwner = this.ownerCtrl.valueChanges
          .pipe(
            startWith<string | Owner>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filterOwner(name) : this.arrOwnerList.slice())
          );
    }



    ngOnInit() {
        this.getCountryList();
        this.getLookupDet();

        this.form = this.fb.group({
            title: ['', [Validators.required]],
            name: ['', [Validators.required]],
            imo: ['', [Validators.required, CustomValidator.numberValidator]],
            type: ['', [Validators.required]],
            grt: ['', [Validators.required, CustomValidator.numberValidator]],
            nrt: ['', [Validators.required, CustomValidator.numberValidator]],
            reducedGrt: [null, [CustomValidator.numberValidator]],
            lengthLbp: [null, [CustomValidator.meterUnitValidation]],
            lengthLoa: [null, [CustomValidator.meterUnitValidation]],
            beam: [null, [CustomValidator.meterUnitValidation]],
            // owner:[null],
            //pintu code comment for Field should be removed hide from vessel master start
            //containerOnDeck: [null, [CustomValidator.numberValidator]],
            //containerOnHold: [null, [CustomValidator.numberValidator]],
            //maxTues: [null, [CustomValidator.numberValidator]],
            //max20s: [null, [CustomValidator.numberValidator]],
            //max40s: [null, [CustomValidator.numberValidator]],
            //pintu code comment for Field should be removed hide from vessel master end
            status: ['', [Validators.required]],
            trade: ['', [Validators.required]],
            yearOfCommissioned: [null, [CustomValidator.numberValidator]],
            yearOfBuilt: [null],
        });
        this.setSelectedOption();
    }

    setSelectedOption() {
        return this.form.controls['status'].setValue(this.selectedOption, {onlySelf: true});
    }

    displayFn(user?: Country): string | undefined {
        return user ? user.name : undefined;
    }

    selectVal(e) {
        this.key = e.id;
    }

    _filter(name: string): Country[] {
        const filterValue = name.toLowerCase();
        return this.arrCountryList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    getCountryList() {
        this.arrCountryList = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getCountryList).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    this.arrCountryList.push(this.data[i]);
                }
                this.filteredOptions = this.groupControl.valueChanges
                    .pipe(
                        startWith<string | Country>(''),
                        map(value => typeof value === 'string' ? value : value.name),
                        map(name => name ? this._filter(name) : this.arrCountryList.slice())
                    );
                this.getCompanyDetails();
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 401 || err.status === 403 || err.status === 404) {
                    this.commonService.toastr('error', 'Please wait...', '');
                } else {
                    this.commonService.sessionExpired();
                }
            }
        );
    }

    getLookupDet() {
        this.arrDataLookup = [];
        this.http.getRequest(this.api.getVesselLookupList).subscribe(
          res => {
              this.data = res;
              this.arrDataLookup = this.data;
          },
          err => {
              this.commonService.toastr('error', 'Network Problem');
          }
        );

    }


    getCompanyDetails() {
        this.arrCompanyDetails = [];
        this.commonService.toastr('warning', 'Please wait...', '');
        this.http.getRequest(this.api.getVesselList).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.data = res;
                for (let i = 0; i < this.data.length; i++) {
                    for ( let j = 0; j < this.arrCountryList.length; j++) {
                            if (Number(this.data[i].flag) === this.arrCountryList[j].id) {
                                this.data[i].flag = this.arrCountryList[j].name;
                            }
                    }
                    this.arrCompanyDetails.push(this.data[i]);
                }
                this.vesselService.GCompanyDetails = this.arrCompanyDetails;
                this.paginationLoad();
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 401 || err.status === 403 || err.status === 404) {
                    this.commonService.toastr('error', 'Please wait...', '');
                } else {
                    this.commonService.sessionExpired();
                }
            }
        );
    }

    paginationLoad() {
        setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.arrCompanyDetails);
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

    add() {
        this.addForm = false;
        this.btnSubmit = 'Save';
        this.show = false;
        this.vesselService.disableText = false;
        this.vid = 0;
        this.groupControl.setValue('');
        this.ownerCtrl.setValue('');
    }

    save(formData) {
        if (!(this.key > 0)) {
            this.commonService.toastr('error', 'Please select flag');
            return false;
        }
        formData['flag'] = this.key;
        formData['ownerId'] = this.ownerId;
        let msg = 'added';
        this.commonService.toastr('warning', 'Please wait...');
        if (this.vid > 0) {
            msg = 'updated';
            formData['id'] = this.vid;
        }
        this.http.postRequest(this.api.saveVessel, formData).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.commonService.toastr('success', 'Successfully' + msg);
                this.addForm = true;
                this.form.reset();
                this.getCompanyDetails();
                this.setSelectedOption();
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status === 401 || err.status === 403) {
                    this.commonService.sessionExpired();
                } else if (err.status === 409) {
                    this.commonService.toastr('error', err.error.message);
                } else if (err.status !== 201) {
                    this.commonService.toastr('error', 'Please try again');
                }
            }
        );
    }

    back() {
        this.addForm = true;
        this.form.reset();
        this.paginationLoad();
        this.setSelectedOption();
    }

    update(id) {
        this.vid = id;
        this.addForm = false;
        this.vesselService.disableText = false;
        this.show = true;
        this.btnSubmit = 'Update';
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByVesselID + id).subscribe(
            res => {
                this.data = res;
                this.commonService.toastr('clear');
                this.form.patchValue(res);
                for (let i = 0; i < this.arrCountryList.length; i++) {
                    if (this.arrCountryList[i].id === Number(this.data.flag)) {
                        this.key = Number(this.data.flag);
                        this.groupControl.setValue( {name: this.arrCountryList[i].name});
                    }
                }
              this.ownerCtrl.setValue({name: res['ownerName'], id: res['ownerId']});
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    view(id) {
        this.form.reset();
        this.addForm = false;
        this.btnSubmit = '';
        this.show = true;
        this.vesselService.disableText = true;
        this.commonService.toastr('warning', 'Please wait...');
        this.http.getRequest(this.api.getFindByVesselID + id).subscribe(
            res => {
                this.data = res;
                this.commonService.toastr('clear');
                this.form.patchValue(res);
                for (let i = 0; i < this.arrCountryList.length; i++) {
                    if (this.arrCountryList[i].id === Number(this.data.flag)) {
                        this.key = Number(this.data.flag);
                        this.groupControl.setValue( {name: this.arrCountryList[i].name});
                    }
                }
              this.ownerCtrl.setValue({name: res['ownerName'], id: res['ownerId']});
            },
            err => {
                this.commonService.toastr('clear');
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    delete(id) {
        if (!confirm('Are you sure you want update!!!')) {
            return false;
        }
        this.commonService.toastr('warning', 'Please wait...');
        this.http.deleteRequest(this.api.deleteVesselID + id).subscribe(
            res => {
                this.commonService.toastr('clear');
                this.getCompanyDetails();
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

  /*Below Code is added by shail for -- AutoComplete in Owners Field Input*/
  private _filterOwner(value: string): Owner[] {
    const filterValue = value.toLowerCase();
    return this.arrOwnerList.filter(c => c.name.toLowerCase().indexOf(filterValue) === 0);
  }

  selectValOwner(e) {
    this.ownerId = e.id;
  }

  displayFnOwner(user?: Owner): string | undefined {
    return user ? user.name : undefined;
  }

  findOwner(val) {
    this.arrOwnerList = [];
    this.commonService.toastr('warning', 'Please wait...');
    if (val.length <= 0) {
      return;
    }
    this.http.getRequest(this.api.getFindByKeyCustomer + val).subscribe(
      res => {
        this.commonService.toastr('clear');
        this.data = res;
        const arr = [];
        for (let i = 0; i < this.data.length; i++) {
          arr.push(this.data[i]);
        }
        this.arrOwnerList = arr;
        console.log(this.arrOwnerList);
        this.filteredOwner = this.ownerCtrl.valueChanges
          .pipe(
            startWith<string | Owner>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filterOwner(name) : this.arrOwnerList.slice())
          );
      },
      err => {
        this.commonService.toastr('clear');
        if (err.status === 401 || err.status === 403) {
          this.commonService.sessionExpired();
        } else {
          this.commonService.toastr('error', 'Please try again');
        }
      }
    );

  }

    /**
     * pintu
     * @param e
     * @param action- detect wheather the action is Email or Print
     * Method is use to open FieldShowComponent using matdialog
     */
    openVesselFieldDialog(e:Event,action:string){
        var obj:any={};
        obj['action'] = action;
        obj['fields']=["Title","Name","IMO","Type","Flag","Trade","GRT","NRT","Reduced GRT","Year of Built","Year of Delivery","Length(PBL)","Length(LOA)","Beam","Owner"]
        obj['vessel']=new Vessel(this.form.value);
        const dialogRef = this.fieldShowDialog.open(FieldShowComponent, {
            width: '400px',
            data: obj
        });
    }

}
