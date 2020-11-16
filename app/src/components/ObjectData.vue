<template>
  <form class="height-100" id="objectdata" @submit.stop.prevent="next">
    <h1>{{ $t('objectData') }}</h1>
    <ion-item v-if="errorID" color="danger">
      <ion-label>{{ $t("idAssigned") }}</ion-label>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.id") }}*</ion-label>
      <ion-input
        @ionChange="setObjectParam('id', $event.target.value)"
        type="number"
        :value="objectParams.id"
        class="ion-text-right"
        required
        :disabled="routeName === 'EditObject'"
      ></ion-input>
    </ion-item>
    <ion-item v-if="errorMaterial" color="danger">
      <ion-label>{{ $t("pleaseChooseOption") }}</ion-label>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.materials.name") }}*</ion-label>
      <ion-select
        :value="objectParams.material"
        @ionChange="setObjectParam('material', $event.target.value)"
        :placeholder="$t('pleasechoose')"
        interface="popover"
        aria-required="required"
      >
        <ion-select-option
          v-for="(material, key) in objectOptions.materials.data"
          :key="key"
          :value="key"
          >{{ $t("object.materials.data." + key) }}</ion-select-option
        >
      </ion-select>
    </ion-item>
    <ion-item v-if="errorType" color="danger">
      <ion-label>{{ $t("pleaseChooseOption") }}</ion-label>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.types.name") }}*</ion-label>
      <ion-select
        :value="objectParams.type"
        @ionChange="setObjectParam('type', $event.target.value)"
        :placeholder="$t('pleasechoose')"
        interface="popover"
      >
        <ion-select-option
          v-for="(type, key) in objectOptions.types.data"
          :key="key"
          :value="key"
          >{{ $t("object.types.data." + key) }}</ion-select-option
        >
      </ion-select>
    </ion-item>
    <ion-item v-if="errorSystem" color="danger">
      <ion-label>{{ $t("pleaseChooseOption") }}</ion-label>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.systems.name") }}*</ion-label>
      <ion-select
        :value="objectParams.system"
        @ionChange="setObjectParam('system', $event.target.value)"
        :placeholder="$t('pleasechoose')"
        interface="popover"
      >
        <ion-select-option
          v-for="(type, key) in objectOptions.systems.data"
          :key="key"
          :value="key"
          >{{ $t("object.systems.data." + key) }}</ion-select-option
        >
      </ion-select>
    </ion-item>
    <ion-item v-if="errorCrossSectionShape" color="danger">
      <ion-label>{{ $t("pleaseChooseOption") }}</ion-label>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.crossSectionShapes.name") }}*</ion-label>
      <ion-select
        :value="objectParams.crossSectionShape"
        @ionChange="setObjectParam('crossSectionShape', $event.target.value)"
        :placeholder="$t('pleasechoose')"
        interface="popover"
      >
        <ion-select-option
          v-for="(type, key) in objectOptions.crossSectionShapes.data"
          :key="key"
          :value="key"
          >{{ $t("object.crossSectionShapes.data." + key) }}</ion-select-option
        >
      </ion-select>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.constructionYear") }}*</ion-label>
      <ion-input
        @ionChange="setObjectParam('constructionYear', $event.target.value)"
        type="number"
        :value="objectParams.constructionYear"
        class="ion-text-right"
        required
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.lineStreet") }}*</ion-label>
      <ion-input
        @ionChange="setObjectParam('lineStreet', $event.target.value)"
        :value="objectParams.lineStreet"
        class="ion-text-right"
        required
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.chainage") }}*</ion-label>
      <ion-input
        @ionChange="setObjectParam('chainage', $event.target.value)"
        type="number"
        step="any"
        :value="objectParams.chainage"
        class="ion-text-right"
        required
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.coords") }}</ion-label>
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
      <ion-label>{{ $t("object.spanLength") }}*</ion-label>
      <ion-input
        @ionChange="setObjectParam('spanLength', $event.target.value)"
        type="number"
        step="any"
        :value="objectParams.spanLength"
        class="ion-text-right"
        required
      ></ion-input>
    </ion-item>
    <ion-item v-if="errorSuperstructure" color="danger">
      <ion-label>{{ $t("pleaseChooseOption") }}</ion-label>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.superstructures.name") }}*</ion-label>
      <ion-select
        :value="objectParams.superstructure"
        @ionChange="setObjectParam('superstructure', $event.target.value)"
        :placeholder="$t('pleasechoose')"
        interface="popover"
      >
        <ion-select-option
          v-for="(type, key) in objectOptions.superstructures.data"
          :key="key"
          :value="key"
          >{{ $t("object.superstructures.data." + key) }}</ion-select-option
        >
      </ion-select>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.trafficRoutes") }}</ion-label>
      <ion-input
        @ionChange="setObjectParam('trafficRoutes', $event.target.value)"
        type="number"
        :value="objectParams.trafficRoutes"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.shortDescription") }}*</ion-label>
      <ion-textarea
        @ionChange="setObjectParam('shortDescription', $event.target.value)"
        :value="objectParams.shortDescription"
        class="ion-text-right"
        required
      ></ion-textarea>
    </ion-item>
    <ion-row class="ion-float-right ion-align-items-center">
      <ion-spinner v-if="isLoading" color="primary"></ion-spinner>
      <ion-button type="submit" class="ion-margin-start">{{
        $t("objectDocuments")
      }}</ion-button>
    </ion-row>
  </form>
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
  IonSpinner,
} from "@ionic/vue";
import { computed, defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { Plugins } from "@capacitor/core";
import { locate } from "ionicons/icons";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "NewObjectData",
  components: {
    IonRow,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
    IonLabel,
    IonIcon,
    IonTextarea,
    IonSpinner,
  },
  emits: ["next"],
  setup(props, { emit }) {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();
    const messages = i18n.messages.value.de;

    // define router
    const router = useRouter();

    // get current route name
    const routeName = router.currentRoute.value.name;

    //define geolocation plugin
    const { Geolocation } = Plugins;

    // define object options
    const objectOptions = messages.object;
    // define object params from store
    const objectParams = computed(function () {
      if (routeName === "NewObject") {
        return store.state.objectParams.newParams;
      } else if (routeName === "EditObject") {
        return store.state.objectParams.editParams;
      }
    });
    // define object params setter
    const setObjectParam = function (key, value) {
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

    // define geolocation method
    const getLocation = function () {
      Geolocation.getCurrentPosition()
        .then((position) => {
          setObjectParam("coords", position.coords);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    // define coords getter
    const newObjectCoords = computed(function () {
      if (routeName === "NewObject") {
        return store.getters["objectParams/getNewParamsCoords"];
      } else if (routeName === "EditObject") {
        return store.getters["objectParams/getEditParamsCoords"];
      }
    });

    // missing fields errors
    const errorID = ref(false);
    const errorMaterial = ref(false);
    const errorType = ref(false);
    const errorSystem = ref(false);
    const errorCrossSectionShape = ref(false);
    const errorSuperstructure = ref(false);

    // define next function
    const next = async function () {
      store.commit("objectParams/setIsLoading", true);
      if (routeName === "NewObject") {
        const objectExists = await store.dispatch("objectParams/exists");
        errorID.value = objectExists;
        errorMaterial.value = objectParams.value.material == null;
        errorType.value = objectParams.value.type == null;
        errorSystem.value = objectParams.value.system == null;
        errorCrossSectionShape.value = objectParams.value.crossSectionShape == null;
        errorSuperstructure.value = objectParams.value.superstructure == null;

        if (!errorID.value && !errorMaterial.value && !errorType.value && !errorSystem.value && !errorSuperstructure.value && !errorCrossSectionShape.value) {
          emit("next");
        }
      } else {
        errorID.value = false;
        emit("next");
      }
      store.commit("objectParams/setIsLoading", false);
    };

    return {
      locate,
      objectOptions,
      objectParams,
      setObjectParam,
      getLocation,
      newObjectCoords,
      isLoading,
      routeName,
      next,
      errorID,
      errorMaterial,
      errorType,
      errorSystem,
      errorCrossSectionShape,
      errorSuperstructure
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>