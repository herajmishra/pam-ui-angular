import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustServiceComponent } from './cust-service.component';

describe('CustServiceComponent', () => {
  let component: CustServiceComponent;
  let fixture: ComponentFixture<CustServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
