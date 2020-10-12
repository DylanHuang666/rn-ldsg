/**
 * 开播设置逻辑
 */
'use strict';

import UserInfoCache from "../../cache/UserInfoCache";
import Config from "../../configs/Config";
import { ERoomType } from "../../hardcode/ERoom";
import HResultStatus from "../../hardcode/HResultStatus";
import ToastUtil from "../../view/base/ToastUtil";


function _doParseRoomTypeList(list, isContainsFriends, isContainsVideo, bAnchorStatus, makeFriendSwitch) {
    let ret = [];

    isContainsFriends = isContainsFriends || makeFriendSwitch.value === '0';

    for (let vo of list) {
        // "keys":["icon","id","keyid","type"]
        switch (vo.id) {
            case ERoomType.FUN_FRIEND_ROOM://交友房
                if (!isContainsFriends) continue;
                break;

            case ERoomType.FUN_VIDEO_ROOM://视频交友房
                if (isContainsVideo) continue;
                if (bAnchorStatus) continue;
                break;
        }
        ret.push(vo);
    }
    return ret;
}

function _getRecentRoomBgDatas(voiceRoomBackgroundList, bgs) {
    if (!voiceRoomBackgroundList || !bgs) {
        return [];
    }

    const ret = [];
    for (let i = 0; i < bgs.length; ++i) {
        const id = bgs[i];
        for (let j = 0; j < voiceRoomBackgroundList.length; ++j) {
            // "keys":["animationname","backgroundid","createtime","endtime","id","name","price","starttime","updatetime","valid","visibleroom","weight"]
            const voiceRoomBackground = voiceRoomBackgroundList[j];

            if (id == voiceRoomBackground.backgroundid) {
                ret.push(voiceRoomBackground);
            }
        }
    }

    return ret;
}

// public interface IRoomType {
//     int getId();

//     /**
//      * 用于显示的
//      *
//      * @return
//      */
//     String getType();

//     String getRoomId();

//     String getRoomName();

//     UserResult.UserBase getAnchorData();

//     int getLogoTime();

//     void setRoomName(String s);

//     List<VoiceRoomBackground> getRecentVoiceRoomBackground();

//     VoiceRoomBackground getBackground();

//     void setBackground(VoiceRoomBackground bg);
// }

class RoomTypeExt /** implements IRoomType */ {
    constructor(logoTime, roomType, roomName, recentVoiceRoomBackground, backgroundWrapper, roomHeadUriWrapper) {
        this._logoTime = logoTime;
        this._roomType = roomType;  // "keys":["icon","id","keyid","type"]
        this._roomName = roomName;  // {string -> roomName }
        this._recentVoiceRoomBackground = recentVoiceRoomBackground;
        this._backgroundWrapper = backgroundWrapper;  //{data -> CS_VoiceRoomBackground}
        this._roomHeadUriWrapper = roomHeadUriWrapper;
    }


    // 必须要实现的接口 IRoomType --------------------------------------
    get id() {
        return this._roomType.id;
    }

    get type() {
        return this._roomType.type;
    }

    get roomId() {
        return '';
    }

    get roomName() {
        return this._roomName.string;
    }

    get logoTime() {
        return this._logoTime;
    }

    set roomName(s) {
        this._roomName.string = s;
    }

    get recentVoiceRoomBackground() {
        return this._recentVoiceRoomBackground;
    }

    get background() {
        return this._backgroundWrapper.data;
    }

    set background(bg) {
        this._backgroundWrapper.data = bg;
    }

    getRoomHeadUri(size) {
        if (this._roomHeadUriWrapper.data) {
            return this._roomHeadUriWrapper.data;
        }
        const userId = UserInfoCache.userId;
        const roomId = 'A' + userId;
        const logoTime = UserInfoCache.userInfo && UserInfoCache.userInfo.logoTime;
        const thirdIconUrl = UserInfoCache.userInfo && UserInfoCache.userInfo.thirdIconurl;

        return { uri: Config.getRoomCreateLogoUrl(this._logoTime, roomId, userId, logoTime, thirdIconUrl, size) };
    }

    setRoomHeadUri(uri) {
        this._roomHeadUriWrapper.data = uri;
    }

    getUploadRoomHeadUrl() {
        return this._roomHeadUriWrapper.data && this._roomHeadUriWrapper.data.uri;
    }
}

class HallDataExt /** implements IRoomType */ {
    constructor(hallData, viewRoomId, recentVoiceRoomBackground, background) {
        // message HallData {	
        //     required string roomName = 1;//开播房间名
        //     required int32 roomType = 2;//开播房间类型
        //     optional UserResult.UserBase anchorData = 3;//主播信息(logoTime=0时传)
        //     required int32 logoTime = 4;//修改logo的时间 0为没修改过
        //     repeated string bgs = 5;//最近使用的背景图
        //     required string roomId = 6;//房间ID(带T开始,显示需要把T去掉,另外还要处理显示靓号)
        // }

        this._hallData = hallData;
        this._viewRoomId = viewRoomId;
        this._roomName = decodeURIComponent(hallData.roomName);
        this._recentVoiceRoomBackground = recentVoiceRoomBackground;
        this._background = background;  //CS_VoiceRoomBackground
        this._roomHeadUri = null;
    }


    // 必须要实现的接口 IRoomType --------------------------------------
    get id() {
        return this._hallData.roomType;
    }

    get type() {
        return this._viewRoomId;
    }

    get roomId() {
        return this._hallData.roomId;
    }

    get roomName() {
        return this._roomName;
    }

    get logoTime() {
        return this._hallData.logoTime;
    }

    set roomName(s) {
        this._roomName = s;
    }

    get recentVoiceRoomBackground() {
        return this._recentVoiceRoomBackground;
    }

    get background() {
        return this._background;
    }

    set background(bg) {
        this._background = bg;
    }

    getRoomHeadUri(size) {
        if (this._roomHeadUri) {
            return this._roomHeadUri;
        }

        if (0 == this._hallData.logoTime) {
            return { uri: Config.getHeadUrl(this._hallData.anchorData.userId, this._hallData.anchorData.logoTime, this._hallData.anchorData.thirdIconurl, size) }
        }

        const userId = UserInfoCache.userId;
        const roomId = this._hallData.roomId;
        const logoTime = UserInfoCache.userInfo && UserInfoCache.userInfo.logoTime;
        const thirdIconUrl = UserInfoCache.userInfo && UserInfoCache.userInfo.thirdIconurl;
        return { uri: Config.getRoomCreateLogoUrl(this._logoTime, roomId, userId, logoTime, thirdIconUrl, size) };
    }

    set roomHeadUri(uri) {
        this._roomHeadUri = uri;
    }

    getUploadRoomHeadUrl() {
        return this._roomHeadUri && this._roomHeadUri.uri;
    }
}

function _getBackground(recentVoiceRoomBackgroundList, voiceRoomBackgroundList) {
    if (recentVoiceRoomBackgroundList && recentVoiceRoomBackgroundList.length != 0) {
        return recentVoiceRoomBackgroundList[recentVoiceRoomBackgroundList.length - 1];
    }

    if (voiceRoomBackgroundList && voiceRoomBackgroundList.length != 0) {
        return voiceRoomBackgroundList[0];
    }
    return null;
}

/**
 * 用于显示的厅id
 *
 * @param id
 * @return
 */
function _getHallRoomViewId(id) {
    if (isHallRoom(id)) {
        return id.substring(1);
    }
    return id;
}

function _getRoomTypeList(roomOpenInfo, voiceRoomBackgroundList, recentVoiceRoomBackgroundList, roomTypeList, mapUserId2CuteNumberEntity, normalTypeRandomRoomName) {
    const iRoomTypeList = [];
    const backgroundWrapper = { data: _getBackground(recentVoiceRoomBackgroundList, voiceRoomBackgroundList) };
    const roomHeadUriWrapper = {};
    for (const vo of roomTypeList) {
        iRoomTypeList.push(new RoomTypeExt(roomOpenInfo.logoTime, vo, normalTypeRandomRoomName, recentVoiceRoomBackgroundList, backgroundWrapper, roomHeadUriWrapper));
    }
    if (roomOpenInfo.halls) {
        for (const vo of roomOpenInfo.halls) {
            // message HallData {	
            //     required string roomName = 1;//开播房间名
            //     required int32 roomType = 2;//开播房间类型
            //     optional UserResult.UserBase anchorData = 3;//主播信息(logoTime=0时传)
            //     required int32 logoTime = 4;//修改logo的时间 0为没修改过
            //     repeated string bgs = 5;//最近使用的背景图
            //     required string roomId = 6;//房间ID(带T开始,显示需要把T去掉,另外还要处理显示靓号)
            // }
            const viewRoomId = _getHallRoomViewId(vo.roomId);
            // "keys":["alterdatetime","icon","id","type"]
            const cuteNumberEntity = mapUserId2CuteNumberEntity[viewRoomId];
            if (cuteNumberEntity) {
                viewRoomId = cuteNumberEntity.id;
            }
            const hallDataExt = new HallDataExt(vo, viewRoomId, recentVoiceRoomBackgroundList, bg.data);
            iRoomTypeList.push(hallDataExt);

            if (vo.roomName) {
                queryRoomNameRandom(hallDataExt);
            }
        }
    }
    return iRoomTypeList;
}

const ReadyToStartBroadcastingModel = {

    /**
     * 获得开播信息
     */
    async getInfo() {
        const list = await Promise.all([
            // //获取开播房间信息:返回RoomResult.RoomOpenInfo
            // message getStartRoomInfo {
            // }
            require("../ServerCmd").RoomCmd_getStartRoomInfo({}),

            //读取音频房背景数据表
            // CS_VoiceRoomBackground
            // "keys":["animationname","backgroundid","createtime","endtime","id","name","price","starttime","updatetime","valid","visibleroom","weight"]
            require("../staticdata/StaticDataModel").getVoiceRoomBackground(),

            //读取公共配置表
            //"keys":["id","value","desc"]
            require("../staticdata/StaticDataModel").getPublicConfig(34),//交友房开关

            //白名单表
            require("../staticdata/StaticDataModel").getFriendRoomWrite(UserInfoCache.userId),

            //视频白名单表
            require("../staticdata/StaticDataModel").getVideoRoomWhite(UserInfoCache.userId),

            // 我的直播信息：LiveResult.LiveInfo
            // message myLiveInfo {
            // }
            require("../ServerCmd").LiveRoomCmd_myLiveInfo({}),

            //房间类型数据表
            // "keys":["icon","id","keyid","type"]
            require("../staticdata/StaticDataModel").getRoomType(),

        ]);



        //房间开播信息
        // message RoomOpenInfo {
        //     required string roomName = 1;//开播房间名
        //     required int32 roomType = 2;//开播房间类型
        //     optional UserResult.UserBase anchorData = 3;//主播信息(logoTime=0时传)
        //     optional int32 logoTime = 4;//修改logo的时间 0为没修改过
        //     repeated string bgs = 5;//最近使用的背景图
        //     repeated HallData halls = 6;//厅配置信息(调新命令RoomCmd.getStartRoomInfo时返回)
        // }
        if (HResultStatus.Success != list[0].state) {
            require("../ErrorStatusModel").default.showTips(list[0].state);
            return null;
        }
        if (!list[0].data) {
            require("../ErrorStatusModel").default.showTips(HResultStatus.ERROR_SERVER_DATA_ERROR);
            return null;
        }
        const roomOpenInfo = list[0].data;

        //厅靓号映射表
        const mapUserId2CuteNumberEntity = await require("../staticdata/StaticDataModel").getCuteNumberByUserIds(roomOpenInfo.halls);
        if (!mapUserId2CuteNumberEntity) {
            require("../ErrorStatusModel").default.showTips(HResultStatus.Fail);
            return null;
        }

        //房间名
        const normalTypeRandomRoomName = { string: '' };
        if (roomOpenInfo.roomName) {
            normalTypeRandomRoomName.string = decodeURIComponent(roomOpenInfo.roomName);
        } else {
            normalTypeRandomRoomName.string = await await require("../staticdata/StaticDataModel").randomRoomName();
            if (!normalTypeRandomRoomName.string) {
                require("../ErrorStatusModel").default.showTips(HResultStatus.Fail);
                return null;
            }
        }
        const roomNotice = decodeURIComponent(roomOpenInfo.notic)

        //音频房背景列表
        // "keys":["animationname","backgroundid","createtime","endtime","id","name","price","starttime","updatetime","valid","visibleroom","weight"]
        const voiceRoomBackgroundList = list[1];


        if (!voiceRoomBackgroundList) {
            return null;
        }
        // "keys":["animationname","backgroundid","createtime","endtime","id","name","price","starttime","updatetime","valid","visibleroom","weight"]
        const recentVoiceRoomBackgroundList = _getRecentRoomBgDatas(voiceRoomBackgroundList, roomOpenInfo.bgs);

        //交友房间开关
        // "keys":["id","value","desc"]
        const makeFriendSwitch = list[2];
        if (!makeFriendSwitch) {
            require("../ErrorStatusModel").default.showTips(HResultStatus.Fail);
            return null;
        }

        //白名单
        if (HResultStatus.Fail === list[3]) {
            require("../ErrorStatusModel").default.showTips(HResultStatus.Fail);
            return null;
        }
        const isContainsFriends = list[3] === HResultStatus.Success;

        //视频房白名单
        if (HResultStatus.Fail === list[4]) {
            require("../ErrorStatusModel").default.showTips(HResultStatus.Fail);
            return null;
        }
        const isContainsVideo = list[4] === HResultStatus.Success;

        // 直播信息
        // message LiveInfo {
        // 	required string userId = 1;// 用户id
        // 	required bool isCertification = 2;// 是否实名认证：true是，false否
        // 	required int32 matchmakerStatus = 3;// 红娘/月老状态：-1-无 0-申请中 1-审核通过 2-拒绝 3-取消资格
        // 	required int32 anchorStatus = 4;// 公会签约状态：-1-无 0-待审批签约 1-审核通过 2-审核不通过（包括7天超時） 3-待审批解约 4-解约成功 5-解约不成功 6-主播强制解约
        // 	required int32 certificationSex = 5;// 实名认证时的性别
        // }
        if (HResultStatus.Success != list[5].state) {
            require("../ErrorStatusModel").default.showTips(list[5].state);
            return null;
        }
        if (!list[5].data) {
            require("../ErrorStatusModel").default.showTips(HResultStatus.ERROR_SERVER_DATA_ERROR);
            return null;
        }
        const liveInfo = list[5].data;
        const bAnchorStatus = 1 == liveInfo.anchorStatus;

        //房间类型列表
        if (!list[6]) {
            require("../ErrorStatusModel").default.showTips(HResultStatus.Fail);
            return null;
        }
        // "keys":["icon","id","keyid","type"]
        const roomTypeList = _doParseRoomTypeList(list[6], isContainsFriends, isContainsVideo, bAnchorStatus, makeFriendSwitch);


        const iRoomTypeList = _getRoomTypeList(roomOpenInfo, voiceRoomBackgroundList, recentVoiceRoomBackgroundList, roomTypeList, mapUserId2CuteNumberEntity, normalTypeRandomRoomName);

        let selectIndex = 0;
        for (let i = 0; i < iRoomTypeList.length; ++i) {
            const vo = iRoomTypeList[i];
            if (roomOpenInfo.roomType == vo.id) {
                selectIndex = i;
                break;
            }
        }

        return {
            roomOpenInfo,                   //RoomOpenInfo
            voiceRoomBackgroundList,        // "keys":["animationname","backgroundid","createtime","endtime","id","name","price","starttime","updatetime","valid","visibleroom","weight"]
            recentVoiceRoomBackgroundList,  // "keys":["animationname","backgroundid","createtime","endtime","id","name","price","starttime","updatetime","valid","visibleroom","weight"]
            roomTypeList,                   // "keys":["icon","id","keyid","type"]
            mapUserId2CuteNumberEntity,     // {userId:String -> CS_CuteNumber}
            iRoomTypeList,                  // IRoomType[]
            selectIndex,
        };
    },

    /**
     * 开播
     * @param {IRoomType} iRoomTypeData 
     * @param {String} uploadLogoPath 
     */
    async start(iRoomTypeData, uploadLogoPath) {
        if (!iRoomTypeData) {
            require("../../view/base/ToastUtil").default.showBottom('请选择房间类型!');
            return;
        }

        let permissStatus
        //权限处理
        if (ERoomType.FUN_VIDEO_ROOM == iRoomTypeData.id) {
            //视频交友房
            permissStatus = await require("../PermissionModel").checkVideoRoomPermission();
        } else {
            //
            permissStatus = await require("../PermissionModel").checkAudioRoomPermission();
        }

        if (permissStatus == 'denied') {
            //未授权
            ToastUtil.showCenter('权限拒绝')
            return
        }

        if (permissStatus == 'blocked') {
            //禁止并不再提示
            ToastUtil.showCenter('权限未允许，请去设置打开')
            return
        }

        //是否限制开播，还需要增加用户类型（访客）
        if (UserInfoCache.phoneNumber == "") {
            //弹出绑定手机号弹框
            require("../../router/level3_router").showBindPhoneView();
            return;
        }

        if (!iRoomTypeData.roomName) {
            require("../../view/base/ToastUtil").default.showBottom('请输入直播标题！');
            return;
        }

        //埋点处理
        //不做了。。。。

        let bgId = iRoomTypeData.background ? iRoomTypeData.background.backgroundid : "";
        // if (ERoomType.FUN_VIDEO_ROOM != iRoomTypeData.id && tempRoomBackground) {
        //     //非视频交友房
        //     bgId = tempRoomBackground.backgroundid;
        // }

        //敏感词检查
        let roomName = await require("../staticdata/StaticDataModel").checkSensitiveWordByOfficial(iRoomTypeData.roomName);
        roomName = iRoomTypeData.roomName
        if (null === roomName) {
            require("../ErrorStatusModel").default.showTips(HResultStatus.Fail);
            return;
        } else if (true === roomName) {
            require("../../view/base/ToastUtil").default.showBottom('当前内容含有不规范内容');
            return;
        }


        //开播:返回房间ID CommonResult.StringResult
        // message start {
        //     required int32 type = 1;//分类
        //     required string roomName = 2;//房间名
        //     optional string bg = 3;//背景ID
        //     optional bool logo = 4;//是否修改头图
        //     optional string roomId = 5;//房间ID
        // }

        let vo
        if (iRoomTypeData.notice && iRoomTypeData.notice.length > 0) {
            vo = {
                type: iRoomTypeData.id,
                roomName: roomName,//iRoomTypeData.roomName,
                bg: bgId,
                logo: Boolean(uploadLogoPath),
                roomId: iRoomTypeData.roomId,
                notic: iRoomTypeData.notice,
            }
        } else {
            vo = {
                type: iRoomTypeData.id,
                roomName: roomName,//iRoomTypeData.roomName,
                bg: bgId,
                logo: Boolean(uploadLogoPath),
                roomId: iRoomTypeData.roomId,
            }
        }

        let res = await require("../ServerCmd").RoomCmd_start(vo);
        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return;
        }
        //单个字符串数据
        // message StringResult {
        // 	required string data = 1;
        // }
        if (!res.data || !res.data.data) {
            require("../ErrorStatusModel").default.showTips(HResultStatus.ERROR_SERVER_DATA_ERROR);
            return;
        }
        const roomId = res.data.data;

        if (uploadLogoPath) {
            require("../../model/UploadModel").default.uploadRoomImage(uploadLogoPath, roomId);
        }

        require('./RoomModel').getRoomDataAndShowView(roomId);
    },
};

export default ReadyToStartBroadcastingModel;