<template>
  <div id="ufs-popup-invite">
    <ufs-modal :show.sync="show">
      <section slot="content" class="invite-friends">
        <div class="invite-header">
          <div class="invite-icon"></div>
          <div class="title">邀请好友， 有利共享</div>
          <div class="description">
            邀请好友注册网站并完善个人资料后，<br class="newline" />
            你就能获得<span class="highlight">{{award}}积分</span>
          </div>
        </div>
        <div class="invite-body clearfix">
          <div class="link-wrap">
            <div class="description"> <span class="label"> 邀请方式:<br/></span> 复制下面的链接并发送给好友就行啦</div>
            <ufs-clipboard :text="inviteLink"></ufs-clipboard>
          </div>
          <div class="qrcode-wrap">
            <img class="qrcode-image" :src="qrcodeUrl" />
            <div class="tip">
              长按二维码图片，保存到手机，发送给好友<br/>
              或者直接展示二维码，让好友扫描
            </div>
          </div>
        </div>
      </section>
    </ufs-modal>
  </div>
</template>

<style lang="less">
@import '../../styles/variables.less';

@ufs-invite-light-black: #5d5d5d;
@ufs-invite-bar-gary: #5d5e5e;
@ufs-invite-modal-width: 750px;

#ufs-popup-invite {
  .modal {
    .modal-dialog {
      width: @ufs-invite-modal-width;
    }
  }

  .invite-friends {
    padding: 65px 0;
    text-align: center;
    width: @ufs-invite-modal-width;
    background-color: @white;

    .invite-icon {
      display: none;
    }

    .title {
      font-size: 24px;
      margin-bottom: 16px;
      color: @ufs-invite-light-black;
    }

    .description {
      font-size: 16px;
      color: @ufs-invite-bar-gary;

      .newline {
        display: none;
      }

      .highlight {
        color: @ufsOrange;
      }
    }

    .invite-body {
      padding-top: 32px;
      font-size: 14px;
      color: @ufs-invite-bar-gary;

      .link-wrap {
        display: inline-block;
        vertical-align: top;
        padding-top: 16px;
        padding-right: 32px;
      }

      .qrcode-wrap {
        border-left: 1px solid @ufsDooseGrey;
        display: inline-block;
        padding-left: 32px;

        .qrcode-image {
          width: 94px;
          height: 94px;
        }
      }

      .description {
        font-size: 12px;
        margin-bottom: 8px;
        text-align: left;
      }

      .label {
        display: none;
      }

      .tip {
        font-size: 12px;
        color: @ufs-invite-bar-gary;
      }
    }
  }
}

@media (max-width: @webBoundary) {
  #ufs-popup-invite {
    .modal {
      .modal-dialog {
        width: 100%;
      }
    }

    .invite-friends {
      padding: 50px 0;
      width: 100%;

      .invite-icon {
        display: inline-block;
        background-image: url('../../images/invitation.png');
        background-size: cover;
        background-repeat: no-repeat;
        width: 64px;
        height: 80px;
        margin-bottom: 20px;
      }

      .title {
        font-size: 21px;
        margin-bottom: 8px;
      }

      .description {
        .newline {
          display: inherit;
        }
      }

      .invite-body {
        padding-top: 32px;
        font-size: 14px;

        .link-wrap {
          display: block;
          padding: 0;
        }

        .qrcode-wrap {
          border: none;
          padding-left: 0;
          padding-top: 25px;
          display: block;
        }

        .description {
          text-align: center;
          color: @ufsFontGray;
          font-size: 14px;
          margin-bottom: 14px;
        }

        .label {
          display: inherit;
        }
      }
    }
  }
}
</style>

<script>
import UfsModal from '../../components/UfsModal'
import UfsClipboard from '../../components/UfsClipboard'
import UfsQrcode from '../../components/UfsQrcode'

import CONSTANT from '../../constant'

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      twoWay: true,
      default: false
    }
  },
  data () {
    return {
      inviteLink: '',
      qrcodeUrl: '',
      award: 20,
      qrcodeSize: 320,
      qrcodeMargin: 20
    }
  },
  ready () {
    this.getMemberId()
  },
  components: {
    UfsModal, UfsClipboard, UfsQrcode
  },
  methods: {
    getMemberId () {
      if (this.inviteLink) return
      const resource = this.$resource('/api/ufscmcmall/member/invitation')

      resource.get().then((resp) => {
        this.inviteLink = resp.data.link
        this.qrcodeUrl = resp.data.qrcode
      })
    }
  }
}
</script>
