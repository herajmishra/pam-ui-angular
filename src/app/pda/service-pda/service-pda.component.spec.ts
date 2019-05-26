import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ServicePdaComponent} from './service-pda.component';

describe('ServicePdaComponent', () => {
    let component: ServicePdaComponent;
    let fixture: ComponentFixture<ServicePdaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ServicePdaComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ServicePdaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
