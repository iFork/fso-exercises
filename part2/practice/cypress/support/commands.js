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

Cypress.Commands.add('login', (username, password) => {
  cy.request('POST', '/api/login', {
    username, password
  }).then(({ body }) => {
    // store user info in localStorage, like frontend does
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    // Or, alternatively, 'anti-simple' way:
    // NOTE: remeber that cy.window() is async
    // Wrong -> cy.window().localStorage.setItem(..)
    // cy.window()
    //   .then((win) => {
    //     win.localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    //   })
    //reload page to trigger effect hook to read from localStorage
    cy.visit('http://localhost:3000')
  })
})
Cypress.Commands.add('createNote', ({ content, important }) => {
  // get token from localStorage
  const token = JSON.parse(localStorage.getItem('loggedNoteappUser')).token
  cy.request({
    method: 'POST',
    url: '/api/notes',
    body: {
      content,
      important,
    },
    headers: {
      Authorization: `bearer ${token}`
    }
  })
  // reload page to see updated state
  cy.visit('http://localhost:3000')
})
