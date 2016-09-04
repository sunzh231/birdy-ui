<templates>
  <div class="btn">
    <div class="link-btn" v-if="btnType === 'link'">
      <a v-link="btnLink">
        <span class="icon-btn"></span>
        {{ text }}
      </a>
      <span class="sub-state icon-left"></span>
    </div>
    <div class="normal-btn" v-if="btnType === 'normal'">
      <button v-if="type"></button>
      <span></span>
    </div>
  </div>
</templates>

<style scoped lang="scss">
.btn {
  .link-btn {

    a {
      .icon-btn {
        width: 16px;
        height: 16px;
      }
    }
    .sub-state {
      width: 16px;
      height: 16px;
    }

    .icon-left {
      background: url('../../assets/images/icon_left.png') no-repeat;
    }

    .icon-down {
      background: url('../../assets/images/icon_down.png') no-repeat;
    }
  }
}
</style>

<script>
export default {
  props: {
    btnType: {
      type: String,
      required: true,
      default: 'link'
    },
    text: {
      type: String,
      required: false
    },
    btnLink: {
      type: String,
      required: false
    }
  }
}
</script>
