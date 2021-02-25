import { createStore } from "vuex";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

// import modules
// @ts-ignore
import objectParams from "./objectParams.js";
import object from "./object";
// @ts-ignore
import inspectionParams from "./inspectionParams.js";
// @ts-ignore
import inspection from "./inspection.js";
// @ts-ignore
import damageParams from "./damageParams.js";
// @ts-ignore
import damage from "./damage.js";
// @ts-ignore
import assessmentParams from "./assessmentParams.js";

export default createStore({
  state: {
    user: null,
    users: null,
    userRole: null,
    isLoading: true,
    redirect: null,
    loginIsLoading: false,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setUsers(state, users) {
      state.users = users;
    },
    setUserRole(state, userRole) {
      state.userRole = userRole;
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setRedirect(state, redirect) {
      state.redirect = redirect;
    },
    setLoginIsLoading(state, loginIsLoading) {
      state.loginIsLoading = loginIsLoading;
    },
  },
  actions: {
    // firebase login
    login(context, payload) {
      context.commit("setLoginIsLoading", true);
      return firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then((value) => {
          context.commit("setLoginIsLoading", false);
        })
        .catch((error) => {
          context.commit("setLoginIsLoading", false);
          throw error;
        });
    },
    logout(context) {
      return firebase.auth().signOut();
    },
    resetPassword(context, email) {
      context.commit("setLoginIsLoading", true);
      return firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then((value) => {
          context.commit("setLoginIsLoading", false);
        })
        .catch((error) => {
          context.commit("setLoginIsLoading", false);
          throw error;
        });
    },
    async loadUsers(context) {
      const usersSnap = await firebase
        .firestore()
        .collection("users")
        .get();
      const users = [];
      for (const userDoc of usersSnap.docs) {
        users.push({ id: userDoc.id, ...userDoc.data() });
      }
      context.commit("setUsers", users);
    },
    setPermissions(context, payload) {
      if (payload.uid !== undefined && payload.role !== undefined) {
        const functions = firebase.functions();
        return functions.httpsCallable("setPermissions")(payload);
      } else {
        return null;
      }
    },
    async setUserRole(context, userRole) {
      context.commit("setUserRole", userRole);
      context.dispatch("object/getRequestedObjects", null, { root: true });
    },
    testPdf(context) {
      const functions = firebase.functions();
      return functions.httpsCallable("createInspectionReport")({
        oid: "2837",
        iid: "uWjxlFUmQv3wcMDcrtST",
      });
    },
  },
  modules: {
    objectParams: objectParams,
    object: object,
    inspectionParams: inspectionParams,
    inspection: inspection,
    damageParams: damageParams,
    damage: damage,
    assessmentParams: assessmentParams,
  },
});
