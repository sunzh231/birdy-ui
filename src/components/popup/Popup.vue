<template>
    <div>This is popup!</div>
</template>

<style scoped lang="scss">
.header {

}
</style>

<script>
export default {
  props: {
    menus: {
      type: Array,
      required: false,
      default: function () {
        return [
          { title: '首页', msg: 'hello' },
          { title: '首页', msg: 'hello' },
          { title: '首页', msg: 'hello' }
        ]
      }
    }
  }
}
</script>
