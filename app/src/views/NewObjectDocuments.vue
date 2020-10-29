<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/new-object-data"></ion-back-button>
        </ion-buttons>
        <ion-title>smart inspection – {{ $t("newObject") }}</ion-title>
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
              <h1>{{ $t("objectdocuments") }}</h1>
              <h4>{{ $t("plans") }}</h4>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.photo") }}</ion-label>
                <ion-input
                  readonly
                  :value="
                    newObjectParams.photo != null
                      ? newObjectParams.photo.name
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
                  @change="setNewObjectParam('photo', $event.target.files[0])"
                  type="file"
                  ref="inputPhoto"
                  style="display: none"
                />
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.groundPlan") }}</ion-label>
                <ion-input
                  readonly
                  :value="
                    newObjectParams.groundPlan != null
                      ? newObjectParams.groundPlan.name
                      : null
                  "
                  class="ion-text-right"
                ></ion-input>
                <ion-button
                  @click="$refs.inputGroundPlan.click()"
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
                    setNewObjectParam('groundPlan', $event.target.files[0])
                  "
                  type="file"
                  ref="inputGroundPlan"
                  style="display: none"
                />
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.longitudinalSection") }}</ion-label>
                <ion-input
                  readonly
                  :value="
                    newObjectParams.longitudinalSection != null
                      ? newObjectParams.longitudinalSection.name
                      : null
                  "
                  class="ion-text-right"
                ></ion-input>
                <ion-button
                  @click="$refs.inputLongitudinalSection.click()"
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
                    setNewObjectParam(
                      'longitudinalSection',
                      $event.target.files[0]
                    )
                  "
                  type="file"
                  ref="inputLongitudinalSection"
                  style="display: none"
                />
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.crossSection") }}</ion-label>
                <ion-input
                  readonly
                  :value="
                    newObjectParams.crossSection != null
                      ? newObjectParams.crossSection.name
                      : null
                  "
                  class="ion-text-right"
                ></ion-input>
                <ion-button
                  @click="$refs.inputCrossSection.click()"
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
                    setNewObjectParam('crossSection', $event.target.files[0])
                  "
                  type="file"
                  ref="inputCrossSection"
                  style="display: none"
                />
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.techDescription") }}</ion-label>
                <ion-input
                  readonly
                  :value="
                    newObjectParams.techDescription != null
                      ? newObjectParams.techDescription.name
                      : null
                  "
                  class="ion-text-right"
                ></ion-input>
                <ion-button
                  @click="$refs.inputTechDescription.click()"
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
                    setNewObjectParam('techDescription', $event.target.files[0])
                  "
                  type="file"
                  ref="inputTechDescription"
                  style="display: none"
                />
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.model") }}</ion-label>
                <ion-input
                  readonly
                  :value="
                    newObjectParams.model != null
                      ? newObjectParams.model.name
                      : null
                  "
                  class="ion-text-right"
                ></ion-input>
                <ion-button
                  @click="$refs.inputModel.click()"
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
                  @change="setNewObjectParam('model', $event.target.files[0])"
                  type="file"
                  ref="inputModel"
                  style="display: none"
                />
              </ion-item>
              <h4>{{ $t("additionalResources") }}</h4>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.files") }}</ion-label>
                <ion-input
                  readonly
                  :value="
                    newObjectParams.files != null
                      ? $t('filesAmount', newObjectParams.files.length)
                      : null
                  "
                  class="ion-text-right"
                ></ion-input>
                <ion-button
                  @click="$refs.inputFiles.click()"
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
                  @change="setNewObjectParam('files', $event.target.files)"
                  multiple
                  type="file"
                  ref="inputFiles"
                  style="display: none"
                />
              </ion-item>
              <ion-row class="ion-float-right ion-align-items-center">
                <ion-spinner v-if="isLoading" color="primary"></ion-spinner>
                <ion-button
                  :disabled="isLoading"
                  @click="saveNewObject"
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
import { computed, defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { Plugins } from "@capacitor/core";
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
    //IonSelect,
    //IonSelectOption,
    IonInput,
    IonButton,
    IonLabel,
    IonBackButton,
    IonButtons,
    IonSpinner,
    "font-awesome-icon": FontAwesomeIcon,
    //IonTextarea
  },
  setup() {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();

    // define object params from store
    const newObjectParams = computed(() => store.state.newObject.params);
    // define object params setter
    const setNewObjectParam = function (key, value) {
      store.commit("newObject/setParam", { key: key, value: value });
    };

    // get loading status from store
    const isLoading = computed(() => store.state.newObject.isLoading);

    // save new object function
    const saveNewObject = async function () {
      store.commit("newObject/setIsLoading", true);
      try {
        await store.dispatch("newObject/save");
        const toast = await toastController.create({
          message: i18n.t("objectSaved"),
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
      store.commit("newObject/setIsLoading", false);
    };

    return {
      faFile,
      newObjectParams,
      setNewObjectParam,
      saveNewObject,
      isLoading,
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>