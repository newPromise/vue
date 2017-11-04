import Vue from 'vue'
import Toast from './toast'
import msgbox from './msgbox'

const install = () => {
  Vue.component(Toast.name, Toast)
  Vue.prototype.msg = msgbox
}

export default install
