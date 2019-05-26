import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PdaDetailsComponent} from './pda-details.component';

describe('PdaDetailsComponent', () => {
    let component: PdaDetailsComponent;
    let fixture: ComponentFixture<PdaDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PdaDetailsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PdaDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
