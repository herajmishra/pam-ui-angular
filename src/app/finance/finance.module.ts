import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FinanceRoutingModule} from './finance-routing.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FinanceRoutingModule
    ],
    exports: [RouterModule]
})
export class FinanceModule {
}
