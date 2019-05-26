import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddPortComponent} from './add-port.component';

describe('AddPortComponent', () => {
    let component: AddPortComponent;
    let fixture: ComponentFixture<AddPortComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddPortComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddPortComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
