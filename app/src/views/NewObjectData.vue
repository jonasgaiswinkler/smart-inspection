<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
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
                  :value="newObjectParams.material"
                  @ionChange="
                    setNewObjectParam('material', $event.target.value)
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
                  :value="newObjectParams.type"
                  @ionChange="setNewObjectParam('type', $event.target.value)"
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
                  :value="newObjectParams.system"
                  @ionChange="setNewObjectParam('system', $event.target.value)"
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
                    setNewObjectParam('constructionYear', $event.target.value)
                  "
                  type="number"
                  :value="newObjectParams.constructionYear"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.lineStreet") }}</ion-label>
                <ion-input
                  @ionChange="
                    setNewObjectParam('lineStreet', $event.target.value)
                  "
                  :value="newObjectParams.lineStreet"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.chainage") }}</ion-label>
                <ion-input
                  @ionChange="
                    setNewObjectParam('chainage', $event.target.value)
                  "
                  type="number"
                  :value="newObjectParams.chainage"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.coords") }}</ion-label>
                <ion-input
                  readonly
                  :value="newObjectCoords"
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
                    setNewObjectParam('spanLength', $event.target.value)
                  "
                  type="number"
                  :value="newObjectParams.spanLength"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.superstructures.name") }}</ion-label>
                <ion-select
                  :value="newObjectParams.superstructure"
                  @ionChange="
                    setNewObjectParam('superstructure', $event.target.value)
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
                    setNewObjectParam('trafficRoutes', $event.target.value)
                  "
                  type="number"
                  :value="newObjectParams.trafficRoutes"
                  class="ion-text-right"
                ></ion-input>
              </ion-item>
              <ion-item :disabled="isLoading">
                <ion-label>{{ $t("bridge.shortDescription") }}</ion-label>
                <ion-textarea
                  @ionChange="
                    setNewObjectParam('shortDescription', $event.target.value)
                  "
                  :value="newObjectParams.shortDescription"
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
  IonTextarea
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
    // define object params from store
    const newObjectParams = computed(() => store.state.newObject.params);
    // define object params setter
    const setNewObjectParam = function (key, value) {
      store.commit("newObject/setParam", { key: key, value: value != "" ? value : null });
    };

    // get loading status from store
    const isLoading = computed(() => store.state.newObject.isLoading);

    // define geolocation method
    const getLocation = function () {
      Geolocation.getCurrentPosition()
        .then((position) => {
          setNewObjectParam("coords", position.coords);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    // define coords getter
    const newObjectCoords = computed(
      () => store.getters["newObject/getCoords"]
    );

    return {
      locate,
      bridgeOptions,
      newObjectParams,
      setNewObjectParam,
      getLocation,
      newObjectCoords,
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