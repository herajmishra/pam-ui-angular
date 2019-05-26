import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {MaterialModule} from '../material/material.module';
import {MenuListItemComponent} from '../common/menu-list-item/menu-list-item.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [DashboardComponent, MenuListItemComponent],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule.forChild(routes)
    ]
})
export class DashboardRoutingModule {
}
