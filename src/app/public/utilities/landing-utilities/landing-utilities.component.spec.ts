import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingUtilitiesComponent } from './landing-utilities.component';

describe('LandingUtilitiesComponent', () => {
  let component: LandingUtilitiesComponent;
  let fixture: ComponentFixture<LandingUtilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingUtilitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingUtilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
