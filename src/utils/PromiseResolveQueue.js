/**
 * Promise队列(只处理resolve)
 * 使用于任务只能单例执行
 * 用法
 * 
 * 1、假设定义了单例变量
 * let sm_queue;
 * 
 * 2、先判定是否在执行
 * if (sm_quue) {
 *  sm_queue.add(resolve);
 *  return;
 * }
 * 
 * 3、创建队列
 * sm_quue = new PromiseResolveQueue(resolve);
 * 
 * 4、执行异步任务
 * const result = await _doTask();
 * 
 * 5、任务结束
 * const queue = sm_queue;
 * sm_queue = null;
 * queue.end(result);
 * 
 */

'use strict';

export default class PromiseResolveQueue {

    /**
     * 任务开始执行之前调用
     * @param {function} resolve 
     */
    constructor(resolve) {
        this._resolveQueue = [resolve];
    }

    /**
     * 添加到队列
     * 如果执行完毕(调用了end)，会报错的哦
     * @param {function} resolve 
     */
    add(resolve) {
        this._resolveQueue.push(resolve);
    }

    /**
     * 执行的任务结束
     * @param {*} data 
     */
    end(data) {
        if (!this._resolveQueue) {
            return;
        }

        const a = this._resolveQueue;
        this._resolveQueue = null;

        for (let resolve of a) {
            resolve(data);
        }
    }
}