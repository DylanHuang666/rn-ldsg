/**
 * 1v1热聊列表逻辑
 */
'use strict';


import HResultStatus from "../../hardcode/HResultStatus";
import UserInfoCache from "../../cache/UserInfoCache";
import AnchorIncomeModel from "../anchorincome/AnchorIncomeModel";
import BagModel from "../BagModel";
import UserInfoModel from "../userinfo/UserInfoModel";
import { getChatterLabel } from "../staticdata/StaticDataModel";
import ToastUtil from "../../view/base/ToastUtil";
import RoomInfoCache from "../../cache/RoomInfoCache";

export async function isAnnouncer(userId = UserInfoCache.userId) {
    let data = await AnnouncerModel.getUserSkillInfo(userId);
    if (!data) {
        return
    }
    return data === HResultStatus.ChattingServiceUserSkillInfoNotExit ? false : true;
}

//要打电话时的人的信息
let info;
function toChatView() {
    if (require("../../router/level2_router").isChatViewExist()) {
        ToastUtil.showCenter("您已在当前页面");
        return
    }
    require("../../router/level2_router").showChatView(info.userId, decodeURI(info.nickName), false);
}

const AnnouncerModel = {

    async getChatterLabel() {
        const tables = await require('../staticdata/StaticDataModel').getChatterLabel();
        if (!tables) {
            require('../ErrorStatusModel').default.showTips(HResultStatus.Fail);
            return [];
        }
        return tables;
    },

    /**
     * //用户技能列表(返回SkillResult.UserSkillList)
message getUserSkillList {
	optional string userId = 1;// 查自己的则不填
}
     * 
     */
    async getUserSkillList(index = 0, type = 1) {

        const res = await require("../ServerCmd").CenterCmd_getSkillUserList({
            userId: UserInfoCache.userId,// 用户Id
            type,   // 技能类型(1:1V1陪聊)
            index,  //分页下标
        });


        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return [];
        }
        if (!res.data || !res.data.userSkills) {
            return [];
        }

        let list = res.data.userSkills;

        const tables = await AnnouncerModel.getChatterLabel();



        list.forEach(element => {
            element.videoPause = false;

            //把自我评价的标签转为文字
            let myLabels = [];
            let myLabelsList = element.labelIds.split(",");
            if (myLabelsList.length > 0 && myLabelsList[myLabelsList.length - 1] == "") {
                myLabelsList.pop();
            }
            myLabelsList.forEach(element2 => {
                let labelName;
                for (let index = 0; index < tables.length; index++) {
                    const item = tables[index];
                    if (item.id == element2) {
                        labelName = item.label;
                        break;
                    }
                }
                myLabels.push(labelName);
            });
            element.myLabels = myLabels;
        });


        return list;
    },

    /**
     * //用户技能详情(返回SkillResult.UserSkillInfo)
message getUserSkillInfo {
	required string userId = 1;// 用户Id
	required int32 type = 2;// 技能类型(0: 推荐1:1V1陪聊)
}
     * @param {*} userId 
     */
    async getUserSkillInfo(userId = UserInfoCache.userId) {

        const res = await require("../ServerCmd").SkillCmd_getUserSkillInfo({
            userId,// 用户Id
            type: 1,   // 技能类型(1:1V1陪聊)
        });

        //此用户还没有成为1V1陪聊主播
        if (HResultStatus.ChattingServiceUserSkillInfoNotExit == res.state) {
            return HResultStatus.ChattingServiceUserSkillInfoNotExit
        }

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return
        }
        if (!res.data) {
            return
        }

        const tables = await AnnouncerModel.getChatterLabel();

        //把自我评价的标签转为文字
        let myLabels = [];
        let myLabelsList = res.data.labelIds.split(",");
        if (myLabelsList.length > 0 && myLabelsList[myLabelsList.length - 1] == "") {
            myLabelsList.pop();
        }
        myLabelsList.forEach(element => {
            let labelName;
            for (let index = 0; index < tables.length; index++) {
                const item = tables[index];
                if (item.id == element) {
                    labelName = item.label;
                    break;
                }
            }
            myLabels.push(labelName);
        });
        res.data.myLabels = myLabels;

        //把别人评价的标签转为文字
        let labels = [];
        if (res.data.evalLabelIds.length > 0) {
            let labelsList = res.data.evalLabelIds.split(",");
            labelsList.forEach(element => {
                let datas = element.split(":");
                let labelName;
                for (let index = 0; index < tables.length; index++) {
                    const item = tables[index];
                    if (item.id == datas[0]) {
                        labelName = item.label;
                        break;
                    }
                }
                labels.push({ labelName, count: datas[1] })
            });
        }
        res.data.labels = labels;

        return res.data;
    },

    /**
     * //技能列表(返回SkillResult.SkillList)
message listSkill {
}
     */
    async listSkill() {

        const res = await require("../ServerCmd").SkillCmd_listSkill();

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return
        }

        if (!res.data) {
            return
        }

        return res.data;
    },

    /**
     * //技能详情(返回SkillResult.SkillInfo)
message getSkillInfo {
	required int32 skillId = 1;// 技能Id
}
     */
    async getSkillInfo(skillId) {

        const res = await require("../ServerCmd").SkillCmd_getSkillInfo({
            skillId,    // 技能Id
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return
        }
        if (!res.data) {
            return
        }

        return res.data;
    },


    /**
     * 打电话
     * 
//呼叫主播(返回ResultStatus，呼叫成功会有SkillChatResult.SkillChatBroadcast)
message callAnchor {		
	required string anchorId = 1;// 主播Id
    optional int32 waitSec = 2;// 呼叫等待秒数(不传缺省是50)
    price 打电话的价格
}
     */
    async callAnchor(anchorId, price, waitSec) {
        let data = await BagModel.getWallet();
        if (data.goldShell < price) {
            require("../../router/level2_router").showNormInfoDialog("温馨提示:您的余额不足", "去充值", require("../../router/level2_router").showMyWalletView)
            return
        }

        const res = await require("../ServerCmd").SkillChatCmd_callAnchor({
            anchorId,
            waitSec,
        });

        //勿扰模式判断
        if (HResultStatus.AnchorNoDisturb == res.state) {
            AnnouncerModel.cancelCall(anchorId);
            info = await UserInfoModel.getPersonPage(anchorId);
            require("../../router/level2_router").showNormInfoDialog("当前主播已开启勿扰模式，试试给ta留言", "私聊", toChatView)
            return
        }

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return
        }

        // push之前弹出所有的overlay
        require('../../router/ScreensHelper').default.closeAllStackTopOverlays()
        require("../../router/level3_router").showPhoneView(anchorId, true);

        RoomInfoCache.set1V1Calling(true);
        require('../SuspendModel').updateInfo();

        // if (data.goldShell < price * 2) {
        //     require("../../router/level2_router").showNormInfoDialog("温馨提示:您的余额不足", "去充值", require("../../router/level2_router").showMyWalletView)
        // }
    },

    /**
     * 取消(拒绝)呼叫
message cancelCall {		
	required string anchorId = 1;// 主播Id
}
     * @param {*} anchorId 
     */
    async cancelCall(anchorId) {

        const res = await require("../ServerCmd").SkillChatCmd_cancelCall({
            anchorId,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return
        }

        RoomInfoCache.set1V1Calling(false);
        require('../SuspendModel').updateInfo();
        return true
    },

    /**
     * //主播接听呼叫
     */
    async pickUpCall() {

        const res = await require("../ServerCmd").SkillChatCmd_pickUpCall();

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        return true;
    },

    /**
     * //转换勿忧模式,如果当前是打开了勿扰模式则关闭,如果当前是关闭则打开
message switchNoDisturbMode {
	required string userId = 1;//用户ID
	required int32 type = 2;//技能类型(1:1V1陪聊)
}
     */
    async switchNoDisturbMode() {

        const res = await require("../ServerCmd").SkillCmd_switchNoDisturbMode({
            userId: UserInfoCache.userId,
            type: 1,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        return true;
    },

    /**
     * // 用户评价主播
message evalChat {
	required string anchorId = 1;// 主播Id
    optional int32 score = 2;// 评分	
    optional string eval = 3;// 评价标签id列表(英文逗号分隔)
}
     */
    async evalChat(anchorId, score, labelIds) {
        const res = await require("../ServerCmd").SkillChatCmd_evalChat({
            anchorId,
            score,
            eval: labelIds,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        return true;
    },

}

export default AnnouncerModel;