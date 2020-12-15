/* eslint-disable @typescript-eslint/no-use-before-define */
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

export default {
    namespaced: true,
    state: () => ({
        newParams: DamageParams(),
        editParams: DamageParams(),
        updateParams: DamageParams(),
        isLoading: false
    }),
    mutations: {
        setNewParam(state, payload) {
            state.newParams[payload.key] = payload.value;
        },
        clearNewParams(state) {
            state.newParams = DamageParams();
        },
        setEditParams(state, params) {
            state.editParams = params;
        },
        setEditParam(state, payload) {
            state.editParams[payload.key] = payload.value;
        },
        clearEditParams(state) {
            state.editParams = DamageParams();
        },
        clearUpdateParams(state) {
            state.updateParams = DamageParams();
        },
        setUpdateParams(state, params) {
            state.updateParams = params;
        },
        setUpdateParam(state, payload) {
            state.updateParams[payload.key] = payload.value;
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
            const iid = context.rootState.inspection.iid;
            if (oid != null && iid != null) {
                const params = context.state.newParams;
                const db = firebase.firestore();
                const storage = firebase.storage();

                let did;
                const damagesSnap = await db.collection('objects').doc(oid).collection('damages').get();
                if (damagesSnap.empty) {
                    did = "1";
                } else {
                    did = (parseInt(damagesSnap.docs[(damagesSnap.size - 1)].id) + 1).toString();
                }
                const damageDoc = db.collection("objects").doc(oid).collection("damages").doc(did);
                await damageDoc.set({
                    allocation: params.allocation,
                    component: params.component,
                    componentDetail: params.componentDetail,
                    type: params.type,
                    typeDetail: params.typeDetail,
                    location: params.location,
                    locationGroundPlan: params.locationGroundPlan,
                    locationLongitudinalSection: params.locationLongitudinalSection,
                    locationCrossSection: params.locationCrossSection,
                    cause: params.cause,
                    description: params.description,
                    measurement1Name: params.measurement1.name != null ? params.measurement1.name : null,
                    measurement2Name: params.measurement2.name != null ? params.measurement2.name : null
                });

                const stateDoc = damageDoc.collection('states').doc(iid);
                await stateDoc.set({
                    date: context.rootState.inspection.idate,
                    photo: params.photo != null ? "photo" + getFileExtension(params.photo) : null,
                    measurement1: getMeasurement(params.measurement1, true),
                    measurement2: getMeasurement(params.measurement2, true),
                    limit: getMeasurement(params.limit, false),
                    impact: params.impact,
                    category: params.category,
                    action: params.action,
                    period: params.period,
                    additionalInfo: params.additionalInfo,
                })

                const promises = [];

                if (params.photo != null) {
                    const photoPromise = storage.ref("/objects/" + oid + "/damages/" + damageDoc.id + "/states/" + iid + "/photo" + getFileExtension(params.photo)).put(params.photo);
                    promises.push(photoPromise);
                }

                if (params.imageGroundPlan != null) {
                    const imageGroundPlanPromise = storage.ref("/objects/" + oid + "/damages/" + damageDoc.id + "/imageGroundPlan.png").put(params.imageGroundPlan);
                    promises.push(imageGroundPlanPromise);
                }

                if (params.imageLongitudinalSection != null) {
                    const imageLongitudinalSectionPromise = storage.ref("/objects/" + oid + "/damages/" + damageDoc.id + "/imageLongitudinalSection.png").put(params.imageLongitudinalSection);
                    promises.push(imageLongitudinalSectionPromise);
                }

                if (params.imageCrossSection != null) {
                    const imageCrossSectionPromise = storage.ref("/objects/" + oid + "/damages/" + damageDoc.id + "/imageCrossSection.png").put(params.imageCrossSection);
                    promises.push(imageCrossSectionPromise);
                }

                await Promise.all(promises);
                context.commit("clearNewParams");
                return { status: 200, oid: oid, iid: iid, did: damageDoc.id };
            } else {
                return { status: 400 };
            }
        },
        async saveEdit(context) {
            const params = context.state.editParams;
            const oid = context.rootState.object.oid;
            const did = context.rootState.damage.did;
            const db = firebase.firestore();

            const damageDoc = db.collection('objects').doc(oid).collection('damages').doc(did);
            const payload = {
                allocation: params.allocation,
                component: params.component,
                componentDetail: params.componentDetail,
                type: params.type,
                typeDetail: params.typeDetail,
                location: params.location,
                locationGroundPlan: params.locationGroundPlan,
                locationLongitudinalSection: params.locationLongitudinalSection,
                locationCrossSection: params.locationCrossSection,
                cause: params.cause,
                description: params.description
            }
            await damageDoc.update(payload);
            const promises = [];
            promises.push(editFileEdit(context, oid, did, params.imageGroundPlan, "imageGroundPlan", "locationGroundPlan"));
            promises.push(editFileEdit(context, oid, did, params.imageLongitudinalSection, "imageLongitudinalSection", "locationLongitudinalSection"));
            promises.push(editFileEdit(context, oid, did, params.imageCrossSection, "imageCrossSection", "locationCrossSection"));
            await Promise.all(promises);
            context.commit("clearNewParams");
            await context.dispatch("damage/load", null, { root: true });
            return { status: 200, oid: oid, did: did };
        },
        async saveUpdate(context) {
            const params = context.state.updateParams;
            const oid = context.rootState.object.oid;
            const iid = context.rootState.inspection.iid;
            const did = context.rootState.damage.did;
            const db = firebase.firestore();

            const damageDoc = db.collection('objects').doc(oid).collection('damages').doc(did);
            const stateDoc = damageDoc.collection('states').doc(iid);
            const payload = {
                date: params.date,
                photo: params.photo != null ? "photo" + getFileExtension(params.photo) : null,
                measurement1: getMeasurement(params.measurement1, true),
                measurement2: getMeasurement(params.measurement2, true),
                limit: getMeasurement(params.limit, false),
                impact: params.impact,
                category: params.category,
                action: params.action,
                period: params.period,
                additionalInfo: params.additionalInfo,
            }
            await stateDoc.set(payload, { merge: true });
            const payloadMeasurement = {};
            if (params.measurement1.name != null) {
                payloadMeasurement.measurement1Name = params.measurement1.name
            }
            if (params.measurement2.name != null) {
                payloadMeasurement.measurement2Name = params.measurement2.name
            }
            await damageDoc.set(payloadMeasurement, { merge: true });
            await editFileUpdate(context, oid, iid, did, params.photo, "photo")
            context.commit("clearUpdateParams");
            await context.dispatch("damage/load", null, { root: true });
            return { status: 200, oid: oid, iid: iid, did: did };
        },
        async loadEdit(context) {
            const params = context.rootState.damage.data;
            const editParams = Object.assign(DamageParams(), params);
            context.commit("setEditParams", editParams);
        },
        async loadUpdate(context) {
            const oid = context.rootState.object.oid;
            const iid = context.rootState.inspection.iid;
            const idate = context.rootState.inspection.idate;
            const did = context.rootState.damage.did;
            const states = context.rootState.damage.states;
            if (states != null) {
                let params = states.find(element => element.iid == iid);

                if (params != undefined) {
                    const updateParams = DamageParams();
                    const storage = firebase.storage();
                    const getFile = async function (key) {
                        if (params[key] != null) {
                            const url = await storage.ref("/objects/" + oid + "/damages/" + did + "/states/" + iid + "/" + params[key]).getDownloadURL();
                            updateParams[key] = { name: params[key], same: true, url: url };
                        } else {
                            updateParams[key] = null;
                        }
                    };
                    updateParams.date = params.date;
                    updateParams.measurement1 = params.measurement1 != null ? { ...params.measurement1 } : Measurement(true);
                    updateParams.measurement2 = params.measurement2 != null ? { ...params.measurement2 } : Measurement(true);
                    updateParams.limit = params.limit != null ? { ...params.limit } : Measurement(false);
                    updateParams.impact = params.impact;
                    updateParams.category = params.category;
                    updateParams.action = params.action;
                    updateParams.period = params.period;
                    updateParams.additionalInfo = params.additionalInfo;
                    await getFile("photo");
                    context.commit("setUpdateParams", updateParams);
                } else {
                    const updateParams = DamageParams();
                    params = { ...context.rootGetters['damage/currentState'] };
                    updateParams.date = idate;
                    updateParams.measurement1 = params.measurement1 != null ? { ...params.measurement1 } : Measurement(true);
                    updateParams.measurement2 = params.measurement2 != null ? { ...params.measurement2 } : Measurement(true);
                    updateParams.limit = params.measurement2 != null ? { ...params.limit } : Measurement(false);
                    updateParams.impact = params.impact;
                    updateParams.category = params.category;
                    updateParams.action = params.action;
                    updateParams.period = params.period;
                    updateParams.additionalInfo = params.additionalInfo;
                    updateParams.photo = null;
                    context.commit("setUpdateParams", updateParams);
                }
            }
        },
        async exists(context) {
            //
        }
    }
}

function DamageParams() {
    return {
        allocation: null,
        component: null,
        componentDetail: null,
        type: null,
        typeDetail: null,
        location: null,
        locationGroundPlan: null,
        imageGroundPlan: null,
        locationLongitudinalSection: null,
        imageLongitudinalSection: null,
        locationCrossSection: null,
        imageCrossSection: null,
        cause: null,
        description: null,
        photo: null,
        measurement1: Measurement(true),
        measurement2: Measurement(true),
        limit: Measurement(false),
        impact: null,
        category: null,
        action: null,
        period: null,
        additionalInfo: null
    }
}

function getFileExtension(file) {
    return file.name.match(/\.[0-9a-z]+$/i)[0];
}

async function editFileUpdate(context, oid, iid, did, file, paramName) {
    const storage = firebase.storage();
    const oldFile = context.rootState.damage.states.find(element => element.iid == iid);
    if (oldFile != undefined) {
        const oldFileName = oldFile[paramName]
        if (file != null && file.same !== true) {
            if (oldFileName != null) {
                await storage.ref("/objects/" + oid + "/damages/" + did + "/states/" + iid + "/" + oldFileName).delete();
            }
            return await storage.ref("/objects/" + oid + "/damages/" + did + "/states/" + iid + "/" + paramName + getFileExtension(file)).put(file);
        } else if (file == null && oldFileName != null) {
            return await storage.ref("/objects/" + oid + "/damages/" + did + "/states/" + iid + "/" + oldFileName).delete();
        } else {
            return null;
        }
    } else if (file != null && file.same !== true) {
        return await storage.ref("/objects/" + oid + "/damages/" + did + "/states/" + iid + "/" + paramName + getFileExtension(file)).put(file);
    }
}

async function editFileEdit(context, oid, did, file, paramName, locationName) {
    const storage = firebase.storage();
    const oldFile = context.rootState.damage.data;
    if (oldFile != undefined) {
        const oldFileName = oldFile[locationName]
        if (oldFileName != null) {
            await storage.ref("/objects/" + oid + "/damages/" + did + "/" + paramName + ".png").delete();
        }
    }

    if (file != null) {
        return await storage.ref("/objects/" + oid + "/damages/" + did + "/" + paramName + ".png").put(file);
    }
}

function getMeasurement(measurement, showName) {
    if (measurement.value == null || measurement.unit == null || (showName && measurement.name == null)) {
        return null;
    } else {
        return measurement;
    }
}

function Measurement(showName) {
    return showName ? {
        name: null,
        value: null,
        unit: "mm"
    } : {
            value: null,
            unit: "mm"
        };
}