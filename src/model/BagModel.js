import HResultStatus from "../hardcode/HResultStatus";


const BagModel = {

    /**
     * 获得用户钱包数据:返回BagResult.Wallet
     */
    async getWallet() {
        const result = await require("./ServerCmd").BagCmd_getWallet();

        if (HResultStatus.Success != result.state) {
            require("./ErrorStatusModel").default.showTips(result.state)
            return
        }
        //玩家钱包数据
        // message Wallet {
        // 	optional int32 goldShell = 1;//金贝
        // 	optional int32 rabbitCoin = 2;//兔子币
        // }
        return result.data
    }
}

export default BagModel;