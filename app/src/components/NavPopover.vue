<template>
  <ion-button @click="openPopover" fill="clear" slot="end"
    ><ion-icon slot="icon-only" :icon="ellipsisVertical"></ion-icon
  ></ion-button>
</template>

<script>
import { IonButton, IonIcon, popoverController } from "@ionic/vue";
import { defineComponent } from "vue";
import { ellipsisVertical } from "ionicons/icons";
import NavPopoverButtons from "@/components/NavPopoverButtons";

export default defineComponent({
  components: { IonButton, IonIcon },
  setup() {
    let popover;

    const closePopover = function() {
      if (popover) {
        popover.dismiss();
      }
    };

    const openPopover = async function(ev) {
      popover = await popoverController.create({
        component: NavPopoverButtons,
        componentProps: { close: closePopover },
        event: ev,
        translucent: true,
      });
      return popover.present();
    };

    return { ellipsisVertical, openPopover };
  },
});
</script>

<style>
ion-icon {
  color: white;
}
</style>
