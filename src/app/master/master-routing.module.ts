import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {VesselComponent} from './vessel/vessel.component';
import {MaterialModule} from '../material/material.module';
import {CompanyComponent} from './company/company.component';
import {DetailsComponent} from './company/details/details.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BranchComponent} from './company/branch/branch.component';
import {PortComponent} from './port/port.component';
import {BirthInfoComponent} from './port/birth-info/birth-info.component';

import {LookupComponent} from './lookup/lookup.component';
import {AddLookupComponent} from './lookup/add-lookup/add-lookup.component';
import { CountryComponent } from './country/country.component';
import { CommodityComponent } from './commodity/commodity.component';

 import {AddPortComponent} from './port/add-port/add-port.component';
 import {AddBirthComponent} from './port/add-birth/add-birth.component';
import { VendorBankDetailsComponent } from './vendor/vendor-bank-details/vendor-bank-details.component';
import { GroupDetailsComponent } from './vendor/group-details/group-details.component';
import { VendorServicesComponent } from './vendor/vendor-services/vendor-services.component';
import { CustomerComponent } from './customer/customer.component';
import { CustGroupComponent } from './customer/cust-group/cust-group.component';
import { CustBankDetailsComponent } from './customer/cust-bank-details/cust-bank-details.component';
import { CustContactComponent } from './customer/cust-contact/cust-contact.component';
import { ServiceComponent } from './service/service.component';
import { VendorComponent } from './vendor/vendor.component';
import { TaxDetailsComponent } from './service/tax-details/tax-details.component';
import {CustServiceComponent} from './customer/cust-service/cust-service.component';


const routes: Routes = [
    // Dashboard
    {path: '', component: VesselComponent},
    // Vessel
    {path: 'vessel', component: VesselComponent},

    // Company
    {path: 'company', component: CompanyComponent},
    {path: 'company/details', component: DetailsComponent},
    {path: 'company/branch', component: BranchComponent},

    // Port
    // Master
    {path: 'country', component: CountryComponent},

    // commodity
    {path: 'commodity', component: CommodityComponent},

    // Vendor
    {path: 'vendor', component: VendorComponent},
    {path: 'port/master', component: PortComponent},
    {path: 'port/add', component: AddPortComponent},
    {path: 'port/birth', component: BirthInfoComponent},
    {path: 'port/birth/add', component: AddBirthComponent},
    {path: 'lookup', component: LookupComponent},
    {path: 'lookup/add', component: AddLookupComponent},
    // {path: 'port/port-restriction', component: AddBirthInfoComponent},
    // {path: 'port/port-restriction/add', component: AddPortRestrictionComponent},
    // {path: 'port/pilot-restriction', component: PilotRestrictionComponent},
    // Master -> Country
    {path: 'country', component: CountryComponent},

    // commodity
    {path: 'commodity', component: CommodityComponent},

    // Vendor
    {path: 'vendor', component: VendorComponent},
    {path: 'vendor/bank', component: VendorBankDetailsComponent},
    {path: 'vendor/group', component: GroupDetailsComponent},
    {path: 'vendor/services', component: VendorServicesComponent},

    // customer
    {path: 'customer', component: CustomerComponent},
    {path: 'customer/group', component: CustGroupComponent},
    {path: 'customer/bank', component: CustBankDetailsComponent},
    {path: 'customer/contact', component: CustContactComponent},
    {path: 'customer/service', component: CustServiceComponent},

    // service
    {path: 'service', component: ServiceComponent},
    {path: 'service/tax-details', component: TaxDetailsComponent},
];
@NgModule({
    declarations: [
        VesselComponent,
        CompanyComponent,
        DetailsComponent,
        BranchComponent,
        PortComponent,
        BirthInfoComponent,
        CountryComponent,
        CommodityComponent,
        VendorComponent,
        AddBirthComponent,
        LookupComponent,
        AddLookupComponent,
        AddBirthComponent,
        CommodityComponent,
        VendorBankDetailsComponent,
        GroupDetailsComponent,
        VendorServicesComponent,
        CustomerComponent,
        CustGroupComponent,
        CustBankDetailsComponent,
        CustContactComponent,
        ServiceComponent,
        TaxDetailsComponent,
        AddPortComponent,
        CustServiceComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    entryComponents: []
})
export class MasterRoutingModule {
}
