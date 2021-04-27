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
//@ts-ignore
import tests from "./tests.js";

export default createStore({
  state: {
    user: null,
    users: null,
    userRole: null,
    name: "",
    isLoading: true,
    redirect: null,
    loginIsLoading: false,
    isLoadingUsers: false,
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
    setName(state, name) {
      state.name = name;
    },
    setIsLoadingUsers(state, isLoadingUsers) {
      state.isLoadingUsers = isLoadingUsers;
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
    async loadName(context) {
      if (context.state.user) {
        const userDoc = await firebase
          .firestore()
          .collection("users")
          // @ts-ignore
          .doc(context.state.user.uid)
          .get();
        if (userDoc.exists) {
          // @ts-ignore
          context.commit("setName", userDoc.data().name);
        } else {
          context.commit("setName", "");
        }
      } else {
        context.commit("setName", "");
      }
    },
    async updateName(context) {
      if (context.state.name && context.state.user) {
        await firebase
          .firestore()
          .collection("users")
          // @ts-ignore
          .doc(context.state.user.uid)
          .set(
            {
              name: context.state.name,
            },
            {
              merge: true,
            }
          );
        await context.dispatch("loadName");
      }
    },
    async loadUsers(context) {
      context.commit("setIsLoadingUsers", true);
      const usersSnap = await firebase
        .firestore()
        .collection("users")
        .get();
      const users = [];
      for (const userDoc of usersSnap.docs) {
        users.push({ id: userDoc.id, ...userDoc.data() });
      }
      context.commit("setUsers", users);
      context.commit("setIsLoadingUsers", false);
    },
    async createUser(context, payload) {
      context.commit("setIsLoadingUsers", true);
      const functions = firebase.functions();
      try {
        await functions.httpsCallable("createUser")(payload);
        context.dispatch("loadUsers");
      } catch (error) {
        console.error(error);
      }
      context.commit("setIsLoadingUsers", false);
    },
    async deleteUser(context, uid) {
      context.commit("setIsLoadingUsers", true);
      const functions = firebase.functions();
      try {
        await functions.httpsCallable("deleteUser")({ uid: uid });
        context.dispatch("loadUsers");
      } catch (error) {
        console.error(error);
      }
      context.commit("setIsLoadingUsers", false);
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
  },
  modules: {
    objectParams: objectParams,
    object: object,
    inspectionParams: inspectionParams,
    inspection: inspection,
    damageParams: damageParams,
    damage: damage,
    assessmentParams: assessmentParams,
    tests,
  },
});
