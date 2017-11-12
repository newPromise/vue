<template>
 <div class="content" ref="content">
  <sliderow :top="top"></sliderow>
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
       topCase: []
     }
   },
   methods: {
     top (value) {
       console.log(value);
     },
     dd () {
       this.alert('zha', 'fds')
     }
   },
   mounted () {
     console.log(this.$refs.content.children.length);
   },
   components: {
     sliderow
   }
 }
</script>

<style scoped >
</style>
