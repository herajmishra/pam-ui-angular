import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TarrifComponent} from './tarrif.component';

describe('TarrifComponent', () => {
    let component: TarrifComponent;
    let fixture: ComponentFixture<TarrifComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [TarrifComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(TarrifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
