<template>
  <ion-app>
    <ion-router-outlet></ion-router-outlet>
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
import { defineComponent } from "vue";
import { VueCookieNext } from "vue-cookie-next";

export default defineComponent({
  name: "App",
  components: {
    IonApp,
    IonRouterOutlet,
  },
  mounted() {
    if (VueCookieNext.isCookieAvailable("locale")) {
      this.$i18n.locale = VueCookieNext.getCookie("locale");
    }
  },
  watch: {
    "$i18n.locale": function(locale) {
      VueCookieNext.setCookie("locale", locale);
    },
  },
});
</script>
