import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialog } from './dialog';

describe('Dialog', () => {
  let component: Dialog;
  let fixture: ComponentFixture<Dialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dialog]
    }).compileComponents();

    fixture = TestBed.createComponent(Dialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Test Dialog');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize with dialog closed by default', () => {
      expect(component.isOpen()).toBe(false);
    });

    it('should accept title input signal', () => {
      fixture.componentRef.setInput('title', 'My Dialog Title');
      fixture.detectChanges();
      expect(component.title()).toBe('My Dialog Title');
    });

    it('should accept isOpen input signal', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);
    });

    it('should require title input', () => {
      // The title is required, so setting it should work
      fixture.componentRef.setInput('title', 'Required Title');
      fixture.detectChanges();
      expect(component.title()).toBe('Required Title');
    });
  });

  describe('Dialog visibility', () => {
    it('should render dialog when isOpen is true', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const dialog = fixture.nativeElement.querySelector('dialog');
      expect(dialog).toBeTruthy();
      expect(dialog.hasAttribute('open')).toBe(true);
    });

    it('should not show dialog when isOpen is false', () => {
      fixture.componentRef.setInput('isOpen', false);
      fixture.detectChanges();
      
      const dialog = fixture.nativeElement.querySelector('dialog');
      expect(dialog).toBeTruthy();
      expect(dialog.hasAttribute('open')).toBe(false);
    });

    it('should display title in dialog', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const titleElement = fixture.nativeElement.querySelector('.dialog__title');
      expect(titleElement).toBeTruthy();
      expect(titleElement.textContent.trim()).toBe('Test Title');
    });
  });

  describe('Dialog interactions', () => {
    it('should emit requestClose when backdrop is clicked', () => {
      spyOn(component.requestClose, 'emit');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const dialog = fixture.nativeElement.querySelector('dialog');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: dialog, enumerable: true });
      
      component.onBackdropClick(clickEvent);
      
      expect(component.requestClose.emit).toHaveBeenCalled();
    });

    it('should not emit requestClose when clicking inside dialog panel', () => {
      spyOn(component.requestClose, 'emit');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const panel = fixture.nativeElement.querySelector('.dialog__panel');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: panel, enumerable: true });
      
      component.onBackdropClick(clickEvent);
      
      expect(component.requestClose.emit).not.toHaveBeenCalled();
    });

    it('should emit requestClose when Escape key is pressed', () => {
      spyOn(component.requestClose, 'emit');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const keydownEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      spyOn(keydownEvent, 'preventDefault');
      
      component.onKeydown(keydownEvent);
      
      expect(keydownEvent.preventDefault).toHaveBeenCalled();
      expect(component.requestClose.emit).toHaveBeenCalled();
    });

    it('should not emit requestClose when other keys are pressed', () => {
      spyOn(component.requestClose, 'emit');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      
      component.onKeydown(keydownEvent);
      
      expect(component.requestClose.emit).not.toHaveBeenCalled();
    });

    it('should emit requestClose when dialog cancel event is triggered', () => {
      spyOn(component.requestClose, 'emit');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const cancelEvent = new Event('cancel', { bubbles: true });
      spyOn(cancelEvent, 'preventDefault');
      
      component.onDialogCancel(cancelEvent);
      
      expect(cancelEvent.preventDefault).toHaveBeenCalled();
      expect(component.requestClose.emit).toHaveBeenCalled();
    });
  });

  describe('Content projection', () => {
    it('should project body content', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const bodySection = fixture.nativeElement.querySelector('.dialog__body');
      expect(bodySection).toBeTruthy();
    });

    it('should project footer content', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const footerSection = fixture.nativeElement.querySelector('.dialog__footer');
      expect(footerSection).toBeTruthy();
    });
  });

  describe('Template rendering', () => {
    it('should render dialog element', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const dialog = fixture.nativeElement.querySelector('dialog');
      expect(dialog).toBeTruthy();
      expect(dialog.classList.contains('dialog')).toBe(true);
    });

    it('should render dialog panel', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const panel = fixture.nativeElement.querySelector('.dialog__panel');
      expect(panel).toBeTruthy();
    });

    it('should render dialog title', () => {
      fixture.componentRef.setInput('title', 'My Title');
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const title = fixture.nativeElement.querySelector('.dialog__title');
      expect(title).toBeTruthy();
      expect(title.textContent.trim()).toBe('My Title');
    });

    it('should render dialog body section', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const body = fixture.nativeElement.querySelector('.dialog__body');
      expect(body).toBeTruthy();
    });

    it('should render dialog footer section', () => {
      fixture.componentRef.setInput('isOpen', true);
      fixture.detectChanges();
      
      const footer = fixture.nativeElement.querySelector('.dialog__footer');
      expect(footer).toBeTruthy();
    });
  });
});

