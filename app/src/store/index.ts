import { createStore } from 'vuex'
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions"

// import modules
// @ts-ignore
import objectParams from './objectParams.js';
import object from './object';
import newInspection from './newInspection';

export default createStore({
  state: {
    user: null,
    users: null,
    userRole: null
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
    }
  },
  actions: {
    // firebase login
    login(context, payload) {
      return firebase.auth().signInWithEmailAndPassword(payload.email, payload.password);
    },
    logout(context) {
      return firebase.auth().signOut();
    },
    resetPassword(context, email) {
      return firebase.auth().sendPasswordResetEmail(email);
    },
    async loadUsers(context) {
      const usersSnap = await firebase.firestore().collection("users").get();
      const users = [];
      for (const userDoc of usersSnap.docs) {
        users.push({ id: userDoc.id, ...userDoc.data() });
      }
      context.commit("setUsers", users);
    },
    setPermissions(context, payload) {
      if (payload.uid !== undefined && payload.role !== undefined) {
        const functions = firebase.functions();
        return functions.httpsCallable('setPermissions')(payload);
      } else {
        return null
      }
    }
  },
  modules: {
    objectParams: objectParams,
    object: object,
    newInspection: newInspection
  }
})
