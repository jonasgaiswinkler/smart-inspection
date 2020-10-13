<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>smart inspection</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
        Home
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
  IonToolbar
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  },
  setup() {
    //
  },
});
</script>

<style scoped>

</style>