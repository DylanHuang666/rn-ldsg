/**
 * 1级的界面
 */
'use strict';

import { Navigation } from "react-native-navigation";

const sm_screens = {};

function _setNavigationDefaultOptions() {
    Navigation.setDefaultOptions({
        animations: {
            push: {
                enabled: 'true',
                waitForRender: 'true',
                content: {
                    x: {
                        from: require('../utils/DesignConvert').default.getResolution(),
                        to: 0,
                        duration: 200,
                        startDelay: 0,
                        //interpolation: 'decelerate'
                    }
                }
            },
            pop: {
                enabled: 'true',
                waitForRender: 'true',
                content: {
                    x: {
                        from: 0,
                        to: require('../utils/DesignConvert').default.getResolution(),
                        duration: 200,
                        startDelay: 0,
                        //interpolation: 'accelerate'
                    }
                }
            }
        },
        topBar: {
            visible: false,
        },
        bottomTabs: {
            visible: false,
            ...Platform.select({ android: { drawBehind: true } })
        },
        statusBar: {
            drawBehind: true,
            // visible: false,
            translucent: true,
        },
        layout: {
            orientation: ['portrait']
        },
    });
}

/**
 * 开启app界面显示之旅
 * 需要判定不同情况来显示根界面
 */
export const startShowRoot = (fnOnAppStart) => {
    Navigation.events().registerAppLaunchedListener(() => {
        _setNavigationDefaultOptions();

        fnOnAppStart();
    });
}


// /**
//  * 显示App根界面
//  */
// function _showAppRootView() {
//     const screendId = 'App';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/App").default);
//     }

//     require("./ScreensHelper").default.setRoot(screendId);
// }

/**
 * 显示登陆界面(根)
 */
export const showLoginRootView = () => {
    const screendId = 'LoginView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/login/LoginView").default);
    }

    require("./ScreensHelper").default.setRoot(screendId);
}

// /**
//  * 显示登陆界面
//  */
// export const showLoginView = () => {
//     const screendId = 'LoginView';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/login/LoginView").default);
//     }

//     require("./ScreensHelper").default.push(screendId, null, true);
// }

/**
 * 显示主界面(根)
 */
export const showMainRootView = () => {
    const screendId = 'MainView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/main/MainView").default);
    }

    require("./ScreensHelper").default.setRoot(screendId);
}

// /**
//  * 显示主界面
//  */
// export const showMainView = () => {
//     const screendId = 'MainView';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/main/MainView").default);
//     }

//     require("./ScreensHelper").default.push(screendId, null, true);
// }

/**
 * 账号密码登录
 */
export const showPasswordLoginView = (viewType) => {
    const screendId = 'PasswordLoginView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/login/PasswordLoginView").default);
    }

    require("./ScreensHelper").default.push(screendId, { viewType, }, true);
}

/**
 * 注册页
 */
export const showRegisterPage = () => {
    const screendId = 'RegisterPage';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/login/RegisterPage").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * 注册资料
 */
export const showRegisteredView = () => {
    const screendId = 'RegisteredView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/registered/RegisteredView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}
