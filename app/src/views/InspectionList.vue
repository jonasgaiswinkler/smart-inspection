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
              <ion-searchbar
                debounce="100"
                type="number"
                :placeholder="$t('search')"
                @ionChange="search"
              ></ion-searchbar>
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
    //IonSelect,
    //IonSelectOption,
    //IonInput,
    IonButton,
    IonLabel,
    IonList,
    IonListHeader,
    IonIcon,
    //IonBackButton,
    IonButtons,
    //IonSpinner,
    //IonTextarea
  },
  setup() {
    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();

    // define firestore
    const db = firebase.firestore();

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

    const inspections = computed(() => {
      if (list.value == null) {
        return [];
      } else if (searchValue.value == "") {
        return list.value;
      } else {
        return list.value.filter((doc) => doc.text.includes(searchValue.value));
      }
    });

    return {
      inspections,
      isLoading,
      search,
      arrowBack,
      routeName,
      oid,
      list,
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>
