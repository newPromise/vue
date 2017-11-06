<template>
 <msgbox :options="options">
	 <div slot="msgContent">
		 <p>我是一段文字</p>
	 </div>
 </msgbox>
</template>

<script type="text/ecmascript-6">
 import msgbox from '../msgbox/msgBox'
 export default {
   data () {
     return {
			 options: {}
     }
   },
   components: {
     msgbox
	 },
	 mounted () {
	 }
 }
</script>

<style scoped >

 
</style>