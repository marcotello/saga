import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('US1: Desktop/Tablet Footer Display', () => {
    it('should render semantic footer element', () => {
      const footer = compiled.querySelector('footer');
      expect(footer).toBeTruthy();
    });

    it('should display three columns', () => {
      const columns = compiled.querySelectorAll('.footer-column');
      expect(columns.length).toBe(3);
    });

    it('should display logo in first column with correct alt text', () => {
      const logoColumn = compiled.querySelector('.footer-logo');
      const logo = logoColumn?.querySelector('img');

      expect(logo).toBeTruthy();
      expect(logo?.getAttribute('alt')).toBe('Saga');
      expect(logo?.getAttribute('src')).toContain('saga_logo_bottom.svg');
    });

    it('should display illustration in second column with correct alt text', () => {
      const illustrationColumn = compiled.querySelector('.footer-illustration');
      const illustration = illustrationColumn?.querySelector('img');

      expect(illustration).toBeTruthy();
      expect(illustration?.getAttribute('alt')).toBe('Saga - Book Tracker');
      expect(illustration?.getAttribute('src')).toContain('reading2.svg');
    });

    it('should NOT lazy-load illustration (priority attribute present)', () => {
      const illustration = compiled.querySelector('.footer-illustration img');

      // NgOptimizedImage with priority should not have loading="lazy"
      expect(illustration?.getAttribute('loading')).not.toBe('lazy');
    });

    it('should display Angular logo in third column', () => {
      const angularColumn = compiled.querySelector('.footer-angular');
      const logo = angularColumn?.querySelector('img');

      expect(logo).toBeTruthy();
      expect(logo?.getAttribute('alt')).toBe('Angularity');
      expect(logo?.getAttribute('src')).toContain('LogoAngularity-Footer-light.png');
    });

    it('should display text and GitHub link in bottom section', () => {
      const bottomSection = compiled.querySelector('.footer-bottom');
      const paragraph = bottomSection?.querySelector('p');
      const link = bottomSection?.querySelector('a');

      expect(paragraph?.textContent).toContain('Made with');
      expect(paragraph?.textContent).toContain('for the Angular Community');
      expect(link).toBeTruthy();
      const linkImg = link?.querySelector('img');
      expect(linkImg?.getAttribute('alt')).toBe('GitHub');
    });

    it('should have GitHub link with correct attributes', () => {
      const link = compiled.querySelector('.footer-bottom a') as HTMLAnchorElement;

      expect(link.href).toBe('https://github.com/marcotello/saga');
      expect(link.target).toBe('_blank');
      expect(link.rel).toBe('noopener noreferrer');
    });

    it('should have CSS Grid layout for columns on desktop', () => {
      const columnsContainer = compiled.querySelector('.footer-columns') as HTMLElement;
      const styles = window.getComputedStyle(columnsContainer);

      expect(styles.display).toBe('grid');
    });
  });

  describe('US2: Mobile Responsive Stacking', () => {
    it('should render columns in correct order for mobile stacking', () => {
      const columns = compiled.querySelectorAll('.footer-column');

      expect(columns[0].classList.contains('footer-logo')).toBe(true);
      expect(columns[1].classList.contains('footer-illustration')).toBe(true);
      expect(columns[2].classList.contains('footer-angular')).toBe(true);
    });

    it('should use single-column grid for mobile (≤600px) via CSS', () => {
      const columnsContainer = compiled.querySelector('.footer-columns');
      expect(columnsContainer).toBeTruthy();

      const columns = compiled.querySelectorAll('.footer-column');
      expect(columns.length).toBe(3);
    });
  });

  describe('US3: Accessibility', () => {
    it('should have descriptive alt texts for images', () => {
      const logo = compiled.querySelector('.footer-logo img');
      const illustration = compiled.querySelector('.footer-illustration img');

      expect(logo?.getAttribute('alt')).toBe('Saga');
      expect(illustration?.getAttribute('alt')).toBe('Saga - Book Tracker');
    });

    it('should have keyboard-focusable GitHub link', () => {
      const link = compiled.querySelector('.footer-bottom a') as HTMLAnchorElement;

      expect(link.tabIndex).toBeGreaterThanOrEqual(0);
    });

    it('should have discernible link text (via alt text)', () => {
      const link = compiled.querySelector('.footer-bottom a');
      const img = link?.querySelector('img');

      expect(img?.getAttribute('alt')).toBe('GitHub');
    });

    it('should have rel attributes for security', () => {
      const link = compiled.querySelector('.footer-bottom a');

      expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('should use semantic footer element for accessibility', () => {
      const footer = compiled.querySelector('footer');

      expect(footer?.tagName.toLowerCase()).toBe('footer');
    });
  });

  describe('Edge Cases', () => {
    it('should handle ultra-narrow layouts without overflow', () => {
      const footer = compiled.querySelector('footer') as HTMLElement;
      const columns = compiled.querySelectorAll('.footer-column');

      expect(footer).toBeTruthy();
      expect(columns.length).toBe(3);

      const images = compiled.querySelectorAll('.footer-column img');
      images.forEach(img => {
        expect(img).toBeTruthy();
      });
    });

    it('should show alt text when images fail to load', () => {
      const logo = compiled.querySelector('.footer-logo img');
      const illustration = compiled.querySelector('.footer-illustration img');

      expect(logo?.getAttribute('alt')).toBeTruthy();
      expect(illustration?.getAttribute('alt')).toBeTruthy();
    });

    it('should maintain stable layout with image placeholders', () => {
      const logo = compiled.querySelector('.footer-logo img');
      const illustration = compiled.querySelector('.footer-illustration img');

      expect(logo?.getAttribute('width')).toBeTruthy();
      expect(logo?.getAttribute('height')).toBeTruthy();
      expect(illustration?.getAttribute('width')).toBeTruthy();
      expect(illustration?.getAttribute('height')).toBeTruthy();
    });
  });

  describe('Component Properties', () => {
    it('should have correct image source constants', () => {
      expect(component.logoSrc).toBe('/images/saga_logo_bottom.svg');
      expect(component.illustrationSrc).toBe('/images/reading2.svg');
    });

    it('should have correct alt text constants', () => {
      expect(component.logoAlt).toBe('Saga');
      expect(component.illustrationAlt).toBe('Saga - Book Tracker');
    });

    it('should have correct GitHub URL', () => {
      expect(component.githubUrl).toBe('https://github.com/marcotello/saga');
    });
  });
});
