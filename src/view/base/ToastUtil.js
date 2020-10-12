'use strict';

import { NativeModules } from "react-native";

const ToastUtil = {

    /**
     * 在底部显示
     * @param {string} s 
     */
    showBottom(s) {
        if (!s) return;

        NativeModules.ToastAndroid.showWithGravity(s, NativeModules.ToastAndroid.LONG, NativeModules.ToastAndroid.BOTTOM);
    },

    /**
     * 在中间显示
     * @param {string}} s 
     */
    showCenter(s) {
        if (!s) return;

        NativeModules.ToastAndroid.showWithGravity(s, NativeModules.ToastAndroid.LONG, NativeModules.ToastAndroid.CENTER);
    },
};

export default ToastUtil;