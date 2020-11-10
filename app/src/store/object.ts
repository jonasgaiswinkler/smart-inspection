/* eslint-disable @typescript-eslint/no-use-before-define */
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";

export default {
    namespaced: true,
    state: () => ({
        oid: null,
        data: null,
        photoUrl: null
    }),
    mutations: {
        setOid(state: any, oid: string) {
            state.oid = oid;
        },
        setData(state: any, data: any) {
            state.data = data;
        },
        setPhotoUrl(state: any, photoUrl: string) {
            state.photoUrl = photoUrl;
        },
        clear(state: any) {
            state.data = null;
            state.photoUrl = null;
        }
    },
    getters: {

    },
    actions: {
        async load(context: any) {
            context.commit("clear");
            const oid = context.state.oid;
            if (oid != null) {
                const db = firebase.firestore();
                const objectDoc = await db.collection("objects").doc(oid).get();
                if (objectDoc.exists) {
                    const data = objectDoc.data();
                    context.commit("setData", data);
                    if (data != undefined && data.photo != null) {
                        const storage = firebase.storage();
                        const photoUrl = await storage.ref("/objects/" + oid + "/" + data.photo).getDownloadURL();
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
        delete(context: any) {
            const oid = context.state.oid;
            if (oid != null) {
                const functions = firebase.functions();
                return functions.httpsCallable('deleteObject')({ oid: oid });
            }
        }
    }
}