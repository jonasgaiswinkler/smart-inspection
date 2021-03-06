import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { IonicVue } from "@ionic/vue";
import { Plugins } from "@capacitor/core";
import { VueCookieNext } from "vue-cookie-next";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* PWA elements */
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import "./registerServiceWorker";

/* i18n */
import { setupI18n } from "@/i18n";
const i18n = setupI18n();

/* vuex */
import store from "@/store";

defineCustomElements(window);

/* firebase */
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import firebaseConfig from "@/firebase.json";

firebase.initializeApp(firebaseConfig);

//firebase.functions().useFunctionsEmulator("http://localhost:5001");

/* promise for initial auth state */
let authPromise = new Promise((resolve, reject) => {
  const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    unsubscribe();
    resolve(user);
  }, reject);
}) as any;

/* listen to auth state changes */
firebase.auth().onAuthStateChanged((user) => {
  authPromise = user;
  store.commit("setUser", user);
  user
    ?.getIdTokenResult()
    .then((result) => store.dispatch("setUserRole", result.claims.role));
});

/* setup router */
router.beforeEach(async function(to, from, next) {
  store.commit("setIsLoading", true);
  // wait until auth state is loaded
  let user;
  if (authPromise instanceof Promise) {
    user = await authPromise;
  } else {
    user = authPromise;
  }

  // redirect user depending on auth state
  if (store.state.user === null && to.name != "Login") {
    store.commit("setRedirect", to.path);
    next({ name: "Login" });
  } else if (store.state.user !== null && to.name == "Login") {
    next({ name: "Home" });
  } else {
    if (to.name === "Settings") {
      store.dispatch("loadName");
    }

    if (to.name === "Users") {
      await store.dispatch("loadUsers");
    }

    if (to.name === "ObjectList") {
      store.dispatch("object/loadList");
    }
    if (to.name === "InspectionListGlobal") {
      store.dispatch("inspection/loadList", true);
    }

    if (to.params.oid != undefined) {
      let loadObject = { status: 200 };
      // @ts-ignore
      if (store.state.object.oid !== to.params.oid) {
        store.commit("object/setOid", to.params.oid);
        loadObject = await store.dispatch("object/load");
        if (loadObject.status !== 200) {
          next({ name: "Home" });
        }
      }

      if (to.name === "InspectionListObject" || to.name === "ObjectReports") {
        store.dispatch("inspection/loadList", false);
        store.dispatch("object/loadReports");
      }

      if (
        to.name === "DamageListObject" ||
        to.name === "DamageListInspection"
      ) {
        store.dispatch("damage/loadList");
      }

      if (to.name === "EditObject") {
        await store.dispatch("objectParams/load");
      }

      if (to.name === "NewInspection") {
        await store.dispatch("loadUsers");
      }

      if (to.params.idate != undefined && loadObject.status == 200) {
        let loadInspection = { status: 200 };
        // @ts-ignore
        loadInspection = await store.dispatch(
          "inspection/search",
          to.params.idate
        );
        if (loadInspection.status === 200) {
          loadInspection = await store.dispatch("inspection/load");
          if (loadInspection.status !== 200) {
            next({ name: "Home" });
          }
        } else {
          next({ name: "Home" });
        }

        if (to.name === "EditInspection") {
          await store.dispatch("loadUsers");
          await store.dispatch("inspectionParams/load");
        }

        if (to.params.did != undefined && loadInspection.status == 200) {
          let loadDamage = {
            status: 200,
          };
          // @ts-ignore
          store.commit("damage/setDid", to.params.did);
          loadDamage = await store.dispatch("damage/load");
          if (loadDamage.status !== 200) {
            next({
              name: "Home",
            });
          }

          if (to.name === "EditDamage") {
            await store.dispatch("damageParams/loadEdit");
          }
          if (to.name === "UpdateDamage") {
            await store.dispatch("damageParams/loadUpdate");
          }

          if (loadDamage.status === 200) {
            next();
          }
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      next();
    }
  }
});

router.afterEach(function() {
  store.commit("setIsLoading", false);
});

/* set status bar color */
Plugins.Device.getInfo().then((info) => {
  if (info.platform == "android") {
    Plugins.StatusBar.setBackgroundColor({ color: "#005096" });
  }
});

const app = createApp(App)
  .use(store)
  .use(IonicVue, { mode: "md", animated: false })
  .use(router)
  .use(i18n)
  .use(VueCookieNext);

router.isReady().then(() => {
  app.mount("#app");
});

// @ts-ignore
if (window.Cypress) {
  // Add `store` to the window object only when testing with Cypress
  // @ts-ignore
  window.store = store;
  // @ts-ignore
  window.i18n = i18n.global;
}
