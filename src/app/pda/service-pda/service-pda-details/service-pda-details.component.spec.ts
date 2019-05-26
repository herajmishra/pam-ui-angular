import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ServicePdaDetailsComponent} from './service-pda-details.component';

describe('ServicePdaDetailsComponent', () => {
    let component: ServicePdaDetailsComponent;
    let fixture: ComponentFixture<ServicePdaDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ServicePdaDetailsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ServicePdaDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
