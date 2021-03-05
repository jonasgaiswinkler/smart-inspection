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
            <ion-col size-md="12" size-lg="6" size-xs="12" class="height-100">
              <h2 v-if="$route.name === 'ObjectReports'">
                {{ $t("objectReports") }}
              </h2>
              <div>
                <ion-radio-group :value="reportMode" @ionChange="setReportMode">
                  <ion-item>
                    <ion-label>{{ $t("objectReport") }}</ion-label>
                    <ion-radio slot="start" value="object"></ion-radio>
                  </ion-item>

                  <ion-item v-if="inspections">
                    <ion-label>{{ $t("inspectionReport") }}</ion-label>
                    <ion-select
                      v-if="inspections"
                      :value="selectedInspection"
                      interface="popover"
                      @ionChange="changeSelectedInspection"
                    >
                      <ion-select-option
                        v-for="inspection in inspections"
                        :key="inspection.iid"
                        :value="inspection.iid"
                        >{{ inspection.text }}</ion-select-option
                      >
                    </ion-select>
                    <ion-radio slot="start" value="inspection"></ion-radio>
                  </ion-item>
                </ion-radio-group>
                <ion-item>
                  <ion-label>{{ $t("language") }}</ion-label>
                  <ion-select
                    :value="locale"
                    interface="popover"
                    @ionChange="changeLocale"
                  >
                    <ion-select-option
                      v-for="locale in $i18n.availableLocales"
                      :key="locale"
                      :value="locale"
                      >{{ locale }}</ion-select-option
                    >
                  </ion-select>
                </ion-item>
                <ion-row class="ion-align-items-center">
                  <div style="flex: 1"></div>
                  <ion-spinner
                    v-if="reportIsLoading"
                    color="primary"
                  ></ion-spinner>
                  <ion-button
                    @click="$store.dispatch('object/createReport')"
                    :disabled="reportIsLoading"
                    class="ion-margin-start"
                    ><font-awesome-icon
                      :icon="faPlus"
                      style="margin-right: 10px"
                    ></font-awesome-icon
                    >{{ $t("newReport") }}</ion-button
                  >
                </ion-row>
              </div>
              <hr />
              <h3>
                {{ $t("list") }}
              </h3>
              <ion-progress-bar
                v-if="reportsIsLoading"
                type="indeterminate"
              ></ion-progress-bar>

              <ion-list>
                <ion-list-header>
                  <div style="float: left; width: 130px">
                    <ion-label>{{ $t("creationDate") }}</ion-label>
                  </div>
                  <div style="float: left; width: 130px">
                    <ion-label> {{ $t("inspection.name") }} </ion-label>
                  </div>
                  <div
                    class="ion-hide-sm-down"
                    style="float: left; width: 130px"
                  >
                    <ion-label> {{ $t("language") }} </ion-label>
                  </div>
                </ion-list-header>
                <ion-item v-for="report in reports" :key="report.rid">
                  <div style="float: left; width: 130px">
                    <ion-label>{{ report.createdString }}</ion-label>
                  </div>
                  <div style="float: left; width: 130px">
                    <ion-label>
                      {{
                        report.type === "inspection"
                          ? report.inspectionString
                          : ""
                      }}
                    </ion-label>
                  </div>
                  <div
                    class="ion-hide-sm-down"
                    style="float: left; width: 130px"
                  >
                    <ion-label>{{ report.locale }}</ion-label>
                  </div>
                  <!--<div style="float: left; width: 60%">
                    <ion-label>
                      {{ doc.shortDescription }}
                    </ion-label>
                  </div>-->
                  <ion-button
                    :href="report.url"
                    target="_blank"
                    fill="clear"
                    slot="end"
                    :title="$t('restoreObject')"
                    :aria-label="$t('restoreObject')"
                  >
                    <font-awesome-icon
                      slot="icon-only"
                      :icon="faDownload"
                    ></font-awesome-icon>
                  </ion-button>
                  <ion-button
                    @click="deleteReport(report.rid)"
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
                <ion-item v-if="!reports">
                  <ion-label>{{ $t("noEntries") }}</ion-label>
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
  IonRadio,
  IonRadioGroup,
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
  faDownload,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { faWpforms } from "@fortawesome/free-brands-svg-icons";

export default defineComponent({
  name: "Reports",
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
    IonSelect,
    IonSelectOption,
    //IonInput,
    IonButton,
    IonLabel,
    IonIcon,
    //IonBackButton,
    IonButtons,
    IonSpinner,
    IonProgressBar,
    IonRadio,
    IonRadioGroup,
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

    // define inspection list
    const inspections = computed(() => store.state.inspection.list);

    // define selected inspection
    const selectedInspection = computed(
      () => store.state.inspection.selectedReport
    );

    const reportMode = computed(() => store.state.object.reportMode);
    const setReportMode = function(event) {
      let mode = event?.detail?.value;
      if (mode !== "object" && mode !== "inspection") {
        mode = "inspection";
      }
      if (mode !== reportMode.value) {
        store.commit("object/setReportMode", mode);
      }
    };

    const changeSelectedInspection = function(event) {
      const rid = event?.detail?.value;
      if (rid !== selectedInspection.value) {
        store.commit("inspection/setSelectedReport", rid);
      }
    };

    const locale = computed(() => store.state.object.reportLocale);

    const changeLocale = function(event) {
      const newLocale = event?.detail?.value;
      if (newLocale !== locale.value) {
        store.commit("object/setReportLocale", newLocale);
      }
    };

    const reportIsLoading = computed(() => store.state.object.reportIsLoading);
    const reportsIsLoading = computed(
      () => store.state.object.reportsIsLoading
    );

    const reports = computed(() => store.state.object.reports);

    // request deletion function
    const deleteReport = async function(rid) {
      const alert = await alertController.create({
        header: i18n.t("deleteReport"),
        message: i18n.t("confirmDeleteReport", { oid: rid }),
        buttons: [
          {
            text: i18n.t("cancel"),
            role: "cancel",
          },
          {
            text: i18n.t("confirm"),
            handler: async () => {
              store.commit("object/setReportsIsLoading", true);
              try {
                await store.dispatch("object/deleteReport", rid);

                const toast = await toastController.create({
                  message: i18n.t("reportDeleted"),
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
              store.commit("object/setReportsIsLoading", false);
            },
          },
        ],
      });
      return alert.present();
    };

    return {
      faTrash,
      oid,
      arrowBack,
      faSquare,
      faPlus,
      faDownload,
      inspections,
      selectedInspection,
      changeSelectedInspection,
      reportMode,
      setReportMode,
      reportIsLoading,
      reports,
      reportsIsLoading,
      deleteReport,
      locale,
      changeLocale,
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
