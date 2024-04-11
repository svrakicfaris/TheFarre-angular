import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheFarrePrinciplesComponent } from './the-farre-principles.component';

describe('TheFarrePrinciplesComponent', () => {
  let component: TheFarrePrinciplesComponent;
  let fixture: ComponentFixture<TheFarrePrinciplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheFarrePrinciplesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheFarrePrinciplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
