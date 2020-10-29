import { createStore } from 'vuex'
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// import modules
import newObject from './newObject';
import object from './object';
import newInspection from './newInspection';

export default createStore({
  state: {
    user: null,
    users: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setUsers(state, users) {
      state.users = users;
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
    async loadUsers(context) {
      const usersSnap = await firebase.firestore().collection("users").get();
      const users = [];
      for (const userDoc of usersSnap.docs) {
        users.push({id: userDoc.id, ...userDoc.data()});
      }
      context.commit("setUsers", users);
    }
  },
  modules: {
    newObject: newObject,
    object: object,
    newInspection: newInspection
  }
})
