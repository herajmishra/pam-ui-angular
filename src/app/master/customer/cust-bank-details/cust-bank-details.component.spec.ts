import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustBankDetailsComponent } from './cust-bank-details.component';

describe('CustBankDetailsComponent', () => {
  let component: CustBankDetailsComponent;
  let fixture: ComponentFixture<CustBankDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustBankDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
