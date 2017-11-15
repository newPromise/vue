<template>
 <div>
	 <canvas id="canvas"  height="1000" width="400"></canvas>
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
		var chart = trendChart.init(document.getElementById('canvas'));
		console.log('chart', chart);
	}
}
</script>
<style>
</style>

