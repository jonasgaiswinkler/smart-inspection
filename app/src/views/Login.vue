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
              <ion-img class="fh-logo" src="assets/icon/fh-logo.png"></ion-img>
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
// Imports
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
  IonImg,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'

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
    IonImg,
  },
  setup() {
    // Define router
    const router = useRouter();

    // Define store
    const store = useStore();

    // Define form values
    const email = ref("");
    const password = ref("");

    // Define submit method
    const submit = async () => {
      await store.dispatch("login", {email: email.value, password: password.value});
      router.push({name: 'Home'});
    };

    return { email, password, submit };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}

.fh-logo {
  height: 10em;
  width: auto;
  margin: auto;
  display: block;
}
</style>