import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TokenInterceptorService} from './helper/token-interceptor.service';
import {AuthGuard} from './helper/auth.guard';
import {ApiUrlService} from './service/api-url.service';
import {LayoutComponent} from './layout/layout.component';
import {MainNavComponent} from './common/main-nav/main-nav.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule, MatDialogModule} from '@angular/material';
import {MaterialModule} from './material/material.module';
import {CommonService} from './service/common.service';
import {NavService} from './service/nav.service';
import {CompanyService} from './service/master/company.service';
import {ToastrModule} from 'ngx-toastr';
import {DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {PortService} from './service/master/port.service';
import {LookupService} from './service/master/lookup.service';
import {TarrifService} from './service/pda/tarrif.service';
import {TariffCalculationService} from './service/calc/calc.service';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {InflowService} from './service/finance/inflow.service';
import {TextAlignDirective} from './dir/text-align.directive';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent,
        MainNavComponent,
        TextAlignDirective
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 50000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
        }),
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MaterialModule,
        PdfViewerModule,
        DragDropModule,
        MatDialogModule,
    ],
    providers: [
        AuthGuard,
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
        ApiUrlService,
        CommonService,
        NavService,
        CompanyService,
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        PortService,
        LookupService,
        DatePipe,
        TarrifService,
        TariffCalculationService,
        InflowService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
