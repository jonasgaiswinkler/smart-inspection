<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button
            @click="back"
            :aria-label="$t('back')"
            :title="$t('back')"
          >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{
          $route.name === "NewDamage" ? $t("newDamage") : $t("editDamage")
        }}</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
        <nav-popover></nav-popover>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid style="height: 100%;">
        <ion-row
          color="primary"
          style="height: 100%;"
          class="ion-justify-content-center"
        >
          <ion-col size-md="12" size-lg="9" size-xs="12">
            <damage-data
              v-if="
                selectedSegment === 'damageData' && routeName != 'UpdateDamage'
              "
              :nextPage="getNavigation('damageData').next"
              @saveedit="saveDamage"
              @next="selectedSegment = getNavigation('damageData').next"
            ></damage-data>
            <damage-location
              v-if="
                selectedSegment == 'damageGroundPlan' &&
                  object.groundPlan != null
              "
              @next="selectedSegment = getNavigation('damageGroundPlan').next"
              @back="
                selectedSegment = getNavigation('damageGroundPlan').previous
              "
              :nextPage="getNavigation('damageGroundPlan').next"
              :previousPage="getNavigation('damageGroundPlan').previous"
              name="damageGroundPlan"
              objectParam="groundPlan"
              damageParam="locationGroundPlan"
              saveParam="imageGroundPlan"
              @saveedit="saveDamage"
            ></damage-location>
            <damage-location
              v-if="
                selectedSegment == 'damageLongitudinalSection' &&
                  object.longitudinalSection != null
              "
              @next="
                selectedSegment = getNavigation('damageLongitudinalSection')
                  .next
              "
              @back="
                selectedSegment = getNavigation('damageLongitudinalSection')
                  .previous
              "
              :nextPage="getNavigation('damageLongitudinalSection').next"
              :previousPage="
                getNavigation('damageLongitudinalSection').previous
              "
              name="damageLongitudinalSection"
              objectParam="longitudinalSection"
              damageParam="locationLongitudinalSection"
              saveParam="imageLongitudinalSection"
              @saveedit="saveDamage"
            ></damage-location>
            <damage-location
              v-if="
                selectedSegment == 'damageCrossSection' &&
                  object.groundPlan != null
              "
              @next="selectedSegment = getNavigation('damageCrossSection').next"
              @back="
                selectedSegment = getNavigation('damageCrossSection').previous
              "
              :nextPage="getNavigation('damageCrossSection').next"
              :previousPage="getNavigation('damageCrossSection').previous"
              name="damageCrossSection"
              objectParam="crossSection"
              damageParam="locationCrossSection"
              saveParam="imageCrossSection"
              @saveedit="saveDamage"
            ></damage-location>
            <damage-model
              v-if="selectedSegment == 'damageModel' && object.model != null"
              @next="selectedSegment = getNavigation('damageModel').next"
              @back="selectedSegment = getNavigation('damageModel').previous"
              :nextPage="getNavigation('damageModel').next"
              :previousPage="getNavigation('damageModel').previous"
              name="damageModel"
              objectParam="model"
              damageParam="locationModel"
              saveParam="imageModel"
              @saveedit="saveDamage"
            ></damage-model>
            <damage-state
              v-if="
                (selectedSegment === 'damageState' &&
                  routeName != 'EditDamage') ||
                  routeName == 'UpdateDamage'
              "
              @save="saveDamage"
              @back="selectedSegment = getNavigation('damageState').previous"
              :previousPage="getNavigation('damageState').previous"
            ></damage-state>
          </ion-col>
        </ion-row>
      </ion-grid>
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
  IonIcon,
  IonBackButton,
  IonButtons,
  IonTextarea,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Plugins } from "@capacitor/core";
import { arrowBack } from "ionicons/icons";
import DamageData from "@/components/DamageData.vue";
import DamageLocation from "@/components/DamageLocation.vue";
import DamageState from "@/components/DamageState.vue";
import DamageModel from "@/components/DamageModel.vue";
import NavPopover from "@/components/NavPopover";

export default defineComponent({
  name: "DamageForm",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRow,
    IonGrid,
    IonCol,
    //IonItem,
    //IonSelect,
    //IonSelectOption,
    //IonInput,
    IonButton,
    IonIcon,
    //IonBackButton,
    IonButtons,
    IonSpinner,
    //IonTextarea
    "damage-data": DamageData,
    "damage-location": DamageLocation,
    "damage-state": DamageState,
    "damage-model": DamageModel,
    "nav-popover": NavPopover,
  },
  setup() {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();

    // define router
    const router = useRouter();

    // get current route name
    const routeName = router.currentRoute.value.name;

    const object = computed(() => store.state.object.data);

    const selectedSegment = ref("damageData");

    const getNavigation = function(segment) {
      if (object.value != null) {
        let segmentNumber;
        if (segment === "damageData") {
          segmentNumber = 1;
        } else if (segment === "damageGroundPlan") {
          segmentNumber = 2;
        } else if (segment === "damageLongitudinalSection") {
          segmentNumber = 3;
        } else if (segment === "damageCrossSection") {
          segmentNumber = 4;
        } else if (segment === "damageModel") {
          segmentNumber = 5;
        } else if (segment === "damageState") {
          segmentNumber = 6;
        }

        const result = {};
        if (object.value.groundPlan != null && segmentNumber <= 1) {
          result.next = "damageGroundPlan";
        } else if (
          object.value.longitudinalSection != null &&
          segmentNumber <= 2
        ) {
          result.next = "damageLongitudinalSection";
        } else if (object.value.crossSection != null && segmentNumber <= 3) {
          result.next = "damageCrossSection";
        } else if (object.value.model != null && segmentNumber <= 4) {
          result.next = "damageModel";
        } else {
          result.next = "damageState";
        }

        if (object.value.model != null && segmentNumber >= 6) {
          result.previous = "damageModel";
        } else if (object.value.crossSection != null && segmentNumber >= 5) {
          result.previous = "damageCrossSection";
        } else if (
          object.value.longitudinalSection != null &&
          segmentNumber >= 4
        ) {
          result.previous = "damageLongitudinalSection";
        } else if (object.value.groundPlan != null && segmentNumber >= 3) {
          result.previous = "damageGroundPlan";
        } else {
          result.previous = "damageData";
        }

        return result;
      }
    };

    const back = function() {
      router.push({
        name: routeName === "NewDamage" ? "Inspection" : "Damage",
      });
      selectedSegment.value = "damageData";
    };

    // save new damage function
    const saveDamage = async function() {
      store.commit("damageParams/setIsLoading", true);
      try {
        let result = null;
        if (routeName === "NewDamage") {
          result = await store.dispatch("damageParams/saveNew");
        } else if (routeName === "EditDamage") {
          result = await store.dispatch("damageParams/saveEdit");
        } else if (routeName === "UpdateDamage") {
          result = await store.dispatch("damageParams/saveUpdate");
        }

        const toast = await toastController.create({
          message: i18n.t("damageSaved"),
          duration: 2000,
          color: "success",
        });
        toast.present();
        selectedSegment.value = "damageData";
        router.push({ name: "Damage", params: { did: result.did } });
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
      store.commit("damageParams/setIsLoading", false);
    };

    return {
      selectedSegment,
      arrowBack,
      back,
      saveDamage,
      routeName,
      getNavigation,
      object,
    };
  },
});
</script>

<style></style>
