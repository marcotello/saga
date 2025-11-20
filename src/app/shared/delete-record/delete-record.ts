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

  readonly dialogTitle = 'Delete Record';
  readonly dialogBody = 'Are you sure you want to delete this record?';

  onRequestClose(): void {
    this.closed.emit();
  }

  onCancel(): void {
    this.closed.emit();
  }

  onDelete(): void {
    this.closed.emit();
  }
}

