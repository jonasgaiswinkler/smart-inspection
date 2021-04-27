/* eslint-disable @typescript-eslint/no-use-before-define */
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";

export default {
  namespaced: true,
  state: () => ({}),
  mutations: {},
  getters: {},
  actions: {
    getFirestoreDoc(context, path) {
      return firebase
        .firestore()
        .doc(path)
        .get();
    },
    getFirestoreSnap(context, { path, key, value }) {
      return firebase
        .firestore()
        .collection(path)
        .where(key, "==", value)
        .get();
    },
    resetFirebase() {
      return firebase.functions().httpsCallable("deleteObject")({
        oid: "1234",
      });
    },
  },
};
