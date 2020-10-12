/**
 * 自己的信息缓存
 */

'use strict';

// message Logon {
// 	required string serverId = 1;// 当前服务器ID
// 	required string tlsSig = 2;//腾讯Tls后台签名
// 	required string roomId = 3;//当前所在的房间ID
// 	repeated int32 dataVersions = 4;//静态数据版本号
// 	optional string host = 5;//socket连接host
// 	optional int32 port = 6;//socket连接port
// 	optional bool setpassword = 7;//是否已经设置密码
// 	optional string sessionId = 8;//当前请求交互的sessionId
// 	optional bool needSetPersonData = 15;//是否需要设置个人资料
// 	optional string headUrl = 16;//第三方头象	
// 	optional string version = 17;//当前版本号
// 	optional UserInitData initData = 18;//App初始化数据
// 	optional int32 forceUpdate = 19;//0不更新,1强更,2提示更新
// 	optional int32 iosPayType = 20;// IOS支付方式:0使用第三方支付,1苹果内购
// 	optional bool isSanBox = 21;//是否沙盒环境
// 	optional bool isBlack = 22;//是否黑名单用户
// 	//login
// 	optional string userId = 9;
// 	optional string tickToken = 10;// 登陆成功返回的tocken
// 	optional bool addSysGMember = 11;//true需要前端调用加入系统总群
// 	optional string phoneNumber = 12;//电话号码
// 	optional string userName = 13;//用户登陆帐号
// 	optional string password = 14;//用户密码	
// 	optional int32 authType = 23;//认证类型:1手机认证2支付宝认证
// 	optional int32 youngType = 24;//青少年弹框类型:1弹开启2弹时间限制模式(为2的时候每次都返回)
// 	optional bool youngOpen = 25;//是否开启青少年模式
// 	optional int64 deviceSeq = 26;//设备注册序列号:AB测试用(0不分AB,单数A,双数B)
// 	optional string channelRoom = 27;//渠道推送房间ID
// 	optional string channelRoomTips = 28;//渠道推送房间软提示(如果为空则为硬打开)
// 	optional bool isRegister = 29;// 是否是注册，true是，false否
// 	optional bool setPayPassword = 30;//是否已经设置支付密码（用在提现，回购）
// }
let sm_logon = {};

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

//这个是 UserCmd.login转换的参数
let sm_loginReqMap;


const UserInfoCache = {

    /**
     * logon成功后的数据
     * @param {UserResult.Logon} logon 
     */
    setLogonResult(logon, loginReqParams) {
        sm_logon = logon || {};

        if (!sm_loginReqMap && loginReqParams) {
            sm_loginReqMap = {};
            //登陆:返回UserResult.Login
            // message login {
            //     repeated string paramKey = 1;//参数key
            //     repeated string paramValue = 2;//参数值
            // }

            //这个判定用来兼容之前的bug，因为第一个版本保存错了，保存了 logon参数
            if (loginReqParams.paramKey) {
                for (let i = loginReqParams.paramKey.length - 1; i >= 0; --i) {
                    sm_loginReqMap[loginReqParams.paramKey[i]] = loginReqParams.paramValue[i];
                }
            }
        }
    },

    /**
     * 自己的userId
     * @returns {string}
     */
    get userId() {
        return sm_logon.userId;
    },

    /**
     * 自己的userName
     */
    get userName() {
        return sm_logon.nickName
    },

    /**
     * 自己的userSign
     * @returns {string}
     */
    get tlsSig() {
        return sm_logon.tlsSig;
    },

    /**
     * 自己的phoneNumber
     * @returns {string}
     */
    get phoneNumber() {
        return sm_logon.phoneNumber;
    },

    /**
     * 是否已设置登录密码
     * @param {bool}  
     */
    get setpassword(){
        return sm_logon.setpassword;
    },

    /**
     * 是否已设置支付密码
     * @param {bool}  
     */
    get setPayPassword(){
        return sm_logon.setPayPassword;
    },

    /**
     * 更新自己的phoneNumber
     * {string}
     */
    setPhoneNumber(phoneNumber) {
        sm_logon.phoneNumber = phoneNumber;
        if (sm_loginReqMap) {
            sm_loginReqMap['user_from'] = "hadBindPhone";
        }
    },

    /**
     * 是否需要设置个人资料
     * @returns {bool}
     */
    get needSetPersonData() {
        return sm_logon.needSetPersonData;
    },

    /**
     * 已经设置支付密码（用在提现，回购）
     */
    setPayPasswordTrue() {
        sm_logon.setPayPassword = true;
    },

    /**
     * 官方消息群id
     * @returns {string}
     */
    get officialGroupId() {
        return sm_logon.initData && sm_logon.initData.officialGroupId;
    },

    setOfficialGroupId(groupId) {
        sm_logon.initData && (sm_logon.initData.officialGroupId = groupId)
    },


    //UserResult.UserInfo
    userInfo: null,



    /**
     * 更新自己的财富等级
     */
    setContributeLv(lv) {
        if (UserInfoCache.userInfo) {
            UserInfoCache.userInfo.contributeLv = lv
        }
    },

    /**
       * 更新自己的魅力等级
       */
    setCharmLv(lv) {
        if (UserInfoCache.userInfo) {
            UserInfoCache.userInfo.charmLv = lv
        }
    },

    /**
     * 更新自己的昵称
     */
    setNickName(name) {
        if (UserInfoCache.userInfo) {
            UserInfoCache.userInfo.nickName = name
        }
    },


    /**
     * 是否游客
     */
    get isVisitor() {
        return sm_loginReqMap && sm_loginReqMap['user_from'] == "visitor";
    },

    /**
     * 退出登陆时候调用
     * 清除用户当前所有状态
     */
    clear() {
        UserInfoCache.userInfo = null;

        sm_loginReqMap = null;
        sm_logon = {};
    },


};

export default UserInfoCache;