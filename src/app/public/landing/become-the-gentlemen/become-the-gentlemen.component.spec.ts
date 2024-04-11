import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeTheGentlemenComponent } from './become-the-gentlemen.component';

describe('BecomeTheGentlemenComponent', () => {
  let component: BecomeTheGentlemenComponent;
  let fixture: ComponentFixture<BecomeTheGentlemenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BecomeTheGentlemenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BecomeTheGentlemenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
