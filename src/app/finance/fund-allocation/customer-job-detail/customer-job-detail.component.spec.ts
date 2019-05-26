import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomerJobDetailComponent} from './customer-job-detail.component';

describe('CustomerJobDetailComponent', () => {
    let component: CustomerJobDetailComponent;
    let fixture: ComponentFixture<CustomerJobDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CustomerJobDetailComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomerJobDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
