/**
 * js入口
 */

console.disableYellowBox = false;

require('./src/extend');

import { Platform } from "react-native";
import { setCustomSourceTransformer } from 'react-native/Libraries/Image/resolveAssetSource';
import { showLoginRootView, showMainRootView, startShowRoot } from "./src/router/level1_router";


// 定制资源的获取方式
// 安卓使用drawable格式
setCustomSourceTransformer((resolver) => {
    if (resolver.isLoadedFromServer()) {
        return resolver.assetServerURL();
    }

    if (Platform.OS === 'android') {
        return resolver.resourceIdentifierWithoutScale();
    } else {
        return resolver.scaledAssetPath();
    }
});

/**
 * 之前登陆了，但是尝试登陆出现session过期，就返回登陆界面
 */
function _onToLoginView() {
    showLoginRootView();
}

/**
 * 登陆成功后需要处理的业务
 * @param {UserResult.Logon} logon 
 * @param {UserCmd.login} loginReqParams
 */
function _onLogonSuccess(logon, loginReqParams) {
    require("./src/model/user/UserInfoModel").default.afterLogonSuccess(logon, loginReqParams);
}

/**
 * 上次启动的logon数据
 * 有数据才会回调
 * @param {UserResult.Logon} logon 
 * @param {UserCmd.login} loginReqParams
 */
function _onPrevLogon(logon, loginReqParams) {
    require("./src/model/user/UserInfoModel").default.prevLogonData(logon, loginReqParams);
}

/**
 * 已经连接成功的逻辑socket断开了
 */
function _onSocketDisconnect() {
    require("./src/model/LoginModel").onSocketDisconnect();
}

function _onAppStart() {
    require("./src/model/ServerCmd").checkLogonByLaunch(
        _onToLoginView,
        _onLogonSuccess,
        _onPrevLogon,
        _onSocketDisconnect
    ).then(b => {
        if (b) {
            //显示主界面
            showMainRootView();
        } else {
            //显示登录界面
            showLoginRootView();
        }

        //检查更新
        require('./src/model/update/UpdateModel').checkUpdate();
    }).catch(err => {
        //显示登录界面
        showLoginRootView();
    });
}

startShowRoot(_onAppStart);
