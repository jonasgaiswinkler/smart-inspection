/* eslint-disable @typescript-eslint/no-use-before-define */
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";

export default {
    namespaced: true,
    state: () => ({
        did: null,
        data: null,
        states: null,
        list: null,
        currentIdate: null,
        isLoading: false,
    }),
    mutations: {
        setDid(state, did) {
            state.did = did;
        },
        setData(state, data) {
            state.data = data;
        },
        setStates(state, states) {
            state.states = states;
        },
        clear(state) {
            state.data = null;
            state.states = null;
        },
        setList(state, list) {
            state.list = list;
        },
        setCurrentIdate(state, idate) {
            state.currentIdate = idate;
        },
        setIsLoading(state, isLoading) {
            state.isLoading = isLoading;
        },
    },
    getters: {
        currentState(state) {
            return state.states != null ? state.states[state.states.length - 1] : null;
        }
    },
    actions: {
        async load(context) {
            context.commit("clear");
            const oid = context.rootState.object.oid;
            const did = context.state.did;
            if (oid != null && did != null) {
                const db = firebase.firestore();
                const damageRef = db.collection("objects").doc(oid).collection("damages").doc(did);
                const damageDoc = await damageRef.get();
                if (damageDoc.exists) {
                    const data = { ...damageDoc.data() };
                    context.commit("setData", data);

                    const stateSnap = await damageRef.collection('states').orderBy('date').get();
                    if (!stateSnap.empty) {
                        const statePromises = [];
                        for (const stateDoc of stateSnap.docs) {
                            statePromises.push(getState(stateDoc, oid, did, data.measurement1Name, data.measurement2Name));
                        }
                        const states = await Promise.all(statePromises);
                        context.commit('setStates', states);
                    }
                    return { status: 200 }
                } else {
                    return { status: 404 };
                }
            } else {
                return { status: 400 };
            }
        },
        async loadList(context) {
            context.commit("setIsLoading", true);
            const oid = context.rootState.object.oid;
            const db = firebase.firestore();
            const damageSnap = await db.collection('objects').doc(oid).collection('damages').get();
            if (damageSnap.empty) {
                context.commit('setList', null);
                context.commit('setCurrentIdate', null);
            } else {
                const inspections = await db.collection('objects').doc(oid).collection('inspections').orderBy('date').get();
                context.commit('setCurrentIdate', inspections.docs[inspections.size - 1].data().date);
                const list = [];
                for (const doc of damageSnap.docs) {
                    const damage = { ...doc.data() };
                    damage.did = doc.id;
                    list.push(damage);
                }
                context.commit('setList', list);
            }
            context.commit("setIsLoading", false);
        },
        async delete(context) {
            const oid = context.rootState.object.oid;
            const did = context.state.did;
            if (oid != null && did != null) {
                const functions = firebase.functions();
                const result = await functions.httpsCallable('deleteDamage')({ oid: oid, did: did });
                if (result.data.status === 200) {
                    context.dispatch("loadList");
                } else {
                    throw new Error("Error in deleting damage!");
                }
            }
        }
    }
}

async function getState(stateDoc, oid, did, measurement1Name, measurement2Name) {
    const state = { ...stateDoc.data() };
    state.iid = stateDoc.id;
    if (state.measurement1 != null) {
        state.measurement1.name = measurement1Name;
    }
    if (state.measurement2 != null) {
        state.measurement2.name = measurement2Name;
    }
    if (state != undefined && state.photo != null) {
        const storage = firebase.storage();
        const photoUrl = await storage.ref("/objects/" + oid + "/damages/" + did + "/states/" + stateDoc.id + "/" + state.photo).getDownloadURL();
        state.photoUrl = photoUrl;
    }
    return state;
}