import msg from './msgBox'
import Vue from 'vue'

const Constructor = Vue.extend(msg)
let instance
let currentMsg
let instancePool = []

const callbackDefault = action => {
  let callback = currentMsg.callback
  if (currentMsg && typeof callback === 'function') {
    callback(action)
  }
  if (currentMsg.resolve) {
    const type = currentMsg.options.type
    if (type !== 'alert' && action === 'confirm') {
      currentMsg.resolve(action)
    } else if (type === 'alert') {
      currentMsg.resolve(action)
    } else if (action === 'cancel' && currentMsg.reject) {
      currentMsg.reject(action)
    }
  }
}
// 用于生成实例
const initInstance = () => {
  if (!instance) {
    instance = new Constructor({ el: document.createElement('div') })
  }
}

// 表示现在的实例
const showMsg = options => {
  initInstance()
  if (instancePool.length > 0) {
    currentMsg = instancePool.shift()
    let currentMsgConfig = currentMsg.options
    for (const prop in currentMsgConfig) {
      if (currentMsgConfig.hasOwnProperty(prop)) {
        instance[prop] = currentMsgConfig[prop]
      }
    }
    document.body.appendChild(instance.$el)
    if (typeof instance.callback === 'undefined') {
      instance.callback = callbackDefault
    }
  }
}

// 用于保存实例
let msgBox = (options, callback) => {
  if (typeof options === 'string') {
    options = {
      title: options
    }
  } else if (options.callback) {
    callback = options.callback
  }
  // 这里通过使用 resolve将 resolve 函数进行传递
  if (typeof Promise !== 'undefined') {
    return new Promise(function (resolve, reject) {
      instancePool.push({
        options: options,
        callback: callback,
        resolve: resolve,
        reject: reject
      })
      showMsg()
    }
  )
  } else {
    instancePool.push({
      options: options,
      callback: callback
    })
    showMsg()
  }
}

msgBox.alert = (title, message, options) => {
  if (typeof title === 'object') {
    options = title
    title = ''
  }
  const alertConfig = {
    title,
    message,
    type: 'alert',
    showBox: true,
    showMask: true,
    showCancelButton: false
  }
  return msgBox(Object.assign(alertConfig, options))
}

msgBox.confirm = (title, message, options) => {
  if (typeof title === 'object') {
    options = title
    title = ''
  }
  const confirmConfig = {
    title,
    message,
    type: 'confirm',
    showBox: true,
    showMask: true
  }
  return msgBox(Object.assign(confirmConfig, options))
}

export default msgBox
