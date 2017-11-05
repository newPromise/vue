<template>
  <div class="mp-msgbox-wrapper">
    <transition name="mp-bounce">
      <div class="mp-msgbox" v-if="showBox">
        <!-- 消息框头部 -->
        <div class="mp-msgbox-header" v-if="title">
          <div class="mp-msgbox-title">{{title}}</div>
        </div>
        <!-- 消息框内容 -->
        <div class="mp-msgbox-content">
          <!-- alert提示框 -->
          <div class="mp-msgbox-alert" v-if="type === 'alert'">
            {{message}}
          </div>
          <!-- confirm 提示框 -->
          <div class="mp-msgbox-confirm" v-if="type === 'confirm'">
            {{message}}
          </div>
          <!-- prompt 提示框 -->
          <div class="mp-msgbox-prompt" v-if="type === 'prompt' ">
          </div>
        </div>
        <!-- 消息框按钮 -->
        <div class="mp-msgbox-btns">
          <button class="cancelBtn" v-if="showCancelButton" @click="handleAction('cancel')" v-text="cancelButtonText"/>
          <button class="ensureBtn" v-if="showEnsureButton" @click="handleAction('confirm')" v-text="ensureButtonText"/>
        </div>
      </div>
    </transition>
    <div class="msg-mask" v-if="showMask"></div>
  </div>
</template>

<script type="text/ecmascript-6">
 export default {
   name: 'msgBox',
   data () {
     return {
       type: '',
       title: '提示',
       message: '',
       cancelButtonText: '取消',
       ensureButtonText: '确定',
       showBox: false,
       showMask: false,
       showCancelButton: true,
       showEnsureButton: true
     }
   },
   components: {
   },
   methods: {
     handleAction (action) {
       this.showBox = false
       this.showMask = false
       const callback = this.callback
       callback(action)
     }
   }
 }
</script>

<style scoped >
.mp-msgbox {
  z-index: 2018;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 85%;
  border-radius: 3px;
  background-color: #fff;
  font-size: 16px;
  transition: 0.2s;
}
.mp-msgbox-title {
  text-align: center;
}
.mp-msgbox-content {
  padding: 10px 20px 15px;
  border-bottom: 1px solid #ddd;
  min-height: 36px;
  position: relative;
}
.mp-msgbox-alert, .mp-msgbox-confirm{
  text-align: center;
  color: #999;
  margin: 0;
  text-align: center;
  line-height: 36px;
}
.msg-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2017;
  opacity: .5;
  background: #000;
}
.mp-msgbox-header {
  padding: 15px 0 0;
}
.mp-msgbox-btns {
  display: flex;
  height: 40px;
  line-height: 40px;
}
.mp-msgbox-btns button {
  flex: 1;
  display: block;
  background-color: #fff;
  margin: 0;
  border: 0;
  line-height: 35px;
  outline: none;
}
.ensureBtn {
  color: #26a2ff;
}
.cancelBtn, .ensureBtn {
  width: 50%;
}
.mp-msgbox-btns .cancelBtn {
  border-right: 1px solid #ddd;
}
.mp-bounce-enter {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.7);
  }
.mp-bounce-leave-active {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0) scale(0.9);
}
</style>
