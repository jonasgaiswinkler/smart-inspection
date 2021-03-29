<template>
  <ion-item :disabled="disabled">
    <ion-label class="ion-hide-sm-down">{{ label }}</ion-label>
    <ion-label class="ion-hide-sm-up">{{ labelSm }}</ion-label>
    <ion-input
      v-if="showName"
      v-model="name"
      :placeholder="$t('name')"
      class="ion-text-right"
      :required="required && showName"
    ></ion-input>
    <ion-input
      v-model="number"
      :placeholder="$t('value')"
      type="number"
      step="any"
      class="ion-text-right"
      :required="required"
    ></ion-input>
    <ion-select
      v-model="unit"
      :placeholder="$t('pleasechoose')"
      interface="popover"
      aria-required="required"
    >
      <ion-select-option value="mm">mm</ion-select-option>
      <ion-select-option value="cm">cm</ion-select-option>
      <ion-select-option value="dm">dm</ion-select-option>
      <ion-select-option value="m">m</ion-select-option>
    </ion-select>
  </ion-item>
</template>

<script>
// Imports
import {
  IonItem,
  IonInput,
  IonSelect,
  IonLabel,
  IonSelectOption,
} from "@ionic/vue";
import { defineComponent, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "MeasurementInput",
  components: {
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
  },
  props: ["disabled", "label", "labelSm", "value", "showName", "required"],
  emits: ["input"],
  setup(props, { emit }) {
    // define i18n
    const i18n = useI18n();

    const name = ref(props.value.name != null ? props.value.name : "");
    const number = ref(
      props.value.value != null ? props.value.value.toString() : ""
    );
    const unit = ref(props.value.unit != null ? props.value.unit : "mm");

    watch(
      () => props.value,
      (value) => {
        if (props.showName) {
          name.value = value.name != null ? value.name : "";
        }
        number.value = value.value != null ? value.value.toString() : "";
        unit.value = value.unit != null ? value.unit : "mm";
      },
      { deep: true }
    );

    watch([name, number, unit], () => {
      const result = {
        value: number.value != "" ? parseFloat(number.value) : null,
        unit: unit.value != "" ? unit.value : "mm",
      };
      if (props.showName) {
        result.name = name.value != "" ? name.value : null;
      }

      emit("input", result);
    });

    return { name, number, unit };
  },
});
</script>

<style scoped></style>
