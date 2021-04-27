<template>
  <h2>{{ $t("objectDocuments") }}</h2>
  <h4>{{ $t("plans") }}</h4>
  <ion-item v-if="errorPhoto" color="danger">
    <ion-label>{{ $t("fileTooBig") }}</ion-label>
  </ion-item>
  <file-input
    :disabled="isLoading"
    :label="$t('object.photo')"
    :value="objectParams.photo"
    accept="image/png, image/jpeg"
    @select="setObjectParam('photo', $event)"
  ></file-input>
  <ion-item v-if="errorGroundPlan" color="danger">
    <ion-label>{{ $t("fileTooBig") }}</ion-label>
  </ion-item>
  <file-input
    :disabled="isLoading"
    :label="$t('object.groundPlan')"
    :value="objectParams.groundPlan"
    accept="image/png, image/jpeg, application/pdf"
    @select="setObjectParam('groundPlan', $event)"
  ></file-input>
  <ion-item v-if="errorLongitudinalSection" color="danger">
    <ion-label>{{ $t("fileTooBig") }}</ion-label>
  </ion-item>
  <file-input
    :disabled="isLoading"
    :label="$t('object.longitudinalSection')"
    :value="objectParams.longitudinalSection"
    accept="image/png, image/jpeg, application/pdf"
    @select="setObjectParam('longitudinalSection', $event)"
  ></file-input>
  <ion-item v-if="errorCrossSection" color="danger">
    <ion-label>{{ $t("fileTooBig") }}</ion-label>
  </ion-item>
  <file-input
    :disabled="isLoading"
    :label="$t('object.crossSection')"
    :value="objectParams.crossSection"
    accept="image/png, image/jpeg, application/pdf"
    @select="setObjectParam('crossSection', $event)"
  ></file-input>
  <file-input
    :disabled="isLoading"
    :label="$t('object.techDescription')"
    :value="objectParams.techDescription"
    accept="image/png, image/jpeg, application/pdf"
    @select="setObjectParam('techDescription', $event)"
  ></file-input>
  <file-input
    :disabled="isLoading"
    :label="$t('object.model')"
    :value="objectParams.model"
    accept=".stl"
    @select="setObjectParam('model', $event)"
  ></file-input>

  <h4>{{ $t("additionalResources") }}</h4>
  <ion-item :disabled="isLoading">
    <ion-label>{{ $t("object.files") }}</ion-label>
    <ion-input
      readonly
      :value="
        objectParams.files != null
          ? $tc('filesAmount', objectParams.files.data.length)
          : null
      "
      class="ion-text-right"
      style="margin-right: 16px"
    ></ion-input>
    <ion-button
      v-if="objectParams.files != null"
      @click="setObjectParam('files', null)"
      fill="clear"
      :disabled="isLoading"
      slot="end"
      style="margin-right: 10px; margin-left: 0px"
      :aria-label="$t('delete')"
      :title="$t('delete')"
    >
      <font-awesome-icon
        slot="icon-only"
        :icon="faTimes"
        size="lg"
      ></font-awesome-icon>
    </ion-button>
    <ion-button
      @click="inputFiles.click()"
      slot="end"
      fill="clear"
      :disabled="isLoading"
      style="margin-left: 0px"
      :aria-label="$t('selectFiles')"
      :title="$t('selectFiles')"
    >
      <font-awesome-icon
        slot="icon-only"
        :icon="faFileUpload"
        size="lg"
      ></font-awesome-icon>
    </ion-button>
    <input
      @change="setObjectParam('files', { data: $event.target.files })"
      multiple
      type="file"
      ref="inputFiles"
      style="display: none"
    />
  </ion-item>
  <ion-row class="ion-align-items-center">
    <ion-button
      @click="$emit('back')"
      fill="clear"
      :aria-label="$t('objectData')"
      :title="$t('objectData')"
      ><font-awesome-icon
        :icon="faArrowLeft"
        style="margin-right: 10px"
      ></font-awesome-icon
      >{{ $t("objectData") }}</ion-button
    >
    <div style="flex: 1"></div>
    <ion-spinner v-if="isLoading" color="primary"></ion-spinner>
    <ion-button
      :disabled="isLoading"
      @click="saveObject"
      class="ion-margin-start"
      :aria-label="$t('save')"
      :title="$t('save')"
      >{{ $t("save") }}</ion-button
    >
  </ion-row>
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faFileUpload,
  faTimes,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "vue-router";
import FileInput from "@/components/FileInput";

export default defineComponent({
  name: "NewObjectDocuments",
  components: {
    IonRow,
    IonItem,
    //IonSelect,
    //IonSelectOption,
    IonInput,
    IonButton,
    IonLabel,
    IonSpinner,
    "font-awesome-icon": FontAwesomeIcon,
    "file-input": FileInput,
    //IonTextarea
  },
  emits: ["back"],
  setup(props, { emit }) {
    // Define store
    const store = useStore();

    // Define router
    const router = useRouter();

    // get current route name
    const routeName = router.currentRoute.value.name;

    // define i18n
    const i18n = useI18n();

    const inputFiles = ref(null);

    // define object params from store
    const objectParams = computed(function() {
      if (routeName === "NewObject") {
        return store.state.objectParams.newParams;
      } else if (routeName === "EditObject") {
        return store.state.objectParams.editParams;
      } else {
        return null;
      }
    });
    // define object params setter
    const setObjectParam = function(key, value) {
      let commitPath = "";
      if (routeName === "NewObject") {
        commitPath = "objectParams/setNewParam";
      } else if (routeName === "EditObject") {
        commitPath = "objectParams/setEditParam";
      }
      store.commit(commitPath, {
        key: key,
        value: value != "" ? value : null,
      });
    };

    // get loading status from store
    const isLoading = computed(() => store.state.objectParams.isLoading);

    const isTooBig = function(param) {
      if (objectParams.value[param] == null) {
        return false;
      } else if (objectParams.value[param].same) {
        return false;
      } else if (objectParams.value[param].size < 10485760) {
        return false;
      } else {
        return true;
      }
    };

    const errorPhoto = ref(false);
    const errorGroundPlan = ref(false);
    const errorLongitudinalSection = ref(false);
    const errorCrossSection = ref(false);

    // save new object function
    const saveObject = async function() {
      store.commit("objectParams/setIsLoading", true);
      errorPhoto.value = isTooBig("photo");
      errorGroundPlan.value = isTooBig("groundPlan");
      errorLongitudinalSection.value = isTooBig("longitudinalSection");
      errorCrossSection.value = isTooBig("crossSection");

      if (
        !errorPhoto.value &&
        !errorGroundPlan.value &&
        !errorLongitudinalSection.value &&
        !errorCrossSection.value
      ) {
        try {
          let result = null;
          if (routeName === "NewObject") {
            result = await store.dispatch("objectParams/saveNew");
          } else if (routeName === "EditObject") {
            result = await store.dispatch("objectParams/saveEdit");
          }

          const toast = await toastController.create({
            message: i18n.t("objectSaved"),
            duration: 2000,
            color: "success",
          });
          toast.present();
          router.push({ name: "Object", params: { oid: result.oid } });
          emit("back");
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
      store.commit("objectParams/setIsLoading", false);
    };

    return {
      faFileUpload,
      faTimes,
      faArrowLeft,
      objectParams,
      setObjectParam,
      saveObject,
      isLoading,
      inputFiles,
      errorPhoto,
      errorGroundPlan,
      errorLongitudinalSection,
      errorCrossSection,
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>
