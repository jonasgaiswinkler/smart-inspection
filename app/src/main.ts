import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';
import { Plugins } from '@capacitor/core';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* PWA elements */
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import './registerServiceWorker'

/* i18n */
import { setupI18n } from '@/i18n';
const i18n = setupI18n()

/* vuex */
import store from '@/store'
defineCustomElements(window);

/* firebase */
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "@/firebase.json";

firebase.initializeApp(firebaseConfig);

/* promise for initial auth state */
let authPromise = new Promise((resolve, reject) => {
  const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    unsubscribe();
    resolve(user);
  }, reject);
}) as any;

/* listen to auth state changes */
firebase.auth().onAuthStateChanged(user => {
  authPromise = user;
  store.commit('setUser', user);
  user?.getIdTokenResult().then((result) => store.commit('setUserRole', result.claims.role));
});

/* setup router */
router.beforeEach(async function (to, from, next) {

  // wait until auth state is loaded
  let user;
  if (authPromise instanceof Promise) {
    user = await authPromise;
  } else {
    user = authPromise;
  }

  // redirect user depending on auth state
  if (store.state.user === null && to.name != "Login") {
    next({ name: "Login" });
  } else if (store.state.user !== null && to.name == "Login") {
    next({ name: "Home" });
  } else if (to.params.oid != undefined) {
    // @ts-ignore
    if (store.state.object.oid !== to.params.oid) {
      store.commit("object/setOid", to.params.oid);
      const loadObject = await store.dispatch("object/load");
      if (loadObject.status !== 200) {
        next({ name: "Home" });
      } else {
        // @ts-ignore
        if (to.params.iid != undefined && store.state.inspection.iid !== to.params.iid) {
          store.commit("inspection/setIid", to.params.iid);
          const loadInspection = await store.dispatch("inspection/load");
          if (loadInspection.status !== 200) {
            next({ name: "Home" });
          } else {
            next();
          }
        } else {
          next();
        }
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

/* set status bar color */
Plugins.Device.getInfo().then((info) => {
  if (info.platform == "android") {
    Plugins.StatusBar.setBackgroundColor({ color: "#005096" });
  }
});

const app = createApp(App).use(store)
  .use(IonicVue, { mode: "md", animated: false })
  .use(router)
  .use(i18n);

router.isReady().then(() => {
  app.mount('#app');
});