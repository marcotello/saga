/**
 * Custom validators for login form
 * Aligned with specs/006-refactor-login/data-model.md validation rules
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Password strength regex pattern
 * Must contain: at least 8 chars, one uppercase, one lowercase, one number
 */
export const PASSWORD_STRENGTH_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/;

/**
 * Validator for required fields that trims whitespace
 */
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

/**
 * Validator for password strength
 * Enforces: 8-128 chars, one uppercase, one lowercase, one number
 */
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

/**
 * Validator for maximum length
 */
export function maxLength(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || typeof value !== 'string') {
      return null;
    }
    const trimmed = value.trim();
    if (trimmed.length > max) {
      return { 
        maxlength: {
          requiredLength: max,
          actualLength: trimmed.length
        }
      };
    }
    return null;
  };
}

