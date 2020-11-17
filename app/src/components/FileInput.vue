<template>
  <ion-item :disabled="disabled">
    <ion-label>{{ label }}</ion-label>
    <ion-input
      readonly
      v-if="value != null && value.same !== true"
      :value="value != null ? value.name : null"
      class="ion-text-right"
      style="margin-right: 16px"
    ></ion-input>
    <ion-button
      v-if="value != null && value.same === true"
      :href="value.url"
      target="_blank"
      fill="clear"
      :disabled="disabled"
      slot="end"
      style="margin-right: 10px; margin-left: 0px"
      :aria-label="$t('download')"
      :title="$t('download')"
    >
      <font-awesome-icon
        slot="icon-only"
        :icon="faDownload"
        size="lg"
      ></font-awesome-icon>
    </ion-button>
    <ion-button
      v-if="value != null"
      @click="$emit('select', null)"
      fill="clear"
      :disabled="disabled"
      slot="end"
      style="margin-right: 10px; margin-left: 0px"
      :aria-label="$t('delete')"
      :title="$t('delete')"
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
      style="margin-left: 0px"
      :aria-label="$t('selectFile')"
      :title="$t('selectFile')"
    >
      <font-awesome-icon
        slot="icon-only"
        :icon="faFileUpload"
        size="lg"
      ></font-awesome-icon>
    </ion-button>
    <input
      @change="select($event.target.files[0])"
      type="file"
      ref="fileInput"
      style="display: none"
      :accept="accept"
    />
  </ion-item>
</template>

<script>
// Imports
import {
  IonItem,
  IonInput,
  IonButton,
  IonLabel,
  toastController,
} from "@ionic/vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faFileUpload,
  faTimes,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { defineComponent, ref } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "FileInput",
  components: {
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    "font-awesome-icon": FontAwesomeIcon,
  },
  props: ["disabled", "label", "value", "accept"],
  emits: ["select"],
  setup(props, { emit }) {
    // define i18n
    const i18n = useI18n();

    const fileInput = ref(null);

    const select = async function(file) {
      if (props.accept != undefined) {
        const types = props.accept.split(", ");
        if (types.includes(file.type)) {
          emit("select", file);
        } else {
          const toast = await toastController.create({
            message: i18n.t("wrongFileType"),
            duration: 2000,
            color: "danger",
          });
          toast.present();
        }
      } else {
        emit("select", file);
      }
    };
    return { faFileUpload, faTimes, fileInput, faDownload, select };
  },
});
</script>

<style scoped></style>
