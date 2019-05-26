import {Injectable} from '@angular/core';
import {FormBuilder} from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class LookupService {
    public lookupAction = 0;
    public disableText = false;
    public btnText = '';
    public organizationList: any;
    public lookupName = '';
    public groupControl = '';
    public code = '';
    public clickAction = true;
    public orgID: string;
    lookupDetails: any;
    lookupID: number;

    constructor(private fb: FormBuilder) {
    }


    // form: FormGroup = this.fb.group({
    //     groupKey: [{value: '', disabled: this.disableText}],
    //     code: [{value: null, disabled: this.disableText}, [Validators.required]],
    //     value: [{value: null, disabled: this.disableText}, [Validators.required]],
    //     orgId: ['', [Validators.required]],
    //     status: [{value: null, disabled: ''}, [Validators.required]]
    // });
}
