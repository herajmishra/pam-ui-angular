import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PdaRoutingModule} from './pda-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        PdaRoutingModule
    ],
    exports: [RouterModule]
})
export class PdaModule {
}
