/* eslint-disable @typescript-eslint/no-use-before-define */
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

export default {
    namespaced: true,
    state: () => ({
        params: BridgeParams(),
        isLoading: false
    }),
    mutations: {
        setParam(state: any, payload: any) {
            state.params[payload.key] = payload.value;
        },
        clearParams(state: any) {
            state.params = BridgeParams();
        },
        setIsLoading(state: any, isLoading: boolean) {
            state.isLoading = isLoading
        }
    },
    getters: {
        getCoords(state: any) {
            const coords = state.params.coords;
            if (coords != null) {
                return coords.latitude + ", " + coords.longitude;
            } else {
                return null;
            }
        }
    },
    actions: {
        async save(context: any) {
            const params = context.state.params;
            const db = firebase.firestore();
            const storage = firebase.storage();

            const bridgeDoc = db.collection("objects").doc();
            await bridgeDoc.set({
                material: params.material,
                type: params.type,
                system: params.system,
                constructionYear: params.constructionYear != null ? parseInt(params.constructionYear) : null,
                lineStreet: params.lineStreet,
                chainage: params.chainage != null ? parseFloat(params.chainage) : null,
                coords: params.coords != null ? new firebase.firestore.GeoPoint(params.coords.latitude, params.coords.longitude) : null,
                spanLength: params.spanLength != null ? parseFloat(params.spanLength) : null,
                superstructure: params.superstructure,
                trafficRoutes: params.trafficRoutes != null ? parseInt(params.trafficRoutes) : null,
                shortDescription: params.shortDescription,
                photo: params.photo != null ? "photo" + getFileExtension(params.photo) : null,
                groundPlan: params.groundPlan != null ? "groundPlan" + getFileExtension(params.groundPlan) : null,
                longitudinalSection: params.longitudinalSection != null ? "longitudinalSection" + getFileExtension(params.longitudinalSection) : null,
                crossSection: params.crossSection != null ? "crossSection" + getFileExtension(params.crossSection) : null,
                techDescription: params.techDescription != null ? "techDescription" + getFileExtension(params.techDescription) : null,
                model: params.model != null ? "model" + getFileExtension(params.model) : null,
                files: params.files != null ? mapFiles(params.files) : null,
            });

            const promises = [];

            if (params.photo != null) {
                const photoPromise = storage.ref("/objects/" + bridgeDoc.id + "/photo" + getFileExtension(params.photo)).put(params.photo);
                promises.push(photoPromise);
            }
            if (params.groundPlan != null) {
                const groundPlanPromise = storage.ref("/objects/" + bridgeDoc.id + "/groundPlan" + getFileExtension(params.groundPlan)).put(params.groundPlan);
                promises.push(groundPlanPromise);
            }
            if (params.longitudinalSection != null) {
                const longitudinalSectionPromise = storage.ref("/objects/" + bridgeDoc.id + "/longitudinalSection" + getFileExtension(params.longitudinalSection)).put(params.longitudinalSection);
                promises.push(longitudinalSectionPromise);
            }
            if (params.crossSection != null) {
                const crossSectionPromise = storage.ref("/objects/" + bridgeDoc.id + "/crossSection" + getFileExtension(params.crossSection)).put(params.crossSection);
                promises.push(crossSectionPromise);
            }
            if (params.techDescription != null) {
                const techDescriptionPromise = storage.ref("/objects/" + bridgeDoc.id + "/techDescription" + getFileExtension(params.techDescription)).put(params.techDescription);
                promises.push(techDescriptionPromise);
            }
            if (params.model != null) {
                const modelPromise = storage.ref("/objects/" + bridgeDoc.id + "/model" + getFileExtension(params.model)).put(params.model);
                promises.push(modelPromise);
            }

            if (params.files != null) {
                Object.keys(params.files).map(function (key: any) {
                    const filePromise = storage.ref("/objects/" + bridgeDoc.id + "/files/" + params.files[key].name).put(params.files[key]);
                    promises.push(filePromise);
                });
            }

            await Promise.all(promises);
            context.commit("clearParams");
        }
    }
}

function BridgeParams() {
    return {
        material: null,
        type: null,
        system: null,
        constructionYear: null,
        lineStreet: null,
        chainage: null,
        coords: null,
        spanLength: null,
        superstructure: null,
        trafficRoutes: null,
        shortDescription: null,
        photo: null,
        groundPlan: null,
        longitudinalSection: null,
        crossSection: null,
        techDescription: null,
        model: null,
        files: null
    }
}

function mapFiles(files: any) {
    const newFiles: any = [];
    Object.keys(files).map(function (key: any) {
        newFiles.push(files[key].name);
    });
    return newFiles;
}

function getFileExtension(file: any) {
    return file.name.match(/\.[0-9a-z]+$/i)[0];
}