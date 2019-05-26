import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AllocationRemarkModalComponent} from './allocation-remark-modal.component';

describe('AllocationRemarkModalComponent', () => {
    let component: AllocationRemarkModalComponent;
    let fixture: ComponentFixture<AllocationRemarkModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AllocationRemarkModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AllocationRemarkModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
