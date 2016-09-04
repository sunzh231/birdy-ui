<template>
  <div :class="['ufs-dropdown', { 'inline': isInline }]" >
    <select :id="id" v-model="value" disabled="{{ readonly }}">
      <option value="" v-if="placeholder" :selected="placeholder && !value">{{ placeholder }}</option>
      <option v-for="option in processOptions" value="{{ option.key }}">{{ option.value }}</option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    options: {
      type: Array,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    value: {
      twoWay: true
    },
    isInline: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    processOptions () {
      if (this.options.length && this.options[0].key) {
        return this.options
      } else {
        return this.options.map((item) => {
          return {
            key: item,
            value: item
          }
        })
      }
    }
  },
  watch: {
    value (newValue) {
      this.$emit('on-change', newValue)
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
@ufs-dropdown-caret-color: #c8c8cd;
@ufs-dropdown-select-color: #231f20;
@ufs-dropdown-select-border-color: #efefef;
@ufs-dropdown-select-background-color: #fff;
@ufs-dropdown-select-disabled-color: #c8c8cd;
@ufs-dropdown-select-focus-border-color: #ff5a00;

.ufs-dropdown {
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;

  &.inline {
    display: inline-block;

    select {
      display: inline-block;
    }
  }

  &:after {
    content: " ";
    display: inline-block;
    -webkit-transform: rotate(135deg);
    transform: rotate(135deg);
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: @ufs-dropdown-caret-color;
    border-style: solid;
    position: absolute;
    top: 50%;
    right: 15px;
    margin-top: -6px;
  }

  select {
    color: @ufs-dropdown-select-color;
    border-radius: 0;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    padding: 6px 8px;
    border: 1px solid @ufs-dropdown-select-border-color;
    background-color: @ufs-dropdown-select-background-color;
    background-image: none;
    padding-right: 30px;
    font-size: 14px;
    cursor: pointer;
    display: block;
    width: 100%;
    height: 33px;

    &:focus {
      border-color: @ufs-dropdown-select-focus-border-color;
      outline: none;
      -webkit-box-shadow: 0 0 1px rgba(255, 90, 0, 0.85) inset, 0 0 5px rgba(255, 90, 0, 0.45);
      box-shadow: 0 0 1px rgba(255, 90, 0, 0.85) inset, 0 0 5px rgba(255, 90, 0, 0.45);
    }

    &[disabled] {
      color: @ufs-dropdown-select-disabled-color;
    }
  }

  option {
    padding: 0 2px 1px;
  }
}
</style>
