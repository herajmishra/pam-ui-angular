import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ParticularRemarkModalComponent} from './particular-remark-modal.component';

describe('ParticularRemarkModalComponent', () => {
    let component: ParticularRemarkModalComponent;
    let fixture: ComponentFixture<ParticularRemarkModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ParticularRemarkModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ParticularRemarkModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
