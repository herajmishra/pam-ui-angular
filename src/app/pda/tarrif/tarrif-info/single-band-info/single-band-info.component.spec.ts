import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SingleBandInfoComponent} from './single-band-info.component';

describe('SingleBandInfoComponent', () => {
    let component: SingleBandInfoComponent;
    let fixture: ComponentFixture<SingleBandInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SingleBandInfoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SingleBandInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
