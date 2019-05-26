import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../service/common.service';
import {HttpService} from '../../../service/http.service';
import {ApiUrlService} from '../../../service/api-url.service';
import {LookupService} from '../../../service/master/lookup.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


export interface User {
    groupKey: string;
}

@Component({
    selector: 'app-add-lookup',
    templateUrl: './add-lookup.component.html',
    styleUrls: ['./add-lookup.component.scss']
})
export class AddLookupComponent implements OnInit {
    groupControl = new FormControl();
    options: User[] = [];
    data: any;
    filteredOptions: Observable<User[]>;
    groupName = '';
    key = '';
    form;
    selectedOption = 'ACTIVE';

    constructor(private router: Router, private fb: FormBuilder,
                public commonService: CommonService, private http: HttpService, private api: ApiUrlService,
                public lookupService: LookupService) {
        if (this.lookupService.lookupAction === 0) {
            this.router.navigate(['master/lookup']);
        }
    }

    ngOnInit() {
        if (this.lookupService.orgID !== undefined && this.lookupService.orgID !== '') {
            this.patchDetails();
        } else {
            this.form = new FormGroup({
                groupKey: new FormControl({value: '', disabled: null}),
                code: new FormControl({value: '', disabled: null}, Validators.required),
                value: new FormControl({value: '', disabled: null}, Validators.required),
                orgId: new FormControl(this.lookupService.orgID, Validators.required),
                status: new FormControl({value: '', disabled: null}, Validators.required)
            });
          this.setSelectedOption();
        }
    }

    setSelectedOption() {
      return this.form.controls['status'].setValue(this.selectedOption, {onlySelf: true});
    }
    patchDetails() {
        this.form = new FormGroup({
            orgId: new FormControl(this.lookupService.orgID),
            value: new FormControl(this.lookupService.lookupDetails.value),
            status: new FormControl(this.lookupService.lookupDetails.status)
        });
        // this.form.patch(this.lookupService.lookupDetails)
    }

    displayFn(user?: User): string | undefined {
        this.key = user ? user.groupKey : undefined;
        return this.key;
    }

    selectVal(e) {
        this.key = e.groupKey;
    }

    _filter(name: string): User[] {
        const filterValue = name.toLowerCase();
        return this.options.filter(option => option.groupKey.toLowerCase().indexOf(filterValue) === 0);
    }


    getKeyName(val) {
        this.key = '';
        this.groupName = val;
        this.options = [];
        this.http.getRequest(this.api.getGroupKeyName + val).subscribe(
            res => {
                this.data = res;
                const arr = [];
                for (let i = 0; i < this.data.length; i++) {
                    arr.push(this.data[i]);
                }
                this.uniqueGroupKey(arr);
            },
            err => {
                if (err.status !== 200) {
                    this.commonService.toastr('error', 'Please try again...');
                }
            }
        );
    }

    uniqueGroupKey(array) {
        const result = Array.from(new Set(array.map(s => s.groupKey)))
            .map(groupKey => {
                return {
                    groupKey: array.find(s => s.groupKey === groupKey).groupKey
                };
            });
        this.options = result;
        this.filteredOptions = this.groupControl.valueChanges
            .pipe(
                startWith<string | User>(''),
                map(value => typeof value === 'string' ? value : value.groupKey),
                map(name => name ? this._filter(name) : this.options.slice())
            );
    }

    save(formData) {
        if (this.lookupService.lookupID > 0) {
            formData['id'] = this.lookupService.lookupID;
            formData['groupKey'] = this.lookupService.groupControl;
            formData['code'] = this.lookupService.code;
        } else {
            if (this.groupName === null || this.groupName === '' || this.groupName === undefined) {
                this.commonService.toastr('error', 'Please enter group key');
                return false;
            } else {
                if (this.key === '' || this.key === null || this.key === undefined) {
                    formData['groupKey'] = this.groupName;
                } else {
                    formData['groupKey'] = this.key;
                }

            }
        }

        this.commonService.toastr('warning', 'Please wait...');
        this.http.postRequest(this.api.saveLookup, formData).subscribe(
            res => {
                this.commonService.toastr('clear',);
                this.router.navigate(['master/lookup']);
            },
            err => {
                this.commonService.toastr('clear',);
                if (err.status !== 201) {
                    this.commonService.toastr('error', 'Please try again');
                }
            }
        );
    }

    back() {
        this.router.navigate(['/master/lookup']);
        this.setSelectedOption();
    }
}
