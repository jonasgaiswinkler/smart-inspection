<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button
            default-href="/home"
            :aria-label="$t('back')"
            :title="$t('back')"
          >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-back-button>
        </ion-buttons>
        <ion-title>{{ $t("settings") }}</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
        <nav-popover></nav-popover>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid class="height-100">
        <ion-row color="primary" class="ion-justify-content-center height-100">
          <ion-col size-md="12" size-lg="6" size-xs="12">
            <h2>{{ $t("settings") }}</h2>
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
  IonButtons,
  IonBackButton,
  IonIcon,
  IonSpinner,
  toastController,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
} from "@ionic/vue";
import { computed, defineComponent } from "vue";
import store from "@/store";
import { arrowBack } from "ionicons/icons";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

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
    IonBackButton,
    IonIcon,
    IonSpinner,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
    "font-awesome-icon": FontAwesomeIcon,
  },
  setup() {
    // Define router
    const router = useRouter();

    // define i18n
    const i18n = useI18n();

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

    // logout function
    const logout = async () => {
      await store.dispatch("logout");
      router.replace({ name: "Login" });
    };

    return { logout, arrowBack, name, setName, updateName, faSave };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>
