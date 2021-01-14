<template>
  <div
    ref="frame"
    style="width: 100%; height: 100%; overflow: scroll; position: relative"
  >
    <canvas id="backgroundCanvas" style="position: absolute; z-index: 0;" />
    <canvas
      id="canvas"
      style="position: absolute; z-index: 1;"
      @click="click"
    />
  </div>
  <div
    style="position: absolute; bottom: 20px; right: 20px; background: white; padding: 3px; border-radius: 3px; z-index: 2"
  >
    <ion-button @click="clearMarker">{{ $t("reset") }}</ion-button>
    <ion-button @click="doZoom(false)"
      ><font-awesome-icon
        slot="icon-only"
        :icon="faMinus"
        full-width
      ></font-awesome-icon
    ></ion-button>
    <ion-button @click="doZoom(true)"
      ><font-awesome-icon
        slot="icon-only"
        :icon="faPlus"
        full-width
      ></font-awesome-icon
    ></ion-button>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-var-requires */
// Imports
import { defineComponent } from "vue";
const PDFJS = require("pdfjs-dist/build/pdf.js");
import PDFJSWorker from "pdfjs-dist/build/pdf.worker.js";
PDFJS.GlobalWorkerOptions.workerSrc = PDFJSWorker;
import { debounce } from "debounce";
import { IonButton } from "@ionic/vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPlus, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";

export default defineComponent({
  name: "si-canvas",
  components: {
    IonButton,
    "font-awesome-icon": FontAwesomeIcon,
  },
  props: ["url", "fileName", "location"],
  emits: ["placed"],
  data() {
    return {
      background: null,
      bctx: null,
      canvas: null,
      ctx: null,
      page: null,
      image: null,
      zoom: 1,
      scale: 1,
      renderTask: null,
      doc: null,
      lastMarker: null,
      faPlus: faPlus,
      faMinus: faMinus,
      faTimes: faTimes,
      listener: () => {
        this.$nextTick(() => {
          setTimeout(() => {
            this.renderFile();
          }, 100);
        });
      },
    };
  },
  methods: {
    doZoom(closer) {
      if (closer) {
        this.zoom++;
        this.renderFile();
      } else if (this.zoom != 1) {
        this.zoom--;
        this.renderFile();
      }
    },
    click(event) {
      this.placeMarker(event.offsetX / this.scale, event.offsetY / this.scale);
    },
    placeMarker(x, y) {
      this.clearCtx();
      this.drawMarker(this.ctx, x, y);
      this.lastMarker = { x: x, y: y };
      this.$emit("placed", { x: x, y: y });
    },
    clearMarker() {
      this.clearCtx();
      this.lastMarker = null;
      this.$emit("placed", null);
    },
    clearCtx() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    clearBctx() {
      this.bctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    async getBlob() {
      if (this.location != null) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.renderTask != null) {
          await this.renderTask.promise;
        }

        this.drawMarker(
          this.bctx,
          this.location.x,
          this.location.y
        );
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const vm = this;
        return await new Promise(function(resolve, reject) {
          vm.background.toBlob(function(blob) {
            vm.bctx.clearRect(0, 0, vm.background.width, vm.background.height);
            vm.renderFile();
            vm.drawMarker(
              vm.ctx,
              vm.location.x,
              vm.location.y
            );
            resolve(blob);
          });
        });
      } else {
        return null;
      }
    },
    drawMarker(ctx, x, y) {
      ctx.save();
      ctx.translate(x * this.scale, y * this.scale);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(2, -10, -25, -35, 0, -40);
      ctx.bezierCurveTo(25, -35, -2, -10, 0, 0);
      ctx.fillStyle = "#005096";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 0;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -29, 5, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = "white";
      ctx.fill();

      ctx.restore();
    },
    renderFile: async function() {
      if (this.getFileExtension === ".pdf" && this.page != null) {
        if (this.renderTask != null) {
          //this.renderTask.cancel();
          try {
            this.renderTask.cancel();
            await this.renderTask.promise;
          } catch (error) {
            this.renderTask = null;
          }
        }
        this.replaceBackgroundCanvas();
        this.page.cleanup();
        const height = this.$refs.frame.clientHeight;
        const width = this.$refs.frame.clientWidth;
        const pageViewport = this.page.getViewport({ scale: 1 });

        this.scale =
          Math.max(width / pageViewport.width, height / pageViewport.height) *
          this.zoom;

        const viewport = this.page.getViewport({
          scale: this.scale,
        });
        this.background.width = viewport.width;
        this.background.height = viewport.height;
        this.canvas.width = viewport.width;
        this.canvas.height = viewport.height;

        if (this.location != null) {
          this.placeMarker(
            this.location.x,
            this.location.y
          );
        }

        this.renderPDF(viewport);
      } else if (this.image != null) {
        const height = this.$refs.frame.clientHeight;
        const width = this.$refs.frame.clientWidth;

        this.scale =
          Math.max(width / this.image.width, height / this.image.height) *
          this.zoom;

        const imgWidth = this.image.width * this.scale;
        const imgHeight = this.image.height * this.scale;

        this.background.width = imgWidth;
        this.background.height = imgHeight;
        this.canvas.width = imgWidth;
        this.canvas.height = imgHeight;
        this.bctx.drawImage(this.image, 0, 0, imgWidth, imgHeight); // Or at whatever offset you like
        if (this.location != null) {
          this.placeMarker(
            this.location.x,
            this.location.y
          );
        }
      }
    },
    renderPDF: debounce(async function(viewport) {
      this.renderTask = this.page.render({
        canvasContext: this.bctx,
        viewport: viewport,
      });
      this.renderTask.promise.then(() => {
        this.renderTask = null;
      });
    }, 1),
    getPage(renderPage) {
      PDFJS.getDocument(this.url).promise.then((doc) => {
        this.doc = doc;
        doc.getPage(1).then((page) => {
          this.page = page;
          if (renderPage) {
            this.renderFile();
          }
        });
      });
    },
    getImage(renderImage) {
      const img = new Image();
      img.src = this.url;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        this.image = img;
        if (renderImage) {
          this.renderFile();
        }
      };
    },
    replaceBackgroundCanvas() {
      const newCanvas = document.createElement("canvas");
      newCanvas.style.zIndex = "0";
      newCanvas.style.position = "absolute";
      newCanvas.id = "backgroundCanvas";
      this.background.replaceWith(newCanvas);
      this.background = document.getElementById("backgroundCanvas");
      this.bctx = this.background.getContext("2d");
    },
  },
  watch: {
    url() {
      this.getPage(true);
    },
    location() {
      if (this.location != null) {
        if (
          this.lastMarker == null ||
          (this.lastMarker.x != this.location.x &&
            this.lastMarker.y != this.location.y)
        ) {
          this.placeMarker(this.location.x, this.location.y);
        }
      } else {
        this.clearCtx();
      }
    },
  },
  computed: {
    getFileExtension() {
      return this.fileName != undefined
        ? this.fileName.match(/\.[0-9a-z]+$/i)[0]
        : null;
    },
  },
  mounted() {
    this.background = document.getElementById("backgroundCanvas");
    this.bctx = this.background.getContext("2d");
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    if (this.getFileExtension === ".pdf") {
      this.getPage(true);
    } else {
      this.getImage(true);
    }
    window.addEventListener("resize", this.listener);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.listener);
  },
});
</script>

<style scoped></style>
