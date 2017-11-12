<template>
  <div class="mp-sliderow-wrapper" @touchstart="startLocat($event)" @touchend="endLocat($event)"  @touchmove="moveLocat($event)">
    <div class="mp-sliderow" :class="{ 'back': isback }" ref="slide" id="d" :style="{ left: distance + 'px', right: rightInstance + 'px' }">
      <div class="row" >{{readStatu}}</div>
      <div class="mp-sliderow-slide">
        <span @click="top(1)" class="sliderow-top">置顶</span><span @click="readAct" class="sliderow-read">{{hasRead ? '标为已读' : '标为未读'}}</span><span  class="sliderow-delete" @click="deleteAct" >删除</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
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
			slideWidth: '',
      lastMove: '',
			rightInstance: '',
			isback: false,
			isLeft: false
    };
  },
  methods: {
		init () {
			this.slideLeft = this.$refs.slide.style.left;
			this.slideLeft = parseInt(this.slideLeft);
			this.slideWidth = document.defaultView.getComputedStyle(this.$refs.slide).width;
			this.slideWidth = parseInt(this.slideWidth);
		},
    readAct () {
      this.hasRead = !this.hasRead;
      this.readStatu = this.hasRead ? '已读' : '未读';
      this.reset();
    },
    deleteAct () {
      this.$el.parentNode.removeChild(this.$el);
		},
		top () {
			this.$emit('top', 1);
		},
    reset () {
      this.distance = 0;
    },
    startLocat (event) {
			this.isback = false;
      let touch = event.touches[0];
      this.start = touch.pageX - this.distance;
    },
    moveLocat (event) {
      const touch = event.touches[0];
      this.move = touch.pageX;
      // true 向左 false 向右
      let direction = () => {
        const move = parseInt(this.move);
        const lastMove = parseInt(this.lastMove);
        if (move - lastMove > 0) {
					this.isLeft = false;
          return 'right';
				}
				this.isLeft = true;
        return 'left';
			};
			direction();
      let go = () => {
        const distance = this.move - this.start;
        this.distance = distance;
			}
			go();
			this.init();
			this.lastMove = this.move;
    },
    endLocat (event) {
			const slideActions = (Number(parseInt(this.slideWidth)) / 17) * 7;
			const slideContent = (Number(parseInt(this.slideWidth)) / 17) * 10;
			if (this.slideLeft > 0) {
				this.distance = 0;
			}
			if (-this.slideLeft > slideActions) {
				this.distance = -slideActions;
				this.isback = true;
			}
			if (-this.slideLeft < 200) {
				this.distance = 0;
				this.isback = true;
			} else {
				this.distance = -slideActions;
				this.isback = true;
			}
			if (!this.isLeft) {
				this.distance = 0;
			}
    }
  },
  mounted () {
		this.init()
  }
};
</script>
<style scoped lang="scss">
.mp-sliderow-wrapper {
  height: 2.5rem;
  width: 100%;
  overflow: hidden;
  position: relative;
	.back {
		transition: .4s ease-in-out;
	}
  .mp-sliderow {
    left: 0;
		height: 100%;
    position: absolute;
    width: 170%;
    display: flex;
    .row {
      flex: 1;
			background-color: salmon
    }
    .mp-sliderow-slide {
      height: 100%;
      flex: 0.7;
      display: flex;
      >span {
        text-align: center;
        display: inline-block;
        height: inherit;
        line-height: 2.5rem;
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
