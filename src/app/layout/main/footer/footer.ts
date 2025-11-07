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
  
  readonly logoSrc = '/images/saga_logo_bottom.png';
  readonly illustrationSrc = '/images/reading2.svg';
  readonly angularLogoSrc = '/images/LogoAngularity-Footer-light.png';
  
  
  readonly logoAlt = 'Saga';
  readonly illustrationAlt = 'Saga - Book Tracker';
  readonly angularLogoAlt = 'Angularity';
  
  readonly githubUrl = 'https://github.com/marcotello/saga';
}
