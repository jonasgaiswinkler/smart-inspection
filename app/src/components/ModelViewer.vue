<template>
  <div style="height: 100%; width: 100%" id="modelContainer">
    <canvas id="myCanvas" style="height: 100%; width: 100%"></canvas>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { Viewer } from "@xeokit/xeokit-sdk/src/viewer/Viewer";
import { STLLoaderPlugin } from "@xeokit/xeokit-sdk/src/plugins/STLLoaderPlugin/STLLoaderPlugin";
import { AnnotationsPlugin } from "@xeokit/xeokit-sdk/src/plugins/AnnotationsPlugin/AnnotationsPlugin";

export default defineComponent({
  name: "model-viewer",
  props: ["url", "fileName", "location"],
  emits: ["placed"],
  data() {
    return {
      annotation: null,
      annotations: null,
      coords: null,
      viewer: null,
      lastMarker: null,
    };
  },
  methods: {
    placeMarker(coords) {
      if (this.annotations != null) {
        if (this.annotation != null) {
          this.annotation.destroy();
        }

        this.$emit("placed", coords);

        this.lastMarker = coords;

        this.annotation = this.annotations.createAnnotation({
          id: "myAnnotation",
          worldPos: [coords.x, coords.y, coords.z], // <<------- initializes worldPos and entity from PickResult
          occludable: false, // Optional, default is true
          markerShown: true, // Optional, default is true
          values: {
            // HTML template values
            glyph: "A",
          },
        });
      }
    },
    getImage() {
      if (this.viewer) {
        return this.b64toBlob(
          this.viewer.getSnapshot({
            format: "png",
          })
        );
      } else {
        return null;
      }
    },
    b64toBlob(dataURI) {
      const byteString = atob(dataURI.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/png" });
    },
  },
  mounted() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const vm = this;
    this.viewer = new Viewer({
      canvasId: "myCanvas",
      transparent: true,
    });

    this.viewer.camera.orbitPitch(-90);
    this.viewer.camera.worldAxis = [
      1,
      0,
      0, // Right
      0,
      0,
      1, // Up
      0,
      -1,
      0, // Forward
    ];

    //------------------------------------------------------------------------------------------------------------------
    // Load STL model and fit it to view, then start orbiting the camera
    //------------------------------------------------------------------------------------------------------------------

    const stlLoader = new STLLoaderPlugin(this.viewer);

    const model = stlLoader.load({
      id: "myModel",
      src: this.url,
      smoothNormals: true,
      rotate: [90, 0, 0],
    });

    model.on("loaded", () => {
      this.viewer.cameraFlight.jumpTo(model);
    });

    this.annotations = new AnnotationsPlugin(this.viewer, {
      markerHTML:
        "<div class='annotation-marker' style='background-color: {{markerBGColor}};'>{{glyph}}</div>",
      labelHTML:
        "<div class='annotation-label' style='background-color: {{labelBGColor}};'><div class='annotation-title'>{{title}}</div><div class='annotation-desc'>{{description}}</div></div>",

      values: {
        markerBGColor: "red",
        glyph: "X",
        title: "Untitled",
        description: "No description",
      },

      // Amount to offset each Annotation from its Entity surface (0.3 is the default value).
      // This is useful when the Annotation is occludable, which is when it is hidden when occluded
      // by other objects. When occludable, there is potential for the Annotation#worldPos to become
      // visually embedded within the surface of its Entity when viewed from a distance. This happens
      // as a result of limited GPU accuracy GPU accuracy, especially when the near and far view-space clipping planes,
      // specified by Perspective#near and Perspective#far, or Ortho#near and Perspective#far, are far away from each other.
      //
      // Offsetting the Annotation may ensure that it does become visually embedded within its Entity. We may also
      // prevent this by keeping the distance between the view-space clipping planes to a minimum. In general, a good
      // default value for Perspective#far and Ortho#far is around ````2.000````.

      surfaceOffset: 0.3,
      container: document.getElementById("modelContainer"),
    });

    this.annotations.on("markerClicked", (annotation) => {
      annotation.labelShown = !annotation.labelShown;
    });

    //------------------------------------------------------------------------------------------------------------------
    // Use the AnnotationsPlugin to create an annotation wherever we click on an object
    //------------------------------------------------------------------------------------------------------------------

    this.viewer.scene.input.on("mouseclicked", (coords) => {
      const pickResult = this.viewer.scene.pick({
        canvasPos: coords,
        pickSurface: true, // <<------ This causes picking to find the intersection point on the entity
      });

      if (pickResult) {
        vm.placeMarker({
          x: pickResult.worldPos[0],
          y: pickResult.worldPos[1],
          z: pickResult.worldPos[2],
        });
      }
    });

    window.viewer = this.viewer;

    if (this.location) {
      this.placeMarker(this.location);
    }
  },
  beforeUnmount() {
    if (this.viewer != null) {
      this.viewer.destroy();
    }
  },
});
</script>

<style>
.annotation-marker {
  color: #ffffff;
  line-height: 1.8;
  text-align: center;
  font-family: "monospace";
  font-weight: bold;
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 15px;
  border: 2px solid #ffffff;
  background: black;
  visibility: hidden;
  box-shadow: 5px 5px 15px 1px #000000;
  z-index: 0;
}

.annotation-label {
  pointer-events: none;
  position: absolute;
  max-width: 250px;
  min-height: 50px;
  padding: 8px;
  padding-left: 12px;
  padding-right: 12px;
  background: #ffffff;
  color: #000000;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 8px;
  border: #ffffff solid 2px;
  box-shadow: 5px 5px 15px 1px #000000;
  z-index: 90000;
}

.annotation-label:after {
  content: "";
  position: absolute;
  border-style: solid;
  border-width: 8px 12px 8px 0;
  border-color: transparent white;
  display: block;
  width: 0;
  z-index: 1;
  margin-top: -11px;
  left: -12px;
  top: 20px;
}

.annotation-label:before {
  content: "";
  position: absolute;
  border-style: solid;
  border-width: 9px 13px 9px 0;
  border-color: transparent #ffffff;
  display: block;
  width: 0;
  z-index: 0;
  margin-top: -12px;
  left: -15px;
  top: 20px;
}

.annotation-title {
  font: normal 20px arial, serif;
  margin-bottom: 8px;
}

.annotation-desc {
  font: normal 14px arial, serif;
}
</style>
