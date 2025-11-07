import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [NgOptimizedImage],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  // Image source constants
  readonly logoSrc = '/images/saga_logo_bottom.png';
  readonly illustrationSrc = '/images/reading2.svg';
  
  // Alt text constants
  readonly logoAlt = 'Saga';
  readonly illustrationAlt = 'Saga - Book Tracker';
  
  // GitHub repository URL
  readonly githubUrl = 'https://github.com/marcotello/saga';
}
