import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SelectoOptionComponent} from './selecto-option.component';

describe('SelectoOptionComponent', () => {
  let component: SelectoOptionComponent;
  let fixture: ComponentFixture<SelectoOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectoOptionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectoOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
