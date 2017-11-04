import msgbox from './msgbox'
import Vue from 'vue'

const Constructor = Vue.extend(msgbox)
let instance = new Constructor({ el: document.createElement('div') })

const single = () => {
  document.body.appendChild(instance.$el)
  return instance
}

export default single
