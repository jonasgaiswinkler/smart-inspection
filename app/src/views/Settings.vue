<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button
            @click="$router.push({ name: 'Home' })"
            :aria-label="$t('back')"
            :title="$t('back')"
          >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t("settings") }}</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid class="height-100">
        <ion-row color="primary" class="ion-justify-content-center height-100">
          <ion-col size-md="6" size-lg="6" size-xs="12">
            <ion-button
              @click="logout"
              expand="block"
              :aria-label="$t('logout')"
              :title="$t('logout')"
              >{{ $t("logout") }}</ion-button
            >
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
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
  IonButton,
  IonButtons,
  IonIcon,
  IonSpinner
} from "@ionic/vue";
import { defineComponent } from "vue";
import store from "@/store";
import { arrowBack } from "ionicons/icons";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Settings",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRow,
    IonGrid,
    IonCol,
    IonButton,
    IonButtons,
    IonIcon,
    IonSpinner
  },
  setup() {
    // Define router
    const router = useRouter();

    // logout function
    const logout = async () => {
      await store.dispatch("logout");
      router.replace({ name: "Login" });
    };

    return { logout, arrowBack };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>
