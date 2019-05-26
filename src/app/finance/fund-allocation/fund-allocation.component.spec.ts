import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FundAllocationComponent} from './fund-allocation.component';

describe('FundAllocationComponent', () => {
    let component: FundAllocationComponent;
    let fixture: ComponentFixture<FundAllocationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FundAllocationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FundAllocationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
