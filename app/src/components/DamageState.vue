<template>
  <form class="height-100" id="damagedata" @submit.stop.prevent="next">
    <h2>{{ $t("damageState") }}</h2>
    <file-input
      :disabled="isLoading"
      :label="$t('damage.photo')"
      :value="damageParams.photo"
      accept="image/png, image/jpeg"
      @select="setDamageParam('photo', $event)"
    ></file-input>
    <measurement-input
      :disabled="isLoading"
      :label="$t('damage.measurement1') + '*'"
      :labelSm="$t('damage.measurement1Sm') + '*'"
      :value="damageParams.measurement1"
      :showName="true"
      :required="true"
      @input="setDamageParam('measurement1', $event)"
    ></measurement-input>
    <measurement-input
      :disabled="isLoading"
      :label="$t('damage.limit', { msg: $t('damage.measurement1Sm') }) + '*'"
      :labelSm="$t('damage.limitSm') + '*'"
      :value="damageParams.limit"
      :showName="false"
      :required="true"
      @input="setDamageParam('limit', $event)"
    ></measurement-input>
    <measurement-input
      :disabled="isLoading"
      :label="$t('damage.measurement2')"
      :labelSm="$t('damage.measurement2Sm')"
      :value="damageParams.measurement2"
      :showName="true"
      :required="false"
      @input="setDamageParam('measurement2', $event)"
    ></measurement-input>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("damage.impact") }}</ion-label>
      <ion-input
        @ionInput="setDamageParam('impact', $event.target.value)"
        :value="damageParams.impact"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("damage.categories.name") }}*</ion-label>
      <ion-select
        :value="damageParams.category"
        @ionChange="setDamageParam('category', $event.target.value)"
        :placeholder="$t('pleasechoose')"
        interface="popover"
        aria-required="required"
      >
        <ion-select-option
          v-for="(category, key) in damageOptions.categories.data"
          :key="key"
          :value="key"
          >{{ $t("damage.categories.data." + key) }}</ion-select-option
        >
      </ion-select>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("damage.action") }}</ion-label>
      <ion-input
        @ionInput="setDamageParam('action', $event.target.value)"
        :value="damageParams.action"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("damage.period") }}</ion-label>
      <ion-input
        @ionInput="setDamageParam('period', $event.target.value)"
        :value="damageParams.period"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("damage.additionalInfo") }}*</ion-label>
      <ion-textarea
        @ionInput="setDamageParam('additionalInfo', $event.target.value)"
        :value="damageParams.additionalInfo"
        class="ion-text-right"
        required
      ></ion-textarea>
    </ion-item>
    <ion-row class="ion-align-items-center">
      <ion-button
        v-if="$route.name == 'NewDamage'"
        @click="$emit('back')"
        fill="clear"
        :aria-label="$t('damageData')"
        :title="$t('damageData')"
        >{{ $t("damageData") }}</ion-button
      >
      <div style="flex: 1"></div>
      <ion-spinner v-if="isLoading" color="primary"></ion-spinner>
      <ion-button
        :disabled="isLoading"
        @click="$emit('save')"
        class="ion-margin-start"
        :aria-label="$t('save')"
        :title="$t('save')"
        >{{ $t("save") }}</ion-button
      >
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
  IonNote,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { Plugins } from "@capacitor/core";
import { locate } from "ionicons/icons";
import { useRouter } from "vue-router";
import FileInput from "@/components/FileInput";
import MeasurementInput from "@/components/MeasurementInput";

export default defineComponent({
  name: "DamageState",
  components: {
    IonRow,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
    IonLabel,
    // IonIcon,
    IonTextarea,
    IonSpinner,
    //IonNote,
    "file-input": FileInput,
    "measurement-input": MeasurementInput,
  },
  emits: ["back", "save"],
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

    // define object options
    const damageOptions = messages.damage;

    // get loading status from store
    const isLoading = computed(() => store.state.damageParams.isLoading);

    // define damage params from store
    const damageParams = computed(function() {
      if (routeName === "NewDamage") {
        return store.state.damageParams.newParams;
      } else if (routeName === "UpdateDamage") {
        return store.state.damageParams.updateParams;
      }
    });

    // define damage params setter
    const setDamageParam = function(key, value) {
      let commitPath = "";
      if (routeName === "NewDamage") {
        commitPath = "damageParams/setNewParam";
      } else if (routeName === "UpdateDamage") {
        commitPath = "damageParams/setUpdateParam";
      }
      store.commit(commitPath, {
        key: key,
        value: value != "" ? value : null,
      });
    };

    return {
      locate,
      routeName,
      damageParams,
      setDamageParam,
      damageOptions,
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
