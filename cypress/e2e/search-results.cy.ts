/// <reference types="cypress" />
function searchFor(term: string): void {
  cy.get('.search-input').clear().type(`${term}{enter}`);
  cy.url({ timeout: 10000 }).should('include', '/search-results');
  cy.wait(1000);
}

describe('Search Results Page', () => {
  beforeEach(() => {
    cy.login('johnsmith@saga.com', 'Password@123');
  });

  describe('Search Navigation', () => {
    it('should navigate to search results when pressing Enter in the search bar', () => {
      searchFor('angular');
      cy.url().should('include', 'q=angular');
    });

    it('should not navigate when search input is empty', () => {
      cy.get('.search-input').clear().type('{enter}');
      cy.url().should('include', '/dashboard');
    });

    it('should display the search results page title', () => {
      searchFor('angular');
      cy.get('h1').should('contain', 'Search Results');
    });
  });

  describe('Successful Search with Many Results', () => {
    beforeEach(() => {
      searchFor('angular');
    });

    it('should display results in a table', () => {
      cy.get('.table-container').should('be.visible');
      cy.get('table.striped').should('be.visible');
      cy.get('table tbody tr').should('have.length', 5);
    });

    it('should display table headers', () => {
      cy.get('table thead').within(() => {
        cy.contains('Cover').should('be.visible');
        cy.contains('Title').should('be.visible');
        cy.contains('Author').should('be.visible');
        cy.contains('Shelves').should('be.visible');
      });
    });

    it('should sort results alphabetically by name', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.book-title').should('contain', 'Angular Advocate');
      });
    });

    it('should show 5 results per page', () => {
      cy.get('table tbody tr').should('have.length', 5);
      cy.get('.pagination-info').should('contain', 'Showing 1 to 5 of 20 results');
    });

    it('should not show the empty state message', () => {
      cy.get('.empty-state').should('not.exist');
    });
  });

  describe('Table Content Verification', () => {
    beforeEach(() => {
      searchFor('angular');
    });

    it('should display book cover images', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.book-cover').should('be.visible');
        cy.get('.book-cover').should('have.attr', 'src');
        cy.get('.book-cover').should('have.attr', 'alt').and('contain', 'cover');
      });
    });

    it('should display book titles as links', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.book-title').should('be.visible');
        cy.get('.book-title').invoke('text').should('not.be.empty');
      });
    });

    it('should display book authors', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.author-cell').should('be.visible');
        cy.get('.author-cell').invoke('text').should('not.be.empty');
      });
    });

    it('should display shelf badges container', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.shelf-badges').should('exist');
      });
    });
  });

  describe('Shelf and Status Badges', () => {
    it('should display status and shelf badges for books in user library', () => {
      searchFor('Pro Angular');

      cy.get('table tbody tr').should('have.length', 1);
      cy.get('table tbody tr').first().within(() => {
        cy.get('.book-title').should('contain', 'Pro Angular');
        cy.get('.shelf-badges').within(() => {
          cy.contains('Reading').should('be.visible');
          cy.contains('Angular').should('be.visible');
        });
      });
    });

    it('should show multiple shelf badges when a book is on multiple shelves', () => {
      searchFor('angular');

      // "Angular for Material Design" (4th row on page 1) has shelves: Angular, Angular Material
      cy.get('table tbody tr').eq(3).within(() => {
        cy.get('.book-title').should('contain', 'Angular for Material Design');
        cy.get('.shelf-badges .shelf-badge').should('have.length.at.least', 1);
      });
    });

    it('should not display status or shelf badges for books not in library', () => {
      searchFor('python');

      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).within(() => {
          cy.get('.shelf-badges').find('.shelf-badge').should('not.exist');
        });
      });
    });
  });

  describe('In Library vs Add to Shelf Buttons', () => {
    it('should show "In Library" button for books in the user library', () => {
      searchFor('Pro Angular');

      cy.get('table tbody tr').first().within(() => {
        cy.get('.btn-in-library').should('be.visible').and('contain', 'In Library');
        cy.get('.btn-add-to-shelf').should('not.exist');
      });
    });

    it('should show "Add to Shelf" button for books not in the user library', () => {
      searchFor('python');

      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).within(() => {
          cy.get('.btn-add-to-shelf').should('be.visible').and('contain', 'Add to Shelf');
          cy.get('.btn-in-library').should('not.exist');
        });
      });
    });

    it('should show a mix of buttons when results contain both library and non-library books', () => {
      searchFor('JavaScript');

      // All 3 JavaScript books are in user 1's library
      cy.get('table tbody tr').should('have.length', 3);
      cy.get('.btn-in-library').should('have.length', 3);
    });
  });

  describe('Empty Search Results', () => {
    it('should show empty state when no books match', () => {
      searchFor('xyznonexistent');

      cy.get('.empty-state').should('be.visible');
      cy.get('.empty-state p').should('contain', 'No results found. Try a different search term.');
    });

    it('should not show table rows when no results are found', () => {
      searchFor('xyznonexistent');

      cy.get('table tbody tr').should('not.exist');
    });

    it('should not show pagination when no results are found', () => {
      searchFor('xyznonexistent');

      cy.get('.pagination').should('not.exist');
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      searchFor('angular');
    });

    it('should display pagination info', () => {
      cy.get('.pagination-info').should('be.visible');
      cy.get('.pagination-info').should('contain', 'Showing 1 to 5 of 20 results');
    });

    it('should display pagination controls', () => {
      cy.get('.pagination-controls').should('be.visible');
      cy.get('.pagination-btn').should('have.length.at.least', 3);
    });

    it('should disable previous button on first page', () => {
      cy.get('.pagination-controls .pagination-btn').first().should('be.disabled');
    });

    it('should enable next button when more pages exist', () => {
      cy.get('.pagination-controls .pagination-btn').last().should('not.be.disabled');
    });

    it('should have first page button active by default', () => {
      cy.get('.pagination-controls .pagination-btn').contains('1').should('have.class', 'active');
    });

    it('should navigate to next page', () => {
      cy.get('.pagination-controls .pagination-btn').last().click();
      cy.wait(500);

      cy.get('.pagination-info').should('contain', 'Showing 6 to 10 of 20 results');
      cy.get('.pagination-controls .pagination-btn').contains('2').should('have.class', 'active');
      cy.get('.pagination-controls .pagination-btn').first().should('not.be.disabled');
    });

    it('should navigate to previous page', () => {
      // Go to page 2
      cy.get('.pagination-controls .pagination-btn').last().click();
      cy.wait(500);

      // Go back to page 1
      cy.get('.pagination-controls .pagination-btn').first().click();
      cy.wait(500);

      cy.get('.pagination-info').should('contain', 'Showing 1 to 5 of 20 results');
      cy.get('.pagination-controls .pagination-btn').first().should('be.disabled');
    });

    it('should navigate to a specific page by clicking page number', () => {
      cy.get('.pagination-controls .pagination-btn').contains('3').click();
      cy.wait(500);

      cy.get('.pagination-info').should('contain', 'Showing 11 to 15 of 20 results');
      cy.get('.pagination-controls .pagination-btn').contains('3').should('have.class', 'active');
    });

    it('should disable next button on last page', () => {
      cy.get('.pagination-controls .pagination-btn').contains('4').click();
      cy.wait(500);

      cy.get('.pagination-controls .pagination-btn').last().should('be.disabled');
      cy.get('.pagination-info').should('contain', 'Showing 16 to 20 of 20 results');
    });

    it('should show different results on each page', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.book-title').should('contain', 'Angular Advocate');
      });

      cy.get('.pagination-controls .pagination-btn').contains('2').click();
      cy.wait(500);

      cy.get('table tbody tr').first().within(() => {
        cy.get('.book-title').should('contain', 'Angular Projects');
      });
    });

    it('should not show pagination for small result sets', () => {
      cy.get('.search-input').clear().type('Pro Angular{enter}');
      cy.wait(1000);

      cy.get('table tbody tr').should('have.length', 1);
      cy.get('.pagination-info').should('contain', 'Showing 1 to 1 of 1 results');
    });
  });

  describe('New Search Resets State', () => {
    it('should reset to page 1 when performing a new search', () => {
      searchFor('angular');

      // Navigate to page 2
      cy.get('.pagination-controls .pagination-btn').contains('2').click();
      cy.wait(500);
      cy.get('.pagination-info').should('contain', 'Showing 6 to 10');

      // Perform a new search
      searchFor('python');

      cy.get('.pagination-info').should('contain', 'Showing 1 to 2 of 2 results');
    });

    it('should update results when searching for a different term', () => {
      searchFor('angular');
      cy.get('table tbody tr').should('have.length', 5);

      searchFor('python');
      cy.get('table tbody tr').should('have.length', 2);
      cy.get('table tbody tr').first().within(() => {
        cy.get('.book-title').should('contain', 'Python');
      });
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      searchFor('angular');
    });

    it('should display correctly on mobile viewport', () => {
      cy.viewport(375, 667);
      cy.get('h1').should('be.visible');
      cy.get('table.striped').should('be.visible');
    });

    it('should display correctly on tablet viewport', () => {
      cy.viewport(768, 1024);
      cy.get('h1').should('be.visible');
      cy.get('table.striped').should('be.visible');
      cy.get('.pagination').should('be.visible');
    });

    it('should display correctly on desktop viewport', () => {
      cy.viewport(1280, 720);
      cy.get('h1').should('be.visible');
      cy.get('table.striped').should('be.visible');
      cy.get('.pagination').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      searchFor('angular');
    });

    it('should have a proper heading', () => {
      cy.get('h1').should('exist').and('contain', 'Search Results');
    });

    it('should have alt text on book cover images', () => {
      cy.get('.book-cover').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt').and('not.be.empty');
      });
    });

    it('should have type="button" on action buttons', () => {
      cy.get('.btn-in-library, .btn-add-to-shelf').each(($btn) => {
        cy.wrap($btn).should('have.attr', 'type', 'button');
      });
    });

    it('should have type="button" on pagination buttons', () => {
      cy.get('.pagination-btn').each(($btn) => {
        cy.wrap($btn).should('have.attr', 'type', 'button');
      });
    });

    it('should have accessible search input', () => {
      cy.get('.search-input').should('have.attr', 'type', 'search');
      cy.get('.search-input').should('have.attr', 'placeholder');
    });
  });
});
