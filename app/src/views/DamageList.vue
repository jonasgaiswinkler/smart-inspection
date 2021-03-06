<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button
            @click="
              $router.push({
                name:
                  $route.name == 'DamageListObject' ? 'Object' : 'Inspection',
              })
            "
            :aria-label="$t('back')"
            :title="$t('back')"
          >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t("damageList") }}</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
        <nav-popover></nav-popover>
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
                            $t("damage.allocations.name")
                          }}</ion-label>
                          <ion-select
                            :value="filterAllocation"
                            @ionChange="filterAllocation = $event.target.value"
                            interface="popover"
                          >
                            <ion-select-option value="-">-</ion-select-option>
                            <ion-select-option
                              v-for="(allocation, key) in damageOptions
                                .allocations.data"
                              :key="key"
                              :value="key"
                              >{{
                                $t("damage.allocations.data." + key + ".name")
                              }}</ion-select-option
                            >
                          </ion-select>
                        </ion-item>
                        <ion-item
                          v-if="
                            filterAllocation != 'superstructure' &&
                              filterAllocation != '-'
                          "
                        >
                          <ion-label>{{ $t("damage.component") }}</ion-label>
                          <ion-select
                            :value="filterComponent"
                            @ionChange="filterComponent = $event.target.value"
                            interface="popover"
                          >
                            <ion-select-option value="-">-</ion-select-option>
                            <ion-select-option
                              v-for="(components, key) in damageOptions
                                .allocations.data[filterAllocation].data"
                              :key="key"
                              :value="key"
                              >{{
                                $t(
                                  "damage.allocations.data." +
                                    filterAllocation +
                                    ".data." +
                                    key
                                )
                              }}</ion-select-option
                            >
                          </ion-select>
                        </ion-item>
                        <ion-item>
                          <ion-label>{{ $t("damage.types.name") }}</ion-label>
                          <ion-select
                            :value="filterType"
                            @ionChange="filterType = $event.target.value"
                            interface="popover"
                          >
                            <ion-select-option value="-">-</ion-select-option>
                            <ion-select-option
                              v-for="(type, key) in damageOptions.types.data"
                              :key="key"
                              :value="key"
                              >{{
                                $t("damage.types.data." + key)
                              }}</ion-select-option
                            >
                          </ion-select>
                        </ion-item>
                        <ion-item>
                          <ion-label>{{
                            $t("damage.categories.name")
                          }}</ion-label>
                          <ion-select
                            :value="filterCategory"
                            @ionChange="filterCategory = $event.target.value"
                            interface="popover"
                          >
                            <ion-select-option value="-">-</ion-select-option>
                            <ion-select-option
                              v-for="(category, key) in damageOptions.categories
                                .data"
                              :key="key"
                              :value="key"
                              >{{
                                $t("damage.categories.data." + key)
                              }}</ion-select-option
                            >
                          </ion-select>
                        </ion-item>
                        <ion-row
                          ><p>
                            {{ $t("nItems", { n: damages.length }) }}
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
                  <ion-grid>
                    <ion-row>
                      <ion-col size="4">
                        {{ $t("damage.name") }}
                      </ion-col>
                      <ion-col size="4">
                        {{ $t("damage.allocations.name") }}
                      </ion-col>
                      <ion-col size="4">
                        {{ $t("damage.types.name") }}
                      </ion-col>
                    </ion-row></ion-grid
                  >
                </ion-list-header>
                <template v-for="damage in damages" :key="damage.did">
                  <ion-item
                    button
                    @click="
                      $router.push({
                        name: 'Damage',
                        params: {
                          oid: oid,
                          idate:
                            $route.name == 'DamageListObject'
                              ? currentIdate
                              : idate,
                          did: damage.did,
                        },
                        query: { from: $route.name },
                      })
                    "
                  >
                    <ion-grid>
                      <ion-row>
                        <ion-col size="4">
                          <ion-label
                            >#{{ damage.did }}
                            <font-awesome-icon
                              v-if="
                                damage.state.category ==
                                  'immediateActionLimit' &&
                                  damage.isFixed !== true
                              "
                              class="ion-margin-start"
                              color="red"
                              fixed-width
                              :title="
                                $t(
                                  'damage.categories.data.immediateActionLimit'
                                )
                              "
                              :icon="faExclamationTriangle"/><font-awesome-icon
                              v-if="damage.isFixed === true"
                              class="ion-margin-start"
                              color="green"
                              fixed-width
                              :title="$t('damageFixed')"
                              :icon="faCheck"
                          /></ion-label>
                        </ion-col>
                        <ion-col size="4">
                          <ion-label>{{
                            $t(
                              "damage.allocations.data." +
                                damage.allocation +
                                ".name"
                            )
                          }}</ion-label>
                        </ion-col>
                        <ion-col size="4">
                          <ion-label>{{
                            $t("damage.types.data." + damage.type)
                          }}</ion-label>
                        </ion-col>
                      </ion-row></ion-grid
                    >
                  </ion-item>
                </template>
                <ion-item v-if="!damages">
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
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, ref, watch } from "vue";
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
import {
  faFilter,
  faTimes,
  faRedo,
  faCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import NavPopover from "@/components/NavPopover";

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
    "nav-popover": NavPopover,
  },
  setup() {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();
    const messages = i18n.messages.value.de;

    // define object options
    const damageOptions = messages.damage;

    // get oid from store
    const oid = computed(() => store.state.object.oid);

    // get idate
    const idate = computed(() => store.state.inspection.idate);

    // define object list
    const list = computed(() => store.state.damage.list);

    // define isLoading
    const isLoading = computed(() => store.state.damage.isLoading);

    const searchValue = ref("");

    const search = function(value) {
      searchValue.value = value.detail.value;
    };

    // filters
    const filterAllocation = ref("-");
    const filterComponent = ref("-");
    const filterType = ref("-");
    const filterCategory = ref("-");

    watch(filterAllocation, () => {
      filterComponent.value = "-";
    });

    const damages = computed(() => {
      if (list.value == null) {
        return [];
      } else {
        let filteredList = list.value;
        const firstItems = filteredList.filter(
          (item) => item.state.category == "immediateActionLimit"
        );
        filteredList = filteredList.filter(
          (item) => item.state.category != "immediateActionLimit"
        );
        filteredList.unshift(...firstItems);
        const lastItems = filteredList.filter((item) => item.isFixed === true);
        filteredList = filteredList.filter((item) => item.isFixed !== true);
        filteredList.push(...lastItems);
        filteredList = filteredList.filter((doc) => {
          let isAllocation = true;
          if (filterAllocation.value != "-") {
            isAllocation = doc.allocation == filterAllocation.value;
          }
          let isComponent = true;
          if (filterComponent.value != "-") {
            isComponent = doc.component == filterComponent.value;
          }
          let isType = true;
          if (filterType.value != "-") {
            isType = doc.type == filterType.value;
          }
          let isCategory = true;
          if (filterCategory.value != "-") {
            isCategory = doc.state.category == filterCategory.value;
          }

          if (isAllocation && isComponent && isCategory && isType) {
            return true;
          } else {
            return false;
          }
        });
        if (searchValue.value == "") {
          return filteredList;
        } else {
          return filteredList.filter((doc) =>
            doc.did.includes(searchValue.value)
          );
        }
      }
    });

    const showModal = ref(false);

    const resetFilter = function() {
      filterAllocation.value = "-";
      filterComponent.value = "-";
      filterType.value = "-";
      filterCategory.value = "-";
    };

    const filterIsActive = computed(() => {
      return (
        filterAllocation.value != "-" ||
        filterType.value != "-" ||
        filterCategory.value != "-"
      );
    });

    const currentIdate = computed(() => store.state.damage.currentIdate);

    return {
      damages,
      isLoading,
      search,
      arrowBack,
      oid,
      list,
      idate,
      currentIdate,
      faFilter,
      showModal,
      damageOptions,
      filterAllocation,
      filterComponent,
      filterType,
      filterCategory,
      faTimes,
      faRedo,
      faCheck,
      resetFilter,
      filterIsActive,
      faExclamationTriangle,
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
