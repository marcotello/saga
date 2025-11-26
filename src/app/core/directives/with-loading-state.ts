import { Directive, ElementRef, HostBinding, Renderer2, effect, inject, input, output } from '@angular/core';

@Directive({
  selector: '[withLoadingState]',
  standalone: true
})
export class WithLoadingState {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private overlayElement: HTMLElement | null = null;
  private overlayTextElement: HTMLElement | null = null;
  private wasLoading = false;
  readonly isLoading = input.required<boolean>();
  readonly loadingMessage = input<string>('Loading…');
  readonly loadingComplete = output<void>();

  @HostBinding('attr.aria-busy') ariaBusy: 'true' | null = null;
  @HostBinding('attr.aria-live') ariaLive: 'polite' | null = null;
  @HostBinding('attr.role') role = 'status';

  constructor() {
    this.renderer.addClass(this.host.nativeElement, 'with-loading-state-host');

    effect(() => {
      const loading = this.isLoading();
      const wasLoading = this.wasLoading;
      this.wasLoading = loading;
      
      this.ariaBusy = loading ? 'true' : null;
      
      if (loading) {
        this.showOverlay();
      } else {
        this.hideOverlay();
        
        if (wasLoading) {
          this.loadingComplete.emit();
        }
      }
    });
  }

  private showOverlay(): void {
    const message = this.loadingMessage();
    
    if (this.overlayElement && this.overlayTextElement) {
      this.renderer.setAttribute(this.overlayElement, 'aria-busy', 'true');
      this.overlayTextElement.textContent = message;
    } else {
      const overlay = this.renderer.createElement('div');
      this.renderer.addClass(overlay, 'with-loading-state-spinner');
      this.renderer.setAttribute(overlay, 'role', 'status');
      this.renderer.setAttribute(overlay, 'aria-live', 'polite');
      this.renderer.setAttribute(overlay, 'aria-busy', 'true');

      const randomNumber = this.generateRandomNumber(1, 5);

      console.log(randomNumber);

      const imageSrc = `/images/loading${randomNumber}.svg`;

      const image = this.renderer.createElement('img');
      this.renderer.addClass(image, 'with-loading-state-image');
      this.renderer.setAttribute(image, 'src', imageSrc);
      this.renderer.setAttribute(image, 'alt', '');
      this.renderer.setAttribute(image, 'aria-hidden', 'true');

      const textElement = this.renderer.createElement('span');
      this.renderer.addClass(textElement, 'with-loading-state-text');
      const text = this.renderer.createText(message);
      this.renderer.appendChild(textElement, text);

      this.renderer.appendChild(overlay, textElement);
      this.renderer.appendChild(overlay, image);

      this.overlayElement = overlay;
      this.overlayTextElement = textElement;
    }

    const overlay = this.overlayElement;
    if (overlay && !overlay.isConnected) {
      this.renderer.appendChild(this.host.nativeElement, overlay);
    }
  }

  private hideOverlay(): void {
    const overlay = this.overlayElement;
    if (!overlay) {
      return;
    }

    this.renderer.removeAttribute(overlay, 'aria-busy');
    if (overlay.isConnected) {
      overlay.remove();
    }
  }

  private generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
