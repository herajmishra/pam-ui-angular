import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InflowComponent} from './inflow.component';

describe('InflowComponent', () => {
    let component: InflowComponent;
    let fixture: ComponentFixture<InflowComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InflowComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InflowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
