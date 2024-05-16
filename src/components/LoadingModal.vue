<template>
  <div class="modal-wrapper">
    <div class="modal">
      <div class="modal__header header">
        <p class="header__text">Загрузка изображения</p>
        <button class="header__button" @click="$emit('show')">х</button>
      </div>
      <label>
        Загрузите файл
        <input
          class="input"
          type="file"
          ref="inputFile"
          @change="savenewFile"
        />
      </label>
      <label>
        Вставьте ссылку на картинку
        <input
          class="input"
          type="text"
          @change="savenewUrl"
          v-model="url"
          placeholder="Enter image URL"
        />
      </label>
      <div class="modal__line">
        <button
          class="button"
          @click="saveResult(), $emit('show'), $emit('download')"
        >
          Загрузить
        </button>
        <button class="button" @click="$emit('clear'), $emit('show')">
          Сбросить
        </button>
      </div>
    </div>
  </div>
</template>
    
    <script>
export default {
  name: "LoadingModal",
  data() {
    return {
      Url: null,
      File: null,
      url: null,
      result: null,
    };
  },
  mounted() {},
  methods: {
    async savenewUrl() {
      fetch(this.url)
        .then((response) => response.blob())
        .then((blob) => {
          this.File = new Image();
          this.File.src = URL.createObjectURL(blob);
        });
    },
    savenewFile(e) {
      let img = e.target.files[0];
      this.File = new Image();
      this.File.src = URL.createObjectURL(img);
    },
    saveResult() {
      if (this.Url != null && this.File != null) {
        this.result = this.File;
      } else if (this.Url != null && this.File == null) {
        this.result = this.Url;
      } else if (this.Url == null && this.File != null) {
        this.result = this.File;
      }
      this.Url = null;
      this.url = null;
      this.$refs.inputFile.value = null;
      this.File = null;
    },
  },
};
</script>
    
<style lang="scss" scoped>
input {
  background-color: #f6f2f6;
  border-color: #1c252c;
  border-radius: 5px;
  color: #1c252c;
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
  height: 35vh;
  width: 25vw;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  &__line {
    display: flex;
    flex-direction: row;
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
  margin-right: 20px;
}
.input {
  border-radius: 5px;
  padding: 10px;
  margin-top: 5px;
}
label {
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}
</style>
    