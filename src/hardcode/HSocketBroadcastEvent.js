/**
 * socket广播枚举
 */

export const getEventName = cmdId => {
	return `SOCK_BRO_${cmdId}`;
}

// CommonResultCommonBroadcast
export const SOCK_BRO_CommonResultCommonBroadcast = 'SOCK_BRO_2026';
// ModelEvent.addEvent(null, SOCK_BRO_CommonResultCommonBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_CommonResultCommonBroadcast, this.onResult)

// message CommonBroadcast {
// 	required int32 type = 1;//广播类型:1头橡框,2活动跑道
// 	repeated string params = 2;//参数列表  类型1:[头象模框ID]
// }



//------------------------------------------------------------------------



//BroadcastResultRefreshRoomBanner 刷新房间banner
export const SOCK_BRO_BroadcastResultRefreshRoomBanner = 'SOCK_BRO_3099';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultRefreshRoomBanner, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultRefreshRoomBanner, this.onResult)



//------------------------------------------------------------------------




//RoomResultFriendRoomStageBroadcast 交友房间环节广播
export const SOCK_BRO_RoomResultFriendRoomStageBroadcast = 'SOCK_BRO_3087';
// ModelEvent.addEvent(null, RoomResultFriendRoomStageBroadcast, this.onResult)
// ModelEvent.removeEvent(null, RoomResultFriendRoomStageBroadcast, this.onResult)

// message FriendRoomStageBroadcast {
// 	optional FriendRoomData friendRoomData = 1; //交友房数据
// 	repeated FriendMatchData matchDatas = 2; //匹配用户信息(仅当stage=3时有数据) 
// }


//------------------------------------------------------------------------




//RoomResultRoomActionBroadcast 房间操作通知
export const SOCK_BRO_RoomResultRoomActionBroadcast = 'SOCK_BRO_3015';
// ModelEvent.addEvent(null, SOCK_BRO_RoomResultRoomActionBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_RoomResultRoomActionBroadcast, this.onResult)

// message RoomActionBroadcast {
// 	required string roomId = 1;//房间ID	
// 	required int32 actType = 2;//操作类型:见ERoomActionType
// 	required string userId = 3;//操作者ID
// 	required string targetId = 4;//操作对象
// 	required int32 position = 5;//mic的位置(针对上锁,解锁,邀请好友)；actType为25、28，此字段代表pc模式，0代表app，1代表pc
// 	optional string param = 6;//扩展参数
// 	optional int32 mainType = 7;//房间类型
// 	optional string nickName = 8;//操作者昵称
// 	optional int32 sex = 9;//操作者性别
// 	optional string targetNickName = 10;//被操作者昵称
// 	optional int32 targetSex = 11;//被操作者昵称性别
// }


//------------------------------------------------------------------------



//RoomResultEnterRoomBroadcast 用户进入房间通知
export const SOCK_BRO_RoomResultEnterRoomBroadcast = 'SOCK_BRO_3013';
// ModelEvent.addEvent(null, SOCK_BRO_RoomResultEnterRoomBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_RoomResultEnterRoomBroadcast, this.onResult)

// message EnterRoomBroadcast {
// 	required string roomId = 1;//房间ID
// 	required int32 mainType = 2;//房间类型
// 	required UserResult.UserBase base = 3;//用户基本信息
// 	optional int32 onlineNum = 4;//在线成员数	
// 	required int32 index = 5;//位置
// 	optional string carId = 6;//坐驾ID
// 	optional int32 charmLv = 7;//魅力等级
// 	optional int32 contributeLv = 8;// 财富等级	
// 	optional bool openMirror = 9;//是否开启镜像
// 	optional int32 identity = 10;// 1-普通用户，2-vip，3-富豪
// 	optional int32 source = 11;//来源 1：寻友 
// 	optional int64 loginTime = 12;//登陆房间时间
// 	optional bool showCar = 13;// 是否播放座驾动画
// 	optional int32 jobId = 14;//职位
// 	optional bool isGuardian = 15;// 是否是守护团成员，true是，false不是
// 	optional int32 guardianLv = 17;// 用户在守护团的等级
// 	optional int32 cardType = 18;//用户贵宾卡类型	
// }





//------------------------------------------------------------------------



//RoomResultLeaveRoomBroadcast 用户离开房间通知
export const SOCK_BRO_RoomResultLeaveRoomBroadcast = 'SOCK_BRO_3014';
// ModelEvent.addEvent(null, SOCK_BRO_RoomResultLeaveRoomBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_RoomResultLeaveRoomBroadcast, this.onResult)

// message LeaveRoomBroadcast {
// 	required string roomId = 1;//房间ID
// 	required int32 mainType = 3;//房间类型
// 	required string userId = 4;//用户ID
// 	required int32 onlineNum = 5;//在线成员数
// }

//------------------------------------------------------------------------


//RoomResultAtRoomUserBroadcast @房间用户的广播
export const SOCK_BRO_RoomResultAtRoomUserBroadcast = 'SOCK_BRO_3010';
// ModelEvent.addEvent(null, SOCK_BRO_RoomResultAtRoomUserBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_RoomResultAtRoomUserBroadcast, this.onResult)

// message AtRoomUserBroadcast {
// 	required string roomId = 1;//房间ID
// 	required string userId = 2;//@你的用户ID
// }

//------------------------------------------------------------------------


//LiveResultLiveRoomSendGiftsBroadcast 房间送礼物广播通知
export const SOCK_BRO_LiveResultLiveRoomSendGiftsBroadcast = 'SOCK_BRO_3076';
// ModelEvent.addEvent(null, SOCK_BRO_LiveResultLiveRoomSendGiftsBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_LiveResultLiveRoomSendGiftsBroadcast, this.onResult)

// message LiveRoomSendGiftsBroadcast {
// 	required UserResult.UserBase fromUserBase = 1;// 送礼用户Id
// 	//required string fromNickName = 2;// 送礼用户昵称
// 	required string giftId = 2;//赠送的礼物ID
// 	required int32 giftNum = 3;//赠送的礼物数量
// 	optional int32 fromCharmLevel = 4;// 送礼用户魅力等级
// 	optional int32 fromContributeLevel = 5;// 送礼用户土豪等级
// 	optional string roomId = 6;//房间ID
// 	repeated LiveRoomGiftReceiverInfo receiverInfos = 7;//房间礼物接收者数据数组
// 	optional int32 groupNum = 8;//礼物分组数量，默认1
// 	optional int32 charm = 9;// 当前房间日贡献值:已无用
// 	optional int32 broadcastType = 10;//播放类型:0默认普通播放,1房间跑道,2全服跑道
// 	optional string roomName = 11;//房间名字(2全服跑道时传值)
// 	optional string boxId = 12;//赠送的宝箱ID
// 	optional int64 contribute = 13;// 当前房间日贡献值
// 	optional bool roomAll = 14;//是否全房间
// 	optional int64 newContribute = 15;// 当前房间日新贡献值(神豪值)
// 	optional int32 price = 16;// 礼物单价(金贝数)
// }

//------------------------------------------------------------------------

//UserResultUpdateAttributes 更新基础属性数据
export const SOCK_BRO_UserResultUpdateAttributes = 'SOCK_BRO_3035';
// ModelEvent.addEvent(null, SOCK_BRO_UserResultUpdateAttributes, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_UserResultUpdateAttributes, this.onResult)

// message UpdateAttributes {
// 	repeated int32 attrIds = 1;//属性ID列表
// 	repeated int64 attrValues = 2;//属性值列表
// }






//------------------------------------------------------------------------

//RoomResultRecreationBroadcast 娱乐玩法/魔法表情广播通知
export const SOCK_BRO_RoomResultRecreationBroadcast = 'SOCK_BRO_3020';
// ModelEvent.addEvent(null, SOCK_BRO_RoomResultRecreationBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_RoomResultRecreationBroadcast, this.onResult)

// message RecreationBroadcast {
//     required string roomId = 1;//房间id
//     required string userId = 2;//触发的用户id
//     required string recreationId = 3;//配置id
//     repeated int32 results = 4;//结果
// }

//------------------------------------------------------------------------

//BroadcastResultChangeContributeKing 土豪王改变同步推送通知
export const SOCK_BRO_BroadcastResultChangeContributeKing = 'SOCK_BRO_2054';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultChangeContributeKing, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultChangeContributeKing, this.onResult)

// message ChangeContributeKing {
// 	required UserResult.UserBase base = 1;//土豪用户信息
// 	required bool room = 2;//是否房间土豪:true为房间,false为全服 
// }

//------------------------------------------------------------------------

//BroadcastResultChangeCharmKing 魅力王改变同步推送通知
export const SOCK_BRO_BroadcastResultChangeCharmKing = 'SOCK_BRO_3128';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultChangeCharmKing, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultChangeCharmKing, this.onResult)

// message ChangeCharmKing {
// 	required UserResult.UserBase base = 1;//魅力用户信息
// 	required bool room = 2;//是否房间魅力:true为房间,false为全服 
// }

//------------------------------------------------------------------------

//RoomResultChangeRoomType 广播房间类型改变，更新房间模板
export const SOCK_BRO_RoomResultChangeRoomType = 'SOCK_BRO_3089';
// ModelEvent.addEvent(null, SOCK_BRO_RoomResultChangeRoomType, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_RoomResultChangeRoomType, this.onResult)

// message ChangeRoomType {
// 	required int32 type = 1;//新的房间类型
// }

//------------------------------------------------------------------------

//MessageResultShowMessageBroadcast
export const SOCK_BRO_MessageResultShowMessageBroadcast = 'SOCK_BRO_2037';
// ModelEvent.addEvent(null, SOCK_BRO_MessageResultShowMessageBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_MessageResultShowMessageBroadcast, this.onResult)

// message ShowMessageBroadcast {
// 	optional string msgId = 1;//消息ID
// 	repeated string msgParams = 2;//消息内容参数
// }



//------------------------------------------------------------------------

//BroadcastResultUpdateDataVersion 更新静态数据版本号
export const SOCK_BRO_BroadcastResultUpdateDataVersion = 'SOCK_BRO_2009';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultUpdateDataVersion, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultUpdateDataVersion, this.onResult)

// message UpdateDataVersion {
// 	required string tableName = 1;//表名
// 	required int32 version = 2;//版本号
// }

//------------------------------------------------------------------------

//BroadcastResultSystemAction 系统操作同步:具体看state
export const SOCK_BRO_BroadcastResultSystemAction = 'SOCK_BRO_2011';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultSystemAction, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultSystemAction, this.onResult)

// message SystemAction {
// 	required int32 state = 1;//见状态码
// }

//------------------------------------------------------------------------


//NotificationResultNewNoteBroadcast 互动新通知(触发小红点)
export const SOCK_BRO_NotificationResultNewNoteBroadcast = 'SOCK_BRO_3047';
// ModelEvent.addEvent(null, SOCK_BRO_NotificationResultNewNoteBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_NotificationResultNewNoteBroadcast, this.onResult)

//------------------------------------------------------------------------

//BroadcastResultUpdateFriends 更新粉丝数
export const SOCK_BRO_BroadcastResultUpdateFriends = 'SOCK_BRO_2012';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultUpdateFriends, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultUpdateFriends, this.onResult)

// message UpdateFriends {
// 	required int32 friendsCount = 1;
// }

//------------------------------------------------------------------------

//BroadcastResultUpdateFriend 加好友广播，不是粉丝
export const SOCK_BRO_BroadcastResultUpdateFriend = 'SOCK_BRO_3091';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultUpdateFriend, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultUpdateFriend, this.onResult)

// message UpdateFriend {
// 	required string userId = 1;// 加好友id
// 	required string friendId = 2;// 被加好友id
// 	required bool action = 3;// true加好友，false取消好友
// }

//------------------------------------------------------------------------

//BroadcastResultUpdateUserInfo 更新用户信息
export const SOCK_BRO_BroadcastResultUpdateUserInfo = 'SOCK_BRO_2010';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultUpdateUserInfo, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultUpdateUserInfo, this.onResult)

// message UpdateUserInfo {
// 	required string userId = 1;//用户ID
// 	required string dataType = 2;//数据字段logoTime,nickName,sex
// 	required string value = 3;//最新值,要根据不同的信息转数据类型
// }


//------------------------------------------------------------------------

//MomentResultMomentBroadCast 有关动态的广播
export const SOCK_BRO_MomentResultMomentBroadCast = 'SOCK_BRO_3053';
// ModelEvent.addEvent(null, SOCK_BRO_MomentResultMomentBroadCast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_MomentResultMomentBroadCast, this.onResult)


// message MomentBroadCast {
//     required string id = 1;
//     required string userId = 2; //用户
//     required int32 operation = 3; //操作 1:删除
// }

//------------------------------------------------------------------------

//ActivityResultBroadcastTaskAward 广播任务完成领取奖励
export const SOCK_BRO_ActivityResultBroadcastTaskAward = 'SOCK_BRO_2004';
// ModelEvent.addEvent(null, SOCK_BRO_ActivityResultBroadcastTaskAward, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_ActivityResultBroadcastTaskAward, this.onResult)

// message BroadcastTaskAward {
// 	required string taskId = 1;//任务ID
// }


//------------------------------------------------------------------------

//RoomResultRoomInvite 房间邀请信息
export const SOCK_BRO_RoomResultRoomInvite = 'SOCK_BRO_3081';
// ModelEvent.addEvent(null, SOCK_BRO_RoomResultRoomInvite, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_RoomResultRoomInvite, this.onResult)

// message RoomInvite {
// 	required UserResult.UserBase inviter = 1;//邀请人信息
// 	optional string constellation = 2;//邀请人星座
// 	optional string roomId = 3;//邀请人所在房间
// 	optional int32 roomType = 4;//邀请人所在房间子类型(6:视频房)
// 	optional UserResult.UserBase boyBase = 5;//视频房男mic位用户(空为没有人)
// 	optional UserResult.UserBase girlBase = 6;//视频房女mic位用户(空为没有人)
// }


//------------------------------------------------------------------------

//RoomResultBreakInvite 打断邀请
export const SOCK_BRO_RoomResultBreakInvite = 'SOCK_BRO_3082';
// ModelEvent.addEvent(null, SOCK_BRO_RoomResultBreakInvite, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_RoomResultBreakInvite, this.onResult)

// message BreakInvite {
// 	required int32 reason = 1;//中断理由:1房主中断,2对方拒绝,3超时中断
// 	required string targetId = 2;
// }

//------------------------------------------------------------------------

//BroadcastResultRedPoint 系统红点通知
export const SOCK_BRO_BroadcastResultRedPoint = 'SOCK_BRO_3096';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultRedPoint, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_RoomResultBreakInvite, this.onResult)

// message RedPoint {
// 	required int32 type = 1;//红点类型RedPointType:1.包裹礼物;2.红包;3.勋章
// }

//------------------------------------------------------------------------

//UserResultUserServiceBroadcast 用户服务广播通知
export const SOCK_BRO_UserResultUserServiceBroadcast = 'SOCK_BRO_3036';
// ModelEvent.addEvent(null, SOCK_BRO_UserResultUserServiceBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_UserResultUserServiceBroadcast, this.onResult)

// message UserServiceBroadcast {
// 	required int32 serviceType = 1;//通知类型 1-用户登陆限制
// 	required string data = 2;//通知内容
// }

//------------------------------------------------------------------------

//BroadcastResultPullBlackBroadcast 拉黑广播
export const SOCK_BRO_BroadcastResultPullBlackBroadcast = 'SOCK_BRO_3090';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultPullBlackBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultPullBlackBroadcast, this.onResult)

// message PullBlackBroadcast {
// 	required string userId = 1;// 拉黑人
// 	required string targetId = 2;// 被拉黑人
// 	required bool action = 3;// 是否拉黑 true是，false否
// 	required int32 blackStatus = 4;// targetId 与 userId的拉黑状态
// }



//------------------------------------------------------------------------

//BagResultSmashEggResultBroadcast 砸蛋结果广播
export const SOCK_BRO_BagResultSmashEggResultBroadcast = 'SOCK_BRO_3092';
// ModelEvent.addEvent(null, SOCK_BRO_BagResultSmashEggResultBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BagResultSmashEggResultBroadcast, this.onResult)

// message SmashEggResultBroadcast {
// 	optional UserResult.UserBase smashUserBase = 1;// 砸蛋用户信息
// 	repeated ReceiveGiftInfo giftList = 2;//中奖礼物列表
// 	optional int32 broadcastType = 3;//播放类型:0公屏显示,1房间跑道,2全服跑道,3:全服公屏流水
// 	optional int32 action = 4;//砸蛋动作(0:自动砸,1:单砸,10:十砸,100:百砸)	
//     optional string eggType = 5; //蛋的类型(1:铁蛋 2:银蛋 3:金蛋) 
//     optional string roomId = 6; //砸蛋所在房间Id	
//     optional string roomName = 7; //砸蛋所在房间名称
// }


//------------------------------------------------------------------------

//FishResultSyncFishData 同步钓鱼阶段数据
export const SOCK_BRO_FishResultSyncFishData = 'SOCK_BRO_3171';
// ModelEvent.addEvent(null, SOCK_BRO_FishResultSyncFishData, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_FishResultSyncFishData, this.onResult)

// message SyncFishData {
// 	required int32 step = 1;//当前阶段:1下注,2钓鱼,3结算中,4风控结束
// 	required int32 stepRemain = 2;//当前阶段下剩余时间ms
// 	optional RoundData roundData = 3;//钓鱼结果数据step=2+3
// }

//------------------------------------------------------------------------

//FishResultSyncSendGift 同步送礼记录
export const SOCK_BRO_FishResultSyncSendGift = 'SOCK_BRO_3170';
// ModelEvent.addEvent(null, SOCK_BRO_FishResultSyncSendGift, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_FishResultSyncSendGift, this.onResult)

// message SyncSendGift {
// 	required UserResult.UserBase sendUser = 1;//送礼者
// 	required int32 hitNum = 2;//连击数(默认1)
// }



//------------------------------------------------------------------------

//BroadcastResultChangeToBlack 转为黑名单
export const SOCK_BRO_BroadcastResultChangeToBlack = 'SOCK_BRO_3098';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultChangeToBlack, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultChangeToBlack, this.onResult)


//------------------------------------------------------------------------


//RoomResultmodifyGroupBroadcast 房主修改群聊的广播
export const SOCK_BRO_RoomResultmodifyGroupBroadcast = 'SOCK_BRO_3155';
// ModelEvent.addEvent(null, SOCK_BRO_RoomResultmodifyGroupBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_RoomResultmodifyGroupBroadcast, this.onResult)

// message modifyGroupBroadcast {
// 	required string roomId = 1;//房间ID
// 	required string groupId = 2;//修改后的群聊ID
// }


//------------------------------------------------------------------------

//GroupResultGroupBreakBroadcast 群被解散，暂时用于通知房间的群设置
export const SOCK_BRO_GroupResultGroupBreakBroadcast = 'SOCK_BRO_3160';
// ModelEvent.addEvent(null, SOCK_BRO_GroupResultGroupBreakBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_GroupResultGroupBreakBroadcast, this.onResult)

// message GroupBreakBroadcast {
// 	required string groupId = 1;// 群id
// }

//------------------------------------------------------------------------

//BroadcastResultRankInfoBroadcast （当前）榜单信息，目前就小时榜有
export const SOCK_BRO_BroadcastResultRankInfoBroadcast = 'SOCK_BRO_3173';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultRankInfoBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultRankInfoBroadcast, this.onResult)

// message RankInfoBroadcast {
// 	required RankResult.TargetRankInfo rank = 1;// 榜单信息
// }


//------------------------------------------------------------------------

//BroadcastResultResetDayData 通知每日重置数据:如排行榜
export const SOCK_BRO_BroadcastResultResetDayData = 'SOCK_BRO_2053';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultResetDayData, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultResetDayData, this.onResult)

// message ResetDayData {
// 	required bool day = 1;//日重置
// 	required bool week = 2;//周重置
// 	required bool month = 3;//月重置
// 	optional bool hour = 4;// 小时重置
// }


//------------------------------------------------------------------------

//RoomResultSyncMicTime 同步mic位倒计时时间(暂时只相亲视频房用到)
export const SOCK_BRO_RoomResultSyncMicTime = 'SOCK_BRO_3177';
// ModelEvent.addEvent(null, SOCK_BRO_RoomResultSyncMicTime, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_RoomResultSyncMicTime, this.onResult)


// message SyncMicTime {
//     required int32 position = 1;//麦位(男嘉宾为1)
//    required int64 micOverTime = 2;//倒计时结束时间的时间戳
// }


//------------------------------------------------------------------------

//CardResultCardUpLevelBroadcast 升级(获得)卡广播
export const SOCK_BRO_CardResultCardUpLevelBroadcast = 'SOCK_BRO_3182';
// ModelEvent.addEvent(null, SOCK_BRO_CardResultCardUpLevelBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_CardResultCardUpLevelBroadcast, this.onResult)

// message CardUpLevelBroadcast {
// 	optional string userId = 1; //用户Id
// 	optional string nickName = 2; //用户昵称
// 	optional int32 contributeLv = 3;//土豪等级
// 	optional int32 type = 4; //卡类型(3:星耀 2:钻石 1:白银)
// 	optional int32 sex = 5; //用户性别
// 	optional int32 status = 6; //卡状态(1:有效 2:过期 3:已撤销)
// }


//------------------------------------------------------------------------

//BroadcastResultSyncUploadLog 通知客户端上传日志
export const SOCK_BRO_BroadcastResultSyncUploadLog = 'SOCK_BRO_3172';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultSyncUploadLog, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultSyncUploadLog, this.onResult)

// message SyncUploadLog {
// 	required string logKey = 1;
// }


//------------------------------------------------------------------------

//BroadcastResultCrossRoomMatchingBroadcast 跨房pk匹配中广播，匹配成功
export const SOCK_BRO_BroadcastResultCrossRoomMatchingBroadcast = 'SOCK_BRO_3196';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultCrossRoomMatchingBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultCrossRoomMatchingBroadcast, this.onResult)

// message CrossRoomMatchingBroadcast {
// 	required string roomId = 1;// 房间id
// 	required int32 match = 2;// 匹配，-1匹配失败，0匹配中
// }


//------------------------------------------------------------------------

//BroadcastResultCrossRoomMatchBroadcast 跨房pk匹配成功广播
export const SOCK_BRO_BroadcastResultCrossRoomMatchBroadcast = 'SOCK_BRO_3192';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultCrossRoomMatchBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultCrossRoomMatchBroadcast, this.onResult)

// message CrossRoomMatchBroadcast {
// 	required string roomId = 1;// 当前房间id
// 	required int32 star = 2;// 当前房间段位，星数
// 	required RoomResult.BaseRoomInfo targetRoom = 3;// pk对象房间信息
// 	required int32 targetStar = 4;// pk对象房间段位，星数
// 	required int64 startTime = 5;// 开始时间，时间戳
// 	required int64 endTime = 6;// 结束时间，时间戳
// 	required int64 addRatioTime = 7;// pk值加成开始时间，与endTime一样则是无加成时间，时间戳
// 	required double addRatio = 8;// 加成倍率
// }

//------------------------------------------------------------------------

//BroadcastResultCrossRoomResultBroadcast 跨房pk结果广播
export const SOCK_BRO_BroadcastResultCrossRoomResultBroadcast = 'SOCK_BRO_3193';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultCrossRoomResultBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultCrossRoomResultBroadcast, this.onResult)

// message CrossRoomResultBroadcast {
// 	required string roomId = 1;// 当前房间id
// 	required int32 oriStar = 2;// 原段位，星数
// 	required int32 win = 3;// 输赢，-1输，0平局，1赢
// 	repeated string mvps = 4;// 前3贡献者，第一个为mvp
// }


//------------------------------------------------------------------------

//BroadcastResultCrossRoomPkBroadcast 跨房pk过程广播，pk双方都会收到广播
export const SOCK_BRO_BroadcastResultCrossRoomPkBroadcast = 'SOCK_BRO_3194';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultCrossRoomPkBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultCrossRoomPkBroadcast, this.onResult)

// message CrossRoomPkBroadcast {
// 	required string roomId = 1;// 变化的房间id
// 	required int64 totalScore = 2;// pk总值
// 	required int64 addScore = 3;// 当次增加的值
// 	required int64 baseScore = 4;// 当次增加的原值
// 	required double addRatio = 5;// 当次加成倍率
// 	required bool needUpdateMvp = 6;// 是否需要更新贡献榜前3，true更新，false不更新
// 	repeated RoomResult.CrossRoomMvpInfo mvps = 7;// 贡献榜前3，needUpdateMvp=true时返回
// }



//------------------------------------------------------------------------

//BroadcastResultCrossRoomAddRatioBroadcast  跨房pk，进入加成阶段广播
export const SOCK_BRO_BroadcastResultCrossRoomAddRatioBroadcast = 'SOCK_BRO_3195';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultCrossRoomAddRatioBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultCrossRoomAddRatioBroadcast, this.onResult)

// message CrossRoomAddRatioBroadcast {
// 	required string roomId = 1;// 房间id
// 	required int64 addDuration = 2;// 加成时长，单位秒
// 	required double addRatio = 3;// 加成倍率
// 	required UserResult.UserBase user = 4;// 获得加成的用户
// }



//------------------------------------------------------------------------

//BroadcastResultEnterImGroupBroadcast
export const SOCK_BRO_BroadcastResultEnterImGroupBroadcast = 'SOCK_BRO_3185';
// ModelEvent.addEvent(null, SOCK_BRO_BroadcastResultEnterImGroupBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_BroadcastResultEnterImGroupBroadcast, this.onResult)

// message EnterImGroupBroadcast {
// 	required int32 type = 1;// 群自定义类型，1-官方消息
// 	required string groupId = 2;// 群id
// }


//------------------------------------------------------------------------
//RechargeResultOrderPayTimeOutBroadcast 订单支付超时通知
export const SOCK_BRO_RechargeResultOrderPayTimeOutBroadcast = 'SOCK_BRO_2076';
// ModelEvent.addEvent(null, SOCK_BRO_RechargeResultOrderPayTimeOutBroadcast, this.onResult)
// ModelEvent.removeEvent(null, SOCK_BRO_RechargeResultOrderPayTimeOutBroadcast, this.onResult)

// message OrderPayTimeOutBroadcast {
// 	optional string orderId =1;//订单号
// 	optional string desc = 2;//通知内容
// }


export const SOCK_BRO_BroadcastResultPublicChatSendMessageBroadcast = 'SOCK_BRO_3216'

/**
 * //陪聊广播
//status 0:发起呼叫 1:主播接听 2:主播拒绝 3:用户取消呼叫 4:呼叫超时
//       5:一方退出陪聊 6:用户时长到(余额不足)退出陪聊 9:陪聊房内每分钟信息广播
message SkillChatBroadcast {
	required int32 status = 1;//状态	
	optional string callerId = 2;//呼叫人Id
	optional string anchorId = 3;//主播Id
	optional UserResult.UserBase caller = 4;//呼叫人信息
	optional UserResult.UserBase anchor = 5;//主播信息	
	optional string roomId = 6;//陪聊房Id
	optional int32 chatTime = 7;//陪聊时长(秒)
	optional int32 totalMoney = 8;//主播分成前收入(分)
	optional int32 anchorMoney = 9;//主播分成后收入(分)
	optional int32 ltMinute = 10;//呼叫人余额不足x分钟
}
 */
export const SOCK_BRO_BroadcastResultSkillChatBroadcast = 'SOCK_BRO_3215'

/**
 * //有关动态的广播
message MomentBroadCast {
    required string id = 1;
    required string userId = 2; //用户
    required int32 operation = 3; //操作 1:删除
}
 */
export const SOCK_BRO_BroadcastMomentBroadCast = 'SOCK_BRO_3047'

//锦鲤砸蛋活动结果广播
// message SmashEggActivityResultBroadcast {
// 	optional UserResult.UserBase smashUserBase = 1;// 砸蛋用户信息
// 	repeated ReceiveGiftInfo giftList = 2;//活动礼物列表,一般只有一个
// 	optional int32 broadcastType = 3;//播放类型:0公屏显示,1房间跑道,2全服跑道,3:全服公屏流水
// 	optional int32 action = 4;//砸蛋动作(0:自动砸,1:单砸,10:十砸,100:百砸,暂不用)
//     optional string eggType = 5; //蛋的类型(1:铁蛋 2:银蛋 3:金蛋) 
//     optional string roomId = 6; //砸蛋所在房间Id	
//     optional string roomName = 7; //砸蛋所在房间名称
//     optional int32 activityType = 8; //活动类型,目前只有锦鲤活动(1:锦鲤活动)
//     optional int32 activityMode = 9; //活动模式(锦鲤活动 1:抽一送一,2:返还固定金币 3:返还砸蛋总消耗比例金币)
//     optional int32 activityValue = 10; //活动获得金币值(锦鲤活动:抽一送一就是礼物的价值,其他的就是返还金币数量)

// }
export const SOCK_BRO_RoomResultKoiFishBroadcast = 'SOCK_BRO_3227'




























































