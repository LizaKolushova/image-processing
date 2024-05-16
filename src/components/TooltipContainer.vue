<template>
  <div class="con">
    <div class="tooltipe" @mouseover="showTooltipe" @mouseout="showTooltipe">
      ?
    </div>
    <p class="tooltipe__text" :class="{ tooltipe__text_show: isTooltipe }">
      {{ text }}
    </p>
  </div>
</template>
  <script>
export default {
  name: "TooltipContainer",
  props: {
    text: String,
  },
  data() {
    return {
      isTooltipe: false,
    };
  },
  methods: {
    showTooltipe() {
      this.isTooltipe = !this.isTooltipe;
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.con {
  position: relative;
}
.tooltipe {
  cursor: pointer;
  margin-left: 5px;
  border-bottom: 1px dotted #000;

  &__text {
    position: absolute;
    right: 0;
    z-index: 100;
    margin-top: 30px;
    display: none;
    width: 250px;
    background-color: darkgray;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    &_show {
      display: block;
    }
  }
}
</style>