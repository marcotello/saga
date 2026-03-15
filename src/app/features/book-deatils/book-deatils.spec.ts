import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDeatils } from './book-deatils';

describe('BookDeatils', () => {
  let component: BookDeatils;
  let fixture: ComponentFixture<BookDeatils>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDeatils]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookDeatils);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
