<template>
  <div class="content">
    <button
      class="button"
      @click="$emit('show')"
      title="Загрузка изображения через файл или по ссылке, сброс изображения"
    >
      <img
        class="button__img"
        src="@/assets/formkit_download.svg"
        alt="Загрузка"
      />
    </button>
    <button
      class="button"
      :disabled="!startImage"
      @click="$emit('save')"
      title="Сохранение изображения"
    >
      <img class="button__img" src="@/assets/save.svg" alt="Сохранить" />
    </button>
    <button
      class="button"
      :disabled="!startImage"
      @click="$emit('scale')"
      title="Изменение масштаба изображения в пикселях или в процентах"
    >
      <img
        class="button__img"
        src="@/assets/plus-minus.svg"
        alt="Масштабировать"
      />
    </button>
    <button
      class="button"
      :disabled="!startImage"
      :class="{ active: isPippet }"
      @click="$emit('pippet')"
      title="Инструмент пипетка, чтобы выбрать цвет на изображении"
    >
      <img
        class="button__img"
        src="@/assets/pepicons-pencil_color-picker.svg"
        alt="Пипетка"
      />
    </button>
    <button
      class="button"
      :disabled="!startImage"
      :class="{ active: isArm }"
      @click="$emit('arm')"
      title="Переместите изображение по холсту"
    >
      <img class="button__img" src="@/assets/hand.svg" alt="Перемещение" />
    </button>

    <button
      class="button"
      :disabled="!startImage"
      :class="{ active: isCurves }"
      @click="$emit('curve')"
      title="Отредактируйте текущее изображение"
    >
      <img
        class="button__img"
        src="@/assets/chart-line-up.svg"
        alt="Градационные преобразования"
      />
    </button>
    <button
      class="button"
      :disabled="!startImage"
      :class="{ active: isFiltering }"
      @click="$emit('filtering')"
      title="Применить фильтры к текущему изображению"
    >
      <img class="button__img" src="@/assets/faders.svg" alt="Фильтрация" />
    </button>
  </div>
</template>
  
  <script>
export default {
  name: "HeaderPanel",
  props: {
    state: String,
    startImage: Object,
  },
  data() {
    return {
      new: null,
    };
  },

  methods: {},
  computed: {
    isPippet() {
      if (this.state == "pippet") {
        return true;
      } else {
        return false;
      }
    },
    isArm() {
      if (this.state == "arm") {
        return true;
      } else {
        return false;
      }
    },
    isCurves() {
      if (this.state == "curves") {
        return true;
      } else {
        return false;
      }
    },
    isFiltering() {
      if (this.state == "filter") {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.content {
  width: 50px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  background-color: #1c252c;
}
.button {
  background-color: #b7a7ae;
  padding: 10px;
  border-radius: 5px;
  color: #1c252c;
  border: none;
  margin-bottom: 10px;
  cursor: pointer;
  &__img {
    height: 20px;
  }

  &:disabled {
    background-color: rgb(141, 140, 140);
  }

  &:hover {
    background-color: rgb(141, 140, 140);
  }

  &.active {
    background-color: rgb(141, 140, 140);
  }
}
</style>
  