import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {CreateComponent} from './create/create.component';
import {PdaDetailsComponent} from './pda-details/pda-details.component';
import {TarrifComponent} from './tarrif/tarrif.component';
import {TarrifInfoComponent} from './tarrif/tarrif-info/tarrif-info.component';
import {LsFlatInfoComponent} from './tarrif/tarrif-info/ls-flat-info/ls-flat-info.component';
import {SingleBandInfoComponent} from './tarrif/tarrif-info/single-band-info/single-band-info.component';
import {DoubleBandInfoComponent} from './tarrif/tarrif-info/double-band-info/double-band-info.component';
import {GrtNrtPdaServiceModalComponent} from './create/grt-nrt-pda-service-modal/grt-nrt-pda-service-modal.component';
import {RemarkModalComponent} from './create/remark-modal/remark-modal.component';
import {ServicePdaComponent} from './service-pda/service-pda.component';
import {ServicePdaDetailsComponent} from './service-pda/service-pda-details/service-pda-details.component';

const routes: Routes = [
    {path: '', component: PdaDetailsComponent},
    {path: 'list', component: PdaDetailsComponent},
    {path: 'create', component: CreateComponent},
    {path: 'tarrif', component: TarrifComponent},
    {path: 'tarif-info', component: TarrifInfoComponent},
    {path: 'ls-flat-info', component: LsFlatInfoComponent},
    {path: 'single-band-info', component: SingleBandInfoComponent},
    {path: 'double-band-info', component: DoubleBandInfoComponent},
    {path: 'service-pda', component: ServicePdaComponent}
];

@NgModule({
    declarations: [
        CreateComponent,
        PdaDetailsComponent,
        TarrifComponent,
        TarrifInfoComponent,
        LsFlatInfoComponent,
        SingleBandInfoComponent,
        DoubleBandInfoComponent,
        GrtNrtPdaServiceModalComponent,
        RemarkModalComponent,
        ServicePdaComponent,
        ServicePdaDetailsComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forChild(routes)
    ],
    entryComponents: [GrtNrtPdaServiceModalComponent, RemarkModalComponent]
})
export class PdaRoutingModule {
}
