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
  IonTextarea,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { Plugins } from "@capacitor/core";
import { document } from "ionicons/icons";

export default defineComponent({
  name: "NewObjectData",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRow,
    IonGrid,
    IonCol,
    //IonItem,
    //IonSelect,
    //IonSelectOption,
    //IonInput,
    //IonButton,
    //IonLabel,
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

    return {

    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>