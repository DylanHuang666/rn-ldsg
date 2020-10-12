import HResultStatus from "../../hardcode/HResultStatus";
import { EUserDataType } from "../../hardcode/EUserDataType";

const OnlineModel = {

    /**
     * // 获取在线真实用户信息列表，返回：UserResult.OnlineUserList
message getOnlineUserInfoList {
	optional int32 sex = 1;// 0-全部，1-男，2-女
	optional int64 loginTime = 2;// 最后一条记录登陆时间
	optional string overLookUserId = 3;// 忽略用户Id
	optional int32 rows = 4;// 查询条数
	optional int32 onlineType = 5;// 最后一条记录在线类型:1在线(不显示登陆时间统一显示刚刚),2离线
}
     */
    async getOnlineUserInfoList(loginTime = 0, onlineType = 1, sex = 0, overLookUserId = "", rows = 15) {
        const result = await require("../ServerCmd").DataCmd_getOnlineUserInfoList({
            sex,
            loginTime,
            overLookUserId,
            rows,
            onlineType,
        })
        if (HResultStatus.Success != result.state) {
            require("../../model/ErrorStatusModel").default.showTips(result.state)
            return []
        }

        if (!result.data || !result.data.list) {
            return []
        }

        /**
         * // 在线用户信息
message OnlineuserInfo {
	required UserBase base = 1;// 用户基本信息
	required int64 loginTime = 2;// 登陆时间	
	optional string position = 3;// 地理位置
	optional string slogan = 4;// 个性化签名
	optional string roomId = 5;
    optional int32 roomStatus = 6;// 房间状态:0未开播,1开播未上锁,2开播上锁
    optional string constellation = 7;//星座 
    optional int32 onlineType = 8;// 在线类型:1在线(不显示登陆时间统一显示刚刚),2离线
    optional int32 roomType = 9;// 房间分类(用于判断是否在相亲视频房)
    optional string roomName = 10;// 房间名称
    optional int32 friendStatus = 11;// 好友状态
}
         */

         return result.data.list;
    }
}


export default OnlineModel;