const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp();

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