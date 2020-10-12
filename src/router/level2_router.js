/**
 * 2级的界面
 */
'use strict';

import { Navigation } from "react-native-navigation";

const sm_screens = {};

// /**
//  * 榜单资料
//  */
// export const showRankPageView = () => {
//     const screendId = 'RankPage';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/main/rank/RankPage").default);
//     }

//     require("./ScreensHelper").default.push(screendId, null, true);
// }


/**
 * 显示我的收益
 */
export const showAnchorIncomeView = () => {
    const screendId = 'AnchorIncomeView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/anchorincome/AnchorIncomeView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * 显示我的收益明细
 */
export const showAnchorIncomeBill = () => {
    const screendId = 'AnchorIncomeBill';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/anchorincome/AnchorIncomeBill").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * 显示开播设置界面
 */
export const showReadyToStartBroadcastingView = () => {
    const screendId = 'ReadyToStartBroadcastingView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/ReadyToStartBroadcastingView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * 显示直播间界面
 */
export const showLiveRoomView = () => {
    const screendId = 'LiveRoomView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/LiveRoomView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}
/**
 * 是否直播间界面显示对象
 * @param {extends BaseView} inst 
 */
export const isLiveRoomView = (inst) => {
    const screendId = 'LiveRoomView';
    return require("./ScreensHelper").default.isTheScreenIdInst(inst, screendId);
}
/**
 * 是否直播间界面显示对象
 */
export const isLiveRoomViewShow = () => {
    const screendId = 'LiveRoomView';
    return require("./ScreensHelper").default.containScreenInStack(screendId);
}


/**
 * 显示设置界面
 */
export const showSettingView = () => {
    const screendId = 'SettingView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/setting/SettingView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * 编辑资料
 */
export const showUserInfoEditView = () => {
    const screendId = 'UserInfoEditView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/user_info_edit/UserInfoEditView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * WebView界面
 */
export const showMyWebView = (titleText, url, bOverlay = false) => {
    const screendId = 'MyWebView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/web/MyWebView").default);
    }

    bOverlay ? require("./ScreensHelper").default.showOverlay(screendId, { titleText, url }, true) : require("./ScreensHelper").default.push(screendId, { titleText, url }, true);
}

/**
 * 活动WebView界面
 */
export const openActivityWebView = (url) => {

    const screendId = 'ActivityWebView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require('../view/web/ActivityWebView').default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, null, true);
}


/**
 * 搜索界面
 */
export const showSearchView = () => {
    const screendId = 'SearchView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/search/SearchView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * 个人中心界面
 */
export const showUserInfoView = (userId, isShowOverlay = false) => {
    const screendId = 'UserInfoView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/userinfo/UserInfoView").default);
    }

    if (isShowOverlay) {
        require("./ScreensHelper").default.showOverlay(screendId, { userId, }, true);
    } else {
        require("./ScreensHelper").default.push(screendId, { userId, }, true);
    }

}

/**
 * 榜单说明
 */
export const showLevelDescriptionView = (selectedTab = 0) => {
    const screendId = 'LevelDescriptionView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/main/mine/LevelDescriptionView").default);
    }

    require("./ScreensHelper").default.push(screendId, { selectedTab, }, true);
}

export const showTestView = () => {
    const screendId = 'TestView'

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require('../model/media/TestView').default);
    }
    require('./ScreensHelper').default.push(screendId, null, true)
}

/**
 * 关注/粉丝
 */
export const showFollowAndFansView = (viewType) => {
    const screendId = 'FollowAndFansView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/main/mine/FollowAndFansView").default);
    }

    require("./ScreensHelper").default.push(screendId, { viewType, }, true);
}

// /**
//  * 关注/粉丝{ViewPager}
//  */
// export const showFollowAndFansViewPagerView = (viewType) => {
//     const screendId = 'FollowAndFansViewPagerView';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/main/mine/FollowAndFansViewPagerView").default);
//     }

//     require("./ScreensHelper").default.push(screendId, { viewType, }, true);
// }

/**
 * 钱包
 */
export const showMyWalletView = () => {
    const screendId = 'MyWalletView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/mywallet/MyWalletView").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * 会话
 */
export const showChatView = (id, nickName, isGroup, headUrl = '') => {
    const screendId = 'ChatView';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/chat/ChatVIew").default);
    }

    require("./ScreensHelper").default.push(screendId, { id, nickName, isGroup, headUrl }, true);
}

/**
 * 是否会话已显示界面
 * @param {extends BaseView} inst 
 */
export const isChatViewExist = () => {
    const screendId = 'ChatView';
    return require("./ScreensHelper").default.containScreenInStack(screendId);
}

/**
 * DiamondGiftDialog
 */
export const showDiamondGiftDialog = (userId) => {
    const screendId = 'DiamondGiftDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/mywallet/DiamondGiftDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { userId }, true);
}


/**
 * 活动礼物一键送与不送Dailog
 */
export const showCheckBagIncludeActivityGiftDialog = (activityGiftList, sendAllGfitAndActivityGift, sendAllGift) => {
    const screendId = 'CheckBagIncludeActivityGiftDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/room/diolag/CheckBagIncludeActivityGiftDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { activityGiftList, sendAllGfitAndActivityGift, sendAllGift, }, true);
}

/**
 * 普通的带Title的Dailog
 */
export const showNormTitleInfoDialog = (dialogContentText, positiveText, positivePress, _dialogTitleText, negativeText, negativePress) => {
    const screendId = 'NormTitleInfoDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/mywallet/NormTitleInfoDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { _dialogTitleText, dialogContentText, positiveText, positivePress, negativeText, negativePress, }, true);
}

/**
 * 普通Dailog
 */
export const showNormInfoDialog = (dialogContentText, positiveText, positivePress, negativeText, negativePress, dialogTitleText) => {
    const screendId = 'NormInfoDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/mywallet/NormInfoDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { dialogContentText, positiveText, positivePress, negativeText, negativePress, dialogTitleText, }, true);
}

/**
 * 信息Dailog
 */
export const showInfoDialog = (dialogContentText, positiveText, dialogTitleText) => {
    const screendId = 'InfoDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/mywallet/InfoDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { dialogContentText, positiveText, dialogTitleText }, true);
}

/**
 * ListDialog
 */
export const showListDialog = (items) => {
    const screendId = 'ListDialog';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/mywallet/ListDialog").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, { items }, true);
}

/**
 * 实名认证
 */
export const showCertificationPage = () => {
    const screendId = 'CertificationPage';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/cert/CertificationPage").default);
    }

    require("./ScreensHelper").default.push(screendId, null, true);
}

/**
 * App 升级界面
 * @param {object} channelInfo  CS_ChannelInfo
 * // "keys":["channelid","channelname","version","downloadurl","forceupdate","iospaytype","issanbox","desc","newvisitor","oldvisitor"]
 */
export const showAppVersionUpdatePage = (channelInfo) => {
    const screendId = 'AppVersionUpdatePage';

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/update/AppVersionUpdatePage").default);
    }

    require("./ScreensHelper").default.showOverlay(screendId, {channelInfo}, true);
}

// /**
//  *头条界面
//  */
// export const showHeadlinesView = () => {
//     const screendId = 'HeadlinesView';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/main/rank/HeadlinesView").default);
//     }

//     require("./ScreensHelper").default.push(screendId, null, true);
// }

// /**
//  *钱包和收益界面
//  */
// export const showMyWalletAndBenefitView = () => {
//     const screendId = 'MyWalletAndBenefitView';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/mywallet/MyWalletAndBenefitView").default);
//     }
//     require("./ScreensHelper").default.push(screendId, null, true);
// }


// /**
//  *充值界面
//  */
// export const showRechargeView = () => {
//     const screendId = 'RechargeView';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/mywallet/RechargeView").default);
//     }
//     require("./ScreensHelper").default.push(screendId, null, true);
// }

// /**
//  *收益流水
//  */
// export const showNormalTabRecordView = (viewType) => {
//     const screendId = 'NormalTabRecordView';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/anchorincome/NormalTabRecordView").default);
//     }
//     require("./ScreensHelper").default.push(screendId, { viewType }, true);
// }

// /**
//  *充值流水
//  */
// export const showOtherflowRecordView = (viewType) => {
//     const screendId = 'OtherflowRecordView';

//     if (!sm_screens[screendId]) {
//         sm_screens[screendId] = Navigation.registerComponent(screendId, () => require("../view/anchorincome/OtherflowRecordView").default);
//     }
//     require("./ScreensHelper").default.push(screendId, { viewType }, true);
// }

/**
 * 公聊大厅
 */
export const showChatHallView = () => {
    const screendId = 'ChatHallView'

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require('../view/chathall/ChatHallView').default)
    }
    require('./ScreensHelper').default.push(screendId, null, true)
}

/**
 * 榜单
 */
export const showRankPage = () => {

    const screendId = 'RankPage'

    if (!sm_screens[screendId]) {
        sm_screens[screendId] = Navigation.registerComponent(screendId, () => require('../view/main/rank/RankPage').default)
    }
    require('./ScreensHelper').default.push(screendId, null, true)
}

export const showFastReplayManage = (isShowOverlay = false) => {

    const screenId = 'FastReplayManage'

    if (!sm_screens[screenId]) {
        sm_screens[screenId] = Navigation.registerComponent(screenId, () => require('../view/chat/FastReplyManage').default)
    }
    if(isShowOverlay){
        require('./ScreensHelper').default.showOverlay(screenId, null, true)
    } else{
        require('./ScreensHelper').default.push(screenId, null, true)
    }
}
