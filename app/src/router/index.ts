import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import ObjectForm from "@/views/ObjectForm.vue";
import ObjectList from "@/views/ObjectList.vue";
import Object from "@/views/Object.vue";
import ObjectDeletion from "@/views/ObjectDeletion.vue";
import InspectionForm from "@/views/InspectionForm.vue";
import Inspection from "@/views/Inspection.vue";
import InspectionList from "@/views/InspectionList.vue";
import DamageForm from "@/views/DamageForm.vue";
import Damage from "@/views/Damage.vue";
import DamageList from "@/views/DamageList.vue";
import Settings from "@/views/Settings.vue";
import AssessmentForm from "@/views/AssessmentForm.vue";
import ModelViewer from "@/components/ModelViewer.vue";

const base = "/";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/new-object",
    name: "NewObject",
    component: ObjectForm,
  },
  {
    path: "/object-list",
    name: "ObjectList",
    component: ObjectList,
  },
  {
    path: "/object-deletion",
    name: "ObjectDeletion",
    component: ObjectDeletion,
  },
  {
    path: "/inspection-list",
    name: "InspectionListGlobal",
    component: InspectionList,
  },
  {
    path: "/object/:oid",
    name: "Object",
    component: Object,
  },
  {
    path: "/object/:oid/damage-list",
    name: "DamageListObject",
    component: DamageList,
  },
  {
    path: "/object/:oid/edit",
    name: "EditObject",
    component: ObjectForm,
  },
  {
    path: "/object/:oid/new-inspection",
    name: "NewInspection",
    component: InspectionForm,
  },
  {
    path: "/object/:oid/inspection-list",
    name: "InspectionListObject",
    component: InspectionList,
  },
  {
    path: "/object/:oid/inspection/:idate",
    name: "Inspection",
    component: Inspection,
  },
  {
    path: "/object/:oid/inspection/:idate/edit",
    name: "EditInspection",
    component: InspectionForm,
  },
  {
    path: "/object/:oid/inspection/:idate/damage-list",
    name: "DamageListInspection",
    component: DamageList,
  },
  {
    path: "/object/:oid/inspection/:idate/new-damage",
    name: "NewDamage",
    component: DamageForm,
  },
  {
    path: "/object/:oid/inspection/:idate/assessment",
    name: "AssessmentForm",
    component: AssessmentForm,
  },
  {
    path: "/object/:oid/inspection/:idate/damage/:did",
    name: "Damage",
    component: Damage,
  },
  {
    path: "/object/:oid/inspection/:idate/damage/:did/edit",
    name: "EditDamage",
    component: DamageForm,
  },
  {
    path: "/object/:oid/inspection/:idate/damage/:did/update",
    name: "UpdateDamage",
    component: DamageForm,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/model",
    name: "Model",
    component: ModelViewer
  }
];

const router = createRouter({
  history: createWebHistory(base),
  routes,
});

export default router;
