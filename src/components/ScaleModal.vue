<template>
  <div class="modal-wrapper">
    <div class="modal">
      <div class="modal__container header">
        <p class="header__text">Масштабирование</p>
        <button class="header__button" @click="$emit('show')">x</button>
      </div>
      <label>
        Выберите способ изменения размера:
        <select v-model="type" @change="chooseType">
          <option value="pixels">В пикселях</option>
          <option value="persentage">В процентах</option>
        </select>
      </label>
      <div class="modal__container">
        <label class="modal__label">
          Ширина:
          <input
            class="input"
            type="number"
            min="1"
            v-model="width"
            @change="updateWidth"
          />
        </label>
        <label class="modal__label">
          Высота:
          <input
            class="input"
            type="number"
            min="1"
            v-model="height"
            @change="updateHeight"
          />
        </label>
      </div>
      <label>
        <input type="checkbox" v-model="proprtions" />
        Сохранить пропорции
      </label>
      <div class="modal__container">
        <p>Размер До: {{ resNow }} MP</p>
        <p>Размер После: {{ resAfter }} MP</p>
      </div>
      <label>
        Выберите алгоритм интерполяции:
        <select v-model="interpol">
          <option value="nearest">Ближайшие соседи</option>
        </select>
        <TooltipContainer
          text="Алгоритм ближайшего соседа выбирает значение из ближайшего
                пикселя к исходным координатам."
        />
      </label>
      <button class="button" @click="$emit('show'), $emit('resize')">
        Применить
      </button>
    </div>
  </div>
</template>
      
<script>
import TooltipContainer from "./TooltipContainer.vue";

export default {
  name: "ScaleModal",
  props: {
    nowW: Number,
    nowH: Number,
  },
  components: {
    TooltipContainer,
  },
  data() {
    return {
      type: "pixels",
      width: this.nowW,
      height: this.nowH,
      outputH: null,
      outputW: null,
      proprtions: false,
      interpol: "nearest",
    };
  },
  watch: {
    nowW: function (value) {
      this.width = value;
    },
    nowH: function (value) {
      this.height = value;
    },
  },
  computed: {
    resNow() {
      return Math.round((this.nowH * this.nowW) / 10000) / 100;
    },
    resAfter() {
      return Math.round((this.outputH * this.outputW) / 10000) / 100;
    },
  },
  methods: {
    chooseType() {
      if (this.type === "persentage") {
        this.width = (this.width / this.nowW) * 100;
        this.height = (this.height / this.nowH) * 100;
      } else {
        this.width = (this.width * this.nowW) / 100;
        this.height = (this.height * this.nowH) / 100;
      }
    },
    updateHeight() {
      if (this.proprtions) {
        let coef = this.nowW / this.nowH;
        this.width = Math.round(this.height * coef);
      }
      if (this.type === "persentage") {
        this.outputH = Math.round((this.height * this.nowH) / 100);
        this.outputW = Math.round((this.width * this.nowW) / 100);
      } else {
        this.outputH = this.height;
        this.outputW = this.width;
      }
    },
    updateWidth() {
      if (this.proprtions) {
        let coef = this.nowW / this.nowH;
        this.height = Math.round(this.width * coef);
      }
      if (this.type === "persentage") {
        this.outputH = Math.round((this.height * this.nowH) / 100);
        this.outputW = Math.round((this.width * this.nowW) / 100);
      } else {
        this.outputH = this.height;
        this.outputW = this.width;
      }
    },
  },
};
</script>
      
<style lang="scss" scoped>
label {
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 5px;
}
.modal-wrapper {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  height: 40vh;
  width: 30vw;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  opacity: 1;

  &__container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }
  &__label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.header {
  &__text {
    font-size: 20px;
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
.button {
  background-color: #b7a7ae;
  padding: 10px;
  border-radius: 5px;
  color: #1c252c;
  border: none;
  cursor: pointer;
  width: fit-content;
  font-weight: bold;
}
.input {
  height: 30px;
  border-radius: 5px;
  background-color: #f6f2f6;
  border-color: #1c252c;
  color: #1c252c;
  text-align: center;
  margin-top: 5px;
}
</style>
      