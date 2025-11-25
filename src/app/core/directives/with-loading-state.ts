import { Directive, ElementRef, HostBinding, Renderer2, effect, inject, input, output } from '@angular/core';
import { UserService } from '../services/user-service';
import { User } from '../models/models';

@Directive({
  selector: '[withLoadingState]',
  standalone: true
})
export class WithLoadingState {
  private readonly userService = inject(UserService);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private overlayElement: HTMLElement | null = null;
  private lastUserRef: User | null = null;

  // Input signals for loading state and tracking ID
  readonly isLoading = input.required<boolean>();
  readonly trackingId = input<number | null>(null);

  // Output signal to notify when loading completes
  readonly loadingComplete = output<void>();

  @HostBinding('attr.aria-busy') ariaBusy: 'true' | null = null;
  @HostBinding('attr.aria-live') ariaLive: 'polite' | null = null;
  @HostBinding('attr.role') role = 'status';

  constructor() {
    this.renderer.addClass(this.host.nativeElement, 'with-loading-state-host');

    // Watch for loading state changes and update aria-busy
    effect(() => {
      const loading = this.isLoading();
      this.ariaBusy = loading ? 'true' : null;
      if (loading) {
        this.showOverlay();
      } else {
        this.hideOverlay();
      }
    });

    // Watch for user updates to clear loading state
    effect(() => {
      const user: User | null = this.userService.user();
      const trackingId = this.trackingId();
      const isLoading = this.isLoading();
      const hasUserChanged = user !== this.lastUserRef;
      this.lastUserRef = user;

      if (isLoading && trackingId !== null && hasUserChanged && user?.id === trackingId) {
        this.loadingComplete.emit();
      }
    });
  }

  private showOverlay(): void {
    if (this.overlayElement) {
      this.renderer.setAttribute(this.overlayElement, 'aria-busy', 'true');
    } else {
      const overlay = this.renderer.createElement('div');
      this.renderer.addClass(overlay, 'with-loading-state-spinner');
      this.renderer.setAttribute(overlay, 'role', 'status');
      this.renderer.setAttribute(overlay, 'aria-live', 'polite');
      this.renderer.setAttribute(overlay, 'aria-busy', 'true');
      const text = this.renderer.createText('Saving changes…');
      this.renderer.appendChild(overlay, text);
      this.overlayElement = overlay;
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
}
