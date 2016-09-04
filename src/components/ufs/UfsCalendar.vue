<template>
  <div class="ufs-calendar">
    <input type="text" :style="styleObj" :readonly="readonly" :value="value" @click="show = !show">
    <div class="calendar-wrap" :class="[chooseType]" v-show="show">
      <table class="calendar-picker">
        <thead>
          <tr class="calendar-head">
            <th colspan="7">
              <div class="btn-wrap">
                <div class="btn-prev" @click="arrow(-1)"><</div>
                <div class="btn-text" v-text="dateText" @click="changePick"></div>
                <div class="btn-next" @click="arrow(1)">></div>
              </div>
            </th>
          </tr>
          <tr class="calendar-days" v-show="chooseType == 'day'">
            <th v-for="day in days">{{day}}</th>
          </tr>
        </thead>
      </table>
      <div class="calendar-picker-wrap" :class="[chooseType]">
        <table class="calendar-picker">
          <tbody>
            <tr v-for="i in 6" v-show="chooseType == 'day'">
              <td v-for="j in 7"
                :class="date[i * 7 + 1] && date[i * 7 + j].status"
                :date="date[i * 7 + j] && date[i * 7 + j].date"
                @click="pickDay(i * 7 + j)">{{date[i * 7 + j] && date[i * 7 + j].text}}</td>
            </tr>
            <tr v-for="i in 3" v-show="chooseType == 'month'">
              <td class="large" v-for="j in 4"
                :class="[valueTimestamp.getMonth() === (i * 4 + j) && now.getFullYear() === valueTimestamp.getFullYear() ? 'date-active' : '']"
                @click="pickMonth(i * 4 + j)">{{months[i * 4 + j]}}</td>
            </tr>
            <tr v-for="i in 3" v-show="chooseType == 'year'">
              <td class="large" v-for="j in 4"
                :class="[years[i * 4 + j] === valueTimestamp.getFullYear() ? 'date-active' : '']"
                @click="pickYear(years[i * 4 + j])">{{years[i * 4 + j]}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import '../styles/variables.less';
@import '../../../../static/h5/styles/mixins.less';

@base-font-size: 12px;
@table-cell-size: 40px;
@color-aaa: #aaa;
@color-ccc: #ccc;
@input-width: 73px;
@input-height: 35px;
@calendar-width: 280px;
@table-cell-width-large: 60px;
@table-cell-height-large: 60px;

.ufs-calendar {
  position: relative;
  display: inline-block;
  color: @ufsFontBlack;

  input {
    box-sizing: border-box;
    width: @input-width;
    height: @input-height;
    text-align: center;
    border: 1px solid @color-ccc;
    font-size: @base-font-size;
    vertical-align: top;
  }

  .calendar-wrap {
    position: absolute;
    z-index: 1000;
    width: @calendar-width;
    margin-top: 2px;
    background-color: @white;
    box-shadow: 0 0 6px @color-ccc;
    margin-left: (@input-width - @calendar-width) / 2;

    &.day {
      height: 320px;
    }

    .calendar-picker-wrap {
      &.month {
        padding: 10px 20px;
      }

      &.year {
        padding: 10px 20px;
      }
    }

    .calendar-picker {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      text-align: center;
      font-size: @base-font-size;

      .calendar-head {
        background-color: @ufsOrange;
        color: @white;
        font-size: 16px;

        div {
          display: inline-block;
          padding: 0;
          margin: 0;
          cursor: pointer;
        }

        .btn-wrap {
          .flex();
        }

        .btn-prev,
        .btn-next {
          .flex-item(1);
          font-size: 18px;
          font-weight: bolder;
        }

        .btn-text {
          width: 200px;
        }
      }

      .calendar-days {
        background-color: #f7f7f7;
        color: @color-aaa;
      }

      tr:nth-child(even) {
        background-color: #f9f9f9;
      }

      th, td {
        width: @table-cell-size;
        height: @table-cell-size;
        padding: 0;
        border: 0 none;
        line-height: @table-cell-size;
        text-align: center;
      }

      td.large {
        width: @table-cell-width-large;
        height: @table-cell-height-large;
      }

      td {
        cursor: pointer;
        &:hover {
          background-color: #eee;
        }
      }

      td.date-pass,
      td.date-future {
        color: @color-aaa;
      }

      td.date-active {
        background-color: @ufsOrange;
        color: @white;
      }
    }
  }
}
</style>

<script>
import {dateFormat} from '../../../../static/h5/utils/interaction'

export default {
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: '',
      twoWay: true
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    }
  },
  data () {
    return {
      show: false,
      days: ['一', '二', '三', '四', '五', '六', '日'],
      months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      date: [],
      now: new Date(),
      chooseType: 'day' // year month day
    }
  },
  computed: {
    dateText () {
      let text = ''
      if (this.now) {
        switch (this.chooseType) {
          case 'day':
            text = `${this.months[this.now.getMonth()]} ${this.now.getFullYear()}`
            break
          case 'month':
            text = `${this.now.getFullYear()}`
            break
          case 'year':
            text = `${this.now.getFullYear() - 5} - ${this.now.getFullYear() + 6}`
            break
        }
      }
      return text
    },
    years () {
      const result = []
      if (this.now) {
        const year = this.now.getFullYear()
        for (let i = year - 5; i <= year + 6; i++) {
          result.push(i)
        }
      }
      return result
    },
    valueTimestamp () {
      return this.value ? new Date(this.value) : new Date()
    }
  },
  watch: {
    now () {
      this.update()
    },
    show () {
      this.update()
    }
  },
  methods: {
    update () {
      this.value = this.value ? dateFormat(new Date(this.value), this.format) : ''
      var arr = []
      var time = new Date(this.now)
      time.setMonth(time.getMonth(), 1)
      var curFirstDay = time.getDay()
      curFirstDay === 0 && (curFirstDay = 7)
      time.setDate(0)
      var lastDayCount = time.getDate()
      for (let i = curFirstDay - 1; i > 0; i--) {
        arr.push({
          text: lastDayCount - i + 1,
          time: new Date(time.getFullYear(), time.getMonth(), lastDayCount - i + 1),
          status: 'date-pass'
        })
      }
      time.setMonth(time.getMonth() + 2, 0)
      var curDayCount = time.getDate()
      time.setDate(1)
      var value = this.value ? dateFormat(new Date(this.value), this.format) : dateFormat(new Date(), this.format)
      for (let i = 0; i < curDayCount; i++) {
        let tmpTime = new Date(time.getFullYear(), time.getMonth(), i + 1)
        let status = ''
        dateFormat(tmpTime, this.format) === value && (status = 'date-active')
        arr.push({
          text: i + 1,
          time: tmpTime,
          status: status
        })
      }

      var j = 1
      while (arr.length < 42) {
        arr.push({
          text: j,
          time: new Date(time.getFullYear(), time.getMonth() + 1, j),
          status: 'date-future'
        })
        j++
      }
      this.date = arr
    },
    changePick () {
      switch (this.chooseType) {
        case 'day':
          this.chooseType = 'month'
          break
        case 'month':
          this.chooseType = 'year'
          break
        case 'year':
          break
      }
    },
    arrow (flag) {
      const method = this.chooseType === 'day' ? 'monthChange' : 'yearChange'
      if (this.chooseType === 'year') flag = flag * 12
      this[method](flag)
    },
    yearChange (flag) {
      this.now.setFullYear(this.now.getFullYear() + flag)
      this.now = new Date(this.now)
    },
    monthChange (flag) {
      this.now.setMonth(this.now.getMonth() + flag)
      this.now = new Date(this.now)
    },
    pickDay (index) {
      this.show = false
      this.now = new Date(this.date[index].time)
      this.value = dateFormat(this.now, this.format)
    },
    pickMonth (month) {
      this.now = new Date(this.now.setMonth(month))
      this.chooseType = 'day'
    },
    pickYear (year) {
      this.now = new Date(this.now.setFullYear(year))
      this.chooseType = 'month'
    },
    leave (e) {
      if (this.$el && !this.$el.contains(e.target)) {
        this.show = false
      }
    }
  },
  ready () {
    this.now = this.value ? new Date(this.value) : new Date()
    document.addEventListener('click', this.leave, false)
  },
  beforeDestory () {
    document.removeEventListener('click', this.leave, false)
  }
}
</script>
