import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GrtNrtPdaServiceModalComponent} from './grt-nrt-pda-service-modal.component';

describe('GrtNrtPdaServiceModalComponent', () => {
    let component: GrtNrtPdaServiceModalComponent;
    let fixture: ComponentFixture<GrtNrtPdaServiceModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GrtNrtPdaServiceModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GrtNrtPdaServiceModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
