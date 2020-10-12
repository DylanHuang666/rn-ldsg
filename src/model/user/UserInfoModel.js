/**
 * 用户信息逻辑
 */
'use strict';

import { NativeModules } from "react-native";
import UserInfoCache from "../../cache/UserInfoCache";
import Config from "../../configs/Config";


let sm_myInfoQueue;
function _getPersonPage() {
    return new Promise(async (resolve, reject) => {
        if (sm_myInfoQueue) {
            sm_myInfoQueue.add(resolve);
            return;
        }

        const PromiseResolveQueue = require("../../utils/PromiseResolveQueue").default;
        sm_myInfoQueue = new PromiseResolveQueue(resolve);

        //获得玩家信息数据 返回 UserResult.UserInfoList
        // message getUserInfoList {
        // 	repeated string userIds = 1;//玩家ID列表
        // 	required int64 type = 2;//获取数据组合(见EUserDataType)
        // }
        const res = await require("../ServerCmd").MyCmd_getUserInfoList({
            userIds: [UserInfoCache.userId],
            type: 0xFFFFFFFFFFFFF,
            // type: 1623463282061823,
        });

        UserInfoCache.userInfo = res.data && res.data.list && res.data.list[0];
        // 用户信息
        // message UserInfo {
        // 	required string userId = 1;//用户ID
        // 	optional string nickName = 2;//昵称	
        // 	optional int32 logoTime = 3;//修改logo的时间 0为没修改过
        // 	optional string thirdIconurl = 4;//第三方头像
        // 	optional string headFrameId = 5;// 头像框
        // 	optional int32 sex = 6;// 姓别 0 未知 1:男 2:女
        // 	optional int32 level = 7;//玩家等级
        // 	optional string phoneNum = 8;// 电话号码
        // 	optional int32 age = 9;//年龄	
        // 	optional string slogan = 10;//个性化签名
        // 	optional string position = 11;//地标	
        // 	optional string constellation = 12;//星座
        // 	optional string birthday = 13;//生日		
        // 	optional string banners = 14;//banner图，图ID列表，逗号分隔	

        // 	optional int32 vipLv = 15;//平台VIP等级 
        // 	optional int32 charmLv = 16;// 魅力等级
        // 	optional int64 charm = 17;// 魅力值
        // 	optional int32 contributeLv = 18;// 土豪等级
        // 	optional int64 contribute = 19;// 土豪值	

        // 	optional int32 goldShell = 20;// 金贝
        // 	optional int32 bindGoldShell = 21;// 绑定金贝	

        // 	optional int32 myLoves = 22;// 关注数
        // 	optional int32 friends = 23;// 被关注数(粉丝数) 
        // 	optional int32 friendStatus = 24;//好友状态 0是自己,1是好友,2已关注,3已被关注,4未被关注也没关注	
        // 	optional string friendRemark = 25;  // 好友备注

        // 	optional bool hasCar = 26;//是否拥有座驾
        // 	optional bool hasGift = 27;//是否收到礼物	

        // 	optional int32 momentNum = 28;// 动态数量
        // 	optional bool modifyTips = 29;// 编辑提示

        // 	optional string roomId = 30;//所在房间，若空，则不在房间
        // 	optional string roomName = 31;//房间名
        // 	optional int32 roomType = 32;//所在房间类型 ERoomMainType	
        // 	optional int32 roomStatus = 33;// 房间状态:0未开播,1开播未上锁,2开播上锁

        // 	optional bool followEnterRoom = 34;// 是否跟随进房
        // 	optional bool openTips = 35;// 开播提醒
        // 	optional bool shakeMicUp = 36;// 摇一摇上mic	

        // 	optional bool online = 37;  // 是否在线	
        // 	optional int32 lastLogoutTime = 38;//最后登出时间=0代表在线(需要加2017-01-01)	
        // 	optional bool official = 39;//是否为官方黑马
        // 	optional bool invisible = 40;//是否隐身

        // 	optional int64 totalLiveEarn = 41;//总收益(分)(已没用)
        // 	optional int64 dayLiveEarn = 42;//当天收益(分)(已没用)
        // 	optional int64 balance = 43;//可提现(分)(已没用)

        // 	optional int32 rabbitCoin = 44;//兔子币
        // 	optional string carId = 45;//当前使用的坐驾ID
        // 	optional string dialogFrameId = 46;//当前使用的对话框ID
        // 	optional bool isCertification = 47;//是否实名认证：true已实名认证，false未实名认证
        // 	optional bool isNew = 48;// 是否新用户
        // 	optional string familyId = 49;// 家族id

        // 	optional int32 pullBlackStatus = 50;// 拉黑状态
        // 	optional bool updatedSex = 51;// 是否修改过性别
        // 	optional int32 guardians = 52;// 守护我的人

        // 	repeated string useMedals = 53;//当前使用的勋章
        // 	optional int32 roomLogoTime = 54;//房间修改logo的时间 0为没修改过

        // 	optional Coordinate coordinate = 55;// 坐标，经纬度
        // 	optional bool isOpenLoveRing = 56;// 是否开启恋爱铃
        // 	optional bool isGuardian = 57;// 是否是守护团成员，true：是，false：否
        // 	optional bool isAcptMicInvt = 58;// 是否开启接受房间外连麦邀请

        // 	optional int32 roomSubType = 59;// 所在房间子类型 ERoomType(用于判断是否在相亲视频房)	
        // 	optional int32 matchmakerStatus = 60;// 月老/红娘 状态(-1:无关 0:申请中 1:通过 2:拒绝 3:取消资格)
        // 	optional bool notFriendNeedAgree = 61;// 非好友邀请进群是否需求同意，默认false不需要，true需要

        // 	optional UserCpInfo cpInfo = 62;// 用户cp
        // }

        //语音球数据更新
        require('../SuspendModel').updateInfo();

        const queue = sm_myInfoQueue;
        sm_myInfoQueue = null;
        queue.end(null);
    });

}

async function _getMyUserId() {
    if (UserInfoCache.userId) {
        return UserInfoCache.userId;
    }

    await require("../ServerCmd").tryRequestLoginByCache();
    return UserInfoCache.userId;
}

function _updateStaticDataVersion(logon) {
    if (!logon) return;
    if (!logon.dataVersions) return;

    const l = logon.dataVersions.length;
    const HClientTables = require("../../hardcode/HClientTables").default;
    for (const tableName in HClientTables) {
        const vo = HClientTables[tableName];
        if (vo.id >= l) {
            console.warn('logon dataVersions not found', vo);
            continue;
        }

        const v = logon.dataVersions[vo.id];
        if (vo.version === undefined) {
            vo.version = v;
            continue;
        }

        if (v != vo.version) {
            // console.log(`${vo.tableName} need update src:${vo.version}, dst:${v}`);
            vo.version = v;
        }
    }
}

const UserInfoModel = {

    /**
     * logon成功后的数据
     * @param {UserResult.Logon} logon 
     * @param {UserCmd.login} loginReqParams
     */
    afterLogonSuccess(logon, loginReqParams) {
        //缓存logon数据
        UserInfoCache.setLogonResult(logon, loginReqParams);

        _updateStaticDataVersion(logon);

        //请求自己全部数据
        _getPersonPage();

        //设置bugly的用户id
        NativeModules.Bugly && NativeModules.Bugly.setUserId(UserInfoCache.userId);

        //im登陆
        require("../chat/ChatModel").checkLogin();

        //检查是否重新进入房间，主要处理断线重连
        require('../../model/room/RoomModel').default.reCheckEnter();

        //读取砸蛋配置
        require('../../model/EggModel').default.getEggDisplayConfig();
    },

    /**
     * 上次启动的logon数据
     * 有数据才会回调
     * @param {UserResult.Logon} logon 
     * @param {UserCmd.login} loginReqParams
     */
    prevLogonData(logon, loginReqParams) {
        //缓存logon数据
        UserInfoCache.setLogonResult(logon, loginReqParams);

        _updateStaticDataVersion(logon);
    },

    /**
     * 获得自己的头像url
     * @param {int} size 
     */
    async getMyHeadUrl(size) {
        const userId = await _getMyUserId();
        if (!userId) {
            return null;
        }

        if (!UserInfoCache.userInfo) {
            await _getPersonPage();

            if (!UserInfoCache.userInfo) {
                return null;
            }
        }

        return { uri: Config.getHeadUrl(userId, UserInfoCache.userInfo.logoTime, UserInfoCache.userInfo.thirdIconurl, size) };
    },
};


export default UserInfoModel;

/**
 * 更新 UserResult.UserInfo 缓存
 * UserInfoCache.userInfo
 */
export const updateUserInfoCache = () => {
    return _getPersonPage();
}