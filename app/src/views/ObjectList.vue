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
        <ion-title>{{ $t("objectList") }}</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
        <nav-popover></nav-popover>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form class="height-100" id="object-list" @submit.stop.prevent="submit">
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col size-md="12" size-lg="9" size-xs="12">
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
                            $t("object.materials.name")
                          }}</ion-label>
                          <ion-select
                            :value="filterMaterial"
                            @ionChange="filterMaterial = $event.target.value"
                            interface="popover"
                          >
                            <ion-select-option value="-">-</ion-select-option>
                            <ion-select-option
                              v-for="(material, key) in objectOptions.materials
                                .data"
                              :key="key"
                              :value="key"
                              >{{
                                $t("object.materials.data." + key)
                              }}</ion-select-option
                            >
                          </ion-select>
                        </ion-item>
                        <ion-item>
                          <ion-label>{{ $t("object.types.name") }}</ion-label>
                          <ion-select
                            :value="filterType"
                            @ionChange="filterType = $event.target.value"
                            interface="popover"
                          >
                            <ion-select-option value="-">-</ion-select-option>
                            <ion-select-option
                              v-for="(type, key) in objectOptions.types.data"
                              :key="key"
                              :value="key"
                              >{{
                                $t("object.types.data." + key)
                              }}</ion-select-option
                            >
                          </ion-select>
                        </ion-item>
                        <ion-item>
                          <ion-label>{{ $t("object.systems.name") }}</ion-label>
                          <ion-select
                            :value="filterSystem"
                            @ionChange="filterSystem = $event.target.value"
                            interface="popover"
                          >
                            <ion-select-option value="-">-</ion-select-option>
                            <ion-select-option
                              v-for="(system, key) in objectOptions.systems
                                .data"
                              :key="key"
                              :value="key"
                              >{{
                                $t("object.systems.data." + key)
                              }}</ion-select-option
                            >
                          </ion-select>
                        </ion-item>
                        <ion-item>
                          <ion-label>{{
                            $t("object.crossSectionShapes.name")
                          }}</ion-label>
                          <ion-select
                            :value="filterCrossSectionShape"
                            @ionChange="
                              filterCrossSectionShape = $event.target.value
                            "
                            interface="popover"
                          >
                            <ion-select-option value="-">-</ion-select-option>
                            <ion-select-option
                              v-for="(crossSectionShape, key) in objectOptions
                                .crossSectionShapes.data"
                              :key="key"
                              :value="key"
                              >{{
                                $t("object.crossSectionShapes.data." + key)
                              }}</ion-select-option
                            >
                          </ion-select>
                        </ion-item>
                        <ion-row
                          ><p>
                            {{ $t("nItems", { n: objects.length }) }}
                          </p>
                          <div style="flex: 1;"></div>
                          <ion-button
                            :aria-label="$t('ok')"
                            :title="$t('ok')"
                            @click="showModal = false"
                          >
                            {{ $t("ok") }}
                          </ion-button>
                        </ion-row>
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
                <ion-list-header>
                  <div style="float: left; width: 18%">
                    <ion-label>{{ $t("object.id") }}</ion-label>
                  </div>
                  <div style="float: left; width: 22%">
                    <ion-label> km </ion-label>
                  </div>
                  <div style="float: left; width: 60%">
                    <ion-label>
                      {{ $t("object.shortDescription") }}
                    </ion-label>
                  </div>
                </ion-list-header>
                <ion-item
                  v-for="doc in objects"
                  :key="doc.id"
                  button
                  :disabled="doc.deletionRequested"
                  @click="
                    $router.push(
                      $route.query?.idate
                        ? {
                            name: 'Inspection',
                            params: {
                              oid: doc.id,
                              idate: $route.query?.idate,
                            },
                            query: { from: $route.name },
                          }
                        : {
                            name: 'Object',
                            params: { oid: doc.id },
                            query: { from: $route.name },
                          }
                    )
                  "
                >
                  <div style="float: left; width: 18%">
                    <ion-label>{{ doc.id }}</ion-label>
                  </div>
                  <div style="float: left; width: 22%">
                    <ion-label>
                      {{ doc.chainage }}
                    </ion-label>
                  </div>
                  <div style="float: left; width: 60%">
                    <ion-label>
                      {{ doc.shortDescription }}
                    </ion-label>
                  </div>
                </ion-item>
                <ion-item v-if="!objects">
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
  IonBackdrop,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { Plugins } from "@capacitor/core";
import { arrowBack } from "ionicons/icons";
import * as firebase from "firebase/app";
import "firebase/firestore";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from "@fortawesome/vue-fontawesome";
import { faFilter, faTimes, faRedo } from "@fortawesome/free-solid-svg-icons";
import NavPopover from "@/components/NavPopover";

export default defineComponent({
  name: "ObjectList",
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
    IonList,
    IonListHeader,
    IonIcon,
    IonModal,
    //IonBackButton,
    IonButtons,
    //IonBackdrop,
    IonSpinner,
    //IonTextarea
    "font-awesome-icon": FontAwesomeIcon,
    "font-awesome-layers": FontAwesomeLayers,
    "font-awesome-layers-text": FontAwesomeLayersText,
    "nav-popover": NavPopover,
  },
  setup() {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();
    const messages = i18n.messages.value.de;

    // define object options
    const objectOptions = messages.object;

    // define object list
    const list = computed(() => store.state.object.list);

    // filters
    const filterMaterial = ref("-");
    const filterType = ref("-");
    const filterSystem = ref("-");
    const filterCrossSectionShape = ref("-");

    // define isLoading
    const isLoading = computed(() => store.state.object.isLoading);
    const searchValue = ref("");

    const search = function(value) {
      searchValue.value = value.detail.value;
    };

    const objects = computed(() => {
      if (list.value == null) {
        return [];
      } else {
        const filteredList = list.value.filter((doc) => {
          let isMaterial = true;
          if (filterMaterial.value != "-") {
            isMaterial = doc.material == filterMaterial.value;
          }
          let isType = true;
          if (filterType.value != "-") {
            isType = doc.type == filterType.value;
          }
          let isSystem = true;
          if (filterSystem.value != "-") {
            isSystem = doc.system == filterSystem.value;
          }
          let isCrossSectionShape = true;
          if (filterCrossSectionShape.value != "-") {
            isCrossSectionShape =
              doc.crossSectionShape == filterCrossSectionShape.value;
          }

          if (isMaterial && isType && isSystem && isCrossSectionShape) {
            return true;
          } else {
            return false;
          }
        });
        if (searchValue.value == "") {
          return filteredList;
        } else {
          return filteredList.filter(
            (doc) =>
              doc.id.includes(searchValue.value) ||
              doc.chainage.includes(searchValue.value)
          );
        }
      }
    });

    const showModal = ref(false);

    const resetFilter = function() {
      filterMaterial.value = "-";
      filterType.value = "-";
      filterSystem.value = "-";
      filterCrossSectionShape.value = "-";
    };

    const filterIsActive = computed(() => {
      return (
        filterMaterial.value != "-" ||
        filterType.value != "-" ||
        filterSystem.value != "-" ||
        filterCrossSectionShape.value != "-"
      );
    });

    return {
      objects,
      isLoading,
      search,
      arrowBack,
      faFilter,
      showModal,
      objectOptions,
      filterMaterial,
      filterType,
      filterSystem,
      filterCrossSectionShape,
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
  /* --background: rgba(255, 255, 255, 0.9); */
}
</style>
