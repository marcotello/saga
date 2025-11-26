import { Directive, HostBinding, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Directive({
  selector: '[passwordToggle]',
  standalone: true,
  exportAs: 'passwordToggle',
  host: {
    type: 'button',
    '[attr.aria-pressed]': 'visible() ? "true" : "false"',
    '[attr.aria-label]': 'getLabel()',
    '[title]': 'getLabel()',
    '(click)': 'toggleVisibility()'
  }
})
export class PasswordToggleDirective {
  private readonly isVisibleSignal = signal(false);
  readonly passwordToggleFor = input.required<HTMLInputElement>();
  private readonly sanitizer = inject(DomSanitizer);

  @HostBinding('innerHTML')
  iconTemplate: SafeHtml = '';
  private readonly visibleIcon = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  `;
  private readonly hiddenIcon = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;

  constructor() {
    effect(() => {
      const inputElement = this.passwordToggleFor();
      const isVisible = this.isVisibleSignal();

      if (inputElement) {
        inputElement.type = isVisible ? 'text' : 'password';
      }

      this.iconTemplate = this.sanitizer.bypassSecurityTrustHtml(
        isVisible ? this.visibleIcon : this.hiddenIcon
      );
    });
  }

  visible(): boolean {
    return this.isVisibleSignal();
  }

  getLabel(): string {
    return this.visible() ? 'Hide password' : 'Show password';
  }

  toggleVisibility(): void {
    this.isVisibleSignal.update(value => !value);
    const inputElement = this.passwordToggleFor();
    inputElement?.focus();
  }
}


