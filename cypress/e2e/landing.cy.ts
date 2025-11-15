describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('/landing');
  });

  describe('Page Load and Structure', () => {
    it('should load the landing page successfully', () => {
      cy.url().should('include', '/landing');
      cy.get('body').should('be.visible');
    });

    it('should display the hero section', () => {
      cy.get('.hero-section').should('be.visible');
      cy.get('.hero-section h1').should('contain', 'Discover Your Next Great Read');
      cy.get('.hero-section .hero-description').should('be.visible');
    });

    it('should display the features section', () => {
      cy.get('.features-section').should('be.visible');
      cy.get('.features-section .section-title').should('contain', 'All Your Books, Perfectly Organized');
    });

    it('should display the testimonials section', () => {
      cy.get('.testimonials-section').should('be.visible');
      cy.get('.testimonials-section .section-title').should('contain', 'Hear from Fellow Book Lovers');
    });

    it('should display the start section', () => {
      cy.get('.start-section').should('be.visible');
      cy.get('.start-section .section-title').should('contain', 'Ready to Start Your Journey?');
    });
  });

  describe('Hero Section', () => {
    it('should display hero heading', () => {
      cy.get('.hero-section h1').should('contain', 'Discover Your Next Great Read');
    });

    it('should display hero description', () => {
      cy.get('.hero-section .hero-description').should('contain', 'Saga helps you organize your reading life');
    });

    it('should display hero illustration', () => {
      cy.get('.hero-section img[alt="Reading illustration"]').should('be.visible');
    });

    it('should display Sign Up button in hero section', () => {
      cy.get('.hero-section .cta-button')
        .should('be.visible')
        .should('contain', "Sign Up Now - It's Free");
    });
  });

  describe('Features Section', () => {
    it('should display all 6 feature cards', () => {
      cy.get('.features-grid .feature-card').should('have.length', 6);
    });

    it('should display "Track Your Progress" feature', () => {
      cy.get('.features-grid .feature-card').contains('Track Your Progress').should('be.visible');
      cy.get('.features-grid .feature-card').contains('See how far you are in any book').should('be.visible');
    });

    it('should display "Find Any Book" feature', () => {
      cy.get('.features-grid .feature-card').contains('Find Any Book').should('be.visible');
      cy.get('.features-grid .feature-card').contains('Search a vast library').should('be.visible');
    });

    it('should display "Create Custom Bookshelves" feature', () => {
      cy.get('.features-grid .feature-card').contains('Create Custom Bookshelves').should('be.visible');
      cy.get('.features-grid .feature-card').contains('Organize your collection your way').should('be.visible');
    });

    it('should display "Manage Your Reading Status" feature', () => {
      cy.get('.features-grid .feature-card').contains('Manage Your Reading Status').should('be.visible');
      cy.get('.features-grid .feature-card').contains("Easily mark books as 'Want to Read'").should('be.visible');
    });

    it('should display "Tag and Filter" feature', () => {
      cy.get('.features-grid .feature-card').contains('Tag and Filter').should('be.visible');
      cy.get('.features-grid .feature-card').contains('Add custom tags to find the exact book').should('be.visible');
    });

    it('should display "Rate and Review" feature', () => {
      cy.get('.features-grid .feature-card').contains('Rate and Review').should('be.visible');
      cy.get('.features-grid .feature-card').contains('Share your thoughts and add personal comments').should('be.visible');
    });

    it('should display feature icons', () => {
      cy.get('.features-grid .feature-card .feature-icon svg').should('have.length', 6);
    });
  });

  describe('Testimonials Section', () => {
    it('should display all 3 testimonials', () => {
      cy.get('.testimonials-grid .testimonial-card').should('have.length', 3);
    });

    it('should display Alex Johnson testimonial', () => {
      cy.get('.testimonials-grid .testimonial-card')
        .contains('Alex Johnson')
        .should('be.visible');
      cy.get('.testimonials-grid .testimonial-card')
        .contains('Saga has completely transformed my reading habits')
        .should('be.visible');
    });

    it('should display Maria Garcia testimonial', () => {
      cy.get('.testimonials-grid .testimonial-card')
        .contains('Maria Garcia')
        .should('be.visible');
      cy.get('.testimonials-grid .testimonial-card')
        .contains('I love how I can organize my virtual bookshelves')
        .should('be.visible');
    });

    it('should display David Chen testimonial', () => {
      cy.get('.testimonials-grid .testimonial-card')
        .contains('David Chen')
        .should('be.visible');
      cy.get('.testimonials-grid .testimonial-card')
        .contains('The search and filter functions are incredibly powerful')
        .should('be.visible');
    });

    it('should display testimonial avatars', () => {
      cy.get('.testimonials-grid .testimonial-card .author-avatar svg').should('have.length', 3);
    });
  });

  describe('Start Section', () => {
    it('should display start section heading', () => {
      cy.get('.start-section .section-title').should('contain', 'Ready to Start Your Journey?');
    });

    it('should display start section description', () => {
      cy.get('.start-section p').should('contain', 'Join Saga today and discover a new way to manage your reading life.');
    });

    it('should display Get Started button', () => {
      cy.get('.start-section .cta-button-secondary')
        .should('be.visible')
        .should('contain', 'Get Started!');
    });
  });

  describe('Navigation', () => {
    it('should navigate to signup page when clicking hero Sign Up button', () => {
      cy.get('.hero-section .cta-button').click();
      cy.url().should('include', '/auth/signup');
    });

    it('should navigate to signup page when clicking Get Started button', () => {
      cy.get('.start-section .cta-button-secondary').click();
      cy.url().should('include', '/auth/signup');
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport(375, 667);
      cy.get('.hero-section').should('be.visible');
      cy.get('.features-section').should('be.visible');
    });

    it('should display correctly on tablet viewport', () => {
      cy.viewport(768, 1024);
      cy.get('.hero-section').should('be.visible');
      cy.get('.features-section').should('be.visible');
    });

    it('should display correctly on desktop viewport', () => {
      cy.viewport(1280, 720);
      cy.get('.hero-section').should('be.visible');
      cy.get('.features-section').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('exist');
      cy.get('h2').should('exist');
    });

    it('should have accessible images with alt text', () => {
      cy.get('img[alt="Reading illustration"]').should('be.visible');
    });

    it('should have clickable buttons', () => {
      cy.get('.cta-button').should('be.visible').should('not.be.disabled');
      cy.get('.cta-button-secondary').should('be.visible').should('not.be.disabled');
    });
  });
});

