import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyShelves } from './my-shelves';

describe('MyShelves', () => {
  let component: MyShelves;
  let fixture: ComponentFixture<MyShelves>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyShelves]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyShelves);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
