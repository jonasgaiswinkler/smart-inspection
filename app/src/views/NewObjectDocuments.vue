<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="new-object-data"></ion-back-button>
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
                    newBridgeParams.photo != null
                      ? newBridgeParams.photo.name
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
                  <ion-icon slot="icon-only" :icon="document"></ion-icon>
                </ion-button>
                <input
                  @change="setNewBridgeParam('photo', $event.target.files[0])"
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
                    newBridgeParams.groundPlan != null
                      ? newBridgeParams.groundPlan.name
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
                  <ion-icon slot="icon-only" :icon="document"></ion-icon>
                </ion-button>
                <input
                  @change="
                    setNewBridgeParam('groundPlan', $event.target.files[0])
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
                    newBridgeParams.longitudinalSection != null
                      ? newBridgeParams.longitudinalSection.name
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
                  <ion-icon slot="icon-only" :icon="document"></ion-icon>
                </ion-button>
                <input
                  @change="
                    setNewBridgeParam(
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
                    newBridgeParams.crossSection != null
                      ? newBridgeParams.crossSection.name
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
                  <ion-icon slot="icon-only" :icon="document"></ion-icon>
                </ion-button>
                <input
                  @change="
                    setNewBridgeParam('crossSection', $event.target.files[0])
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
                    newBridgeParams.techDescription != null
                      ? newBridgeParams.techDescription.name
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
                  <ion-icon slot="icon-only" :icon="document"></ion-icon>
                </ion-button>
                <input
                  @change="
                    setNewBridgeParam('techDescription', $event.target.files[0])
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
                    newBridgeParams.model != null
                      ? newBridgeParams.model.name
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
                  <ion-icon slot="icon-only" :icon="document"></ion-icon>
                </ion-button>
                <input
                  @change="setNewBridgeParam('model', $event.target.files[0])"
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
                    newBridgeParams.files != null
                      ? $t('filesAmount', newBridgeParams.files.length)
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
                  <ion-icon slot="icon-only" :icon="document"></ion-icon>
                </ion-button>
                <input
                  @change="setNewBridgeParam('files', $event.target.files)"
                  multiple
                  type="file"
                  ref="inputFiles"
                  style="display: none"
                />
              </ion-item>
              <ion-row class="ion-float-right ion-align-items-center">
                <ion-spinner v-if="isLoading" color="primary"></ion-spinner>
                <ion-button :disabled="isLoading" @click="saveNewBridge" class="ion-margin-start">{{
                  $t("save")
                }}</ion-button>
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
  IonBackButton,
  IonButtons,
  IonTextarea,
  IonSpinner
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
    IonItem,
    //IonSelect,
    //IonSelectOption,
    IonInput,
    IonButton,
    IonLabel,
    IonIcon,
    IonBackButton,
    IonButtons,
    IonSpinner
    //IonTextarea
  },
  setup() {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();

    // get bridge params from store
    const newBridgeParams = computed(() => store.state.newBridge.params);
    // define bridge params setter
    const setNewBridgeParam = function (key, value) {
      store.commit("newBridge/setParam", { key: key, value: value });
    };

    // get loading status from store
    const isLoading = computed(() => store.state.newBridge.isLoading);

    // save new bridge function
    const saveNewBridge = async function () {
      store.commit("newBridge/setIsLoading", true);
      try {
          await store.dispatch("newBridge/save");
      } catch (error) {
          console.error(error);
      }
      store.commit("newBridge/setIsLoading", false);
    };

    return {
      document,
      newBridgeParams,
      setNewBridgeParam,
      saveNewBridge,
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