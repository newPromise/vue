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

// 如果 obj 存在并且 obj 是一个函数
function isThenable(obj) {
	return obj && isFunction(obj);
}

function callLater(fn) {
	setTimeout(fn, 0);
}

// promise 构造函数
// executor 执行函数
// 执行函数接收两个函数, 分别作为执行状态
// 分别作为成功状态和执行状态
// executor(resolve, reject);
// 通过使用 resolve(value); 以及 reject(value)
// 实现对于值得传递
function Promise (executor) {
	let that = this;
	that.status = PENDING;
	that.value = void 0;
	// 执行的序列
	that.handlerQueue = [];
	executor(function(value) {
		// 执行 that.transition 函数的时候进行值的传递
		that.transition(FULFILLED, value);
	}, function(reason) {
		that.transition(REJECTED, reason);
	});
}

// 执行 transition 的函数状态

Promise.prototype.transition = function() {
	if (this.status === PENDING) {
		this.status = status;
		this.value = value;
		this.process();
	}
};


// promise.prototype.process 函数

// resolve 函数



// 使用 Promise.resolve 函数

Promise.resolve = function (value) {
	return new Promise(function(resolve, reject) {
		if (isThenable(value)) {
			// 使用 value.then 将 resolve, reject 
			// 函数存放到 this.handlerQueue 中去
			value.then(resolve, reject);
		} else {
			resolve(value);
		}
	});
};

// 返回一个 new Promise 实例
Promise.reject = function(reason) {
	return new Promise(function(resolve, reject) {
		reject(reason);
	});
};

Promise.prototype.then = function(onFulfilled, onRejected) {
	let thenPromise = new Promise(function() {});
	this.handlerQueue.push({
		onFulfilled: onFulfilled,
		onRejected: onRejected,
		thenPromise: thenPromise
	});
	this.process();
	return thenPromise;
}

if (module && module.exports) {
	module.exports = Promise;
}

