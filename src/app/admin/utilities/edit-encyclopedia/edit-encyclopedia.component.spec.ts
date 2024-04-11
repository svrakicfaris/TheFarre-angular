import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEncyclopediaComponent } from './edit-encyclopedia.component';

describe('EditEncyclopediaComponent', () => {
  let component: EditEncyclopediaComponent;
  let fixture: ComponentFixture<EditEncyclopediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEncyclopediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEncyclopediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
