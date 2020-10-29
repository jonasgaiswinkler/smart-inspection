<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>smart inspection – {{ $t("newInspection") }}</ion-title>
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
              <h1>{{ $t("objectdata") }}</h1>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("inspection.inspector") }}</ion-label>
                <ion-select
                  :value="newInspectionParams.inspector"
                  @ionChange="
                    setNewInspectionParam('inspector', $event.target.value)
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
                  @ionChange="
                    setNewInspectionParam('date', $event.target.value)
                  "
                  type="date"
                  :value="newInspectionParams.date"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{
                  $t("inspection.inspectionTypes.name")
                }}</ion-label>
                <ion-select
                  :value="newInspectionParams.inspectionType"
                  @ionChange="
                    setNewInspectionParam('inspectionType', $event.target.value)
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
                  :value="newInspectionParams.weather"
                  @ionChange="
                    setNewInspectionParam('weather', $event.target.value)
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
                    setNewInspectionParam('temperature', $event.target.value)
                  "
                  type="number"
                  :value="newInspectionParams.temperature"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("inspection.photo") }}</ion-label>
                <ion-input
                  readonly
                  :value="
                    newInspectionParams.photo != null
                      ? newInspectionParams.photo.name
                      : null
                  "
                  class="ion-text-right"
                ></ion-input>
                <ion-button
                  @click="$refs.inputPhoto.click()"
                  slot="end"
                  fill="clear"
                  :disabled="isLoading"
                >
                  <font-awesome-icon
                    slot="icon-only"
                    :icon="faFile"
                    size="lg"
                  ></font-awesome-icon>
                </ion-button>
                <input
                  @change="
                    setNewInspectionParam('photo', $event.target.files[0])
                  "
                  type="file"
                  ref="inputPhoto"
                  style="display: none"
                />
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("inspection.additionalInfo") }}</ion-label>
                <ion-textarea
                  @ionChange="
                    setNewInspectionParam('additionalInfo', $event.target.value)
                  "
                  :value="newInspectionParams.additionalInfo"
                  class="ion-text-right"
                ></ion-textarea>
              </ion-item>
              <ion-row class="ion-float-right ion-align-items-center">
                <ion-spinner v-if="isLoading" color="primary"></ion-spinner>
                <ion-button
                  :disabled="isLoading"
                  @click="saveNewInspection"
                  class="ion-margin-start"
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
  IonBackButton,
  IonButtons,
  IonTextarea,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

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
    IonItem,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
    IonLabel,
    IonBackButton,
    IonButtons,
    IonTextarea,
    IonSpinner,
    "font-awesome-icon": FontAwesomeIcon,
  },
  setup() {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();
    const messages = i18n.messages.value.de;

    // load users
    store.dispatch("loadUsers");

    // define users getter
    const users = computed(() => store.state.users);

    // define bridge options
    const inspectionOptions = messages.inspection;
    // define object params from store
    const newInspectionParams = computed(
      () => store.state.newInspection.params
    );
    // define object params setter
    const setNewInspectionParam = function (key, value) {
      store.commit("newInspection/setParam", {
        key: key,
        value: value != "" ? value : null,
      });
    };

    // get loading status from store
    const isLoading = computed(() => store.state.newInspection.isLoading);

    // save new object function
    const saveNewInspection = async function () {
      store.commit("newInspection/setIsLoading", true);
      try {
        await store.dispatch("newInspection/save");
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
      store.commit("newInspection/setIsLoading", false);
    };

    return {
      faFile,
      inspectionOptions,
      newInspectionParams,
      setNewInspectionParam,
      isLoading,
      users,
      saveNewInspection,
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>