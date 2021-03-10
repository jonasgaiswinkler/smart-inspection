<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button
            @click="
              $router.push({
                name:
                  $route.query.from != undefined ? $route.query.from : 'Home',
              })
            "
            :aria-label="$t('back')"
            :title="$t('back')"
          >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t("bridgeObject") }}</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
        <nav-popover></nav-popover>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form class="height-100" id="object" @submit.stop.prevent="submit">
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
                    v-if="objectPhotoUrl != null"
                    :src="objectPhotoUrl"
                    :alt="$t('objectPhoto')"
                    id="objectPhoto"
                    @click="showImage('objectPhoto')"
                    style="cursor: pointer;"
                  />
                  <template v-if="objectData != null">
                    <p>{{ objectData.shortDescription }}</p>
                    <ul>
                      <li>
                        {{ $t("object.id") + ": " + oid }}
                      </li>
                      <li v-if="objectData.material != null">
                        {{
                          $t("object.materials.name") +
                            ": " +
                            $t("object.materials.data." + objectData.material)
                        }}
                      </li>
                      <li v-if="objectData.type != null">
                        {{
                          $t("object.types.name") +
                            ": " +
                            $t("object.types.data." + objectData.type)
                        }}
                      </li>
                      <li v-if="objectData.system != null">
                        {{
                          $t("object.systems.name") +
                            ": " +
                            $t("object.systems.data." + objectData.system)
                        }}
                      </li>
                      <li v-if="objectData.crossSectionShape != null">
                        {{
                          $t("object.crossSectionShapes.name") +
                            ": " +
                            $t(
                              "object.crossSectionShapes.data." +
                                objectData.crossSectionShape
                            )
                        }}
                      </li>
                      <li v-if="objectData.constructionYear != null">
                        {{
                          $t("object.constructionYear") +
                            ": " +
                            objectData.constructionYear
                        }}
                      </li>
                      <li v-if="objectData.routeCode != null">
                        {{
                          $t("object.routeCode") + ": " + objectData.routeCode
                        }}
                      </li>
                      <li v-if="objectData.routeName != null">
                        {{
                          $t("object.routeName") + ": " + objectData.routeName
                        }}
                      </li>
                      <li v-if="objectData.chainage != null">
                        {{ $t("object.chainage") + ": " + objectData.chainage }}
                      </li>
                      <li v-if="objectData.coords != null">
                        {{ $t("object.coords") + ": " }}
                        <a
                          :href="
                            'https://www.google.com/maps/search/' +
                              objectData.coords.latitude +
                              ',' +
                              objectData.coords.longitude
                          "
                          target="_blank"
                          >Google Maps</a
                        >
                      </li>
                      <li v-if="objectData.spanLength != null">
                        {{
                          $t("object.spanLength") + ": " + objectData.spanLength
                        }}
                      </li>
                      <li v-if="objectData.width != null">
                        {{ $t("object.width") + ": " + objectData.width }}
                      </li>
                      <li v-if="objectData.trafficRoutes != null">
                        {{
                          $t("object.trafficRoutes") +
                            ": " +
                            objectData.trafficRoutes
                        }}
                      </li>
                    </ul>
                  </template>
                  <ion-grid v-if="currentAssessment != null">
                    <ion-row>
                      <ion-col size="6"></ion-col>
                      <ion-col size="6" class="ion-text-center">{{
                        new Date(currentAssessment.date).toLocaleDateString(
                          "de-DE"
                        )
                      }}</ion-col>
                    </ion-row>
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
                            currentAssessment.substructure
                          ),
                        }"
                      >
                        {{ currentAssessment.substructure }}
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
                            currentAssessment.superstructure
                          ),
                        }"
                      >
                        {{ currentAssessment.superstructure }}
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
                            currentAssessment.equipment
                          ),
                        }"
                      >
                        {{ currentAssessment.equipment }}
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col size="6">{{ $t("assessments.object") }}</ion-col>
                      <ion-col
                        size="6"
                        class="ion-text-center"
                        style="border-width: 2px; border-style: solid;"
                        :style="{
                          'border-color': getAssessmentColor(
                            currentAssessment.object
                          ),
                        }"
                      >
                        {{ currentAssessment.object }}
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
                        :disabled="isRequesting"
                        :aria-label="$t(button.name)"
                        :title="$t(button.name)"
                      >
                        <font-awesome-icon
                          :icon="button.icon"
                          class="button-icon"
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
                        @click="getCSV"
                        class="flex-grow-1 width-100"
                        fill="outline"
                        expand="block"
                        :aria-label="$t('exportAsCSV')"
                        :title="$t('exportAsCSV')"
                      >
                        <font-awesome-icon
                          class="button-icon"
                          :icon="faFileCsv"
                        ></font-awesome-icon>
                      </ion-button>
                      <div
                        class="text-overflow"
                        v-html="$t('exportAsCSV')"
                      ></div>
                    </ion-col>
                    <ion-col
                      size-md="12"
                      size-lg="12"
                      size-xs="6"
                      class="tile flex-grow-1"
                    >
                      <ion-button
                        @click="requestObjectDeletion"
                        class="flex-grow-1 width-100"
                        fill="outline"
                        expand="block"
                        :disabled="isRequesting"
                        :aria-label="$t('requestObjectDeletion')"
                        :title="$t('requestObjectDeletion')"
                      >
                        <font-awesome-icon
                          v-if="!isRequesting"
                          class="button-icon"
                          :icon="faTrash"
                        ></font-awesome-icon>
                        <ion-spinner v-if="isRequesting"></ion-spinner>
                      </ion-button>
                      <div
                        class="text-overflow"
                        v-html="$t('requestObjectDeletion')"
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
import { arrowBack } from "ionicons/icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPlus,
  faFile,
  faTools,
  faTrash,
  faSquare,
  faFileCsv,
} from "@fortawesome/free-solid-svg-icons";
import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";
import { faInspectionList, faDamageList } from "@/icons";
import NavPopover from "@/components/NavPopover";

export default defineComponent({
  name: "Object",
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

    // define object data
    const objectData = computed(() => store.state.object.data);

    //define oid
    const oid = computed(() => store.state.object.oid);

    // define object photo url
    const objectPhotoUrl = computed(() => store.state.object.photoUrl);

    // Array of buttons
    const buttons = reactive([
      {
        name: "newInspection",
        icon: faPlus,
        route: "NewInspection",
      },
      {
        name: "inspectionList",
        icon: faInspectionList,
        route: "InspectionListObject",
      },
      {
        name: "damageList",
        icon: faDamageList,
        route: "DamageListObject",
      },
      {
        name: "generateReport",
        icon: faFile,
        route: "ObjectReports",
      },
      {
        name: "editObject",
        icon: faTools,
        route: "EditObject",
      },
    ]);

    // define is deleting
    const isRequesting = ref(false);

    // push function
    const push = (route) => {
      router.push({ name: route });
    };

    const currentAssessment = computed(
      () => store.state.object.currentAssessment
    );

    // request deletion function
    const requestObjectDeletion = async function() {
      const alert = await alertController.create({
        header: i18n.t("requestObjectDeletion"),
        message: i18n.t("confirmDeletionRequest"),
        buttons: [
          {
            text: i18n.t("cancel"),
            role: "cancel",
          },
          {
            text: i18n.t("confirm"),
            handler: async () => {
              isRequesting.value = true;
              try {
                await store.dispatch("object/requestDeletion");
                const toast = await toastController.create({
                  message: i18n.t("deletionRequested"),
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
              isRequesting.value = false;
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

    const getCSV = async function() {
      const csv = await store.dispatch("object/getCSV");

      const encodedUri = "data:text/csv;charset=utf-8," + encodeURI(csv);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "object.csv");
      document.body.appendChild(link);

      link.click();
    };

    return {
      buttons,
      push,
      faTrash,
      requestObjectDeletion,
      isRequesting,
      objectData,
      objectPhotoUrl,
      oid,
      arrowBack,
      faSquare,
      currentAssessment,
      getAssessmentColor,
      showImage,
      getCSV,
      faFileCsv,
    };
  },
  mounted() {
    console.log();
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
