/**
 * 友盟统计逻辑
 */

'use strict';

import { NativeModules } from "react-native";

let sm_loginUserId;

/**
 * 登陆成功后调用
 * @param {string} provider 
 * @param {string} userId 
 */
export const onProfileSignIn = (provider, userId) => {
    if (sm_loginUserId == userId) return;

    sm_loginUserId = userId;
    NativeModules.Umeng && NativeModules.Umeng.onProfileSignIn(provider, userId);
}

/**
 * 登出后调用
 */
export const onProfileSignOff = () => {
    if (!sm_loginUserId) return;

    NativeModules.Umeng && NativeModules.Umeng.onProfileSignOff();
}

/**
 * 界面显示的时候调用
 * @param {string} viewName 
 */
export const onPageStart = (viewName) => {
    NativeModules.Umeng && NativeModules.Umeng.onPageStart(viewName);
}

/**
 * 界面关闭的时候调用
 * @param {string} viewName 
 */
export const onPageEnd = (viewName) => {
    NativeModules.Umeng && NativeModules.Umeng.onPageEnd(viewName);
}