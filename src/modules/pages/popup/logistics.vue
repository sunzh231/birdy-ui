<template>
  <div id="ufs-popup-logistics">
    <ufs-modal :show.sync="show">
      <div slot="content">
        <div class="logistics-container">
          <ufs-logistics :logistics="logistics"></ufs-logistics>
        </div>
      </div>
    </ufs-modal>
  </div>

</template>

<style lang="less">
@import '../../styles/variables.less';

#ufs-popup-logistics {
  .modal {
    overflow-y: auto;

    .modal-dialog {
      margin: 0 auto;
      max-width: 722px;

      .close {
        top: 14px;
        right: 14px;
      }
    }
  }

  .logistics-container {
    background: #FFF;
    width: 660px;
    padding: 24px 0px 24px 60px;

    .ufs-logistics-container {
      .ufs-logistics-wrapper {
        max-height: 520px;
      }
    }
  }
}

@media (max-width: @webBoundary) {
  #ufs-popup-logistics {
    .modal {
      .modal-dialog {
        max-width: 100%;
      }
    }

    .logistics-container {
      box-sizing: border-box;
      width: 100%;
      padding: 44px 10px;

      .ufs-logistics-container {
        margin: 0 auto;

        .ufs-logistics-wrapper {
          max-height: none;
        }
      }
    }
  }
}
</style>

<script>
import UfsModal from '../../components/UfsModal'
import UfsLogistics from '../../components/UfsLogistics'

export default {
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false
    },
    logistics: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
  },
  components: {
    UfsModal, UfsLogistics
  }
}
</script>
