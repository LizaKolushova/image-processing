<template>
  <div class="content">
    <template v-if="showData">
      <p class="font">Image Size: {{ width }} x {{ height }}</p>
      <p class="font">Coordinates: ({{ x }}, {{ y }})</p>
      <div v-if="resl != null" class="color">
        <div class="color__img" :style="string"></div>
        <div class="color__inf">
          <p class="color__font">Color: {{ color }}</p>
        </div>
      </div>
      <select v-model="scale" @change="$emit('scale')">
        <option value="12">12%</option>
        <option value="25">25%</option>
        <option value="50">50%</option>
        <option value="100">100%</option>
        <option value="150">150%</option>
        <option value="200">200%</option>
        <option value="300">300%</option>
      </select>
    </template>
  </div>
</template>
  
  <script>
export default {
  name: "StatusBar",
  props: {
    x: Number,
    y: Number,
    height: Number,
    width: Number,
    showData: Boolean,
    resl: Array,
    state: String,
  },
  data() {
    return {
      picker: null,
      scale: 100,
    };
  },
  mounted() {},
  methods: {},
  computed: {
    string() {
      return (
        "background-color: rgb(" +
        this.resl[0] +
        "," +
        this.resl[1] +
        "," +
        this.resl[2] +
        ");"
      );
    },
    color() {
      return (
        "RGB (" + this.resl[0] + ", " + this.resl[1] + ", " + this.resl[2] + ")"
      );
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.content {
  position: absolute;
  bottom: 0;
  width: calc(100% - 50px);
  height: 30px;
  display: flex;
  padding-right: 20px;
  gap: 5px;
  justify-content: space-between;
  align-items: center;
  background-color: #1c252c;
}
.color {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  row-gap: 10px;

  &__img {
    height: 20px;
    width: 20px;
    border-radius: 50%;
  }

  &__font {
    padding-left: 5px;
    color: #e0e1dd;
  }

  &__inf {
    display: flex;
    flex-direction: row;
    row-gap: 10px;
  }
}
.font {
  color: #e0e1dd;
  &_center {
    align-self: center;
  }
}
</style>
  