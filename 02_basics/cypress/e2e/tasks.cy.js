/// <reference types="Cypress" />

describe('tasks management', () => {
  it('should open and close the new task modal', () => {
    cy.visit('http://127.0.0.1:5173/');

    // opening
    cy.contains('Add Task').click();
    cy.get('.backdrop').should('exist');
    cy.get('.modal').should('exist');

    // closing by backdrop click
    cy.get('.backdrop').click({ force: true });
    cy.get('.backdrop').should('not.exist');
    cy.get('.modal').should('not.exist');

    // closing by cancel button
    cy.contains('Add Task').click();
    cy.contains('Cancel').click();
    cy.get('.backdrop').should('not.exist');
    cy.get('.modal').should('not.exist');
  });

  it('should create a new task', () => {
    cy.visit('http://127.0.0.1:5173/');
    cy.contains('Add Task').click();

    // create the task
    cy.get('#title').type('New Task');
    cy.get('#summary').type('Description of the new task');
    cy.get('.modal').contains('Add Task').click();

    // confirms if the modal was closed
    cy.get('.backdrop').should('not.exist');
    cy.get('.modal').should('not.exist');

    // finds new task
    cy.get('.task').should('have.length', 1);
    cy.get('.task h2').contains('New Task');
    cy.get('.task p').contains('Description of the new task');
  });

  it('should validate user input', () => {
    cy.visit('http://127.0.0.1:5173/');
    cy.contains('Add Task').click();

    // tries to create task without data
    cy.get('.modal').contains('Add Task').click();
    cy.get('.modal').contains('provide values')

  });

  it('should filter tasks by category', () => { 
    cy.visit('http://127.0.0.1:5173/');
    cy.contains('Add Task').click();
    cy.get('#title').type('New Task');
    cy.get('#summary').type('Description of the new task');
    cy.get('#category').select('urgent');
    cy.get('.modal').contains('Add Task').click();

    // confirms the task before filtering list
    cy.get('.task').should('have.length', 1);

    // tries to find the task after filtering -- right category
    cy.get('#filter').select('urgent');
    cy.get('.task').should('have.length', 1);

    // tries to find the task after filtering -- wrong category
    cy.get('#filter').select('moderate');
    cy.get('.task').should('have.length', 0);

    // clears the filter
    cy.get('#filter').select('all');
    cy.get('.task').should('have.length', 1);
  });

  it('should add multiple tasks', () => {
    cy.visit('http://127.0.0.1:5173/');
    cy.contains('Add Task').click();
    cy.get('#title').type('Task 1');
    cy.get('#summary').type('First task');
    cy.get('.modal').contains('Add Task').click();
    cy.get('.task').should('have.length', 1);

    cy.contains('Add Task').click();
    cy.get('#title').type('Task 2');
    cy.get('#summary').type('Second task');
    cy.get('.modal').contains('Add Task').click();
    cy.get('.task').should('have.length', 2);

    // confirms the order of the tasks in list
    cy.get('.task').eq(0).contains('First task'); // first()
    cy.get('.task').eq(1).contains('Second task'); // last()
  });
});