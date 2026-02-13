import { ChangeDetectionStrategy, Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '../dialog/dialog';

@Component({
  selector: 'app-delete-record',
  imports: [CommonModule, Dialog],
  templateUrl: './delete-record.html',
  styleUrl: './delete-record.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteRecord {
  readonly isOpen: InputSignal<boolean> = input<boolean>(false);
  readonly closed: OutputEmitterRef<void> = output<void>();
  readonly deleteConfirmed: OutputEmitterRef<void> = output<void>();
  readonly canceled: OutputEmitterRef<void> = output<void>();

  readonly dialogTitle: InputSignal<string> = input<string>('Delete Record');
  readonly dialogBody: InputSignal<string> = input<string>('Are you sure you want to delete this record?');

  onRequestClose(): void {
    this.closed.emit();
  }

  onCancel(): void {
    this.canceled.emit();
    this.closed.emit();
  }

  onDelete(): void {
    this.deleteConfirmed.emit();
    this.closed.emit();
  }
}

