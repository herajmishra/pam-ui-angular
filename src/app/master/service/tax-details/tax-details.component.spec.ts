import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxDetailsComponent } from './tax-details.component';

describe('TaxDetailsComponent', () => {
  let component: TaxDetailsComponent;
  let fixture: ComponentFixture<TaxDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
