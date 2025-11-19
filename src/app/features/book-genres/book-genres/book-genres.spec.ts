import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookGenres } from './book-genres';

describe('BookGenres', () => {
  let component: BookGenres;
  let fixture: ComponentFixture<BookGenres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookGenres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookGenres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
