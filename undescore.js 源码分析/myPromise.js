var PENDING = 0,
    FULFILLED = 1,
    REJECTED = 2;

function isFunction(fn) {
    return fn instanceof Function;
}

function isObject(obj) {
    return obj instanceof Object;
}

function isPromise(pro) {
    return pro instanceof Promise;
}

function isThenable(obj) {
    return obj && isFunction(obj.then);
}

function callLater(fn) {
    setTimeout(fn, 0);
}

// 定义一个 Promise 函数， 其中参数是一个 executor 执行函数
function Promise(executor) {
    let that = this;
    that.status = PENDING;
    that.value = void 0;
    that.handlerQueue = [];
    executor(function(value) {
        that.transition(FULFILLED, value);
    }, function (reason) {
        that.transition(REJECTED, reason);
    });
}

Promise.prototype.transition = function(status, value) {
  if (this.status === PENDING) {
      this.status = status;
      this.value = value;
      this.process();
  }
}

Promise.resolve = function (value) {
  return new Promise(function (resolve, reject) {
    if (isThenable(value)) {
      value.then(resolve, reject);
    } else {
      resolve(value);
    }
  });
};

Promise.reject = function (reason) {
  return new Promise(function (resolve, reject) {
    reject(reason)
  });
}

Promise.prototype.then = function (onFulfiled, onRejected) {
  let thenPromise = new Promise(function () {});
  this.handlerQueue.push({
    onFulfiled,
    onRejected,
    thenPromise
  });
  this.process();
  return thenPromise;
}

if (module && module.exports) {
  module.exports = Promise;
}