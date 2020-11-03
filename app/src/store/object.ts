/* eslint-disable @typescript-eslint/no-use-before-define */
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";

export default {
    namespaced: true,
    state: () => ({
        oid: null,
        data: null
    }),
    mutations: {
        setOid(state: any, oid: string) {
            state.oid = oid;
        },
        setData(state: any, data: any) {
            state.data = data;
        }
    },
    getters: {

    },
    actions: {
        async load(context: any) {
            const oid = context.state.oid;
            if (oid != null) {
                const db = firebase.firestore();
                const objectDoc = await db.collection("objects").doc(oid).get();
                if (objectDoc.exists) {
                    context.commit("setData", objectDoc.data());
                    return { status: 200 }
                } else {
                    return { status: 404 };
                }
            } else {
                return { status: 400 };
            }
        },
        delete(context: any) {
            const oid = context.state.oid;
            if (oid != null) {
                const functions = firebase.functions();
                return functions.httpsCallable('deleteObject')({oid: oid});
            }
        }
    }
}