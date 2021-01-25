<template>
  <form class="height-100" @submit.stop.prevent="submit">
    <div style="display: flex; flex-direction: column; height: 100%">
      <h2>
        {{ $t(name) }}
      </h2>
      <div style="position: relative; flex: 1; height: 0px;">
        <model-viewer
          v-if="object != null && object[objectParam] != null"
          :location="damageParams[damageParam]"
          @placed="setDamageParam(damageParam, $event)"
          :fileName="object[objectParam]"
          :url="object[objectParam + 'Url']"
          ref="modelRef"
        ></model-viewer>
      </div>
      <ion-row class="ion-align-items-center">
        <ion-button
          @click="$emit('back')"
          fill="clear"
          :aria-label="$t(previousPage)"
          :title="$t(previousPage)"
          >{{ $t(previousPage) }}</ion-button
        >
        <div style="flex: 1"></div>
        <ion-spinner v-if="isLoading" color="primary"></ion-spinner>
        <ion-button
          v-if="$route.name == 'NewDamage' || nextPage != 'damageState'"
          :disabled="isLoading"
          type="submit"
          class="ion-margin-start"
          :aria-label="$t(nextPage)"
          :title="$t(nextPage)"
          >{{ $t(nextPage) }}</ion-button
        >
        <ion-button
          v-if="$route.name == 'EditDamage' && nextPage == 'damageState'"
          :disabled="isLoading"
          type="submit"
          class="ion-margin-start"
          :aria-label="$t('save')"
          :title="$t('save')"
          >{{ $t("save") }}</ion-button
        >
      </ion-row>
    </div>
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
  IonNote,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ModelViewer from "@/components/ModelViewer";

export default defineComponent({
  name: "DamageModel",
  components: {
    "model-viewer": ModelViewer,
    IonRow,
    IonSpinner,
    IonButton,
  },
  emits: ["next", "back", "saveedit"],
  props: [
    "nextPage",
    "previousPage",
    "name",
    "objectParam",
    "damageParam",
    "saveParam",
  ],
  setup(props, { emit }) {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();

    // define router
    const router = useRouter();

    const modelRef = ref(null);

    // get current route name
    const routeName = router.currentRoute.value.name;

    // define damage params from store
    const damageParams = computed(function() {
      if (routeName === "NewDamage") {
        return store.state.damageParams.newParams;
      } else if (routeName === "EditDamage") {
        return store.state.damageParams.editParams;
      } else {
        return null;
      }
    });

    // define damage params setter
    const setDamageParam = function(key, value) {
      let commitPath = "";
      if (routeName === "NewDamage") {
        commitPath = "damageParams/setNewParam";
      } else if (routeName === "EditDamage") {
        commitPath = "damageParams/setEditParam";
      }
      store.commit(commitPath, {
        key: key,
        value: value != "" ? value : null,
      });
    };

    const object = computed(() => store.state.object.data);

    // get loading status from store
    const isLoading = computed(() => store.state.damageParams.isLoading);

    const submit = async function() {
      if (modelRef.value != null) {
        store.commit("damageParams/setIsLoading", true);
        setDamageParam(props.saveParam, await modelRef.value.getImage());
        store.commit("damageParams/setIsLoading", false);
      }
      if (routeName == "NewDamage" || props.nextPage != "damageState") {
        emit("next");
      } else if (routeName == "EditDamage" && props.nextPage == "damageState") {
        emit("saveedit");
      }
    };

    return {
      isLoading,
      object,
      submit,
      damageParams,
      setDamageParam,
      modelRef,
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>
