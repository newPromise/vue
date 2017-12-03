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
		 show(ele) {
			 ele.style.display = 'block';
		 },
		 hide(ele) {
			 ele.style.display = 'none';
		 },
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
			 this.swipeItems[preIndex].style.webkitTransition = '';
			 this.swipeItems[preIndex].style.webkitTransform = `translate3d(${-this.translateOffset + offset}px, 0, 0)`;
			 this.swipeItems[nextIndex].style.webkitTransition = '';
			 this.swipeItems[nextIndex].style.webkitTransform = `translate3d(${this.translateOffset + offset}px, 0, 0)`;
			 this.swipeItems[this.currentIndex].style.webkitTransition = '';
			 this.swipeItems[this.currentIndex].style.webkitTransform = `translate3d(${offset}px, 0, 0)`;
			 if (isBack) {
				 this.swipeItems[preIndex].style.webkitTransition = '-webkit-transform  ease-in-out';
				 this.swipeItems[this.currentIndex].style.webkitTransition = '-webkit-transform  ease-in-out';
				 this.swipeItems[nextIndex].style.webkitTransition = '-webkit-transform  ease-in-out';
			 }
		 },
		 animate(options) {
			 let offset = 375;
			 let translateIndex = this.currentIndex;
			 let speed = 3;
			 let that = this;
			 let preIndex = 0;
			 let doAnimate = function() {
				 if (that.currentIndex - 1 < 0) {
					 preIndex = that.swipeItems.length - 1;
					 that.translateReady(that.swipeItems[preIndex], offset);
				 } else {
					 that.translateReady(that.swipeItems[that.currentIndex - 1], offset);
				 }
				 that.translateOut(that.swipeItems[that.currentIndex], offset, 1);
				 that.currentIndex ++;
				 if (that.currentIndex  >= that.swipeItems.length) {
					 that.currentIndex = 0;
					 setTimeout(that.translateIn(that.swipeItems[0], 1), 0);
				   // that.initTranlate(that.swipeItems[0], 3);
				 } else {
					 setTimeout(that.translateIn(that.swipeItems[that.currentIndex], 1), 0);
					 // that.initTranlate(that.swipeItems[translateIndex], 3);
				 }
			 };
			 this.timer = setInterval(function () {
				 doAnimate.call(this);
			 }, 2000);
			 this.timer;
		 },
		 translateOut(element, offset, speed) {
			 element.style.webkitTransition = `-webkit-transform ${speed}s ease-in-out`; 
			 element.style.webkitTransform = `translate3d(${-offset}px, 0, 0)`
		 },
		 translateIn(element, speed) {
			 element.style.webkitTransition = `-webkit-transform ${speed}s ease-in-out`; 
			 element.style.webkitTransform = `translate3d(0, 0, 0)`;
		 },
		 translateReady(element, offset) {
			 element.style.webkitTransition = '';
			 element.style.transform = '';
			 element.style.webkitTransform = `translate3d(${offset}px, 0, 0)`;
		 },
		 initTranlate(element, speed) {
			 element.style.webkitTransition = '';
			 element.style.webkitTransform = 'translate3d(0, 0, 0)';
		 },
		 animateStop() {
			 clearInterval(this.timer);
		 },
		 whenTouchStart(event) {
			 let touch = event.touches[0];
			 this.touchState.startX = touch.pageX;
			 this.animateStop();
		 },
		 whenTouchMove(event) {
			 let touch = event.touches[0];
			 this.touchState.moveX = touch.pageX;
			 this.touchState.distance = this.touchState.moveX - this.touchState.startX;
			 this.moveAct(this.touchState.distance);
		 },
		 whenTouchEnd(event) {
			 // 当touchend 的时候使用 changeTouches 进行求解
			 let touch = event.changedTouches[0];
			 this.touchState.endX = touch.pageX;
			 this.touchState.endDistance = this.touchState.endX - this.touchState.startX;
			 this.ensurePosWhenTouchEnd(this.touchState.endDistance);
		 },
		 ensurePosWhenTouchEnd(distance) {
			 if (distance > this.translateOffset / 2) {
				 this.currentIndex--;
				 this.moveAct(0, true);
			 }
			 if (distance < this.translateOffset / 2) {
				 this.moveAct(0, true);
			 }
			 if (distance < 0 && Math.abs(distance) > this.translateOffset / 2) {
				 this.currentIndex++;
				 this.moveAct(0, true);
			 }
			 if (distance < 0 && Math.abs(distance) < this.translateOffset / 2) {
				 this.moveAct(0, true);
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
