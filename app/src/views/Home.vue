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
                v-for="(button) in buttons"
                :key="button.name"
                size="6"
              >
                <div class="tile height-100">
                  <ion-button
                    @click="push(button.route)"
                    class="flex-grow-1 width-100"
                    fill="outline"
                    expand="block"
                  >
                    <font-awesome-icon
                        class="button-icon"
                        :icon="button.icon"
                      ></font-awesome-icon>
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
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPlus, faList, faCog, faUser } from "@fortawesome/free-solid-svg-icons";

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
    IonButton,
    "font-awesome-icon": FontAwesomeIcon,
  },
  setup() {
    // Define router
    const router = useRouter();

    // Array of buttons
    const buttons = reactive([
      {
        name: "newObject",
        icon: faPlus,
        route: "NewObjectData",
      },
      {
        name: "objectList",
        icon: faList,
        route: "ObjectList"
      },
      {
        name: "settings",
        icon: faCog,
        route: "Settings"
      },
      {
        name: "profile",
        icon: faUser,
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