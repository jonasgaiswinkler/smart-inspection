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
        <ion-button
          fill="clear"
          :aria-label="$t('settings')"
          :title="$t('settings')"
          @click="showModal = true"
          slot="end"
        >
          <font-awesome-icon
            color="white"
            size="lg"
            slot="icon-only"
            :icon="faCog"
          />
        </ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-modal :is-open="showModal" @onDidDismiss="showModal = false">
        <ion-grid class="width-100 ion-padding">
          <ion-row class="ion-align-items-center">
            <h2>{{ $t("settings") }}</h2>
            <div style="flex: 1"></div>
            <ion-button
              fill="clear"
              :aria-label="$t('close')"
              :title="$t('close')"
              @click="showModal = false"
            >
              <font-awesome-icon size="lg" :icon="faTimes" />
            </ion-button>
          </ion-row>
          <ion-item>
            <ion-label>{{ $t("language") }}</ion-label>
            <ion-select
              :value="$i18n.locale"
              @ionChange="$i18n.locale = $event.target.value"
              interface="popover"
            >
              <ion-select-option
                v-for="locale in $i18n.availableLocales"
                :key="locale"
                :value="locale"
                >{{ locale }}</ion-select-option
              >
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label>{{ $t("displayName") }}</ion-label>
            <ion-input
              :value="name"
              @input="setName($event.target.value)"
            ></ion-input>
            <ion-button
              @click="updateName"
              slot="end"
              fill="clear"
              :aria-label="$t('updateDisplayName')"
              :title="$t('updateDisplayName')"
            >
              <font-awesome-icon slot="icon-only" size="lg" :icon="faSave" />
            </ion-button>
          </ion-item>
          <ion-row>
            <ion-button
              @click="logout"
              expand="block"
              :aria-label="$t('logout')"
              :title="$t('logout')"
              >{{ $t("logout") }}</ion-button
            >
          </ion-row>
        </ion-grid>
      </ion-modal>
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
                v-for="button in buttons"
                :key="button.name"
                :size-lg="isAdmin ? 6 : 4"
                :size-md="isAdmin ? 6 : 12"
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
                :size-lg="isAdmin ? 6 : 4"
                :size-md="isAdmin ? 6 : 12"
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
  IonModal,
  IonLabel,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  toastController,
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
} from "@fortawesome/free-solid-svg-icons";
import { useStore } from "vuex";
import { faObjectList, faInspectionList } from "@/icons";
import { useI18n } from "vue-i18n";

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
    IonModal,
    IonLabel,
    IonInput,
    IonItem,
    IonSelect,
    IonSelectOption,
    "font-awesome-icon": FontAwesomeIcon,
    "font-awesome-layers": FontAwesomeLayers,
    "font-awesome-layers-text": FontAwesomeLayersText,
  },
  setup() {
    // Define store
    const store = useStore();

    // Define router
    const router = useRouter();

    // define i18n
    const i18n = useI18n();

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

    const name = computed(() => store.state.name);
    const setName = (newName) => store.commit("setName", newName);
    const updateName = () => {
      store
        .dispatch("updateName")
        .then(async () => {
          const toast = await toastController.create({
            message: i18n.t("displayNameUpdated"),
            duration: 2000,
            color: "success",
          });
          toast.present();
        })
        .catch(async (error) => {
          console.error(error);
          const toast = await toastController.create({
            message: "Error: " + error,
            duration: 2000,
            color: "danger",
          });
          toast.present();
        });
    };

    const showModal = ref(false);

    // logout function
    const logout = async () => {
      showModal.value = false;
      await store.dispatch("logout");
      router.replace({ name: "Login" });
    };

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
      showModal,
      faTimes,
      logout,
      faSave,
      name,
      setName,
      updateName,
      faCog,
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
