<template>
  <ion-list>
    <ion-item button @click="toSettings">
      <ion-label>{{ $t("settings") }}</ion-label>
    </ion-item>
    <ion-item button :href="getManualUrl()" target="_blank">
      <ion-label>{{ $t("manual") }}</ion-label>
    </ion-item>
  </ion-list>
</template>

<script>
import { IonList, IonItem, IonLabel } from "@ionic/vue";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  components: { IonList, IonItem, IonLabel },
  props: ["close"],
  setup(props) {
    // Define router
    const router = useRouter();

    // define i18n
    const i18n = useI18n();

    const toSettings = function() {
      props.close();
      router.push({
        name: "Settings",
        query: { from: router.currentRoute.value.name },
      });
    };

    const getManualUrl = function() {
      if (i18n.locale.value == "de") {
        return "/de/Anleitung.pdf";
      } else {
        return "/en/Manual.pdf";
      }
    };

    return { toSettings, getManualUrl };
  },
});
</script>
