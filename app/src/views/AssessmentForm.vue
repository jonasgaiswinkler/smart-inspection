<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button
            @click="
              $router.push({
                name: $route.name === 'NewInspection' ? 'Object' : 'Inspection',
              })
            "
            :aria-label="$t('back')"
            :title="$t('back')"
          >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t("assessment") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form
        class="height-100"
        id="assessment-form"
        @submit.stop.prevent="saveInspection"
      >
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col size-md="6" size-lg="6" size-xs="12">
              <h1>{{ $t("objectAssessment") }}</h1>
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
  IonButtons,
  IonTextarea,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "vue-router";
import { arrowBack } from "ionicons/icons";
import FileInput from "@/components/FileInput";

export default defineComponent({
  name: "AssessmentForm",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRow,
    IonGrid,
    IonCol,
    // IonItem,
    // IonSelect,
    // IonSelectOption,
    // IonInput,
    IonButton,
    // IonLabel,
    IonIcon,
    //IonBackButton,
    IonButtons,
    // IonTextarea,
    // IonSpinner,
  },
  setup() {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();
    const messages = i18n.messages.value.de;

    // define router
    const router = useRouter();

    // get current route name
    const routeName = router.currentRoute.value.name;

    // define users getter
    const users = computed(() => store.state.users);

    // define bridge options
    const inspectionOptions = messages.inspection;
    // define object params from store
    const assessmentParams = computed(function() {
      return store.state.assessmentParams.params;
    });
    // define object params setter
    const setAssessmentParam = function(key, value) {
      store.commit("assessmentParams/setParam", {
        key: key,
        value: value != "" ? value : null,
      });
    };

    // get loading status from store
    const isLoading = computed(() => store.state.assessmentParams.isLoading);

    // save new object function
    // const saveInspection = async function() {
    //   store.commit("inspectionParams/setIsLoading", true);
    //   const inspectionExists = await store.dispatch(
    //     "inspectionParams/exists",
    //     routeName
    //   );
    //   errorDate.value = inspectionExists;

    //   errorInspector.value = inspectionParams.value.inspector == null;
    //   errorType.value = inspectionParams.value.type == null;

    //   if (!errorDate.value && !errorInspector.value && !errorType.value) {
    //     try {
    //       let result;
    //       if (routeName === "NewInspection") {
    //         result = await store.dispatch("inspectionParams/saveNew");
    //       } else if (routeName === "EditInspection") {
    //         result = await store.dispatch("inspectionParams/saveEdit");
    //       }
    //       const toast = await toastController.create({
    //         message: i18n.t("inspectionSaved"),
    //         duration: 2000,
    //         color: "success",
    //       });
    //       toast.present();
    //       router.push({
    //         name: "Inspection",
    //         params: { oid: result.oid, idate: result.idate },
    //       });
    //     } catch (error) {
    //       console.error(error);
    //       toastController
    //         .create({
    //           message: error,
    //           duration: 2000,
    //           color: "danger",
    //         })
    //         .then((toast) => {
    //           toast.present();
    //         });
    //     }
    //   }
    //   store.commit("inspectionParams/setIsLoading", false);
    // };

    return {
      faFile,
      inspectionOptions,
      assessmentParams,
      setAssessmentParam,
      isLoading,
      users,
      arrowBack,
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>
