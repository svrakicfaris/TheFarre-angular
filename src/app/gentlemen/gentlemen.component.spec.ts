import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GentlemenComponent } from './gentlemen.component';

describe('GentlemenComponent', () => {
  let component: GentlemenComponent;
  let fixture: ComponentFixture<GentlemenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GentlemenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GentlemenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
