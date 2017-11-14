<template>
 <div>
	 <canvas id="canvas" width="100000px"></canvas>
 </div>
</template>

<script type="text/ecmascript-6">
import trendChart from './canvas.js';
export default {
	name: 'Canvas',
	data() {
		return {
		}
	},
	components: {
	},
	mounted () {
		trendChart.init(document.getElementById('canvas'));
	}
}
</script>
<style>
#canvas {
	width: 100%;
	height: 400px;
}
</style>

