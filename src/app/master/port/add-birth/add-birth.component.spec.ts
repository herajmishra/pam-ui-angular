import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddBirthComponent} from './add-birth.component';

describe('AddBirthComponent', () => {
    let component: AddBirthComponent;
    let fixture: ComponentFixture<AddBirthComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddBirthComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddBirthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
