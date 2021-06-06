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
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "cypress-wait-until";
import "cypress-file-upload";

Cypress.Commands.add("getFirestoreDoc", function(store, path) {
  return new Cypress.Promise((resolve, reject) => {
    store
      .dispatch("tests/getFirestoreDoc", path)
      .then(function(data) {
        resolve(data);
      })
      .catch(function(err) {
        reject(err);
      });
  });
});

Cypress.Commands.add("getFirestoreSnap", function(store, path, key, value) {
  return new Cypress.Promise((resolve, reject) => {
    store
      .dispatch("tests/getFirestoreSnap", { path, key, value })
      .then(function(data) {
        resolve(data);
      })
      .catch(function(err) {
        reject(err);
      });
  });
});

Cypress.Commands.add("resetFirebase", function(store) {
  return new Cypress.Promise((resolve, reject) => {
    store
      .dispatch("tests/resetFirebase")
      .then(function(data) {
        resolve(data);
      })
      .catch(function(err) {
        reject(err);
      });
  });
});

Cypress.Commands.add("setInput", (item, value) => {
  cy.contains(item)
    .parent()
    .find("ion-input")
    .children()
    .clear()
    .type(value)
    .should("have.value", value);
});

Cypress.Commands.add("setTextarea", (item, value) => {
  cy.contains(item)
    .parent()
    .find("ion-textarea")
    .children()
    .children()
    .clear()
    .type(value)
    .should("have.value", value);
});

Cypress.Commands.add("setSelect", (item, label, value) => {
  cy.contains("ion-label", item)
    .parent()
    .find("ion-select")
    .click();
  cy.get("ion-radio")
    .parent()
    .contains(label)
    .parent()
    .click();
  cy.contains("ion-label", item)
    .parent()
    .find("ion-select")
    .should("have.value", value);
});

Cypress.Commands.add("setAssessmentSelect", (item, label, value) => {
  cy.get(`[title='${item}']`)
    .children()
    .click();
  cy.get("ion-radio")
    .parent()
    .contains(label)
    .parent()
    .click();
  cy.get(`[title='${item}']`)
    .children()
    .invoke("val")
    .then((val) => cy.wrap(val).should("eq", value));
});

Cypress.Commands.add("setMeasurement", (label, i18n, name, value, unit) => {
  if (name)
    cy.contains(label)
      .parent()
      .find(`[placeholder='${i18n.name}']`)
      .clear()
      .type(name)
      .should("have.value", name);
  cy.contains(label)
    .parent()
    .find(`[placeholder='${i18n.value}']`)
    .clear()
    .type(value)
    .should("have.value", value);
  if (unit !== "mm") {
    cy.contains(label)
      .parent()
      .find("ion-select")
      .click();
    cy.get("ion-radio")
      .parent()
      .contains(unit)
      .parent()
      .click();
  }
  cy.contains(label)
    .parent()
    .find("ion-select")
    .should("have.value", unit);
});
