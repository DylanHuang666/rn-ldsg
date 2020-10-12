import HResultStatus from '../../hardcode/HResultStatus';
import { ERoomActionType } from '../../hardcode/ERoom';
import { user } from '../../hardcode/skin_imgs/login';

/**
 * 黑名单Model
 */
const BlackListModel = {

    // 获得小黑屋人员列表 UserResult.UserBaseList
    //     message getDarkRoomMemberList {
    //         required string roomId = 1;// 查询的房间id
    // optional int32 index = 2;// 当前已获得的列表长度(每次返回20条，index用于分页)
    // }
    async getRoomBlackList(roomId, index) {
        const result = await require('../ServerCmd').RoomCmd_getDarkRoomMemberList({
            roomId,
            index,
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return
        }

        if (!result || !result.data) {
            return []
        }

        return result.data.list
    },

    // 黑名单 UserResult.BlackInfoList
    // message blackInfoList {
    // 	required int32 type = 1;// 1-拉黑列表 2-被拉黑 3-互相拉黑
    // 	required string lastId = 2;//
    // 	required int32 size = 3;
    // }
    async getBlackList(lastId) {
        const result = await require('../ServerCmd').getBlackList({
            type: 1,
            lastId: lastId,
            size: 20,
        })

        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return []
        }

        // 黑名单
        // message BlackInfoList {
        // 	repeated UserBase list = 1;
        // }
        if (!result.data || !result.data.list) {
            return []
        }
        return result.data.list
    },

    /**
     * 移除黑名单
     */
    _onRemoveBlackList(userId, fnCallback) {
        require('../../model/room/RoomModel').default.action(ERoomActionType.REMOVE_TO_DARK_ROOM, userId, 0, '')
            .then(data => {
                if (data) {
                    //移除成功
                }
                fnCallback && fnCallback(data);
            })
    }
}

export default BlackListModel;