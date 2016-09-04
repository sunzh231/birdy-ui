<template>
  <div class="ufs-counter">
    <a @click="sub()" class="ufs-counter-selector ufs-counter-selector-sub" :class="{ 'ufs-counter-disabled': disabledMin }">-</a>
    <input v-model="value" class="ufs-counter-input" :style="{ width: width + 'px' }" number :readonly="!editable" pattern="[0-9]*" />
    <a @click="add()" class="ufs-counter-selector ufs-counter-selector-plus" :class="{ 'ufs-counter-disabled': disabledMax }">+</a>
  </div>
</template>

<script>
export default {
  props: {
    min: Number,
    max: Number,
    step: {
      type: Number,
      default: 1
    },
    value: {
      type: Number,
      twoWay: true,
      default: 0
    },
    editable: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 35
    }
  },
  computed: {
    disabledMin () {
      return typeof this.min === 'undefined' ? false : this.value <= this.min
    },
    disabledMax () {
      return typeof this.max === 'undefined' ? false : this.value >= this.max
    }
  },
  watch: {
    value (newValue, old) {
      if (this.min && this.value < this.min) {
        this.value = this.min
      }
      if (this.max && this.value > this.max) {
        this.value = this.max
      }
      this.$emit('on-change', this.value)
    }
  },
  methods: {
    add () {
      if (!this.disabledMax) {
        this.value += this.step
      }
    },
    sub () {
      if (!this.disabledMin) {
        this.value -= this.step
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '../../../../static/h5/styles/mixins.less';

@ufs-counter-input-color: #231f20;
@ufs-counter-input-border-color: #e6e7e8;

@ufs-counter-selector-color: #9e9e9f;
@ufs-counter-selector-border-color: #e6e7e8;
@ufs-counter-selector-disable-color: #ccc;

.ufs-counter {
  .clearfix;
  font-size: 0;
  display: inline-block;
  vertical-align: middle;
}

.ufs-counter-input {
  float: left;
  height: 20px;
  font-size: 14px;
  color: @ufs-counter-input-color;
  appearance: none;
  border: 1px solid @ufs-counter-input-border-color;
  padding: 3px 0;
  text-align: center;
  border-radius: 1px;
}

.ufs-counter-selector {
  float: left;
  height: 20px;
  font-size: 14px;
  line-height: 18px;
  color: @ufs-counter-selector-color;
  border: 1px solid @ufs-counter-selector-border-color;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }

  &.ufs-counter-disabled {
    color: @ufs-counter-selector-disable-color;
  }

  &-sub {
    border-right: none;
    padding: 3px 10px;
    border-radius: 2px 0 0 2px;
  }

  &-plus {
    border-left: none;
    margin-right: 5px;
    padding: 3px 8px;
    border-radius: 0 2px 2px 0;
  }
}
</style>
