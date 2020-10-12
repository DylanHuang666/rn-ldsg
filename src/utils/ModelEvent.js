'use strict'
import {
    DeviceEventEmitter
} from 'react-native';

function _checkWait(self) {
	if (!self._wait) return;

	for (let evt in self._wait) {
		const cbs = self._wait[evt];
		for (let i = cbs.length; i >= 0; --i) {
			self.remove(evt, cbs[i]);
		}
	}

	self._wait = null;
}

function _addWait(self, evt, fnCallback) {
	if (!self._wait) self._wait = {};

	let cbs = self._wait[evt];
	if (!cbs) {
		cbs = [];
		self._wait[evt] = cbs;
	}
	cbs.push(fnCallback);
}

export default class ModelEvent {


	// /**
	//  * 添加到实体
	//  * @param {Object} entity
	//  */
	// static addToEntity(entity) {
	// 	if (entity.__vvDispatcher__) {
	// 		return;
	// 	}

	// 	entity.__vvDispatcher__ = new ModelEvent();
	// }

	/**
	 * 实体发布事件
	 * @param {Object} entity
	 * @param {string} evt
	 * @param {any} data
	 */
	static dispatchEntity(entity, evt, data) {
        DeviceEventEmitter.emit(evt,data);
        // if (!entity) return;
        //
		// let l = entity.__vvDispatcher__;
		// if (!l) {
		// 	l = new ModelEvent();
		// 	entity.__vvDispatcher__ = l;
		// }

		// l.dispatch(evt, data);
	}

	/**
	 * 删除实体事件回调
	 * @param {Object} entity
	 * @param {string} evt
	 * @param {func} fnCallback
	 */
	static removeEvent(entity, evt, fnCallback) {
        DeviceEventEmitter.removeListener(evt,fnCallback);

        // if (!entity) return;
        //
		// let l = entity.__vvDispatcher__;
		// if (!l) {
		// 	return;
		// }
        //
		// l.remove(evt, fnCallback);
	}

	/**
	 * 添加实体事件回调
	 * @param {Object} entity
	 * @param {string} evt
	 * @param {func} fnCallback
	 */
	static addEvent(entity, evt, fnCallback) {
        DeviceEventEmitter.addListener(evt,fnCallback);
        // if (!entity) return;
        //
		// let l = entity.__vvDispatcher__;
		// if (!l) {
		// 	l = new ModelEvent();
		// 	entity.__vvDispatcher__ = l;
		// }
        //
		// l.add(evt, fnCallback);
	}

	constructor() {
		this._listener = {};

		this._wait = null;

		this._cbs = null;
	}

	add(evt, fnCallback) {
		let cbs = this._listener[evt];
		if (!cbs) {
			cbs = [];
			this._listener[evt] = cbs;
		}

		if (cbs.indexOf(fnCallback) >= 0) {
			return;
		}

		cbs.push(fnCallback);
	}

	remove(evt, fnCallback) {
		if (this._cbs) {
			//正在分发过程不能删除
			_addWait(this, evt, fnCallback);
			return;
		}

		const cbs = this._listener[evt];
		if (!cbs) return;
		for (let i = 0, l = cbs.length; i < l; ++i) {
			if (fnCallback == cbs[i]) {
				cbs.splice(i, 1);
				if (cbs.length == 0) {
					delete this._listener[evt];
				}
				return;
			}
		}
	}

	dispatch(evt, data) {
		const cbs = this._listener[evt];
		if (!cbs) return;

		//dispatch的堆栈中，循环再次分发同一个事件，这样会有问题
		if (this._cbs && this._cbs.indexOf(cbs) >= 0) {
			return;
		}
		if (!this._cbs) {
			this._cbs = [cbs];
		} else {
			this._cbs.push(cbs);
		}

		for (let i = 0, l = cbs.length; i < l; ++i) {
			const cb = cbs[i];
			try {
				cb(data);
			} catch (error) {
				console.error(error);
			}
		}

		this._cbs.pop();
		if (this._cbs.length == 0) {
			this._cbs = null;

			_checkWait(this);
		}


	}
}