/* eslint-disable @typescript-eslint/no-use-before-define */
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

export default {
    namespaced: true,
    state: () => ({
        newParams: InspectionParams(),
        editParams: InspectionParams(),
        isLoading: false
    }),
    mutations: {
        setNewParam(state, payload) {
            state.newParams[payload.key] = payload.value;
        },
        clearNewParams(state) {
            state.newParams = InspectionParams();
        },
        setEditParams(state, editParams) {
            state.editParams = editParams;
        },
        setEditParam(state, payload) {
            state.editParams[payload.key] = payload.value;
        },
        clearEditParams(state) {
            state.editParams = InspectionParams();
        },
        setIsLoading(state, isLoading) {
            state.isLoading = isLoading
        }
    },
    getters: {

    },
    actions: {
        async saveNew(context) {
            const oid = context.rootState.object.oid;
            if (oid != null) {
                const params = context.state.newParams;
                const db = firebase.firestore();
                const storage = firebase.storage();

                const inspectionDoc = db.collection("objects").doc(oid).collection("inspections").doc();
                await inspectionDoc.set({
                    inspector: params.inspector,
                    date: params.date,
                    type: params.type,
                    weather: params.weather,
                    temperature: params.temperature != null ? parseFloat(params.temperature) : null,
                    photo: params.photo != null ? "photo" + getFileExtension(params.photo) : null,
                    additionalInfo: params.additionalInfo,
                });

                const promises = [];

                if (params.photo != null) {
                    const photoPromise = storage.ref("/objects/" + oid + "/inspections/" + inspectionDoc.id + "/photo" + getFileExtension(params.photo)).put(params.photo);
                    promises.push(photoPromise);
                }

                await Promise.all(promises);
                context.commit("clearNewParams");
                return { status: 200, oid: oid, iid: inspectionDoc.id, idate: params.date };
            } else {
                return { status: 400 };
            }
        },
        async saveEdit(context) {
            const params = context.state.editParams;
            const oid = context.rootState.object.oid;
            const iid = context.rootState.inspection.iid;
            const db = firebase.firestore();

            const inspectionDoc = db.collection("objects").doc(oid).collection('inspections').doc(iid);
            const payload = {
                inspector: params.inspector,
                date: params.date,
                type: params.type,
                weather: params.weather,
                temperature: params.temperature != null ? parseFloat(params.temperature) : null,
                photo: params.photo != null ? "photo" + getFileExtension(params.photo) : null,
                additionalInfo: params.additionalInfo,
            }
            await inspectionDoc.update(payload);

            await editFile(context, oid, iid, params.photo, "photo")
            context.commit("clearNewParams");
            await context.dispatch("inspection/load", null, { root: true });
            return { status: 200, oid: oid, iid: iid, idate: params.date };
        },
        async load(context) {
            const params = context.rootState.inspection.data;
            const editParams = InspectionParams();
            const oid = context.rootState.object.oid;
            const iid = context.rootState.inspection.iid;
            const storage = firebase.storage();

            const getFile = async function (key) {
                if (params[key] != null) {
                    const url = await storage.ref("/objects/" + oid + "/inspections/" + iid + "/" + params[key]).getDownloadURL();
                    editParams[key] = { name: params[key], same: true, url: url };
                } else {
                    editParams[key] = null;
                }
            };

            editParams.inspector = params.inspector;
            editParams.date = params.date;
            editParams.type = params.type;
            editParams.weather = params.weather;
            editParams.temperature = params.temperature != null ? params.temperature.toString() : null;
            editParams.additionalInfo = params.additionalInfo;
            await getFile("photo");

            context.commit("setEditParams", editParams);
        },
        async exists(context, route) {
            const params = route === 'NewInspection' ? context.state.newParams : context.state.editParams;
            const oid = context.rootState.object.oid;
            const db = firebase.firestore();

            if (route === 'EditInspection' && params.date === context.rootState.inspection.idate) {
                return false;
            }

            const snapshot = await db.collection("objects").doc(oid).collection('inspections').where('date', '==', params.date).get();
            if (!snapshot.empty) {
                return true;
            } else {
                return false;
            }
        }
    }
}

function InspectionParams() {
    return {
        inspector: null,
        date: null,
        type: null,
        weather: null,
        temperature: null,
        photo: null,
        additionalInfo: null
    }
}

async function editFile(context, oid, iid, file, paramName) {
    const storage = firebase.storage();
    const oldFileName = context.rootState.inspection.data[paramName];
    if (file != null && file.same !== true) {
        if (oldFileName != null) {
            await storage.ref("/objects/" + oid + "/inspections/" + iid + "/" + oldFileName).delete();
        }
        return await storage.ref("/objects/" + oid + "/inspections/" + iid + "/" + paramName + getFileExtension(file)).put(file);
    } else if (file == null && oldFileName != null) {
        return await storage.ref("/objects/" + oid + "/inspections/" + iid + "/" + oldFileName).delete();
    } else {
        return null;
    }
}

function getFileExtension(file) {
    return file.name.match(/\.[0-9a-z]+$/i)[0];
}