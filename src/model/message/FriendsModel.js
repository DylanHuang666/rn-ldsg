import HResultStatus from "../../hardcode/HResultStatus";
import { EUserDataType } from "../../hardcode/EUserDataType";
import UserInfoModel from "../userinfo/UserInfoModel";

const FriendsModel = {

    /**
     * 获取好友列表
     * @param {int} type 1关注列表,2粉丝列表,3好友列表
     */
    async getFriends(type) {

        //获取好友列表:返回UserResult.FriendList
        // message getFriendList {
        // required int32 type = 1;//1关注列表,2粉丝列表,3好友列表
        // }
        const result = await require("../ServerCmd").MyCmd_getFriendList({
            type,
        })
        if (HResultStatus.Success != result.state) {
            require("../../model/ErrorStatusModel").default.showTips(result.state)
            return []
        }

        if (!result.data || !result.data.userIds) {
            return []
        }

        //粉丝,关注,好友数据
        // message FriendList {
        // 	repeated string userIds = 1;//玩家ID
        // }


        //获得玩家信息数据 返回 UserResult.UserInfoList
        // message getUserInfoList {
        // 	repeated string userIds = 1;//玩家ID列表
        // 	required int64 type = 2;//获取数据组合(见EUserDataType)
        // }
        let dataType = EUserDataType.NICKNAME + EUserDataType.ThirdIconurl + EUserDataType.SEX_ANG_AGE + EUserDataType.LOGOTIME + EUserDataType.FRIENDSTATUS + EUserDataType.POSITION + EUserDataType.ROOMDATA + EUserDataType.SLOGAN;
        const result2 = await require("../ServerCmd").MyCmd_getUserInfoList({
            userIds: result.data.userIds,
            type: dataType,
        })
        // console.log("获取数据组合", dataType);

        if (HResultStatus.Success != result2.state) {
            require("../../model/ErrorStatusModel").default.showTips(result.start)
            return []
        }

        //用户数据列表(动态数据组合,可根据前端拉取不同数据而定)
        // message UserInfoList {
        // 	repeated UserInfo list = 1;
        // }
        if (!result2.data || !result2.data.list){
            return []
        }
        //大v配置
        let vipIds = await UserInfoModel.getVipAuthentication()

        result2.data.list.forEach(element => {
            element.isBigV = !!vipIds[element.userId];
            element.key = element.userId;
        });
        return result2.data.list;
    }
}


export default FriendsModel;