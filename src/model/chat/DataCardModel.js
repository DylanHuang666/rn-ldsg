import HResultStatus from "../../hardcode/HResultStatus";

const { default: UserInfoCache } = require("../../cache/UserInfoCache");


const DataCardModel = {

    async sendDataCard(targetId) {
        let userDataCardMsg = {
            cardUserId: UserInfoCache.userId,
        }
        require("../../model/chat/ChatModel").sendC2CMessage(targetId, [[4, "userDataCard#" + JSON.stringify(userDataCardMsg)]]);

        this.recordSendDataCard(targetId)
    },

    async recordSendDataCard(toUserId) {
        const result = await require('../ServerCmd').SkillCmd_recordSendDataCard({
            userId: UserInfoCache.userId,
            toUserId
        })
    },

    //判断是否需要发送陪聊资料卡片，7天内只发送一次
    async judgeShouldSendDataCard(toUserId) {

        const result = await require('../ServerCmd').SkillCmd_judgeShouldSendDataCard({
            userId: UserInfoCache.userId,
            toUserId
        })

        if (HResultStatus.Success != result.state) {
            return
        }

        if (result.data.canSendDataCard) {
            this.sendDataCard(toUserId)
        }
    }
}

export default DataCardModel;