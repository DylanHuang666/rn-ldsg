'use strict'

import { NativeModules, NativeEventEmitter } from "react-native";
import Config from '../../configs/Config';
import UserInfoCache from '../../cache/UserInfoCache';
import { TX_IM_NEW_MSG, TX_IM_FORCE_OFFLINE, TX_IM_USER_SIG_EXPIRED, TX_IM_GROUP_TIPS } from "../../hardcode/HNativeEvent";
import moment from 'moment';
import HResultStatus from '../../hardcode/HResultStatus';
import { EVT_LOGIC_CLEAR_CHAT_MESSAGE_LIST, EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, } from "../../hardcode/HLogicEvent";
import ModelEvent from "../../utils/ModelEvent";
import RoomInfoCache, { isNormalRoom, isChatRoom } from "../../cache/RoomInfoCache";
import ToastUtil from "../../view/base/ToastUtil";
import { OFFICIAL_NAME, OFFICIAL_DESC, SECRETARY_NAME, SECRETARY_DESC } from "../../hardcode/HGLobal";
import UserInfoModel from "../userinfo/UserInfoModel";

const TencentIMModule = NativeModules.TencentIM;
const emmiter = new NativeEventEmitter(TencentIMModule);

export const addEventListener = (evt, fn) => {
    emmiter.addListener(evt, fn);
}

export const removeEventListener = (evt, fn) => {
    emmiter.removeListener(evt, fn);
}

let sm_loginUserId;


emmiter.addListener(TX_IM_NEW_MSG, msgs => {
    // console.log('----------IM-------------', '有新消息来了', msgs);

    //筛掉群组提示消息
    msgs = msgs.filter(element => element.sender != TIMSYSTEMSender);
    if (msgs.length == 0) {
        return
    }

    const nowRoomId = RoomInfoCache.roomId;
    msgs.forEach(element => {
        //如果是群组且id为A开头
        if ((isNormalRoom(element.id) || isChatRoom(element.id)) && element.isGroup) {

            //不是当前房间的就过滤掉吧
            if (nowRoomId != element.id) {
                return;
            }

            try {
                let ent = JSON.parse(element.elems[0].content.data);
                // console.log('公平消息', '有新消息来了', ent);
                switch (ent.type) {
                    case 1:
                        require("../room/RoomPublicScreenModel").imText(ent);
                        break;
                    case 7:
                        require("../room/RoomPublicScreenModel").imPhoto(ent);
                        break;
                }
            } catch (err) {
                console.error(err);
            }
        }
    });

});

emmiter.addListener(TX_IM_FORCE_OFFLINE, () => {
    sm_loginUserId = null;

    // console.log('im在其他设备登陆')
    //这个需要退到登陆界面
    require('../../model/network/SocketModel')._toLoginUI()

});

emmiter.addListener(TX_IM_USER_SIG_EXPIRED, () => {
    sm_loginUserId = null;
});

emmiter.addListener(TX_IM_GROUP_TIPS, tips => {

});

/**
 * 登陆
 */
async function _checkLogin() {
    const userId = UserInfoCache.userId;
    if (!userId) {
        return false;
    }

    // if (userId == sm_loginUserId) {
    //     return true;
    // }

    try {
        //final int appId, final String userId, final String userSig,
        await TencentIMModule.login(parseInt(Config.imSdkAppId), userId, UserInfoCache.tlsSig);

        // console.log("官方消息", UserInfoCache.officialGroupId)
        if (!UserInfoCache.officialGroupId) {
            let res = await require("../ServerCmd").MyCmd_enterOfficialGroup();
            // console.log("MyCmd_enterOfficialGroup", res)
        }
    } catch (error) {
        return false;
    }

    sm_loginUserId = userId;
    return true;
}

function _setConversation(element) {
    //判断是否有普通消息
    let desc = "[自定义消息]";
    let userInfo = {};
    let time = "";
    try {
        //避免某些奇怪消息解析不了
        let isAllCustom = true;
        element.lastMsg.elems.forEach(msg => {
            if (msg.type != 4) {
                isAllCustom = false;
                switch (msg.type) {
                    case 1:
                        desc = msg.content;
                        break;
                    case 3:
                        desc = "[语音]";
                        break;
                    case 7:
                        desc = "[表情]";
                        break;
                    case 2:
                        desc = "[图片]";
                        break;
                }
            }
            if (msg.content.desc == "SendUserEntity") {
                userInfo = JSON.parse(msg.content.data);
            }
        });

        if (isAllCustom) {
            let type = element.lastMsg.elems[0].content.data.slice(0, element.lastMsg.elems[0].content.data.indexOf("#") + 1);
            // console.log("消息type", type);
            let message = element.lastMsg.elems[0].content.data.slice(element.lastMsg.elems[0].content.data.indexOf("#") + 1);
            // console.log("消息", message);

            if ("luckryMoney#" == type) {
                desc = "[红包]";
            } else if ("announcerFinish#" == type) {
                desc = "[热聊提示]";
            } else if ('userDataCard' == type) {
                desc = '[用户卡片]'
            } else {
                desc = JSON.parse(message).data;
            }
        }
    } catch (err) {
        if (element && element.lastMsg && element.lastMsg.sender && element.lastMsg.sender == '@TIM#SYSTEM') {
            //官方消息lastMsg 解析错误时特别处理
            desc = OFFICIAL_DESC;
        } else if (element && element.lastMsg && element.lastMsg.sender && element.lastMsg.sender == SYSTEM_UNION_SECRETARY_ID) {
            //小秘书lastMsg 解析错误时特别处理
            desc = SECRETARY_DESC;
        } else {
            desc = "";
        }
    }

    //时间
    if (!element || !element.lastMsg || element.lastMsg.time == 0) {
        time = "";
    } else {
        time = Config.getIMStatusTime(element.lastMsg.time * 1000);
    }
    element.desc = desc;
    element.userInfo = userInfo;
    element.time = time;
}

/**
 * logon后检查im登陆
 */
export const checkLogin = () => {
    return _checkLogin();
}

/**
 * 退出
 */
export const logout = () => {
    if (!sm_loginUserId) return;

    sm_loginUserId = null;

    TencentIMModule.logout();
}


const TIMSYSTEMSender = "@TIM#SYSTEM"//群组提示消息的sender值？？
const IM_MANAGER_ID = "yinfu_admin"
const PROHIBITION_GROUP_ID = "SYS10001"//举报群聊号
const SYSTEM_CUSTOMER_ID = "10000"//系统客服号
const SYSTEM_PRODUCT_ID = "10001"//意见反馈号
const SYSTEM_PRODUCT_TEAM_ID = "10002";//产品团队号
export const SYSTEM_UNION_SECRETARY_ID = "10003"//工会小秘书号/小秘书
const SYSTEM_APP_NOTIFICATION_ID = "10004"//系统通知号
const SYSTEM_OPERATION_MANAGER_ID = "10020"//运维管理员号
/**
 * 获得会话列表
 */
export const getConversationList = async (unNeedUserInfo) => {
    let b = await _checkLogin();
    if (!b) {
        return null;
    }

    // {
    //     isGroup: Boolean,
    //     id:       String,
    //     unRead:     Number,
    //     lastMsg: TIMMessage
    // }[]

    //初始化两个固有会话
    let systemOfficialConversation = {
        lastMsg:
        {
            rand: 1369273354,
            recvFlag: 0,
            elems:
                [{
                    content:
                    {
                        ext: '',
                        data: `3#{"data":${OFFICIAL_DESC},"nickName":${OFFICIAL_NAME},"type":2}`,
                        desc: ''
                    },
                    type: 4
                },
                {
                    content:
                    {
                        ext: '',
                        data: `{"charmLv":0,"contributeLv":0,"guardianLv":0,"headFrameId":"","isGuardian":false,"isHatBuff":false,"isNewUser":false,"nickName":${OFFICIAL_NAME},"sex":0,"userId":${UserInfoCache.officialGroupId},"vipLv":0}`,
                        desc: 'SendUserEntity'
                    },
                    type: 4
                }],
            seq: 20894,
            id: UserInfoCache.officialGroupId,
            uniqueId: 6822876136014181000,
            priority: 1,
            msgId: '144115217486601514-1588574641-1369273354',
            isSelf: false,
            isRead: false,
            sender: UserInfoCache.officialGroupId,
            isGroup: false,
            msgType: 1,
            status: 2,
            time: 0
        },
        unRead: 0,
        id: UserInfoCache.officialGroupId,
        isGroup: false
    }
    let systemSecretaryConversation = {
        lastMsg:
        {
            rand: 1369273354,
            recvFlag: 0,
            elems:
                [{
                    content:
                    {
                        ext: '',
                        data: `3#{"data":${SECRETARY_DESC},"nickName":${SECRETARY_NAME},"type":2}`,
                        desc: ''
                    },
                    type: 4
                },
                {
                    content:
                    {
                        ext: '',
                        data: `{"charmLv":0,"contributeLv":0,"guardianLv":0,"headFrameId":"","isGuardian":false,"isHatBuff":false,"isNewUser":false,"nickName":${SECRETARY_NAME},"sex":0,"userId":${SYSTEM_UNION_SECRETARY_ID},"vipLv":0}`,
                        desc: 'SendUserEntity'
                    },
                    type: 4
                }],
            seq: 20894,
            id: SYSTEM_UNION_SECRETARY_ID,
            uniqueId: 6822876136014181000,
            priority: 1,
            msgId: '144115217486601514-1588574641-1369273354',
            isSelf: false,
            isRead: false,
            sender: SYSTEM_UNION_SECRETARY_ID,
            isGroup: false,
            msgType: 1,
            status: 2,
            time: 0
        },
        unRead: 0,
        id: SYSTEM_UNION_SECRETARY_ID,
        isGroup: false
    }

    let cList = await TencentIMModule.getConversationList();

    let conversaIds = [];
    let conversationList = [];
    cList.forEach((element, index) => {
        if (conversaIds.indexOf(element.id) == -1) {
            conversaIds.push(element.id);
            conversationList.push(element);
        }
    });

    // console.log('conversationList=======', conversationList)

    conversationList.forEach(element => {

        if (element.id == systemOfficialConversation.id) {
            systemOfficialConversation = element;
        }
        if (element.id == systemSecretaryConversation.id) {
            systemSecretaryConversation = element;
        }
    });

    conversationList = conversationList.filter(element => element.id != '')//过滤诡异会话(无id)
    conversationList = conversationList.filter(element => element.id != SYSTEM_CUSTOMER_ID) //过滤系统客服号
    conversationList = conversationList.filter(element => element.id != SYSTEM_PRODUCT_ID) //过滤意见反馈号
    conversationList = conversationList.filter(element => element.id != SYSTEM_PRODUCT_TEAM_ID)//过滤产品团队号
    conversationList = conversationList.filter(element => !isNormalRoom(element.id))//过滤掉房间会话
    conversationList = conversationList.filter(element => element.id != SYSTEM_APP_NOTIFICATION_ID)//过滤系统通知号
    conversationList = conversationList.filter(element => element.id != SYSTEM_OPERATION_MANAGER_ID)//过滤运维管理员号
    conversationList = conversationList.filter(element => !element.isGroup)//筛掉群组


    //过滤官方消息和小秘书
    if (conversationList.indexOf(systemOfficialConversation) != -1) {
        conversationList.splice(conversationList.indexOf(systemOfficialConversation), 1)
    }
    if (conversationList.indexOf(systemSecretaryConversation) != -1) {
        conversationList.splice(conversationList.indexOf(systemSecretaryConversation), 1)
    }

    let list = [systemOfficialConversation, systemSecretaryConversation];

    conversationList = list.concat(conversationList);

    if (!unNeedUserInfo) {
        await setConversationUserInfo(conversationList)
    }

    conversationList = conversationList.filter(element => element.id != '')//过滤诡异会话(无id)

    return conversationList;
}

/**
 * 设置会话userinfo
 * @param {*} conversationList 
 */
export const setConversationUserInfo = async (conversationList) => {
    //调整数据
    let Ids = [];
    conversationList.forEach((element, index) => {
        _setConversation(element);
        if (index > 1 && Ids.indexOf(element.id) == -1) {
            Ids.push(element.id)
        }
    });
    //获取logoTime和url
    // console.log("用户", Ids)
    const res2 = await require("../ServerCmd").MyCmd_getUserList({
        userIds: Ids,
    })
    if (HResultStatus.Success != res2.state) {
        require("../ErrorStatusModel").default.showTips(res2.state);
        return [];
    }
    if (!res2.data || !res2.data.list) {
        return [];
    }

    //调整昵称
    res2.data.list.forEach(element => {
        element.nickName = decodeURI(element.nickName);
    });

    //大v配置
    let vipIds = await UserInfoModel.getVipAuthentication()

    conversationList.forEach(conversation => {
        res2.data.list.forEach((element, i) => {
            if (element.userId == conversation.id) {
                conversation.userInfo = element;
                conversation.userInfo.isBigV = !!vipIds[element.userId];
            }
        });
    });

    conversationList[0].userInfo = {
        nickName: OFFICIAL_NAME,
    }
    conversationList[1].userInfo = {
        nickName: SECRETARY_NAME,
    }
}

/**
 * 已读
 * @param {bool} isGroup 
 * @param {string} id 
 */
export const setReadMsg = async (isGroup, id) => {
    let b = await _checkLogin();
    if (!b) {
        return false;
    }

    try {
        let data = await TencentIMModule.setReadMsg(isGroup, id);
        if (data == 0) {
            ModelEvent.dispatchEntity(null, EVT_LOGIC_SET_CHAT_MESSAGE_UNREAD, null);
        } else {
            ToastUtil.showCenter(data);
        }
    } catch (error) {
        return false;
    }

    return true;
}

/**
 * 获取所有会话未读
 * @param {string} id 
 */
export const getUnReadNum = async () => {
    let b = await _checkLogin();
    if (!b) {
        return null;
    }

    let infos = await getConversationList(true);
    // console.log("ChatModel", "未读", infos)
    try {
        if (!infos || infos.length == 0) {
            return 0;
        }
        let unReadNums = await TencentIMModule.getUnReadNum(infos);
        // console.log("ChatModel", "未读数", unReadNums)
        let unReadNum = 0;
        unReadNums.forEach(element => {
            unReadNum += element;
        });

        /**
         * 这个是语音圈的未读数
         * 不能合并
         * 不能合并
         * 不能合并
         */
        let commentsUnreadCount = 0;//await require("../thread/NotificationModel").default.getUnreadCount(1)
        let likesUnreadCount = 0;//await require("../thread/NotificationModel").default.getUnreadCount(2)
        return unReadNum + commentsUnreadCount + likesUnreadCount;
    } catch (error) {
        return 0;
    }
}


function _setMessage(element) {

    //判断是否有普通消息
    let desc = "[自定义消息]";
    let data = "";
    let type = 4;
    let userInfo = {};
    try {
        //避免某些奇怪消息解析不了
        let isAllCustom = true;
        element.elems.forEach(msg => {
            if (msg.type != 4) {
                isAllCustom = false;
                type = msg.type;
                switch (msg.type) {
                    case 1:
                        data = msg.content;
                        desc = msg.content;
                        break;
                    case 3:
                        desc = "[语音]";
                        //{ url: '',
                        // duration: 2,
                        // size: 6155,
                        // uuid: '1400341243_7529881_e345b1745a273c0bf4c6d4a33391844a.pudding/cache/tempAudio' }
                        data = msg.content;
                        break;
                    case 7:
                        desc = "[表情]";
                        break;
                    case 2:
                        desc = "[图片]";
                        for (let index = 0; index < msg.content.length; index++) {
                            const element = msg.content[index];
                            if (element.url) {
                                data = element;
                            }
                        }
                        break;
                }
            }
            if (msg.content.desc == "SendUserEntity") {
                userInfo = JSON.parse(msg.content.data);
            }
        });
        // console.log("消息type", element);

        if (isAllCustom) {
            let customType = element.elems[0].content.data.slice(0, element.elems[0].content.data.indexOf("#") + 1);
            let message = element.elems[0].content.data.slice(element.elems[0].content.data.indexOf("#") + 1);

            if ("13#" == customType) {
                //这是官方消息
                desc = JSON.parse(message);
                type = 13;
            } else if ("luckryMoney#" == customType) {
                desc = JSON.parse(message);
                type = "luckryMoney";
            } else if ("announcerFinish#" == customType) {
                desc = JSON.parse(message);
                type = "announcerFinish";
            } else if ('userDataCard#' == customType) {
                desc = JSON.parse(message)
                type = 'userDataCard'
            } else {
                desc = JSON.parse(message).data;
                type = 1;
            }

            element.type = type;
            data = desc;
        }
    } catch (err) {

        desc = "";
    }

    element.desc = desc;
    element.data = data;
    element.type = type;
    element.userInfo = userInfo;
}

export async function _setMsgs(msg) {
    let Ids = [];
    msg = msg.filter(element => element.sender != '@TIM#SYSTEM')
    msg.forEach((element, index) => {
        _setMessage(element);
        if (Ids.indexOf(element.sender) == -1) {
            Ids.push(element.sender)
        }
    });
    //获取logoTime和url
    const res2 = await require("../ServerCmd").MyCmd_getUserList({
        userIds: Ids,
    })
    if (HResultStatus.Success != res2.state) {
        require("../ErrorStatusModel").default.showTips(res2.state);
        return [];
    }
    if (!res2.data || !res2.data.list) {
        return [];
    }

    res2.data.list.forEach((element, i) => {
        element.nickName = decodeURI(element.nickName);
    });

    //大v配置
    let vipIds = await UserInfoModel.getVipAuthentication()

    msg.forEach(message => {
        res2.data.list.forEach((element, i) => {
            if (element.userId == message.sender) {
                message.userInfo = element;
                message.userInfo.isBigV = !!vipIds[element.userId];
            }
        });
    });

    return msg.reverse();
}

/**
 * 获取会话消息
 * @param {bool} isGroup 
 * @param {string} id 
 * @param {string} lastMsg 
 */
export const getHistoryMsgs = async (isGroup, id, lastMsg, row = 10) => {
    let b = await _checkLogin();
    if (!b) {
        return false;
    }

    // console.log("获取消息", lastMsg)
    let seq = lastMsg ? lastMsg.seq : -1;
    let time = lastMsg ? lastMsg.time : 0;
    let rand = lastMsg ? lastMsg.rand : 0;
    let isSelf = lastMsg ? lastMsg.isSelf : false;
    let msg;
    try {
        if (isGroup) {
            msg = await TencentIMModule.getGroupHistoryMsgs(id, row + 1, seq, time, rand, isSelf, 0);
        } else {
            msg = await TencentIMModule.getC2CHistoryMsgs(id, row + 1, seq, time, rand, isSelf);
        }
    } catch (error) {
        return [];
    }

    // console.log("获取消息", msg)
    //是否显示时间
    for (let i = 0; i < msg.length - 2; i++) {
        msg[i].showTime = Config.isTimeBefore(msg[i + 1].time * 1000, msg[i].time * 1000) ? Config.getIMStatusTime(msg[i].time * 1000) : "";
    }
    if (msg.length < 11 && msg.length > 0) {
        //是最后一条消息了，一定要显示时间
        msg[msg.length - 1].showTime = Config.getIMStatusTime(msg[msg.length - 1].time * 1000);
    } else {
        //删除多出来的一条
        msg.pop();
    }

    //调整数据
    let data = await _setMsgs(msg);
    return data;
}

/**
 * 清空会话消息
 * @param {bool} isGroup 
 * @param {string} id 
 */
export const deleteConversation = async (isGroup, id) => {
    let b = await _checkLogin();
    if (!b) {
        return false;
    }

    try {
        let res = await TencentIMModule.deleteMsg(isGroup, id);
        return res;
    } catch (error) {
        return false;
    }

    return true;
}

/**
 * 	申请加群
 * @param {String} groupId 
 * @param {Promise} promise 
 */
export const applyJoinGroup = async (groupId) => {
    let b = await _checkLogin();
    if (!b) {
        return false;
    }
    try {
        await TencentIMModule.applyJoinGroup(groupId)
        return true
    } catch (error) {
        return false
    }
}

/**
 * 	主动退出群组
 * @param {String} groupId 
 * @param {Promise} promise 
 */
export const quitGroup = async (groupId) => {

    try {
        await TencentIMModule.quitGroup(groupId)
        return true
    } catch (error) {
        return false
    }
}

/**
 * 向用户发信息
 * @param {String} userId 
 * @param {Array} content 
 */
export const sendC2CMessage = async (userId, content) => {
    if (content && content[0] && content[0][0] == 1) {
        let check1 = await require("../staticdata/StaticDataModel").checkSensitiveWordByOfficial(content[0][1]);
        if ((check1 != null) && (check1 === true)) {
            ToastUtil.showCenter('当前内容含有不规范内容')
            return false
        }
    }


    let b = await _checkLogin();
    if (!b) {
        return false;
    }

    //        1、文本	[1, "sfjsfl"]
    //        2、图片	[2, path, level]
    //            path: 'sdfsfsfsf',	//文件本地路径
    //                    level: 1,			//0表示原图，1表示缩略图
    //        }
    //        3、声音	[3, path, duration]
    //            path: 'asdfsafsf',	//文件本地路径
    //                    duration: 1011,		//语音时长
    //        }
    //        4、自定义 [4, "sdfsafsdf"]

    try {
        // String identify, ReadableArray content
        await TencentIMModule.sendC2CMessage(userId, content);
    } catch (error) {
        return false;
    }

    _sendBroNewMsg(userId, content, false);
    return true;
}



//TODO:增加消息就更新这里
function _sendBroNewMsg(userId, content, isGroup) {
    // console.log('----------IM-------------', '_sendBroNewMsg', userId, content.isGroup)
    //自己发的消息，自己构造一个广播通知
    content.forEach(element => {
        switch (element[0]) {
            case 1:
                emmiter.emit(TX_IM_NEW_MSG, [{
                    elems: [{ content: element[1], type: element[0] }],
                    isGroup,
                    isSelf: true,
                    sender: UserInfoCache.userId,
                    id: userId,
                    time: new Date().getTime() / 1000,
                }])
                break;
            case 2:
                emmiter.emit(TX_IM_NEW_MSG, [{
                    elems: [{
                        content: [{
                            url: `file:/${element[1]}`,
                            size: 0,
                            width: element[3] ? element[3] : 400,
                            height: element[4] ? element[4] : 400,
                            type: 2
                        }],
                        type: 2
                    }],
                    isGroup,
                    isSelf: true,
                    sender: UserInfoCache.userId,
                    id: userId,
                    time: new Date().getTime() / 1000,
                }])
                break;
            case 4:
                if (element[1].indexOf("luckryMoney#") == 0) {
                    emmiter.emit(TX_IM_NEW_MSG, [{
                        elems: [{
                            content: { data: element[1], },
                            type: 4,
                        }],
                        isGroup,
                        isSelf: true,
                        sender: UserInfoCache.userId,
                        id: userId,
                        time: new Date().getTime() / 1000,
                    }])
                } else if (element[1].indexOf('userDataCard') == 0) {
                    emmiter.emit(TX_IM_NEW_MSG, [{
                        elems: [{
                            content: { data: element[1], },
                            type: 4,
                        }],
                        isGroup,
                        isSelf: true,
                        sender: UserInfoCache.userId,
                        id: userId,
                        time: new Date().getTime() / 1000,
                    }])
                }
                break;

        }
    });
}

/**
 * 发送群组信息
 * @param {String} groupId 
 * @param {Array} content 
 */
export const sendGroupMessage = async (groupId, content) => {
    if (content && content[0] && content[0][0] == 1) {
        let check1 = await require("../staticdata/StaticDataModel").checkSensitiveWordByOfficial(content[0][1]);
        if ((check1 != null) && (check1 === true)) {
            ToastUtil.showCenter('当前内容含有不规范内容')
            return false
        }
    }

    let b = await _checkLogin();
    if (!b) {
        return false;
    }

    //        1、文本	[1, "sfjsfl"]
    //        2、图片	[2, path, level]
    //            path: 'sdfsfsfsf',	//文件本地路径
    //                    level: 1,			//0表示原图，1表示缩略图
    //        }
    //        3、声音	[3, path, duration]
    //            path: 'asdfsafsf',	//文件本地路径
    //                    duration: 1011,		//语音时长
    //        }
    //        4、自定义 [4, "sdfsafsdf"]

    try {
        // String identify, ReadableArray content
        await TencentIMModule.sendGroupMessage(groupId, content);
    } catch (error) {
        return false;
    }

    _sendBroNewMsg(groupId, content, true);
    return true;
}
/**
 * 发送系统信息
 * @param {String} groupId 
 * @param {Array} content 
 */
export const sendSystemMessage = async (groupId, content) => {
    let b = await _checkLogin();
    if (!b) {
        return false;
    }

    //        1、文本	[1, "sfjsfl"]
    //        2、图片	[2, path, level]
    //            path: 'sdfsfsfsf',	//文件本地路径
    //                    level: 1,			//0表示原图，1表示缩略图
    //        }
    //        3、声音	[3, path, duration]
    //            path: 'asdfsafsf',	//文件本地路径
    //                    duration: 1011,		//语音时长
    //        }
    //        4、自定义 [4, "sdfsafsdf"]

    try {
        // String identify, ReadableArray content
        await TencentIMModule.sendSystemMessage(groupId, content);
    } catch (error) {
        return false;
    }

    return true;
}

/**
 * 发送房间公屏信息
 * @param {String} content 
 */
export const sendRoomPublicScreenText = async (content) => {
    let check1 = await require("../staticdata/StaticDataModel").checkSensitiveWordByOfficial(content);
    if ((check1 != null) && (check1 === true)) {
        ToastUtil.showCenter('当前内容含有不规范内容')
        return false
    }

    const userId = UserInfoCache.userInfo.userId
    const userInfo = await require('../userinfo/UserInfoModel').default.getPersonPage(userId)
    if (!userInfo) {
        return null;
    }
    const roomData = RoomInfoCache.roomData;
    if (!roomData) {
        return null;
    }

    let b = await _checkLogin();
    if (!b) {
        return null;
    }

    const sender = {
        headUrl: Config.getHeadUrl(userInfo.userId, userInfo.logoTime, userInfo.thirdIconurl),
        charmLv: userInfo.charmLv,
        vipLv: userInfo.vipLv,
        sex: userInfo.sex,
        headFrameId: userInfo.headFrameId,
        contributeLv: userInfo.contributeLv,
        nickName: userInfo.nickName,
        userId: userInfo.userId,
        isNewUser: userInfo.isNew,
    };
    if (roomData) {
        sender.hatId = roomData.hatId;
        sender.guardianName = roomData.guardName;
        sender.isGuardian = roomData.isGuardian;
        sender.guardianLv = roomData.guardianLv;
    }

    const ent = {
        type: 1,    //MessageConstant.TEXT
        content,
        sender,
    };

    // 4、自定义 [4, "sdfsafsdf"]
    try {
        // String identify, ReadableArray content
        await TencentIMModule.sendGroupMessage(roomData.roomId, [[4, JSON.stringify(ent)]]);
    } catch (error) {
        // return null;
        ent.content = `code:${error.code}, ${error.message}`;
    }

    require("../room/RoomPublicScreenModel").imText(ent);

    return ent;

}

/**
 * IM消息图片的参数
 */
// let Photo = {
//     key: "asdadasd",             //cos的文件名
//     width:400,                   //图片宽度
//     height:800,                  //图片高度
// }
/**
 * 发送房间公屏Photo信息
 * @param {Photo} photo 
 */
export const sendRoomPublicScreenPhoto = async (photo) => {
    let content = JSON.stringify(photo);
    const userId = UserInfoCache.userInfo.userId
    const userInfo = await require('../userinfo/UserInfoModel').default.getPersonPage(userId)
    if (!userInfo) {
        return null;
    }
    const roomData = RoomInfoCache.roomData;
    if (!roomData) {
        return null;
    }

    let b = await _checkLogin();
    if (!b) {
        return null;
    }

    const sender = {
        headUrl: Config.getHeadUrl(userInfo.userId, userInfo.logoTime, userInfo.thirdIconurl),
        charmLv: userInfo.charmLv,
        vipLv: userInfo.vipLv,
        sex: userInfo.sex,
        headFrameId: userInfo.headFrameId,
        contributeLv: userInfo.contributeLv,
        nickName: userInfo.nickName,
        userId: userInfo.userId,
        isNewUser: userInfo.isNew,
    };
    if (roomData) {
        sender.hatId = roomData.hatId;
        sender.guardianName = roomData.guardName;
        sender.isGuardian = roomData.isGuardian;
        sender.guardianLv = roomData.guardianLv;
    }

    const ent = {
        type: 7,    //MessageConstant.PHOTO
        content,
        sender,
    };

    // 4、自定义 [4, "sdfsafsdf"]
    try {
        // String identify, ReadableArray content
        await TencentIMModule.sendGroupMessage(roomData.roomId, [[4, JSON.stringify(ent)]]);
    } catch (error) {
        // return null;
        ent.content = `code:${error.code}, ${error.message}`;
    }

    require("../room/RoomPublicScreenModel").imPhoto(ent);

    return ent;

}

/**
 * 发送提示用户关注房主
 *  
 */
export const sendFollow = async () => {
    const userId = UserInfoCache.userId;
    const userInfo = await require('../userinfo/UserInfoModel').default.getPersonPage(userId)
    if (!userInfo) {
        return null;
    }

    let b = await _checkLogin();
    if (!b) {
        return null;
    }

    const sender = {
        contributeLv: userInfo.contributeLv,
        charmLv: userInfo.charmLv,
        userId: userInfo.userId,
        nickName: userInfo.nickName,
    }

    const ent = {
        content: "关注了房主",
        sender
    }
    // console.log(ent)
    require("../room/RoomPublicScreenModel").followText(ent);
}