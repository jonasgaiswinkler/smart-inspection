/* eslint-disable @typescript-eslint/no-use-before-define */
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

export default {
    namespaced: true,
    state: () => ({
        newParams: BridgeParams(),
        editParams: BridgeParams(),
        isLoading: false
    }),
    mutations: {
        setNewParam(state, payload) {
            state.newParams[payload.key] = payload.value;
        },
        clearNewParams(state) {
            state.newParams = BridgeParams();
        },
        setEditParams(state, params) {
            state.editParams = params;
        },
        setEditParam(state, payload) {
            state.editParams[payload.key] = payload.value;
        },
        clearEditParams(state) {
            state.editParams = BridgeParams();
        },
        setIsLoading(state, isLoading) {
            state.isLoading = isLoading
        }
    },
    getters: {
        getNewParamsCoords(state) {
            const coords = state.newParams.coords;
            if (coords != null) {
                return coords.latitude + ", " + coords.longitude;
            } else {
                return null;
            }
        },
        getEditParamsCoords(state) {
            const coords = state.editParams.coords;
            if (coords != null) {
                return coords.latitude + ", " + coords.longitude;
            } else {
                return null;
            }
        }
    },
    actions: {
        async saveNew(context) {
            const params = context.state.newParams;
            const db = firebase.firestore();
            const storage = firebase.storage();

            const objectDoc = db.collection("objects").doc(params.id);
            await objectDoc.set({
                material: params.material,
                type: params.type,
                system: params.system,
                crossSectionShape: params.crossSectionShape,
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
                const photoPromise = storage.ref("/objects/" + params.id + "/photo" + getFileExtension(params.photo)).put(params.photo);
                promises.push(photoPromise);
            }
            if (params.groundPlan != null) {
                const groundPlanPromise = storage.ref("/objects/" + params.id + "/groundPlan" + getFileExtension(params.groundPlan)).put(params.groundPlan);
                promises.push(groundPlanPromise);
            }
            if (params.longitudinalSection != null) {
                const longitudinalSectionPromise = storage.ref("/objects/" + params.id + "/longitudinalSection" + getFileExtension(params.longitudinalSection)).put(params.longitudinalSection);
                promises.push(longitudinalSectionPromise);
            }
            if (params.crossSection != null) {
                const crossSectionPromise = storage.ref("/objects/" + params.id + "/crossSection" + getFileExtension(params.crossSection)).put(params.crossSection);
                promises.push(crossSectionPromise);
            }
            if (params.techDescription != null) {
                const techDescriptionPromise = storage.ref("/objects/" + params.id + "/techDescription" + getFileExtension(params.techDescription)).put(params.techDescription);
                promises.push(techDescriptionPromise);
            }
            if (params.model != null) {
                const modelPromise = storage.ref("/objects/" + params.id + "/model" + getFileExtension(params.model)).put(params.model);
                promises.push(modelPromise);
            }

            if (params.files != null) {
                Object.keys(params.files.data).map(function (key) {
                    const filePromise = storage.ref("/objects/" + params.id + "/files/" + params.files.data[key].name).put(params.files.data[key]);
                    promises.push(filePromise);
                });
            }

            await Promise.all(promises);
            context.commit("clearNewParams");
            return { status: 200, oid: params.id };
        },
        async saveEdit(context) {
            const params = context.state.editParams;
            const oid = context.rootState.object.oid;
            const db = firebase.firestore();
            const storage = firebase.storage();

            const objectDoc = db.collection("objects").doc(oid);
            const payload = {
                material: params.material,
                type: params.type,
                system: params.system,
                crossSectionShape: params.crossSectionShape,
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
            }
            await objectDoc.update(payload);

            const promises = [];
            promises.push(editFile(context, oid, params.photo, "photo"));
            promises.push(editFile(context, oid, params.groundPlan, "groundPlan"));
            promises.push(editFile(context, oid, params.longitudinalSection, "longitudinalSection"));
            promises.push(editFile(context, oid, params.crossSection, "crossSection"));
            promises.push(editFile(context, oid, params.techDescription, "techDescription"));
            promises.push(editFile(context, oid, params.model, "model"));

            if (params.files != null && params.files.same !== true) {
                if (context.rootState.object.data.files != null) {
                    const deletePromises = [];
                    for (const fileName of context.rootState.object.data.files) {
                        const filePromise = storage.ref("/objects/" + oid + "/files/" + fileName).delete();
                        deletePromises.push(filePromise)
                    }
                    await Promise.all(deletePromises);
                }
                Object.keys(params.files.data).map(function (key) {
                    const filePromise = storage.ref("/objects/" + oid + "/files/" + params.files.data[key].name).put(params.files.data[key]);
                    promises.push(filePromise);
                });
            } else if (params.files == null && context.rootState.object.data.files != null) {
                for (const fileName of context.rootState.object.data.files) {
                    const filePromise = storage.ref("/objects/" + oid + "/files/" + fileName).delete();
                    promises.push(filePromise)
                }
            }

            await Promise.all(promises);
            context.commit("clearNewParams");
            await context.dispatch("object/load", null, {root: true});
            return { status: 200, oid: oid };
        },
        async load(context) {
            const params = context.rootState.object.data;
            const editParams = BridgeParams();
            const oid = context.rootState.object.oid;
            const storage = firebase.storage();

            const getFile = async function (key) {
                if (params[key] != null) {
                    const url = await storage.ref("/objects/" + oid + "/" + params[key]).getDownloadURL();
                    editParams[key] = { name: params[key], same: true, url: url };
                } else {
                    editParams[key] = null;
                }
            };

            editParams.id = oid;
            editParams.material = params.material;
            editParams.type = params.type;
            editParams.system = params.system;
            editParams.crossSectionShape = params.crossSectionShape;
            editParams.constructionYear = params.constructionYear != null ? params.constructionYear.toString() : null;
            editParams.lineStreet = params.lineStreet;
            editParams.chainage = params.chainage != null ? params.chainage.toString() : null;
            editParams.coords = params.coords;
            editParams.spanLength = params.spanLength != null ? params.spanLength.toString() : null;
            editParams.superstructure = params.superstructure;
            editParams.trafficRoutes = params.trafficRoutes != null ? params.trafficRoutes.toString() : null;
            editParams.shortDescription = params.shortDescription;
            const promises = [];
            promises.push(getFile("photo"));
            promises.push(getFile("groundPlan"));
            promises.push(getFile("longitudinalSection"));
            promises.push(getFile("crossSection"));
            promises.push(getFile("techDescription"));
            promises.push(getFile("model"));
            await Promise.all(promises);
            editParams.files = params.files != null ? { data: params.files, same: true } : null;

            context.commit("setEditParams", editParams);
        },
        async exists(context) {
            const params = context.state.newParams;
            const db = firebase.firestore();

            const doc = await db.collection("objects").doc(params.id).get();
            if (doc.exists) {
                return true;
            } else {
                return false;
            }
        }
    }
}

async function editFile(context, oid, file, paramName) {
    const storage = firebase.storage();
    const oldFileName = context.rootState.object.data[paramName];
    if (file != null && file.same !== true) {
        if (oldFileName != null) {
            await storage.ref("/objects/" + oid + "/" + oldFileName).delete();
        }
        return await storage.ref("/objects/" + oid + "/" + paramName + getFileExtension(file)).put(file);
    } else if (file == null && oldFileName != null) {
        return await storage.ref("/objects/" + oid + "/" + oldFileName).delete();
    } else {
        return null;
    }
}

function BridgeParams() {
    return {
        id: null,
        material: null,
        type: null,
        system: null,
        crossSectionShape: null,
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

function mapFiles(files) {
    if (files.same === true) {
        return files.data;
    } else {
        const newFiles = [];
        Object.keys(files.data).map(function (key) {
            newFiles.push(files.data[key].name);
        });
        return newFiles;
    }

}

function getFileExtension(file) {
    return file.name.match(/\.[0-9a-z]+$/i)[0];
}