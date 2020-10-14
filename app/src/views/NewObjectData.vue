<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>smart inspection – {{ $t("newObject") }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form class="height-100" id="login" @submit.stop.prevent="submit">
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col size-md="6" size-lg="6" size-xs="12">
              <h1>Objektdaten</h1>
              <ion-item>
                <ion-label>Objekttyp</ion-label>
                <ion-select placeholder="Bitte auswählen" interface="popover">
                  <ion-select-option value="f"
                    >Stahlbetonbrücke</ion-select-option
                  >
                  <ion-select-option value="m">Stahlbrücke</ion-select-option>
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label>Brückenart</ion-label>
                <ion-select placeholder="Bitte auswählen" interface="popover">
                  <ion-select-option value="f"
                    >Eisenbahnbrücke</ion-select-option
                  >
                  <ion-select-option value="m">Straßenbrücke</ion-select-option>
                </ion-select>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
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
  IonItem,
  IonInput,
  IonButton,
  IonLabel,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRow,
    IonGrid,
    IonCol,
    IonItem,
    //IonInput,
    //IonButton,
    IonLabel,
  },
  setup() {
    //
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>