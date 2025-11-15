import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PASSWORD_STRENGTH_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/;

export function credentialRequiredTrimmed(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || typeof value !== 'string') {
      return { required: true };
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return { required: true };
    }
    return null;
  };
}

export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || typeof value !== 'string') {
      return null; // Let required validator handle empty
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null; // Let required validator handle empty
    }
    if (!PASSWORD_STRENGTH_REGEX.test(trimmed)) {
      return { 
        passwordStrength: {
          message: 'Password must be 8-128 characters with at least one uppercase letter, one lowercase letter, and one number'
        }
      };
    }
    return null;
  };
}

export function maxLength(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || typeof value !== 'string') {
      return null;
    }
    const trimmed = value.trim();
    if (trimmed.length > max) {
      return { 
        maxLength: {
          requiredLength: max,
          actualLength: trimmed.length
        }
      };
    }
    return null;
  };
}

