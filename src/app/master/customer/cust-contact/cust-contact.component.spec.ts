import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustContactComponent } from './cust-contact.component';

describe('CustContactComponent', () => {
  let component: CustContactComponent;
  let fixture: ComponentFixture<CustContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
