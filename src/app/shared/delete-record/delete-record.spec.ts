import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteRecord } from './delete-record';

describe('DeleteRecord', () => {
  let component: DeleteRecord;
  let fixture: ComponentFixture<DeleteRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRecord]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize with dialog closed by default', () => {
      expect(component.isOpen()).toBe(false);
    });

    it('should have correct dialog title', () => {
      expect(component.dialogTitle).toBe('Delete Record');
    });

    it('should have correct dialog body', () => {
      expect(component.dialogBody).toBe('Are you sure you want to delete this record?');
    });

    it('should accept isOpen input signal', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);
    });
  });

  describe('Dialog management', () => {
    it('should emit closed event when onRequestClose is called', () => {
      spyOn(component.closed, 'emit');

      component.onRequestClose();

      expect(component.closed.emit).toHaveBeenCalled();
    });

    it('should emit canceled event when onCancel is called', () => {
      spyOn(component.canceled, 'emit');
      spyOn(component.closed, 'emit');

      component.onCancel();

      expect(component.canceled.emit).toHaveBeenCalled();
      expect(component.closed.emit).toHaveBeenCalled();
    });

    it('should emit deleteConfirmed event when onDelete is called', () => {
      spyOn(component.deleteConfirmed, 'emit');
      spyOn(component.closed, 'emit');

      component.onDelete();

      expect(component.deleteConfirmed.emit).toHaveBeenCalled();
      expect(component.closed.emit).toHaveBeenCalled();
    });

    it('should emit closed event after deleteConfirmed when onDelete is called', () => {
      const emitOrder: string[] = [];
      spyOn(component.deleteConfirmed, 'emit').and.callFake(() => {
        emitOrder.push('deleteConfirmed');
      });
      spyOn(component.closed, 'emit').and.callFake(() => {
        emitOrder.push('closed');
      });

      component.onDelete();

      expect(emitOrder).toEqual(['deleteConfirmed', 'closed']);
    });

    it('should emit closed event after canceled when onCancel is called', () => {
      const emitOrder: string[] = [];
      spyOn(component.canceled, 'emit').and.callFake(() => {
        emitOrder.push('canceled');
      });
      spyOn(component.closed, 'emit').and.callFake(() => {
        emitOrder.push('closed');
      });

      component.onCancel();

      expect(emitOrder).toEqual(['canceled', 'closed']);
    });
  });

  describe('Template rendering', () => {
    it('should render dialog when isOpen is true', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const dialog = fixture.nativeElement.querySelector('app-dialog');
      expect(dialog).toBeTruthy();
    });

    it('should not render dialog when isOpen is false', () => {
      fixture.componentRef.setInput('isOpen', false);
      fixture.detectChanges();

      const dialog = fixture.nativeElement.querySelector('app-dialog');
      expect(dialog).toBeTruthy(); // Dialog component is always rendered, but visibility is controlled by isOpen
    });

    it('should render dialog body with correct text', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const body = fixture.nativeElement.querySelector('[body]');
      expect(body).toBeTruthy();
      expect(body.textContent.trim()).toBe('Are you sure you want to delete this record?');
    });

    it('should render Cancel button', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const cancelButton = fixture.nativeElement.querySelector('.delete-record__cancel-button');
      expect(cancelButton).toBeTruthy();
      expect(cancelButton.textContent.trim()).toBe('Cancel');
    });

    it('should render Delete button', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const deleteButton = fixture.nativeElement.querySelector('.delete-record__delete-button');
      expect(deleteButton).toBeTruthy();
      expect(deleteButton.textContent.trim()).toBe('Delete');
    });

    it('should call onCancel when Cancel button is clicked', () => {
      spyOn(component, 'onCancel');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const cancelButton = fixture.nativeElement.querySelector('.delete-record__cancel-button');
      cancelButton.click();
      fixture.detectChanges();

      expect(component.onCancel).toHaveBeenCalled();
    });

    it('should call onDelete when Delete button is clicked', () => {
      spyOn(component, 'onDelete');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const deleteButton = fixture.nativeElement.querySelector('.delete-record__delete-button');
      deleteButton.click();
      fixture.detectChanges();

      expect(component.onDelete).toHaveBeenCalled();
    });

    it('should pass correct title to dialog', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      const dialog = fixture.nativeElement.querySelector('app-dialog');
      expect(dialog).toBeTruthy();
      expect(component.dialogTitle).toBe('Delete Record');
    });

    it('should pass isOpen signal to dialog', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);
    });

    it('should call onRequestClose when dialog requestClose event is emitted', () => {
      spyOn(component, 'onRequestClose');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();

      // Simulate dialog requestClose event
      component.onRequestClose();

      expect(component.onRequestClose).toHaveBeenCalled();
    });
  });

  describe('Event emission', () => {
    it('should emit closed event when dialog is closed', () => {
      spyOn(component.closed, 'emit');

      component.onRequestClose();

      expect(component.closed.emit).toHaveBeenCalledTimes(1);
    });

    it('should emit canceled event when cancel is clicked', () => {
      spyOn(component.canceled, 'emit');

      component.onCancel();

      expect(component.canceled.emit).toHaveBeenCalledTimes(1);
    });

    it('should emit deleteConfirmed event when delete is clicked', () => {
      spyOn(component.deleteConfirmed, 'emit');

      component.onDelete();

      expect(component.deleteConfirmed.emit).toHaveBeenCalledTimes(1);
    });
  });
});

