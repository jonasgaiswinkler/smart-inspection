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
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
        <nav-popover></nav-popover>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form
        class="height-100"
        id="assessment-form"
        @submit.stop.prevent="saveAssessment"
      >
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col size-md="12" size-lg="6" size-xs="12">
              <h1>{{ $t("assessments.substructure") }}</h1>
              <assessment-input
                :title="$t('assessments.substructure')"
                :value="assessmentParams.substructure"
                @input="setAssessmentParam('substructure', $event)"
                :error="errorSubstructure"
              ></assessment-input>
              <h1>{{ $t("assessments.superstructure") }}</h1>
              <assessment-input
                :title="$t('assessments.superstructure')"
                :value="assessmentParams.superstructure"
                @input="setAssessmentParam('superstructure', $event)"
                :error="errorSuperstructure"
              ></assessment-input>
              <h1>{{ $t("assessments.equipment") }}</h1>
              <assessment-input
                :title="$t('assessments.equipment')"
                :value="assessmentParams.equipment"
                @input="setAssessmentParam('equipment', $event)"
                :error="errorEquipment"
              ></assessment-input>
              <h1>{{ $t("assessments.object") }}</h1>
              <assessment-input
                :title="$t('assessments.object')"
                :value="assessmentParams.object"
                @input="setAssessmentParam('object', $event)"
                :error="errorObject"
              ></assessment-input>
              <ion-row class="ion-float-right ion-align-items-center">
                <ion-spinner v-if="isLoading" color="primary"></ion-spinner>
                <ion-button
                  :disabled="isLoading"
                  class="ion-margin-start"
                  type="submit"
                  :aria-label="$t('save')"
                  :title="$t('save')"
                  >{{ $t("save") }}</ion-button
                >
              </ion-row>
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
import AssessmentInput from "@/components/AssessmentInput";
import NavPopover from "@/components/NavPopover";

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
    IonSpinner,
    "assessment-input": AssessmentInput,
    "nav-popover": NavPopover,
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

    // missing fields errors
    const errorSubstructure = ref(false);
    const errorSuperstructure = ref(false);
    const errorEquipment = ref(false);
    const errorObject = ref(false);

    // get loading status from store
    const isLoading = computed(() => store.state.assessmentParams.isLoading);

    const saveAssessment = async function() {
      store.commit("assessmentParams/setIsLoading", true);

      errorSubstructure.value = assessmentParams.value.substructure == null;
      errorSuperstructure.value = assessmentParams.value.superstructure == null;
      errorEquipment.value = assessmentParams.value.equipment == null;
      errorObject.value = assessmentParams.value.object == null;

      if (
        !errorSubstructure.value &&
        !errorSuperstructure.value &&
        !errorEquipment.value &&
        !errorObject.value
      ) {
        try {
          const result = await store.dispatch("assessmentParams/save");
          const toast = await toastController.create({
            message: i18n.t("assessmentSaved"),
            duration: 2000,
            color: "success",
          });
          toast.present();
          router.push({
            name: "Inspection",
            params: { oid: result.oid, idate: result.idate },
          });
        } catch (error) {
          console.error(error);
          toastController
            .create({
              message: error,
              duration: 2000,
              color: "danger",
            })
            .then((toast) => {
              toast.present();
            });
        }
      }
      store.commit("assessmentParams/setIsLoading", false);
    };

    return {
      faFile,
      inspectionOptions,
      assessmentParams,
      setAssessmentParam,
      isLoading,
      users,
      arrowBack,
      saveAssessment,
      errorSubstructure,
      errorSuperstructure,
      errorEquipment,
      errorObject,
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>
