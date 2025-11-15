/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('login', (credential: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('#credential').type(credential);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.url({ timeout: 10000 }).should('include', '/dashboard');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(credential: string, password: string): Chainable<void>;
    }
  }
}