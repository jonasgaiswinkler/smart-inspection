<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button
            @click="
              $router.push({
                name: routeName == 'InspectionListObject' ? 'Object' : 'Home',
              })
            "
            :aria-label="$t('back')"
            :title="$t('back')"
          >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t("inspectionList") }}</ion-title>
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
        id="inspection-list"
        @submit.stop.prevent="submit"
      >
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col size-md="6" size-lg="6" size-xs="12">
              <ion-row class="ion-align-items-center">
                <ion-searchbar
                  debounce="100"
                  :placeholder="$t('search')"
                  @ionChange="search"
                  style="flex: 1"
                >
                </ion-searchbar>
                <ion-button
                  fill="clear"
                  :aria-label="$t('filter')"
                  :title="$t('filter')"
                  @click="showModal = true"
                >
                  <font-awesome-layers
                    slot="icon-only"
                    full-width
                    class="fa-lg"
                  >
                    <font-awesome-icon :icon="faFilter" />
                    <font-awesome-layers-text
                      v-if="filterIsActive"
                      counter
                      value=""
                      position="top-right"
                    />
                  </font-awesome-layers>
                </ion-button>
                <ion-modal
                  :is-open="showModal"
                  @onDidDismiss="showModal = false"
                  css-class="filter-modal"
                >
                  <ion-grid class="height-100 width-100">
                    <ion-row
                      color="primary"
                      class="ion-justify-content-center height-100"
                    >
                      <ion-col size="12">
                        <ion-row class="ion-align-items-center">
                          <h2 class="ion-no-margin">{{ $t("filter") }}</h2>
                          <div style="flex: 1"></div>
                          <ion-button
                            fill="clear"
                            :aria-label="$t('reset')"
                            :title="$t('reset')"
                            @click="resetFilter"
                          >
                            <font-awesome-icon :icon="faRedo" />
                          </ion-button>
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
                          <ion-label>{{
                            $t("inspection.types.name")
                          }}</ion-label>
                          <ion-select
                            :value="filterType"
                            @ionChange="filterType = $event.target.value"
                            interface="popover"
                          >
                            <ion-select-option value="-">-</ion-select-option>
                            <ion-select-option
                              v-for="(type, key) in inspectionOptions.types
                                .data"
                              :key="key"
                              :value="key"
                              >{{
                                $t("inspection.types.data." + key)
                              }}</ion-select-option
                            >
                          </ion-select>
                        </ion-item>
                        <ion-item>
                          <ion-label>{{
                            $t("inspection.weather.name")
                          }}</ion-label>
                          <ion-select
                            :value="filterWeather"
                            @ionChange="filterWeather = $event.target.value"
                            interface="popover"
                          >
                            <ion-select-option value="-">-</ion-select-option>
                            <ion-select-option
                              v-for="(weather, key) in inspectionOptions.weather
                                .data"
                              :key="key"
                              :value="key"
                              >{{
                                $t("inspection.weather.data." + key)
                              }}</ion-select-option
                            >
                          </ion-select>
                        </ion-item>
                      </ion-col>
                    </ion-row>
                  </ion-grid>
                </ion-modal>
              </ion-row>
              <ion-progress-bar
                v-if="isLoading"
                type="indeterminate"
              ></ion-progress-bar>
              <ion-list>
                <template
                  v-for="(inspection, i) in inspections"
                  :key="inspection.oid + '/' + inspection.iid"
                >
                  <ion-list-header
                    v-if="i == 0 || inspections[i - 1].oid != inspection.oid"
                  >
                    {{ $t("object.name") + ": " + inspection.oid }}
                  </ion-list-header>
                  <ion-item
                    button
                    @click="
                      $router.push({
                        name: 'Inspection',
                        params: { oid: inspection.oid, idate: inspection.date },
                        query: { from: $route.name },
                      })
                    "
                  >
                    <ion-label>{{ inspection.text }}</ion-label>
                  </ion-item>
                </template>
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
  IonModal,
  IonTextarea,
  IonSpinner,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { Plugins } from "@capacitor/core";
import { arrowBack } from "ionicons/icons";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { useRouter } from "vue-router";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from "@fortawesome/vue-fontawesome";
import { faFilter, faTimes, faRedo } from "@fortawesome/free-solid-svg-icons";

export default defineComponent({
  name: "InspectionList",
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
    IonProgressBar,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    //IonInput,
    IonButton,
    IonLabel,
    IonModal,
    IonList,
    IonListHeader,
    IonIcon,
    //IonBackButton,
    IonButtons,
    IonSpinner,
    //IonTextarea
    "font-awesome-icon": FontAwesomeIcon,
    "font-awesome-layers": FontAwesomeLayers,
    "font-awesome-layers-text": FontAwesomeLayersText,
  },
  setup() {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();
    const messages = i18n.messages.value.de;

    // define inspection options
    const inspectionOptions = messages.inspection;

    // define router
    const router = useRouter();

    // get current route name
    const routeName = router.currentRoute.value.name;

    // get oid from store
    const oid = computed(() => store.state.object.oid);

    // define object list
    const list = computed(() => store.state.inspection.list);

    // define isLoading
    const isLoading = computed(() => store.state.inspection.isLoading);

    const searchValue = ref("");

    const search = function(value) {
      searchValue.value = value.detail.value;
    };

    // filters
    const filterType = ref("-");
    const filterWeather = ref("-");

    const inspections = computed(() => {
      if (list.value == null) {
        return [];
      } else {
        const filteredList = list.value.filter((doc) => {
          let isType = true;
          if (filterType.value != "-") {
            isType = doc.type == filterType.value;
          }
          let isWeather = true;
          if (filterWeather.value != "-") {
            isWeather = doc.weather == filterWeather.value;
          }

          if (isType && isWeather) {
            return true;
          } else {
            return false;
          }
        });
        if (searchValue.value == "") {
          return filteredList;
        } else {
          return filteredList.filter((doc) =>
            doc.text.includes(searchValue.value)
          );
        }
      }
    });

    const showModal = ref(false);

    const resetFilter = function() {
      filterType.value = "-";
      filterWeather.value = "-";
    };

    const filterIsActive = computed(() => {
      return filterType.value != "-" || filterWeather.value != "-";
    });

    return {
      inspections,
      isLoading,
      search,
      arrowBack,
      routeName,
      oid,
      list,
      faFilter,
      showModal,
      inspectionOptions,
      filterType,
      filterWeather,
      faTimes,
      faRedo,
      resetFilter,
      filterIsActive,
    };
  },
});
</script>

<style>
.height-100 {
  height: 100%;
}

.width-100 {
  width: 100%;
}

.filter-modal {
  --background: rgba(255, 255, 255, 0.9);
}
</style>
