/**
 * 用户服务协议业务逻辑
 */

'use strict';

import AsyncStorage from "@react-native-community/async-storage";
import { NativeModules } from "react-native";
import { KEY_USER_SERVICE_SHOWN } from "../../hardcode/HLocalStorageKey";

/**
 * 是否需要显示用户服务协议和隐私政策提示界面
 */
async function _hasShownUserService() {
    try {
        let ret = await AsyncStorage.getItem(KEY_USER_SERVICE_SHOWN);
        return !!ret;
    } catch (error) {

    }
    return false;
}

/**
 * 同意后，保存标记
 */
export const saveHasShownUserService = async () => {
    try {
        await AsyncStorage.setItem(
            KEY_USER_SERVICE_SHOWN,
            '1'
        );
        return true;
    } catch (error) {

    }
    return false;
}

/**
 * 检查 是否需要显示用户服务协议和隐私政策提示界面
 */
export const checkShowUserServiceProtocolView = async () => {
    const b = await _hasShownUserService();
    if (b) return;

    require('../../router/level3_router').showUserServiceProtocolView();
}

export const showUserServiceWebView = () => {
    // require('../../router/level2_router').showMyWebView('用户服务条款', 'https://xvoice-web-1301112906.cos.ap-guangzhou.myqcloud.com/agrement/user-service.html', true)
    NativeModules.HttpUtil.openUrl('https://xvoice-web-1301112906.cos.ap-guangzhou.myqcloud.com/agrement/user-service.html');
}

export const showPrivacyWebView = () => {
    NativeModules.HttpUtil.openUrl('https://xvoice-web-1301112906.cos.ap-guangzhou.myqcloud.com/agrement/user-secret.html');
    // require('../../router/level2_router').showMyWebView('用户隐私协议', 'http://xvoice-web-1301112906.cos.ap-guangzhou.myqcloud.com/agrement/user-secret.html', true)
}