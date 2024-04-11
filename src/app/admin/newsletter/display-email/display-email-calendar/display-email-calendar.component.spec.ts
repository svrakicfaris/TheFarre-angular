import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEmailCalendarComponent } from './display-email-calendar.component';

describe('DisplayEmailCalendarComponent', () => {
  let component: DisplayEmailCalendarComponent;
  let fixture: ComponentFixture<DisplayEmailCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayEmailCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayEmailCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
