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
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid style="height: 100%;">
        <ion-row
          color="primary"
          style="height: 100%;"
          class="ion-justify-content-center"
        >
          <ion-col size-md="6" size-lg="6" size-xs="12">
            <damage-data
              v-if="
                (selectedSegment === 'damageData' &&
                  routeName != 'UpdateDamage') ||
                  routeName == 'EditDamage'
              "
              @next="selectedSegment = 'damageState'"
              @saveedit="saveDamage"
            ></damage-data>
            <damage-state
              v-if="
                (selectedSegment === 'damageState' &&
                  routeName != 'EditDamage') ||
                  routeName == 'UpdateDamage'
              "
              @save="saveDamage"
              @back="selectedSegment = 'damageData'"
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
import DamageState from "@/components/DamageState.vue";

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
    //IonSpinner,
    //IonTextarea
    "damage-data": DamageData,
    "damage-state": DamageState,
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

    const selectedSegment = ref("damageData");

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
    };
  },
});
</script>

<style></style>
