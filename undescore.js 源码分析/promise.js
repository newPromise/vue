var PENDING = 0,
    FULFILLED = 1,
    REJECTED = 2;

// isFunction 用于判断是否为函数
function isFunction(fn) {
    return fn instanceof Function;
}

// isObject 判断是否为
function isObject(obj) {
    return obj instanceof Object;
}

function isPromise(p) {
    return p instanceof Promise;
}

function isThenable(obj) {
    return obj && isFunction(obj.then);
}
// 使用 callLater 实现的异步
function callLater(fn) {
    setTimeout(fn, 0);
}

// 传递函数参数 executor
function Promise(executor) {
    var that = this;
    that.status = PENDING;
    that.value = undefined;
    that.handlerQueue = [];

    executor(function(value) {
        that.transition(FULFILLED, value);
    }, function(reason) {
        that.transition(REJECTED, reason);
    });
}

// 定义 transition 事件用于传递函数的值
Promise.prototype.transition = function(status, value) {
    if (this.status === PENDING) {
        this.status = status;
        this.value = value;
        this.process();
    }
};

// 定义 process
Promise.prototype.process = function() {
    var that = this;
    if (that.status === PENDING) {
        return;
    }

    while (that.handlerQueue.length > 0) {
      // 执行的函数是从 that.handlerQueue 队列中 shift 中的函数
        var handler = that.handlerQueue.shift();
        (function(handler) {
          // 对于不同的状态要执行不同的函数
          // handler.onFulfieed 以及 hander.onRejected 函数
            var handlerFn = that.status === FULFILLED ? handler.onFulfilled :
                handler.onRejected;
            // 如果 handlerFn 是一个函数，执行下面的 callLater 函数  
            if (isFunction(handlerFn)) {
                callLater(function() {
                    try {
                        var x = handlerFn(that.value);
                        resolve(handler.thenPromise, x);
                    } catch (e) {
                        handler.thenPromise.transition(REJECTED,
                            e);
                    }
                });
            } else {
               // 通过调用 handler.thenPromise.transition 进行函数传递
                handler.thenPromise.transition(that.status, that.value);
            }
        })(handler);
    }
};

function resolve(promise, x) {
  // 如果 promise === x
    if (promise === x) {
      // 向promise 中传递 rejectedd 一个 new TypeError
        promise.transition(REJECTED, new TypeError());
    } else if (isPromise(x)) {
      // 这里的 x 是 promise 的实例吗 ? 
      // 通过调用 promise 的实例进行传递函数
        x.then(function(value) {
          // transition 传递
            promise.transition(FULFILLED, value);
        }, function(reason) {
            promise.transition(REJECTED, reason);
        });
        // 如果 x 是一个对象或者一个函数
    } else if (isObject(x) || isFunction(x)) {
        try {
            var then = x.then;
            // 如果 then 是一个函数
            if (isFunction(then)) {
                var called = false;
                try {
                  // 执行 then.call 函数
                    then.call(x, function(y) {
                        if (!called) {
                            resolve(promise, y);
                            called = true;
                        }
                    }, function(r) {
                        if (!called) {
                            promise.transition(REJECTED, r);
                            called = true;
                        }
                    });
                    // 捕捉 catch
                } catch (e) {
                    if (!called) {
                        promise.transition(REJECTED, e);
                    }
                }
            } else {
                // 传递 fulfilled
                promise.transition(FULFILLED, x);
            }
        } catch (e) {
          // 传递一个 rejected
            promise.transition(REJECTED, e);
        }
    } else {
      // 传递一个 fullfilled
        promise.transition(FULFILLED, x);
    }
};

///////////////////////
Promise.resolve = function(value) {
    return new Promise(function(resolve, reject) {
      // 如果 value.then 是一个函数
        if (isThenable(value)) {
          // 执行 value.then 函数
            value.then(resolve, reject);
        } else {
            resolve(value);
        }
    });
};

Promise.reject = function(reason) {
    return new Promise(function(resolve, reject) {
        reject(reason);
    });
};

// 当调用 then 的时候将 onFulfilled onRejected 函数存入到 handlerQueue 之中
Promise.prototype.then = function(onFulfilled, onRejected) {
    var thenPromise = new Promise(function() {});

    this.handlerQueue.push({
        onFulfilled: onFulfilled,
        onRejected: onRejected,
        thenPromise: thenPromise
    });
    // 执行 process
    this.process();
    // 返回一个 thenPromise
    return thenPromise;
};

if (module && module.exports) {
    module.exports = Promise;
}