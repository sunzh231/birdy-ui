<template>
  <div class="page-header">
    <ul>
      <li v-for="item in menus">
        <a v-link="#/home">{{ item.title }}</a>
      </li>
    </ul>
    <div class="header-info">
      <button class="btn icon-btn icon-message"></button>
      <button class="btn icon-btn icon-warning"></button>
      <button class="btn icon-btn icon-email"></button>
      <button class="btn icon-btn icon-avatar"></button>
      <button class="btn icon-btn icon-setting"></button>
      <button class="btn icon-btn icon-help"></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  width: 100%;
  height: 45px;
  background: #3c8dbc;
  font-size: 18px;
  line-height: 45px;

  ul li{
    float: left;
    min-width: 80px;
    height: 100%;
    color: #FFFFFF;
  }

  .header-info {
    float: right;

    .btn {
      border: none;
    }

    .icon-btn {
      width: 45px;
      height: 45px;
      cursor: pointer;
    }

    .icon-message {
      background: url('../../assets/images/icon_message.png') no-repeat;
      background-position: 15px 15px;
    }

    .icon-warning {
      background: url('../../assets/images/icon_warning.png') no-repeat;
      background-position: 15px 15px;
    }

    .icon-email {
      background: url('../../assets/images/icon_email.png') no-repeat;
      background-position: 15px 15px;
    }

    .icon-setting {
      background: url('../../assets/images/icon_setting.png') no-repeat;
      background-position: 15px 15px;
    }

    .icon-help {
      background: url('../../assets/images/icon_help.png') no-repeat;
      background-position: 15px 15px;
    }

    .icon-avatar {
      background: url('../../assets/images/icon_avatar.png') no-repeat;
      background-position: 15px 15px;
    }
  }
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
          { title: '项目', link: '/home' },
          { title: '代码', link: '/user' },
          { title: '构建', link: '/hello' },
          { title: '构建', link: '/hello' },
          { title: '团队', link: '/hello' },
          { title: '更多', link: '/more' }
        ]
      }
    }
  }
}
</script>
