import { AppState, BackHandler, Platform } from "react-native";
import { Navigation } from "react-native-navigation";
import XLog from "../utils/XLog";

const sm_nowStacks = [];


const VIEW_TYPE_VIEW = 1;       //setRoot | push | replace | pop 的界面类型
// const VIEW_TYPE_MODAL = 2;      //showModal | dismissModal 的界面类型
export const VIEW_TYPE_OVERLAY = 3;    //showOverlay | dismissOverlay 的界面类型

const OP_SET_ROOT = 'setRoot';
const OP_PUSH = 'push';
const OP_POP = 'pop';
const OP_SHOW_OVERLAY = 'OP_SHOW_OVERLAY';
const OP_DISMISS_OVERLAY = 'OP_DISMISS_OVERLAY';

class WaitQueue {
    constructor(name) {
        this._queue = null;
        this._name = name;
    }

    printQueue() {
        if (!this._queue) {
            XLog.debug(`[ui] ${this._name} queue empty`);
            return;
        }

        let s = `[ui] ${this._name} queue:`;
        for (const vo of this._queue) {
            s += ` ${vo.__screen__ || vo.component.passProps.__screen__}: ${vo.__op__},`;
        }
        XLog.debug(s);
    }

    checkTimeout() {
        if (!this._queue) return;

        const now = Date.now();

        let i = 0;
        while (i < this._queue.length) {
            const vo = this._queue[i];

            if (now >= vo.__timeoutTick__) {
                this._queue.splice(i, 1);
                continue;
            }

            break;
        }

        // this.printQueue();
    }

    hasQueue() {
        this.checkTimeout();

        return this._queue != null;
    }

    getTimeoutTick() {
        const TIMEOUT = 2000;
        const t = Date.now() + TIMEOUT;
        if (!this._queue || this._queue.length == 0) {
            return t;
        }

        const vo = this._queue[this._queue.length - 1];
        const t2 = vo.__timeoutTick__ + TIMEOUT;
        return t > t2 ? t : t2;
    }

    push(param) {
        param.__timeoutTick__ = this.getTimeoutTick();
        if (!this._queue) {
            this._queue = [param];
        } else {
            this._queue.push(param);
        }

        this.printQueue();
    }

    containWaitShowScreenId(screendId) {
        if (!this.hasQueue()) return false;

        for (let i = this._queue.length - 1; i >= 0; --i) {
            const vo = this._queue[i];

            if (
                OP_SET_ROOT != vo.__op__
                && OP_PUSH != vo.__op__
                && OP_SHOW_OVERLAY != vo.__op__
            ) continue;

            if (vo.component.passProps.__screen__.indexOf(screendId) == 0) {
                return true;
            }
        }
        return false;
    }

    onMount(inst) {
        // if (!inst || !inst.props || !inst.props.__screen__) return;

        const iPrevScreenIndex = sm_nowStacks.length - 1;
        //加入到当前显示堆栈
        sm_nowStacks.push(inst);

        if (!this._queue) {
            //通知之前的界面被覆盖了
            if (iPrevScreenIndex >= 0) {
                const prevInst = sm_nowStacks[iPrevScreenIndex];
                prevInst.onPause && prevInst.onPause();
            }
            return;
        }

        for (let i = 0; i < this._queue.length; ++i) {
            const vo = this._queue[i];

            if (
                OP_SET_ROOT != vo.__op__
                && OP_PUSH != vo.__op__
                && OP_SHOW_OVERLAY != vo.__op__
            ) continue;

            if (inst.props.__screen__ != vo.component.passProps.__screen__) continue;

            this._queue.splice(i, 1);

            if (this._queue.length == 0) {
                this._queue = null;
            }

            this.printQueue();
            break;
        }

        //通知之前的界面被覆盖了
        if (iPrevScreenIndex >= 0) {
            const prevInst = sm_nowStacks[iPrevScreenIndex];
            prevInst.onPause && prevInst.onPause();
        }
    }

    onUnmount(inst) {
        // if (!inst || !inst.props || !inst.props.__screen__) return;

        let iPrevScreenIndex = -1;
        //删除当前显示的堆栈
        for (let i = sm_nowStacks.length - 1; i >= 0; --i) {
            const vo = sm_nowStacks[i];
            if (vo.props.__screen__ == inst.props.__screen__) {
                sm_nowStacks.splice(i, 1);
                iPrevScreenIndex = i - 1;
                break;
            }
        }

        //处理队列
        if (this._queue) {
            for (let i = 0; i < this._queue.length; ++i) {
                const vo = this._queue[i];

                if (
                    OP_POP != vo.__op__
                    && OP_DISMISS_OVERLAY != vo.__op__
                ) continue;

                if (inst.props.__screen__ != vo.__screen__) continue;

                this._queue.splice(i, 1);

                if (this._queue.length == 0) {
                    this._queue = null;
                }

                this.printQueue();
                break;
            }
        }

        //通知之前的界面再次显示
        if (iPrevScreenIndex >= 0) {
            const prevInst = sm_nowStacks[iPrevScreenIndex];
            prevInst.onResume && prevInst.onResume(inst);
        }
    }

    shiftNext() {
        if (!this._queue) return null;

        const ret = this._queue.shift();
        if (this._queue.length == 0) {
            this._queue = null;
        }

        this.printQueue();

        return ret;
    }

}

//等待队列
const sm_waitQueue = new WaitQueue('wait');

//正在执行队列
const sm_runningQueue = new WaitQueue('running');

function _getLastScreen(viewType) {
    for (let i = sm_nowStacks.length - 1; i >= 0; --i) {
        const vo = sm_nowStacks[i];
        if (viewType === vo.props.__viewType__) {
            return vo;
        }
    }
    return null;
}

function _getViewTypeCount(viewType) {
    let r = 0;
    for (let i = sm_nowStacks.length - 1; i >= 0; --i) {
        const vo = sm_nowStacks[i];
        if (viewType === vo.props.__viewType__) {
            ++r;
        }
    }
    return r;
}

// function _getStackByScreenIdAndViewType(__screen__, viewType) {
//     for (let i = sm_nowStacks.length - 1; i >= 0; --i) {
//         const vo = sm_nowStacks[i];
//         if (viewType === vo.props.__viewType__ && __screen__ == vo.props.__screen__) {
//             return vo;
//         }
//     }
//     return null;
// }
function _getStackByScreenId(__screen__) {
    for (let i = sm_nowStacks.length - 1; i >= 0; --i) {
        const vo = sm_nowStacks[i];
        if (__screen__ == vo.props.__screen__) {
            return vo;
        }
    }
    return null;
}

function _opNext(param) {
    if (OP_SET_ROOT == param.__op__) {
        //设置为根
        sm_runningQueue.push(param);
        Navigation.setRoot({
            root: {
                stack: {
                    id: param.component.id,
                    children: [param],
                }
            }
        });
    } else if (OP_PUSH == param.__op__) {
        const vo = _getLastScreen(VIEW_TYPE_VIEW);
        if (!vo) {
            XLog.warn('[ui] cant push screen stack');
            return;
        }
        //判定栈顶是否 overlay
        const l = sm_nowStacks.length;
        if (l > 0) {
            const inst = sm_nowStacks[l - 1];
            if (inst.props.__viewType__ == VIEW_TYPE_OVERLAY) {
                const strLog = `[ui] can not push view: ${param.component.passProps.__screen__}, now stack top is overlay:${inst.props.__screen__}`;
                XLog.error(strLog);
                console.error(strLog);
                return;
            }
        }
        //可以显示
        sm_runningQueue.push(param);
        Navigation.push(vo.props.__screen__, param);
    } else if (OP_POP == param.__op__) {
        //已经到根就不要pop了
        if (_getViewTypeCount(VIEW_TYPE_VIEW) <= 1) {
            XLog.warn('[ui] cant pop screen stack');
            return;
        }

        //再次判定栈顶为指定pop界面
        const l = sm_nowStacks.length;
        const inst = sm_nowStacks[l - 1];
        if (inst.props.__screen__ != param.__screen__) {
            XLog.warn(`[ui] cant pop, screenId:${param.__screen__} not on top of stack`);
            return;
        }

        //可以pop
        sm_runningQueue.push(param);
        Navigation.pop(param.__screen__, param);
    } else if (OP_SHOW_OVERLAY == param.__op__) {
        //可以显示
        sm_runningQueue.push(param);
        Navigation.showOverlay(param);
    } else if (OP_DISMISS_OVERLAY == param.__op__) {
        //已经到根就不要dismissOverlay了
        const vo = _getLastScreen(VIEW_TYPE_OVERLAY);
        if (!vo) {
            XLog.warn('[ui] cant dismissOverlay');
            return;
        }

        // //再次判定栈顶为指定dismissOverlay界面
        // const l = sm_nowStacks.length;
        // const inst = sm_nowStacks[l - 1];
        // if (inst.props.__screen__ != param.__screen__) {
        //     XLog.warn(`[ui] cant pop, screenId:${param.__screen__} not on top of stack`);
        //     return;
        // }

        //可以 dismiss了
        sm_runningQueue.push(param);
        Navigation.dismissOverlay(vo.props.__screen__);
    }
}

/**
 * 尝试下一个处理
 */
function _tryNext() {
    if (sm_runningQueue.hasQueue()) {
        return;
    }

    //尝试执行下一个
    const param = sm_waitQueue.shiftNext();
    if (!param) return;

    _opNext(param);
}

function _canShowView(screendId) {

    //先检查当前显示的栈顶
    let l = sm_nowStacks.length;
    if (l > 0) {
        const inst = sm_nowStacks[l - 1];
        if (inst.props.__screenId__ == screendId) {
            XLog.warn(`[ui] 已经在显示了 ${screendId}`);
            return false;
        }
    }

    //检查是不是在准备显示队列中
    if (sm_waitQueue.containWaitShowScreenId(screendId)) {
        XLog.warn(`[ui] 在等待显示准备队列中 ${screendId}`);
        return false;
    }
    if (sm_runningQueue.containWaitShowScreenId(screendId)) {
        XLog.warn(`[ui] 在等待显示完成队列中 ${screendId}`);
        return false;
    }

    return true;
}

function _canPushView(screendId) {
    return _canShowView(screendId);
}

function _doPop(__screen__, animated) {
    if (!__screen__) {
        const vo = _getLastScreen(VIEW_TYPE_VIEW);
        if (!vo) {
            XLog.warn('[ui] cant pop, not found screenId');
            return;
        }
        __screen__ = vo.props.__screen__;
    }
    // else {
    //     const vo = _getStackByScreenIdAndViewType(__screen__, VIEW_TYPE_VIEW);
    //     if (!vo) {
    //         XLog.warn(`[ui] cant pop, not found screenId:${__screen__} in stack`);
    //         return;
    //     }
    // }
    const param = {
        animations: {
            pop: {
                enabled: String(animated)
            }
        },
        __screen__: __screen__,
        __op__: OP_POP
    }

    //需要等待
    if (sm_runningQueue.hasQueue()) {
        sm_waitQueue.push(param);
        return;
    }
    //需要等待，可以尝试执行下一个了
    if (sm_waitQueue.hasQueue()) {
        sm_waitQueue.push(param);
        _tryNext();
        return;
    }

    //可以pop
    _opNext(param);
}

function _doDismissOverlay(__screen__, animated) {
    if (!__screen__) {
        const vo = _getLastScreen(VIEW_TYPE_OVERLAY);
        if (!vo) {
            XLog.warn('[ui] cant dismissOverlay, not found screenId');
            return;
        }
        __screen__ = vo.props.__screen__;
    }
    // else {
    //     const vo = _getStackByScreenIdAndViewType(__screen__, VIEW_TYPE_OVERLAY);
    //     if (!vo) {
    //         XLog.warn(`[ui] cant dismissOverlay, not found screenId:${__screen__} in stack`);
    //         return;
    //     }
    // }
    const param = {
        animations: {
            pop: {
                enabled: String(animated)
            }
        },
        __screen__: __screen__,
        __op__: OP_DISMISS_OVERLAY
    }

    //需要等待
    if (sm_runningQueue.hasQueue()) {
        sm_waitQueue.push(param);
        return;
    }
    //需要等待，可以尝试执行下一个了
    if (sm_waitQueue.hasQueue()) {
        sm_waitQueue.push(param);
        _tryNext();
        return;
    }

    //可以pop
    _opNext(param);
}

function _printNowStack(action) {
    let s;
    if (sm_nowStacks.length > 0) {
        s = sm_nowStacks[0].props.__screen__;
        for (let i = 1; i < sm_nowStacks.length; ++i) {
            s += ', ' + sm_nowStacks[i].props.__screen__;
        }
    } else {
        s = '';
    }

    XLog.info(`${action}, now screen stacks: ${s}`);
}


const ScreensHelper = {

    /**
     * 设置整个显示栈的第一个界面
     * 如果已经整个显示栈已经存在，内部貌似会把之前的退栈
     * @param {String} screendId 
     */
    setRoot(screendId) {
        const _id = screendId + '___' + Date.now();

        const param = {
            component: {
                id: _id,
                name: screendId,
                passProps: {
                    __screen__: _id,
                    __screenId__: screendId,
                    __viewType__: VIEW_TYPE_VIEW,
                },
                options: {
                    statusBar: {
                        drawBehind: true,
                        // visible: false,
                        translucent: true,
                    }
                }
            },
            __op__: OP_SET_ROOT,
        };

        //需要等待
        if (sm_runningQueue.hasQueue()) {
            sm_waitQueue.push(param);
            return;
        }
        //需要等待，可以尝试执行下一个了
        if (sm_waitQueue.hasQueue()) {
            sm_waitQueue.push(param);
            _tryNext();
            return;
        }

        //可以显示
        _opNext(param);
    },

    /**
     * push界面
     * @param {String} screendId 
     * @param {Object} params 
     * @param {boolean} animated 
     */
    push(screendId, params, animated) {
        if (!_canPushView(screendId)) {
            return;
        }

        const _id = screendId + '___' + Date.now();

        const param = {
            component: {
                id: _id,
                name: screendId,
                passProps: {
                    params: params,
                    __screen__: _id,
                    __screenId__: screendId,
                    __viewType__: VIEW_TYPE_VIEW,
                },
                options: {
                    animations: {
                        push: {
                            enabled: animated,
                        },
                    },
                    statusBar: {
                        drawBehind: true,
                        // visible: false,
                        translucent: true,
                    },
                }
            },
            __op__: OP_PUSH,
        };

        //需要等待
        if (sm_runningQueue.hasQueue()) {
            sm_waitQueue.push(param);
            return;
        }
        //需要等待，可以尝试执行下一个了
        if (sm_waitQueue.hasQueue()) {
            sm_waitQueue.push(param);
            _tryNext();
            return;
        }

        //可以显示
        _opNext(param);
    },

    /**
     * 显示overlay界面
     * @param {String} screendId 
     * @param {Object} params 
     * @param {boolean} animated 
     * @param {color} backgroundColor 
     */
    showOverlay(screendId, params, animated, backgroundColor = '#00000088') {
        if (!_canShowView(screendId)) {
            return;
        }

        const _id = screendId + '___' + Date.now();

        const param = {
            component: {
                id: _id,
                name: screendId,
                passProps: {
                    params: params,
                    __screen__: _id,
                    __screenId__: screendId,
                    __viewType__: VIEW_TYPE_OVERLAY,
                },
                options: {
                    topBar: {
                        visible: false
                    },
                    layout: {
                        backgroundColor: backgroundColor,
                    },
                    bottomTabs: {
                        visible: false,
                        ...Platform.select({ android: { drawBehind: true } })
                    },
                    animations: {
                        showOverlay: {
                            enabled: animated
                        }
                    },
                    overlay: {
                        ...Platform.select({ ios: { handleKeyboardEvents: true } })
                    },
                    statusBar: {
                        drawBehind: true,
                        // visible: false,
                        translucent: true,
                    },
                }
            },
            __op__: OP_SHOW_OVERLAY,
        };

        //需要等待
        if (sm_runningQueue.hasQueue()) {
            sm_waitQueue.push(param);
            return;
        }
        //需要等待，可以尝试执行下一个了
        if (sm_waitQueue.hasQueue()) {
            sm_waitQueue.push(param);
            _tryNext();
            return;
        }

        //可以显示
        _opNext(param);
    },

    /**
     * 关闭所有从栈顶到最后一个push界面的overlay界面
     */
    closeAllStackTopOverlays() {
        for (let i = sm_nowStacks.length - 1; i >= 0; --i) {
            const vo = sm_nowStacks[i];
            if (VIEW_TYPE_VIEW === vo.props.__viewType__) return;

            ScreensHelper.close(vo.props.__screen__, false);
        }
    },

    /**
     * 弹出到指定界面
     * @param {string} __screen__ 
     * @param {boolean} animated 
     */
    popToScreen(__screen__, animated) {
        let j = -1;
        for (let i = sm_nowStacks.length - 1; i >= 0; --i) {
            const vo = sm_nowStacks[i];
            if (__screen__ == vo.props.__screen__) {
                j = i;
                break;
            }
        }
        if (j < 0) {
            return;
        }

        for (let i = sm_nowStacks.length - 1; i > j; --i) {
            const vo = sm_nowStacks[i];
            ScreensHelper.close(vo.props.__screen__, false);
        }

        {
            const vo = sm_nowStacks[j];
            ScreensHelper.close(vo.props.__screen__, animated);
        }
    },

    /**
     * 关闭指定的界面，不过也要按照堆栈顺序的
     * @param {String} __screen__ 
     * @param {boolean} animated 
     */
    close(__screen__, animated) {
        const vo = _getStackByScreenId(__screen__);
        if (VIEW_TYPE_VIEW == vo.props.__viewType__) {
            _doPop(__screen__, animated);
        } else if (VIEW_TYPE_OVERLAY == vo.props.__viewType__) {
            _doDismissOverlay(__screen__, animated);
        }
    },

    /**
     * 是否该实例是指定的 screendId
     * @param {extends BaseView} inst 
     * @param {String} screendId 
     */
    isTheScreenIdInst(inst, screendId) {
        return inst.props.__screenId__ == screendId;
    },

    /**
     * 是否某个界面已经在显示
     * @param {String} screendId 
     * @returns {boolean}
     */
    containScreenInStack(screendId) {
        for (let i = sm_nowStacks.length - 1; i >= 0; --i) {
            const vo = sm_nowStacks[i];
            if (vo.props.__screenId__ == screendId) {
                return true;
            }
        }
        return false;
    },

    /**
     * 这个函数只能在 BaseView.componentDidMount 内调用
     * 用于记录堆栈
     * @param {extends BaseView} inst 
     */
    onBaseViewMount(inst) {
        if (!inst || !inst.props || !inst.props.__screen__) return;

        sm_runningQueue.onMount(inst);

        _tryNext();

        _printNowStack('[ui] mount ' + inst.props.__screen__);
    },

    /**
     * 这个函数只能在 BaseView.componentWillUnmount 内调用
     * 用于记录堆栈
     * @param {extends BaseView} inst 
     */
    onBaseViewUnmout(inst) {
        if (!inst || !inst.props || !inst.props.__screen__) return;

        sm_runningQueue.onUnmount(inst);

        _tryNext();

        _printNowStack('[ui] unmount ' + inst.props.__screen__);
    },

};


/**
 * 返回键监听处理
 */
BackHandler.addEventListener("hardwareBackPress", () => {
    //栈顶处理
    const l = sm_nowStacks.length;
    if (l <= 1) {
        return false;
    }

    //通知最后一个界面处理
    const inst = sm_nowStacks[l - 1];
    if (inst.onHardwareBackPress) {
        inst.onHardwareBackPress();
        return true;
    }

    //断言。。。。
    if (!inst.props || !inst.props.__screen__) {
        //不可能的吧。。。。
        XLog.error('assert: !inst.props || !inst.props.__screen__');
        return true;
    }

    //默认操作是关闭界面
    ScreensHelper.close(inst.props.__screen__, false);
    return true;

});

/**
 * 前后台切换监控
 */
AppState.addEventListener('change', nextState => {
    XLog.info(`[ui] AppState change nextState:${nextState}`);

    //栈顶处理
    const l = sm_nowStacks.length;
    if (l < 1) return;

    const inst = sm_nowStacks[l - 1];
    if ('active' == nextState) {
        //切换到前台
        if (inst.onAppToFront) {
            inst.onAppToFront();
        }
    } else {
        //切换到后台
        if (inst.onAppToBackend) {
            inst.onAppToBackend();
        }
    }
});

export default ScreensHelper;