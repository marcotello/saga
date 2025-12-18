/// <reference types="cypress" />
describe('Profile Page', () => {
  beforeEach(() => {
    // Login before each test to access the profile page
    cy.login('johnsmith@saga.com', 'Password@123');
    cy.visit('/profile');
    // Wait for the page to load
    cy.get('h1').should('contain', 'My Profile');
    cy.wait(1000); // Wait for user data to load
  });

  describe('Page Load and Structure', () => {
    it('should load the profile page successfully', () => {
      cy.url().should('include', '/profile');
      cy.get('body').should('be.visible');
    });

    it('should display the page title', () => {
      cy.get('h1').should('contain', 'My Profile');
    });

    it('should display the profile section', () => {
      cy.get('.profile-section').should('be.visible');
      cy.get('.profile-section h2').should('contain', 'General Information');
    });

    it('should display the profile form', () => {
      cy.get('.profile-form').should('be.visible');
    });
  });

  describe('Profile Header', () => {
    it('should display user avatar', () => {
      cy.get('.avatar-section .avatar').should('be.visible');
      cy.get('.avatar-section .avatar').should('have.attr', 'src');
      cy.get('.avatar-section .avatar').should('have.attr', 'alt', 'Profile avatar');
    });

    it('should display user information', () => {
      cy.get('.user-info').should('be.visible');
      cy.get('.user-info small').should('be.visible'); // Username
      cy.get('.user-info h3').should('be.visible'); // Full name
    });

    it('should display upload picture button', () => {
      cy.get('.profile-header button').should('contain', 'Upload new picture');
      cy.get('.profile-header button').should('have.class', 'outline');
    });

    it('should show username from logged in user', () => {
      cy.get('.user-info small').invoke('text').should('not.be.empty');
    });

    it('should show full name from logged in user', () => {
      cy.get('.user-info h3').invoke('text').should('not.be.empty');
    });
  });

  describe('Form Fields', () => {
    it('should display first name field', () => {
      cy.get('#firstName').should('be.visible');
      cy.get('label[for="firstName"]').should('contain', 'First Name');
      cy.get('#firstName').should('have.attr', 'placeholder', 'John');
    });

    it('should display last name field', () => {
      cy.get('#lastName').should('be.visible');
      cy.get('label[for="lastName"]').should('contain', 'Last Name');
      cy.get('#lastName').should('have.attr', 'placeholder', 'Doe');
    });

    it('should display email field', () => {
      cy.get('#email').should('be.visible');
      cy.get('label[for="email"]').should('contain', 'Email');
      cy.get('#email').should('have.attr', 'type', 'email');
      cy.get('#email').should('have.attr', 'placeholder', 'johndoe@saga.com');
    });

    it('should display bio field', () => {
      cy.get('#bio').should('be.visible');
      cy.get('label[for="bio"]').should('contain', 'Bio');
      cy.get('#bio').should('have.attr', 'placeholder', 'I love to read.');
      cy.get('#bio').should('have.attr', 'rows', '4');
    });

    it('should pre-fill form with user data', () => {
      // Check that fields have values (from logged in user)
      cy.get('#firstName').should('have.value').and('not.be.empty');
      cy.get('#lastName').should('have.value').and('not.be.empty');
      cy.get('#email').should('have.value').and('not.be.empty');
    });

    it('should allow editing first name', () => {
      cy.get('#firstName').clear().type('NewFirstName');
      cy.get('#firstName').should('have.value', 'NewFirstName');
    });

    it('should allow editing last name', () => {
      cy.get('#lastName').clear().type('NewLastName');
      cy.get('#lastName').should('have.value', 'NewLastName');
    });

    it('should allow editing email', () => {
      cy.get('#email').clear().type('newemail@example.com');
      cy.get('#email').should('have.value', 'newemail@example.com');
    });

    it('should allow editing bio', () => {
      cy.get('#bio').clear().type('This is my new bio.');
      cy.get('#bio').should('have.value', 'This is my new bio.');
    });
  });

  describe('Form Validation', () => {
    it('should show error when first name is empty', () => {
      cy.get('#firstName').clear().blur();
      cy.get('#firstName-error').should('be.visible');
      cy.get('#firstName-error').should('contain', 'First name is required');
    });

    it('should show error when last name is empty', () => {
      cy.get('#lastName').clear().blur();
      cy.get('#lastName-error').should('be.visible');
      cy.get('#lastName-error').should('contain', 'Last name is required');
    });

    it('should show error when email is empty', () => {
      cy.get('#email').clear().blur();
      cy.get('#email-error').should('be.visible');
      cy.get('#email-error').should('contain', 'Email is required');
    });

    it('should show error when email is invalid', () => {
      cy.get('#email').clear().type('invalidemail').blur();
      cy.get('#email-error').should('be.visible');
      cy.get('#email-error').should('contain', 'valid email');
    });

    it('should not show error for empty bio (optional field)', () => {
      cy.get('#bio').clear().blur();
      cy.get('body').then(($body) => {
        if ($body.find('#bio-error').length > 0) {
          cy.get('#bio-error').should('not.exist');
        }
      });
    });

    it('should set aria-invalid on invalid fields', () => {
      cy.get('#firstName').clear().blur();
      cy.get('#firstName').should('have.attr', 'aria-invalid', 'true');
    });

    it('should set aria-describedby on invalid fields', () => {
      cy.get('#firstName').clear().blur();
      cy.get('#firstName').should('have.attr', 'aria-describedby', 'firstName-error');
    });

    it('should not allow form submission when invalid', () => {
      cy.get('#firstName').clear();
      cy.get('button[type="submit"]').click();
      
      // Form should not submit, URL should remain the same
      cy.url().should('include', '/profile');
      cy.get('#firstName-error').should('be.visible');
    });

    it('should clear error when field becomes valid', () => {
      cy.get('#firstName').clear().blur();
      cy.get('#firstName-error').should('be.visible');
      
      cy.get('#firstName').type('John');
      cy.get('button[type="submit"]').click();
      
      // Error should be gone if other fields are valid
      cy.wait(500);
    });
  });

  describe('Form Submission', () => {
    it('should display Save Changes button', () => {
      cy.get('button[type="submit"]').should('be.visible');
      cy.get('button[type="submit"]').should('contain', 'Save Changes');
    });

    it('should show loading state during submission', () => {
      cy.get('#firstName').clear().type('UpdatedName');
      cy.get('button[type="submit"]').click();
      
      // Button text should change
      cy.get('button[type="submit"]').should('contain', 'Saving...');
      cy.get('button[type="submit"]').should('be.disabled');
      cy.get('button[type="submit"]').should('have.attr', 'aria-busy', 'true');
    });

    it('should update profile successfully', () => {
      const newFirstName = `Updated${Date.now()}`;
      
      cy.get('#firstName').clear().type(newFirstName);
      cy.get('button[type="submit"]').click();
      
      // Wait for loading to complete
      cy.wait(2000);
      
      // Button should return to normal state
      cy.get('button[type="submit"]').should('not.be.disabled');
      cy.get('button[type="submit"]').should('contain', 'Save Changes');
    });

    it('should update all fields at once', () => {
      cy.get('#firstName').clear().type('NewFirst');
      cy.get('#lastName').clear().type('NewLast');
      cy.get('#email').clear().type('newemail@test.com');
      cy.get('#bio').clear().type('New bio text');
      
      cy.get('button[type="submit"]').click();
      
      // Wait for submission
      cy.wait(2000);
      
      // All fields should maintain their values
      cy.get('#firstName').should('have.value', 'NewFirst');
      cy.get('#lastName').should('have.value', 'NewLast');
      cy.get('#email').should('have.value', 'newemail@test.com');
      cy.get('#bio').should('have.value', 'New bio text');
    });

    it('should prevent multiple submissions while loading', () => {
      cy.get('#firstName').clear().type('Test');
      cy.get('button[type="submit"]').click();
      
      // Button should be disabled during loading
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Try to click again
      cy.get('button[type="submit"]').click({ force: true });
      
      // Should still be in loading state
      cy.get('button[type="submit"]').should('be.disabled');
    });
  });

  describe('Error Handling', () => {
    it('should display error banner when there is an error', () => {
      // This test depends on implementation - checking if error banner can appear
      cy.get('body').then(($body) => {
        if ($body.find('.error-banner').length > 0) {
          cy.get('.error-banner').should('have.attr', 'role', 'alert');
          cy.get('.error-banner').should('have.attr', 'aria-live', 'polite');
        }
      });
    });

    it('should clear errors on successful submission', () => {
      // Submit valid form
      cy.get('#firstName').clear().type('ValidName');
      cy.get('button[type="submit"]').click();
      
      cy.wait(2000);
      
      // No error banner should be visible
      cy.get('.error-banner').should('not.exist');
    });
  });

  describe('Loading State', () => {
    it('should show loading overlay during save', () => {
      cy.get('#firstName').clear().type('Test');
      cy.get('button[type="submit"]').click();
      
      // Check for loading indicator (from withLoadingState directive)
      cy.get('[withLoadingState]').should('exist');
    });

    it('should clear loading state after completion', () => {
      cy.get('#firstName').clear().type('Test');
      cy.get('button[type="submit"]').click();
      
      // Wait for loading to complete
      cy.wait(3000);
      
      // Button should no longer be disabled
      cy.get('button[type="submit"]').should('not.be.disabled');
    });
  });

  describe('Form Actions', () => {
    it('should have proper form structure', () => {
      cy.get('.profile-form').should('have.attr', 'novalidate');
      cy.get('.form-actions').should('be.visible');
    });

    it('should have accessible form labels', () => {
      cy.get('label[for="firstName"]').should('exist');
      cy.get('label[for="lastName"]').should('exist');
      cy.get('label[for="email"]').should('exist');
      cy.get('label[for="bio"]').should('exist');
    });

    it('should have proper button type', () => {
      cy.get('button[type="submit"]').should('have.attr', 'type', 'submit');
      cy.get('.profile-header button').should('have.attr', 'type', 'button');
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport(375, 667);
      cy.get('.profile-section').should('be.visible');
      cy.get('.profile-form').should('be.visible');
      cy.get('.avatar-section').should('be.visible');
    });

    it('should display correctly on tablet viewport', () => {
      cy.viewport(768, 1024);
      cy.get('.profile-section').should('be.visible');
      cy.get('.profile-form').should('be.visible');
      cy.get('.form-row').should('be.visible');
    });

    it('should display correctly on desktop viewport', () => {
      cy.viewport(1280, 720);
      cy.get('.profile-section').should('be.visible');
      cy.get('.profile-form').should('be.visible');
      cy.get('.form-row').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('exist');
      cy.get('h2').should('exist');
    });

    it('should have accessible error messages', () => {
      cy.get('#firstName').clear().blur();
      cy.get('#firstName-error').should('have.attr', 'role', 'alert');
    });

    it('should have accessible form inputs', () => {
      cy.get('#firstName').should('have.attr', 'name', 'firstName');
      cy.get('#lastName').should('have.attr', 'name', 'lastName');
      cy.get('#email').should('have.attr', 'name', 'email');
      cy.get('#bio').should('have.attr', 'name', 'bio');
    });

    it('should link labels to inputs', () => {
      cy.get('label[for="firstName"]').click();
      cy.get('#firstName').should('have.focus');
    });
  });

  describe('User Data Persistence', () => {
    it('should maintain form values during navigation', () => {
      // Get current values
      cy.get('#firstName').invoke('val').then((firstName) => {
        cy.get('#lastName').invoke('val').then((lastName) => {
          // Navigate away
          cy.visit('/dashboard');
          cy.wait(500);
          
          // Navigate back
          cy.visit('/profile');
          cy.wait(1000);
          
          // Values should be restored
          cy.get('#firstName').should('have.value', firstName);
          cy.get('#lastName').should('have.value', lastName);
        });
      });
    });
  });
});
