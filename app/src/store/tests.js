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
    async resetFirebase(context) {
      {
        const snap = await context.dispatch("getFirestoreSnap", {
          path: "inspections",
          key: "date",
          value: "2021-04-24",
        });
        if (snap.docs.length > 0) {
          await firebase.functions().httpsCallable("deleteInspection")({
            oid: "1234",
            iid: snap.docs[0].id,
          });
        }
      }
      {
        const snap = await context.dispatch("getFirestoreSnap", {
          path: "inspections",
          key: "date",
          value: "2021-04-21",
        });
        if (snap.docs.length > 0) {
          await firebase.functions().httpsCallable("deleteInspection")({
            oid: "1234",
            iid: snap.docs[0].id,
          });
        }
      }

      return firebase.functions().httpsCallable("deleteObject")({
        oid: "1234",
      });
    },
    async copyInspections() {
      const db = firebase.firestore();

      const objects = await db.collection("objects").get();
      for (const object of objects.docs) {
        const inspections = await object.ref.collection("inspections").get();
        for (const inspection of inspections.docs) {
          await db
            .collection("inspections")
            .doc(inspection.id)
            .set(inspection.data());
        }
      }
    },
  },
};
