<template>
  <form class="height-100" id="objectdata" @submit.stop.prevent="next">
    <h2>{{ $t("objectData") }}</h2>
    <ion-item v-if="errorID" color="danger">
      <ion-label>{{ $t("idAssigned") }}</ion-label>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.id") }}*</ion-label>
      <ion-input
        @ionInput="setObjectParam('id', $event.target.value)"
        :value="objectParams.id"
        class="ion-text-right"
        required
        pattern="^(?!\.\.?$)(?!.*__.*__)([^/]{1,1500})$"
        :disabled="routeName === 'EditObject'"
        autocomplete="off"
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
      <ion-label>{{ $t("object.constructionYear") }}</ion-label>
      <ion-input
        @ionInput="setObjectParam('constructionYear', $event.target.value)"
        type="number"
        :value="objectParams.constructionYear"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.routeCode") }}</ion-label>
      <ion-input
        @ionInput="setObjectParam('routeCode', $event.target.value)"
        :value="objectParams.routeCode"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.routeName") }}</ion-label>
      <ion-input
        @ionInput="setObjectParam('routeName', $event.target.value)"
        :value="objectParams.routeName"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.chainage") }}*</ion-label>
      <ion-input
        @ionInput="setObjectParam('chainage', $event.target.value)"
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
        slot="end"
        type="number"
        step="any"
        :value="objectParams.coords.latitude"
        class="ion-text-right"
        :placeholder="$t('latitude')"
        @ionInput="setObjectCoord('latitude', $event.target.value)"
      ></ion-input>
      <ion-input
        slot="end"
        type="number"
        step="any"
        :value="objectParams.coords.longitude"
        class="ion-text-right"
        :placeholder="$t('longitude')"
        @ionInput="setObjectCoord('longitude', $event.target.value)"
      ></ion-input>
      <ion-button
        @click="getLocation"
        slot="end"
        fill="clear"
        :disabled="isLoading"
        :aria-label="$t('localization')"
        :title="$t('localization')"
      >
        <ion-icon slot="icon-only" :icon="locate"></ion-icon>
      </ion-button>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.spanLength") }}</ion-label>
      <ion-input
        @ionInput="setObjectParam('spanLength', $event.target.value)"
        type="number"
        step="any"
        :value="objectParams.spanLength"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.width") }}</ion-label>
      <ion-input
        @ionInput="setObjectParam('width', $event.target.value)"
        type="number"
        step="any"
        :value="objectParams.width"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.trafficRoutes") }}</ion-label>
      <ion-input
        @ionInput="setObjectParam('trafficRoutes', $event.target.value)"
        type="number"
        :value="objectParams.trafficRoutes"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("object.shortDescription") }}</ion-label>
      <ion-textarea
        @ionInput="setObjectParam('shortDescription', $event.target.value)"
        :value="objectParams.shortDescription"
        class="ion-text-right"
      ></ion-textarea>
    </ion-item>
    <ion-row class="ion-float-right ion-align-items-center">
      <ion-spinner v-if="isLoading" color="primary"></ion-spinner>
      <ion-button
        :disabled="isLoading"
        type="submit"
        class="ion-margin-start"
        :aria-label="$t('objectDocuments')"
        :title="$t('objectDocuments')"
        >{{ $t("objectDocuments")
        }}<font-awesome-icon
          :icon="faArrowRight"
          style="margin-left: 10px"
        ></font-awesome-icon
      ></ion-button>
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

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
    "font-awesome-icon": FontAwesomeIcon,
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

    // define geolocation method
    const getLocation = function() {
      Geolocation.getCurrentPosition()
        .then((position) => {
          setObjectParam("coords", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };

    // define coords setter
    const setObjectCoord = function(key, value) {
      let commitPath = "";
      if (routeName === "NewObject") {
        commitPath = "objectParams/setNewParamCoord";
      } else if (routeName === "EditObject") {
        commitPath = "objectParams/setEditParamCoord";
      }

      store.commit(commitPath, {
        key: key,
        value: value != "" ? parseFloat(value) : null,
      });
    };

    // missing fields errors
    const errorID = ref(false);
    const errorMaterial = ref(false);
    const errorType = ref(false);
    const errorSystem = ref(false);
    const errorCrossSectionShape = ref(false);

    // define next function
    const next = async function() {
      store.commit("objectParams/setIsLoading", true);
      if (routeName === "NewObject") {
        const objectExists = await store.dispatch("objectParams/exists");
        errorID.value = objectExists;
      } else {
        errorID.value = false;
      }

      errorMaterial.value = objectParams.value.material == null;
      errorType.value = objectParams.value.type == null;
      errorSystem.value = objectParams.value.system == null;
      errorCrossSectionShape.value =
        objectParams.value.crossSectionShape == null;

      if (
        !errorID.value &&
        !errorMaterial.value &&
        !errorType.value &&
        !errorSystem.value &&
        !errorCrossSectionShape.value
      ) {
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
      isLoading,
      routeName,
      next,
      errorID,
      errorMaterial,
      errorType,
      errorSystem,
      errorCrossSectionShape,
      setObjectCoord,
      faArrowRight,
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>
