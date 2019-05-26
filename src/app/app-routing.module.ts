import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MaterialModule} from './material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {LoginModalComponent} from './login/login-modal/login-modal.component';
import {ContinueLoginComponent} from './login/continue-login/continue-login.component';
import {AuthGuard} from './helper/auth.guard';

const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', canActivate: [AuthGuard], loadChildren: './dashboard/dashboard.module#DashboardModule'},
    {path: 'master', canActivate: [AuthGuard], loadChildren: './master/master.module#MasterModule'},
    {path: 'pda', canActivate: [AuthGuard], loadChildren: './pda/pda.module#PdaModule'},
    {path: 'finance', canActivate: [AuthGuard], loadChildren: './finance/finance.module#FinanceModule'}
];

@NgModule({
    imports: [
        BrowserModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forRoot(routes, {useHash: false})
    ],
    declarations: [LoginComponent, LoginModalComponent, ContinueLoginComponent],
    entryComponents: [LoginModalComponent, ContinueLoginComponent],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
