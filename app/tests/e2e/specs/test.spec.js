/// <reference types="Cypress" />
// https://docs.cypress.io/api/introduction/api.html

import de from "../../../src/locales/de.json";
import en from "../../../src/locales/en.json";

describe("Login", () => {
  it("Logs into the app", () => {
    indexedDB.deleteDatabase("firebaseLocalStorageDb");
    cy.visit("/login");
    cy.window().then((win) => {
      cy.waitUntil(() =>
        cy.wrap(win.store.state.user).then((user) => user === null)
      );
      cy.contains("h3", de.welcomeText).should("exist");
      cy.get("[type='email']")
        .type("id@jonasgaiswinkler.eu")
        .should("have.value", "id@jonasgaiswinkler.eu");
      cy.get("[type='password']")
        .type("!W0JhZIB@2rx")
        .should("have.value", "!W0JhZIB@2rx");
      cy.get("ion-button")
        .get("[title='" + de.login + "']")
        .click();
      cy.url({
        timeout: 20000,
      }).should("include", "/home");
      cy.waitUntil(() =>
        cy
          .wrap(win.store.state.user)
          .its("uid")
          .should("exist")
      );
      cy.contains(de.user).should("exist");
      cy.getFirestoreDoc(
        win.store,
        "users/Thej8pt0ilXGQwLp3vnmqarxpog2"
      ).then((doc) => cy.wrap(doc.exists).should("eq", true));
    });
  });
});

describe("Object", () => {
  it("Resets Firebase", () => {
    cy.visit("/home");
    cy.window().then((win) => {
      cy.resetFirebase(win.store).then((result) =>
        cy.wrap(result.data.status).should("eq", 200)
      );
    });
  });
  it("Creates a new Object", () => {
    cy.visit("/home");
    cy.window().then((win) => {
      cy.contains(de.newObject)
        .parents(".tile")
        .find("ion-button")
        .click();
      cy.url().should("include", "/new-object");
      cy.contains(de.objectData).should("exist");
      cy.setInput(de.object.id + "*", "2837");
      cy.setSelect(
        de.object.materials.name + "*",
        de.object.materials.data.reinforcedConcrete,
        "reinforcedConcrete"
      );
      cy.setSelect(
        de.object.types.name + "*",
        de.object.types.data.railwayBridge,
        "railwayBridge"
      );
      cy.setSelect(
        de.object.crossSectionShapes.name + "*",
        de.object.crossSectionShapes.data.beams,
        "beams"
      );
      cy.setInput(de.object.constructionYear + "*", "1987");
      cy.setInput(de.object.routeName, "10192");
      cy.setInput(de.object.chainage + "*", "76.291");
      cy.get(`[placeholder='${de.latitude}']`)
        .type("46.281")
        .should("have.value", "46.281");
      cy.get(`[placeholder='${de.longitude}']`)
        .type("15.953")
        .should("have.value", "15.953");
      cy.setInput(de.object.spanLength + "*", "231");
      cy.setInput(de.object.width + "*", "20");
      cy.setTextarea(de.object.shortDescription + "*", "Eine Brücke");
      cy.contains(de.objectDocuments)
        .parent()
        .click();
      cy.contains("ion-label", de.pleaseChooseOption).should("exist");
      cy.contains("ion-label", de.idAssigned).should("exist");
      cy.setInput(de.object.id + "*", "1234");
      cy.setSelect(
        de.object.systems.name + "*",
        de.object.systems.data.singleSpanBeam,
        "singleSpanBeam"
      );
      cy.contains(de.objectDocuments)
        .parent()
        .click();
      cy.contains("h2", de.objectDocuments).should("exist");
      cy.contains(de.object.photo)
        .parent()
        .find('input[type="file"]')
        .attachFile("photo.jpg");
      cy.contains(de.object.groundPlan)
        .parent()
        .find('input[type="file"]')
        .attachFile({
          filePath: "groundPlan.pdf",
          encoding: "base64",
        });
      cy.contains(de.save).click();
      cy.url({
        timeout: 30000,
      }).should("include", "/object/1234");
      cy.contains("Eine Brücke").should("exist");
      cy.contains("1234").should("exist");
      cy.getFirestoreDoc(win.store, "objects/1234").then((doc) => {
        cy.wrap(doc.exists).should("eq", true);
        cy.wrap(doc.data().system).should("eq", "singleSpanBeam");
      });
    });
  });

  it("Opens the Objects from the Object List", () => {
    cy.visit("/home");
    cy.window().then((win) => {
      cy.contains(de.objectList)
        .parents(".tile")
        .find("ion-button")
        .click();
      cy.url().should("include", "/object-list");
      cy.contains("1234").should("exist");
      cy.get(`[title='${de.filter}']`).click();
      cy.contains(de.filter).should("exist");
      cy.setSelect(
        de.object.types.name,
        de.object.types.data.roadBridge,
        "roadBridge"
      );
      cy.contains(de.ok).click();
      cy.contains("1234").should("not.exist");
      cy.get(`[title='${de.filter}']`).click();
      cy.contains(de.filter).should("exist");
      cy.contains(de.object.types.data.roadBridge).should("exist");
      cy.get(`[title='${de.reset}']`).click();
      cy.contains(de.object.types.data.roadBridge).should("not.be.visible");
      cy.contains(de.ok).click();
      cy.contains("1234")
        .should("exist")
        .click();
      cy.url({
        timeout: 10000,
      }).should("include", "/object/1234");
      cy.contains("Eine Brücke").should("exist");
      cy.contains("1234").should("exist");
    });
  });

  it("Edits the Object", () => {
    cy.visit("/object/1234");
    cy.window().then((win) => {
      cy.getFirestoreDoc(win.store, "objects/1234").then((doc) => {
        cy.wrap(doc.exists).should("eq", true);
        cy.wrap(doc.data().material).should("eq", "reinforcedConcrete");
        cy.contains("Eine Brücke").should("exist");
        cy.contains("1234").should("exist");
        cy.contains(
          `${de.object.materials.name}: ${de.object.materials.data.reinforcedConcrete}`
        ).should("exist");
        cy.contains(de.editObject)
          .parent()
          .find("ion-button")
          .click();
        cy.setSelect(
          de.object.materials.name + "*",
          de.object.materials.data.steel,
          "steel"
        );
        cy.contains(de.objectDocuments)
          .parent()
          .click();
        cy.contains(de.save).click();
        cy.url({
          timeout: 30000,
        }).should("include", "/object/1234");
        cy.contains("Eine Brücke").should("exist");
        cy.contains("1234").should("exist");
        cy.contains(
          `${de.object.materials.name}: ${de.object.materials.data.steel}`
        ).should("exist");
        cy.getFirestoreDoc(win.store, "objects/1234").then((doc) => {
          cy.wrap(doc.exists).should("eq", true);
          cy.wrap(doc.data().material).should("eq", "steel");
        });
      });
    });

    // it("Deletes the Object", () => {
    //   cy.visit("/object/1234");
    //   cy.window().then((win) => {
    //     cy.contains("Eine Brücke").should("exist");
    //     cy.contains("1234").should("exist");
    //     cy.contains(de.requestObjectDeletion)
    //       .parent()
    //       .find("ion-button")
    //       .click();
    //     cy.contains(de.confirmDeletionRequest).should("exist");
    //     cy.contains(de.confirm).click();
    //     cy.get("ion-spinner");
    //     cy.url({
    //       timeout: 30000,
    //     }).should("include", "/home");
    //     cy.contains(de.user).should("exist");
    //   });
    // });
  });
});

describe("Inspection", () => {
  it("Creates an Inspection", () => {
    cy.visit("/object/1234");
    cy.window().then((win) => {
      cy.contains("Eine Brücke").should("exist");
      cy.contains("1234").should("exist");
      cy.contains(de.newInspection)
        .parent()
        .find("ion-button")
        .click();
      cy.url().should("include", "/object/1234/new-inspection");
      cy.contains(de.inspectionData).should("exist");
      cy.setSelect(
        de.inspection.inspector + "*",
        "Jonas Gaiswinkler",
        "Thej8pt0ilXGQwLp3vnmqarxpog2"
      );
      cy.setInput(de.inspection.date + "*", "2021-04-24");
      cy.setSelect(
        de.inspection.types.name + "*",
        de.inspection.types.data.check,
        "check"
      );
      cy.setSelect(
        de.inspection.weather.name,
        de.inspection.weather.data.dry,
        "dry"
      );
      cy.setInput(de.inspection.temperature, "16");
      cy.contains(de.inspection.photo)
        .parent()
        .find('input[type="file"]')
        .attachFile("inspection.jpg");
      cy.contains(de.save).click();
      cy.url({
        timeout: 30000,
      }).should("include", "/object/1234/inspection/2021-04-24");
      cy.contains("Jonas Gaiswinkler").should("exist");
      cy.contains(`${de.inspection.date}: 24.4.2021`).should("exist");
      cy.getFirestoreSnap(
        win.store,
        "objects/1234/inspections",
        "date",
        "2021-04-24"
      ).then((snap) => {
        cy.wrap(snap.empty).should("eq", false);
        cy.wrap(snap.docs[0].data().type).should("eq", "check");
      });
    });
  });

  it("Opens the Inspection from the Inspection List", () => {
    cy.visit("/object/1234");
    cy.window().then((win) => {
      cy.contains(de.inspectionList)
        .parent()
        .find("ion-button")
        .click();
      cy.url().should("include", "/object/1234/inspection-list");
      cy.contains("1234").should("exist");
      cy.contains("24.4.2021").should("exist");
      cy.get(`[title='${de.filter}']`).click();
      cy.contains(de.filter).should("exist");
      cy.setSelect(
        de.inspection.types.name,
        de.inspection.types.data.specialInspection,
        "specialInspection"
      );
      cy.contains(de.ok).click();
      cy.contains("24.4.2021").should("not.exist");
      cy.get(`[title='${de.filter}']`).click();
      cy.contains(de.filter).should("exist");
      cy.contains(de.inspection.types.data.specialInspection).should("exist");
      cy.get(`[title='${de.reset}']`).click();
      cy.contains(de.inspection.types.data.specialInspection).should(
        "not.be.visible"
      );
      cy.contains(de.ok).click();
      cy.contains("24.4.2021")
        .should("exist")
        .click();
      cy.url({
        timeout: 10000,
      }).should("include", "/object/1234/inspection/2021-04-24");
      cy.contains("Jonas Gaiswinkler").should("exist");
      cy.contains(`${de.inspection.date}: 24.4.2021`).should("exist");
    });
  });

  it("Edits the Inspection", () => {
    cy.visit("/object/1234/inspection/2021-04-24");
    cy.window().then((win) => {
      cy.getFirestoreSnap(
        win.store,
        "objects/1234/inspections",
        "date",
        "2021-04-24"
      ).then((snap) => {
        cy.wrap(snap.empty).should("eq", false);
        cy.wrap(snap.docs[0].data().type).should("eq", "check");
      });
      cy.contains("Jonas Gaiswinkler").should("exist");
      cy.contains(`${de.inspection.date}: 24.4.2021`).should("exist");
      cy.contains(
        `${de.inspection.types.name}: ${de.inspection.types.data.check}`
      ).should("exist");
      cy.contains(de.editInspection)
        .parent()
        .find("ion-button")
        .click();
      cy.url().should("include", "/object/1234/inspection/2021-04-24/edit");
      cy.setInput(de.inspection.date + "*", "2021-04-21");
      cy.setSelect(
        de.inspection.types.name + "*",
        de.inspection.types.data.continuousMonitoring,
        "continuousMonitoring"
      );
      cy.contains(de.save).click();
      cy.url({
        timeout: 30000,
      }).should("include", "/object/1234/inspection/2021-04-21");
      cy.contains("Jonas Gaiswinkler").should("exist");
      cy.contains(`${de.inspection.date}: 21.4.2021`).should("exist");
      cy.contains(
        `${de.inspection.types.name}: ${de.inspection.types.data.continuousMonitoring}`
      ).should("exist");
      cy.getFirestoreSnap(
        win.store,
        "objects/1234/inspections",
        "date",
        "2021-04-24"
      ).then((snap) => {
        cy.wrap(snap.empty).should("eq", true);
      });
      cy.getFirestoreSnap(
        win.store,
        "objects/1234/inspections",
        "date",
        "2021-04-21"
      ).then((snap) => {
        cy.wrap(snap.empty).should("eq", false);
        cy.wrap(snap.docs[0].data().type).should("eq", "continuousMonitoring");
      });
    });
  });
});

describe("Assessment", () => {
  it("Assesses the Object", () => {
    cy.visit("/object/1234/inspection/2021-04-21");
    cy.window().then((win) => {
      cy.getFirestoreSnap(
        win.store,
        "objects/1234/assessments",
        "date",
        "2021-04-21"
      ).then((snap) => {
        cy.wrap(snap.empty).should("eq", true);
      });
      cy.contains("Jonas Gaiswinkler").should("exist");
      cy.contains(`${de.inspection.date}: 21.4.2021`).should("exist");
      cy.contains(de.assessment)
        .parent()
        .find("ion-button")
        .click();
      cy.url().should(
        "include",
        "/object/1234/inspection/2021-04-21/assessment"
      );
      cy.setAssessmentSelect(de.assessments.substructure, de.assessments[1], 1);
      cy.setAssessmentSelect(
        de.assessments.superstructure,
        de.assessments[2],
        2
      );
      cy.setAssessmentSelect(de.assessments.equipment, de.assessments[4], 4);
      cy.setAssessmentSelect(de.assessments.object, de.assessments[3], 3);
      cy.contains(de.save).click();
      cy.url({
        timeout: 30000,
      }).should("include", "/object/1234/inspection/2021-04-21");
      cy.getFirestoreSnap(
        win.store,
        "objects/1234/assessments",
        "date",
        "2021-04-21"
      ).then((snap) => {
        cy.wrap(snap.empty).should("eq", false);
        cy.wrap(snap.docs[0].data().substructure).should("eq", 1);
        cy.wrap(snap.docs[0].data().superstructure).should("eq", 2);
        cy.wrap(snap.docs[0].data().equipment).should("eq", 4);
        cy.wrap(snap.docs[0].data().object).should("eq", 3);
      });
    });
  });
});

describe("Damage/Defect", () => {
  it("Creates an Damage/Defect", () => {
    cy.visit("/object/1234/inspection/2021-04-21");
    cy.window().then((win) => {
      cy.contains("Jonas Gaiswinkler").should("exist");
      cy.contains(`${de.inspection.date}: 21.4.2021`).should("exist");
      cy.contains(de.newDamage)
        .parent()
        .find("ion-button")
        .click();
      cy.url().should(
        "include",
        "/object/1234/inspection/2021-04-21/new-damage"
      );
      cy.contains("h2", de.damageData).should("be.visible");
      cy.setSelect(
        de.damage.allocations.name + "*",
        de.damage.allocations.data.superstructure.name,
        "superstructure"
      );
      cy.contains(de.damage.component + "*").should("not.exist");
      cy.setSelect(
        de.damage.allocations.name + "*",
        de.damage.allocations.data.substructure.name,
        "substructure"
      );
      cy.contains(de.damage.component + "*").should("exist");
      cy.setSelect(
        de.damage.component + "*",
        de.damage.allocations.data.substructure.data.flatFoundation,
        "flatFoundation"
      );
      cy.setInput(de.damage.componentDetail, "Test");
      cy.setSelect(
        de.damage.types.name + "*",
        de.damage.types.data.crack,
        "crack"
      );
      cy.setInput(de.damage.cause, "Wassereintritt");
      cy.contains(de.damageGroundPlan).click();
      cy.contains("h2", de.damageGroundPlan).should("be.visible");
      cy.waitUntil(() =>
        cy
          .wrap(win.store.state.damageParams.isLoading)
          .then((isLoading) => !isLoading)
      );
      cy.get("[title='zoomIn']").click();
      cy.waitUntil(() =>
        cy
          .wrap(win.store.state.damageParams.isLoading)
          .then((isLoading) => !isLoading)
      );
      cy.get("#canvas").click(300, 300, { force: true });
      cy.contains(de.damageState).click();
      cy.contains("h2", de.damageState, {
        timeout: 10000,
      }).should("be.visible");
      cy.setMeasurement(de.damage.measurement1 + "*", de, "Breite", "7", "mm");
      cy.setMeasurement(
        de.damage.limit.replace("{msg}", de.damage.measurement1Sm) + "*",
        de,
        false,
        "9",
        "mm"
      );
      cy.setMeasurement(de.damage.measurement2, de, "Länge", "3", "cm");
      cy.setInput(de.damage.impact, "Keine");
      cy.setSelect(
        de.damage.categories.name + "*",
        de.damage.categories.data.alertLimit,
        "alertLimit"
      );
      cy.contains(de.save).click();
      cy.url({
        timeout: 20000,
      }).should("include", "/object/1234/inspection/2021-04-21/damage/1");
      cy.contains(de.damage.allocations.data.substructure.name).should("exist");
      cy.contains("7 mm").should("exist");
      cy.contains(`${de.damage.limit.replace("{msg}", "Breite")}: 9 mm`).should(
        "exist"
      );
      cy.wrap(win.store.state.damage).then((damage) => {
        cy.wrap(Math.round(damage.data.locationGroundPlan.x)).should("eq", 848);
        cy.wrap(Math.round(damage.data.locationGroundPlan.x)).should("eq", 848);
      });
      cy.wrap(win.store.state.inspection).then((inspection) => {
        cy.getFirestoreDoc(win.store, `objects/1234/damages/1`).then((doc) => {
          cy.wrap(Math.round(doc.data().locationGroundPlan.x)).should(
            "eq",
            848
          );
          cy.wrap(Math.round(doc.data().locationGroundPlan.x)).should(
            "eq",
            848
          );
        });
        cy.getFirestoreDoc(
          win.store,
          `objects/1234/damages/1/states/${inspection.iid}`
        ).then((doc) => {
          cy.wrap(doc.data().measurement1.value).should("eq", 7);
        });
      });
    });
  });

  it("Opens the Damage/Defect from the Inspection List", () => {
    cy.visit("/object/1234/inspection/2021-04-21");
    cy.window().then((win) => {
      cy.contains(de.damageList)
        .parent()
        .find("ion-button")
        .click();
      cy.url().should(
        "include",
        "/object/1234/inspection/2021-04-21/damage-list"
      );
      cy.contains("1").should("exist");
      cy.contains(de.damage.types.data.crack).should("exist");
      cy.get(`[title='${de.filter}']`).click();
      cy.contains(de.filter).should("exist");
      cy.setSelect(
        de.damage.types.name,
        de.damage.types.data.deformation,
        "deformation"
      );
      cy.contains(de.ok).click();
      cy.contains(de.damage.types.data.crack).should("not.exist");
      cy.get(`[title='${de.filter}']`).click();
      cy.contains(de.filter).should("exist");
      cy.contains(de.damage.types.data.deformation).should("exist");
      cy.get(`[title='${de.reset}']`).click();
      cy.contains(de.damage.types.data.deformation).should("not.be.visible");
      cy.contains(de.ok).click();
      cy.contains(de.damage.types.data.crack)
        .should("exist")
        .click();
      cy.url({
        timeout: 10000,
      }).should("include", "/object/1234/inspection/2021-04-21/damage/1");
      cy.contains(de.damage.allocations.data.substructure.name).should("exist");
      cy.contains("7 mm").should("exist");
      cy.contains(`${de.damage.limit.replace("{msg}", "Breite")}: 9 mm`).should(
        "exist"
      );
    });
  });

  it("Edits an Damage/Defect", () => {
    cy.visit("/object/1234/inspection/2021-04-21/damage/1");
    cy.window().then((win) => {
      cy.url({
        timeout: 20000,
      }).should("include", "/object/1234/inspection/2021-04-21/damage/1");
      cy.getFirestoreDoc(win.store, `objects/1234/damages/1`).then((doc) => {
        cy.wrap(Math.round(doc.data().locationGroundPlan.x)).should("eq", 848);
        cy.wrap(Math.round(doc.data().locationGroundPlan.x)).should("eq", 848);
      });
      cy.contains(de.damage.allocations.data.substructure.name).should("exist");
      cy.contains("7 mm").should("exist");
      cy.contains(de.damage.types.data.crack).should("exist");
      cy.contains(`${de.damage.limit.replace("{msg}", "Breite")}: 9 mm`).should(
        "exist"
      );
      cy.contains(de.editDamage)
        .parent()
        .find("ion-button")
        .click();
      cy.url().should(
        "include",
        "/object/1234/inspection/2021-04-21/damage/1/edit"
      );
      cy.contains("h2", de.damageData).should("be.visible");
      cy.setSelect(
        de.damage.types.name + "*",
        de.damage.types.data.corrosion,
        "corrosion"
      );
      cy.contains(de.damageGroundPlan).click();
      cy.contains("h2", de.damageGroundPlan).should("be.visible");
      cy.waitUntil(() =>
        cy
          .wrap(win.store.state.damageParams.isLoading)
          .then((isLoading) => !isLoading)
      );
      cy.get("#canvas").click(200, 200, { force: true });
      cy.contains(de.save).click();
      cy.url({
        timeout: 20000,
      }).should(
        "eq",
        Cypress.config().baseUrl + "object/1234/inspection/2021-04-21/damage/1"
      );
      cy.contains(de.damage.types.data.corrosion).should("exist");
      cy.wrap(win.store.state.damage).then((damage) => {
        cy.wrap(Math.round(damage.data.locationGroundPlan.x)).should(
          "eq",
          1026
        );
        cy.wrap(Math.round(damage.data.locationGroundPlan.x)).should(
          "eq",
          1026
        );
      });
      cy.getFirestoreDoc(win.store, `objects/1234/damages/1`).then((doc) => {
        cy.wrap(Math.round(doc.data().locationGroundPlan.x)).should("eq", 1026);
        cy.wrap(Math.round(doc.data().locationGroundPlan.x)).should("eq", 1026);
      });
    });
  });
});

describe("Settings", () => {
  it("Opens settings", () => {
    cy.visit("/home");
    cy.get("ion-toolbar")
      .find("ion-button")
      .click();
    cy.get("ion-label")
      .contains(de.settings)
      .click();
    cy.url().should("include", "/settings");
  });
  it("Changes language", () => {
    cy.visit("/settings");
    cy.window().then((win) => {
      cy.waitUntil(() =>
        cy.wrap(win.i18n.locale).then((locale) => locale === "de")
      );
      cy.contains("h2", de.settings).should("exist");
      cy.contains(de.language)
        .parent()
        .click();
      cy.get("ion-radio")
        .parent()
        .contains(/^en$/)
        .parent()
        .click();
      cy.contains("h2", en.settings).should("exist");
      cy.waitUntil(() =>
        cy.wrap(win.i18n.locale).then((locale) => locale === "en")
      );
      cy.contains(en.language)
        .parent()
        .click();
      cy.get("ion-radio")
        .parent()
        .contains(/^de$/)
        .parent()
        .click();
      cy.contains("h2", de.settings).should("exist");
      cy.waitUntil(() =>
        cy.wrap(win.i18n.locale).then((locale) => locale === "de")
      );
    });
  });
  it("Resets Firebase", () => {
    cy.visit("/home");
    cy.window().then((win) => {
      cy.resetFirebase(win.store).then((result) =>
        cy.wrap(result.data.status).should("eq", 200)
      );
    });
  });
  it("Logout of the app", () => {
    cy.visit("/settings");
    cy.window().then((win) => {
      cy.waitUntil(() =>
        cy.wrap(win.store.state.user).then((user) => user && user.uid)
      );
      cy.get("ion-button")
        .contains(de.logout)
        .click();
      cy.url().should("include", "/login");
      cy.waitUntil(() =>
        cy.wrap(win.store.state.user).then((user) => user === null)
      );
    });
  });
});
