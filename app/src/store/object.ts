/* eslint-disable @typescript-eslint/no-use-before-define */
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";
import { parse } from "json2csv";

export default {
  namespaced: true,
  state: () => ({
    oid: null,
    data: null,
    photoUrl: null,
    requestedObjects: null,
    list: null,
    isLoading: false,
    currentAssessment: null,
    reports: null,
    reportMode: "object",
    reportIsLoading: false,
    reportsIsLoading: false,
    reportLocale: "de",
  }),
  mutations: {
    setOid(state: any, oid: string) {
      state.oid = oid;
    },
    setData(state: any, data: any) {
      state.data = data;
    },
    setPhotoUrl(state: any, photoUrl: string) {
      state.photoUrl = photoUrl;
    },
    clear(state: any) {
      state.data = null;
      state.photoUrl = null;
      state.currentAssessment = null;
      state.reports = null;
    },
    setRequestedObjects(state: any, requestedObjects: any) {
      state.requestedObjects = requestedObjects;
    },
    setList(state: any, list: any) {
      state.list = list;
    },
    setIsLoading(state: any, isLoading: any) {
      state.isLoading = isLoading;
    },
    setCurrentAssessment(state: any, currentAssessment: any) {
      state.currentAssessment = currentAssessment;
    },
    setReports(state: any, reports: any) {
      state.reports = reports;
    },
    setReportMode(state: any, reportMode: any) {
      state.reportMode = reportMode;
    },
    setReportIsLoading(state: any, reportIsLoading: any) {
      state.reportIsLoading = reportIsLoading;
    },
    setReportsIsLoading(state: any, reportsIsLoading: any) {
      state.reportsIsLoading = reportsIsLoading;
    },
    setReportLocale(state: any, reportLocale: any) {
      state.reportLocale = reportLocale;
    },
  },
  getters: {},
  actions: {
    async load(context: any) {
      context.commit("clear");
      const oid = context.state.oid;
      if (oid != null) {
        const db = firebase.firestore();
        const objectDoc = await db
          .collection("objects")
          .doc(oid)
          .get();
        if (objectDoc.exists) {
          const data = { ...objectDoc.data() };
          if (data?.deletionRequested) {
            return { status: 401 };
          }

          const storage = firebase.storage();

          const getFile = async function(key: string) {
            if (data[key] != null) {
              const url = await storage
                .ref("/objects/" + oid + "/" + data[key])
                .getDownloadURL();
              data[key + "Url"] = url;
            } else {
              data[key + "Url"] = null;
            }
          };

          const promises = [];
          promises.push(getFile("groundPlan"));
          promises.push(getFile("longitudinalSection"));
          promises.push(getFile("crossSection"));
          promises.push(getFile("model"));
          await Promise.all(promises);

          context.commit("setData", data);
          if (data != undefined && data.photo != null) {
            const photoUrl = await storage
              .ref("/objects/" + oid + "/" + data.photo)
              .getDownloadURL();
            context.commit("setPhotoUrl", photoUrl);
          }
          const assessmentDoc = await db
            .collection("objects")
            .doc(oid)
            .collection("assessments")
            .orderBy("date", "desc")
            .limit(1)
            .get();
          if (!assessmentDoc.empty) {
            context.commit(
              "setCurrentAssessment",
              assessmentDoc.docs[0].data()
            );
          }
          return { status: 200 };
        } else {
          return { status: 404 };
        }
      } else {
        return { status: 400 };
      }
    },
    async loadReports(context: any) {
      const db = firebase.firestore();
      const oid = context.state.oid;
      if (oid) {
        context.commit("setReportsIsLoading", true);
        try {
          const reportsSnap = await db
            .collection("objects")
            .doc(oid)
            .collection("reports")
            .orderBy("created", "desc")
            .get();
          if (!reportsSnap.empty) {
            const reports = [];

            const storage = firebase.storage();

            const getReport = async function(doc: any) {
              const object = {
                rid: doc.id,
                ...doc.data(),
              };
              const url = await storage
                .ref("/objects/" + oid + "/reports/" + doc.id + "/Bericht.pdf")
                .getDownloadURL();
              object.url = url;
              object.inspectionString = new Date(
                object.date
              ).toLocaleDateString("de-DE");
              object.createdString = object.created
                .toDate()
                .toLocaleDateString("de-DE");
              return object;
            };

            for (const reportDoc of reportsSnap.docs) {
              reports.push(getReport(reportDoc));
            }
            context.commit("setReports", await Promise.all(reports));
          } else {
            context.commit("setReports", null);
          }
        } catch (error) {
          console.error(error);
        }
        context.commit("setReportsIsLoading", false);
      }
    },
    loadList(context: any) {
      context.commit("setIsLoading", true);
      const db = firebase.firestore();
      db.collection("objects")
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            context.commit("setList", null);
          } else {
            const list = [];
            for (const doc of snapshot.docs) {
              const object = { ...doc.data() };
              object.id = doc.id;
              object.chainage = doc
                .data()
                .chainage.toFixed(3)
                .replace(".", ",");
              list.push(object);
            }
            context.commit("setList", list);
          }
          context.commit("setIsLoading", false);
        });
    },
    async requestDeletion(context: any) {
      const oid = context.state.oid;
      if (oid != null) {
        const db = firebase.firestore();
        await db
          .collection("objects")
          .doc(oid)
          .update({
            deletionRequested: true,
          });
        context.dispatch("getRequestedObjects");
        context.dispatch("loadList");
      }
    },
    async restoreObject(context: any, oid: string) {
      if (oid !== undefined && oid !== null && oid !== "") {
        const db = firebase.firestore();
        await db
          .collection("objects")
          .doc(oid)
          .update({
            deletionRequested: false,
          });
        context.dispatch("getRequestedObjects");
        context.dispatch("loadList");
      }
    },
    async getRequestedObjects(context: any) {
      if (context.rootState.userRole === "admin") {
        const db = firebase.firestore();
        const snapshot = await db
          .collection("objects")
          .where("deletionRequested", "==", true)
          .get();
        if (snapshot.empty) {
          context.commit("setRequestedObjects", null);
        } else {
          const list = [];
          for (const doc of snapshot.docs) {
            const object = { ...doc.data() };
            object.id = doc.id;
            object.chainage = doc
              .data()
              .chainage.toFixed(3)
              .replace(".", ",");
            list.push(object);
          }
          context.commit("setRequestedObjects", list);
        }
      }
    },
    async deleteObject(context: any, oid: string) {
      if (oid !== undefined && oid !== null && oid !== "") {
        const result = await firebase
          .functions()
          .httpsCallable("deleteObject")({ oid: oid });
        if (result.data.status !== 200) {
          throw new Error("Error in deleting object!");
        } else {
          context.dispatch("getRequestedObjects");
          context.dispatch("loadList");
        }
      }
    },
    async createReport(context: any) {
      const list = context.rootState.inspection.list;
      if (context.state.oid && list) {
        context.commit("setReportIsLoading", true);
        try {
          let iid;
          if (context.state.reportMode === "object") {
            iid = list[list.length - 1].iid;
          } else if (context.state.reportMode === "inspection") {
            iid = context.rootState.inspection.selectedReport;
          }
          const result = await firebase
            .functions()
            .httpsCallable("createReport")({
            oid: context.state.oid,
            iid: iid,
            type: context.state.reportMode,
            locale: context.state.reportLocale,
          });
          // if (result.data.status !== 200) {
          //   throw new Error("Error in deleting object!");
          // } else {
          //   //
          // }
          context.dispatch("loadReports");
        } catch (error) {
          console.error(error);
        }
        context.commit("setReportIsLoading", false);
      }
    },
    async deleteReport(context: any, rid: string) {
      if (rid && context.state.oid) {
        const result = await firebase
          .functions()
          .httpsCallable("deleteReport")({ oid: context.state.oid, rid: rid });
        if (result.data.status !== 200) {
          throw new Error("Error in deleting report!");
        } else {
          context.dispatch("loadReports");
        }
      }
    },
    async getCSV(context: any) {
      const oid = context.state.oid;
      if (oid) {
        const db = firebase.firestore();
        const damageSnap = await db
          .collection("objects")
          .doc(oid)
          .collection("damages")
          .get();

        if (damageSnap.empty) {
          return;
        }

        const damagePromises = [];

        const getDamage = async function(damageDoc: any) {
          const stateSnap = await damageDoc.ref
            .collection("states")
            .orderBy("date")
            .get();
          const states = [];
          for (const state of stateSnap.docs) {
            states.push(state.data());
          }
          return {
            ...damageDoc.data(),
            id: damageDoc.id,
            states: states,
          };
        };

        for (const damageDoc of damageSnap.docs) {
          damagePromises.push(getDamage(damageDoc));
        }

        const toMillimetre = function(measurement: any) {
          if (!measurement) {
            return null;
          }
          let x = measurement.value;
          if (measurement.unit === "cm") {
            x = x * 10;
          } else if (measurement.unit === "dm") {
            x = x * 100;
          } else if (measurement.unit === "m") {
            x = x * 1000;
          }
          return x;
        };

        const damages = await Promise.all(damagePromises);

        const data = [];
        for (const damage of damages) {
          for (const state of damage.states) {
            const newRow: any = {
              damage: damage.id,
              date: state.date,
            };

            if (damage.measurement1Name) {
              newRow.measurement1Name = damage.measurement1Name;
            }

            if (damage.measurement1Name && state.measurement1) {
              newRow.measurement1 = toMillimetre(state.measurement1);
            }

            if (state.limit) {
              newRow.limit = toMillimetre(state.limit);
            }

            if (damage.measurement2Name) {
              newRow.measurement2Name = damage.measurement2Name;
            }

            if (damage.measurement2Name && state.measurement2) {
              newRow.measurement2 = toMillimetre(state.measurement2);
            }

            data.push(newRow);
          }
        }

        const fields = [
          "damage",
          "date",
          "measurement1Name",
          "measurement1",
          "limit",
          "measurement2Name",
          "measurement2",
        ];
        const opts = { fields };

        try {
          const csv = parse(data, opts);
          return csv;
        } catch (err) {
          console.error(err);
          return;
        }
      }
    },
  },
};
