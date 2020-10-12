/**
 * 4级的界面
 */
'use strict';

import { Navigation } from "react-native-navigation";

const sm_screens = {};

/**
 * 错误界面
 */
export function showErrorView(message, stack) {
    const screendId = 'ErrorView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/error/ErrorView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { message, stack, }, true);
}

/**
 * 权限不可用的提示界面
 */
export const showUnavailablePermissionView = (permission) => {

    const screendId = 'UnavailablePermissionView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/permission/UnavailablePermissionView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { permission }, true);
}

/**
 * 宝箱说明页面
 */
export const showTreasureDecDiaLog = () => {

    const screendId = 'TreasureDecDiaLog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/diolag/TreasureDecDiaLog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, null, true);
}

/**
 * 首次手机登录设置密码
 */
export const showSetFirstPasswordView = () => {

  const screendId = 'SetFirsPasswordView';

  if (!sm_screens[screendId]) {
    sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/login/SetPasswordView").default);
  }

  require("./ScreensHelper").default.push(screendId, null, true);

}

// /**
//  * ListDialog
//  */
// export const showListDialog = (items) => {
//     const screendId = 'ListDialog';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/mywallet/ListDialog").default);
//     }

//     require("./ScreensHelper").default.showOverlay(screendId, { items }, true);
// }

/**
 * 性别选择
 * @param {*} callBack
 */
export const showeEditSexDialog = (callBack) => {
    const screendId = 'EditSexDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/user_info_edit/EditSexDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { callBack, }, true);
}

/**
 * 时间选择器弹窗
 */
export const showDatePickerDialog = (dateSelectedCallback, dateFormatString = "YYYY-MM-DD", selectedTime = new Date(), title) => {
    const screendId = 'DatePickerDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/user_info_edit/DatePickerDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { dateSelectedCallback, selectedTime, dateFormatString, title }, true, "tranparent");
}

/**
 * 通用Wheel选择界面
 */
export const showNormalWheelPickerDialog = (list, callBack, defaultSelected = "默认数据", title, content) => {
    const screendId = 'NormalWheelPickerDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/announcer/NormalWheelPickerDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { list, callBack, defaultSelected, title, content }, true, "tranparent");
}

/**
 * 陪聊评价界面
 */
export const showChatEvaluationDialog = (userId, data) => {
    const screendId = 'ChatEvaluationDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/announcer/item/ChatEvaluationDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { userId, data, }, true, "tranparent");
}

/**
 * 是否陪聊评价界面显示对象
 * @param {extends BaseView} inst 
 */
export const isChatEvaluationDialog = (inst) => {
    const screendId = 'ChatEvaluationDialog';
    return require("./ScreensHelper").default.isTheScreenIdInst(inst, screendId);
}

/**
 * 陪聊退出界面
 */
export const showChatRoomExitDialog = (callBack) => {
    const screendId = 'ChatRoomExitDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/announcer/item/ChatRoomExitDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { callBack }, true, "tranparent");
}

/**
 * 陪聊退出(主播视角)界面
 */
export const showChatRoomIncomeDialog = (data) => {
    const screendId = 'ChatRoomIncomeDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/announcer/item/ChatRoomIncomeDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { data }, true, "tranparent");
}

/**
 * 是否陪聊收益或评价已显示界面
 * @param {extends BaseView} inst 
 */
export const isChatRoomStopDialogExist = () => {
    const screendId = 'ChatEvaluationDialog';
    const screendId2 = 'ChatRoomIncomeDialog';
    return require("./ScreensHelper").default.containScreenInStack(screendId) || require("./ScreensHelper").default.containScreenInStack(screendId2);
}

/**
 * 聊天室来电
 */
export const showPhoneDialog = (userId, data) => {

    const screendId = 'PhoneDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/announcer/PhoneDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { userId, data }, true, "tranparent");
}