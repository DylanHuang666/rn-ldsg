/**
 * 认证声优逻辑
 */
'use strict';


import HResultStatus from "../../hardcode/HResultStatus";
import UserInfoCache from "../../cache/UserInfoCache";
import AnnouncerCertificationModel from "./AnnouncerCertificationModel";
import AnnouncerModel, { isAnnouncer } from "../main/AnnouncerModel";


const PhoneRecordModel = {

    /**
     * // 获取通话记录，返回：SkillChatResult.LiveChatList
    message getLiveChatList {
        required string userId = 1;// 用户Id
        optional string lastId = 2;// 每页最后1条记录的Id
        optional int32 row = 3;// 分页条数
        optional bool isAnchor = 4;// 是否主播
    }
     * @param {*} row 
     * @param {*} lastId 
     */
    async getLiveChatList(lastId = "", row = 10, isAnchor) {

        const res = await require("../ServerCmd").SkillChatCmd_getLiveChatList({
            userId: UserInfoCache.userId,
            row,
            lastId,
            isAnchor,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return [];
        }

        if (!res.data || !res.data.logInfo) {
            return [];
        }

        res.data.logInfo.forEach(element => {
            element.key = element.id;
        });

        return res.data.logInfo;
    },
}

export default PhoneRecordModel;