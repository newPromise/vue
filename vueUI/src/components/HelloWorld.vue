<template>
 <div>
  <p>回复低俗</p>
  <p>比好浮点数</p>
  <button @click="dd">点击加载</button>
 </div>
</template>

<script type="text/ecmascript-6">
 export default {
   data () {
     return {
     }
   },
   methods: {
     dd () {
       this.msg.alert('我是标题', '我是内容').then(() => {
         console.log('你好')
       }, () => {
         console.log('我拒绝了')
       })
     }
   },
   mounted () {
   },
   components: {
   }
 }
</script>

<style scoped >
</style>
