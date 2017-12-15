let PENDDING = 0;
    FULFILLED = 1;
    REJECTED = 2;

function isFunction (func) {
  return func instanceof Function;
}

function isObject (obj) {
  return obj instanceof Object;
}

function isPromise (p) {
  return p instanceof Promise;
}

function isThenable (obj) {
  return obj && isFunction (obj.then);
}

function callLater (fn) {
  setTimeout(fn, 0);
}

function Promise (executor) {
  let that = this;
  that.status = PENDDING;
  that.value = void 0;
  that.handlerQueue = [];
  executor(function (value) {
    that.transition(FULFILLED, value);
  }, function () {
    that.transition(REJECTED, value);
  });
}

Promise.prototype.transition = function (statu, value) {
  this.status = statu;
  this.value = value;
  this.process();
}

Promise.prototype.process = function () {
  let that = this;
  if (that.status === PENDDING) {
    return;
  }
  while(that.handlerQueue.length > 0) {
    let handler = that.handlerQueue.shift();
    (function (handler) {
      let handlerFn = that.status === FULFILLED ? handler.onFulfilled : handler.onRejected;
      if (isFunction(handlerFn)) {
        callLater(function () {
          try {
            let x = handlerFn(that.value);
            resolve(handler.thenPromise, x);
          } catch (error) {
            handler.thenPromise.transition(REJECTED, error);
          }
        });
      } else {
        handler.thenPromise.transition(that.status, that.value);
      }

    })(handler);
  }
};





// promsie resolve 函数

Promise.resolve = function (value) {
  return new Promise (resolve, reject) {
    if (isThenable(value)) {
      value.then();
    } else {
      resolve(value);
    }
  }
}