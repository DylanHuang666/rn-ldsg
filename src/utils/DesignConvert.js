'use strict';

import {
    Platform,
    NativeModules,
    StatusBar,
    NativeEventEmitter,
} from 'react-native';
import Dimensions from 'Dimensions';

let c_width;// = Dimensions.get('window').width;
let c_height;// = Dimensions.get('window').height;
let c_scale;// = Dimensions.get('window').scale;
let c_fontScale;// = Dimensions.get('window').fontScale;
let l_statusBarHeight;//状态栏高度
let l_layoutHeight;//实际显示的布局高度

//设计分辨率
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

//iPhone分辨率 常量------------------
const X_WIDTH = 375;
const X_HEIGHT = 812;

const X_MAX_WIDTH = 414;
const X_MAX_HEIGHT = 896;

const i5_WIDTH = 320;
const i5_HEIGHT = 568;

//----------------------------------

if (Platform.OS === 'ios') {

    l_statusBarHeight = (
        Platform.OS === 'ios' &&
        (
            (c_height === X_HEIGHT && c_width === X_WIDTH)
            || (c_height === X_WIDTH && c_width === X_HEIGHT)
            || (c_height === X_MAX_HEIGHT && c_width === X_MAX_WIDTH)
            || (c_height === X_MAX_WIDTH && c_width === X_MAX_HEIGHT)
        )
    )
        ? 44 : 20;

    let IOS_StatusBarManager = new NativeEventEmitter(NativeModules.StatusBarManager);
    IOS_StatusBarManager.addListener(
        'statusBarFrameWillChange',
        (e) => {
            if (l_statusBarHeight == e.height) {
                return;
            }
            l_statusBarHeight = e.height;

            _printParams();
        }
    );
    IOS_StatusBarManager._nativeModule.getHeight((e) => {
        if (l_statusBarHeight == e.height) {
            return;
        }
        l_statusBarHeight = e.height;

        _printParams();
    });
} else {
    l_statusBarHeight = StatusBar.currentHeight;
}

function _updateCacheConstants() {
    const dimWin = Dimensions.get('window');
    const screenWin = Dimensions.get('screen');

    c_width = dimWin.width;
    c_height = dimWin.height;
    c_scale = dimWin.scale;
    c_fontScale = dimWin.fontScale;

    // //----------------------------------------
    // //c_height 在沉浸式的时候，这个值有点怪
    // //对于一些机器没有 NavigationBar，他刚好就是用来布局的高度
    // //对于一些机器有 NavigationBar，他是剔除状态栏和NavigationBar的高度

    // //----------------------------------------
    // //目前拿不到NavigationBar的高度
    // //有些机器没有 NavigationBar， 就是 c_height
    // //有些机器有 NavigationBar， 就是 c_height + l_statusBarHeight
    // //只要计算到的值不超过 实际屏幕高度，就行了
    // l_layoutHeight = c_height + l_statusBarHeight;
    // if (l_layoutHeight > screenWin.height) {
    //     //超过实际屏幕高度，就应该是没有 NavigationBar
    //     l_layoutHeight = c_height;
    // }

    if (Platform.OS == 'android') {
        // l_layoutHeight = screenWin.height - (NativeModules.ScreenUtil.isNavBarShow ? NativeModules.ScreenUtil.navBarHeight : 0);
        l_layoutHeight = NativeModules.ScreenUtil.screenHeight;
    } else {
        l_layoutHeight = c_height;
    }

}

_updateCacheConstants();

//react native 目前使用的版本不存在这个属性的
// function _getMinor() {
// 	// if (
// 	// 	!NativeModules.PlatformConstants ||
// 	// 	!NativeModules.PlatformConstants.reactNativeVersion ||
// 	// 	!NativeModules.PlatformConstants.reactNativeVersion.minor
// 	// ) {
// 	// 	return 0;
// 	// }
// 	// return NativeModules.PlatformConstants.reactNativeVersion.minor;

// 	const { PlatformConstants = {} } = NativeModules;
// 	const { minor = 0 } = PlatformConstants.reactNativeVersion || {};
// 	return minor;
// }
// const minor = _getMinor();


// Dimensions.addEventListener(
// 	'change',
// 	() => {
// 		// console.warn(
// 		// 	Date.now(),
// 		// 	'========2',
// 		// 	c_height,
// 		// 	Dimensions.get('window').height,
// 		// 	DesignConvert.getStatusBarHeight(),
// 		// );

// 		_updateCacheConstants();

// 		_printParams();
// 	}
// )


const DesignConvert = {
    /**
     * 本机布局宽度
     */
    get swidth() {
        return c_width;
    },
    /**
     * 本机布局高度
     * 包含statusBar，但不包含底部的 NavigationBar(如果有)
     */
    get sheight() {
        return l_layoutHeight;
    },

    /**
     * 状态栏高度
     */
    get statusBarHeight() {
        return l_statusBarHeight;
    },

    // onLayout(evt) {
    //     const height = evt.nativeEvent.layout.height + DesignConvert.getStatusBarHeight();
    //     if (c_height == height) return false;

    //     c_height = height;

    //     _printParams();

    //     return true;
    // },

    // /**
    //  * 获得实际显示高度
    //  * for android 是除去顶部的statusBar 和 和底部的 NavigationBar(如果有)
    //  * for ios 就是整个屏幕高度
    //  * @returns {Number}
    //  */
    // getRealViewHeight() {
    //     // return c_height - (DesignConvert.getHeight(DesignConvert.isIPhoneX()? 22 + 45 : 45) + DesignConvert.statusBarHeight);
    //     // if (Platform.OS === 'android') {
    //     //     return c_height - StatusBar.currentHeight;
    //     // } else {
    //     //     return c_height;
    //     // }

    //     return c_height;

    // },

    // /**
    //  * 是否为全面屏
    //  */
    // isFullScreen() {
    //     if (DesignConvert.isIPhoneX()) {
    //         return true;
    //     }
    //     if ((c_height / c_width) >= (18 / 9)) {   //比例高于16:9为全面屏
    //         return true;
    //     }
    //     return false;
    // },

    // /**
    //  * 标题部分高度
    //  * @param {Number} t
    //  * @returns    {Number}
    //  */
    // getT(t) {
    //     return t - 18;
    // },

    /**
     * 适配宽度
     * @param {Number} w    设计宽度
     * @returns {Number}    适配宽度
     */
    getW(w) {
        return c_width / DESIGN_WIDTH * w;
    },

    /**
     * 适配宽度 转为 设计宽度
     * @param {Number} w    适配宽度
     * @returns {Number}    设计宽度
     */
    // revertW(w) {
    // 	return w / c_width * DESIGN_WIDTH;
    // },

    /**
     * 适配值 转为 像素值
     * @param {Number} t    适配值
     * @returns {Number}    像素值
     */
    toPixel(t) {
        return t / c_width * DESIGN_WIDTH * c_scale;
    },

    /**
     * 竖屏适配高度
     * @param {Number} h    设计高度
     * @returns {Number}    竖屏适配高度
     */
    getH(h) {
        return c_width / DESIGN_WIDTH * h;
    },

    /**
     * 适配高度
     * @param {Number} h    设计高度
     * @returns {Number}    适配高度
     */
    getHeight(h) {
        //return c_width / DESIGN_WIDTH * h;
        return l_layoutHeight / DESIGN_HEIGHT * h;
    },

    /**
     * Text的lineHeight转换
     * @param {Number} h    设计高度
     * @returns {Number}    适配高度
     */
    getLineHeight(h) {
        return Math.ceil(c_width / DESIGN_WIDTH * h);
    },

    /**
     * 适配字体大小
     * @param {Number} f    设计字体大小
     * @returns {Number}    本机实际字体大小
     */
    getF(f) {
        return f / c_fontScale;
    },

    /**
     * 以像素为单位
     */
    getBorderWidth(w) {
        // if (w < 1) return 1 / PixelRatio.get();
        // return w / PixelRatio.get()
        if (w < 1) return 1 / c_scale;
        return w / c_scale
    },

    getSmallDP(dp) {
        // if (dp * PixelRatio.get() < 1) {
        //     return 1.0 / PixelRatio.get();
        // } else {
        //     return dp;
        // }
        if (dp * c_scale < 1) {
            return 1.0 / c_scale;
        } else {
            return dp;
        }
    },

    // isIPhoneX1() {
    // 	const dimen = Dimensions.get('window');
    //     return (
    //         Platform.OS === 'ios' &&
    //         !Platform.isPad &&
    //         !Platform.isTVOS &&
    //         (dimen.height === 812 || dimen.width === 812)
    //     );
    // },


    isIPhoneX() {
        return (
            Platform.OS === 'ios' &&
            (
                (c_height === X_HEIGHT && c_width === X_WIDTH)
                || (c_height === X_WIDTH && c_width === X_HEIGHT)
                || (c_height === X_MAX_HEIGHT && c_width === X_MAX_WIDTH)
                || (c_height === X_MAX_WIDTH && c_width === X_MAX_HEIGHT)
            )
        );
    },

    // isIPhone5() {
    //     return (
    //         Platform.OS === 'ios' &&
    //         ((c_height === i5_HEIGHT && c_width === i5_WIDTH) ||
    //             (c_height === i5_WIDTH && c_width === i5_HEIGHT))
    //     );
    // },

    //本机实际宽度 像素（1080p，720p）
    getResolution() {
        return c_width * c_scale;
    },

    // /**
    //  * 获取iPhoneX的底部距离安全区域的间距
    //  */
    // getiXHomeHeight() {
    //     return DesignConvert.isIPhoneX() ? DesignConvert.getH(34) : 0;
    // },

    addIpxTopHeight() {
        return DesignConvert.isIPhoneX() ? DesignConvert.getH(20) : 0;
    },

    addIpxBottomHeight(size) {
        return DesignConvert.isIPhoneX() ? DesignConvert.getH(size || 23) : 0;
    },

    /**
     * 如果Text中包含Image，在样式中设置的width和height在安卓和苹果是完全不一样的。
     *
     * 2019/11/06  在rn0.60.5版本没这个问题了
     */
    getImgSizeInText(size) {
        // const imageScale = Platform.OS === 'ios' ? 1 : PixelRatio.get();
        // return DesignConvert.getW(size) * imageScale;

        // const imageScale = Platform.OS === 'ios' ? 1 : c_scale;
        // return DesignConvert.getW(size) * imageScale;

        return DesignConvert.getW(size);
    },

    getVerticalMargin(size) {
        if (Platform.OS === 'ios') {
            return DesignConvert.getH(size);
        } else {
            if (size > 3) {
                return DesignConvert.getH(size - 3);
            } else {
                return DesignConvert.getH(size);
            }
        }
    },

    getVerticalMargin2(size) {
        if (Platform.OS === 'ios') {
            return DesignConvert.getH(size);
        } else {
            return DesignConvert.getH(size - 3);
        }
    }

};


export default DesignConvert;

//------------- 打印参数 -----------------------------

function _printParams() {
    console.log('本机宽高', c_width, c_height);
    console.log('本机缩放率', c_scale);
    console.log('本机字体缩放率', c_fontScale);
    console.log('本机宽度适配率', (c_width / DESIGN_WIDTH));
    console.log('本机高度适配率', (l_layoutHeight / DESIGN_HEIGHT));
    console.log('本机状态栏高度', l_statusBarHeight);
    console.log('布局高度', l_layoutHeight);

    // console.log('minor', minor);//react native 目前使用的版本不存在这个属性的

    console.log('screen.width', Dimensions.get('screen').width);
    console.log('screen.height', Dimensions.get('screen').height);
    console.log('screen.scale', Dimensions.get('screen').scale);
    console.log('screen.fontScale', Dimensions.get('screen').fontScale);

    if (NativeModules.ScreenUtil) {
        console.log('本机显示区域高度(ScreenUtil)', NativeModules.ScreenUtil.screenHeight);
        console.log('本机状态栏高度(ScreenUtil)', NativeModules.ScreenUtil.statusBarHeight);
        console.log('虚拟导航栏高度(ScreenUtil)', NativeModules.ScreenUtil.navBarHeight);
        console.log('是否显示导航栏(ScreenUtil)', NativeModules.ScreenUtil.isNavBarShow);
    }
}

_printParams();

//----------------------------------------------------