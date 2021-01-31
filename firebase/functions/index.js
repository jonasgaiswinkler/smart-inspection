const admin = require('firebase-admin');
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
const PDFDocument = require('pdfkit');
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
                    const states = stateSnap.docs.map((doc) => doc.data());
                    return Object.assign(damageDoc.data(), {
                        states: states
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
            const doc = new PDFDocument({
                info: {
                    Title: locale.inspectionReport
                },
                size: "A4"
            });
            const file = admin.storage().bucket().file('test/Testfile.pdf');

            await new Promise(async (resolve, reject) => {
                const stream = doc.pipe(file.createWriteStream({ metadata: { contentType: 'application/pdf' } }));

                stream.on("finish", () => {
                    resolve();
                });

                addPageHeader(doc);
                await addInspectionContent(doc, locale, inspection, data.oid, data.iid);
                for (const damage of damages) {
                    doc.addPage();
                    addPageHeader(doc);
                    // eslint-disable-next-line no-await-in-loop
                    await addDamageContent(doc, locale, damage, data.oid, data.iid, damage.did);
                }

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

async function addInspectionContent(doc, locale, inspection, oid, iid) {
    const db = admin.firestore();
    doc.fontSize(24).text(locale.inspectionReport).moveDown(0.5);
    doc.fontSize(18).text(locale.object.name + " #" + oid + " - " + locale.inspection.name + " " + DateTime.fromISO(inspection.date).toFormat("dd.MM.yyyy")).moveDown();
    doc.fontSize(12);
    if (inspection.inspector) {
        const userDoc = await db.collection("users").doc(inspection.inspector).get();
        if (userDoc.exists) {
            doc.text(locale.inspection.inspector + ": " + userDoc.data().name).moveDown(0.5);
        }
    }
    if (inspection.type) {
        doc.text(locale.inspection.types.name + ": " + locale.inspection.types.data[inspection.type]).moveDown(0.5);
    }
    if (inspection.weather) {
        doc.text(locale.inspection.weather.name + ": " + locale.inspection.weather.data[inspection.weather]).moveDown(0.5);
    }
    if (inspection.temperature) {
        doc.text(locale.inspection.temperature + ": " + inspection.temperature).moveDown(0.5);
    }
    if (inspection.additionalInfo) {
        doc.text(locale.inspection.additionalInfo + ": " + inspection.additionalInfo).moveDown(0.5);
    }
    doc.moveDown(0.5);

    const assessmentDoc = await db.collection("objects").doc(oid).collection("assessments").doc(iid).get();
    if (assessmentDoc.exists) {
        const assessment = assessmentDoc.data();
        doc.fontSize(15).text(locale.assessment).moveDown(0.5);
        doc.fontSize(12);
        const addAssessmentGrade = function (doc, grade) {
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
            doc.fillColor(color).text(grade + " - " + locale.assessments[grade.toString()]).fillColor("black");
        }
        if (assessment.substructure) {
            doc.text(locale.assessments.substructure + ": ", { continued: true });
            addAssessmentGrade(doc, assessment.substructure);
            doc.moveDown(0.5);
        }
        if (assessment.superstructure) {
            doc.text(locale.assessments.superstructure + ": ", { continued: true });
            addAssessmentGrade(doc, assessment.superstructure);
            doc.moveDown(0.5);
        }
        if (assessment.equipment) {
            doc.text(locale.assessments.equipment + ": ", { continued: true });
            addAssessmentGrade(doc, assessment.equipment);
            doc.moveDown(0.5);
        }
        if (assessment.object) {
            doc.text(locale.assessments.object + ": ", { continued: true });
            addAssessmentGrade(doc, assessment.object);
            doc.moveDown(0.5);
        }
        doc.moveDown(0.5);
    }

    if (inspection.photo) {
        const photo = await admin.storage().bucket().file("objects/" + oid + "/inspections/" + iid + "/" + inspection.photo).download();
        doc.fontSize(15).text(locale.inspection.photo).moveDown(0.5);
        doc.image(photo[0], undefined, undefined, { fit: [451, 350], align: "center" }).moveDown(1);
    }
}

async function addDamageContent(doc, locale, damage, oid, iid, did) {
    console.log(damage);
    doc.fontSize(24).text(locale.inspectionReport).moveDown(0.5);
    doc.fontSize(18).text(locale.damage.name + " #" + did + " - " + locale.inspection.name + " " + DateTime.fromISO(damage.date).toFormat("dd.MM.yyyy")).moveDown();
    doc.fontSize(12);

    if (damage.allocation) {
        doc.text(locale.damage.allocations.name + ": " + locale.damage.allocations.data[damage.allocation].name);
    }

    if (damage.component) {
        doc.text(locale.damage.component + ": " + locale.damage.allocations.data[damage.allocation].data[damage.component]);
    }

    if (damage.componentDetail) {
        doc.text(locale.damage.componentDetail + ": " + damage.componentDetail);
    }

    if (damage.type) {
        doc.text(locale.damage.types.name + ": " + locale.damage.types.data[damage.type]);
    }

    if (damage.typeDetail) {
        doc.text(locale.damage.typeDetail + ": " + damage.typeDetail);
    }

    if (damage.location) {
        doc.text(locale.damage.location + ": " + damage.location);
    }

    if (damage.cause) {
        doc.text(locale.damage.cause + ": " + damage.cause);
    }

    if (damage.description) {
        doc.text(locale.damage.description + ": " + damage.description);
    }

    doc.moveDown();
    doc.fontSize(15).text(locale.measurements).moveDown(0.5);
}

function addPageHeader(doc) {
    const logoUrl = "assets/logo.png";
    doc.image(logoUrl, 495, 30, { fit: [70, 70] });
}

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