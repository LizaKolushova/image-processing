<template>
  <div class="modal">
    <div class="modal__container header">
      <p class="header__text">Градационное преобразование</p>
      <button class="header__button" @click="$emit('show')">x</button>
    </div>
    <div class="modal__line">
      <canvas id="chart" width="200" height="200" ref="chart"></canvas>
    </div>
    <div class="modal__line">
      <div class="modal__element">
        <label class="modal__label">
          X1:
          <input
            type="number"
            v-model="x1"
            class="modal__input"
            min="0"
            max="254"
          />
        </label>
      </div>
      <div class="modal__element">
        <label class="modal__label">
          Y1:
          <input
            type="number"
            v-model="y1"
            class="modal__input"
            min="1"
            max="255"
          />
        </label>
      </div>
    </div>
    <div class="modal__line">
      <div class="modal__element">
        <label class="modal__label">
          X2:
          <input
            type="number"
            v-model="x2"
            class="modal__input"
            min="0"
            max="254"
          />
        </label>
      </div>
      <div class="modal__element">
        <label class="modal__label">
          Y2:
          <input
            type="number"
            v-model="y2"
            class="modal__input"
            min="1"
            max="255"
          />
        </label>
      </div>
    </div>
    <div class="modal__line">
      <label>
        <input type="checkbox" v-model="prewiev" @change="applyPrewiev" />
        Включить предпросмотр
      </label>
    </div>
    <div class="modal__line">
      <button class="button" @click="correctImage(), $emit('apply')">
        Применить
      </button>
      <button class="button" @click="reset">Сбросить</button>
    </div>
  </div>
</template>
<script>
import Chart from "chart.js/auto";
export default {
  name: "CorrectionModal",
  props: {
    dx: Number,
    dy: Number,
    nowW: Number,
    nowH: Number,
    ctxRef: CanvasRenderingContext2D,
    showCorrectionModal: Boolean,
    startImage: Object,
  },
  data() {
    return {
      imgData: {},
      chartInstance: null,
      chartRef: null,
      prewiev: false,
      x1: 0,
      x2: 255,
      y1: 0,
      y2: 255,
    };
  },
  mounted() {
    this.chartRef = this.$refs.chart;
  },
  methods: {
    reset() {
      this.x1 = 0;
      this.x2 = 255;
      this.y1 = 0;
      this.y2 = 255;
    },
    normalizeHistogram(histogram) {
      const max = Math.max(...histogram);
      return histogram.map((value) => (value / max) * 255);
    },
    applyPrewiev() {
      if (this.prewiev) {
        this.correctImage();
        this.calculate();
      } else {
        this.ctxRef.drawImage(
          this.startImage,
          this.dx,
          this.dy,
          this.nowW,
          this.nowH
        );
        this.calculate();
      }
    },
    correctImage() {
      this.ctxRef.drawImage(
        this.startImage,
        this.dx,
        this.dy,
        this.nowW,
        this.nowH
      );
      let lut = [];
      for (let i = 0; i < this.x1; i++) {
        lut[i] = this.y1;
      }
      for (let i = this.x1; i < this.x2; i++) {
        const slope = (this.y2 - this.y1) / (this.x2 - this.x1);
        let correctedValue = this.y1 + slope * (i - this.x1);
        correctedValue = Math.max(0, Math.min(255, correctedValue));
        lut[i] = correctedValue;
      }
      for (let i = this.x2; i < 256; i++) {
        lut[i] = this.y2;
      }

      const imageData = this.ctxRef.getImageData(
        this.dx,
        this.dy,
        this.nowW,
        this.nowH
      );
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = lut[data[i]];
        data[i + 1] = lut[data[i + 1]];
        data[i + 2] = lut[data[i + 2]];
      }

      this.ctxRef.putImageData(imageData, this.dx, this.dy);
    },
    calculate() {
      let R = new Array(256).fill(0);
      let G = new Array(256).fill(0);
      let B = new Array(256).fill(0);
      let image = this.ctxRef.getImageData(
        this.dx,
        this.dy,
        this.nowW,
        this.nowH
      );
      let data = image.data;
      for (let i = 0; i < data.length; i += 4) {
        let red = data[i];
        let green = data[i + 1];
        let blue = data[i + 2];
        R[red]++;
        G[green]++;
        B[blue]++;
      }
      R = this.normalizeHistogram(R);
      G = this.normalizeHistogram(G);
      B = this.normalizeHistogram(B);
      this.imgData = {
        R: R,
        G: G,
        B: B,
      };
    },
    drawHistograms(redHistogram, greenHistogram, blueHistogram) {
      const ctx = this.chartRef?.getContext("2d");

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      // Установка квадратного размера canvas
      const canvasSize = 600; // Размер стороны квадрата
      this.chartRef.width = canvasSize;
      this.chartRef.height = canvasSize;

      this.chartInstance = new Chart(ctx, {
        type: "scatter",
        data: {
          labels: Array.from({ length: 256 }, (_, i) => i),
          datasets: [
            {
              label: "Red",
              data: redHistogram.map((y, x) => ({ x, y })),
              backgroundColor: "rgba(255, 0, 0, 0.8)",
              borderColor: "rgba(255, 0, 0, 0.8)",
              showLine: false,
              pointStyle: "circle",
              pointRadius: 3,
            },
            {
              label: "Green",
              data: greenHistogram.map((y, x) => ({ x, y })),
              backgroundColor: "rgba(0, 255, 0, 0.8)",
              borderColor: "rgba(0, 255, 0, 0.8)",
              showLine: false,
              pointStyle: "circle",
              pointRadius: 3,
            },
            {
              label: "Blue",
              data: blueHistogram.map((y, x) => ({ x, y })),
              backgroundColor: "rgba(0, 0, 255, 0.8)",
              borderColor: "rgba(0, 0, 255, 0.8)",
              showLine: false,
              pointStyle: "circle",
              pointRadius: 3,
            },
            {
              label: "line",
              data: [
                { x: 0, y: this.y1 },
                { x: this.x1, y: this.y1 },
                { x: this.x2, y: this.y2 },
                { x: 255, y: this.y2 },
              ],
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 1,
              fill: false,
              showLine: true,
            },
          ],
        },
        options: {
          animation: false,
          aspectRatio: 1,
          scales: {
            x: {
              type: "linear",
              position: "bottom",
              min: 0,
              max: 260,
              ticks: {
                stepSize: 15, // или другой шаг, чтобы деления были удобными
              },
            },
            y: {
              beginAtZero: true,
              min: 0,
              max: 260,
              ticks: {
                stepSize: 15, // или другой шаг, чтобы деления были удобными
              },
            },
          },
        },
      });
    },
  },
  watch: {
    showCorrectionModal() {
      this.calculate();
    },
    imgData() {
      this.drawHistograms(this.imgData.R, this.imgData.G, this.imgData.B);
    },
    x1: function (value, old) {
      if (value >= 0 && value < this.x2) {
        this.calculate();
      } else {
        this.x1 = old;
        this.calculate();
      }
    },
    x2: function (value, old) {
      if (value >= 0 && value > this.x1) {
        this.calculate();
      } else {
        this.x2 = old;
        this.calculate();
      }
    },
    y1: function (value, old) {
      if (value >= 0 && value < this.y2) {
        this.calculate();
      } else {
        this.y1 = old;
        this.calculate();
      }
    },
    y2: function (value, old) {
      if (value >= 0 && value > this.y1) {
        this.calculate();
      } else {
        this.y2 = old;
        this.calculate();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.modal {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: white;
  width: 27vw;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  row-gap: 7px;

  &__container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &__line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  &__element {
    width: 100%;
    text-align: center;
  }

  &__label {
    display: flex;
    flex-direction: row;
    column-gap: 20px;
    align-items: center;
    justify-content: center;
  }

  &__input {
    width: 30%;
    border-radius: 6px;
    padding: 3px;
    border: 1px solid black;
  }
}

.color-button {
  appearance: none;
  cursor: pointer;
  border: none;
  border-radius: 0;
  width: 23px;
  height: 23px;
  &:checked {
    border: 2px solid black;
  }
}

.button {
  border: none;
  background-color: #b7a7ae;
  width: 90px;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  margin: 5px;
}
.header {
  &__text {
    font-size: 18px;
    font-weight: bold;
  }
  &__button {
    border: none;
    width: 1.5rem;
    line-height: 1.5rem;
    border-radius: 0.25rem;
    background-color: lightgray;
    color: rgb(57, 57, 57);
    cursor: pointer;
    &:hover {
      background-color: darkgray;
    }
  }
}
</style>