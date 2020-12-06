/* eslint-disable @typescript-eslint/no-use-before-define */
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

export default {
    namespaced: true,
    state: () => ({
        params: Assessment(),
        isLoading: false
    }),
    mutations: {
        setParam(state, payload) {
            state.params[payload.key] = payload.value;
        },
        clearParams(state) {
            state.params = Assessment();
        },
        setParams(state, params) {
            state.params = params;
        },
        setIsLoading(state, isLoading) {
            state.isLoading = isLoading
        }
    },
    getters: {

    },
    actions: {
        async save(context) {
            const oid = context.rootState.object.oid;
            const iid = context.rootState.inspection.iid;
            const idate = context.rootState.inspection.idate;
            if (oid != null && iid != null) {
                const params = context.state.params;
                const db = firebase.firestore();

                const assessmentDoc = db.collection("objects").doc(oid).collection("assessments").doc(iid);
                await assessmentDoc.set({
                    substructure: params.substructure,
                    superstructure: params.superstructure,
                    equipment: params.equipment,
                    object: params.object,
                    date: idate
                });

                context.commit("clearParams");
                await context.dispatch("object/load", null, { root: true });
                await context.dispatch("inspection/load", null, { root: true });
                return { status: 200, oid: oid, iid: iid, idate: idate };
            } else {
                return { status: 400 };
            }
        },
        async load(context) {
            //
        },
    }
}

function Assessment() {
    return {
        substructure: null,
        superstructure: null,
        equipment: null,
        object: null,
    }
}