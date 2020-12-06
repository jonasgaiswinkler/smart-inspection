const admin = require('firebase-admin');
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
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

exports.notifyAdmin = functions.firestore.document('objects/{oid}/damages/{did}/states/{iid}').onWrite(async (change, context) => {
    const document = change.after.exists ? change.after.data() : null;
    const oldDocument = change.before.data();

    if (document !== null) {
        if (document.category === 'immediateActionLimit' && document.category !== oldDocument.category) {
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