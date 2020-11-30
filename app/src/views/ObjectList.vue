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
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form class="height-100" id="object-list" @submit.stop.prevent="submit">
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col size-md="6" size-lg="6" size-xs="12">
              <ion-searchbar
                debounce="100"
                :placeholder="$t('search')"
                @ionChange="search"
              ></ion-searchbar>
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
                    $router.push({
                      name: 'Object',
                      params: { oid: doc.id },
                      query: { from: $route.name },
                    })
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

    // define object list
    const list = computed(() => store.state.object.list);

    // define isLoading
    const isLoading = computed(() => store.state.object.isLoading);
    const searchValue = ref("");

    const search = function(value) {
      searchValue.value = value.detail.value;
    };

    const objects = computed(() => {
      if (list.value == null) {
        return [];
      } else if (searchValue.value == "") {
        return list.value;
      } else {
        return list.value.filter(
          (doc) =>
            doc.id.includes(searchValue.value) ||
            doc.chainage.includes(searchValue.value)
        );
      }
    });

    return {
      objects,
      isLoading,
      search,
      arrowBack,
    };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>
