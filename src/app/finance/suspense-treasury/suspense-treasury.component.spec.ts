import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SuspenseTreasuryComponent} from './suspense-treasury.component';

describe('SuspenseTreasuryComponent', () => {
    let component: SuspenseTreasuryComponent;
    let fixture: ComponentFixture<SuspenseTreasuryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SuspenseTreasuryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SuspenseTreasuryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
