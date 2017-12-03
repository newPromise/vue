<template>
 <div class="swipeItem">
	 <slot></slot>
 </div>
</template>

<script type="text/ecmascript-6">
 export default {
	 data() {
		 return {
		 }
	 },
	 components: {
	 }
 }
</script>

<style scoped >
.swipeItem {
	width: 100%;
	height: 100%;
	position: absolute;
} 
</style>
