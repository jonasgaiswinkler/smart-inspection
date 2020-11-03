<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/object-list"></ion-back-button>
        </ion-buttons>
        <ion-title>smart inspection – {{ $t("bridgeObject") }}</ion-title>
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
              <ion-row class="height-100">
                <ion-col size="8"></ion-col>
                <ion-col size="4" class="flex-column"
                  ><div
                    class="tile flex-grow-1"
                    v-for="button in buttons"
                    :key="button.name"
                  >
                    <ion-button
                      @click="push(button.route)"
                      class="flex-grow-1 width-100"
                      fill="outline"
                      expand="block"
                      :disabled="isDeleting"
                    >
                      <font-awesome-icon
                        class="button-icon"
                        :icon="button.icon"
                      ></font-awesome-icon>
                    </ion-button>
                    <h1 v-html="$t(button.name)"></h1>
                  </div>
                  <div
                    v-if="$store.state.userRole === 'admin'"
                    class="tile flex-grow-1"
                  >
                    <ion-button
                      @click="deleteObject"
                      class="flex-grow-1 width-100"
                      fill="outline"
                      expand="block"
                      :disabled="isDeleting"
                    >
                      <font-awesome-icon
                        v-if="!isDeleting"
                        class="button-icon"
                        :icon="faTrash"
                      ></font-awesome-icon>
                      <ion-spinner v-if="isDeleting"></ion-spinner>
                    </ion-button>
                    <h1 v-html="$t('deleteObject')"></h1>
                  </div>
                </ion-col>
              </ion-row>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
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
  IonLabel,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonTextarea,
  IonSpinner,
  alertController,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Plugins } from "@capacitor/core";
import { add, document } from "ionicons/icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faTrafficLight,
  faPlus,
  faFile,
  faTools,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default defineComponent({
  name: "NewObjectData",
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
    //IonLabel,
    //IonIcon,
    IonBackButton,
    IonButtons,
    IonSpinner,
    //IonSpinner,
    //IonTextarea,
    "font-awesome-icon": FontAwesomeIcon,
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
        name: "newInspection",
        icon: faPlus,
      },
      {
        name: "generateReport",
        icon: faFile,
      },
      {
        name: "objectAssessment",
        icon: faTrafficLight,
      },
      {
        name: "editObject",
        icon: faTools,
        route: "EditObject",
      },
    ]);

    // define is deleting
    const isDeleting = ref(false);

    // push function
    const push = (route) => {
      router.push({ name: route });
    };

    // delete function
    const deleteObject = async function () {
      const alert = await alertController.create({
        header: i18n.t("deleteObject"),
        message: i18n.t("confirmDelete"),
        buttons: [
          {
            text: i18n.t("cancel"),
            role: "cancel",
          },
          {
            text: i18n.t("delete"),
            handler: () => {
              isDeleting.value = true;
              store.dispatch("object/delete").then(async (result) => {
                isDeleting.value = false;
                if (result.data.status === 200) {
                  const toast = await toastController.create({
                    message: i18n.t("objectDeleted"),
                    duration: 2000,
                    color: "success",
                  });
                  toast.present();
                  router.push({ name: "Home" });
                } else {
                  console.error(result);
                  const toast = await toastController.create({
                    message: "Error",
                    duration: 2000,
                    color: "danger",
                  });
                  toast.present();
                }
              });
            },
          },
        ],
      });
      return alert.present();
    };

    return {
      buttons,
      push,
      faTrafficLight,
      faTrash,
      deleteObject,
      isDeleting,
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

.flex-column {
  display: flex;
  flex-direction: column;
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