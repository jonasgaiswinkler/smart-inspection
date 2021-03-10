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
        <ion-title>{{ $t("inspection.name") }}</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
        <nav-popover></nav-popover>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form class="height-100" id="inspection" @submit.stop.prevent="submit">
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col size-md="12" size-lg="6" size-xs="12" class="height-100">
              <ion-row class="height-100">
                <ion-col
                  size-lg="8"
                  size-md="8"
                  size-xs="12"
                  class="overflow-scroll"
                >
                  <img
                    v-if="inspectionPhotoUrl != null"
                    :src="inspectionPhotoUrl"
                    :alt="$t('inspectionPhoto')"
                    id="inspectionPhoto"
                    @click="showImage('inspectionPhoto')"
                    style="cursor: pointer;"
                  />
                  <template v-if="inspectionData != null">
                    <p v-if="inspectionData.additionalInfo != null">
                      {{ inspectionData.additionalInfo }}
                    </p>
                    <ul>
                      <li v-if="inspectionData.inspectorName != null">
                        {{
                          $t("inspection.inspector") +
                            ": " +
                            inspectionData.inspectorName
                        }}
                      </li>
                      <li v-if="inspectionData.date != null">
                        {{
                          $t("inspection.date") +
                            ": " +
                            new Date(inspectionData.date).toLocaleDateString(
                              "de-DE"
                            )
                        }}
                      </li>
                      <li v-if="inspectionData.type != null">
                        {{
                          $t("inspection.types.name") +
                            ": " +
                            $t("inspection.types.data." + inspectionData.type)
                        }}
                      </li>
                      <li v-if="inspectionData.weather != null">
                        {{
                          $t("inspection.weather.name") +
                            ": " +
                            $t(
                              "inspection.weather.data." +
                                inspectionData.weather
                            )
                        }}
                      </li>
                      <li v-if="inspectionData.temperature != null">
                        {{
                          $t("inspection.temperature") +
                            ": " +
                            inspectionData.temperature
                        }}
                      </li>
                    </ul>
                  </template>
                  <ion-grid v-if="assessment != null">
                    <ion-row>
                      <ion-col size="6">{{
                        $t("assessments.substructure")
                      }}</ion-col>
                      <ion-col
                        size="6"
                        class="ion-text-center"
                        style="border-width: 2px; border-style: solid;"
                        :style="{
                          'border-color': getAssessmentColor(
                            assessment.substructure
                          ),
                        }"
                      >
                        {{ assessment.substructure }}
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col size="6">{{
                        $t("assessments.superstructure")
                      }}</ion-col>
                      <ion-col
                        size="6"
                        class="ion-text-center"
                        style="border-width: 2px; border-style: solid;"
                        :style="{
                          'border-color': getAssessmentColor(
                            assessment.superstructure
                          ),
                        }"
                      >
                        {{ assessment.superstructure }}
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col size="6">{{
                        $t("assessments.equipment")
                      }}</ion-col>
                      <ion-col
                        size="6"
                        class="ion-text-center"
                        style="border-width: 2px; border-style: solid;"
                        :style="{
                          'border-color': getAssessmentColor(
                            assessment.equipment
                          ),
                        }"
                      >
                        {{ assessment.equipment }}
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col size="6">{{ $t("assessments.object") }}</ion-col>
                      <ion-col
                        size="6"
                        class="ion-text-center"
                        style="border-width: 2px; border-style: solid;"
                        :style="{
                          'border-color': getAssessmentColor(assessment.object),
                        }"
                      >
                        {{ assessment.object }}
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </ion-col>
                <ion-col
                  size-lg="4"
                  size-md="4"
                  size-xs="12"
                  class="flex-column height-100"
                >
                  <ion-row class="height-100">
                    <ion-col
                      size-md="12"
                      size-lg="12"
                      size-xs="6"
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
                        :aria-label="$t(button.name)"
                        :title="$t(button.name)"
                      >
                        <font-awesome-icon
                          class="button-icon"
                          :icon="button.icon"
                        />
                      </ion-button>
                      <div class="text-overflow" v-html="$t(button.name)"></div>
                    </ion-col>
                    <ion-col
                      size-md="12"
                      size-lg="12"
                      size-xs="6"
                      class="tile flex-grow-1"
                    >
                      <ion-button
                        @click="deleteInspection"
                        class="flex-grow-1 width-100"
                        fill="outline"
                        expand="block"
                        :disabled="isDeleting"
                        :aria-label="$t('deleteInspection')"
                        :title="$t('deleteInspection')"
                      >
                        <font-awesome-icon
                          v-if="!isDeleting"
                          class="button-icon"
                          :icon="faTrash"
                        ></font-awesome-icon>
                        <ion-spinner v-if="isDeleting"></ion-spinner>
                      </ion-button>
                      <div
                        class="text-overflow"
                        v-html="$t('deleteInspection')"
                      ></div> </ion-col
                  ></ion-row>
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
  IonImg,
  alertController,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Plugins } from "@capacitor/core";
import { arrowBack } from "ionicons/icons";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
} from "@fortawesome/vue-fontawesome";
import {
  faTrafficLight,
  faPlus,
  faTools,
  faTrash,
  faSquare,
  faList,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";
import { faDamageList } from "@/icons";
import NavPopover from "@/components/NavPopover";

export default defineComponent({
  name: "Inspection",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRow,
    IonGrid,
    IonCol,
    //IonImg,
    //IonItem,
    //IonSelect,
    //IonSelectOption,
    //IonInput,
    IonButton,
    //IonLabel,
    IonIcon,
    //IonBackButton,
    IonButtons,
    IonSpinner,
    //IonSpinner,
    //IonTextarea,
    "font-awesome-icon": FontAwesomeIcon,
    "nav-popover": NavPopover,
  },
  setup() {
    // Define store
    const store = useStore();

    // Define router
    const router = useRouter();

    // define i18n
    const i18n = useI18n();

    // define inspection data
    const inspectionData = computed(() => store.state.inspection.data);

    // define inspection photo url
    const inspectionPhotoUrl = computed(() => store.state.inspection.photoUrl);

    // Array of buttons
    const buttons = reactive([
      {
        name: "newDamage",
        icon: faPlus,
        route: "NewDamage",
      },
      {
        name: "damageList",
        icon: faDamageList,
        route: "DamageListInspection",
      },
      {
        name: "assessment",
        icon: faTrafficLight,
        route: "AssessmentForm",
      },
      {
        name: "editInspection",
        icon: faTools,
        route: "EditInspection",
      },
    ]);

    // define is deleting
    const isDeleting = ref(false);

    // push function
    const push = (route) => {
      router.push({ name: route });
    };

    const assessment = computed(() => store.state.inspection.assessment);

    // delete function
    const deleteInspection = async function() {
      const alert = await alertController.create({
        header: i18n.t("deleteInspection"),
        message: i18n.t("confirmDeleteInspection"),
        buttons: [
          {
            text: i18n.t("cancel"),
            role: "cancel",
          },
          {
            text: i18n.t("delete"),
            handler: () => {
              isDeleting.value = true;
              store
                .dispatch("inspection/delete")
                .then(async (result) => {
                  isDeleting.value = false;
                  const toast = await toastController.create({
                    message: i18n.t("inspectionDeleted"),
                    duration: 2000,
                    color: "success",
                  });
                  toast.present();
                  router.push({ name: "Object" });
                })
                .catch(async (error) => {
                  isDeleting.value = false;
                  console.error(error);
                  const toast = await toastController.create({
                    message: "Error",
                    duration: 2000,
                    color: "danger",
                  });
                  toast.present();
                });
            },
          },
        ],
      });
      return alert.present();
    };

    const getAssessmentColor = function(grade) {
      if (grade === 1) {
        return "#92d050";
      } else if (grade === 2) {
        return "#ffff00";
      } else if (grade === 3) {
        return "#ffc000";
      } else if (grade === 4) {
        return "#ff6600";
      } else if (grade === 5) {
        return "#ff0000";
      } else {
        return null;
      }
    };

    const showImage = function(id) {
      const viewer = new Viewer(document.getElementById(id), {
        navbar: false,
        title: false,
      });
      viewer.show();
    };

    return {
      buttons,
      push,
      faTrafficLight,
      faTrash,
      deleteInspection,
      isDeleting,
      inspectionData,
      inspectionPhotoUrl,
      arrowBack,
      faSquare,
      assessment,
      getAssessmentColor,
      showImage,
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
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
}

@media (max-width: 576px) {
  .text-overflow {
    line-height: 1em;
    height: 3em;
  }
}

@media (min-width: 576px) {
  .overflow-scroll {
    overflow: scroll;
    height: 100%;
  }
}
</style>
