'use strict';

export default class CDTick {

    /**
     * 工厂方法
     * 根据秒构造CDTick
     * @param {int} sec 秒数
     * @returns CDTick
     */
    static createBySec(sec) {
        let ret = new CDTick();

        const totalCdTick = sec * 1000;

        // ret.m_TotalCdTick = totalCdTick;
        // ret.m_LeftCdTick = totalCdTick;
        // ret.m_PrevCDDecreaseTick = Date.now();

        ret.m_endTick = Date.now() + totalCdTick;

        return ret;
    }

    /**
     * 工厂方法
     * 根据毫秒构造CDTick
     * @param {int} totalCdTick 毫秒
     * @returns CDTick
     */
    static createByTick(totalCdTick) {
        let ret = new CDTick();

        // ret.m_TotalCdTick = totalCdTick;
        // ret.m_LeftCdTick = totalCdTick;
        // ret.m_PrevCDDecreaseTick = Date.now();

        ret.m_endTick = Date.now() + totalCdTick;

        return ret;
    }

    /**
     * 工厂方法
     * 根据毫秒构造CDTick
     * @param {int} end 到期的日期时间(单位:毫秒)
     * @returns CDTick
     */
    static createByEndTime(end) {
        let ret = new CDTick();

        // ret.m_PrevCDDecreaseTick = Date.now();
        // ret.m_LeftCdTick = end - ret.m_PrevCDDecreaseTick;
        // if (ret.m_LeftCdTick < 0) {
        // 	ret.m_LeftCdTick = 0;
        // }
        // ret.m_TotalCdTick = ret.m_LeftCdTick;

        ret.m_endTick = end;

        return ret;
    }

    // /**
    //  * 构造函数
    //  * @param {int} totalCdTick   总冷却时间，单位：ms
    //  */
    // constructor(totalCdTick) {
    // 	this.m_TotalCdTick = totalCdTick;
    // 	this.m_LeftCdTick = totalCdTick;
    // 	this.m_PrevCDDecreaseTick = Date.now();
    // }

    /**
     * 设置剩余秒数
     * @param {int} sec
     */
    set leftSec(sec) {
        // this.m_LeftCdTick = sec * 1000;
        // this.m_PrevCDDecreaseTick = Date.now();

        this.m_endTick = Date.now() + sec * 1000;
    }

    /**
     * 剩余秒数
     * @returns {int}
     */
    get leftSec() {
        return Math.ceil(this.leftCdTick / 1000);
    }

    /**
     * 设置结束日期时间
     * @param {int} end
     */
    set endTick(end) {
        // this.m_PrevCDDecreaseTick = Date.now();
        // this.m_LeftCdTick = end - this.m_PrevCDDecreaseTick;
        // if (this.m_LeftCdTick < 0) {
        // 	this.m_LeftCdTick = 0;
        // }

        this.m_endTick = end;
    }

    /**
     * 设置剩余时间
     * @param {int} iLeft	剩余冷却时间，单位：ms
     */
    set leftCdTick(iLeft) {
        // this.m_LeftCdTick = iLeft;
        // this.m_PrevCDDecreaseTick = Date.now();

        this.m_endTick = Date.now() + iLeft;
    }

    /*
        --剩余的时间
        --单位：毫秒
        --int
    */
    get leftCdTick() {
        // const _nowTick = Date.now();
        // const _delta = _nowTick - this.m_PrevCDDecreaseTick;
        // this.m_PrevCDDecreaseTick = _nowTick;
        // this.m_LeftCdTick = this.m_LeftCdTick - _delta;
        // if (this.m_LeftCdTick <= 0) 
        // 	this.m_LeftCdTick = 0;

        // return this.m_LeftCdTick;

        let ret = this.m_endTick - Date.now();
        if (ret < 0) return 0;

        return ret;
    }

    /**
     * 获得剩余时间 HH:MM:SS
     * @returns {String}
     */
    get leftHHMMSS() {
        const second = Math.ceil(this.leftCdTick / 1000);

        const ss = second % 60;
        let minutes = Math.floor(second / 60);
        const mm = minutes % 60;
        const hh = Math.floor(minutes / 60);
        return (hh < 10 ? '0' + hh : hh) + ':' +
            (mm < 10 ? '0' + mm : mm) + ':' +
            (ss < 10 ? '0' + ss : ss)
    }

    /**
     * 获得剩余时间 MM:SS
     * @returns {String}
     */
    get leftMMSS() {
        const second = Math.floor(this.leftCdTick / 1000);

        const ss = second % 60;
        const mm = Math.floor(second / 60);
        return (mm < 10 ? '0' + mm : mm) + ':' +
            (ss < 10 ? '0' + ss : ss)
    }

    // /*
    // 	--上一次减少剩余时间的时刻
    // 	--int
    // */
    // get prevCDDecreaseTick() {
    // 	return this.m_PrevCDDecreaseTick;
    // }

    // /*
    // 	--总冷却时间
    // 	--单位：ms
    // 	--int
    // */
    // get totalCdTick() {
    // 	return this.m_TotalCdTick;
    // }

}

/**
 * 时长（s)
 * @param {long}} duration 
 */
export const duration2Time = (duration, bMinute = false) => {
    duration = parseInt(duration)
    const ss = duration % 60;
    let minutes = Math.floor(duration / 60);
    const mm = minutes % 60;
    const hh = Math.floor(minutes / 60);
    if (bMinute) {
        return (mm < 10 ? '0' + mm : mm) + ':' +
            (ss < 10 ? '0' + ss : ss)
    }
    return (hh < 10 ? '0' + hh : hh) + ':' +
        (mm < 10 ? '0' + mm : mm) + ':' +
        (ss < 10 ? '0' + ss : ss)
}

export function delay(tick) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, tick)
    });
}

/**
 * 计算中点
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * 
 * @return{x, y}
 */
export function getMidPoint(x1, y1, x2, y2) {
    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 }
}

/**
 * 计算中点
 * @param {*} x1 
 * @param {*} y1 
 * @param {*} x2 
 * @param {*} y2 
 * 
 */
export function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}