<template>
  <div class="ufs-clipboard">
    <div>
      <input v-model="text" readonly />
    </div>
    <div class="btn-wrap">
      <ufs-tip :show.sync="Showtip" :text="TipMsg"></ufs-tip>
      <ufs-btn
        :text="btuText"
        :btn-style="style"
        :btn-size="size"
        :click-handler="copy">
      </ufs-btn>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';

@gift-btu-size: 290px;

.ufs-clipboard {
   input {
    box-sizing: border-box;
    border-radius: 0;
    display: inline-block;
    width: 290px;
    padding: 0 15px;
    margin: 0 0 16px;
    height: 30px;
    border: 1px solid @ufsDooseGrey;
  }

  .ufs-button-container {
    width: @gift-btu-size;
  }

  .btn-wrap {
    display: inline-block;
    position: relative;
  }

  .ufs-tip {
    margin-bottom: 25px;
  }
}

@media (max-width: @webBoundary) {
  .ufs-clipboard {
    input {
      margin: 0 0 14px;
    }
  }
}
</style>

<script>
// components
import UfsBtn from './UfsBtn'
import UfsTip from './UfsTip'

function copyTextToClipboard (text) {
  const copyFrom = document.createElement('textarea')
  copyFrom.textContent = text
  copyFrom.style.cssText = 'width: 0px; height: 0px;'
  const body = document.getElementsByTagName('body')[0]
  body.appendChild(copyFrom)
  copyFrom.select()
  let result = false
  try {
    result = document.execCommand('copy')
  } catch (e) {
    console.log(e)
  } finally {
    body.removeChild(copyFrom)
    return result
  }
}

export default {
  replace: true,
  props: {
    text: {
      type: String,
      required: true
    },
    btuText: {
      type: String,
      required: false,
      default: '复制链接'
    },
    style: {
      type: String,
      required: false,
      default: 'bg-orange'
    },
    size: {
      type: String,
      required: false,
      default: 'large'
    }
  },
  data () {
    return {
      Showtip: false,
      TipMsg: '快去发送给朋友吧'
    }
  },
  methods: {
    copy () {
      if (!copyTextToClipboard(this.text)) this.TipMsg = '没拿到链接，试试下载二维码发送给朋友吧'
      this.Showtip = true
    }
  },
  components: {
    UfsBtn, UfsTip
  }
}
</script>
