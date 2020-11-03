<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title
          >smart inspection –
          {{
            $route.name === "NewObject" ? $t("newObject") : $t("editObject")
          }}</ion-title
        >
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid class="height-100">
        <ion-row color="primary" class="ion-justify-content-center height-100">
          <ion-col size-md="6" size-lg="6" size-xs="12">
            <ion-segment
              :value="selectedSegment"
            >
              <ion-segment-button disabled value="objectData">
                <ion-label>{{ $t("objectdata") }}</ion-label>
              </ion-segment-button>
              <ion-segment-button disabled value="objectDocuments">
                <ion-label>{{ $t("objectdocuments") }}</ion-label>
              </ion-segment-button>
            </ion-segment>
            <object-data
              v-if="selectedSegment === 'objectData'"
              @next="selectedSegment = 'objectDocuments'"
            ></object-data>
            <object-documents
              v-if="selectedSegment === 'objectDocuments'"
              @back="selectedSegment = 'objectData'"
            ></object-documents>
          </ion-col>
        </ion-row>
      </ion-grid>
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
  IonSegment,
  IonSegmentButton,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Plugins } from "@capacitor/core";
import { document } from "ionicons/icons";
import ObjectData from "@/components/ObjectData";
import ObjectDocuments from "@/components/ObjectDocuments";

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
    IonLabel,
    //IonIcon,
    IonBackButton,
    IonButtons,
    //IonSpinner,
    //IonTextarea
    IonSegment,
    IonSegmentButton,
    "object-data": ObjectData,
    "object-documents": ObjectDocuments,
  },
  setup() {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();

    // define router
    const router = useRouter();

    if (router.currentRoute.value.name === "EditObject") {
      store.dispatch("objectParams/load");
    }

    const selectedSegment = ref("objectData");

    const segmentChanged = function (event) {
      selectedSegment.value = event.detail.value;
    };

    return {
      segmentChanged,
      selectedSegment,
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>