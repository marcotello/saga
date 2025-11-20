import { ChangeDetectionStrategy, Component, InputSignal, OutputEmitterRef, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dialog {
  readonly title: InputSignal<string> = input.required<string>();
  readonly isOpen: InputSignal<boolean> = input<boolean>(false);
  readonly requestClose: OutputEmitterRef<void> = output<void>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).tagName === 'DIALOG') {
      this.requestClose.emit();
    }
  }

  onDialogCancel(event: Event): void {
    event.preventDefault();
    this.requestClose.emit();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.requestClose.emit();
    }
  }
}

