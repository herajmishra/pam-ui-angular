import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustGroupComponent } from './cust-group.component';

describe('CustGroupComponent', () => {
  let component: CustGroupComponent;
  let fixture: ComponentFixture<CustGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
