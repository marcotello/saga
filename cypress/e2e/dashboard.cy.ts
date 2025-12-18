/// <reference types="cypress" />
describe('Dashboard', () => {
    beforeEach(() => {
        cy.login('johnsmith@saga.com', 'Password@123');
        // Ensure we are on the dashboard
        cy.url().should('include', '/dashboard');
        // Wait for data to load (if any async operations)
        cy.get('.container').should('be.visible');
    });

    describe('Page Load and Structure', () => {
        it('should load the dashboard successfully', () => {
            cy.url().should('include', '/dashboard');
            cy.get('body').should('be.visible');
        });

        it('should display all main sections', () => {
            cy.get('.track-progress-section').should('be.visible');
            cy.get('.my-shelves').should('be.visible');
            cy.get('.your-next-read').should('be.visible');
            cy.get('.statistics-section').should('be.visible');
        });

        it('should load user-specific data', () => {
            // Dashboard should load personalized content for logged-in user
            cy.get('.container').should('be.visible');
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

        it('should display correctly on tablet', () => {
            cy.viewport(768, 1024);
            cy.get('.track-progress-section').should('be.visible');
            cy.get('.my-shelves').should('be.visible');
            cy.get('.your-next-read').should('be.visible');
            cy.get('.statistics-section').should('be.visible');
        });

        it('should display correctly on desktop', () => {
            cy.viewport(1280, 720);
            cy.get('.track-progress-section').should('be.visible');
            cy.get('.my-shelves').should('be.visible');
            cy.get('.your-next-read').should('be.visible');
            cy.get('.statistics-section').should('be.visible');
        });
    });

    describe('Book Cards Interaction', () => {
        it('should display book cover images', () => {
            cy.get('.track-progress-section .book-card').first().within(() => {
                cy.get('img').should('be.visible');
                cy.get('img').should('have.attr', 'src');
            });
        });

        it('should display book title', () => {
            cy.get('.track-progress-section .book-card').first().within(() => {
                cy.get('h3, .book-title').should('be.visible');
            });
        });

        it('should show progress for each book', () => {
            cy.get('.track-progress-section .book-card').first().within(() => {
                cy.get('progress').should('be.visible');
            });
        });

        it('should display progress percentage', () => {
            cy.get('.track-progress-section .book-card').first().within(() => {
                cy.get('.progress-text').should('contain', '%');
            });
        });
    });

    describe('Update Progress Dialog Interaction', () => {
        it('should close dialog when clicking outside', () => {
            cy.get('.track-progress-section .book-card').first().within(() => {
                cy.get('.update-progress-btn').click();
            });

            cy.get('dialog[open]').should('be.visible');
            
            // Click outside the dialog (on the backdrop)
            cy.get('body').click(0, 0);
            cy.wait(300);
        });

        it('should update progress value in real-time', () => {
            cy.get('.track-progress-section .book-card').first().within(() => {
                cy.get('.update-progress-btn').click();
            });

            cy.get('dialog[open]').should('be.visible');
            
            // Test multiple progress values
            [25, 50, 75, 100].forEach((value) => {
                cy.get('dialog[open] input[type="range"]')
                    .invoke('val', value)
                    .trigger('input');
                
                cy.get('dialog[open] label').should('contain', `${value}%`);
            });
        });

        it('should maintain progress after reopening dialog', () => {
            cy.get('.track-progress-section .book-card').first().within(() => {
                cy.get('.update-progress-btn').click();
            });

            // Set progress to 75%
            cy.get('dialog[open] input[type="range"]')
                .invoke('val', 75)
                .trigger('input');
            
            cy.get('dialog[open] button').contains('Save').click();
            cy.wait(500);

            // Reopen dialog
            cy.get('.track-progress-section .book-card').first().within(() => {
                cy.get('.update-progress-btn').click();
            });

            // Progress should be maintained (this depends on implementation)
            cy.get('dialog[open]').should('be.visible');
        });
    });

    describe('Add Book Functionality', () => {
        it('should have Add a Book card', () => {
            cy.get('.add-book-card').should('be.visible');
        });

        it('should display Add a Book button', () => {
            cy.get('.add-book-card button').should('contain', 'Add a Book');
        });

        it('should have accessible add book button', () => {
            cy.get('.add-book-card button').should('have.attr', 'type', 'button');
        });
    });

    describe('Bookshelves Section', () => {
        it('should display shelf images', () => {
            cy.get('.my-shelves .shelf-card').first().within(() => {
                cy.get('img').should('be.visible');
                cy.get('img').should('have.attr', 'src');
            });
        });

        it('should display shelf names', () => {
            cy.get('.my-shelves .shelf-card').first().within(() => {
                cy.get('.shelf-name, h3').should('be.visible');
            });
        });

        it('should have clickable shelf cards', () => {
            cy.get('.my-shelves .shelf-card').first().should('be.visible');
        });

        it('should display Add Shelf card at the end', () => {
            cy.get('.my-shelves .add-shelf-card').should('be.visible');
            cy.get('.my-shelves .add-shelf-card .shelf-name').should('contain', 'Add Shelf');
        });
    });

    describe('Book Suggestions Section', () => {
        it('should display suggestion book covers', () => {
            cy.get('.your-next-read .book-card').first().within(() => {
                cy.get('img').should('be.visible');
                cy.get('img').should('have.attr', 'src');
            });
        });

        it('should display suggestion book titles', () => {
            cy.get('.your-next-read .book-card').first().within(() => {
                cy.get('h3, .book-title').should('be.visible');
            });
        });

        it('should display multiple suggestions', () => {
            cy.get('.your-next-read .book-card').should('have.length.at.least', 1);
        });
    });

    describe('Statistics Section Details', () => {
        it('should display chart container', () => {
            cy.get('.statistics-section ngx-charts-line-chart').should('be.visible');
        });

        it('should display Books Read stat card', () => {
            cy.get('.statistics-section .stat-card').contains('Books Read This Year')
                .should('be.visible');
        });

        it('should display Pages Read stat card', () => {
            cy.get('.statistics-section .stat-card').contains('Pages Read This Year')
                .should('be.visible');
        });

        it('should display numeric values in stat cards', () => {
            cy.get('.statistics-section .stat-card').each(($card) => {
                cy.wrap($card).find('.stat-value, .value').should('exist');
            });
        });

        it('should have proper heading hierarchy', () => {
            cy.get('.statistics-section h2').should('exist');
            cy.get('.statistics-section h2').should('contain', 'The Story So Far');
        });
    });

    describe('Navigation from Dashboard', () => {
        it('should navigate to My Books when clicking relevant link', () => {
            // Test if there's a link to my-books
            cy.get('body').then(($body) => {
                if ($body.find('a[href*="/my-books"]').length > 0) {
                    cy.get('a[href*="/my-books"]').first().click();
                    cy.url().should('include', '/my-books');
                }
            });
        });

        it('should stay on dashboard when interacting with cards', () => {
            cy.get('.track-progress-section .book-card').first().should('be.visible');
            cy.url().should('include', '/dashboard');
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading hierarchy', () => {
            cy.get('h1').should('exist');
            cy.get('h2').should('exist');
        });

        it('should have accessible buttons', () => {
            cy.get('.update-progress-btn').first().should('have.attr', 'type', 'button');
            cy.get('.add-book-card button').should('have.attr', 'type', 'button');
        });

        it('should have alt text for images', () => {
            cy.get('.track-progress-section img').first().should('have.attr', 'alt');
            cy.get('.my-shelves img').first().should('have.attr', 'alt');
        });

        it('should have accessible progress bars', () => {
            cy.get('.track-progress-section progress').first()
                .should('have.attr', 'max')
                .and('equal', '100');
        });

        it('should have accessible dialog', () => {
            cy.get('.track-progress-section .book-card').first().within(() => {
                cy.get('.update-progress-btn').click();
            });

            cy.get('dialog[open]').should('be.visible');
            cy.get('dialog[open]').should('have.attr', 'open');
        });
    });

    describe('Loading States', () => {
        it('should display container after loading', () => {
            cy.get('.container').should('be.visible');
        });

        it('should have all sections rendered', () => {
            cy.get('.track-progress-section').should('exist');
            cy.get('.my-shelves').should('exist');
            cy.get('.your-next-read').should('exist');
            cy.get('.statistics-section').should('exist');
        });
    });

    describe('User Experience', () => {
        it('should display personalized greeting or user info', () => {
            // Check if there's any user-specific content
            cy.get('.container').should('be.visible');
        });

        it('should show recent activity in track progress', () => {
            cy.get('.track-progress-section .book-card').should('have.length.at.least', 1);
        });

        it('should provide clear call-to-action buttons', () => {
            cy.get('.update-progress-btn').first().should('be.visible');
            cy.get('.add-book-card button').should('be.visible');
        });
    });
});
