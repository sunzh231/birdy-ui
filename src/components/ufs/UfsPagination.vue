<template>
  <div class="ufs-pagination"  v-show="totalPages > 1">
    <div class="page-selector">
      <div class="previous-page" :class="{ active: currentPage > 1 }" @click="currentPage - 1 >= 1 && selectPage(currentPage - 1)">
        <span><span class="left-arrow"></span>上一页</span>
      </div>
      <div class="pages" v-if="showAllPageButtons">
        <span class="page-number-button" v-for="pageNum in pages" :class="{ active: pageNum === currentPage }" @click="selectPage(pageNum)">{{ pageNum }}</span>
      </div>
      <div class="pages" v-if="!showAllPageButtons">
        <span class="page-number-button" :class="{ active: currentPage === 1 }" @click="selectPage(1)">1</span>
        <span class="page-number-button-ellipsis" v-show="showBeforeEllipsis">...</span>
        <span class="page-number-button" v-for="pageNum in shownPages" :class="{ active: pageNum === currentPage }" @click="selectPage(pageNum)">{{ pageNum }}</span>
        <span class="page-number-button-ellipsis" v-show="showAfterEllipsis">...</span>
        <span class="page-number-button" :class="{ active: currentPage === totalPages }" @click="selectPage(totalPages)">{{ totalPages }}</span>
      </div>
      <div class="next-page" :class="{ active: currentPage < totalPages }" @click="currentPage + 1 <= totalPages && selectPage(currentPage + 1)">
        <span>下一页<span class="right-arrow"></span></span>
      </div>
      <div class="page-count">
         共<span>{{ totalPages }}</span>页
      </div>
    </div>
    <div class="page-jump">
      到第<input class="target-page" type="tel" v-model="targetPage">页<button class="jump-button" type="button" @click="targetPage != currentPage && selectPage(targetPage)">确定</button>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';
@font-size: 16px;
@button-font-size: 12px;
@grey: #c9c9c9;

@page-button-border: 1px solid @grey;
@page-button-width: 40px;
@page-button-height: 40px;
@page-input-border: @page-button-border;

@arrow-skew-degree: 40deg;

.avoid-text-selection() {
  -webkit-user-select: none;  /* Chrome all / Safari all */
  -moz-user-select: none;     /* Firefox all */
  -ms-user-select: none;      /* IE 10+ */
  user-select: none;          /* Likely future */
}

.paginaton-text() {
  font-size: @font-size;
  color: @grey;
}

.page-button() {
  display: inline-block;
  width: @page-button-width;
  height: @page-button-height;
  border: @page-button-border;
  line-height: @page-button-width - 2px;
  text-align: center;
  background-color: @white;
  cursor: pointer;
}

.skew(@deg) {
  -webkit-transform: skew(@deg);
  -moz-transform: skew(@deg);
  -o-transform: skew(@deg);
  transform: skew(@deg);
}

.transform-origin(@origin) {
  -webkit-transform-origin: @origin;
  -moz-transform-origin: @origin;
  -o-transform-origin: @origin;
  transform-origin: @origin;
}

.arrow-line() {
  content: '';
  width: 2px;
  height: 7px;
  color: @grey;
  background-color: @grey;
  position: absolute;
}

.arrow() { // arrow that point to left
  display: inline-block;
  width: 8px;
  height: 17px;
  position: relative;
  vertical-align: top;
  margin-top: 11px;

  &::before {
    .arrow-line();
    .skew(@arrow-skew-degree);
    .transform-origin(top);

    left: 0;
    top: 1px;
  }

  &::after {
    .arrow-line();
    .skew(-@arrow-skew-degree);
    .transform-origin(bottom);

    left: 0;
    bottom: 2px;
  }
}

.l-arrow() {
  .arrow();

  &::before {
    .skew(-@arrow-skew-degree);

    left: auto;
    right: 0;
  }

  &::after {
    .skew(@arrow-skew-degree);

    left: auto;
    right: 0;
  }
}

.l-arrow-active() {
  .l-arrow();

  &::before,
  &::after {
    background-color: @ufsOrange;
  }
}

.r-arrow() {
  .arrow();
}

.r-arrow-active() {
  .r-arrow();

  &::before,
  &::after {
    background-color: @ufsOrange;
  }
}

.ufs-pagination {
  font-size: 0;
  width: 100%;
  overflow: hidden;
  min-width: 750px;

  * {
    box-sizing: border-box;
  }

  .page-selector {
    float: left;
  }

  .previous-page {
    .paginaton-text();
    .page-button();
    .avoid-text-selection();
    width: 100px;

    .left-arrow {
      .l-arrow();

      margin-right: 18px;
    }

    &.active {
      color: @ufsOrange;

      .left-arrow {
        .l-arrow-active();
      }
    }
  }

  .next-page {
    .paginaton-text();
    .page-button();
    .avoid-text-selection();
    width: 100px;
    margin-right: 8px;

    .right-arrow {
      .r-arrow();

      margin-left: 18px;
    }

    &.active {
      color: @ufsOrange;

      .right-arrow {
        .r-arrow-active();
      }
    }
  }

  .pages {
    .avoid-text-selection();
    display: inline-block;

    .page-number-button {
      .paginaton-text();
      .page-button();
      color: @ufsOrange;
      margin-left: 8px;

      &:last-child {
        margin-right: 8px;
      }

      &.active {
        border: 1px solid @ufsOrange;
        background-color: @ufsOrange;
        color: @white;
      }
    }

    .page-number-button-ellipsis {
      .paginaton-text();
      color: @ufsOrange;
      margin-left: 16px;
      margin-right: 8px;
    }
  }

  .page-count {
    .paginaton-text();

    display: inline-block;
  }

  .page-jump {
    .paginaton-text();

    float: right;
    line-height: 40px;
  }

  .target-page {
    width: 60px;
    height: 32px;
    vertical-align: baseline;
    border: @page-input-border;
    margin: 0 8px;
    text-align: center;
    color: @grey;
  }

  .jump-button {
    margin-left: 8px;
    width: 50px;
    height: 32px;
    line-height: 30px;
    font-size: @button-font-size;
    color: @white;
    border: 0;
    background-color: @ufsOrange;
    cursor: pointer;
  }
}


@media (max-width: @webBoundary) { // hide pagination in mobile devices
  .ufs-pagination {
    display: none;
  }
}
</style>

<script>
import {debounce} from '../../../../static/h5/utils/interaction'

const pageNumberFormatter = {
  isInvalidNumber (vm, pageNum) {
    if (`${Number.parseInt(pageNum)}` === `${pageNum}`) {
      return pageNum
    } else {
      return false
    }
  },
  parseInt (vm, pageNum) {
    return Number.parseInt(pageNum)
  },
  moreThanOne (vm, pageNum) {
    if (pageNum < 1) {
      return 1
    } else {
      return pageNum
    }
  },
  lessThanTotal (vm, pageNum) {
    if (pageNum > vm.totalPages) {
      return vm.totalPages
    } else {
      return pageNum
    }
  }
}

const getValidPageNumber = function (vm, pageNum) {
  for (const name in pageNumberFormatter) {
    pageNum = pageNumberFormatter[name](vm, pageNum)
    if (!pageNum) {
      return false
    }
  }
  return pageNum
}

export default {
  props: {
    totalPages: {
      type: Number,
      required: true
    },
    changeHandler: {
      type: Function,
      required: true
    },
    currentPage: {
      type: Number,
      required: false,
      twoWay: true,
      default: 1
    },
    maxPageButtons: {  // the max number of buttons before [...] shows, default value is enough for most of ufs cases
      type: Number,
      required: false,
      default: 6
    }
  },
  data () {
    return {
      targetPage: null
    }
  },
  computed: {
    showAllPageButtons () {
      return this.totalPages <= this.maxPageButtons
    },
    pages () { // tile all the buttons within UfsPagination
      let pages = []
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i)
      }
      return pages
    },
    shownPages () {
      let pages = []
      const oneEllipsis = this.maxPageButtons - 2 // default = 4
      const twoEllipsises = this.maxPageButtons - 4 // default = 2
      if (this.currentPage < oneEllipsis) { // 1 2 3 4 5 ... 15
        for (let i = 2; i <= oneEllipsis; i++) {
          pages.push(i)
        }
      } else if (this.currentPage > this.totalPages - oneEllipsis) { // 1 ... 11 12 13 14 15
        for (let i = this.totalPages - oneEllipsis + 1; i < this.totalPages; i++) {
          pages.push(i)
        }
      } else { // 1 ... 6 7 8 ... 15
        const beginPage = this.currentPage - (Math.ceil(twoEllipsises / 2) - 1)
        for (let i = beginPage; i < beginPage + twoEllipsises; i++) {
          pages.push(i)
        }
      }

      return pages
    },
    showBeforeEllipsis () {
      return this.currentPage >= this.maxPageButtons - 2
    },
    showAfterEllipsis () {
      return this.currentPage <= this.totalPages - (this.maxPageButtons - 2)
    }
  },
  methods: {
    selectPage (pageNum) {
      pageNum = getValidPageNumber(this, pageNum)
      if (!pageNum) {
        return
      }

      this.currentPage = pageNum
      this.changeHandler(pageNum)
    }
  },
  ready () {
    this.changeHandler = debounce(this.changeHandler, 200) // use debounce to avoid bug when the page changes quickly
  }
}
</script>
