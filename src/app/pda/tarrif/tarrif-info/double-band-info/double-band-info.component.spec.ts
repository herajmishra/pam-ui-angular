import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DoubleBandInfoComponent} from './double-band-info.component';

describe('DoubleBandInfoComponent', () => {
    let component: DoubleBandInfoComponent;
    let fixture: ComponentFixture<DoubleBandInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DoubleBandInfoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DoubleBandInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
