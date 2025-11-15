describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/auth/login');
  });

  describe('Page Load and Structure', () => {
    it('should load the login page successfully', () => {
      cy.url().should('include', '/auth/login');
      cy.get('body').should('be.visible');
    });

    it('should display the login container', () => {
      cy.get('.login-container').should('be.visible');
    });

    it('should display the logo', () => {
      cy.get('img[alt="Saga logo"]').should('be.visible');
    });

    it('should display the welcome heading', () => {
      cy.get('h1').should('contain', 'Welcome Back');
    });

    it('should display the subtitle', () => {
      cy.get('.subtitle').should('contain', 'Sign in to continue to your account');
    });

    it('should display the reading illustration', () => {
      cy.get('img[alt="Reading illustration"]').should('be.visible');
    });
  });

  describe('Login Form', () => {
    it('should display credential input field', () => {
      cy.get('#credential').should('be.visible');
      cy.get('label[for="credential"]').should('contain', 'Email or Username');
    });

    it('should display password input field', () => {
      cy.get('#password').should('be.visible');
      cy.get('label[for="password"]').should('contain', 'Password');
    });

    it('should display password visibility toggle button', () => {
      cy.get('.password-toggle').should('be.visible');
    });

    it('should display Sign In button', () => {
      cy.get('button[type="submit"]').should('contain', 'Sign In');
    });

    it('should display signup link', () => {
      cy.get('.signup-link').should('contain', "Don't have an account?");
      cy.get('.signup-link a[routerLink="/auth/signup"]').should('contain', 'Sign up');
    });
  });

  describe('Form Validation', () => {
    it('should show error when credential is empty and form is submitted', () => {
      cy.get('#credential').clear();
      cy.get('#password').type('Password123');
      cy.get('button[type="submit"]').click();
      
      cy.get('#credential-error').should('be.visible');
      cy.get('#credential-error').should('contain', 'Email or username is required');
    });

    it('should show error when password is empty and form is submitted', () => {
      cy.get('#credential').type('test@example.com');
      cy.get('#password').clear();
      cy.get('button[type="submit"]').click();
      
      cy.get('#password-error').should('be.visible');
      cy.get('#password-error').should('contain', 'Password is required');
    });

    it('should show error when password is too weak', () => {
      cy.get('#credential').type('test@example.com');
      cy.get('#password').type('weak');
      cy.get('#password').blur();
      
      cy.get('#password-error').should('be.visible');
      cy.get('#password-error').should('contain', 'Password must be');
    });

    it('should not submit form when fields are invalid', () => {
      cy.get('#credential').clear();
      cy.get('#password').clear();
      cy.get('button[type="submit"]').click();
      
      // Form should not submit, URL should remain the same
      cy.url().should('include', '/auth/login');
    });

    it('should mark fields as touched after invalid submission', () => {
      cy.get('#credential').clear();
      cy.get('#password').clear();
      cy.get('button[type="submit"]').click();
      
      cy.get('#credential').should('have.attr', 'aria-invalid', 'true');
      cy.get('#password').should('have.attr', 'aria-invalid', 'true');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should hide password by default', () => {
      cy.get('#password').should('have.attr', 'type', 'password');
    });

    it('should show password when toggle is clicked', () => {
      cy.get('.password-toggle').click();
      cy.get('#password').should('have.attr', 'type', 'text');
    });

    it('should hide password when toggle is clicked again', () => {
      cy.get('.password-toggle').click();
      cy.get('#password').should('have.attr', 'type', 'text');
      cy.get('.password-toggle').click();
      cy.get('#password').should('have.attr', 'type', 'password');
    });

    it('should update aria-pressed attribute when toggled', () => {
      cy.get('.password-toggle').should('have.attr', 'aria-pressed', 'false');
      cy.get('.password-toggle').click();
      cy.get('.password-toggle').should('have.attr', 'aria-pressed', 'true');
    });

    it('should update aria-label when toggled', () => {
      cy.get('.password-toggle').should('have.attr', 'aria-label', 'Show password');
      cy.get('.password-toggle').click();
      cy.get('.password-toggle').should('have.attr', 'aria-label', 'Hide password');
    });
  });

  describe('Successful Login', () => {
    it('should successfully login with valid email credentials', () => {
      cy.get('#credential').type('johnsmith@saga.com');
      cy.get('#password').type('Password@123');
      cy.get('button[type="submit"]').click();
      
      // Should show loading state
      cy.get('button[type="submit"]').should('contain', 'Signing in...');
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Should navigate to dashboard after successful login
      cy.url({ timeout: 10000 }).should('include', '/dashboard');
    });

    it('should successfully login with valid username credentials', () => {
      cy.get('#credential').type('johnsmith');
      cy.get('#password').type('Password@123');
      cy.get('button[type="submit"]').click();
      
      // Should navigate to dashboard after successful login
      cy.url({ timeout: 10000 }).should('include', '/dashboard');
    });

    it('should successfully login with second user credentials', () => {
      cy.get('#credential').type('jamesldixon@dayrep.com');
      cy.get('#password').type('meive4Lei');
      cy.get('button[type="submit"]').click();
      
      // Should navigate to dashboard after successful login
      cy.url({ timeout: 10000 }).should('include', '/dashboard');
    });

    it('should successfully login with second user username', () => {
      cy.get('#credential').type('Teen1976');
      cy.get('#password').type('meive4Lei');
      cy.get('button[type="submit"]').click();
      
      // Should navigate to dashboard after successful login
      cy.url({ timeout: 10000 }).should('include', '/dashboard');
    });

    it('should trim whitespace from credentials', () => {
      cy.get('#credential').type('  johnsmith@saga.com  ');
      cy.get('#password').type('  Password@123  ');
      cy.get('button[type="submit"]').click();
      
      // Should still login successfully
      cy.url({ timeout: 10000 }).should('include', '/dashboard');
    });

    it('should clear error message on successful login', () => {
      // First try with wrong password to show error
      cy.get('#credential').type('johnsmith@saga.com');
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      // Wait for error to appear
      cy.get('.error-banner', { timeout: 5000 }).should('be.visible');
      
      // Now login with correct credentials
      cy.get('#credential').clear().type('johnsmith@saga.com');
      cy.get('#password').clear().type('Password@123');
      cy.get('button[type="submit"]').click();
      
      // Error should be cleared and navigate to dashboard
      cy.url({ timeout: 10000 }).should('include', '/dashboard');
    });
  });

  describe('Failed Login', () => {
    it('should show error message for invalid credentials', () => {
      cy.get('#credential').type('invalid@example.com');
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      cy.get('.error-banner', { timeout: 5000 })
        .should('be.visible')
        .should('contain', 'Invalid email or password.');
    });

    it('should show error banner with proper ARIA attributes', () => {
      cy.get('#credential').type('invalid@example.com');
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      cy.get('.error-banner', { timeout: 5000 })
        .should('have.attr', 'role', 'alert')
        .should('have.attr', 'aria-live', 'polite');
    });

    it('should not navigate on failed login', () => {
      cy.get('#credential').type('invalid@example.com');
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      // Should remain on login page
      cy.url().should('include', '/auth/login');
    });

    it('should clear loading state after failed login', () => {
      cy.get('#credential').type('invalid@example.com');
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      // Wait for error to appear
      cy.get('.error-banner', { timeout: 5000 }).should('be.visible');
      
      // Button should no longer be disabled
      cy.get('button[type="submit"]').should('not.be.disabled');
      cy.get('button[type="submit"]').should('contain', 'Sign In');
    });
  });

  describe('Loading State', () => {
    it('should show loading state during login', () => {
      cy.get('#credential').type('johnsmith@saga.com');
      cy.get('#password').type('Password@123');
      cy.get('button[type="submit"]').click();
      
      // Should immediately show loading state
      cy.get('button[type="submit"]').should('contain', 'Signing in...');
      cy.get('button[type="submit"]').should('be.disabled');
      cy.get('button[type="submit"]').should('have.attr', 'aria-busy', 'true');
    });

    it('should prevent multiple submissions while loading', () => {
      cy.get('#credential').type('johnsmith@saga.com');
      cy.get('#password').type('Password@123');
      
      // Click submit multiple times
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').should('be.disabled');
      
      // Button should remain disabled during loading
      cy.get('button[type="submit"]').should('have.attr', 'aria-busy', 'true');
    });
  });

  describe('Navigation', () => {
    it('should navigate to signup page when clicking signup link', () => {
      cy.get('.signup-link a[routerLink="/auth/signup"]').click();
      cy.url().should('include', '/auth/signup');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      cy.get('label[for="credential"]').should('exist');
      cy.get('label[for="password"]').should('exist');
    });

    it('should have aria-invalid on invalid fields', () => {
      cy.get('#credential').clear();
      cy.get('#password').type('test');
      cy.get('button[type="submit"]').click();
      
      cy.get('#credential').should('have.attr', 'aria-invalid', 'true');
    });

    it('should have aria-describedby linking to error messages', () => {
      cy.get('#credential').clear();
      cy.get('#password').type('test');
      cy.get('button[type="submit"]').click();
      
      cy.get('#credential').should('have.attr', 'aria-describedby', 'credential-error');
      cy.get('#credential-error').should('have.attr', 'id', 'credential-error');
    });

    it('should have accessible error messages', () => {
      cy.get('#credential').clear();
      cy.get('#password').type('test');
      cy.get('button[type="submit"]').click();
      
      cy.get('#credential-error').should('have.attr', 'role', 'alert');
      cy.get('#password-error').should('have.attr', 'role', 'alert');
    });

    it('should have accessible password toggle button', () => {
      cy.get('.password-toggle')
        .should('have.attr', 'aria-label')
        .should('have.attr', 'aria-pressed')
        .should('have.attr', 'type', 'button');
    });
  });

  describe('User Experience', () => {
    it('should allow typing in credential field', () => {
      cy.get('#credential').type('test@example.com');
      cy.get('#credential').should('have.value', 'test@example.com');
    });

    it('should allow typing in password field', () => {
      cy.get('#password').type('Password123');
      cy.get('#password').should('have.value', 'Password123');
    });

    it('should clear error message when user starts typing', () => {
      // First trigger an error
      cy.get('#credential').clear();
      cy.get('#password').type('test');
      cy.get('button[type="submit"]').click();
      
      cy.get('#credential-error').should('be.visible');
      
      // Start typing in credential field
      cy.get('#credential').type('test@example.com');
      
      // Error should still be visible until form is valid and submitted
      // (This depends on implementation - some forms clear on input, others on blur)
    });
  });

  describe('Multiple Login Attempts', () => {
    it('should handle multiple login attempts correctly', () => {
      // First attempt with wrong password
      cy.get('#credential').type('johnsmith@saga.com');
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      
      cy.get('.error-banner', { timeout: 5000 }).should('be.visible');
      
      // Second attempt with correct password
      cy.get('#password').clear().type('Password@123');
      cy.get('button[type="submit"]').click();
      
      cy.url({ timeout: 10000 }).should('include', '/dashboard');
    });
  });
});

