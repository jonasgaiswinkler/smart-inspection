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
    photoUrl: null,
    requestedObjects: null,
    list: null,
    isLoading: false,
    currentAssessment: null,
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
      state.currentAssessment = null;
    },
    setRequestedObjects(state: any, requestedObjects: any) {
      state.requestedObjects = requestedObjects;
    },
    setList(state: any, list: any) {
      state.list = list;
    },
    setIsLoading(state: any, isLoading: any) {
      state.isLoading = isLoading;
    },
    setCurrentAssessment(state: any, currentAssessment: any) {
      state.currentAssessment = currentAssessment;
    },
  },
  getters: {},
  actions: {
    async load(context: any) {
      context.commit("clear");
      const oid = context.state.oid;
      if (oid != null) {
        const db = firebase.firestore();
        const objectDoc = await db
          .collection("objects")
          .doc(oid)
          .get();
        if (objectDoc.exists) {
          const data = objectDoc.data();
          if (data?.deletionRequested) {
            return { status: 401 };
          }
          context.commit("setData", data);
          if (data != undefined && data.photo != null) {
            const storage = firebase.storage();
            const photoUrl = await storage
              .ref("/objects/" + oid + "/" + data.photo)
              .getDownloadURL();
            context.commit("setPhotoUrl", photoUrl);
          }
          const assessmentDoc = await db
            .collection("objects")
            .doc(oid)
            .collection("assessments")
            .orderBy("date", "desc")
            .limit(1)
            .get();
          if (!assessmentDoc.empty) {
            context.commit(
              "setCurrentAssessment",
              assessmentDoc.docs[0].data()
            );
          }
          return { status: 200 };
        } else {
          return { status: 404 };
        }
      } else {
        return { status: 400 };
      }
    },
    loadList(context: any) {
      context.commit("setIsLoading", true);
      const db = firebase.firestore();
      db.collection("objects")
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            context.commit("setList", null);
          } else {
            const list = [];
            for (const doc of snapshot.docs) {
              const object = { ...doc.data() };
              object.id = doc.id;
              object.chainage = doc
                .data()
                .chainage.toFixed(3)
                .replace(".", ",");
              list.push(object);
            }
            context.commit("setList", list);
          }
          context.commit("setIsLoading", false);
        });
    },
    async requestDeletion(context: any) {
      const oid = context.state.oid;
      if (oid != null) {
        const db = firebase.firestore();
        await db
          .collection("objects")
          .doc(oid)
          .update({
            deletionRequested: true,
          });
        context.dispatch("getRequestedObjects");
        context.dispatch("loadList");
      }
    },
    async restoreObject(context: any, oid: string) {
      if (oid !== undefined && oid !== null && oid !== "") {
        const db = firebase.firestore();
        await db
          .collection("objects")
          .doc(oid)
          .update({
            deletionRequested: false,
          });
        context.dispatch("getRequestedObjects");
        context.dispatch("loadList");
      }
    },
    async getRequestedObjects(context: any) {
      if (context.rootState.userRole === "admin") {
        const db = firebase.firestore();
        const snapshot = await db
          .collection("objects")
          .where("deletionRequested", "==", true)
          .get();
        if (snapshot.empty) {
          context.commit("setRequestedObjects", null);
        } else {
          const list = [];
          for (const doc of snapshot.docs) {
            const object = { ...doc.data() };
            object.id = doc.id;
            object.chainage = doc
              .data()
              .chainage.toFixed(3)
              .replace(".", ",");
            list.push(object);
          }
          context.commit("setRequestedObjects", list);
        }
      }
    },
    async deleteObject(context: any, oid: string) {
      if (oid !== undefined && oid !== null && oid !== "") {
        const result = await firebase
          .functions()
          .httpsCallable("deleteObject")({ oid: oid });
        if (result.data.status !== 200) {
          throw new Error("Error in deleting object!");
        } else {
          context.dispatch("getRequestedObjects");
          context.dispatch("loadList");
        }
      }
    },
  },
};
