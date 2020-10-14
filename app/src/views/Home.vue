<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>smart inspection</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid class="ion-padding height-100">
        <ion-row class="ion-justify-content-center height-100">
          <ion-col
            class="ion-align-self-center height-100"
            size-md="10"
            size-lg="10"
            size-xs="12"
          >
            <ion-row class="height-100">
              <ion-col
                v-for="(button, i) in buttons"
                :key="button.name"
                :size-lg="i > 1 ? 4 : 6"
                :size-md="i > 1 ? 4 : 6"
                size-xs="6"
              >
                <div class="tile height-100">
                  <ion-button
                    @click="push(button.route)"
                    class="flex-grow-1 width-100"
                    fill="outline"
                    expand="block"
                  >
                    <ion-icon
                      class="button-icon"
                      size="large"
                      slot="icon-only"
                      :icon="button.icon"
                    ></ion-icon>
                  </ion-button>
                  <h1>{{ $t(button.name) }}</h1>
                </div>
              </ion-col>
            </ion-row>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
// Imports
import { add, refresh, list, settings, person } from "ionicons/icons";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonGrid,
  IonCol,
  IonIcon,
  IonButton,
} from "@ionic/vue";
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";

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
    IonIcon,
    IonButton,
  },
  setup() {
    // Define router
    const router = useRouter();

    // Array of buttons
    const buttons = reactive([
      {
        name: "newObject",
        icon: add,
        route: "NewObjectData",
      },
      {
        name: "existingObject",
        icon: refresh,
      },
      {
        name: "objectDirectory",
        icon: list,
      },
      {
        name: "settings",
        icon: settings,
      },
      {
        name: "profile",
        icon: person,
      },
    ]);

    // push function
    const push = (route: string) => {
      router.push({ name: route });
    };

    return { buttons, push };
  },
});
</script>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex-grow-1 {
  flex-grow: 1;
}

.height-100 {
  height: 100%;
}

.width-100 {
  width: 100%;
}

.button-icon {
  width: 100% !important;
  height: 65% !important;
}
</style>