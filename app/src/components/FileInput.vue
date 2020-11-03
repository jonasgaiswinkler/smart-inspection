<template>
  <ion-item :disabled="disabled">
    <ion-label>{{ label }}</ion-label>
    <ion-input
      readonly
      :value="value != null ? value.name : null"
      class="ion-text-right"
      style="margin-right: 16px;"
    ></ion-input>
    <ion-button
      v-if="value != null"
      @click="$emit('select', null)"
      fill="clear"
      :disabled="disabled"
      slot="end"
      style="margin-right: 10px; margin-left: 0px;"
    >
      <font-awesome-icon
        slot="icon-only"
        :icon="faTimes"
        size="lg"
      ></font-awesome-icon>
    </ion-button>
    <ion-button
      @click="fileInput.click()"
      fill="clear"
      :disabled="disabled"
      slot="end"
      style="margin-left: 0px;"
    >
      <font-awesome-icon
        slot="icon-only"
        :icon="faFileUpload"
        size="lg"
      ></font-awesome-icon>
    </ion-button>
    <input
      @change="$emit('select', $event.target.files[0])"
      type="file"
      ref="fileInput"
      style="display: none"
    />
  </ion-item>
</template>

<script>
// Imports
import { IonItem, IonInput, IonButton, IonLabel } from "@ionic/vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faFileUpload, faTimes } from "@fortawesome/free-solid-svg-icons";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "FileInput",
  components: {
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    "font-awesome-icon": FontAwesomeIcon,
  },
  props: ["disabled", "label", "value"],
  emits: ["select"],
  setup() {
      const fileInput = ref(null);
    return { faFileUpload, faTimes, fileInput };
  },
});
</script>

<style scoped>
</style>