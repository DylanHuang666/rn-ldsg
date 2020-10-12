'use strict'
import RoomInfoCache from "../../cache/RoomInfoCache";
import HResultStatus from "../../hardcode/HResultStatus";
import UserInfoCache from "../../cache/UserInfoCache";
import ToastUtil from "../../view/base/ToastUtil";
import { check } from "react-native-permissions";


const ChatHallModel = {

    async sendPublicMessage(message) {
        //财富等级检测
        const check1 = await require('../staticdata/StaticDataModel').getPublicConfigByIds([1161])
        if (check1[0] === undefined) {
            check1[0] = { value: 5 }
        }
        console.warn(check1[0])
        if (UserInfoCache.userInfo.contributeLv < Number(check1[0].value)) {
            ToastUtil.showCenter('您的财富等级未达标，暂时无法发 布公聊消息哦')
            return false
        }


        //敏感词检测
        let check2 = await require("../staticdata/StaticDataModel").checkSensitiveWordByOfficial(message);
        if ((check2 != null) && (check2 === true)) {
            ToastUtil.showCenter('当前内容含有不规范内容')
            return false
        }

        let vo
        if (RoomInfoCache.roomId) {
            vo = {
                message,
                currentRoomId: RoomInfoCache.roomId
            }
        } else {
            vo = {
                message,
            }
        }

        const result = await require('../ServerCmd').PublicChatCmd_sendPublicMessage(vo)

        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return false
        }

        return true

    },

    async getLatestMessageList(lastId, row) {
        const result = await require('../ServerCmd').PublicChatCmd_getLatestMessageList({
            lastId,
            row,
        })

        if (HResultStatus.Success != result.state) {
            return []
        }

        if (!result.data) {
            return []
        }

        return result.data.list
    }



}

export default ChatHallModel;
