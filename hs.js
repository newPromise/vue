<template>
  <div class="mp-sliderow-wrapper" @touchstart="startLocat($event)" @touchend="endLocat($event)"  @touchmove="moveLocat($event)">
    <div class="mp-sliderow" ref="slide" id="d" :style="{ left: distance + 'px', right: rightInstance + 'px' }">
      <row :value="readStatu"></row>
      <div class="mp-sliderow-slide">
        <span class="sliderow-top">置顶</span><span @click="readAct" class="sliderow-read">{{hasRead ? '标为已读' : '标为未读'}}</span><span class="sliderow-delete" @click="deleteAct" >删除</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import row from '../row.vue';
export default {
  name: 'Sliderow',
  data () {
    return {
      readStatu: '未读',
      start: '',
      move: '',
      distance: 0,
      hasRead: false,
      slideLeft: '',
      lastMove: '',
      rightInstance: ''
    };
  },
  components: {
    row
  },
  methods: {
    readAct () {
      this.hasRead = !this.hasRead;
      this.readStatu = this.hasRead ? '已读' : '未读';
      this.reset();
    },
    deleteAct () {
      this.$el.parentNode.removeChild(this.$el);
    },
    reset () {
      this.distance = 0;
    },
    startLocat (event) {
      let touch = event.touches[0];
      this.start = touch.pageX - this.distance;
    },
    moveLocat (event) {
      const touch = event.touches[0];
      this.move = touch.pageX;
      let slideLeft = this.$refs.slide.style.left;
      let slideWidth = this.$refs.slide.style.width;
      // true 向左 false 向右
      let leftJuge = () => {
        const move = parseInt(this.move);
        const lastMove = parseInt(this.lastMove);
        let isLeft = true;
        if (move - lastMove > 0) {
          isLeft = false;
        }
        return isLeft;
      };
      let go = () => {
        const distance = this.move - this.start;
        this.distance = distance;
      }
      const direction = parseInt(this.move) - parseInt(this.lastMove);
      slideWidth = parseInt(document.defaultView.getComputedStyle(this.$refs.slide).width);
      slideWidth = (Number(parseInt(slideWidth)) / 17) * 7;
      slideLeft = parseInt(slideLeft);
      this.slideLeft = slideLeft;
      console.log('slideLeft', slideLeft);
      const overflow = -slideLeft > slideWidth ? true : false;
      if (slideLeft >= 0) {
        go();
      }
      this.lastMove = this.move;
    },
    endLocat (event) {
    }
  },
  mounted () {
  }
};
</script>
<style scoped lang="scss">
.mp-sliderow-wrapper {
  min-height: 1.28rem;
  width: 100%;
  overflow: hidden;
  position: relative;
  .mp-sliderow {
    left: 0;
    position: absolute;
    width: 170%;
    display: flex;
    .mp-row {
      flex: 1;
    }
    .mp-sliderow-slide {
      height: 100%;
      flex: 0.7;
      display: flex;
      >span {
        text-align: center;
        display: inline-block;
        height: inherit;
        line-height: 1.28rem;
        color: white;
      }
      .sliderow-top {
        flex: 1;
        background-color: lightgray;
      }
      .sliderow-read {
        flex: 2;
        background-color: lightsalmon;
      }
      .sliderow-delete {
        flex: 1;
        background-color: red;
      }
    }
  }
}
</style>
