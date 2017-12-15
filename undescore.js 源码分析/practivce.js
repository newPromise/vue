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

// executor()  相似于  resolve(value) 以及 reject(value)
// (resove, rejected) => { resolve(), rejected }
function Promise (executor) {
  let that = this;
  that.status = PENDDING;
  that.value = void 0;
  that.handlerQueue = [];
  // 执行 executor 函数
  executor(function (value) {
    // 将 value 值以及 FULFILLED 状态传入
    that.transition(FULFILLED, value);
  }, function () {
    // 将 value 值以及 REJECTED 状态传入
    that.transition(REJECTED, value);
  });
}

Promise.prototype.transition = function (statu, value) {
  this.status = statu;
  this.value = value;
  this.process();
}

// 执行 process 函数
// process 函数通过不同的状态执行不同的函数
// 在 process 中执行 resolve 方法
Promise.prototype.process = function () {        
  let that = this;
  if (that.status === PENDDING) {
    return;
  }
  while(that.handlerQueue.length > 0) {
    let handler = that.handlerQueue.shift();
    (function (handler) {
      let handlerFn = that.status === FULFILLED ? handler.onFulfilled : handler.onRejected;
      // 如果 handlerFn 是一个函数
      // 执行下面的结果
      if (isFunction(handlerFn)) {
        callLater(function () {
          try {
            let x = handlerFn(that.value);
            // 异步执行调用 resolve 函数
            // handler.thenPromise promise 函数
            // x 执行函数返回结果
            resolve(handler.thenPromise, x);
          } catch (error) {
            handler.thenPromise.transition(REJECTED, error);
          }
        });
      } else {
        // handler.thenPromise 执行函数
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

// 使用  reject 的时候传递 reason
// 返回一个 new Promise 对象
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
}

// resolve 函数
function resolve(promise, x) {
  if (promise === x) {
    promise.transition(REJECTED, new TypeError());
    // 如果 x 是一个 promise
  } else if (isPromise(x)) {
    x.then(function (value) {
      promise.transition(FULFILLED, value);
    }, function (reason) {
      promise.transition(REJECTED, reason);
    });
    // 如果 x 是一个 对象 或者一个 函数 
  } else if (isObject(x) || isFunction(x)) {
    try {
      let then = x.then;
      if (isFunction(then)) {
        let called = false;
        try {
          then.call(x, function (y) {
            if (!called) {
              resolve(promise, y);
              called = true;
            }
          }, function (r) {
            if (!called) {
              promise.transition(REJECTED, r);
              called = true;
            }
          })
        } catch (e) {
          if (!called) {
            promise.transition(REJECTED, e);
          }
        }
      } else {
        promise.transition(FULFILLED, x);
      }
    } catch(e) {
      promise.transition(REJECTED, e);
    }
  } else {
    // 如果 传递的 x 是一个普通函数
    // 使用 promise.transition 方法
    // 使用 transition 进行传递值
    // promise.transition(FUFILLED, x)
    promise.transition(FULFILLED, x);
  }
}

// onFulfilled 是当成功的时候的函数
// onRejected 是当失败的时候的函数
Promise.prototype.then((onFulfilled, onRejected) => {
  let thenPromise = new Promise(function () {});
  this.handlerQueue.push({
    onFulfilled,
    onRejected,
    thenPromise
  });
  this.process();
  return thenPromsie;
})