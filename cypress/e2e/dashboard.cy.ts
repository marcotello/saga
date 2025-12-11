/// <reference types="cypress" />
describe('Dashboard', () => {
    beforeEach(() => {
        cy.login('johnsmith@saga.com', 'Password@123');
        // Ensure we are on the dashboard
        cy.url().should('include', '/dashboard');
        // Wait for data to load (if any async operations)
        cy.get('.container').should('be.visible');
    });

    describe('Page Structure', () => {
        it('should display all main sections', () => {
            cy.get('.track-progress-section').should('be.visible');
            cy.get('.my-shelves').should('be.visible');
            cy.get('.your-next-read').should('be.visible');
            cy.get('.statistics-section').should('be.visible');
        });
    });

    describe('Track Progress Section', () => {
        it('should display "My Books" heading', () => {
            cy.get('.track-progress-section h1').should('contain', 'My Books');
        });

        it('should display book cards', () => {
            cy.get('.track-progress-section .book-card').should('have.length.at.least', 1);
        });

        it('should display progress bars on books', () => {
            cy.get('.track-progress-section .book-card').first().within(() => {
                cy.get('progress').should('be.visible');
                cy.get('.progress-text').should('contain', '%');
            });
        });

        it('should open update progress dialog when clicking "Update Progress"', () => {
            cy.get('.track-progress-section .book-card').first().within(() => {
                cy.get('.update-progress-btn').click();
            });

            cy.get('dialog[open]').should('be.visible');
            cy.get('dialog[open]').should('contain', 'Update Progress for');
        });

        it('should display "Add a Book" card', () => {
            cy.get('.track-progress-section .add-book-card').should('be.visible');
            cy.get('.track-progress-section .add-book-card button').should('contain', 'Add a Book');
        });
    });

    describe('Update Progress Dialog', () => {
        beforeEach(() => {
            // Open dialog before each test in this block
            cy.get('.track-progress-section .book-card').first().within(() => {
                cy.get('.update-progress-btn').click();
            });
            cy.get('dialog[open]').should('be.visible');
        });

        it('should display current progress', () => {
            cy.get('dialog[open] label').should('contain', 'Progress:');
        });

        it('should allow changing progress via range input', () => {
            cy.get('dialog[open] input[type="range"]')
                .invoke('val', 50)
                .trigger('input');

            cy.get('dialog[open] label').should('contain', '50%');
        });

        it('should change Save button text to "Finished!" when progress is 100%', () => {
            cy.get('dialog[open] input[type="range"]')
                .invoke('val', 100)
                .trigger('input');

            cy.get('dialog[open] button').contains('Finished!').should('be.visible');
        });

        it('should close dialog when clicking Cancel', () => {
            cy.get('dialog[open] button').contains('Cancel').click();
            cy.get('dialog[open]').should('not.exist');
        });

        it('should save and close dialog when clicking Save', () => {
            // We'll just check it closes for now, assuming mock backend handles it
            cy.get('dialog[open] button').contains('Save').click();
            cy.get('dialog[open]').should('not.exist');
        });
    });

    describe('My Shelves Section', () => {
        it('should display "My Bookshelves" heading', () => {
            cy.get('.my-shelves h1').should('contain', 'My Bookshelves');
        });

        it('should display shelf cards', () => {
            cy.get('.my-shelves .shelf-card').should('have.length.at.least', 1);
        });

        it('should display "Add Shelf" card', () => {
            cy.get('.my-shelves .add-shelf-card').should('be.visible');
            cy.get('.my-shelves .add-shelf-card .shelf-name').should('contain', 'Add Shelf');
        });
    });

    describe('Book Suggestions Section', () => {
        it('should display "Your Next Read" heading', () => {
            cy.get('.your-next-read h1').should('contain', 'Your Next Read');
        });

        it('should display suggestion cards', () => {
            cy.get('.your-next-read .book-card').should('have.length.at.least', 1);
        });
    });

    describe('Statistics Section', () => {
        it('should display "The Story So Far" heading', () => {
            cy.get('.statistics-section h2').should('contain', 'The Story So Far');
        });

        it('should display the chart', () => {
            cy.get('.statistics-section ngx-charts-line-chart').should('be.visible');
        });

        it('should display stat cards', () => {
            cy.get('.statistics-section .stat-card').should('have.length', 2);
            cy.get('.statistics-section .stat-card').contains('Books Read This Year').should('be.visible');
            cy.get('.statistics-section .stat-card').contains('Pages Read This Year').should('be.visible');
        });
    });

    describe('Responsive Design', () => {
        it('should display correctly on mobile', () => {
            cy.viewport('iphone-x');
            cy.get('.track-progress-section').should('be.visible');
            cy.get('.my-shelves').should('be.visible');
            cy.get('.your-next-read').should('be.visible');
            cy.get('.statistics-section').should('be.visible');
        });
    });
});
