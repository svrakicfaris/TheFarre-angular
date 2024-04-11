import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscourseComponent } from './discourse.component';

describe('DiscourseComponent', () => {
  let component: DiscourseComponent;
  let fixture: ComponentFixture<DiscourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
