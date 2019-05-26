import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TarrifInfoComponent} from './tarrif-info.component';

describe('TarrifInfoComponent', () => {
    let component: TarrifInfoComponent;
    let fixture: ComponentFixture<TarrifInfoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TarrifInfoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TarrifInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
