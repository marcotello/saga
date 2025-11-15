import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PASSWORD_STRENGTH_REGEX } from '../constants/auth-constants';

export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || typeof value !== 'string') {
      return null; 
    }
    if (!PASSWORD_STRENGTH_REGEX.test(value)) {
      return { 
        passwordStrength: {
          message: 'Password must be 8-128 characters with at least one uppercase letter, one lowercase letter, and one number'
        }
      };
    }
    return null;
  };
}

