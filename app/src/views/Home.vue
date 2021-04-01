<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Smart Inspection</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
        <nav-popover></nav-popover>
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
                :size-lg="isAdmin ? (i > 1 ? 4 : 6) : 4"
                :size-md="isAdmin ? (i > 1 ? 4 : 6) : 4"
                :size-xs="isAdmin ? 6 : 12"
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
                    <font-awesome-icon
                      class="button-icon"
                      :icon="button.icon"
                    />
                  </ion-button>
                  <div class="ion-hide-sm-down text-overflow">
                    <h1 class="text-height">{{ $t(button.name) }}</h1>
                  </div>
                  <div class="ion-hide-sm-up text-overflow text-height">
                    {{ $t(button.name) }}
                  </div>
                </div>
              </ion-col>
              <ion-col
                v-if="isAdmin"
                :size-lg="isAdmin ? 4 : 4"
                :size-md="isAdmin ? 4 : 4"
                :size-xs="isAdmin ? 6 : 12"
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
                    <h1 class="text-height">{{ $t("requestedDeletions") }}</h1>
                  </div>
                  <div class="ion-hide-sm-up text-overflow text-height">
                    {{ $t("requestedDeletions") }}
                  </div>
                </div>
              </ion-col>
              <ion-col
                v-if="isAdmin"
                :size-lg="isAdmin ? 4 : 4"
                :size-md="isAdmin ? 4 : 4"
                :size-xs="isAdmin ? 6 : 12"
                key="users"
              >
                <div class="tile height-100">
                  <ion-button
                    @click="push('Users')"
                    class="flex-grow-1 width-100"
                    fill="outline"
                    expand="block"
                    :aria-label="$t('users')"
                    :title="$t('users')"
                  >
                    <font-awesome-icon :icon="faUser" class="button-icon" />
                  </ion-button>
                  <div class="ion-hide-sm-down text-overflow">
                    <h1 class="text-height">{{ $t("users") }}</h1>
                  </div>
                  <div class="ion-hide-sm-up text-overflow text-height">
                    {{ $t("users") }}
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
  IonSpinner,
} from "@ionic/vue";
import { computed, defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from "@fortawesome/vue-fontawesome";
import {
  faPlus,
  faTimes,
  faSquare,
  faTrash,
  faSave,
  faCog,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useStore } from "vuex";
import { faObjectList, faInspectionList } from "@/icons";
import NavPopover from "@/components/NavPopover";

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
    IonSpinner,
    "font-awesome-icon": FontAwesomeIcon,
    "font-awesome-layers": FontAwesomeLayers,
    "font-awesome-layers-text": FontAwesomeLayersText,
    "nav-popover": NavPopover,
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
        icon: faObjectList,
        route: "ObjectList",
      },
      {
        name: "inspectionList",
        icon: faInspectionList,
        route: "InspectionListGlobal",
      },
      {
        name: "newObject",
        icon: faPlus,
        route: "NewObject",
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
      faTimes,
      faSave,
      faCog,
      faUser,
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

.text-height {
  line-height: 1.5em;
  height: 3em;
}

.text-overflow {
  width: 100%;
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
}
</style>
