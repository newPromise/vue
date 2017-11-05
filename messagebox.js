var CONFIRM_TEXT = '确定';
var CANCEL_TEXT = '取消';

var defaults = {
  title: '提示',
  message: '',
  type: '',
  showInput: false,
  showClose: true,
  modalFade: false,
  lockScroll: false,
  closeOnClickModal: true,
  inputValue: null,
  inputPlaceholder: '',
  inputPattern: null,
  inputValidator: null,
  inputErrorMessage: '',
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonPosition: 'right',
  confirmButtonHighlight: false,
  cancelButtonHighlight: false,
  confirmButtonText: CONFIRM_TEXT,
  cancelButtonText: CANCEL_TEXT,
  confirmButtonClass: '',
  cancelButtonClass: ''
};

import Vue from 'vue';
import msgboxVue from './message-box.vue';

// 这里类似于使用 Object.assign 的用法
var merge = function(target) {
  for (var i = 1, j = arguments.length; i < j; i++) {
    var source = arguments[i];
    for (var prop in source) {
      // 判断是否具有属性不包括原型链上的属性
      if (source.hasOwnProperty(prop)) {
        var value = source[prop];
        if (value !== undefined) {
          target[prop] = value;
        }
      }
    }
  }

  return target;
};

var MessageBoxConstructor = Vue.extend(msgboxVue);

// currentMsg 用来表示现在的信息
// instance 表示 message 实例
// msgQueue 表示放置message 的数组，用来存放 msgQuue
var currentMsg, instance;
var msgQueue = [];

// 定义默认的回调函数
const defaultCallback = action => {
  if (currentMsg) {
    var callback = currentMsg.callback;
    if (typeof callback === 'function') {
      // 如果 instance  实例的 showInput 为 true
      if (instance.showInput) {
        callback(instance.inputValue, action);
      } else {
        callback(action);
      }
    }
    // 如果 currentMsg 具有 resolve 属性
    if (currentMsg.resolve) {
      var $type = currentMsg.options.$type;
      if ($type === 'confirm' || $type === 'prompt') {
        if (action === 'confirm') {
          if (instance.showInput) {
            currentMsg.resolve({ value: instance.inputValue, action });
          } else {
            // 将 action 传递给 currentMsg 的 promise resolve函数
            currentMsg.resolve(action);
          }

        } else if (action === 'cancel' && currentMsg.reject) {
          currentMsg.reject(action);
        }
      // 对于 type === alert的类型, 直接使用 resolve 函数调用
      } else {
        currentMsg.resolve(action);
      }
    }
  }
};

// 初始化实例, 定义实例的 callback 函数
var initInstance = function() {
  instance = new MessageBoxConstructor({
    el: document.createElement('div')
  });

  instance.callback = defaultCallback;
};

// showNextMsg 的作用在于生成一个 instacne实例
// 在生成 instace 实例之前需要进行判断
// 在生成实例的时候还需要注意生成实例的顺序
var showNextMsg = function() {
  // 这里面如果存在instance 实例 如果
  if (!instance) {
    initInstance();
  }

  if (!instance.value || instance.closeTimer) {
    if (msgQueue.length > 0) {
      // 使用数组的 shift() 以及 push() 方法执行的是压入弹出操作
      currentMsg = msgQueue.shift();
      var options = currentMsg.options;
      for (var prop in options) {
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop];
        }
      }
      if (options.callback === undefined) {
        instance.callback = defaultCallback;
      }
      // 如果他们是 undefined 那么将他们设为 true
      ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape'].forEach(prop => {
        if (instance[prop] === undefined) {
          instance[prop] = true;
        }
      });
      document.body.appendChild(instance.$el);

      Vue.nextTick(() => {
        instance.value = true;
      });
    }
  }
};

var MessageBox = function(options, callback) {
  if (typeof options === 'string') {
    options = {
      title: options
    };
    // 使用 arguments 是传入的函数
    if (arguments[1]) {
      options.message = arguments[1];
    }
    if (arguments[2]) {
      options.type = arguments[2];
    }
  } else if (options.callback && !callback) {
    callback = options.callback;
  }
  // 如果 Promise 的状态不等于 undefined 返回一个 promise 对象
  if (typeof Promise !== 'undefined') {
    return new Promise(function(resolve, reject) { // eslint-disable-line
      msgQueue.push({
        options: merge({}, defaults, MessageBox.defaults || {}, options),
        callback: callback,
        resolve: resolve,
        reject: reject
      });
      // 生成message 实例
      showNextMsg();
    });
  } else {
    msgQueue.push({
      options: merge({}, defaults, MessageBox.defaults || {}, options),
      callback: callback
    });

    showNextMsg();
  }
};

MessageBox.setDefaults = function(defaults) {
  MessageBox.defaults = defaults;
};

MessageBox.alert = function(message, title, options) {
  if (typeof title === 'object') {
    options = title;
    title = '';
  }
  // 这里使用 merge 将 options 合并进入到原来的参数中去
  return MessageBox(merge({
    title: title,
    message: message,
    $type: 'alert',
    closeOnPressEscape: false,
    closeOnClickModal: false
  }, options));
};

MessageBox.confirm = function(message, title, options) {
  if (typeof title === 'object') {
    options = title;
    title = '';
  }
  return MessageBox(merge({
    title: title,
    message: message,
    $type: 'confirm',
    showCancelButton: true
  }, options));
};

MessageBox.prompt = function(message, title, options) {
  if (typeof title === 'object') {
    options = title;
    title = '';
  }
  return MessageBox(merge({
    title: title,
    message: message,
    showCancelButton: true,
    showInput: true,
    $type: 'prompt'
  }, options));
};

MessageBox.close = function() {
  if (!instance) return;
  instance.value = false;
  msgQueue = [];
  currentMsg = null;
};

export default MessageBox;
export { MessageBox };
