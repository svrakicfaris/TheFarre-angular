import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatCanITeachComponent } from './what-can-i-teach.component';

describe('WhatCanITeachComponent', () => {
  let component: WhatCanITeachComponent;
  let fixture: ComponentFixture<WhatCanITeachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatCanITeachComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatCanITeachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
