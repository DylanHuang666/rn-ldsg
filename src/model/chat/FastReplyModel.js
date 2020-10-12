'use strict'

import UserInfoCache from '../../cache/UserInfoCache';
import HResultStatus from '../../hardcode/HResultStatus';
import ModelEvent from '../../utils/ModelEvent';
import { EVT_UPDATE_FAST_REPLY } from '../../hardcode/HGlobalEvent';

const FastReplyModel = {

    //添加快捷消息
    async addShortcutMessage(message) {

        let index = 0
        const result1 = await require('../ServerCmd').ShortcutMessageCmd_getShortcutMessageList({
            userId: UserInfoCache.userId,
        })

        if (HResultStatus.Success != result1.state) {
            index = 0
        }

        index = result1.data.list + 1


        const result = await require('../ServerCmd').ShortcutMessageCmd_addShortcutMessage({
            userId: UserInfoCache.userId,
            message: message,
        })

        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return false
        }

        ModelEvent.dispatchEntity(null, EVT_UPDATE_FAST_REPLY, null)
        return true
    },


    //编辑快捷消息
    async modifyShortcutMessage(id, newMessage) {
        const result = await require('../ServerCmd').ShortcutMessageCmd_modifyShortcutMessage({
            userId: UserInfoCache.userId,
            id,
            newMessage,
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return false
        }

        ModelEvent.dispatchEntity(null, EVT_UPDATE_FAST_REPLY, null)
        return true
    },


    //删除快捷消息
    async deleteShortcutMessage(id) {
        const result = await require('../ServerCmd').ShortcutMessageCmd_deleteShortcutMessage({
            userId: UserInfoCache.userId,
            id: id,
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return false
        }

        ModelEvent.dispatchEntity(null, EVT_UPDATE_FAST_REPLY, null)
        return true
    },


    //获取快捷消息列表
    async getShortcutMessageList() {
        const result = await require('../ServerCmd').ShortcutMessageCmd_getShortcutMessageList({
            userId: UserInfoCache.userId,
        })

        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return []
        }

        return result.data.list

    },


    //重排快捷消息
    async sortShortcutMessage(id, sortingNo) {
        const result = await require('../ServerCmd').ShortcutMessageCmd_sortShortcutMessage({
            userId: UserInfoCache.userId,
            id,
            sortingNo
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return false
        }
        ModelEvent.dispatchEntity(null, EVT_UPDATE_FAST_REPLY, null)
        return true
    }


}

export default FastReplyModel;