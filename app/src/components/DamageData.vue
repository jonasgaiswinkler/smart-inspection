<template>
  <form class="height-100" id="damagedata" @submit.stop.prevent="submit">
    <h2>{{ $t("damageData") }}</h2>
    <ion-item v-if="errorAllocation" color="danger">
      <ion-label>{{ $t("pleaseChooseOption") }}</ion-label>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("damage.allocations.name") }}*</ion-label>
      <ion-select
        :value="damageParams.allocation"
        @ionChange="setDamageParam('allocation', $event.target.value)"
        :placeholder="$t('pleasechoose')"
        interface="popover"
        aria-required="required"
      >
        <ion-select-option
          v-for="(allocation, key) in damageOptions.allocations.data"
          :key="key"
          :value="key"
          >{{
            $t("damage.allocations.data." + key + ".name")
          }}</ion-select-option
        >
      </ion-select>
    </ion-item>
    <template
      v-if="
        damageParams.allocation != null &&
          damageParams.allocation != 'superstructure'
      "
    >
      <ion-item v-if="errorComponent" color="danger">
        <ion-label>{{ $t("pleaseChooseOption") }}</ion-label>
      </ion-item>
      <ion-item :disabled="isLoading">
        <ion-label>{{ $t("damage.component") }}*</ion-label>
        <ion-select
          :value="damageParams.component"
          @ionChange="setDamageParam('component', $event.target.value)"
          :placeholder="$t('pleasechoose')"
          interface="popover"
          aria-required="required"
        >
          <ion-select-option
            v-if="
              damageParams.allocation != null &&
                damageParams.allocation != 'superstructure'
            "
            v-for="(component, key) in damageOptions.allocations.data[
              damageParams.allocation
            ].data"
            :key="key"
            :value="key"
            >{{
              $t(
                "damage.allocations.data." +
                  damageParams.allocation +
                  ".data." +
                  key
              )
            }}</ion-select-option
          >
        </ion-select>
      </ion-item>
    </template>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("damage.componentDetail") }}</ion-label>
      <ion-input
        @ionInput="setDamageParam('componentDetail', $event.target.value)"
        :value="damageParams.componentDetail"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-item v-if="errorType" color="danger">
      <ion-label>{{ $t("pleaseChooseOption") }}</ion-label>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("damage.types.name") }}*</ion-label>
      <ion-select
        :value="damageParams.type"
        @ionChange="setDamageParam('type', $event.target.value)"
        :placeholder="$t('pleasechoose')"
        interface="popover"
        aria-required="required"
      >
        <ion-select-option
          v-for="(type, key) in damageOptions.types.data"
          :key="key"
          :value="key"
          >{{ $t("damage.types.data." + key) }}</ion-select-option
        >
      </ion-select>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("damage.typeDetail") }}</ion-label>
      <ion-input
        @ionInput="setDamageParam('typeDetail', $event.target.value)"
        :value="damageParams.typeDetail"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("damage.location") }}*</ion-label>
      <ion-input
        @ionInput="setDamageParam('location', $event.target.value)"
        :value="damageParams.location"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-note>*{{ $t("locationOnlyNecessary") }}</ion-note>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("damage.cause") }}</ion-label>
      <ion-input
        @ionInput="setDamageParam('cause', $event.target.value)"
        :value="damageParams.cause"
        class="ion-text-right"
      ></ion-input>
    </ion-item>
    <ion-item :disabled="isLoading">
      <ion-label>{{ $t("damage.description") }}</ion-label>
      <ion-textarea
        @ionInput="setDamageParam('description', $event.target.value)"
        :value="damageParams.description"
        class="ion-text-right"
      ></ion-textarea>
    </ion-item>
    <ion-row class="ion-align-items-center">
      <div style="flex: 1"></div>
      <ion-spinner v-if="isLoading" color="primary"></ion-spinner>
      <ion-button
        :disabled="isLoading"
        type="submit"
        class="ion-margin-start"
        :aria-label="$t(nextPage)"
        :title="$t(nextPage)"
        >{{ $t(nextPage) }}</ion-button
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
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { Plugins } from "@capacitor/core";
import { locate } from "ionicons/icons";
import { useRouter } from "vue-router";
import FileInput from "@/components/FileInput";
import MeasurementInput from "@/components/MeasurementInput";

export default defineComponent({
  name: "DamageData",
  props: ["nextPage"],
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
    IonNote,
    //"file-input": FileInput,
    //"measurement-input": MeasurementInput,
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

    // define object options
    const damageOptions = messages.damage;

    // get loading status from store
    const isLoading = computed(() => store.state.damageParams.isLoading);

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

    // missing fields errors
    const errorAllocation = ref(false);
    const errorComponent = ref(false);
    const errorType = ref(false);

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

    watch(
      computed(() => damageParams.value.allocation),
      () => {
        setDamageParam("component", null);
      }
    );

    const submit = function() {
      errorAllocation.value = damageParams.value.allocation == null;
      errorComponent.value =
        damageParams.value.allocation != "superstructure" &&
        damageParams.value.component == null;
      errorType.value = damageParams.value.type == null;

      if (!errorAllocation.value && !errorComponent.value && !errorType.value) {
        emit("next");
      }
    };

    return {
      locate,
      routeName,
      damageParams,
      setDamageParam,
      damageOptions,
      isLoading,
      errorAllocation,
      errorComponent,
      errorType,
      submit,
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>
