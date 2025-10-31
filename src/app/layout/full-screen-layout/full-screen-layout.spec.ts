import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenLayout } from './full-screen-layout';

describe('FullScreenLayout', () => {
  let component: FullScreenLayout;
  let fixture: ComponentFixture<FullScreenLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullScreenLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
