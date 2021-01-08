<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Smart Inspection</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
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
              <ion-img
                class="fh-logo"
                src="./assets/icon/fh-logo.png"
                alt="Logo FH"
              ></ion-img>
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
                <ion-item v-if="!showResetPassword">
                  <ion-input
                    v-model="password"
                    name="password"
                    type="password"
                    :placeholder="$t('password')"
                    required
                  ></ion-input>
                </ion-item>
              </div>
              <ion-row
                v-if="!showResetPassword"
                class="ion-padding ion-float-right"
              >
                <ion-button
                  type="submit"
                  :aria-label="$t('login')"
                  :title="$t('login')"
                  >{{ $t("login") }}</ion-button
                >
              </ion-row>
              <ion-row
                v-if="!showResetPassword"
                class="ion-padding ion-float-right"
              >
                <ion-button
                  @click="showResetPassword = true"
                  fill="clear"
                  :aria-label="$t('resetPassword')"
                  :title="$t('resetPassword')"
                  >{{ $t("resetPassword") }}</ion-button
                >
              </ion-row>
              <ion-row
                v-if="showResetPassword"
                class="ion-padding ion-float-right"
              >
                <ion-button
                  @click="resetPassword"
                  :aria-label="$t('resetPassword')"
                  :title="$t('resetPassword')"
                  >{{ $t("resetPassword") }}</ion-button
                >
              </ion-row>
              <ion-row
                v-if="showResetPassword"
                class="ion-padding ion-float-right"
              >
                <ion-button
                  @click="showResetPassword = false"
                  fill="clear"
                  :aria-label="$t('back')"
                  :title="$t('back')"
                  >{{ $t("back") }}</ion-button
                >
              </ion-row>
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
  IonSpinner,
  toastController,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "Login",
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
    IonSpinner
  },
  setup() {
    // Define router
    const router = useRouter();

    // Define store
    const store = useStore();

    // define i18n
    const i18n = useI18n();

    // Define form values
    const email = ref("");
    const password = ref("");

    // Define reset password state
    const showResetPassword = ref(false);

    // Define reset password method
    const resetPassword = async function() {
      if (email.value !== "") {
        try {
          await store.dispatch("resetPassword", email.value);
          const toast = await toastController.create({
            message: i18n.t("resetEmailSend"),
            duration: 3000,
            color: "success",
          });
          toast.present();
          showResetPassword.value = false;
        } catch (error) {
          const toast = await toastController.create({
            message: error,
            duration: 3000,
            color: "danger",
          });
          toast.present();
        }
      } else {
        const toast = await toastController.create({
          message: i18n.t("noEmailAddress"),
          duration: 3000,
          color: "danger",
        });
        toast.present();
      }
    };

    // Define submit method
    const submit = async () => {
      if (showResetPassword.value === false) {
        await store.dispatch("login", {
          email: email.value,
          password: password.value,
        });
        if (store.state.redirect !== null) {
          const path = store.state.redirect;
          store.commit("setRedirect", null);
          router.push(path);
        } else {
          router.push({ name: "Home" });
        }
      }
    };

    return { email, password, submit, showResetPassword, resetPassword };
  },
});
</script>

<style scoped>
.height-100 {
  height: 100%;
}

.width-100 {
  width: 100%;
}

.fh-logo {
  height: 10em;
  width: auto;
  margin: auto;
  display: block;
}
</style>
