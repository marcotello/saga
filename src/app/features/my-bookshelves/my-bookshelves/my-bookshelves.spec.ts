import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBookShelves } from './my-bookshelves';

describe('MyBookShelves', () => {
  let component: MyBookShelves;
  let fixture: ComponentFixture<MyBookShelves>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBookShelves]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MyBookShelves);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
