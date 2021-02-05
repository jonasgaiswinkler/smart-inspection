<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button
            @click="
              $router.push({
                name:
                  $route.query.from != undefined ? $route.query.from : 'Object',
              })
            "
            :aria-label="$t('back')"
            :title="$t('back')"
          >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t("reports") }}</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form class="height-100" id="object" @submit.stop.prevent="submit">
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col size-md="6" size-lg="6" size-xs="12" class="height-100">
              <h2 v-if="$route.name === 'ObjectReports'">
                {{ $t("objectReports") }}
              </h2>
              <ion-progress-bar
                v-if="isLoading"
                type="indeterminate"
              ></ion-progress-bar>
              <div>
                <ion-button
                  ><font-awesome-icon
                    :icon="faPlus"
                    style="margin-right: 10px"
                  ></font-awesome-icon
                  >{{ $t("newReport") }}</ion-button
                >
              </div>
              <ion-list>
                <ion-list-header>
                  <ion-label>{{ $t("inspection.date") }}</ion-label>
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
  IonList,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonIcon,
  IonListHeader,
  IonBackButton,
  IonButtons,
  IonTextarea,
  IonSpinner,
  IonProgressBar,
  IonImg,
  alertController,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { arrowBack } from "ionicons/icons";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
} from "@fortawesome/vue-fontawesome";
import {
  faPlus,
  faFile,
  faTools,
  faTrash,
  faList,
  faSquare,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { faWpforms } from "@fortawesome/free-brands-svg-icons";

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
    IonList,
    IonCol,
    IonListHeader,
    //IonImg,
    IonItem,
    //IonSelect,
    //IonSelectOption,
    //IonInput,
    IonButton,
    IonLabel,
    IonIcon,
    //IonBackButton,
    IonButtons,
    IonSpinner,
    IonProgressBar,
    //IonSpinner,
    //IonTextarea,
    "font-awesome-icon": FontAwesomeIcon,
    //"font-awesome-layers": FontAwesomeLayers,
  },
  setup() {
    // Define store
    const store = useStore();

    // Define router
    const router = useRouter();

    // define i18n
    const i18n = useI18n();

    // define oid
    const oid = computed(() => store.state.object.oid);

    return {
      faTrash,
      oid,
      arrowBack,
      faSquare,
      faPlus,
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

.text-overflow {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 576px) {
  .overflow-scroll {
    overflow: scroll;
    height: 100%;
  }
}
</style>
