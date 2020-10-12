

/**
 * 排麦面板model
 */

import { ERoomModify, ERoomType, ERoomActionType } from '../../hardcode/ERoom';
import HResultStatus from '../../hardcode/HResultStatus';
import RoomInfoCache from '../../cache/RoomInfoCache';
import UserInfoCache from '../../cache/UserInfoCache';
import ToastUtil from '../../view/base/ToastUtil';

const MicQueModel = {

    //更新房间模式:0自由,1非自由
    async onRoomMode(roomMode) {
        const result = await require('./RoomModel').default.modifyRoom(ERoomModify.UPDATE_ROOM_MODE_KEY, roomMode)
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return false
        }
        return true//更新成功
    },

    //随机上麦
    async randomUpMic() {
        if (!RoomInfoCache.MicQues || RoomInfoCache.MicQues.length == 0) {
            ToastUtil.showCenter('暂无人排队上麦')
            return false
        }

        //随机一个用户
        const index = Math.round(Math.random() * (RoomInfoCache.MicQues.length - 1))

        const user = RoomInfoCache.MicQues[index]
        if (!user) {
            return
        }

        //查询当前空余麦位
        let actionIndex = -1
        RoomInfoCache.roomData.infos.forEach((element, index) => {
            if (actionIndex < 0 && !element.lock && !element.base) {
                actionIndex = index
            }
        });
        if (actionIndex == -1) {
            ToastUtil.showCenter('没有空麦位')
            return false
        }
        await require('./RoomModel').default.action(ERoomActionType.MIC_UP, user.userId, actionIndex + 1, '')
    },

    //清空排麦列表
    async cleanList() {
        await require('./RoomModel').default.action(ERoomActionType.MIC_QUE_DOWN, '', 0, '')
    },

    //加入排麦
    async joinMicQue() {
        const permissStatus = await require('../../model/PermissionModel').checkAudioRoomPermission();
        if (permissStatus == 'denied' || permissStatus == 'blocked') {
            ToastUtil.showCenter('麦克风权限未打开')
            return
        }
        await require('./RoomModel').default.action(ERoomActionType.MIC_UP, UserInfoCache.userId, 0, '')
    },

    //取消排麦
    async cancelMicQue() {
        await require('./RoomModel').default.action(ERoomActionType.MIC_QUE_DOWN, UserInfoCache.userId, 0, '')
    },


    //移除排麦用户
    async removeUser(userId) {
        await require('./RoomModel').default.action(ERoomActionType.MIC_QUE_DOWN, userId, 0, '')
    },


    //抱上麦
    async upMicUser(userId) {
        //查询当前空余麦位
        let actionIndex = -1
        RoomInfoCache.roomData.infos.forEach((element, index) => {
            if (actionIndex < 0 && !element.lock && !element.base) {
                actionIndex = index
            }
        });
        if (actionIndex == -1) {
            ToastUtil.showCenter('没有空麦位')
            return false
        }

        await require('./RoomModel').default.action(ERoomActionType.MIC_UP, userId, actionIndex + 1, '')
    },

    //置顶（自由连线模式时用）
    async toTopUser(userId) {
        const result = await require('./RoomModel').default.action(ERoomActionType.MIC_QUE_UP, userId, 0, '')
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return false
        }
        return true
    },

    //查询自己是否在排麦列表
    selfInMicQue() {
        let vo
        RoomInfoCache.MicQues.forEach(element => {
            if (element && element.userId == UserInfoCache.userId) {
                vo = element
            }
        })
        return vo
    }

}

export default MicQueModel;