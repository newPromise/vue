import Alert from './alert'
import Vue from 'vue'

const Constructor = Vue.extend(Alert)
let instance
let currentInstance
const instanceCase = []

const initInstance = () => {
	if (!instance) {
		instance = new Constructor({ el: document.createElement('div') })
	}
}

const showInstance = options => {
	initInstance()
	if (instanceCase.length > 0) {
		currentInstance = instanceCase.shift()
		const options = currentInstance.options
		for (const key in options) {
			instance.$data.options[key] = options[key]
		}
		document.body.appendChild(instance.$el)
		console.log('instance', instance.$data)
	}
}

const alert = function (options) {
	let title, message;
	if (typeof options === 'object') {
		title = options.title;
		message = options.message;
	} else {
		title = arguments[0];
		message = arguments[1];
	}
	instanceCase.push({ options: {
		title: title,
		message: message,
		showBox: true,
		showMask: true
	} })
	showInstance();
}

export default alert
