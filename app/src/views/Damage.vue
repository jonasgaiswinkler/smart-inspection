<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button
            @click="
              $router.push({
                name:
                  $route.query.from != undefined
                    ? $route.query.from
                    : 'Inspection',
              })
            "
            :aria-label="$t('back')"
            :title="$t('back')"
          >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t("damage.name") }}</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form class="height-100" id="damage" @submit.stop.prevent="submit">
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
                  <template v-if="damageData != null">
                    <h1 v-if="damageData.isFixed === true">
                      {{ $t("thisDamageIsFixed") }}
                    </h1>
                    <p v-if="damageData.description != null">
                      {{ damageData.description }}
                    </p>
                    <ul>
                      <li v-if="damageData.allocation != null">
                        {{
                          $t("damage.allocations.name") +
                            ": " +
                            $t(
                              "damage.allocations.data." +
                                damageData.allocation +
                                ".name"
                            )
                        }}
                      </li>
                      <li v-if="damageData.component != null">
                        {{
                          $t("damage.component") +
                            ": " +
                            $t(
                              "damage.allocations.data." +
                                damageData.allocation +
                                ".data." +
                                damageData.component
                            )
                        }}
                      </li>
                      <li v-if="damageData.componentDetail != null">
                        {{
                          $t("damage.componentDetail") +
                            ": " +
                            damageData.componentDetail
                        }}
                      </li>
                      <li v-if="damageData.type != null">
                        {{
                          $t("damage.types.name") +
                            ": " +
                            $t("damage.types.data." + damageData.type)
                        }}
                      </li>
                      <li v-if="damageData.typeDetail != null">
                        {{
                          $t("damage.typeDetail") + ": " + damageData.typeDetail
                        }}
                      </li>
                      <li v-if="damageData.location != null">
                        {{ $t("damage.location") + ": " + damageData.location }}
                      </li>
                      <li v-if="damageData.cause != null">
                        {{ $t("damage.cause") + ": " + damageData.cause }}
                      </li>
                      <li>
                        {{ $t("measurements") }}
                      </li>
                    </ul>
                  </template>
                  <ion-grid
                    v-if="currentDamageState != null && damageData != null"
                  >
                    <ion-row>
                      <ion-col size="4">{{ $t("inspection.date") }}</ion-col>
                      <ion-col
                        v-if="damageData.measurement1Name != null"
                        size="4"
                        >{{ damageData.measurement1Name }}
                      </ion-col>
                      <ion-col
                        v-if="damageData.measurement2Name != null"
                        size="4"
                      >
                        {{ damageData.measurement2Name }}
                      </ion-col>
                    </ion-row>
                    <ion-row
                      v-for="state in damageStates"
                      :key="state.date"
                      :class="state.date == idate ? 'background-primary' : ''"
                    >
                      <ion-col size="4">{{
                        new Date(state.date).toLocaleDateString("de-DE")
                      }}</ion-col>
                      <ion-col
                        v-if="state.measurement1 != null"
                        :class="
                          selectedDamageState != null &&
                          toMillimetre(state.measurement1) >=
                            toMillimetre(selectedDamageState.limit)
                            ? 'color-danger'
                            : ''
                        "
                        size="4"
                        >{{
                          state.measurement1.value +
                            " " +
                            state.measurement1.unit
                        }}</ion-col
                      >
                      <ion-col v-if="state.measurement2 != null" size="4">{{
                        state.measurement2.value + " " + state.measurement2.unit
                      }}</ion-col>
                    </ion-row>
                  </ion-grid>
                  <ul v-if="selectedDamageState != null && damageData != null">
                    <li v-if="selectedDamageState.limit != null">
                      {{
                        $t("damage.limit", {
                          msg: damageData.measurement1Name,
                        }) +
                          ": " +
                          selectedDamageState.limit.value +
                          " " +
                          selectedDamageState.limit.unit
                      }}
                    </li>
                    <li v-if="selectedDamageState.impact != null">
                      {{
                        $t("damage.impact") + ": " + selectedDamageState.impact
                      }}
                    </li>
                    <li v-if="selectedDamageState.category != null">
                      {{
                        $t("damage.categories.name") +
                          ": " +
                          $t(
                            "damage.categories.data." +
                              selectedDamageState.category
                          )
                      }}
                    </li>
                    <li v-if="selectedDamageState.action != null">
                      {{
                        $t("damage.action") + ": " + selectedDamageState.action
                      }}
                    </li>
                    <li v-if="selectedDamageState.period != null">
                      {{
                        $t("damage.period") + ": " + selectedDamageState.period
                      }}
                    </li>
                    <li v-if="selectedDamageState.additionalInfo != null">
                      {{
                        $t("damage.additionalInfo") +
                          ": " +
                          selectedDamageState.additionalInfo
                      }}
                    </li>
                  </ul>
                  <img
                    v-if="
                      currentDamageState != null &&
                        currentDamageState.photoUrl != null
                    "
                    :src="currentDamageState.photoUrl"
                    :alt="$t('inspectionPhoto')"
                    id="damagePhoto"
                    @click="showImage('damagePhoto')"
                    style="cursor: pointer;"
                  />
                  <img
                    v-if="
                      damageData != null && damageData.imageGroundPlan != null
                    "
                    :src="damageData.imageGroundPlan"
                    :alt="$t('damageGroundPlan')"
                    id="damageGroundPlan"
                    @click="showImage('damageGroundPlan')"
                    style="cursor: pointer;"
                  />
                  <img
                    v-if="
                      damageData != null &&
                        damageData.imageLongitudinalSection != null
                    "
                    :src="damageData.imageLongitudinalSection"
                    :alt="$t('damageLongitudinalSection')"
                    id="damageLongitudinalSection"
                    @click="showImage('damageLongitudinalSection')"
                    style="cursor: pointer;"
                  />
                  <img
                    v-if="
                      damageData != null && damageData.imageCrossSection != null
                    "
                    :src="damageData.imageCrossSection"
                    :alt="$t('damageCrossSection')"
                    id="damageCrossSection"
                    @click="showImage('damageCrossSection')"
                    style="cursor: pointer;"
                  />
                  <img
                    v-if="damageData != null && damageData.imageModel != null"
                    :src="damageData.imageModel"
                    :alt="$t('damageModel')"
                    id="damageModel"
                    @click="showImage('damageModel')"
                    style="cursor: pointer;"
                  />
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
                        :disabled="isDeleting || isFixing"
                        :aria-label="$t(button.name)"
                        :title="$t(button.name)"
                      >
                        <font-awesome-icon
                          class="button-icon"
                          :icon="button.icon"
                        ></font-awesome-icon>
                      </ion-button>
                      <div class="text-overflow" v-html="$t(button.name)"></div>
                    </ion-col>
                    <ion-col
                      size-md="12"
                      size-lg="12"
                      size-xs="6"
                      class="tile flex-grow-1"
                      v-if="damageData != null && damageData.isFixed !== true"
                    >
                      <ion-button
                        @click="fixDamage"
                        class="flex-grow-1 width-100"
                        fill="outline"
                        expand="block"
                        :disabled="isFixing"
                        :aria-label="$t('fixDamage')"
                        :title="$t('fixDamage')"
                      >
                        <font-awesome-icon
                          v-if="!isFixing"
                          class="button-icon"
                          :icon="faCheck"
                        ></font-awesome-icon>
                        <ion-spinner v-if="isFixing"></ion-spinner>
                      </ion-button>
                      <div class="text-overflow" v-html="$t('fixDamage')"></div>
                    </ion-col>
                    <ion-col
                      size-md="12"
                      size-lg="12"
                      size-xs="6"
                      class="tile flex-grow-1"
                      v-if="damageData != null && damageData.isFixed === true"
                    >
                      <ion-button
                        @click="unfixDamage"
                        class="flex-grow-1 width-100"
                        fill="outline"
                        expand="block"
                        :disabled="isFixing"
                        :aria-label="$t('unfixDamage')"
                        :title="$t('unfixDamage')"
                      >
                        <font-awesome-icon
                          v-if="!isFixing"
                          class="button-icon"
                          :icon="faTimes"
                        ></font-awesome-icon>
                        <ion-spinner v-if="isFixing"></ion-spinner>
                      </ion-button>
                      <div
                        class="text-overflow"
                        v-html="$t('unfixDamage')"
                      ></div>
                    </ion-col>
                    <ion-col
                      size-md="12"
                      size-lg="12"
                      size-xs="6"
                      class="tile flex-grow-1"
                    >
                      <ion-button
                        @click="deleteDamage"
                        class="flex-grow-1 width-100"
                        fill="outline"
                        expand="block"
                        :disabled="isDeleting || isFixing"
                        :aria-label="$t('deleteDamage')"
                        :title="$t('deleteDamage')"
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
                        v-html="$t('deleteDamage')"
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faEdit,
  faTools,
  faTrash,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "viewerjs/dist/viewer.css";
import Viewer from "viewerjs";

export default defineComponent({
  name: "Damage",
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
  },
  setup() {
    // Define store
    const store = useStore();

    // Define router
    const router = useRouter();

    // define i18n
    const i18n = useI18n();

    // get idate
    const idate = computed(() => store.state.inspection.idate);

    // get iid
    const iid = computed(() => store.state.inspection.iid);

    // define damage data
    const damageData = computed(() => store.state.damage.data);

    const currentDamageState = computed(
      () => store.getters["damage/currentState"]
    );

    const damageStates = computed(() => store.state.damage.states);

    const getSelectedDamageState = computed(() =>
      damageStates.value != null
        ? damageStates.value.find((element) => element.iid == iid.value)
        : null
    );

    const selectedDamageState = computed(() =>
      getSelectedDamageState.value != null
        ? getSelectedDamageState.value
        : currentDamageState.value
    );

    // Array of buttons
    const buttons = reactive([
      {
        name: "updateDamageState",
        icon: faEdit,
        route: "UpdateDamage",
      },
      {
        name: "editDamage",
        icon: faTools,
        route: "EditDamage",
      },
    ]);

    // define is loading
    const isDeleting = ref(false);
    const isFixing = ref(false);

    // push function
    const push = (route) => {
      router.push({ name: route });
    };

    const toMillimetre = function(measurement) {
      if (measurement == undefined) {
        return null;
      }
      let x = measurement.value;
      if (measurement.unit == "cm") {
        x = x * 10;
      } else if (measurement.unit == "dm") {
        x = x * 100;
      } else if (measurement.unit == "m") {
        x = x * 1000;
      }
      return x;
    };

    // delete function
    const deleteDamage = async function() {
      const alert = await alertController.create({
        header: i18n.t("deleteDamage"),
        message: i18n.t("confirmDeleteDamage"),
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
                .dispatch("damage/delete")
                .then(async (result) => {
                  isDeleting.value = false;
                  const toast = await toastController.create({
                    message: i18n.t("damageDeleted"),
                    duration: 2000,
                    color: "success",
                  });
                  toast.present();
                  router.push({ name: "Inspection" });
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

    // fix function
    const fixDamage = async function() {
      isFixing.value = true;
      store
        .dispatch("damage/fix", true)
        .then(async (result) => {
          isFixing.value = false;
          const toast = await toastController.create({
            message: i18n.t("damageFixed"),
            duration: 2000,
            color: "success",
          });
          toast.present();
        })
        .catch(async (error) => {
          isFixing.value = false;
          console.error(error);
          const toast = await toastController.create({
            message: "Error",
            duration: 2000,
            color: "danger",
          });
          toast.present();
        });
    };

    // fix function
    const unfixDamage = async function() {
      isFixing.value = true;
      store
        .dispatch("damage/fix", false)
        .then(async (result) => {
          isFixing.value = false;
          const toast = await toastController.create({
            message: i18n.t("damageUnfixed"),
            duration: 2000,
            color: "success",
          });
          toast.present();
        })
        .catch(async (error) => {
          isFixing.value = false;
          console.error(error);
          const toast = await toastController.create({
            message: "Error",
            duration: 2000,
            color: "danger",
          });
          toast.present();
        });
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
      faCheck,
      faTrash,
      faTimes,
      deleteDamage,
      fixDamage,
      unfixDamage,
      isFixing,
      isDeleting,
      damageData,
      currentDamageState,
      selectedDamageState,
      arrowBack,
      damageStates,
      idate,
      toMillimetre,
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

.background-primary {
  background-color: rgba(var(--ion-color-primary-rgb), 0.2);
}

.color-danger {
  color: var(--ion-color-danger);
}

@media (min-width: 576px) {
  .overflow-scroll {
    overflow: scroll;
    height: 100%;
  }
}
</style>
