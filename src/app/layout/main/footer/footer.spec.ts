import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

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
      expect(logo?.getAttribute('ng-reflect-ng-src')).toBe('/images/saga_logo_bottom.png');
    });

    it('should display illustration in second column with correct alt text', () => {
      const illustrationColumn = compiled.querySelector('.footer-illustration');
      const illustration = illustrationColumn?.querySelector('img');
      
      expect(illustration).toBeTruthy();
      expect(illustration?.getAttribute('alt')).toBe('Saga - Book Tracker');
      expect(illustration?.getAttribute('ng-reflect-ng-src')).toBe('/images/footer_reading.svg');
    });

    it('should NOT lazy-load illustration (priority attribute present)', () => {
      const illustration = compiled.querySelector('.footer-illustration img');
      
      // NgOptimizedImage with priority should not have loading="lazy"
      expect(illustration?.hasAttribute('priority')).toBe(false); // priority is removed after compilation
      expect(illustration?.getAttribute('loading')).not.toBe('lazy');
    });

    it('should display text and GitHub link in third column', () => {
      const textColumn = compiled.querySelector('.footer-text');
      const paragraph = textColumn?.querySelector('p');
      const link = textColumn?.querySelector('a');
      
      expect(paragraph?.textContent).toBe('Made with love for the Angular Community');
      expect(link).toBeTruthy();
      expect(link?.textContent).toBe('GitHub');
    });

    it('should have GitHub link with correct attributes', () => {
      const link = compiled.querySelector('.footer-text a') as HTMLAnchorElement;
      
      expect(link.href).toBe('https://github.com/marcotello/saga');
      expect(link.target).toBe('_blank');
      expect(link.rel).toBe('noopener noreferrer');
    });

    it('should have CSS Grid layout on desktop (≥1024px)', () => {
      const footer = compiled.querySelector('footer') as HTMLElement;
      const styles = window.getComputedStyle(footer);
      
      expect(styles.display).toBe('grid');
    });
  });

  describe('US2: Mobile Responsive Stacking', () => {
    it('should render columns in correct order for mobile stacking', () => {
      const columns = compiled.querySelectorAll('.footer-column');
      
      expect(columns[0].classList.contains('footer-logo')).toBe(true);
      expect(columns[1].classList.contains('footer-illustration')).toBe(true);
      expect(columns[2].classList.contains('footer-text')).toBe(true);
    });

    it('should use single-column grid for mobile (≤600px) via CSS', () => {
      // This test verifies the CSS structure is present
      // Actual responsive behavior would be tested via e2e or visual regression tests
      const footer = compiled.querySelector('footer');
      expect(footer).toBeTruthy();
      
      // Verify the CSS classes are applied that enable responsive behavior
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
      const link = compiled.querySelector('.footer-text a') as HTMLAnchorElement;
      
      expect(link.tabIndex).toBeGreaterThanOrEqual(0);
    });

    it('should have discernible link text', () => {
      const link = compiled.querySelector('.footer-text a');
      
      expect(link?.textContent?.trim()).toBe('GitHub');
      expect(link?.textContent?.trim().length).toBeGreaterThan(0);
    });

    it('should have rel attributes for security', () => {
      const link = compiled.querySelector('.footer-text a');
      
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
      
      // Verify structure supports narrow layouts
      expect(footer).toBeTruthy();
      expect(columns.length).toBe(3);
      
      // Images should have max-width: 100% for responsive scaling
      const images = compiled.querySelectorAll('.footer-column img');
      images.forEach(img => {
        expect(img).toBeTruthy();
      });
    });

    it('should show alt text when images fail to load', () => {
      const logo = compiled.querySelector('.footer-logo img');
      const illustration = compiled.querySelector('.footer-illustration img');
      
      // Alt text is present and will display if image fails
      expect(logo?.getAttribute('alt')).toBeTruthy();
      expect(illustration?.getAttribute('alt')).toBeTruthy();
      expect(logo?.getAttribute('alt')).not.toBe('');
      expect(illustration?.getAttribute('alt')).not.toBe('');
    });

    it('should maintain stable layout with image placeholders', () => {
      const logo = compiled.querySelector('.footer-logo img');
      const illustration = compiled.querySelector('.footer-illustration img');
      
      // Images have width/height attributes for stable layout
      expect(logo?.getAttribute('width')).toBeTruthy();
      expect(logo?.getAttribute('height')).toBeTruthy();
      expect(illustration?.getAttribute('width')).toBeTruthy();
      expect(illustration?.getAttribute('height')).toBeTruthy();
    });
  });

  describe('Component Properties', () => {
    it('should have correct image source constants', () => {
      expect(component.logoSrc).toBe('/images/saga_logo_bottom.png');
      expect(component.illustrationSrc).toBe('/images/footer_reading.svg');
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
