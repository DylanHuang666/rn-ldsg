import HResultStatus from "../../hardcode/HResultStatus";

//获取财富等级列表
async function _getRichLvList() {
    const result = await require('../../model/staticdata/StaticDataModel').getRichLvList()
    if (!result) {
        require('../ErrorStatusModel').default.showTips(HResultStatus.Fail)
        return []
    }
    return result
}

//获取魅力等级列表
async function _getCharmLvList() {
    const result = await require('../../model/staticdata/StaticDataModel').getCharmLvList()
    if (!result) {
        require('../ErrorStatusModel').default.showTips(HResultStatus.Fail)
        return []
    }
    return result
}

const LevelDescriptionModel = {


    //获得玩家等级 返回 UserResult.UserLevel
    // message getUserLevel {
    // required string userId = 1;//玩家ID
    // }

    //获得玩家等级 返回 UserResult.UserLevel
    async getUserLevel() {
        const result = await require('../ServerCmd').MyCmd_getUserLevel({
            userId: require('../../cache/UserInfoCache').default.userId
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return
        }
        return result.data
    },


    //获取财富等级item
    async getRichLvData(lv) {
        let preLevel = null;//上一级data
        let curLevel = null;//当前data
        let nextLevel = null;//下一级data

        let richList = await _getRichLvList();
        richList.forEach(element => {
            if (element.level == lv) {
                curLevel = element
            } else if (element.level == lv - 1) {
                preLevel = element
            } else if (element.level == lv + 1) {
                nextLevel = element
            }
        });
        return {
            preLevel,
            curLevel,
            nextLevel,
        }
    },

    //获取魅力等级item
    async getCharmLvData(lv) {
        let preLevel = null;//上一级data
        let curLevel = null;//当前data
        let nextLevel = null;//下一级data

        let charmList = await _getCharmLvList();
        charmList.forEach(element => {
            if (element.level == lv) {
                curLevel = element
            } else if (element.level == lv - 1) {
                preLevel = element
            } else if (element.level == lv + 1) {
                nextLevel = element
            }
        });
        return {
            preLevel,
            curLevel,
            nextLevel,
        }
    }


}

export default LevelDescriptionModel;