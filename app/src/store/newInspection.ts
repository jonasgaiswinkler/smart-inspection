/* eslint-disable @typescript-eslint/no-use-before-define */
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

export default {
    namespaced: true,
    state: () => ({
        params: InspectionParams(),
        isLoading: false
    }),
    mutations: {
        setParam(state: any, payload: any) {
            state.params[payload.key] = payload.value;
        },
        clearParams(state: any) {
            state.params = InspectionParams();
        },
        setIsLoading(state: any, isLoading: boolean) {
            state.isLoading = isLoading
        }
    },
    getters: {

    },
    actions: {
        async save(context: any) {
            const oid = context.rootState.object.oid;
            if (oid !== null) {
                const params = context.state.params;
                const db = firebase.firestore();
                const storage = firebase.storage();

                const inspectionDoc = db.collection("objects").doc(oid).collection("inspections").doc();
                await inspectionDoc.set({
                    inspector: params.inspector,
                    date: params.date,
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
                context.commit("clearParams");
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

function getFileExtension(file: any) {
    return file.name.match(/\.[0-9a-z]+$/i)[0];
}