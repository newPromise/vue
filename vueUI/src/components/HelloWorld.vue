<template>
 <div>
  <sliderow></sliderow>
  <sliderow></sliderow>
  <sliderow></sliderow>
  <sliderow></sliderow>
 </div>
</template>

<script type="text/ecmascript-6">
 import sliderow from '../common/sliderow.vue';
 export default {
   data () {
     return {
     }
   },
   methods: {
     dd () {
       this.alert('zha', 'fds')
     }
   },
   mounted () {
   },
   components: {
     sliderow
   }
 }
</script>

<style scoped >
</style>
