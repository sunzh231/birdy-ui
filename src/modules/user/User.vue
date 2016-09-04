<template>
  <div id="user">
    <div class="user-info">
      This is user template!!!!!!!!
    </div>
    This is user template!
    <popup></popup>
  </div>
</template>

<script>
import Popup from '../../components/popup/Popup'

export default {
  data () {
    return {
      items: []
    }
  },
  ready () {
    // setDocumentTitle(this.$t('bought.list'))
  },
  components: {
    Popup
  }
}
</script>

<style scoped lang="scss">
#user {
  width: 100%;
  background: red;

  .user-info {
    width: 100px;
    background: blue;
  }
}
</style>
