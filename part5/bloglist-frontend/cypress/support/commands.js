// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('createUser', ({ username, name, password }) => {
  cy.request('POST', '/api/users', { username, name, password });
});

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', '/api/login', { username, password })
    .then((resp) => {
      // set localStorage since it was front-end's responsibility to set it
      localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(resp.body),
      );
      // reload page for effect hook to process token.
      cy.visit('/');
    });
});

Cypress.Commands.add('createBlog', (blog) => {
  const { token } = JSON.parse(localStorage.getItem('loggedBlogappUser'));
  cy.request({
    method: 'POST',
    url: '/api/blogs',
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: blog,
  });
});
