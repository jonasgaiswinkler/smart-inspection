<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-title>smart inspection – {{ $t("settings") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid class="height-100">
        <ion-row color="primary" class="ion-justify-content-center height-100">
          <ion-col size-md="6" size-lg="6" size-xs="12">
            <ion-button @click="logout" expand="block">{{ $t("logout") }}</ion-button>
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
} from "@ionic/vue";
import { defineComponent } from "vue";
import store from '@/store';
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
  },
  setup() {
    // Define router
    const router = useRouter();

    // logout function
    const logout = async () => {
      await store.dispatch('logout');
      router.replace({ name: "Login" });
    };

    return { logout };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>