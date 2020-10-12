<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>smart inspection</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form class="height-100" id="login" @submit.stop.prevent="submit">
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col
              class="ion-align-self-center"
              size-md="6"
              size-lg="5"
              size-xs="12"
            >
              <div class="ion-text-center">
                <h3>{{ $t("welcomeText") }}</h3>
              </div>
              <div class="ion-padding">
                <ion-item>
                  <ion-input
                    v-model="email"
                    name="email"
                    type="email"
                    :placeholder="$t('email')"
                    required
                  ></ion-input>
                </ion-item>
                <ion-item>
                  <ion-input
                    v-model="password"
                    name="password"
                    type="password"
                    :placeholder="$t('password')"
                    required
                  ></ion-input>
                </ion-item>
              </div>
              <div class="ion-padding">
                <ion-button type="submit" expand="block">{{
                  $t("login")
                }}</ion-button>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { ref } from "vue";
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
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
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
    IonInput,
    IonButton,
  },
  setup() {
    const email = ref("");
    const password = ref("");

    const submit = () => {
      //
    };
    
    return { email, password, submit };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}
</style>