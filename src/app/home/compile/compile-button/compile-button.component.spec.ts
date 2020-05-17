import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompileButtonComponent } from './compile-button.component';

describe('CompileButtonComponent', () => {
  let component: CompileButtonComponent;
  let fixture: ComponentFixture<CompileButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompileButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
