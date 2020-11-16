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
import Settings from "@/views/Settings.vue";

const base = "/smart-inspection/";

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
    path: "/object/:oid/inspection/:iid",
    name: "Inspection",
    component: Inspection,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];

const router = createRouter({
  history: createWebHistory(base),
  routes,
});

export default router;
