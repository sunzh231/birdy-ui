<template>
  <div id="main">
    <div class="left-side-bar">
      <page-side-bar></page-side-bar>
    </div>
    <div class="right-content">
      <page-header></page-header>
      <router-view></router-view>
    </div>
    <page-footer></page-footer>
  </div>
</template>

<style lang="scss">

#main {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;

  .left-side-bar {
    width: 220px;
    position: absolute;
    top: 0px;
    left: 0px;
  }

  .right-content {
    margin-left: 220px;
  }
}

</style>

<script>
import PageSideBar from '../components/templates/PageSideBar'
import Popup from '../components/popup/Popup'
import PageHeader from '../components/templates/PageHeader'
import PageFooter from '../components/templates/PageFooter'

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
    PageHeader, PageSideBar, Popup, PageFooter
  }
}
</script>
