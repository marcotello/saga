import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WithLoadingState } from './with-loading-state';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div withLoadingState [isLoading]="isLoading"></div>`,
  imports: [WithLoadingState]
})
class TestComponent {
  isLoading = false;
}

describe('WithLoadingState', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, WithLoadingState]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directiveEl = fixture.debugElement.query(By.directive(WithLoadingState));
    expect(directiveEl).toBeTruthy();
  });
});
