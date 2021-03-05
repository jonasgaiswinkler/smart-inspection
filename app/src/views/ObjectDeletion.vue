<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button
            @click="$router.push({ name: 'Home' })"
            :aria-label="$t('back')"
            :title="$t('back')"
          >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t("requestedDeletions") }}</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form
        class="height-100"
        id="object-deletion"
        @submit.stop.prevent="submit"
      >
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col size-md="12" size-lg="6" size-xs="12">
              <ion-progress-bar
                v-if="isLoading"
                type="indeterminate"
              ></ion-progress-bar>
              <ion-list>
                <ion-list-header>
                  <div style="float: left; width: 100px">
                    <ion-label>{{ $t("object.id") }}</ion-label>
                  </div>
                  <div style="float: left;">
                    <ion-label> km </ion-label>
                  </div>
                  <!--<div style="float: left; width: 60%">
                    <ion-label>
                      {{ $t("object.shortDescription") }}
                    </ion-label>
                  </div>-->
                </ion-list-header>
                <ion-item v-for="doc in requestedObjects" :key="doc.id">
                  <div style="float: left; width: 100px">
                    <ion-label>{{ doc.id }}</ion-label>
                  </div>
                  <div style="float: left;">
                    <ion-label>
                      {{ doc.chainage }}
                    </ion-label>
                  </div>
                  <!--<div style="float: left; width: 60%">
                    <ion-label>
                      {{ doc.shortDescription }}
                    </ion-label>
                  </div>-->
                  <ion-button
                    @click="restoreObject(doc.id)"
                    fill="clear"
                    slot="end"
                    :title="$t('restoreObject')"
                    :aria-label="$t('restoreObject')"
                  >
                    <font-awesome-icon
                      slot="icon-only"
                      :icon="faRedo"
                    ></font-awesome-icon>
                  </ion-button>
                  <ion-button
                    @click="deleteObject(doc.id)"
                    fill="clear"
                    slot="end"
                    style="margin-left: 0.25em"
                    :title="$t('deleteObject')"
                    :aria-label="$t('deleteObject')"
                  >
                    <font-awesome-icon
                      slot="icon-only"
                      :icon="faTrash"
                    ></font-awesome-icon>
                  </ion-button>
                </ion-item>
              </ion-list>
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
  IonList,
  IonListHeader,
  IonProgressBar,
  IonSearchbar,
  IonTextarea,
  IonSpinner,
  toastController,
  alertController,
} from "@ionic/vue";
import { computed, defineComponent, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { Plugins } from "@capacitor/core";
import { arrowBack } from "ionicons/icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTrash, faRedo } from "@fortawesome/free-solid-svg-icons";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ObjectDeletion",
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
    //IonSelect,
    //IonSelectOption,
    //IonInput,
    IonButton,
    IonLabel,
    IonList,
    IonListHeader,
    IonIcon,
    IonProgressBar,
    //IonBackButton,
    IonButtons,
    IonSpinner,
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

    const requestedObjects = computed(
      () => store.state.object.requestedObjects
    );

    watch(requestedObjects, (value) => {
      if (value == null) {
        router.push({ name: "Home" });
      }
    });

    // define isLoading
    const isLoading = ref(false);

    // request deletion function
    const deleteObject = async function(oid) {
      const alert = await alertController.create({
        header: i18n.t("deleteObject"),
        message: i18n.t("confirmDeleteObject", { oid: oid }),
        buttons: [
          {
            text: i18n.t("cancel"),
            role: "cancel",
          },
          {
            text: i18n.t("confirm"),
            handler: async () => {
              isLoading.value = true;
              try {
                await store.dispatch("object/deleteObject", oid);

                const toast = await toastController.create({
                  message: i18n.t("objectDeleted"),
                  duration: 2000,
                  color: "success",
                });
                toast.present();
                router.push({ name: "Home" });
              } catch (error) {
                console.error(error);
                const toast = await toastController.create({
                  message: error,
                  duration: 2000,
                  color: "danger",
                });
                toast.present();
              }
              isLoading.value = false;
            },
          },
        ],
      });
      return alert.present();
    };

    // restore object function
    const restoreObject = async function(oid) {
      isLoading.value = true;
      try {
        await store.dispatch("object/restoreObject", oid);
        const toast = await toastController.create({
          message: i18n.t("objectRestored"),
          duration: 2000,
          color: "success",
        });
        toast.present();
      } catch (error) {
        console.error(error);
        const toast = await toastController.create({
          message: error,
          duration: 2000,
          color: "danger",
        });
        toast.present();
      }
      isLoading.value = false;
    };

    return {
      arrowBack,
      requestedObjects,
      faTrash,
      faRedo,
      deleteObject,
      isLoading,
      restoreObject,
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>
