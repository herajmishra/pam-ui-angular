import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MasterRoutingModule} from './master-routing.module';
import {RouterModule} from '@angular/router';
import { FieldShowComponent } from './field-show/field-show.component';
import { MatDialogModule, MatIconModule, MatFormFieldModule, MatButtonModule } from '@angular/material';

@NgModule({
    declarations: [FieldShowComponent],
    imports: [
        CommonModule,
        MasterRoutingModule,
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
    ],
    exports: [RouterModule],
    entryComponents:[FieldShowComponent]
})
export class MasterModule {
}
