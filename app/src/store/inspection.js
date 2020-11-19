/* eslint-disable @typescript-eslint/no-use-before-define */
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";

export default {
    namespaced: true,
    state: () => ({
        iid: null,
        idate: null,
        data: null,
        photoUrl: null,
        list: null,
        isLoading: false,
    }),
    mutations: {
        setIid(state, iid) {
            state.iid = iid;
        },
        setIdate(state, idate) {
            state.idate = idate;
        },
        setData(state, data) {
            state.data = data;
        },
        setPhotoUrl(state, photoUrl) {
            state.photoUrl = photoUrl;
        },
        clear(state) {
            state.data = null;
            state.photoUrl = null;
        },
        setList(state, list) {
            state.list = list;
        },
        setIsLoading(state, isLoading) {
            state.isLoading = isLoading;
        },
    },
    getters: {

    },
    actions: {
        async search(context, idate) {
            const oid = context.rootState.object.oid;
            const db = firebase.firestore();
            const snapshot = await db.collection('objects').doc(oid).collection('inspections').where('date', '==', idate).get();
            if (snapshot.empty) {
                return { status: 404 };
            } else {
                context.commit('setIid', snapshot.docs[0].id);
                context.commit('setIdate', snapshot.docs[0].data().date);
                return { status: 200 };
            }
        },
        async load(context) {
            context.commit("clear");
            const oid = context.rootState.object.oid;
            const iid = context.state.iid;
            if (iid != null) {
                const db = firebase.firestore();
                const objectDoc = await db.collection("objects").doc(oid).collection("inspections").doc(iid).get();
                if (objectDoc.exists) {
                    const data = { ...objectDoc.data() };
                    data.inspectorName = (await db.collection("users").doc(data.inspector).get()).data().name;
                    context.commit("setData", data);
                    if (data != undefined && data.photo != null) {
                        const storage = firebase.storage();
                        const photoUrl = await storage.ref("/objects/" + oid + "/inspections/" + iid + "/" + data.photo).getDownloadURL();
                        context.commit("setPhotoUrl", photoUrl);
                    }
                    return { status: 200 }
                } else {
                    return { status: 404 };
                }
            } else {
                return { status: 400 };
            }
        },
        async loadList(context, global) {
            context.commit("setIsLoading", true);
            const oid = context.rootState.object.oid;
            if (global) {
                const list = await getGlobalInspections();
                context.commit('setList', list);
            } else {
                const list = await getObjectInspections(oid);
                context.commit('setList', list);
            }
            context.commit("setIsLoading", false);
        },
        async delete(context) {
            const oid = context.rootState.object.oid;
            const iid = context.state.iid;
            if (oid != null && iid != null) {
                const functions = firebase.functions();
                const result = await functions.httpsCallable('deleteInspection')({ oid: oid, iid: iid });
                if (result.data.status === 200) {
                    context.dispatch("loadList");
                } else {
                    throw new Error("Error in deleting object!");
                }
            }
        }
    }
}

const getObjectInspections = async function (oid) {
    const db = firebase.firestore();

    const inspections = await db
        .collection("objects")
        .doc(oid)
        .collection("inspections")
        .get();

    const list = [];
    if (!inspections.empty) {
        for (const inspection of inspections.docs) {
            list.push({
                iid: inspection.id,
                oid: oid,
                date: inspection.data().date,
                text: new Date(inspection.data().date).toLocaleDateString("de-DE"),
            });
        }
        return list;
    } else {
        return null;
    }
};

const getGlobalInspections = async function () {
    const db = firebase.firestore();
    const objects = await db.collection("objects").get();

    const promises = [];
    for (const object of objects.docs) {
        promises.push(getObjectInspections(object.id));
    }

    const result = await Promise.all(promises);
    return result
        .filter(function (el) {
            return el != null;
        })
        .flat(1);
};