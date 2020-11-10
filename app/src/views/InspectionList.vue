<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button @click="$router.push({name: 'Object'})">
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t("inspectionList") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form class="height-100" id="inspection-list" @submit.stop.prevent="submit">
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col size-md="6" size-lg="6" size-xs="12">
              <ion-searchbar
                debounce="100"
                type="number"
                :placeholder="$t('search')"
                @ionChange="search"
              ></ion-searchbar>
              <ion-progress-bar
                v-if="isLoading"
                type="indeterminate"
              ></ion-progress-bar>
              <ion-list v-for="doc in inspections" :key="doc.id">
                <ion-item
                  button
                  @click="
                    $router.push({ name: 'Inspection', params: { iid: doc.id } })
                  "
                >
                  <ion-label>{{
                    $t("inspection.name") +
                    " " +
                    doc.id +
                    ": " +
                    doc.data().date.toDate().toLocaleDateString("de-DE")
                  }}</ion-label>
                </ion-item>
              </ion-list>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </ion-content>
  </ion-page>
</template>

<script>
// Imports
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonGrid,
  IonCol,
  IonItem,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonList,
  IonProgressBar,
  IonSearchbar,
  IonTextarea,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { Plugins } from "@capacitor/core";
import { arrowBack } from "ionicons/icons";
import * as firebase from "firebase/app";
import "firebase/firestore";

export default defineComponent({
  name: "InspectionList",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRow,
    IonGrid,
    IonCol,
    IonItem,
    IonProgressBar,
    IonSearchbar,
    //IonSelect,
    //IonSelectOption,
    //IonInput,
    IonButton,
    IonLabel,
    IonList,
    IonIcon,
    //IonBackButton,
    IonButtons,
    //IonSpinner,
    //IonTextarea
  },
  setup() {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();

    // define firestore
    const db = firebase.firestore();

    // get oid from store
    const oid = computed(() => store.state.object.oid);

    // define object list
    const inspections = ref([]);
    const list = [];

    // define isLoading
    const isLoading = ref(true);

    db.collection("objects").doc(oid.value).collection("inspections")
      .get()
      .then((snapshot) => {
        for (const doc of snapshot.docs) {
          list.push(doc);
        }
        inspections.value = list;
        isLoading.value = false;
      });

    const search = function (value) {
      inspections.value = list.filter(doc => doc.id.includes(value.detail.value));
    };

    return {
      inspections,
      isLoading,
      search,
      arrowBack
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>