<template>
  <ion-list>
    <ion-item button @click="toSettings">
      <ion-label>{{ $t("settings") }}</ion-label>
    </ion-item>
  </ion-list>
</template>

<script>
import { IonList, IonItem, IonLabel } from "@ionic/vue";
import { useRouter } from "vue-router";
import { defineComponent } from "vue";

export default defineComponent({
  components: { IonList, IonItem, IonLabel },
  props: ["close"],
  setup(props) {
    // Define router
    const router = useRouter();

    const toSettings = function() {
      props.close();
      router.push({
        name: "Settings",
        query: { from: router.currentRoute.value.name },
      });
    };

    return { toSettings };
  },
});
</script>
