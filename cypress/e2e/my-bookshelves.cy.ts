/// <reference types="cypress" />
describe('My Bookshelves Page', () => {
    beforeEach(() => {
        cy.login('johnsmith@saga.com', 'Password@123');
        cy.visit('/my-bookshelves');
        cy.get('h1').should('contain', 'My Bookshelves');
        cy.wait(1000);
    });

    describe('Page Load and Structure', () => {
        it('should load the my bookshelves page successfully', () => {
            cy.url().should('include', '/my-bookshelves');
            cy.get('body').should('be.visible');
        });

        it('should display the page title', () => {
            cy.get('h1').should('contain', 'My Bookshelves');
        });

        it('should display the shelves sidebar', () => {
            cy.get('.shelves-sidebar').should('be.visible');
        });

        it('should display shelf items in the sidebar', () => {
            cy.get('.shelf-item').should('have.length.at.least', 1);
        });

        it('should display the "+ New Shelf" button', () => {
            cy.get('.new-shelf-btn').should('be.visible');
            cy.get('.new-shelf-btn').should('contain', 'New Shelf');
        });

        it('should display the shelf actions card', () => {
            cy.get('.shelf-actions-card').should('be.visible');
        });

        it('should display Update and Delete buttons in shelf actions', () => {
            cy.get('.shelf-update-btn').should('be.visible').should('contain', 'Update');
            cy.get('.shelf-delete-btn').should('be.visible').should('contain', 'Delete');
        });

        it('should display the books table', () => {
            cy.get('.table-container').should('be.visible');
            cy.get('table.striped').should('be.visible');
        });

        it('should display table headers', () => {
            cy.get('table thead').within(() => {
                cy.get('th').eq(0).should('contain', 'Cover');
                cy.get('th').eq(1).should('contain', 'Title');
                cy.get('th').eq(2).should('contain', 'Author');
                cy.get('th').eq(3).should('contain', 'Date Added');
                cy.get('th').eq(4).should('contain', 'Status');
                cy.get('th').eq(5).should('contain', 'Actions');
            });
        });
    });

    describe('Shelf Selection', () => {
        it('should have first shelf selected by default', () => {
            cy.get('.shelf-item.active').should('have.length', 1);
        });

        it('should highlight clicked shelf as active', () => {
            cy.get('.shelf-item').then(($items) => {
                if ($items.length > 1) {
                    cy.get('.shelf-item').eq(1).click();
                    cy.wait(500);
                    cy.get('.shelf-item').eq(1).should('have.class', 'active');
                }
            });
        });

        it('should update shelf info when selecting a different shelf', () => {
            cy.get('.shelf-item').then(($items) => {
                if ($items.length > 1) {
                    // Get name of second shelf
                    const secondShelfName = $items.eq(1).find('.shelf-name').text().trim();

                    cy.get('.shelf-item').eq(1).click();
                    cy.wait(500);

                    cy.get('.my-shelf-name').should('contain', secondShelfName);
                }
            });
        });

        it('should display shelf icon and name in actions card', () => {
            cy.get('.shelf-actions-card').within(() => {
                cy.get('.my-shelf-icon').should('exist');
                cy.get('.my-shelf-name').should('not.be.empty');
                cy.get('.book-count').should('exist');
            });
        });
    });

    describe('Add Bookshelf Dialog', () => {
        it('should open add bookshelf dialog when clicking "+ New Shelf" button', () => {
            cy.get('.new-shelf-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('dialog[open]').within(() => {
                cy.contains('Add Bookshelf').should('be.visible');
            });
        });

        it('should display form fields in add bookshelf dialog', () => {
            cy.get('.new-shelf-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('label[for="bookshelfName"]').should('contain', 'Bookshelf Name');
            cy.get('#bookshelfName').should('be.visible');
            cy.get('label[for="bookshelfImage"]').should('contain', 'Icon');
            cy.get('#bookshelfImage').should('be.visible');
        });

        it('should display Cancel and Save buttons', () => {
            cy.get('.new-shelf-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('dialog[open] button:contains("Cancel")').should('be.visible');
            cy.get('dialog[open] button:contains("Save")').should('be.visible');
        });

        it('should close dialog when clicking Cancel', () => {
            cy.get('.new-shelf-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('dialog[open] button:contains("Cancel")').click();
            cy.wait(300);
            cy.get('dialog[open]').should('not.exist');
        });

        it('should disable Save button when form is empty', () => {
            cy.get('.new-shelf-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('dialog[open] button:contains("Save")').should('be.disabled');
        });

        it('should enable Save button when both fields are filled', () => {
            cy.get('.new-shelf-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('#bookshelfName').type('Test Shelf');
            cy.get('#bookshelfImage').type('/images/test.svg');
            cy.get('dialog[open] button:contains("Save")').should('not.be.disabled');
        });

        it('should show validation error when name is cleared', () => {
            cy.get('.new-shelf-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('#bookshelfName').type('Test').clear().blur();
            cy.wait(200);
            cy.get('dialog[open] .dialog-error').should('be.visible');
            cy.get('dialog[open] .dialog-error').should('contain', 'Bookshelf Name is required');
        });

        it('should add a new bookshelf successfully', () => {
            const newShelfName = `Test Shelf ${Date.now()}`;

            cy.get('.new-shelf-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('#bookshelfName').type(newShelfName);
            cy.get('#bookshelfImage').type('/images/test.svg');
            cy.get('dialog[open] button:contains("Save")').click();

            cy.wait(500);
            cy.get('dialog[open]').should('not.exist');

            // New shelf should appear in the sidebar
            cy.get('.shelf-name').should('contain', newShelfName);
        });

        it('should clear form when dialog is reopened', () => {
            cy.get('.new-shelf-btn').click();
            cy.get('#bookshelfName').type('Test');
            cy.get('#bookshelfImage').type('/images/test.svg');
            cy.get('dialog[open] button:contains("Cancel")').click();

            cy.get('.new-shelf-btn').click();
            cy.get('#bookshelfName').should('have.value', '');
            cy.get('#bookshelfImage').should('have.value', '');
        });
    });

    describe('Update Bookshelf Dialog', () => {
        it('should open update bookshelf dialog when clicking Update button', () => {
            cy.get('.shelf-update-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('dialog[open]').within(() => {
                cy.contains('Update Bookshelf').should('be.visible');
            });
        });

        it('should pre-fill the form with bookshelf data', () => {
            cy.get('.my-shelf-name').then(($name) => {
                const shelfName = $name.text().trim();

                cy.get('.shelf-update-btn').click();
                cy.get('dialog[open]').should('be.visible');
                cy.get('dialog[open] #updateBookshelfName', { timeout: 2000 }).should('have.value', shelfName);
                cy.get('dialog[open] #updateBookshelfImage', { timeout: 2000 })
                    .invoke('val')
                    .should('match', /.+/);
            });
        });

        it('should display Cancel and Update buttons', () => {
            cy.get('.shelf-update-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('dialog[open] button:contains("Cancel")').should('be.visible');
            cy.get('dialog[open] button:contains("Update")').should('be.visible');
        });

        it('should close dialog when clicking Cancel', () => {
            cy.get('.shelf-update-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('dialog[open] button:contains("Cancel")').click();
            cy.wait(300);
            cy.get('dialog[open]').should('not.exist');
        });

        it('should show validation error when name is cleared', () => {
            cy.get('.shelf-update-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('dialog[open] #updateBookshelfName', { timeout: 2000 })
                .should('be.visible')
                .invoke('val')
                .should('match', /.+/);
            cy.get('dialog[open] #updateBookshelfName').clear().blur();
            cy.wait(200);
            cy.get('dialog[open] .dialog-error').should('be.visible');
            cy.get('dialog[open] .dialog-error').should('contain', 'Bookshelf Name is required');
        });

        it('should update bookshelf successfully', () => {
            const updatedName = `Updated Shelf ${Date.now()}`;

            cy.get('.shelf-update-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('dialog[open] #updateBookshelfName', { timeout: 2000 })
                .should('be.visible')
                .invoke('val')
                .should('match', /.+/);

            cy.get('dialog[open] #updateBookshelfName').clear().type(updatedName);
            cy.get('dialog[open] button:contains("Update")').click();

            cy.wait(500);
            cy.get('dialog[open]').should('not.exist');

            // Updated shelf name should appear in the actions card
            cy.get('.my-shelf-name').should('contain', updatedName);
        });
    });

    describe('Delete Bookshelf Dialog', () => {
        it('should open delete dialog when clicking Delete button', () => {
            cy.get('.shelf-delete-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('dialog[open]').within(() => {
                cy.contains('Delete Bookshelf').should('be.visible');
                cy.contains('Are you sure you want to delete this bookshelf?').should('be.visible');
            });
        });

        it('should display Cancel and Delete buttons in delete dialog', () => {
            cy.get('.shelf-delete-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('.delete-record__cancel-button').should('be.visible').should('contain', 'Cancel');
            cy.get('.delete-record__delete-button').should('be.visible').should('contain', 'Delete');
        });

        it('should close dialog when clicking Cancel', () => {
            cy.get('.shelf-delete-btn').click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('.delete-record__cancel-button').click();
            cy.wait(300);
            cy.get('dialog[open]').should('not.exist');
        });

        it('should not delete bookshelf when canceling', () => {
            cy.get('.shelf-item').then(($items) => {
                const initialCount = $items.length;

                cy.get('.shelf-delete-btn').click();
                cy.get('dialog[open]').should('be.visible');
                cy.get('.delete-record__cancel-button').click();
                cy.wait(300);
                cy.get('dialog[open]').should('not.exist');

                cy.get('.shelf-item').should('have.length', initialCount);
            });
        });

        it('should delete bookshelf when confirming', () => {
            cy.get('.shelf-item').then(($items) => {
                const initialCount = $items.length;

                cy.get('.shelf-delete-btn').click();
                cy.get('dialog[open]').should('be.visible');
                cy.get('.delete-record__delete-button').click();

                cy.wait(500);
                cy.get('dialog[open]').should('not.exist');
                cy.get('.shelf-item').should('have.length', initialCount - 1);
            });
        });
    });

    describe('Remove Book from Shelf', () => {
        it('should display Remove buttons for each book', () => {
            cy.get('table tbody tr').should('have.length.at.least', 1);
            cy.get('table tbody tr .action-btn').should('have.length.at.least', 1);
            cy.get('table tbody tr .action-btn').first().should('contain', 'Remove');
        });

        it('should open remove book dialog when clicking Remove button', () => {
            cy.get('table tbody tr').should('have.length.at.least', 1);
            cy.get('.action-btn').first().click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('dialog[open]').should('contain', 'Remove Book');
            cy.get('dialog[open]').should('contain', 'Are you sure you want to remove this book from the shelf?');
        });

        it('should close remove dialog when clicking Cancel', () => {
            cy.get('table tbody tr').should('have.length.at.least', 1);
            cy.get('.action-btn').first().click();
            cy.get('dialog[open]').should('be.visible');
            cy.get('.delete-record__cancel-button').click();
            cy.wait(300);
            cy.get('dialog[open]').should('not.exist');
        });
    });

    describe('Books Table', () => {
        it('should display books in the table', () => {
            cy.get('table tbody tr').should('have.length.at.least', 1);
        });

        it('should display book cover, title, author, date, and status', () => {
            cy.get('table tbody tr').first().within(() => {
                cy.get('.book-cover').should('exist');
                cy.get('.book-title').should('exist');
                cy.get('.author-cell').should('not.be.empty');
                cy.get('.date-cell').should('not.be.empty');
                cy.get('.status-cell').should('not.be.empty');
            });
        });
    });

    describe('Accessibility', () => {
        it('should have proper button types', () => {
            cy.get('.new-shelf-btn').should('exist');
            cy.get('.shelf-update-btn').should('have.attr', 'type', 'button');
            cy.get('.shelf-delete-btn').should('have.attr', 'type', 'button');
        });

        it('should have proper form labels in add dialog', () => {
            cy.get('.new-shelf-btn').click();
            cy.get('label[for="bookshelfName"]').should('exist');
            cy.get('label[for="bookshelfImage"]').should('exist');
        });
    });

    describe('Responsive Design', () => {
        it('should display correctly on mobile viewport', () => {
            cy.viewport(375, 667);
            cy.get('h1').should('be.visible');
            cy.get('.shelves-sidebar').should('exist');
            cy.get('table.striped').should('exist');
        });

        it('should display correctly on tablet viewport', () => {
            cy.viewport(768, 1024);
            cy.get('h1').should('be.visible');
            cy.get('.shelves-sidebar').should('be.visible');
            cy.get('table.striped').should('be.visible');
        });

        it('should display correctly on desktop viewport', () => {
            cy.viewport(1280, 720);
            cy.get('h1').should('be.visible');
            cy.get('.shelves-sidebar').should('be.visible');
            cy.get('table.striped').should('be.visible');
        });
    });
});
