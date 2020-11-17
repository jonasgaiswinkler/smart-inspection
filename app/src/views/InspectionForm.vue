<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button
            @click="$router.push({ name: 'Object' })"
            :aria-label="$t('back')"
            :title="$t('back')"
          >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t("newInspection") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form
        class="height-100"
        id="inspection-form"
        @submit.stop.prevent="saveInspection"
      >
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col size-md="6" size-lg="6" size-xs="12">
              <h1>{{ $t("inspectionData") }}</h1>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("inspection.inspector") }}</ion-label>
                <ion-select
                  :value="inspectionParams.inspector"
                  @ionChange="
                    setInspectionParam('inspector', $event.target.value)
                  "
                  :placeholder="$t('pleasechoose')"
                  interface="popover"
                >
                  <ion-select-option
                    v-for="user in users"
                    :key="user.id"
                    :value="user.id"
                    >{{ user.name }}</ion-select-option
                  >
                </ion-select>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("inspection.date") }}</ion-label>
                <ion-input
                  @ionChange="setInspectionParam('date', $event.target.value)"
                  type="date"
                  :value="inspectionParams.date"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{
                  $t("inspection.inspectionTypes.name")
                }}</ion-label>
                <ion-select
                  :value="inspectionParams.inspectionType"
                  @ionChange="
                    setInspectionParam('inspectionType', $event.target.value)
                  "
                  :placeholder="$t('pleasechoose')"
                  interface="popover"
                >
                  <ion-select-option
                    v-for="(inspectionType, key) in inspectionOptions
                      .inspectionTypes.data"
                    :key="key"
                    :value="key"
                    >{{
                      $t("inspection.inspectionTypes.data." + key)
                    }}</ion-select-option
                  >
                </ion-select>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("inspection.weather.name") }}</ion-label>
                <ion-select
                  :value="inspectionParams.weather"
                  @ionChange="
                    setInspectionParam('weather', $event.target.value)
                  "
                  :placeholder="$t('pleasechoose')"
                  interface="popover"
                >
                  <ion-select-option
                    v-for="(material, key) in inspectionOptions.weather.data"
                    :key="key"
                    :value="key"
                    >{{
                      $t("inspection.weather.data." + key)
                    }}</ion-select-option
                  >
                </ion-select>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("inspection.temperature") }}</ion-label>
                <ion-input
                  @ionChange="
                    setInspectionParam('temperature', $event.target.value)
                  "
                  type="number"
                  step="any"
                  :value="inspectionParams.temperature"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <file-input
                :disabled="isLoading"
                :label="$t('inspection.photo')"
                :value="inspectionParams.photo"
                accept="image/png, image/jpeg"
                @select="setInspectionParam('photo', $event)"
              ></file-input>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("inspection.additionalInfo") }}</ion-label>
                <ion-textarea
                  @ionChange="
                    setInspectionParam('additionalInfo', $event.target.value)
                  "
                  :value="inspectionParams.additionalInfo"
                  class="ion-text-right"
                ></ion-textarea>
              </ion-item>
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
import { computed, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "vue-router";
import { arrowBack } from "ionicons/icons";
import FileInput from "@/components/FileInput";

export default defineComponent({
  name: "InspectionForm",
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
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
    IonLabel,
    IonIcon,
    //IonBackButton,
    IonButtons,
    IonTextarea,
    IonSpinner,
    "file-input": FileInput,
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

    // load users
    store.dispatch("loadUsers");

    // define users getter
    const users = computed(() => store.state.users);

    // define bridge options
    const inspectionOptions = messages.inspection;
    // define object params from store
    const inspectionParams = computed(function() {
      if (routeName === "NewInspection") {
        return store.state.inspectionParams.newParams;
      }
    });
    // define object params setter
    const setInspectionParam = function(key, value) {
      let commitPath = "";
      if (routeName === "NewInspection") {
        commitPath = "inspectionParams/setNewParam";
      }
      store.commit(commitPath, {
        key: key,
        value: value != "" ? value : null,
      });
    };

    // get loading status from store
    const isLoading = computed(() => store.state.inspectionParams.isLoading);

    // save new object function
    const saveInspection = async function() {
      store.commit("inspectionParams/setIsLoading", true);
      try {
        let result;
        if (routeName === "NewInspection") {
          result = await store.dispatch("inspectionParams/saveNew");
        }
        const toast = await toastController.create({
          message: i18n.t("inspectionSaved"),
          duration: 2000,
          color: "success",
        });
        toast.present();
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
      store.commit("inspectionParams/setIsLoading", false);
    };

    return {
      faFile,
      inspectionOptions,
      inspectionParams,
      setInspectionParam,
      isLoading,
      users,
      saveInspection,
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
