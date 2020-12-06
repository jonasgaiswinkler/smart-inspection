<template>
  <ion-item v-if="error" color="danger">
    <ion-label>{{ $t("pleaseChooseOption") }}</ion-label>
  </ion-item>
  <ion-item
    :style="{
      '--border-color': getColor(value),
      '--border-width': '3px',
    }"
    :disabled="disabled"
  >
    <ion-select
      :placeholder="$t('pleasechoose')"
      interface="popover"
      :interface-options="{
        cssClass: 'assessment-interface',
      }"
      :value="value"
      @ionChange="input($event)"
      aria-required="required"
    >
      <ion-select-option
        v-for="i of 5"
        :key="i"
        :value="i"
        :class="['interface-' + i]"
        >{{ i + " - " + $t("assessments." + i) }}</ion-select-option
      >
    </ion-select>
  </ion-item>
</template>

<script>
// Imports
import {
  IonRow,
  IonCol,
  IonGrid,
  IonRadioGroup,
  IonRadio,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { defineComponent, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "AssessmentInput",
  components: {
    // IonGrid,
    // IonRow,
    // IonCol,
    // IonRadioGroup,
    // IonRadio,
    IonLabel,
    IonItem,
    IonSelect,
    IonSelectOption,
  },
  props: ["value", "disabled", "error"],
  emits: ["input"],
  setup(props, { emit }) {
    const getColor = function(grade) {
      if (grade === 1) {
        return "#92d050";
      } else if (grade === 2) {
        return "#ffff00";
      } else if (grade === 3) {
        return "#ffc000";
      } else if (grade === 4) {
        return "#ff6600";
      } else if (grade === 5) {
        return "#ff0000";
      } else {
        return null;
      }
    };

    const input = function(event) {
      emit("input", event.target.value);
    };

    return {
      getColor,
      input,
    };
  },
});
</script>

<style>
.assessment-interface .interface-1 {
  --border-width: 3px;
  --border-color: #92d050;
}

.assessment-interface .interface-2 {
  --border-width: 3px;
  --border-color: #ffff00;
}

.assessment-interface .interface-3 {
  --border-width: 3px;
  --border-color: #ffc000;
}

.assessment-interface .interface-4 {
  --border-width: 3px;
  --border-color: #ff6600;
}

.assessment-interface .interface-5 {
  --border-width: 3px;
  --border-color: #ff0000;
}
</style>
