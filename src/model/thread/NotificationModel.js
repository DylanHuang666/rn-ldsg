/**
 * 消息（点赞，评论）盒子逻辑
 */
'use strict';

import HResultStatus from "../../hardcode/HResultStatus";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_UPDATE_NOTIFICATION } from "../../hardcode/HGlobalEvent";

let sm_notificationList = {}
let sm_bLoadnotification = {}

const NotificationModel = {
    /**
     * 
     * @param {*} type 
     * @param {*} bRefresh 
     * @param {*} size 
     */
    async listNotification(type, bRefresh, size = 15) {
        /**
         * //获取通知列表 结果：NotificationResult.NotificationVOS
        message listNotification {
            required string lastId = 1; // 最后一条dataID 没有则传空字符串
            required int32 size = 2; //分页条数
            required int32 type = 3;//类型1评论;2点赞
        }
         */
        if (sm_bLoadnotification[type]) {
            return sm_notificationList[type] || []
        }

        //请求中
        sm_bLoadnotification[type] = true
        const length = sm_notificationList[type] ? sm_notificationList[type].length : 0
        const lastId = bRefresh ? "" : sm_notificationList[type][length - 1].id;

        const res = await require("../ServerCmd").NotificationCmd_listNotification({
            type,
            lastId,
            size,
        });

        if (!sm_notificationList[type] || bRefresh) {
            sm_notificationList[type] = []
        }

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            sm_bLoadnotification[type] = false

            return sm_notificationList[type]
        }

        if (!res.data || !res.data.noteVO) {
            sm_bLoadnotification[type] = false
            return sm_notificationList[type]
        }

        sm_notificationList[type] = sm_notificationList[type].concat(res.data.noteVO)
        sm_bLoadnotification[type] = false
        return sm_notificationList[type]
    },

    /**
     * //阅读通知消息,标记为已读
    message viewNotification {
        repeated string id = 1; //通知id
    }
     * @param {*} id 
     */
    async viewNotification(id) {

        const res = await require("../ServerCmd").NotificationCmd_viewNotification({
            id
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        return true;
    },


    /**
     * //删除通知消息
message delNotification {
    required string id = 1; //通知id
}
     * @param {*} id 
     */
    async delNotification(id) {

        const res = await require("../ServerCmd").NotificationCmd_delNotification({
            id
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        return true;
    },


    /**
     * //删除通知消息
message cleanNotification {
    required int32 type = 1;//类型1评论;2点赞
}
     * @param {*} type 
     */
    async cleanNotification(type) {

        const res = await require("../ServerCmd").NotificationCmd_cleanNotification({
            type
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        ModelEvent.dispatchEntity(null, EVT_UPDATE_NOTIFICATION, null);//刷新评论或点赞
        return true;
    },

    /**
     * //获取未读通知数量,返回CommonResult.IntResult
message getUnreadCount {
	required int32 type = 1;//通知类型:1评论,2点赞
}
     * @param {*} type 
     */
    async getUnreadCount(type) {

        const res = await require("../ServerCmd").NotificationCmd_getUnreadCount({
            type
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return 0
        }
        if (!res.data || !res.data.data) {
            return 0
        }
        return res.data.data;
    },
}

export default NotificationModel;