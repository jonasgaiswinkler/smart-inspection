<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>smart inspection – {{ $t("objectList") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form class="height-100" id="login" @submit.stop.prevent="submit">
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col size-md="6" size-lg="6" size-xs="12">
              <ion-list v-for="doc in objects" :key="doc.id">
                <ion-item button @click="$router.push({name: 'Object', params: {oid: doc.id}})">
                  <ion-label>{{$t("object.name") + " " + doc.id + ": " + doc.data().shortDescription }}</ion-label>
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
  IonTextarea,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { Plugins } from "@capacitor/core";
import { document } from "ionicons/icons";
import * as firebase from "firebase/app";
import "firebase/firestore";

export default defineComponent({
  name: "ObjectList",
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
    //IonSelect,
    //IonSelectOption,
    //IonInput,
    //IonButton,
    IonLabel,
    IonList,
    //IonIcon,
    IonBackButton,
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

    const objects = ref([]);

    db.collection("objects")
      .get()
      .then((snapshot) => {
        for (const doc of snapshot.docs) {
          objects.value.push(doc);
        }
      });

    return {
      objects,
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>