import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldShowComponent } from './field-show.component';

describe('FieldShowComponent', () => {
  let component: FieldShowComponent;
  let fixture: ComponentFixture<FieldShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
