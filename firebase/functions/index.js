const admin = require('firebase-admin');
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter({
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    },
});
const { DateTime } = require("luxon");
const de = require("./locales/de.json");
admin.initializeApp();

let transporter = nodemailer.createTransport({
    host: 'mail.your-server.de',
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: "smart-inspection@jonasgaiswinkler.eu",
        pass: "41%@cQ#pJr2l"
    }
});


exports.setPermissions = functions.https.onCall(async (data, context) => {
    if (context.auth && context.auth.uid === "Thej8pt0ilXGQwLp3vnmqarxpog2" && data.uid !== undefined && data.role !== undefined) {
        await admin.auth().setCustomUserClaims(data.uid, { role: data.role });
        return { status: 200 };
    } else {
        return { status: 401 };
    }
});

exports.deleteObject = functions.https.onCall(async (data, context) => {
    if (context.auth && context.auth.token.role === "admin" && data.oid !== undefined) {
        await admin.firestore().collection("objects").doc(data.oid).delete();
        await admin.storage().bucket().deleteFiles({ prefix: `objects/${data.oid}/` });
        return { status: 200 };
    } else {
        return { status: 401 };
    }
});

exports.deleteInspection = functions.https.onCall(async (data, context) => {
    if (context.auth && data.oid !== undefined && data.iid !== undefined) {
        await admin.firestore().collection("objects").doc(data.oid).collection('inspections').doc(data.iid).delete();
        await admin.storage().bucket().deleteFiles({ prefix: `objects/${data.oid}/inspections/${data.iid}` });
        return { status: 200 };
    } else {
        return { status: 401 };
    }
});

exports.deleteDamage = functions.https.onCall(async (data, context) => {
    if (context.auth && data.oid !== undefined && data.did !== undefined) {
        const states = await admin.firestore().collection('objects').doc(data.oid).collection('damages').doc(data.did).collection('states').get();
        if (!states.empty) {
            const promises = []
            for (const state of states.docs) {
                promises.push(state.ref.delete());
            }
            await Promise.all(promises);
        }
        await admin.firestore().collection("objects").doc(data.oid).collection('damages').doc(data.did).delete();
        await admin.storage().bucket().deleteFiles({ prefix: `objects/${data.oid}/damages/${data.did}` });
        return { status: 200 };
    } else {
        return { status: 401 };
    }
});

exports.createInspectionReport = functions.https.onCall(async (data, context) => {
    if (context.auth && data.oid !== undefined && data.iid !== undefined) {
        const db = admin.firestore();

        const inspectionDoc = await db.collection("objects").doc(data.oid).collection("inspections").doc(data.iid).get();
        if (inspectionDoc.exists) {
            const inspection = inspectionDoc.data();
            const damageSnap = await db.collection("objects").doc(data.oid).collection("damages").get();
            const damagePromises = [];
            for (const damageDoc of damageSnap.docs) {
                damagePromises.push(async function () {
                    const stateSnap = await db.collection("objects").doc(data.oid).collection("damages").doc(damageDoc.id).collection("states").orderBy("date").get();
                    const states = stateSnap.docs.map((doc) => Object.assign(doc.data(), {
                        iid: doc.id
                    }));
                    return Object.assign(damageDoc.data(), {
                        states: states,
                        did: damageDoc.id
                    });
                }());
            }
            const damages = await Promise.all(damagePromises);
            let locale;
            if (data.locale === "de") {
                locale = de;
            } else {
                locale = de;
            }

            const content = [];

            const objectDoc = await db.collection("objects").doc(data.oid).get();
            await addObjectContent(content, locale, locale.inspectionReport, objectDoc.data(), data.oid);
            await addInspectionContent(content, locale, locale.inspectionReport, inspection, data.oid, data.iid);

            for (const damage of damages) {
                // eslint-disable-next-line no-await-in-loop
                await addDamageContent(content, locale, locale.inspectionReport, damage, data.oid, data.iid, damage.did);
            }

            const doc = printer.createPdfKitDocument({
                content: content,
                info: {
                    title: locale.inspectionReport,
                    author: 'Smart Inspection'
                },
                defaultStyle: {
                    font: 'Helvetica',
                    lineHeight: 1.4
                }, styles: {
                    title: {
                        fontSize: 24,
                        margin: [0, 0, 0, 8]
                    },
                    header: {
                        fontSize: 18,
                        margin: [0, 0, 0, 6]
                    },
                    subheader: {
                        fontSize: 15,
                        margin: [0, 0, 0, 6]
                    }
                },
                header: {
                    image: "assets/logo.png",
                    absolutePosition: { x: 495, y: 30 },
                    fit: [70, 70]
                },
                footer: function (currentPage) {
                    return {
                        text: currentPage.toString(), alignment: "right", margin: [0, 0, 25, 0], relativePosition: {
                            x: 0,
                            y: 25
                        }
                    }
                },
                pageSize: "A4",
                pageMargins: [50, 60, 50, 60]
            });
            const file = admin.storage().bucket().file('test/Inspektionsbericht.pdf');

            await new Promise(async (resolve, reject) => {
                const stream = doc.pipe(file.createWriteStream({ metadata: { contentType: 'application/pdf' } }));

                stream.on("finish", () => {
                    resolve();
                });

                doc.end();
            });
        } else {
            return { status: 404 };
        }
        return { status: 200 }
    } else {
        return { status: 401 };
    }
});

async function addObjectContent(content, locale, title, object, oid) {
    const db = admin.firestore();
    content.push({
        text: title,
        style: "title",
    });

    content.push({
        text: locale.object.name + " #" + oid,
        style: "header"
    });

    if (object.material) {
        content.push(locale.object.materials.name + ": " + locale.object.materials.data[object.material]);
    }

    if (object.type) {
        content.push(locale.object.types.name + ": " + locale.object.types.data[object.type]);
    }

    if (object.system) {
        content.push(locale.object.systems.name + ": " + locale.object.systems.data[object.system]);
    }

    if (object.crossSectionShape) {
        content.push(locale.object.crossSectionShapes.name + ": " + locale.object.crossSectionShapes.data[object.crossSectionShape]);
    }

    if (object.constructionYear) {
        content.push(locale.object.constructionYear + ": " + object.constructionYear);
    }

    if (object.routeCode) {
        content.push(locale.object.routeCode + ": " + object.routeCode);
    }

    if (object.routeName) {
        content.push(locale.object.routeName + ": " + object.routeName);
    }

    if (object.chainage) {
        content.push(locale.object.chainage + ": " + object.chainage);
    }

    if (object.spanLength) {
        content.push(locale.object.spanLength + ": " + object.spanLength);
    }

    if (object.width) {
        content.push(locale.object.width + ": " + object.width);
    }

    if (object.trafficRoutes) {
        content.push(locale.object.trafficRoutes + ": " + object.trafficRoutes);
    }

    if (object.shortDescription) {
        content.push(locale.object.shortDescription + ": " + object.shortDescription);
    }

    const assessmentSnap = await db.collection("objects").doc(oid).collection("assessments").orderBy("date", "desc").limit(1).get();
    if (!assessmentSnap.empty) {
        const assessmentDoc = assessmentSnap.docs[0];
        const assessment = assessmentDoc.data();
        addAssessmentContent(content, locale, locale.assessment + " - " + locale.inspection.name + " " + DateTime.fromISO(assessment.date).toFormat("dd.MM.yyyy"), assessment);
    }

    if (object.photo) {
        const photo = await admin.storage().bucket().file("objects/" + oid + "/" + object.photo).download();
        content.push({
            text: locale.object.photo,
            style: "subheader",
            margin: [0, 6, 0, 6]
        });
        content.push({
            image: photo[0],
            fit: [451, 350],
            alignment: "center",
        });
    }
}

async function addInspectionContent(content, locale, title, inspection, oid, iid) {
    const db = admin.firestore();
    content.push({
        text: title,
        style: "title",
        pageBreak: "before"
    });

    content.push({
        text: locale.object.name + " #" + oid + " - " + locale.inspection.name + " " + DateTime.fromISO(inspection.date).toFormat("dd.MM.yyyy"),
        style: "header"
    });

    if (inspection.inspector) {
        const userDoc = await db.collection("users").doc(inspection.inspector).get();
        if (userDoc.exists) {
            content.push(locale.inspection.inspector + ": " + userDoc.data().name)
        }
    }
    if (inspection.type) {
        content.push(locale.inspection.types.name + ": " + locale.inspection.types.data[inspection.type])
    }
    if (inspection.weather) {
        content.push(locale.inspection.weather.name + ": " + locale.inspection.weather.data[inspection.weather])
    }
    if (inspection.temperature) {
        content.push(locale.inspection.temperature + ": " + inspection.temperature)
    }
    if (inspection.additionalInfo) {
        content.push(locale.inspection.additionalInfo + ": " + inspection.additionalInfo)
    }

    const assessmentDoc = await db.collection("objects").doc(oid).collection("assessments").doc(iid).get();
    if (assessmentDoc.exists) {
        const assessment = assessmentDoc.data();
        addAssessmentContent(content, locale, locale.assessment, assessment);
    }

    if (inspection.photo) {
        const photo = await admin.storage().bucket().file("objects/" + oid + "/inspections/" + iid + "/" + inspection.photo).download();
        content.push({
            text: locale.inspection.photo,
            style: "subheader",
            margin: [0, 6, 0, 6]
        });
        content.push({
            image: photo[0],
            fit: [451, 350],
            alignment: "center",
        });
    }
}

async function addAssessmentContent(content, locale, title, assessment) {
    content.push({
        text: title,
        style: "subheader",
        margin: [0, 6, 0, 6]
    });
    const addAssessmentGrade = function (text, grade) {
        let color;
        if (grade === 1) {
            color = "#92d050";
        } else if (grade === 2) {
            color = "#ffff00";
        } else if (grade === 3) {
            color = "#ffc000";
        } else if (grade === 4) {
            color = "#ff6600";
        } else if (grade === 5) {
            color = "#ff0000";
        } else {
            color = "black";
        }
        content.push({
            text: [
                text,
                {
                    text: grade + " - " + locale.assessments[grade.toString()],
                    color: color
                }
            ]
        })
    }
    if (assessment.substructure) {
        addAssessmentGrade(locale.assessments.substructure + ": ", assessment.substructure);
    }
    if (assessment.superstructure) {
        addAssessmentGrade(locale.assessments.superstructure + ": ", assessment.superstructure);
    }
    if (assessment.equipment) {
        addAssessmentGrade(locale.assessments.equipment + ": ", assessment.equipment);
    }
    if (assessment.object) {
        addAssessmentGrade(locale.assessments.object + ": ", assessment.object);
    }
}

async function addDamageContent(content, locale, title, damage, oid, iid, did) {
    let currentState = damage.states.find((state) => state.iid === iid);
    content.push({
        text: title,
        style: "title",
        pageBreak: "before"
    });

    if (!currentState && damage.states.length > 0) {
        currentState = damage.states[damage.states.length - 1];
    }

    let header = locale.damage.name + " #" + did;
    if (currentState) {
        header += " - " + locale.inspection.name + " " + DateTime.fromISO(currentState.date).toFormat("dd.MM.yyyy");
    }
    content.push({
        text: header,
        style: "header"
    });

    if (damage.allocation) {
        content.push(locale.damage.allocations.name + ": " + locale.damage.allocations.data[damage.allocation].name)
    }

    if (damage.component) {
        content.push(locale.damage.component + ": " + locale.damage.allocations.data[damage.allocation].data[damage.component]);
    }

    if (damage.componentDetail) {
        content.push(locale.damage.componentDetail + ": " + damage.componentDetail);
    }

    if (damage.type) {
        content.push(locale.damage.types.name + ": " + locale.damage.types.data[damage.type]);
    }

    if (damage.typeDetail) {
        content.push(locale.damage.typeDetail + ": " + damage.typeDetail);
    }

    if (damage.location) {
        content.push(locale.damage.location + ": " + damage.location);
    }

    if (damage.cause) {
        content.push(locale.damage.cause + ": " + damage.cause);
    }

    if (damage.description) {
        content.push(locale.damage.description + ": " + damage.description);
    }

    if (currentState) {
        content.push({
            text: locale.measurements,
            style: "subheader",
            margin: [0, 6, 0, 6],
        });

        const table = [];
        const firstRow = [locale.inspection.date, damage.measurement1Name];
        if (damage.measurement2Name) {
            firstRow.push(damage.measurement2Name);
        }

        table.push(firstRow);

        for (const state of damage.states) {
            let row = [{ text: DateTime.fromISO(state.date).toFormat("dd.MM.yyyy") },
            {
                text: state.measurement1.value + " " + state.measurement1.unit
            }];

            if (toMillimetre(state.measurement1) >=
                toMillimetre(currentState.limit)) {
                row[1].color = "#eb445a";
            }
            if (damage.measurement2Name && state.measurement2) {
                row.push({ text: state.measurement2.value + " " + state.measurement2.unit });
            }
            if (state.iid === currentState.iid) {
                row = row.map((cell) => Object.assign(cell, {
                    fillColor: "#005096",
                    fillOpacity: 0.2
                }))
            }
            table.push(row);
        }

        content.push({
            table: {
                body: table,
            },
            layout: {
                defaultBorder: false,
            },
            margin: [0, 0, 0, 6]
        });

        if (currentState.limit) {
            content.push(locale.damage.limitSm + ": " + currentState.limit.value + " " + currentState.limit.unit);
        }

        if (currentState.impact) {
            content.push(locale.damage.impact + ": " + currentState.impact);
        }

        if (currentState.category) {
            content.push(locale.damage.categories.name + ": " + locale.damage.categories.data[currentState.category]);
        }

        if (currentState.action) {
            content.push(locale.damage.action + ": " + currentState.action);
        }

        if (currentState.period) {
            content.push(locale.damage.period + ": " + currentState.period);
        }

        if (currentState.additionalInfo) {
            content.push(locale.damage.additionalInfo + ": " + currentState.additionalInfo);
        }

        if (currentState.photo) {
            content.push({
                text: locale.damage.photo,
                style: "subheader",
                margin: [0, 6, 0, 6],
            });
            const image = await admin.storage().bucket().file("objects/" + oid + "/damages/" + did + "/states/" + currentState.iid + "/" + currentState.photo).download();
            content.push({
                image: image[0],
                fit: [451, 350],
                alignment: "center",
            });
        }
    }

    const addLocation = async function (location, text, file) {
        if (damage[location]) {
            content.push({
                text: locale[text],
                style: "subheader",
                margin: [0, 6, 0, 6],
            });
            const image = await admin.storage().bucket().file("objects/" + oid + "/damages/" + did + "/" + file + ".png").download();
            content.push({
                image: image[0],
                fit: [451, 350],
                alignment: "center",
            });
        }
    }

    await addLocation("locationGroundPlan", "damageGroundPlan", "imageGroundPlan");
    await addLocation("locationLongitudinalSection", "damageLongitudinalSection", "imageLongitudinalSection");
    await addLocation("locationCrossSection", "damageCrossSection", "imageCrossSection");

}

const toMillimetre = function (measurement) {
    if (!measurement) {
        return null;
    }
    let x = measurement.value;
    if (measurement.unit === "cm") {
        x = x * 10;
    } else if (measurement.unit === "dm") {
        x = x * 100;
    } else if (measurement.unit === "m") {
        x = x * 1000;
    }
    return x;
};

exports.notifyAdminLimit = functions.firestore.document('objects/{oid}/damages/{did}/states/{iid}').onWrite(async (change, context) => {
    const document = change.after.exists ? change.after.data() : null;
    const oldDocument = change.before.exists ? change.before.data() : null;

    if (document !== null) {
        if (document.category === 'immediateActionLimit' && (oldDocument === null || document.category !== oldDocument.category)) {
            const users = await admin.auth().listUsers();
            const admins = users.users.filter((user) => user.customClaims !== undefined && user.customClaims.role === 'admin');
            if (admins.length !== 0) {
                const emails = [];
                for (const admin of admins) {
                    emails.push(admin.email);
                }

                const mailOptions = {
                    from: 'Smart Inspection <smart-inspection@jonasgaiswinkler.eu>', // Something like: Jane Doe <janedoe@gmail.com>
                    to: 'smart-inspection@jonasgaiswinkler.eu',
                    bcc: emails,
                    subject: 'Soforteingriffsschwelle bei Objekt #' + context.params.oid + ' festgelegt', // email subject
                    html: `<p>Für den Mangel/Schaden #${context.params.did} wurde bei der Inspektion am ${new Date(document.date).toLocaleDateString("de-DE")} die Soforteingriffsschwelle festgelegt.</p>
                <p><a href="https://jonasgaiswinkler.eu/smart-inspection/object/${context.params.oid}/inspection/${document.date}/damage/${context.params.did}">Link zum Mangel/Schaden</a></p>
                <p>Hinweis: Bitte nicht auf diese E-Mail antworten!</p>`
                };

                // returning result
                await transporter.sendMail(mailOptions);
            }

        }
    }
});

exports.notifyAdminAssessment = functions.firestore.document('objects/{oid}/assessments/{iid}').onWrite(async (change, context) => {
    const document = change.after.exists ? change.after.data() : null;
    const oldDocument = change.before.exists ? change.before.data() : null;

    if (document !== null) {
        if ((document.substructure === 5 && (oldDocument === null || document.substructure !== oldDocument.substructure)) ||
            (document.superstructure === 5 && (oldDocument === null || document.superstructure !== oldDocument.superstructure)) ||
            (document.equipment === 5 && (oldDocument === null || document.equipment !== oldDocument.equipment)) ||
            (document.object === 5 && (oldDocument === null || document.object !== oldDocument.object))) {
            const users = await admin.auth().listUsers();
            const admins = users.users.filter((user) => user.customClaims !== undefined && user.customClaims.role === 'admin');
            if (admins.length !== 0) {
                const emails = [];
                for (const admin of admins) {
                    emails.push(admin.email);
                }

                const mailOptions = {
                    from: 'Smart Inspection <smart-inspection@jonasgaiswinkler.eu>', // Something like: Jane Doe <janedoe@gmail.com>
                    to: 'smart-inspection@jonasgaiswinkler.eu',
                    bcc: emails,
                    subject: 'Schlechter Zustand bei Objekt #' + context.params.oid + ' festgestellt', // email subject
                    html: `<p>Für das Object #${context.params.oid} wurde bei der Inspektion am ${new Date(document.date).toLocaleDateString("de-DE")} die Bewertung "Schlechter Zustand" festgelegt.</p>
                    <p>Unterbaubewertung: ${getAssessmentText(document.substructure)}</p>
                    <p>Überbaubewertung: ${getAssessmentText(document.superstructure)}</p>
                    <p>Ausrüstungsbewertung: ${getAssessmentText(document.equipment)}</p>
                    <p>Objektbewertung: ${getAssessmentText(document.object)}</p>
                <p><a href="https://jonasgaiswinkler.eu/smart-inspection/object/${context.params.oid}/inspection/${document.date}">Link zur Inspektion</a></p>
                <p>Hinweis: Bitte nicht auf diese E-Mail antworten!</p>`
                };

                // returning result
                await transporter.sendMail(mailOptions);
            }

        }
    }
});

function getAssessmentText(grade) {
    if (grade === 1) {
        return "1 - Sehr guter Zustand";
    } else if (grade === 2) {
        return "2 - Guter Zustand";
    } else if (grade === 3) {
        return "3 - Ausreichender Zustand";
    } else if (grade === 4) {
        return "4 - Mangelhafter Zustand";
    } else {
        return "5 - Schlechter Zustand";
    }
}