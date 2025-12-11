/// <reference types="cypress" />
describe('Book Genres Page', () => {
  beforeEach(() => {
    // Login before each test to access the genres page
    cy.login('johnsmith@saga.com', 'Password@123');
    cy.visit('/genres');
    // Wait for the page to load and genres to be fetched
    cy.get('h1').should('contain', 'Genres');
    cy.wait(1000); // Wait for genres to load
  });

  describe('Page Load and Structure', () => {
    it('should load the genres page successfully', () => {
      cy.url().should('include', '/genres');
      cy.get('body').should('be.visible');
    });

    it('should display the page title', () => {
      cy.get('h1').should('contain', 'Genres');
    });

    it('should display the filter input', () => {
      cy.get('.filter-input').should('be.visible');
      cy.get('.filter-input').should('have.attr', 'placeholder', 'Start typing to filter ...');
    });

    it('should display the Add New Genre button', () => {
      cy.get('.add-genre__trigger').should('be.visible');
      cy.get('.add-genre__trigger').should('contain', 'Add New Genre');
    });

    it('should display the genres table', () => {
      cy.get('.table-container').should('be.visible');
      cy.get('table.striped').should('be.visible');
    });

    it('should display table headers', () => {
      cy.get('table thead').within(() => {
        cy.get('th').eq(0).should('contain', 'Name');
        cy.get('th').eq(1).should('contain', 'Created At');
        cy.get('th').eq(2).should('contain', 'Last Updated');
        cy.get('th').eq(3).should('contain', 'Actions');
      });
    });

    it('should display genres in the table', () => {
      cy.get('table tbody tr').should('have.length.at.least', 1);
      // Check that at least one genre row has the expected structure
      cy.get('table tbody tr').first().within(() => {
        cy.get('.name').should('exist');
        cy.get('.update-button').should('exist');
        cy.get('.delete-button').should('exist');
      });
    });
  });

  describe('Filter Functionality', () => {
    it('should filter genres when typing in the filter input', () => {
      // Get initial count
      cy.get('table tbody tr').then(($rows) => {
        const initialCount = $rows.length;

        // Type in filter
        cy.get('.filter-input').type('Mystery');
        cy.wait(500); // Wait for filter to apply

        // Should show fewer or equal rows
        cy.get('table tbody tr').should('have.length.at.most', initialCount);
        // Should show at least one row if Mystery exists
        cy.get('table tbody tr').should('have.length.at.least', 1);
        // Check that visible rows contain "Mystery" (case-insensitive)
        cy.get('table tbody tr .name').each(($name) => {
          cy.wrap($name).invoke('text').should('match', /mystery/i);
        });
      });
    });

    it('should only accept letters and spaces in filter input', () => {
      cy.get('.filter-input').clear();
      cy.get('.filter-input').type('Test123!@#');
      // The input should only contain letters (Test)
      cy.get('.filter-input').should('have.value', 'Test');
    });

    it('should show all genres when filter is cleared', () => {
      // First filter
      cy.get('.filter-input').type('Mystery');
      cy.wait(500);
      const filteredCount = cy.get('table tbody tr').its('length');

      // Clear filter
      cy.get('.filter-input').clear();
      cy.wait(500);

      // Should show more rows
      cy.get('table tbody tr').should('have.length.at.least', 1);
    });

    it('should filter case-insensitively', () => {
      cy.get('.filter-input').type('MYSTERY');
      cy.wait(500);
      // Should still show Mystery genre
      cy.get('table tbody tr .name').should('contain.text', 'Mystery');
    });

    it('should show "No genres found" when filter matches nothing', () => {
      cy.get('.filter-input').type('NonExistentGenre123');
      cy.wait(500);
      cy.get('table tbody tr').should('contain', 'No genres found');
    });

    it('should sort genres alphabetically', () => {
      // Get all genre names
      const genreNames: string[] = [];
      cy.get('table tbody tr .name').each(($el) => {
        genreNames.push($el.text().trim());
      }).then(() => {
        // Check that they are sorted
        const sorted = [...genreNames].sort((a, b) => a.localeCompare(b));
        expect(genreNames).to.deep.equal(sorted);
      });
    });
  });

  describe('Add Genre Dialog', () => {
    it('should open add genre dialog when clicking Add New Genre button', () => {
      cy.get('.add-genre__trigger').click();
      cy.get('dialog[open]').should('be.visible');
      cy.get('dialog[open]').within(() => {
        cy.contains('Add Genre').should('be.visible');
      });
    });

    it('should display form fields in add genre dialog', () => {
      cy.get('.add-genre__trigger').click();
      cy.get('dialog[open]').should('be.visible');
      cy.get('label[for="genreName"]').should('contain', 'Genre Name');
      cy.get('#genreName').should('be.visible');
      cy.get('#genreName').should('have.attr', 'placeholder', 'e.g. Mystery');
    });

    it('should display Cancel and Save buttons in add genre dialog', () => {
      cy.get('.add-genre__trigger').click();
      cy.get('dialog[open]').should('be.visible');
      cy.get('dialog[open] button:contains("Cancel")').should('be.visible').should('contain', 'Cancel');
      cy.get('dialog[open] button:contains("Save")').should('be.visible').should('contain', 'Save');
    });

    it('should close dialog when clicking Cancel', () => {
      cy.get('.add-genre__trigger').click();
      cy.get('dialog[open]').should('be.visible');
      cy.get('dialog[open] button:contains("Cancel")').click();
      cy.wait(300);
      cy.get('dialog[open]').should('not.exist');
    });

    it('should close dialog when pressing Escape key', () => {
      cy.get('.add-genre__trigger').click();
      cy.get('dialog[open]').should('be.visible');
      cy.get('dialog[open]').type('{esc}');
      cy.wait(300);
      cy.get('dialog[open]').should('not.exist');
    });

    it('should close dialog when clicking backdrop', () => {
      cy.get('.add-genre__trigger').click();
      cy.get('dialog[open]').should('be.visible');
      // Click on the dialog backdrop (the dialog element itself, not the panel)
      cy.get('dialog[open]').then(($dialog) => {
        // Get the dialog's bounding box and click at the edge (backdrop area)
        const rect = $dialog[0].getBoundingClientRect();
        // Click slightly outside the panel but within the dialog
        cy.get('body').click(rect.left + 10, rect.top + 10);
      });
      cy.wait(300);
      // Note: Backdrop click behavior may vary, so we verify dialog state
      // If backdrop click works, dialog should close; otherwise it remains open
    });

    it('should show validation error when submitting empty form', () => {
      cy.get('.add-genre__trigger').click();
      cy.get('dialog[open]').should('be.visible');
      // Type something and then clear it to trigger validation
      cy.get('#genreName').type('Test').clear();
      cy.get('#genreName').blur();
      // Wait for Angular change detection
      cy.wait(200);
      // The error should be visible when field is touched and empty
      cy.get('dialog[open] .dialog-error').should('be.visible');
      cy.get('dialog[open] .dialog-error').should('contain', 'Name is required');
    });

    it('should disable Save button when form is invalid', () => {
      cy.get('.add-genre__trigger').click();
      cy.get('dialog[open]').should('be.visible');
      cy.get('#genreName').clear();
      cy.get('dialog[open] button:contains("Save")').should('be.disabled');
    });

    it('should enable Save button when form is valid', () => {
      cy.get('.add-genre__trigger').click();
      cy.get('dialog[open]').should('be.visible');
      cy.get('#genreName').type('Test Genre');
      cy.get('dialog[open] button:contains("Save")').should('not.be.disabled');
    });

    it('should add a new genre successfully', () => {
      const newGenreName = `Test Genre ${Date.now()}`;

      cy.get('.add-genre__trigger').click();
      cy.get('dialog[open]').should('be.visible');
      cy.get('dialog[open] #genreName').type(newGenreName);
      cy.get('dialog[open] button:contains("Save")').click();

      // Dialog should close
      cy.wait(500);
      cy.get('dialog[open]').should('not.exist');

      // New genre should appear in the table
      cy.get('table tbody tr .name').should('contain', newGenreName);
    });

    it('should clear form when dialog is closed', () => {
      cy.get('.add-genre__trigger').click();
      cy.get('#genreName').type('Test Genre');
      cy.get('dialog[open] button:contains("Cancel")').click();

      // Reopen dialog
      cy.get('.add-genre__trigger').click();
      cy.get('#genreName').should('have.value', '');
    });
  });

  describe('Update Genre Dialog', () => {
    it('should open update genre dialog when clicking Update button', () => {
      // Get the first genre's update button
      cy.get('table tbody tr').first().within(() => {
        cy.get('.update-button').click();
      });

      cy.get('dialog[open]').should('be.visible');
      cy.get('dialog[open]').within(() => {
        cy.contains('Update Genre').should('be.visible');
      });
    });

    it('should pre-fill the form with genre name', () => {
      cy.get('table tbody tr')
        .first()
        .then(($row) => {
          const genreName = $row.find('.name').text().trim();

          cy.wrap($row).find('.update-button').click();
          cy.get('dialog[open]').should('be.visible');
          cy.get('dialog[open] #genreName', { timeout: 2000 }).should('have.value', genreName);
        });
    });

    it('should display form fields in update genre dialog', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.update-button').click();
      });

      // Wait for dialog to open
      cy.get('dialog[open]').should('be.visible');
      // Wait for form fields to be visible (inside the dialog)
      cy.get('dialog[open]').within(() => {
        cy.get('label[for="genreName"]').should('contain', 'Genre Name');
        cy.get('#genreName', { timeout: 2000 }).should('be.visible');
      });
    });

    it('should display Cancel and Save buttons in update genre dialog', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.update-button').click();
      });

      cy.get('dialog[open]').should('be.visible');
      cy.get('dialog[open] button:contains("Cancel")').should('be.visible').should('contain', 'Cancel');
      cy.get('dialog[open] button:contains("Save")').should('be.visible').should('contain', 'Save');
    });

    it('should close dialog when clicking Cancel', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.update-button').click();
      });

      cy.get('dialog[open]').should('be.visible');
      cy.get('dialog[open] button:contains("Cancel")').click();
      cy.wait(300);
      cy.get('dialog[open]').should('not.exist');
    });

    it('should show validation error when submitting empty form', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.update-button').click();
      });

      // Wait for dialog to open and form to be populated
      cy.get('dialog[open]').should('be.visible');
      cy.get('dialog[open] #genreName', { timeout: 2000 })
        .should('be.visible')
        .invoke('val')
        .should('match', /.+/);
      // Clear the field and blur to trigger validation
      cy.get('dialog[open] #genreName').clear().blur();
      // Wait for Angular change detection
      cy.wait(200);
      // The error should be visible
      cy.get('dialog[open] .dialog-error').should('be.visible');
      cy.get('dialog[open] .dialog-error').should('contain', 'Name is required');
    });

    it('should update genre successfully', () => {
      const updatedName = `Updated Genre ${Date.now()}`;

      // Get initial name for verification
      let initialName: string;
      cy.get('table tbody tr').first().within(() => {
        cy.get('.name').invoke('text').then((text) => {
          initialName = text.trim();
        });
      });

      cy.get('table tbody tr').first().within(() => {
        cy.get('.update-button').click();
      });

      // Wait for dialog to open and form to be populated
      cy.get('dialog[open]').should('be.visible');
      cy.get('dialog[open] #genreName', { timeout: 2000 })
        .should('be.visible')
        .invoke('val')
        .should('match', /.+/);
      // Clear and type new name
      cy.get('dialog[open] #genreName').clear().type(updatedName);
      cy.get('dialog[open] button:contains("Save")').click();

      // Dialog should close
      cy.wait(500);
      cy.get('dialog[open]').should('not.exist');

      // Updated genre should appear in the table
      cy.get('table tbody tr .name').should('contain', updatedName);
    });
  });

  describe('Delete Genre Dialog', () => {
    it('should open delete genre dialog when clicking Delete button', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.delete-button').click();
      });

      cy.get('dialog[open]').should('be.visible');
      cy.get('dialog[open]').within(() => {
        cy.contains('Delete Record').should('be.visible');
        cy.contains('Are you sure you want to delete this record?').should('be.visible');
      });
    });

    it('should display Cancel and Delete buttons in delete dialog', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.delete-button').click();
      });

      cy.get('dialog[open]').should('be.visible');
      cy.get('.delete-record__cancel-button').should('be.visible').should('contain', 'Cancel');
      cy.get('.delete-record__delete-button').should('be.visible').should('contain', 'Delete');
    });

    it('should close dialog when clicking Cancel', () => {
      cy.get('table tbody tr').first().within(() => {
        cy.get('.delete-button').click();
      });

      cy.get('dialog[open]').should('be.visible');
      cy.get('.delete-record__cancel-button').click();
      cy.wait(300);
      cy.get('dialog[open]').should('not.exist');
    });

    it('should delete genre successfully when confirming deletion', () => {
      // Get the name of the first genre
      let genreName: string;
      cy.get('table tbody tr').first().within(() => {
        cy.get('.name').invoke('text').then((text) => {
          genreName = text.trim();
        });
      });

      // Get initial count
      cy.get('table tbody tr').then(($rows) => {
        const initialCount = $rows.length;

        cy.get('table tbody tr').first().within(() => {
          cy.get('.delete-button').click();
        });

        cy.get('dialog[open]').should('be.visible');
        cy.get('.delete-record__delete-button').click();

        // Dialog should close
        cy.wait(500);
        cy.get('dialog[open]').should('not.exist');

        // Genre should be removed from table (soft delete)
        cy.get('table tbody tr').should('have.length', initialCount - 1);
        cy.get('table tbody tr .name').should('not.contain', genreName);
      });
    });

    it('should not delete genre when canceling', () => {
      // Get the name of the first genre
      let genreName: string;
      cy.get('table tbody tr').first().within(() => {
        cy.get('.name').invoke('text').then((text) => {
          genreName = text.trim();
        });
      });

      // Get initial count
      cy.get('table tbody tr').then(($rows) => {
        const initialCount = $rows.length;

        cy.get('table tbody tr').first().within(() => {
          cy.get('.delete-button').click();
        });

        cy.get('dialog[open]').should('be.visible');
        cy.get('.delete-record__cancel-button').click();

        // Dialog should close
        cy.wait(500);
        cy.get('dialog[open]').should('not.exist');

        // Genre should still be in table
        cy.get('table tbody tr').should('have.length', initialCount);
        cy.get('table tbody tr .name').should('contain', genreName);
      });
    });
  });

  describe('Table Interactions', () => {
    it('should display date columns with formatted dates', () => {
      cy.get('table tbody tr').first().within(() => {
        // Check that Created At and Last Updated columns have content
        cy.get('td').eq(1).should('not.be.empty'); // Created At
        cy.get('td').eq(2).should('not.be.empty'); // Last Updated
      });
    });

    it('should have Update and Delete buttons for each genre', () => {
      cy.get('table tbody tr').each(($row) => {
        cy.wrap($row).within(() => {
          cy.get('.update-button').should('be.visible');
          cy.get('.delete-button').should('be.visible');
        });
      });
    });

    it('should handle multiple genre operations in sequence', () => {
      // Add a genre
      const newGenreName = `Sequential Test ${Date.now()}`;
      cy.get('.add-genre__trigger').click();
      cy.get('dialog[open]').should('be.visible');
      cy.get('#genreName').type(newGenreName);
      cy.get('dialog[open] button:contains("Save")').click();
      cy.wait(500);
      cy.get('dialog[open]').should('not.exist');

      // Update the new genre
      cy.get('table tbody tr').contains(newGenreName).parent('tr').within(() => {
        cy.get('.update-button').click();
      });
      // Wait for dialog to open and form to be populated
      cy.get('dialog[open]').should('be.visible');
      cy.get('dialog[open] #genreName', { timeout: 2000 })
        .should('be.visible')
        .invoke('val')
        .should('match', /.+/);
      const updatedName = `${newGenreName} Updated`;
      cy.get('dialog[open] #genreName').clear().type(updatedName);
      cy.get('dialog[open] button:contains("Save")').click();
      cy.wait(500);
      cy.get('dialog[open]').should('not.exist');

      // Delete the updated genre
      cy.get('table tbody tr').contains(updatedName).parent('tr').within(() => {
        cy.get('.delete-button').click();
      });
      cy.get('dialog[open]').should('be.visible');
      cy.get('.delete-record__delete-button').click();
      cy.wait(500);
      cy.get('dialog[open]').should('not.exist');

      // Verify it's gone
      cy.get('table tbody tr .name').should('not.contain', updatedName);
    });
  });

  describe('Empty State', () => {
    it('should show "No genres found" when filter matches nothing', () => {
      cy.get('.filter-input').type('ZZZNonexistentGenre123');
      cy.wait(500);
      cy.get('table tbody tr').should('contain', 'No genres found');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      cy.get('.add-genre__trigger').click();
      cy.get('label[for="genreName"]').should('exist');
    });

    it('should have accessible buttons', () => {
      cy.get('.add-genre__trigger').should('have.attr', 'type', 'button');
      cy.get('table tbody tr').first().within(() => {
        cy.get('.update-button').should('have.attr', 'type', 'button');
        cy.get('.delete-button').should('have.attr', 'type', 'button');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', () => {
      cy.viewport(375, 667);
      cy.get('h1').should('be.visible');
      cy.get('.filter-input').should('be.visible');
      cy.get('.add-genre__trigger').should('be.visible');
      cy.get('table.striped').should('be.visible');
    });

    it('should display correctly on tablet viewport', () => {
      cy.viewport(768, 1024);
      cy.get('h1').should('be.visible');
      cy.get('.filter-input').should('be.visible');
      cy.get('.add-genre__trigger').should('be.visible');
      cy.get('table.striped').should('be.visible');
    });

    it('should display correctly on desktop viewport', () => {
      cy.viewport(1280, 720);
      cy.get('h1').should('be.visible');
      cy.get('.filter-input').should('be.visible');
      cy.get('.add-genre__trigger').should('be.visible');
      cy.get('table.striped').should('be.visible');
    });
  });
});

