import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from '../../../../shared/dialog/dialog';
import { UserBook } from '../../../../core/models/user-book';

@Component({
    selector: 'app-update-progress',
    imports: [CommonModule, FormsModule, Dialog],
    templateUrl: './update-progress.html',
    styleUrl: './update-progress.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProgress {
    book = input.required<UserBook>();
    isOpen = input<boolean>(false);

    saveProgress = output<number>();
    cancelUpdate = output<void>();

    progress = linkedSignal(() => this.book().progressPercentage);

    onSave(): void {
        this.saveProgress.emit(this.progress());
    }

    onCancel(): void {
        this.cancelUpdate.emit();
    }

    onRangeChange(event: Event): void {
        const value = (event.target as HTMLInputElement).valueAsNumber;
        this.progress.set(value);
    }
}
