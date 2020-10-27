import { createStore } from 'vuex'
import * as firebase from "firebase/app";
import "firebase/auth";

// import modules
import newBridge from './newBridge';

export default createStore({
  state: {
    user: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    // firebase login
    login(context, payload) {
      return firebase.auth().signInWithEmailAndPassword(payload.email, payload.password);
    },
    logout(context) {
      return firebase.auth().signOut();
    }
  },
  modules: {
    newBridge: newBridge
  }
})
