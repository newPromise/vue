```
<template>
  <div v-if='infomationDetail' class='mp-sliderow-wrapper' @touchstart='startLocat($event)' @touchend='endLocat($event)'  @touchmove='moveLocat($event)'>
    <div class='mp-sliderow' :class="{ 'back': isMove }"  ref='slide' :style="{ left: distance + 'px', right: rightInstance + 'px' }">
      <mp-row class='row' :value='readStatu'>
        <div class='mp-sliderow-text' slot='title'>
          <slot name='value'>
             <p :class='slideRowTextClassName'>{{ infomationDetail.title }}</p>
             <p :class='slideRowTextClassName'>{{ infomationDetail.sendTime }}</p>
          </slot>
        </div>
      </mp-row>
      <div class='mp-sliderow-slide'>
        <span class='sliderow-top' v-if='showTop'  @click='toTop'>置顶{{order}}</span><span v-if='showHasRead' @click='readAct' class='sliderow-read' >{{hasRead ? '标为未读' : '标为已读'}}</span><span v-if='showDelete' class='sliderow-delete' @click='deleteAct' >删除</span>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
import install from './index';

export default {
  name: 'Sliderow',
  props: {
    infomationDetail: Object,
    order: Number,
    showDelete: {
      type: Boolean,
      default: false
    },
    showTop: {
      type: Boolean,
      default: false
    },
    showHasRead: {
      type: Boolean,
      default: false
    },
    slideRowTextClassName: String
  },
  data() {
    return {
      readStatu: '',
      start: '',
      move: '',
      distance: 0,
      hasRead: false,
      slideLeft: '',
      slideWidth: '',
      lastMove: '',
      rightInstance: '',
      isMove: false,
      isLeft: false,
      hasMove: false,
      isClick: false
    };
  },
  watch: {
    isClick(newVal) {
      if (newVal) {
        this.beClick();
      }
    }
  },
  methods: {
    init() {
      this.slideLeft = this.$refs.slide.style.left;
      this.slideLeft = parseInt(this.slideLeft, 0);
      this.slideWidth = document.defaultView.getComputedStyle(
        this.$refs.slide
      ).width;
      this.slideWidth = parseInt(this.slideWidth, 0);
    },
    readAct() {
      this.hasRead = !this.hasRead;
      if (this.showHasRead === true) {
        this.readStatu = this.hasRead ? '已读' : '未读';
      } else {
        this.readStatu = '';
      }
      this.reset();
    },
    toTop() {
      const val = this.order;
      this.$emit('top', val);
      this.reset();
    },
    deleteAct() {
      this.$el.parentNode.removeChild(this.$el);
      this.$emit('delete', this.infomationDetail);
    },
    reset() {
      this.distance = 0;
      this.init();
    },
    startLocat(event) {
      this.isMove = false;
      this.hasMove = false;
      this.isClick = false;
      this.isLeft = true;
      const touch = event.touches[0];
      this.start = touch.pageX - this.distance;
    },
    moveLocat(event) {
      const touch = event.touches[0];
      this.move = touch.pageX;
      // true 向左 false 向右
      const direction = () => {
        const move = parseInt(this.move, 0);
        const lastMove = parseInt(this.lastMove, 0);
        if (move - lastMove > 0) {
          this.isLeft = false;
          return 'right';
        }
        if (move - lastMove !== 0) {
          this.hasMove = true;
        } else {
          this.hasMove = false;
        }
        this.isLeft = true;
        return 'left';
      };
      direction();
      const go = () => {
        const distance = this.move - this.start;
        this.distance = distance;
      };
      go();
      this.init();
      this.lastMove = this.move;
    },
    endLocat() {
      this.init();
      const slideActions = (Number(parseInt(this.slideWidth, 0)) / 17) * 7;
      // 如果向右滑动距离大为0, 距离为0
      if (this.slideLeft > 0) {
        this.distance = 0;
        this.hasMove = true;
      }
      // 如果正常状态 isClick 为 true
      if (this.slideLeft === 0) {
        this.isClick = true;
      }
      // 如果滑动到最右边
      if (-this.slideLeft > slideActions) {
        this.distance = -slideActions;
        this.hasMove = true;
        this.isMove = true;
      }
      // 如果滑动距离小于 150 不滑出
      // else 滑出
      if (-this.slideLeft < 150) {
        this.distance = 0;
      } else {
        this.distance = -slideActions;
        this.isMove = true;
      }
      // 如果向右滑动, 回去
      if (this.isLeft === false) {
        this.distance = 0;
        this.hasMove = true;
      }
      // 如果滑出状态, 点击回去
      if (-this.slideLeft === slideActions) {
        this.distance = 0;
        this.hasMove = true;
      }
      // 如果是点击
      if (this.hasMove === false) {
        this.$emit('click', this.infomationDetail);
      }
    }
  },
  mounted() {
    this.init();
    install(this);
  }
};
</script>
<style scoped lang='scss'>
.mp-sliderow-wrapper {
  height: 1.5rem;
  width: 100%;
  overflow: hidden;
  position: relative;
  .back {
    transition: 0.4s ease-in-out;
  }
  .mp-sliderow {
    left: 0;
    height: 100%;
    position: absolute;
    width: 170%;
    display: flex;
    .row {
      flex: 1;
    }
    .mp-sliderow-text {
      color: lightgray;
      line-height: 0.7rem;
    }
    .mp-sliderow-slide {
      height: 100%;
      flex: 0.7;
      display: flex;
      > span {
        text-align: center;
        display: inline-block;
        height: inherit;
        line-height: 1.5rem;
        color: white;
      }
      .sliderow-top {
        flex: 1;
        background-color: #eeeeee;
      }
      .sliderow-read {
        flex: 2;
        background-color: #dddddd;
      }
      .sliderow-delete {
        flex: 1;
        background-color: #fe4040;
      }
    }
  }
}
</style>

```
// index.js 文件
```
const instanceCase = [];
let instance;
const install = (el) => {
  instance = el;
  instanceCase.push(instance);
  instance.beClick = function () {
    for (const single of instanceCase) {
      single.distance = 0;
    }
  };
};
export default install;
```
