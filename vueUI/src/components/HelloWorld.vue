<template>
 <div class="content" ref="content">
   <swipe>
     <swipe-item v-for="(item, index) of items" :key="index" :style="{'backgroundColor': item}">1</swipe-item>
   </swipe>
 </div>
</template>

<script type="text/ecmascript-6">
 import sliderow from '../common/sliderow.vue';
 import swipe from './common/swipe';
 import swipeItem from './common/swipeItem';
 export default {
   data () {
     return {
       topCase: [],
       items: ['yellow', 'green'],
       colors: 'green'
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
     sliderow, swipe, swipeItem
   }
 }
</script>

<style scoped >
.content {
  height: 200px;
  width: 100%;
  background:red;
}
</style>
