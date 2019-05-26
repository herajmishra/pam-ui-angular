import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {InflowComponent} from './inflow/inflow.component';
import {CustomerPaymentStatusComponent} from './inflow/customer-payment-status/customer-payment-status.component';
import {RemarkModalComponent} from './inflow/customer-payment-status/remark-modal/remark-modal.component';
import {FundAllocationComponent} from './fund-allocation/fund-allocation.component';
import {SuspenseTreasuryComponent} from './suspense-treasury/suspense-treasury.component';
import {CustomerJobDetailComponent} from './fund-allocation/customer-job-detail/customer-job-detail.component';
import {AllocationDetailsComponent} from './fund-allocation/customer-job-detail/allocation-details/allocation-details.component';
import {AllocationRemarkModalComponent} from './fund-allocation/customer-job-detail/allocation-details/allocation-remark-modal/allocation-remark-modal.component';
import {JobDetailsComponent} from './branch-requisition/job-details/job-details.component';
import {ServiceDetailsComponent} from './branch-requisition/service-details/service-details.component';
import {ParticularDetailsComponent} from './branch-requisition/particular-details/particular-details.component';
import {ParticularRemarkModalComponent} from './branch-requisition/particular-details/particular-remark-modal/particular-remark-modal.component';
import {GstDetailsComponent} from './branch-requisition/particular-details/gst-details/gst-details.component';
import {BillDetailsComponent} from './branch-requisition/particular-details/bill-details/bill-details.component';

const routes: Routes = [
    {path: '', component: InflowComponent},
    {path: 'inflow', component: InflowComponent},
    {path: 'fund-allocation', component: FundAllocationComponent},
    {path: 'branch-requisition', component: JobDetailsComponent},
];

@NgModule({
    declarations: [
        InflowComponent,
        CustomerPaymentStatusComponent,
        RemarkModalComponent,
        FundAllocationComponent,
        SuspenseTreasuryComponent,
        CustomerJobDetailComponent,
        AllocationDetailsComponent,
        AllocationRemarkModalComponent,
        JobDetailsComponent,
        ServiceDetailsComponent,
        ParticularDetailsComponent,
        ParticularRemarkModalComponent,
        GstDetailsComponent,
        BillDetailsComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild(routes)
    ],
    entryComponents: [
        RemarkModalComponent,
        AllocationRemarkModalComponent,
        ParticularRemarkModalComponent,
        GstDetailsComponent,
        BillDetailsComponent
    ]
})
export class FinanceRoutingModule {
}
