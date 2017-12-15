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

// 用于判断 obj.then 是否是一个函数
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
		// 关于 executor 中的两个函数
		// resolve 以及 reject
    executor(function(value) {
			// FULFILLED 成功状态
			// resolve 的时候将 状态 FULFILLED 以及 value 共同传入
        that.transition(FULFILLED, value);
    }, function(reason) {
			// 调用 Reject 的时候将 REJECTED 以及 reason 共同传入
        that.transition(REJECTED, reason);
    });
}


// 这个过程: promise => transition => then => process 执行不同操作

// 定义 transition 事件用于传递函数的值
// 调用 transition 的目的在于改变状态的值
Promise.prototype.transition = function(status, value) {
    if (this.status === PENDING) {
        this.status = status;
        this.value = value;
        this.process();
    }
};

// 定义 process
// process 是进行函数执行
Promise.prototype.process = function() {
    var that = this;
    if (that.status === PENDING) {
        return;
    }

    while (that.handlerQueue.length > 0) {
      // 执行的函数是从 that.handlerQueue 队列中 shift 中的函数
				var handler = that.handlerQueue.shift();
				// handler 是从 handlerQueue 队列中取出的对象
        (function(handler) {
          // 对于不同的状态要执行不同的函数
          // handler.onFulfieed 以及 hander.onRejected 函数
            var handlerFn = that.status === FULFILLED ? handler.onFulfilled :
                handler.onRejected;
            // 如果 handlerFn 是一个函数，执行下面的 callLater 函数  
            if (isFunction(handlerFn)) {
						  // 使用 callLater 进行异步
                callLater(function() {
                    try {
											  // 调用 onFulfilled 或者 onRejected 函数
												var x = handlerFn(that.value);
												// 调用 resolve 函数
												// 调用 resolve 函数，调用 then
                        resolve(handler.thenPromise, x);
                    } catch (e) {
											// 抛出错误的时候调用 thenPromise 函数
                        handler.thenPromise.transition(REJECTED,
                            e);
                    }
                });
            } else {
							 // 如果 handler 不是一个 function
               // 通过调用 handler.thenPromise.transition 进行函数传递
                handler.thenPromise.transition(that.status, that.value);
            }
        })(handler);
    }
};

// resolve函数, 接收两个参数
// promise 以及 x
// 这里面调用 then 将 promise 对象的函数传入
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
// 调用 promise 的 resolve 函数
// 使用 promise 的 resulve 状态允许不带有任何的参数
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

// promise.reject 函数
Promise.reject = function(reason) {
// 返回一个 promise 的实例
return new Promise(function(resolve, reject) {
		reject(reason);
});
};

// 执行 promise.then 函数
// 接收两个函数作为参数
// 成功函数 onFulfieed 以及 onRejected 拒绝函数
    return new Promise(function(resolve, reject) {
        reject(reason);
    });
};

// 当调用 then 的时候将 onFulfilled onRejected 函数存入到 handlerQueue 之中
Promise.prototype.then = function(onFulfilled, onRejected) {
	  // 返回创建 的一个 new Promise 的一个实例
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