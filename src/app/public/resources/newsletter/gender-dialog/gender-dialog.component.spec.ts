import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderDialogComponent } from './gender-dialog.component';

describe('GenderDialogComponent', () => {
  let component: GenderDialogComponent;
  let fixture: ComponentFixture<GenderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenderDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
