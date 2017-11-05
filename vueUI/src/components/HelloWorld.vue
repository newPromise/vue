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
       const options = {
         title: '标题',
         message: '内容'
       }
       this.msg.confirm(options).then(() => {
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
