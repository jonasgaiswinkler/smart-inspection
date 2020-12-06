<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Smart Inspection</ion-title>
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
                :size-lg="i > 1 || isAdmin ? 4 : 6"
                :size-md="i > 1 || isAdmin ? 4 : 6"
                :size-xs="i > 0 || isAdmin ? 6 : 12"
              >
                <div class="tile height-100">
                  <ion-button
                    @click="push(button.route)"
                    class="flex-grow-1 width-100"
                    fill="outline"
                    expand="block"
                    :aria-label="$t(button.name)"
                    :title="$t(button.name)"
                  >
                    <font-awesome-layers class="button-icon">
                      <font-awesome-icon :icon="button.icon" />
                      <font-awesome-icon
                        v-if="button.iconSecondary !== undefined"
                        :icon="faSquare"
                        style="color: white"
                        transform="down-5 right-5 shrink-8"
                      />
                      <font-awesome-icon
                        v-if="button.iconSecondary !== undefined"
                        :icon="button.iconSecondary"
                        transform="down-5 right-3 shrink-20 rotate-180"
                        fixed-width
                      />
                    </font-awesome-layers>
                  </ion-button>
                  <div class="ion-hide-sm-down text-overflow">
                    <h1>{{ $t(button.name) }}</h1>
                  </div>
                  <div class="ion-hide-sm-up text-overflow">
                    {{ $t(button.name) }}
                  </div>
                </div>
              </ion-col>
              <ion-col
                v-if="isAdmin"
                size-lg="4"
                size-md="4"
                size-xs="6"
                key="requestDeletion"
              >
                <div class="tile height-100">
                  <ion-button
                    @click="push('ObjectDeletion')"
                    class="flex-grow-1 width-100"
                    fill="outline"
                    expand="block"
                    :disabled="requestedObjectsAmount == null"
                    :aria-label="$t('requestedDeletions')"
                    :title="$t('requestedDeletions')"
                  >
                    <font-awesome-layers class="button-icon">
                      <font-awesome-icon :icon="faTrash" />
                      <font-awesome-layers-text
                        :key="requestedObjectsAmount"
                        v-if="requestedObjectsAmount != null"
                        counter
                        :value="requestedObjectsAmount"
                        position="top-right"
                      />
                    </font-awesome-layers>
                  </ion-button>
                  <div class="ion-hide-sm-down text-overflow">
                    <h1>{{ $t("requestedDeletions") }}</h1>
                  </div>
                  <div class="ion-hide-sm-up text-overflow">
                    {{ $t("requestedDeletions") }}
                  </div>
                </div>
              </ion-col>
            </ion-row>
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
  IonButton,
} from "@ionic/vue";
import { computed, defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from "@fortawesome/vue-fontawesome";
import {
  faPlus,
  faList,
  faCog,
  faUser,
  faArchway,
  faSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faWpforms } from "@fortawesome/free-brands-svg-icons";
import { useStore } from "vuex";

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
    "font-awesome-layers": FontAwesomeLayers,
    "font-awesome-layers-text": FontAwesomeLayersText,
  },
  setup() {
    // Define store
    const store = useStore();

    // Define router
    const router = useRouter();

    // Array of buttons
    const buttons = reactive([
      {
        name: "objectList",
        icon: faList,
        iconSecondary: faArchway,
        route: "ObjectList",
      },
      {
        name: "newObject",
        icon: faPlus,
        route: "NewObject",
      },
      {
        name: "inspectionList",
        icon: faList,
        iconSecondary: faWpforms,
        route: "InspectionListGlobal",
      },
      {
        name: "profile",
        icon: faUser,
      },
      {
        name: "settings",
        icon: faCog,
        route: "Settings",
      },
    ]);

    const isAdmin = computed(() => store.state.userRole === "admin");
    const requestedObjectsAmount = computed(() => {
      const requestedObjects = store.state.object.requestedObjects;
      return requestedObjects != null ? requestedObjects.length : null;
    });

    // push function
    const push = (route) => {
      router.push({ name: route });
    };

    return {
      buttons,
      push,
      faSquare,
      isAdmin,
      faTrash,
      requestedObjectsAmount,
    };
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

.width-auto {
  width: auto;
}

.button-icon {
  font-size: 14vh;
}

.text-overflow {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
