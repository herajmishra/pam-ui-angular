import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LsFlatInfoComponent} from './ls-flat-info.component';

describe('LsFlatInfoComponent', () => {
    let component: LsFlatInfoComponent;
    let fixture: ComponentFixture<LsFlatInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LsFlatInfoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LsFlatInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
