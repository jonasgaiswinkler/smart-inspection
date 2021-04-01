<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button
            @click="
              $router.push({
                name:
                  $route.query.from != undefined ? $route.query.from : 'Home',
              })
            "
            :aria-label="$t('back')"
            :title="$t('back')"
          >
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t("users") }}</ion-title>
        <ion-spinner
          v-if="$store.state.isLoading"
          slot="end"
          style="margin-right: 20px; color: white"
        ></ion-spinner>
        <nav-popover></nav-popover>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form class="height-100" id="object" @submit.stop.prevent="createUser">
        <ion-grid class="height-100">
          <ion-row
            color="primary"
            class="ion-justify-content-center height-100"
          >
            <ion-col
              size-md="12"
              size-lg="9"
              size-xl="8"
              size-xs="12"
              class="height-100"
            >
              <h2>
                {{ $t("newUser") }}
              </h2>
              <div>
                <ion-item>
                  <ion-label>{{ $t("name") }}</ion-label>
                  <ion-input
                    v-model="username"
                    class="ion-text-right"
                    required
                  ></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label>{{ $t("email") }}</ion-label>
                  <ion-input
                    v-model="email"
                    type="email"
                    class="ion-text-right"
                    required
                  ></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label>{{ $t("role") }}</ion-label>
                  <ion-select
                    :value="role"
                    @ionChange="role = $event.detail.value"
                    interface="popover"
                    class="ion-text-right"
                    required
                  >
                    <ion-select-option value="user">{{
                      $t("user")
                    }}</ion-select-option>
                    <ion-select-option value="admin">{{
                      $t("admin")
                    }}</ion-select-option>
                  </ion-select>
                </ion-item>
                <ion-row class="ion-align-items-center">
                  <div style="flex: 1"></div>
                  <ion-spinner
                    v-if="isLoadingUsers"
                    color="primary"
                  ></ion-spinner>
                  <ion-button
                    type="submit"
                    :disabled="isLoadingUsers"
                    class="ion-margin-start"
                    ><font-awesome-icon
                      :icon="faPlus"
                      style="margin-right: 10px"
                    ></font-awesome-icon
                    >{{ $t("newUser") }}</ion-button
                  >
                </ion-row>
              </div>
              <hr />
              <h3>
                {{ $t("list") }}
              </h3>
              <ion-progress-bar
                v-if="isLoadingUsers"
                type="indeterminate"
              ></ion-progress-bar>

              <ion-list>
                <ion-list-header>
                  <div style="float: left; width: 250px">
                    <ion-label> {{ $t("name") }} </ion-label>
                  </div>
                  <div
                    style="float: left; width: 250px"
                    class="ion-hide-md-down"
                  >
                    <ion-label>{{ $t("email") }}</ion-label>
                  </div>
                  <div
                    style="float: left; width: 250px"
                    class="ion-hide-md-down"
                  >
                    <ion-label> {{ $t("role") }} </ion-label>
                  </div>
                </ion-list-header>
                <ion-item v-for="user in users" :key="user.id">
                  <div style="float: left; width: 250px">
                    <ion-label>
                      {{ user.name }}
                    </ion-label>
                  </div>
                  <div
                    style="float: left; width: 250px"
                    class="ion-hide-md-down"
                  >
                    <ion-label>{{ user.email }}</ion-label>
                  </div>
                  <div
                    style="float: left; width: 250px"
                    class="ion-hide-md-down"
                  >
                    <ion-label>
                      {{ $t(user.role) }}
                    </ion-label>
                  </div>
                  <ion-button
                    v-if="$store.state.user.uid !== user.id"
                    @click="changeRole(user)"
                    fill="clear"
                    slot="end"
                    style="margin-left: 0.25em"
                    :title="$t('changeRole')"
                    :aria-label="$t('changeRole')"
                  >
                    <font-awesome-icon
                      slot="icon-only"
                      :icon="faUserCog"
                    ></font-awesome-icon>
                  </ion-button>
                  <ion-button
                    @click="deleteUser(user)"
                    fill="clear"
                    slot="end"
                    style="margin-left: 0.25em"
                    :title="$t('deleteObject')"
                    :aria-label="$t('deleteObject')"
                  >
                    <font-awesome-icon
                      slot="icon-only"
                      :icon="faTrash"
                    ></font-awesome-icon>
                  </ion-button>
                </ion-item>
                <ion-item v-if="!users">
                  <ion-label>{{ $t("noEntries") }}</ion-label>
                </ion-item>
              </ion-list>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </ion-content>
  </ion-page>
</template>

<script>
// Imports
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
  IonRadio,
  IonRadioGroup,
  IonInput,
  IonButton,
  IonList,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonIcon,
  IonListHeader,
  IonBackButton,
  IonButtons,
  IonTextarea,
  IonSpinner,
  IonProgressBar,
  IonImg,
  alertController,
  toastController,
} from "@ionic/vue";
import { computed, defineComponent, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { arrowBack } from "ionicons/icons";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
} from "@fortawesome/vue-fontawesome";
import {
  faPlus,
  faFile,
  faTools,
  faTrash,
  faList,
  faUserCog,
  faSquare,
  faDownload,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import NavPopover from "@/components/NavPopover";

export default defineComponent({
  name: "Reports",
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRow,
    IonGrid,
    IonList,
    IonCol,
    IonListHeader,
    //IonImg,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
    IonLabel,
    IonIcon,
    //IonBackButton,
    IonButtons,
    IonSpinner,
    IonProgressBar,
    // IonRadio,
    // IonRadioGroup,
    //IonTextarea,
    "font-awesome-icon": FontAwesomeIcon,
    //"font-awesome-layers": FontAwesomeLayers,
    "nav-popover": NavPopover,
  },
  setup() {
    // Define store
    const store = useStore();

    // Define router
    const router = useRouter();

    // define i18n
    const i18n = useI18n();

    // define users getter
    const users = computed(function() {
      if (store.state.users) {
        return store.state.users.filter((user) => user.deleted !== true);
      } else {
        return [];
      }
    });

    // is loading users
    const isLoadingUsers = computed(() => store.state.isLoadingUsers);

    const username = ref("");
    const email = ref("");
    const role = ref("user");

    const createUser = async function() {
      if (username.value && email.value && role.value) {
        try {
          await store.dispatch("createUser", {
            email: email.value,
            username: username.value,
            role: role.value,
          });

          const toast = await toastController.create({
            message: i18n.t("userCreated"),
            duration: 2000,
            color: "success",
          });
          toast.present();
          username.value = "";
          email.value = "";
          role.value = "user";
        } catch (error) {
          console.error(error);
          const toast = await toastController.create({
            message: error,
            duration: 4000,
            color: "danger",
          });
          toast.present();
        }
      } else {
        const toast = await toastController.create({
          message: "Error: Wrong email, username or role",
          duration: 2000,
          color: "danger",
        });
        toast.present();
      }
      store.commit("setIsLoadingUsers", false);
    };

    const changeRole = async function(user) {
      store.commit("setIsLoadingUsers", true);

      let role = "user";
      if (user.role === "user") {
        role = "admin";
      }
      await store.dispatch("setPermissions", {
        uid: user.id,
        role: role,
      });
      await store.dispatch("loadUsers");
      const toast = await toastController.create({
        message: i18n.t("roleChanged"),
        duration: 4000,
        color: "success",
      });
      toast.present();
      store.commit("setIsLoadingUsers", false);
    };

    // delete user function
    const deleteUser = async function(user) {
      const alert = await alertController.create({
        header: i18n.t("deleteUser"),
        message: i18n.t("confirmDeleteUser", { username: user.name }),
        buttons: [
          {
            text: i18n.t("cancel"),
            role: "cancel",
          },
          {
            text: i18n.t("confirm"),
            handler: async () => {
              store.commit("setIsLoadingUsers", true);
              try {
                await store.dispatch("deleteUser", user.id);

                const toast = await toastController.create({
                  message: i18n.t("userDeleted"),
                  duration: 2000,
                  color: "success",
                });
                toast.present();
              } catch (error) {
                console.error(error);
                const toast = await toastController.create({
                  message: error,
                  duration: 2000,
                  color: "danger",
                });
                toast.present();
              }
              store.commit("setIsLoadingUsers", false);
            },
          },
        ],
      });
      return alert.present();
    };

    return {
      faTrash,
      users,
      arrowBack,
      faSquare,
      faPlus,
      faDownload,
      isLoadingUsers,
      username,
      email,
      role,
      createUser,
      deleteUser,
      faUserCog,
      changeRole,
    };
  },
});
</script>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-grow-1 {
  flex-grow: 1;
}

.height-100 {
  height: 100%;
}

.width-100 {
  width: 100%;
}

.button-icon {
  width: 100% !important;
  height: 65% !important;
}

.text-overflow {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 576px) {
  .overflow-scroll {
    overflow: scroll;
    height: 100%;
  }
}
</style>
