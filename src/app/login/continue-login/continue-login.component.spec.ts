import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueLoginComponent } from './continue-login.component';

describe('ContinueLoginComponent', () => {
  let component: ContinueLoginComponent;
  let fixture: ComponentFixture<ContinueLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContinueLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinueLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
