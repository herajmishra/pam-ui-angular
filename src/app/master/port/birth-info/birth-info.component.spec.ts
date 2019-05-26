import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthInfoComponent } from './birth-info.component';

describe('BirthInfoComponent', () => {
  let component: BirthInfoComponent;
  let fixture: ComponentFixture<BirthInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirthInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
