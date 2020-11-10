/* eslint-disable @typescript-eslint/no-use-before-define */
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";

export default {
    namespaced: true,
    state: () => ({
        iid: null,
        data: null,
        photoUrl: null
    }),
    mutations: {
        setIid(state, iid) {
            state.iid = iid;
        },
        setData(state, data) {
            state.data = data;
        },
        setPhotoUrl(state, photoUrl) {
            state.photoUrl = photoUrl;
        },
        clear(state) {
            state.data = null;
            state.photoUrl = null;
        }
    },
    getters: {

    },
    actions: {
        async load(context) {
            context.commit("clear");
            const oid = context.rootState.object.oid;
            const iid = context.state.iid;
            if (iid != null) {
                const db = firebase.firestore();
                const objectDoc = await db.collection("objects").doc(oid).collection("inspections").doc(iid).get();
                if (objectDoc.exists) {
                    const data = objectDoc.data();
                    context.commit("setData", data);
                    if (data != undefined && data.photo != null) {
                        const storage = firebase.storage();
                        const photoUrl = await storage.ref("/objects/" + oid + "/inspections/" + iid + "/" + data.photo).getDownloadURL();
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
        /*delete(context) {
            const oid = context.state.oid;
            if (oid != null) {
                const functions = firebase.functions();
                return functions.httpsCallable('deleteObject')({ oid: oid });
            }
        }*/
    }
}