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
            if (oid !== null) {
                const params = context.state.newParams;
                const db = firebase.firestore();
                const storage = firebase.storage();

                const inspections = await db.collection("objects").doc(oid).collection("inspections").get();
                const inspectionDoc = db.collection("objects").doc(oid).collection("inspections").doc((inspections.size + 1).toString());
                await inspectionDoc.set({
                    inspector: params.inspector,
                    date: new Date(params.date),
                    inspectionType: params.inspectionType,
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
            } else {
                return { status: 400 };
            }
        }
    }
}

function InspectionParams() {
    return {
        inspector: null,
        date: null,
        inspectionType: null,
        weather: null,
        temperature: null,
        photo: null,
        additionalInfo: null
    }
}

function getFileExtension(file) {
    return file.name.match(/\.[0-9a-z]+$/i)[0];
}