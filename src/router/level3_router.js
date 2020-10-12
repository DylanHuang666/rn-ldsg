/**
 * 3级的界面
 */
'use strict';

import { Navigation } from "react-native-navigation";
import { Platform } from "react-native";
import UserInfoCache from "../cache/UserInfoCache";
import { CALL, RING } from "../view/announcer/PhoneView";

const sm_screens = {};

/**
 * 提现
 */
export function showWithdrawView(accountMoney, maxCatchValue) {
    const screendId = 'WithdrawView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/anchorincome/WithdrawView").default);
    }

    require("./ScreensHelper").default.push(screendId, { accountMoney, maxCatchValue, }, true);
}

/**
 * 银行卡提现
 */
export function showWithdrawalFromBankView(accountMoney, minCatchValue, maxCatchValue) {
    const screendId = 'WithdrawalFromBankView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/anchorincome/WithdrawalFromBankView").default);
    }

    require("./ScreensHelper").default.push(screendId, { accountMoney, minCatchValue, maxCatchValue, }, true);
}

/**
 * 兑换金币
 */
export function showConVertView() {
    const screendId = 'ConVertView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/anchorincome/ConvertView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, null, true);
}

/**
 * 验证支付密码
 */
export const showVerifyPayPasswordView = (rechargeId, exchargePrice, targetId) => {
    const screendId = 'VerifyPayPasswordView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/anchorincome/VerifyPayPasswordView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { rechargeId, exchargePrice, targetId }, true);
}

/**
 * 各种记录页   {流水记录，提现记录， 兑换记录， 直播间记录}
 * viewType {flowRecord, withdrawRecord, exchangeRecord, liveFlowRecord}
 */
export const showRecordView = (viewType) => {
    const screendId = 'RecordView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/anchorincome/RecordView").default);
    }

    require("./ScreensHelper").default.push(screendId, { viewType: viewType, }, true);
}

export const showRecordView_showOverlay = (viewType) => {
    const screendId = 'RecordView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/anchorincome/RecordView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { viewType: viewType, }, true);
}

// export const showTabRecordView = (viewType) => {
//     const screendId = 'TabRecordView';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/anchorincome/TabRecordView").default);
//     }

//     require("./ScreensHelper").default.push(screendId, { viewType: viewType, }, true);
// }



/**
 * 设置密码
 */
export const showUpdatePasswordView = (viewType) => {
    const screendId = 'UpdatePasswordView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/setting/UpdatePasswordView").default);
    }

    require("./ScreensHelper").default.push(screendId, { viewType, }, true);
}

/**
 * 设置密码弹窗
 */
export const showSetPasswordDialog = (fnCallback, _title, _type, _code) => {
    const screendId = 'SetPasswordDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/setting/SetPasswordDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { fnCallback, _title, _type, _code }, true);
}

/**
 * 发送手机验证码弹窗
 */
export const showSendCodeDialog = (fnCallback, _title, _type, _isChangePwd) => {
    const screendId = 'SendCodeDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/setting/SendCodeDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { fnCallback, _title, _type, _isChangePwd }, true);
}

// /**
//  * 绑定我的手机号
//  */
// export const showBindMyPhoneView = () => {
//     const screendId = 'BindMyPhoneView';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/setting/BindMyPhoneView").default);
//     }

//     require("./ScreensHelper").default.push(screendId, null, true);
// }

/**
 * 绑定手机号
 */
export const showBindPhoneView = () => {
    const screendId = 'BindPhoneView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/setting/BindPhoneView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

export const showSetPhoneDialog = (fnCallback) => {
    const screendId = 'SetPhoneDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/setting/SetPhoneDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { fnCallback }, true);
}

// /**
//  * 更换手机号
//  */
// export const showAlreadyBindPhoneView = () => {
//     const screendId = 'AlreadyBindPhoneView';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/setting/AlreadyBindPhoneView").default);
//     }

//     require("./ScreensHelper").default.push(screendId, null, true);
// }

/**
 * 关于我们
 */
export const showAboutUsView = () => {
    const screendId = 'AboutUsView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/setting/AboutUsView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * 修改页面
 */
export const showUserInfoEditDetailView = (viewType, text = "", callBack = (text) => { }) => {
    const screendId = 'UserInfoEditDetailView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/user_info_edit/UserInfoEditDetailView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { viewType, text, callBack }, true);
}

// /**
//  * 修改生日
//  */
// export const showBirthdaySelect = (callBack) => {
//     const screendId = 'BirthdaySelect';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/user_info_edit/BirthdaySelect").default);
//     }

//     require("./ScreensHelper").default.showOverlay(screendId, { callBack }, true);
// }

/**
 * 音乐库
 */
export const showMusicLibraryView = () => {
    const screendId = 'MusicLibraryView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/musiclibrary/MscLibraryView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * 用户资料Dialog
 */
export const showInfoDialog = (pullBlackPress, reportPress, cancelAttiend, isPullBlack) => {
    const screendId = 'InfoDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/userinfo/InfoDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { pullBlackPress, reportPress, cancelAttiend, isPullBlack, }, true);
}

/**
 * 举报Dialog
 * // 举报入口，1-个人主页，2-个人签名卡片，3-个人动态，4-聊天页面 5-群举报 6-陪聊
 */
export const showReportDialog = (userId, entrance = 1) => {
    const screendId = 'ReportDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/userinfo/ReportDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { userId, entrance, }, true);
}

/**
 * 会话设置
 */
export const showChatSettingView = (isGroup, userId) => {
    const screendId = 'ChatSettingView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/main/message/ChatSettingView").default);
    }

    require("./ScreensHelper").default.push(screendId, { userId, isGroup, }, true);
}

/**
 * 房间背景选择界面
 */
export const showRoomBgChooseView = (selectedBackgroundId, fnOnChoose) => {
    const screendId = 'RoomBgChooseView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/RoomBgChooseView").default);
    }

    require("./ScreensHelper").default.push(screendId, { selectedBackgroundId, fnOnChoose }, true);
}

/**

 * 退出房间界面
 * @param {Function} fnCloseCallerView
 */
export const showExitRoomView = (fnCloseCallerView) => {
    const screendId = 'ExitRoomView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/ExitRoomView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { fnCloseCallerView }, true);
}

/**
 * 房间公告
 */
export const showRoomNoticeView = () => {
    const screendId = 'RoomNoticeView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/RoomNoticeView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, null, true);
}

/**
 * 房间公告编辑
 */
export const showRoomEditNoticeView = () => {
    const screendId = 'RoomEditNoticeView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/RoomEditNoticeView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, null, true);
}

/**
 * 房间麦位操作菜单
 * @param {MicInfo} micInfo 
 */
export const showSeatOpMenuView = (isMainMic, micInfo) => {
    const screendId = 'SeatOpMenuView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/SeatOpMenuView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { isMainMic, micInfo }, true);
}


/**
 * 房间麦下操作菜单
 * @param {MicInfo} micInfo 
 */
export const showUnderOpMenuView = (userId) => {
    const screendId = 'UnderOpMenuView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/UnderOpMenuView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { userId, }, true);
}


/**
 * 房间更多更面
 */
export const showRoomMoreView = (fnCloseCallerView) => {
    const screendId = 'RoomMoreView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/RoomMoreView").default);
    }
    require("./ScreensHelper").default.showOverlay(screendId, { fnCloseCallerView }, true);
}


/**
 * 用户资料卡片
 */
export const showUserCardView = (userId,left,top) => {

    const screendId = 'UserCardView'

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require('../view/room/UserCardView').default)
    }
    require('./ScreensHelper').default.showOverlay(screendId, { userId,left,top}, true)
}

/**
 * 活动WebView界面
 */
export const openActivityWebView = (url) => {
    const screendId = 'ActivityWebView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require('../view/web/ActivityWebView').default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { url, }, true, '#00000000');
}

// /**
//  * 房间设置
//  */
// export const oepnRoomSetView = () => {
//     const screendId = 'RoomSetView'

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require('../view/room/RoomSetView').default)
//     }

//     require('./ScreensHelper').default.push(screendId, null, true)
// }



/**
 * 房间管理员
 */
export const showRoomManagerView = (roomId) => {
    const screendId = 'RoomManagerView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/RoomManagerView").default);
    }

    require("./ScreensHelper").default.push(screendId, { roomId, }, true);
}

/**
 * 在线人员
 */
export const showOnlineMemberPage = (roomId) => {
    const screendId = 'OnlineMemberPage';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/OnlineMemberPage").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { roomId, }, true);
}

/**
 * 房间排行榜
 */
export const showRoomRankPage = (roomId, toTop) => {
    const screendId = 'RoomRankPage';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/RoomRankPage").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { roomId, toTop, }, true);
}

/**
 * 礼物面板
 */
export const showRoomGiftPanelView = (userId) => {
    const screendId = 'RoomGiftPanelView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/RoomGiftPanelView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { userId, }, true, '#00000000');
}

/**
 * 大表情弹窗
 */
export const showRoomBigFaceView = () => {
    const screendId = 'RoomBigFaceView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/RoomBigFaceView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, null, true, '#00000000');
}
/**
 * 送礼物组选择界面
 */
export const showRoomGiftGroupChooseView = () => {
    const screendId = 'RoomGiftGroupChooseView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/RoomGiftGroupChooseView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, null, true, '#00000000');
}


/**
 * 房间消息列表
 */
export const showRoomConversationView = () => {
    const screendId = 'RoomConversationView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/RoomConversationView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, null, true, '#00000000');
}


/**
 * 房间会话
 */
export const showRoomChatView = (id, nickName, isGroup) => {
    const screendId = 'RoomChatView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/RoomChatView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { id, nickName, isGroup, }, true);
}
/*
 * 房间密码设置
 */
export const showSetPassword = (type, roomId) => {
    const screendId = 'SetPassword';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/diolag/SetPassword").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { type, roomId, }, true);
}

/**
 * 房间密码是否取消
 */
export const showCanclePassword = () => {
    const screendId = 'CanclePassword';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/diolag/CanclePassword").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, null, true);
}


/**
 * 直播间转赠
 */
export const showSendGoldShellDialog = (userId, nickName, headUrl) => {
    const screendId = 'SendGoldShellDialog'
    
    if (!sm_screens[screendId]) {     
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require('../view/room/diolag/SendGoldShellDialog').default);
    }
    require('./ScreensHelper').default.showOverlay(screendId, { userId, nickName, headUrl, }, true)
}

/**
 * 等级说明
 */
export const showLevelDescriptionDetailView = (viewType = 233) => {
    const screendId = 'LevelDescriptionDetailView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/main/mine/LevelDescriptionDetailView").default);
    }

    require("./ScreensHelper").default.push(screendId, { viewType, }, true);
}
/**
 * 排麦面板
 */
export const showMicQueView = () => {
    const screendId = 'MicQueView'

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require('../view/room/MicQueView').default);
    }
    require('./ScreensHelper').default.showOverlay(screendId, null, true)
}

/**
 * 房间黑名单
 */
export const showRoomBlackListView = () => {
    const screendId = 'RoomBlackListView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/RoomBlackListView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

// /**
//  * 记录弹窗
//  */
// export const showRecordDialog = () => {
//     const screendId = 'RecordDialog';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/anchorincome/record/RecordDialog").default);
//     }

//     require("./ScreensHelper").default.showOverlay(screendId, null, true, "tranparent");
// }

// /**
//  * 支付弹窗
//  */
// export const showPaySelectedDialog = (payMoney = 1, selectedPayTypeCallBack) => {
//     const screendId = 'PaySelectedDialog';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/mywallet/PaySelectedDialog").default);
//     }

//     require("./ScreensHelper").default.showOverlay(screendId, { payMoney, selectedPayTypeCallBack }, true, "tranparent");
// }

// /**
//  * 时间选择器弹窗
//  */
// export const showDatePickerDialog = (dateSelectedCallback, dateFormatString = "YYYY-MM-DD", selectedTime = new Date()) => {
//     const screendId = 'DatePickerDialog';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/user_info_edit/DatePickerDialog").default);
//     }

//     require("./ScreensHelper").default.showOverlay(screendId, { dateSelectedCallback, selectedTime, dateFormatString }, true, "tranparent");
// }

// /**
//  * 转赠页面
//  */
// export const showDiamondGiftView = (userId = UserInfoCache.userId) => {
//     const screendId = 'DiamondGiftView';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/mywallet/DiamondGiftView").default);
//     }

//     require("./ScreensHelper").default.push(screendId, { userId }, true);
// }

/**
 * 性别变化
 */
// export const showeEditSexDialog = () => {
//     const screendId = 'EditSexDialog';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/user_info_edit/EditSexDialog").default);
//     }

//     require("./ScreensHelper").default.showOverlay(screendId, null, true);
// }
// export const showeEditSexDialog = (sex, change) => {
//     const screendId = 'EditSexDialog';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/user_info_edit/EditSexDialog").default);
//     }

//     require("./ScreensHelper").default.showOverlay(screendId, { sex, change }, true);
// }
// export const showCanclePassword = () => {
//     const screendId = 'CanclePassword';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/diolag/CanclePassword").default);
//     }

//     require("./ScreensHelper").default.showOverlay(screendId, null, true);
// }

/**
 * 房间设置
 */
export const showRoomSetView = () => {
    const screendId = 'RoomSetView'

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require('../view/room/RoomSetView').default)
    }

    require('./ScreensHelper').default.push(screendId, null, true)
}


/**
 * 背景音乐播放页面
 */
export const showRoomMusicPlayView = () => {
    const screendId = 'RoomMusicPlayView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/RoomMusicPlayView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, null, true);
}

/**
 * 个性装扮商城界面
 */
export const showPersonalLookMallView = () => {
    const screendId = 'PersonalLookMallView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/mall/PersonalLookMallView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * 个性商城 -> 头像框 -> 购买价格选择界面
 * @param {{money, day, timeType}[]}  list
 * @param {Function}        onChoose
 */
export const showHeadFrameBuyChooseView = (list, onChoose) => {
    const screendId = 'HeadFrameBuyChooseView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/mall/HeadFrameBuyChooseView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { list, onChoose }, true, '#00000000');
}

/**
 * 认证声优
 */
export const showAnnouncerCertificationView = () => {
    const screendId = 'AnnouncerCertificationView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/announcer/AnnouncerCertificationView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}


/**
 * 打电话或接电话
 */
export const showPhoneView = (userId, isCall = true, data) => {
    let viewType = isCall ? CALL : RING;

    const screendId = 'PhoneView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/announcer/PhoneView").default);
    }

    require("./ScreensHelper").default.push(screendId, { userId, viewType, data }, true);
}

/**
 * 是否打电话或接电话界面显示对象
 * @param {extends BaseView} inst 
 */
export const isPhoneView = (inst) => {
    const screendId = 'PhoneView';
    return require("./ScreensHelper").default.isTheScreenIdInst(inst, screendId);
}

/**
 * 背景音乐播放页面
 */
export const showMusicLibararyView = () => {
    const screendId = 'MusicLibararyView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/MusicLibararyView").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, null, true);
}

/**
 * 通话记录
 */
export const showPhoneRecordView = () => {

    const screendId = 'PhoneRecordView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/announcer/PhoneRecordView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * 在线的人
 */
export const showOnlineView = () => {

    const screendId = 'OnlineView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/main/message/OnlineView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * 1v1聊天室
 */
export const showChatRoomView = () => {

    const screendId = 'ChatRoomView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/announcer/ChatRoomView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * 是否1v1聊天室显示对象
 * @param {extends BaseView} inst 
 */
export const isChatRoomView = (inst) => {
    const screendId = 'ChatRoomView';
    return require("./ScreensHelper").default.isTheScreenIdInst(inst, screendId);
}


export const showEditReply = (type, item) => {
    const screendId = 'EditReplyView'

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require('../view/chat/EditReplyView').default)
    }
    require('./ScreensHelper').default.showOverlay(screendId, { type, item }, true)
}