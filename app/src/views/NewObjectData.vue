<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="home"></ion-back-button>
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
              <h1>{{ $t("objectdata") }}</h1>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.materials.name") }}</ion-label>
                <ion-select
                  :value="newBridgeParams.material"
                  @ionChange="
                    setNewBridgeParam('material', $event.target.value)
                  "
                  :placeholder="$t('pleasechoose')"
                  interface="popover"
                >
                  <ion-select-option
                    v-for="(material, key) in bridgeOptions.materials.data"
                    :key="key"
                    :value="key"
                    >{{ $t("bridge.materials.data." + key) }}</ion-select-option
                  >
                </ion-select>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.types.name") }}</ion-label>
                <ion-select
                  :value="newBridgeParams.type"
                  @ionChange="setNewBridgeParam('type', $event.target.value)"
                  :placeholder="$t('pleasechoose')"
                  interface="popover"
                >
                  <ion-select-option
                    v-for="(type, key) in bridgeOptions.types.data"
                    :key="key"
                    :value="key"
                    >{{ $t("bridge.types.data." + key) }}</ion-select-option
                  >
                </ion-select>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.systems.name") }}</ion-label>
                <ion-select
                  :value="newBridgeParams.system"
                  @ionChange="setNewBridgeParam('system', $event.target.value)"
                  :placeholder="$t('pleasechoose')"
                  interface="popover"
                >
                  <ion-select-option
                    v-for="(type, key) in bridgeOptions.systems.data"
                    :key="key"
                    :value="key"
                    >{{ $t("bridge.systems.data." + key) }}</ion-select-option
                  >
                </ion-select>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.constructionYear") }}</ion-label>
                <ion-input
                  @ionChange="
                    setNewBridgeParam('constructionYear', $event.target.value)
                  "
                  type="number"
                  :value="newBridgeParams.constructionYear"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.lineStreet") }}</ion-label>
                <ion-input
                  @ionChange="
                    setNewBridgeParam('lineStreet', $event.target.value)
                  "
                  :value="newBridgeParams.lineStreet"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.chainage") }}</ion-label>
                <ion-input
                  @ionChange="
                    setNewBridgeParam('chainage', $event.target.value)
                  "
                  type="number"
                  :value="newBridgeParams.chainage"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.coords") }}</ion-label>
                <ion-input
                  readonly
                  :value="newBridgeCoords"
                  class="ion-text-right"
                ></ion-input>
                <ion-button
                  @click="getLocation"
                  slot="end"
                  fill="clear"
                  :disabled="isLoading"
                >
                  <ion-icon slot="icon-only" :icon="locate"></ion-icon>
                </ion-button>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.spanLength") }}</ion-label>
                <ion-input
                  @ionChange="
                    setNewBridgeParam('spanLength', $event.target.value)
                  "
                  type="number"
                  :value="newBridgeParams.spanLength"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.superstructures.name") }}</ion-label>
                <ion-select
                  :value="newBridgeParams.superstructure"
                  @ionChange="
                    setNewBridgeParam('superstructure', $event.target.value)
                  "
                  :placeholder="$t('pleasechoose')"
                  interface="popover"
                >
                  <ion-select-option
                    v-for="(type, key) in bridgeOptions.superstructures.data"
                    :key="key"
                    :value="key"
                    >{{
                      $t("bridge.superstructures.data." + key)
                    }}</ion-select-option
                  >
                </ion-select>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.trafficRoutes") }}</ion-label>
                <ion-input
                  @ionChange="
                    setNewBridgeParam('trafficRoutes', $event.target.value)
                  "
                  type="number"
                  :value="newBridgeParams.trafficRoutes"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.shortDescription") }}</ion-label>
                <ion-textarea
                  @ionChange="
                    setNewBridgeParam('shortDescription', $event.target.value)
                  "
                  :value="newBridgeParams.shortDescription"
                  class="ion-text-right"
                ></ion-textarea>
              </ion-item>
              <ion-row class="ion-float-right">
                <ion-button router-link="/new-object-documents">{{
                  $t("next")
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
} from "@ionic/vue";
import { computed, defineComponent, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { Plugins } from "@capacitor/core";
import { locate } from "ionicons/icons";

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
    IonIcon,
    IonBackButton,
    IonButtons,
    IonTextarea,
  },
  setup() {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();
    const messages = i18n.messages.value.de;

    //define geolocation plugin
    const { Geolocation } = Plugins;

    // define bridge options
    const bridgeOptions = messages.bridge;
    // define bridge params from store
    const newBridgeParams = computed(() => store.state.newBridge.params);
    // define bridge params setter
    const setNewBridgeParam = function (key, value) {
      store.commit("newBridge/setParam", { key: key, value: value });
    };

    // get loading status from store
    const isLoading = computed(() => store.state.newBridge.isLoading);

    // define geolocation method
    const getLocation = function () {
      Geolocation.getCurrentPosition()
        .then((position) => {
          setNewBridgeParam("coords", position.coords);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    // define coords getter
    const newBridgeCoords = computed(
      () => store.getters["newBridge/getCoords"]
    );

    return {
      locate,
      bridgeOptions,
      newBridgeParams,
      setNewBridgeParam,
      getLocation,
      newBridgeCoords,
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