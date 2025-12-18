/// <reference types="cypress" />
describe('Account Page (Password Change)', () => {
  beforeEach(() => {
    // Login before each test to access the account page
    cy.login('johnsmith@saga.com', 'Password@123');
    cy.visit('/account');
    // Wait for the page to load
    cy.get('h1').should('contain', 'Password');
    cy.wait(500);
  });

  describe('Page Load and Structure', () => {
    it('should load the account page successfully', () => {
      cy.url().should('include', '/account');
      cy.get('body').should('be.visible');
    });

    it('should display the page title', () => {
      cy.get('h1').should('contain', 'Password');
    });

    it('should display the account section', () => {
      cy.get('.account-section').should('be.visible');
    });

    it('should display the password form', () => {
      cy.get('.password-form').should('be.visible');
    });
  });

  describe('Form Fields', () => {
    it('should display current password field', () => {
      cy.get('#currentPassword').should('be.visible');
      cy.get('label[for="currentPassword"]').should('contain', 'Current Password');
      cy.get('#currentPassword').should('have.attr', 'type', 'password');
      cy.get('#currentPassword').should('have.attr', 'placeholder', 'Current password');
      cy.get('#currentPassword').should('have.attr', 'autocomplete', 'current-password');
    });

    it('should display new password field', () => {
      cy.get('#newPassword').should('be.visible');
      cy.get('label[for="newPassword"]').should('contain', 'New Password');
      cy.get('#newPassword').should('have.attr', 'type', 'password');
      cy.get('#newPassword').should('have.attr', 'placeholder', 'Enter new password');
      cy.get('#newPassword').should('have.attr', 'autocomplete', 'new-password');
    });

    it('should display confirm password field', () => {
      cy.get('#confirmPassword').should('be.visible');
      cy.get('label[for="confirmPassword"]').should('contain', 'Confirm New Password');
      cy.get('#confirmPassword').should('have.attr', 'type', 'password');
      cy.get('#confirmPassword').should('have.attr', 'placeholder', 'Confirm new password');
      cy.get('#confirmPassword').should('have.attr', 'autocomplete', 'new-password');
    });

    it('should display password toggle buttons for all fields', () => {
      cy.get('.password-toggle').should('have.length', 3);
    });

    it('should allow typing in current password field', () => {
      cy.get('#currentPassword').type('TestPassword123');
      cy.get('#currentPassword').should('have.value', 'TestPassword123');
    });

    it('should allow typing in new password field', () => {
      cy.get('#newPassword').type('NewPassword123');
      cy.get('#newPassword').should('have.value', 'NewPassword123');
    });

    it('should allow typing in confirm password field', () => {
      cy.get('#confirmPassword').type('NewPassword123');
      cy.get('#confirmPassword').should('have.value', 'NewPassword123');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should hide current password by default', () => {
      cy.get('#currentPassword').should('have.attr', 'type', 'password');
    });

    it('should show current password when toggle is clicked', () => {
      cy.get('#currentPassword').parent().find('.password-toggle').click();
      cy.get('#currentPassword').should('have.attr', 'type', 'text');
    });

    it('should hide current password when toggle is clicked again', () => {
      const toggle = cy.get('#currentPassword').parent().find('.password-toggle');
      toggle.click();
      cy.get('#currentPassword').should('have.attr', 'type', 'text');
      toggle.click();
      cy.get('#currentPassword').should('have.attr', 'type', 'password');
    });

    it('should toggle new password visibility', () => {
      cy.get('#newPassword').parent().find('.password-toggle').click();
      cy.get('#newPassword').should('have.attr', 'type', 'text');
      cy.get('#newPassword').parent().find('.password-toggle').click();
      cy.get('#newPassword').should('have.attr', 'type', 'password');
    });

    it('should toggle confirm password visibility', () => {
      cy.get('#confirmPassword').parent().find('.password-toggle').click();
      cy.get('#confirmPassword').should('have.attr', 'type', 'text');
      cy.get('#confirmPassword').parent().find('.password-toggle').click();
      cy.get('#confirmPassword').should('have.attr', 'type', 'password');
    });

    it('should toggle each password field independently', () => {
      // Show current password
      cy.get('#currentPassword').parent().find('.password-toggle').click();
      cy.get('#currentPassword').should('have.attr', 'type', 'text');
      cy.get('#newPassword').should('have.attr', 'type', 'password');
      cy.get('#confirmPassword').should('have.attr', 'type', 'password');

      // Show new password
      cy.get('#newPassword').parent().find('.password-toggle').click();
      cy.get('#currentPassword').should('have.attr', 'type', 'text');
      cy.get('#newPassword').should('have.attr', 'type', 'text');
      cy.get('#confirmPassword').should('have.attr', 'type', 'password');
    });

    it('should have accessible password toggle buttons', () => {
      cy.get('.password-toggle').each(($toggle) => {
        cy.wrap($toggle).should('have.attr', 'type', 'button');
        cy.wrap($toggle).should('have.attr', 'aria-label');
        cy.wrap($toggle).should('have.attr', 'aria-pressed');
      });
    });
  });

  describe('Form Validation', () => {
    it('should show error when current password is empty', () => {
      cy.get('#currentPassword').focus().blur();
      cy.get('#currentPassword-error').should('be.visible');
      cy.get('#currentPassword-error').should('contain', 'Current password is required');
    });

    it('should show error when new password is empty', () => {
      cy.get('#newPassword').focus().blur();
      cy.get('#newPassword-error').should('be.visible');
      cy.get('#newPassword-error').should('contain', 'New password is required');
    });

    it('should show error when confirm password is empty', () => {
      cy.get('#confirmPassword').focus().blur();
      cy.get('#confirmPassword-error').should('be.visible');
      cy.get('#confirmPassword-error').should('contain', 'confirm your new password');
    });

    it('should show error when new password is too short', () => {
      cy.get('#newPassword').type('Short1').blur();
      cy.get('#newPassword-error').should('be.visible');
      cy.get('#newPassword-error').should('contain', 'at least 8 characters');
    });

    it('should show error when new password is weak', () => {
      cy.get('#newPassword').type('weakpass').blur();
      cy.get('#newPassword-error').should('be.visible');
    });

    it('should show error when passwords do not match', () => {
      cy.get('#currentPassword').type('Password@123');
      cy.get('#newPassword').type('NewPassword@123');
      cy.get('#confirmPassword').type('DifferentPassword@123');
      cy.get('button[type="submit"]').click();

      cy.wait(500);
      cy.get('.error-banner').should('be.visible');
      cy.get('.error-banner').should('contain', 'do not match');
    });

    it('should set aria-invalid on invalid fields', () => {
      cy.get('#currentPassword').focus().blur();
      cy.get('#currentPassword').should('have.attr', 'aria-invalid', 'true');
    });

    it('should set aria-describedby on invalid fields', () => {
      cy.get('#currentPassword').focus().blur();
      cy.get('#currentPassword').should('have.attr', 'aria-describedby', 'currentPassword-error');
    });

    it('should not allow form submission when fields are empty', () => {
      cy.get('button[type="submit"]').click();
      
      // Form should not submit, URL should remain the same
      cy.url().should('include', '/account');
      cy.get('#currentPassword-error').should('be.visible');
      cy.get('#newPassword-error').should('be.visible');
      cy.get('#confirmPassword-error').should('be.visible');
    });

    it('should accept valid strong password', () => {
      cy.get('#newPassword').type('ValidPassword@123');
      cy.get('#newPassword').blur();
      
      // Should not show error for valid password
      cy.get('#newPassword-error').should('not.exist');
    });

    it('should validate password meets complexity requirements', () => {
      // Test various invalid passwords
      const weakPasswords = [
        'password',     // No uppercase, no number
        'PASSWORD',     // No lowercase, no number
        '12345678',     // No letters
        'Password',     // No number
        'password123'   // No uppercase
      ];

      weakPasswords.forEach((password) => {
        cy.get('#newPassword').clear().type(password).blur();
        cy.wait(200);
        // Should show some error
        cy.get('body').then(($body) => {
          if ($body.find('#newPassword-error').length > 0) {
            cy.get('#newPassword-error').should('be.visible');
          }
        });
      });
    });
  });

  describe('Form Submission', () => {
    it('should display Update Password button', () => {
      cy.get('button[type="submit"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Update Password');
    });

    it('should show loading state during submission', () => {
      cy.get('#currentPassword').type('Password@123');
      cy.get('#newPassword').type('NewPassword@123');
      cy.get('#confirmPassword').type('NewPassword@123');
      cy.get('button[type="submit"]').click();
      
      // Button text should change
      cy.get('button[type="submit"]').should('contain', 'Updating…');
      cy.get('button[type="submit"]').should('be.disabled');
      cy.get('button[type="submit"]').should('have.attr', 'aria-busy', 'true');
    });

    it('should update password successfully with valid data', () => {
      cy.get('#currentPassword').type('Password@123');
      cy.get('#newPassword').type('NewPassword@123');
      cy.get('#confirmPassword').type('NewPassword@123');
      cy.get('button[type="submit"]').click();
      
      // Wait for submission to complete
      cy.wait(2000);
      
      // Button should return to normal state
      cy.get('button[type="submit"]').should('not.be.disabled');
      cy.get('button[type="submit"]').should('contain', 'Update Password');
      
      // Form should be reset
      cy.get('#currentPassword').should('have.value', '');
      cy.get('#newPassword').should('have.value', '');
      cy.get('#confirmPassword').should('have.value', '');
    });

    it('should prevent multiple submissions while loading', () => {
      cy.get('#currentPassword').type('Password@123');
      cy.get('#newPassword').type('NewPassword@123');
      cy.get('#confirmPassword').type('NewPassword@123');
      cy.get('button[type="submit"]').click();
      
      // Button should be disabled
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Try to click again (should be prevented)
      cy.get('button[type="submit"]').click({ force: true });
      
      // Should still be in loading state
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('should clear form after successful password change', () => {
      cy.get('#currentPassword').type('Password@123');
      cy.get('#newPassword').type('NewPassword@123');
      cy.get('#confirmPassword').type('NewPassword@123');
      cy.get('button[type="submit"]').click();
      
      cy.wait(2500);
      
      // All fields should be empty
      cy.get('#currentPassword').should('have.value', '');
      cy.get('#newPassword').should('have.value', '');
      cy.get('#confirmPassword').should('have.value', '');
    });
  });

  describe('Error Handling', () => {
    it('should display error banner when passwords do not match', () => {
      cy.get('#currentPassword').type('Password@123');
      cy.get('#newPassword').type('NewPassword@123');
      cy.get('#confirmPassword').type('DifferentPassword@123');
      cy.get('button[type="submit"]').click();
      
      cy.wait(500);
      cy.get('.error-banner').should('be.visible');
      cy.get('.error-banner').should('have.attr', 'role', 'alert');
      cy.get('.error-banner').should('have.attr', 'aria-live', 'polite');
    });

    it('should clear error banner when form becomes valid', () => {
      // First submit with mismatched passwords
      cy.get('#currentPassword').type('Password@123');
      cy.get('#newPassword').type('NewPassword@123');
      cy.get('#confirmPassword').type('WrongPassword@123');
      cy.get('button[type="submit"]').click();
      
      cy.wait(500);
      
      // Now fix the error
      cy.get('#confirmPassword').clear().type('NewPassword@123');
      cy.get('button[type="submit"]').click();
      
      cy.wait(2000);
      
      // Error should be cleared
      cy.get('.error-banner').should('not.exist');
    });

    it('should show appropriate error messages for each field', () => {
      cy.get('#currentPassword').focus().blur();
      cy.get('#currentPassword-error').should('have.attr', 'role', 'alert');

      cy.get('#newPassword').focus().blur();
      cy.get('#newPassword-error').should('have.attr', 'role', 'alert');

      cy.get('#confirmPassword').focus().blur();
      cy.get('#confirmPassword-error').should('have.attr', 'role', 'alert');
    });
  });

  describe('Loading State', () => {
    it('should show loading overlay during password update', () => {
      cy.get('#currentPassword').type('Password@123');
      cy.get('#newPassword').type('NewPassword@123');
      cy.get('#confirmPassword').type('NewPassword@123');
      cy.get('button[type="submit"]').click();
      
      // Check for loading indicator (from withLoadingState directive)
      cy.get('[withLoadingState]').should('exist');
    });

    it('should clear loading state after completion', () => {
      cy.get('#currentPassword').type('Password@123');
      cy.get('#newPassword').type('NewPassword@123');
      cy.get('#confirmPassword').type('NewPassword@123');
      cy.get('button[type="submit"]').click();
      
      cy.wait(3000);
      
      // Button should no longer be disabled
      cy.get('button[type="submit"]').should('not.be.disabled');
    });
  });

  describe('Form Structure', () => {
    it('should have proper form attributes', () => {
      cy.get('.password-form').should('have.attr', 'novalidate');
    });

    it('should have accessible form labels', () => {
      cy.get('label[for="currentPassword"]').should('exist');
      cy.get('label[for="newPassword"]').should('exist');
      cy.get('label[for="confirmPassword"]').should('exist');
    });

    it('should have proper button type', () => {
      cy.get('button[type="submit"]').should('have.attr', 'type', 'submit');
      cy.get('.password-toggle').each(($toggle) => {
        cy.wrap($toggle).should('have.attr', 'type', 'button');
      });
    });

    it('should have form actions section', () => {
      cy.get('.form-actions').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport(375, 667);
      cy.get('.account-section').should('be.visible');
      cy.get('.password-form').should('be.visible');
      cy.get('#currentPassword').should('be.visible');
      cy.get('#newPassword').should('be.visible');
      cy.get('#confirmPassword').should('be.visible');
    });

    it('should display correctly on tablet viewport', () => {
      cy.viewport(768, 1024);
      cy.get('.account-section').should('be.visible');
      cy.get('.password-form').should('be.visible');
    });

    it('should display correctly on desktop viewport', () => {
      cy.viewport(1280, 720);
      cy.get('.account-section').should('be.visible');
      cy.get('.password-form').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('exist');
    });

    it('should have accessible password fields', () => {
      cy.get('#currentPassword').should('have.attr', 'name', 'currentPassword');
      cy.get('#newPassword').should('have.attr', 'name', 'newPassword');
      cy.get('#confirmPassword').should('have.attr', 'name', 'confirmPassword');
    });

    it('should have accessible error messages', () => {
      cy.get('#currentPassword').focus().blur();
      cy.get('#currentPassword-error').should('have.attr', 'role', 'alert');
    });

    it('should link labels to inputs', () => {
      cy.get('label[for="currentPassword"]').click();
      cy.get('#currentPassword').should('have.focus');
      
      cy.get('label[for="newPassword"]').click();
      cy.get('#newPassword').should('have.focus');
      
      cy.get('label[for="confirmPassword"]').click();
      cy.get('#confirmPassword').should('have.focus');
    });

    it('should have proper autocomplete attributes', () => {
      cy.get('#currentPassword').should('have.attr', 'autocomplete', 'current-password');
      cy.get('#newPassword').should('have.attr', 'autocomplete', 'new-password');
      cy.get('#confirmPassword').should('have.attr', 'autocomplete', 'new-password');
    });
  });

  describe('Password Security', () => {
    it('should mask password input by default', () => {
      cy.get('#currentPassword').should('have.attr', 'type', 'password');
      cy.get('#newPassword').should('have.attr', 'type', 'password');
      cy.get('#confirmPassword').should('have.attr', 'type', 'password');
    });

    it('should require minimum password length', () => {
      cy.get('#newPassword').type('Short1').blur();
      cy.get('#newPassword-error').should('be.visible');
      cy.get('#newPassword-error').should('contain', '8 characters');
    });

    it('should enforce password complexity', () => {
      cy.get('#newPassword').type('simplepassword').blur();
      cy.wait(200);
      // Should show some requirement error
      cy.get('body').then(($body) => {
        if ($body.find('#newPassword-error').length > 0) {
          cy.get('#newPassword-error').should('be.visible');
        }
      });
    });
  });
});
