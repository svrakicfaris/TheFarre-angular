import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEmailListComponent } from './display-email-list.component';

describe('DisplayEmailListComponent', () => {
  let component: DisplayEmailListComponent;
  let fixture: ComponentFixture<DisplayEmailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayEmailListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayEmailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
