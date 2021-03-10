<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button
            @click="back"
            :aria-label="$t('back')"
            :title="$t('back')"
          >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{
          $route.name === "NewObject" ? $t("newObject") : $t("editObject")
        }}</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
        <nav-popover></nav-popover>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid style="height: 100%;">
        <ion-row
          color="primary"
          style="height: 100%;"
          class="ion-justify-content-center"
        >
          <ion-col size-md="12" size-lg="6" size-xs="12">
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
import { useRouter } from "vue-router";
import { Plugins } from "@capacitor/core";
import { arrowBack } from "ionicons/icons";
import ObjectData from "@/components/ObjectData";
import ObjectDocuments from "@/components/ObjectDocuments";
import NavPopover from "@/components/NavPopover";

export default defineComponent({
  name: "NewObject",
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
    IonButton,
    IonIcon,
    //IonBackButton,
    IonButtons,
    IonSpinner,
    //IonTextarea
    "object-data": ObjectData,
    "object-documents": ObjectDocuments,
    "nav-popover": NavPopover,
  },
  setup() {
    // define router
    const router = useRouter();

    // get current route name
    const routeName = router.currentRoute.value.name;

    const selectedSegment = ref("objectData");

    const back = function() {
      router.push({
        name: routeName === "NewObject" ? "Home" : "Object",
      });
      selectedSegment.value = "objectData";
    };

    return {
      selectedSegment,
      arrowBack,
      back,
    };
  },
});
</script>

<style>
/* .popover-content {
  top: 0 !important;
  max-height: 400px !important;
} */
</style>
