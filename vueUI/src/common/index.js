import Vue from 'vue'
import Toast from './toast'
import msgbox from './msgbox'
import alert from './alert'

const install = () => {
  Vue.component(Toast.name, Toast)
  Vue.prototype.msg = msgbox
  Vue.prototype.alert = alert
}

export default install
