<template>
  <label class="ufs-checkbox" :class="[value ? 'checked' : '']">
    <input style="display:none" type="checkbox" v-model="value" />
  </label>
</template>

<style scoped lang="less">
@import '../styles/variables.less';

.ufs-checkbox {
  display: inline-block;
  background-image: url('./images/checkbox_default.png');
  background-repeat: no-repeat;
  background-size: cover;
  width: 20px;
  height: 20px;
  cursor: pointer;
  vertical-align: bottom;

  &.checked {
    background-image: url('./images/checkbox_selected.png');
  }
}

@media (max-width: @webBoundary) {
  .ufs-checkbox {
    width: 18px;
    height: 18px;
  }
}
</style>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
      twoWay: true
    },
    callback: {
      type: Function,
      required: false
    }
  },
  watch: {
    value () {
      if (this.value !== undefined && this.callback) this.callback(this.value)
    }
  }
}
</script>
