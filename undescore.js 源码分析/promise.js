var PENDING = 0,
FULFILLED = 1,
REJECTED = 2;

function isFunction(fn) {
return fn instanceof Function;
}

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

function callLater(fn) {
setTimeout(fn, 0);
}

function Promise(executor) {
var that = this;
that.status = PENDING;
that.value = undefined;
that.handlerQueue = [];

// Promise executor 实现两个函数
// 执行 excutor 函数
// 对于 excutor的两个参数分别传入成功的时候的回调函数以及失败的时候的
// 回调函数
// 在 executor 中传入两个函数，分别表示成功和失败状态
executor(function(value) {
	// 执行 that.transition
		that.transition(FULFILLED, value);
}, function(reason) {
		that.transition(REJECTED, reason);
});
// 后面如何实现成功或者失败状态呢？

}

// promise 的 transition 的函数
// 在 promise 上的 transition 函数， use to 
// if this.staus === PENDING to do this.process() function
Promise.prototype.transition = function(status, value) {
if (this.status === PENDING) {
		this.status = status;
		this.value = value;
		this.process();
}
};

// 关键的 process 函数
Promise.prototype.process = function() {
var that = this;
// when that.status === PENDING 的时候
// 返回否则进行执行下面的函数
if (that.status === PENDING) {
		return;
}

// 
while (that.handlerQueue.length > 0) {
	// 在 handlerQueue 中取出handler 对象
		var handler = that.handlerQueue.shift();
		(function(handler) {
				var handlerFn = that.status === FULFILLED ? handler.onFulfilled :
						handler.onRejected;
				// 如果handlerFn 是一个 function 的时候
				// 这里的作用是什么 ?
				if (isFunction(handlerFn)) {
						callLater(function() {
								try {
									// 执行 handlerFn(that.value) 的函数;
								  // 调用 resolve 进行下一步函数
										var x = handlerFn(that.value);
										resolve(handler.thenPromise, x);
										// 如果 catch 存在错误
								} catch (e) {
									// 调用 handler.thenPromise 的效果
										handler.thenPromise.transition(REJECTED,
												e);
								}
						});
				} else {
					// 在handler. thenPromise 上执行 transition 的函数
						handler.thenPromise.transition(that.status, that.value);
				}
		})(handler);
}
};

// resolve函数, 接收两个参数
// promise 以及 x
function resolve(promise, x) {
if (promise === x) {
		promise.transition(REJECTED, new TypeError());
} else if (isPromise(x)) {
		x.then(function(value) {
				promise.transition(FULFILLED, value);
		}, function(reason) {
				promise.transition(REJECTED, reason);
		});
} else if (isObject(x) || isFunction(x)) {
		try {
				var then = x.then;
				if (isFunction(then)) {
						var called = false;
						try {
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
						} catch (e) {
								if (!called) {
										promise.transition(REJECTED, e);
								}
						}
				} else {
						promise.transition(FULFILLED, x);
				}
		} catch (e) {
				promise.transition(REJECTED, e);
		}
} else {
		promise.transition(FULFILLED, x);
}
};

// 在 promise 的实例上使用 resolve 方法
// 返回一个新的 promise 对象实例
Promise.resolve = function(value) {
return new Promise(function(resolve, reject) {
	// 传入的 value.then 是一个函数的时候
		if (isThenable(value)) {
			// 执行 value.then 函数
				value.then(resolve, reject);
		}
		else {
			// resolve 函数
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
Promise.prototype.then = function(onFulfilled, onRejected) {
var thenPromise = new Promise(function() {});

this.handlerQueue.push({
		onFulfilled: onFulfilled,
		onRejected: onRejected,
		thenPromise: thenPromise
});

this.process();

return thenPromise;
};

if (module && module.exports) {
module.exports = Promise;
}