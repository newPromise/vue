<template>
	<div class="swipe" ref="swipe">
		<div class="swipe-wrap" ref="items">
			<slot></slot>
		</div>
		<div class="swipe-indicator">
				<span v-for="(item, index) of swipeItems" :key="index" class="indicator" v-bind:class="{'indicatorActive': currentIndex == index}"></span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
 export default {
	 data() {
		 return {
			 swipeItems: [],
			 currentIndex: 0,
			 swipe: '',
			 touchState: {},
			 timer: '',
			 translateOffset: 375
		 }
	 },
	 methods: {
		 init() {
			 this.swipeItems = this.$refs.items.children;
			 this.swipe = this.$refs.items;
			 this.$refs.swipe.addEventListener('touchstart', (event) => {
				 clearInterval(this.timer);
				 this.whenTouchStart(event);
			 });
			 this.$refs.swipe.addEventListener('touchend', (event) => {
				 this.timer;
				 // this.animate();
				 this.whenTouchEnd(event);
			 });
			 this.$refs.swipe.addEventListener('touchmove', (event) => {
				 this.whenTouchMove(event);
			 });
			 this.animate();
		 },
		 // 表示手指touch 的时候的相关动作
		 moveAct(offset, isBack) {
			 if (this.currentIndex >= this.swipeItems.length) {
				this.currentIndex = 0;
			 }
			 if (this.currentIndex < 0) {
				 this.currentIndex = this.swipeItems.length - 1;
			 }
			 let preIndex = this.currentIndex - 1;
			 let nextIndex = this.currentIndex + 1;
			 if (preIndex < 0) {
				 preIndex = this.swipeItems.length - 1;
			 }
			 if (nextIndex >= this.swipeItems.length) {
				 nextIndex = 0;
			 }
			 // offset < 0 表示向左滑动
			 if (offset < 0) {
				  this.swipeItems[preIndex].style.webkitTransition = '';
			    this.swipeItems[preIndex].style.webkitTransform = `translate3d(${this.translateOffset + offset}px, 0, 0)`;
			 } else {
				  this.swipeItems[preIndex].style.webkitTransition = '';
			    this.swipeItems[preIndex].style.webkitTransform = `translate3d(${-this.translateOffset + offset}px, 0, 0)`;
			 }
			 this.swipeItems[this.currentIndex].style.webkitTransition = '';
			 this.swipeItems[this.currentIndex].style.webkitTransform = `translate3d(${offset}px, 0px, 0px)`;
			 if (isBack) {
				 this.swipeItems[preIndex].style.webkitTransition = '';
			    this.swipeItems[preIndex].style.webkitTransform = `translate3d(${this.translateOffset + offset}px, 0, 0)`;
			 }
		 },
		 // 执行动画
		 // 基本的思路是将元素显示为三个部分
		 animate(options) {
			 let offset = 375;
			 let translateIndex = this.currentIndex;
			 let speed = 3;
			 let that = this;
			 let doAnimate = function() {
				 that.currentIndex ++; // 这里出现了问题
				 if (that.currentIndex >= that.swipeItems.length) {
					 that.currentIndex = 0;
				 }
				 let preIndex = that.currentIndex - 1;
				 let nextIndex = that.currentIndex + 1;
				 let length = that.swipeItems.length;
				 preIndex = preIndex < 0 ? length - 1 : preIndex;
				 nextIndex = nextIndex >= length ? 0 : nextIndex;
				 // 对于上一个索引元素进行移出
				 that.translateOut(that.swipeItems[preIndex], that.translateOffset, 3);
				 // 对于当前元素进行移入
				 that.translateIn(that.swipeItems[that.currentIndex], 3);
				 console.log('需要进行移入的元素', that.currentIndex, that.swipeItems[that.currentIndex]);
				 // that.translateReady(that.swipeItems[preIndex], that.translateOffset, 3);
				 
			 };
			 this.timer = setInterval(function () {
				 doAnimate.call(this);
			 }, 5000);
			 this.timer;
		 },
		 // 显示的元素被滑出
		 // 显示的元素移除
		 translateOut(element, offset, speed) {
			 element.style.webkitTransition = `-webkit-transform ${speed}s ease-in-out`; 
			 element.style.webkitTransform = `translate3d(${-offset}px, 0, 0)`;
			 // 当 webkitTransitionEnd 事件被触发的时候, 将 -375 位置的元素变为 375px 处的元素。
			 element.addEventListener('webkitTransitionEnd', (event) => {
				 if (element.style.webkitTransform === 'translate3d(-375px, 0px, 0px)') {
					 element.style.webkitTransition = '';
					 element.style.webkitTransform = 'translate3d(375px, 0, 0)';
				 }
			 });
		 },
		 // 显示的元素移入
		 translateIn(element, speed) {
			 element.style.webkitTransition = `-webkit-transform ${speed}s ease-in-out`; 
			 element.style.webkitTransform = `translate3d(0, 0, 0)`;
		 },
		 // 等待状态，表示元素准备进行移入
		 translateReady(element, offset) {
			 element.style.webkitTransition = '';
			 element.style.webkitTransform = `translate3d(${offset}px, 0, 0)`;
		 },
		 // 初始化移动位置
		 initTranlate(element, speed) {
			 element.style.webkitTransition = '';
			 element.style.webkitTransform = 'translate3d(0, 0, 0)';
		 },
		 // 暂停动画
		 animateStop() {
			 clearInterval(this.timer);
		 },
		 // 当 touchstart 事件触发的时候执行 whenTouchStart 函数
		 whenTouchStart(event) {
			 let touch = event.touches[0];
			 this.touchState.startX = touch.pageX;
			 this.animateStop();
		 },
		 // 当 touchmove 事件触发的时候，执行 whenTouchMove 函数
		 whenTouchMove(event) {
			 let touch = event.touches[0];
			 this.touchState.moveX = touch.pageX;
			 this.touchState.distance = this.touchState.moveX - this.touchState.startX;
			 console.log('之前的currentIndex', this.currentIndex);
			 this.moveAct(this.touchState.distance);
		 },
		 whenTouchEnd(event) {
			 // 当touchend 的时候使用 changeTouches 进行求解
			 let touch = event.changedTouches[0];
			 this.touchState.endX = touch.pageX;
			 this.touchState.endDistance = this.touchState.endX - this.touchState.startX;
			 console.log('touchend', this.currentIndex);
			 this.ensurePosWhenTouchEnd(this.touchState.endDistance);
		 },
		 // 当touchend 事件触发的时候执行 ensurePosWhenTouchEnd 函数
		 // 用于确定位置
		 ensurePosWhenTouchEnd(distance) {
			 // 当我们向右滑动的时候
			 if (distance > 0 && (distance > this.translateOffset / 2)) {
				 this.currentIndex--;
				 this.moveAct(0, true);
			 }
			 if (distance > 0 && (distance < this.translateOffset / 2)) {
				 this.moveAct(0);
			 }
			 // 当我们向左滑动的时候
			 if (distance < 0 && (Math.abs(distance) > this.translateOffset / 2)) {
				 this.currentIndex++;
				 this.moveAct(0, true);
			 }
			 if (distance < 0 && (Math.abs(distance) < this.translateOffset / 2)) {
				 this.moveAct(0);
			 }
			 this.animate();
		 }
	 },
	 components: {
	 },
	 mounted() {
		 this.init();
	 }
 }
</script>

<style scoped >
.swipe {
	width: 100%;
	height: 100%;
}
.swipe-wrap {
	height: 100%;
	position: relative;
	overflow: hidden;
}
.swipe-indicator {
	position: absolute;
	bottom: 0;
	z-index: 1000;
	height: 50px;
	width: 100%;
	text-align: center;
	background-color: gold;
	display: flex;
	align-items: center;
	justify-content: center;
}
.indicator {
	width: 8px;
	height: 8px;
	display: inline-block;
	line-height: 50px;
	margin: 0 8px;
	background-color: white;
	border-radius: 50%;
}
.indicatorActive {
	background-color: gray;
}
</style>
