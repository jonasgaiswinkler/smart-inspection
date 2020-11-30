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
                        {{ $t("damage.type") }}
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
                          <ion-label>#{{ damage.did }}</ion-label>
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
                          <ion-label>{{ damage.type }}</ion-label>
                        </ion-col>
                      </ion-row></ion-grid
                    >
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

    const damages = computed(() => {
      if (list.value == null) {
        return [];
      } else if (searchValue.value == "") {
        return list.value;
      } else {
        return list.value.filter((doc) => doc.did.includes(searchValue.value));
      }
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
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>
