import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatCanIDoComponent } from './what-can-i-do.component';

describe('WhatCanIDoComponent', () => {
  let component: WhatCanIDoComponent;
  let fixture: ComponentFixture<WhatCanIDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatCanIDoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatCanIDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
