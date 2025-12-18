/// <reference types="cypress" />
describe('My Books Page', () => {
  beforeEach(() => {
    // Login before each test to access the my-books page
    cy.login('johnsmith@saga.com', 'Password@123');
    cy.visit('/my-books');
    // Wait for the page to load and books to be fetched
    cy.get('h1').should('contain', 'My Books');
    cy.wait(1000); // Wait for books to load
  });

  describe('Page Load and Structure', () => {
    it('should load the my-books page successfully', () => {
      cy.url().should('include', '/my-books');
      cy.get('body').should('be.visible');
    });

    it('should display the page title', () => {
      cy.get('h1').should('contain', 'My Books');
    });

    it('should display the filter row', () => {
      cy.get('.filter-row').should('be.visible');
      cy.get('.filter-chips').should('be.visible');
      cy.get('.filter-input').should('be.visible');
    });

    it('should display the books table', () => {
      cy.get('.table-container').should('be.visible');
      cy.get('table.striped').should('be.visible');
    });

    it('should display table headers', () => {
      cy.get('table thead').within(() => {
        cy.contains('Cover').should('be.visible');
        cy.contains('Title').should('be.visible');
        cy.contains('Author').should('be.visible');
        cy.contains('Shelves').should('be.visible');
        cy.contains('Status').should('be.visible');
        cy.contains('Date Read').should('be.visible');
        cy.contains('Date Added').should('be.visible');
      });
    });

    it('should display books in the table', () => {
      cy.get('table tbody tr').should('have.length.at.least', 1);
    });
  });

  describe('Status Filter Chips', () => {
    it('should display all status filter chips', () => {
      cy.get('.filter-chips .chip').should('have.length.at.least', 2);
      cy.get('.filter-chips .chip').first().should('contain', 'All');
    });

    it('should display count badges on chips', () => {
      cy.get('.filter-chips .chip').first().within(() => {
        cy.get('.chip-count').should('be.visible');
      });
    });

    it('should have "All" chip active by default', () => {
      cy.get('.filter-chips .chip').first().should('have.class', 'active');
    });

    it('should filter books when clicking status chip', () => {
      // Get initial count
      cy.get('table tbody tr').then(($rows) => {
        const initialCount = $rows.length;

        // Click a status chip (not "All")
        cy.get('.filter-chips .chip').eq(1).click();
        cy.wait(500);

        // Should show filtered results
        cy.get('table tbody tr').should('have.length.at.most', initialCount);
        
        // The clicked chip should be active
        cy.get('.filter-chips .chip').eq(1).should('have.class', 'active');
      });
    });

    it('should show all books when clicking "All" chip', () => {
      // First filter by a specific status
      cy.get('.filter-chips .chip').eq(1).click();
      cy.wait(500);

      // Then click "All"
      cy.get('.filter-chips .chip').first().click();
      cy.wait(500);

      // Should show all books
      cy.get('table tbody tr').should('have.length.at.least', 1);
      cy.get('.filter-chips .chip').first().should('have.class', 'active');
    });
  });

  describe('Search Functionality', () => {
    it('should display search input', () => {
      cy.get('.filter-input').should('be.visible');
      cy.get('.filter-input').should('have.attr', 'placeholder', 'Filter by title...');
    });

    it('should filter books by title when typing in search', () => {
      // Get first book title
      cy.get('table tbody tr').first().within(() => {
        cy.get('.book-title').invoke('text').then((title) => {
          const searchTerm = title.substring(0, 5);
          
          // Type in search
          cy.get('.filter-input').type(searchTerm);
          cy.wait(500);

          // Should show filtered results
          cy.get('table tbody tr').should('have.length.at.least', 1);
          cy.get('.book-title').should('contain', searchTerm);
        });
      });
    });

    it('should show empty state when search matches nothing', () => {
      cy.get('.filter-input').type('NonExistentBook12345');
      cy.wait(500);
      cy.get('.empty-state').should('be.visible');
      cy.get('.empty-state').should('contain', 'No books found');
    });

    it('should clear filter when search is cleared', () => {
      // First search
      cy.get('.filter-input').type('Test');
      cy.wait(500);

      // Clear search
      cy.get('.filter-input').clear();
      cy.wait(500);

      // Should show all books again
      cy.get('table tbody tr').should('have.length.at.least', 1);
    });

    it('should combine search and status filters', () => {
      // Select a specific status
      cy.get('.filter-chips .chip').eq(1).click();
      cy.wait(500);

      // Then search
      cy.get('.filter-input').type('Angular');
      cy.wait(500);

      // Should show books matching both filters
      cy.get('table tbody tr').should('exist');
    });
  });

  describe('Sorting Functionality', () => {
    it('should sort by title when clicking title header', () => {
      cy.get('table thead').contains('Title').click();
      cy.wait(500);
      
      // Check sort icon appears
      cy.get('table thead').contains('Title').parent().find('.sort-icon').should('be.visible');
    });

    it('should toggle sort direction when clicking same header', () => {
      // First click - descending
      cy.get('table thead').contains('Title').click();
      cy.wait(500);
      cy.get('table thead').contains('Title').parent().find('.sort-icon').should('contain', '↓');

      // Second click - ascending
      cy.get('table thead').contains('Title').click();
      cy.wait(500);
      cy.get('table thead').contains('Title').parent().find('.sort-icon').should('contain', '↑');
    });

    it('should sort by author when clicking author header', () => {
      cy.get('table thead').contains('Author').click();
      cy.wait(500);
      
      cy.get('table thead').contains('Author').parent().find('.sort-icon').should('be.visible');
    });

    it('should sort by status when clicking status header', () => {
      cy.get('table thead').contains('Status').click();
      cy.wait(500);
      
      cy.get('table thead').contains('Status').parent().find('.sort-icon').should('be.visible');
    });

    it('should sort by date read when clicking date read header', () => {
      cy.get('table thead').contains('Date Read').click();
      cy.wait(500);
      
      cy.get('table thead').contains('Date Read').parent().find('.sort-icon').should('be.visible');
    });

    it('should have date added as default sort column', () => {
      cy.get('table thead').contains('Date Added').parent().should('have.class', 'active-sort');
      cy.get('table thead').contains('Date Added').parent().find('.sort-icon').should('be.visible');
    });
  });

  describe('Book Display', () => {
    it('should display book covers', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.book-cover').should('be.visible');
        cy.get('.book-cover').should('have.attr', 'src');
        cy.get('.book-cover').should('have.attr', 'alt');
      });
    });

    it('should display book titles as links', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.book-title').should('be.visible');
        cy.get('.book-title').should('have.attr', 'href');
      });
    });

    it('should display book authors', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.author-cell').should('be.visible');
        cy.get('.author-cell').invoke('text').should('not.be.empty');
      });
    });

    it('should display shelf badges', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.shelf-badges').should('exist');
      });
    });

    it('should display status badges with correct styling', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.status-cell .status-badge').should('be.visible');
      });
    });

    it('should display formatted dates', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.date-cell').should('have.length', 2);
      });
    });

    it('should display action button', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.action-btn').should('be.visible');
        cy.get('.action-btn').should('have.attr', 'aria-label', 'More options');
      });
    });
  });

  describe('Pagination', () => {
    it('should display pagination info', () => {
      cy.get('.pagination-info').should('be.visible');
      cy.get('.pagination-info').should('contain', 'Showing');
      cy.get('.pagination-info').should('contain', 'results');
    });

    it('should display pagination controls', () => {
      cy.get('.pagination-controls').should('be.visible');
      cy.get('.pagination-btn').should('have.length.at.least', 3);
    });

    it('should disable previous button on first page', () => {
      cy.get('.pagination-controls .pagination-btn').first().should('be.disabled');
    });

    it('should navigate to next page when clicking next button', () => {
      // Check if there are multiple pages
      cy.get('.pagination-controls .pagination-btn').then(($btns) => {
        if ($btns.length > 2) {
          // Click next button
          cy.get('.pagination-controls .pagination-btn').last().click();
          cy.wait(500);
          
          // Previous button should now be enabled
          cy.get('.pagination-controls .pagination-btn').first().should('not.be.disabled');
        }
      });
    });

    it('should navigate to previous page when clicking previous button', () => {
      // Go to second page first
      cy.get('.pagination-controls .pagination-btn').then(($btns) => {
        if ($btns.length > 2) {
          cy.get('.pagination-controls .pagination-btn').last().click();
          cy.wait(500);
          
          // Click previous button
          cy.get('.pagination-controls .pagination-btn').first().click();
          cy.wait(500);
          
          // Should be on first page again
          cy.get('.pagination-controls .pagination-btn').first().should('be.disabled');
        }
      });
    });

    it('should navigate to specific page when clicking page number', () => {
      cy.get('.pagination-controls .pagination-btn').then(($btns) => {
        if ($btns.length > 3) {
          // Click on page 2 (skip previous button)
          cy.get('.pagination-controls .pagination-btn').eq(1).click();
          cy.wait(500);
          
          // That button should be active
          cy.get('.pagination-controls .pagination-btn').eq(1).should('have.class', 'active');
        }
      });
    });

    it('should show ellipsis for many pages', () => {
      // This test depends on having enough books to create many pages
      cy.get('body').then(($body) => {
        if ($body.find('.pagination-ellipsis').length > 0) {
          cy.get('.pagination-ellipsis').should('contain', '...');
        }
      });
    });

    it('should reset to page 1 when applying filter', () => {
      // Go to page 2 if possible
      cy.get('.pagination-controls .pagination-btn').then(($btns) => {
        if ($btns.length > 2) {
          cy.get('.pagination-controls .pagination-btn').last().click();
          cy.wait(500);
          
          // Apply a filter
          cy.get('.filter-chips .chip').eq(1).click();
          cy.wait(500);
          
          // Should be back on page 1
          cy.get('.pagination-info').should('contain', 'Showing 1 to');
        }
      });
    });

    it('should reset to page 1 when searching', () => {
      // Go to page 2 if possible
      cy.get('.pagination-controls .pagination-btn').then(($btns) => {
        if ($btns.length > 2) {
          cy.get('.pagination-controls .pagination-btn').last().click();
          cy.wait(500);
          
          // Search
          cy.get('.filter-input').type('Book');
          cy.wait(500);
          
          // Should be back on page 1
          cy.get('.pagination-info').should('contain', 'Showing 1 to');
        }
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no books match filter', () => {
      cy.get('.filter-input').type('NonExistentBookTitle123456');
      cy.wait(500);
      
      cy.get('.empty-state').should('be.visible');
      cy.get('.empty-state p').should('contain', 'No books found');
    });

    it('should hide table when showing empty state', () => {
      cy.get('.filter-input').type('NonExistentBookTitle123456');
      cy.wait(500);
      
      cy.get('table tbody tr').should('not.exist');
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport(375, 667);
      cy.get('h1').should('be.visible');
      cy.get('.filter-row').should('be.visible');
      cy.get('table.striped').should('be.visible');
    });

    it('should display correctly on tablet viewport', () => {
      cy.viewport(768, 1024);
      cy.get('h1').should('be.visible');
      cy.get('.filter-row').should('be.visible');
      cy.get('table.striped').should('be.visible');
    });

    it('should display correctly on desktop viewport', () => {
      cy.viewport(1280, 720);
      cy.get('h1').should('be.visible');
      cy.get('.filter-row').should('be.visible');
      cy.get('table.striped').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible action buttons', () => {
      cy.get('.action-btn').first().should('have.attr', 'type', 'button');
      cy.get('.action-btn').first().should('have.attr', 'aria-label');
    });

    it('should have accessible filter chips', () => {
      cy.get('.filter-chips .chip').each(($chip) => {
        cy.wrap($chip).should('have.attr', 'type', 'button');
      });
    });

    it('should have accessible pagination buttons', () => {
      cy.get('.pagination-btn').each(($btn) => {
        cy.wrap($btn).should('have.attr', 'type', 'button');
      });
    });
  });
});
