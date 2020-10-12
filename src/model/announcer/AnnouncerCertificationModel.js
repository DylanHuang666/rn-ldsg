/**
 * 认证声优逻辑
 */
'use strict';


import HResultStatus from "../../hardcode/HResultStatus";
import UserInfoCache from "../../cache/UserInfoCache";
import { EUserDataType } from "../../hardcode/EUserDataType";
import ToastUtil from "../../view/base/ToastUtil";


//去绑定手机界面
function toBindPhoneView() {
    require("../../router/level3_router").showBindPhoneView();
}


/**
 * 在我的tab中有“认证声优”入口，所有人可见，点击认证声优需先判断是否已绑定手机
号，后判断是否已实名；未绑定手机号则弹出绑定手机号弹窗，未实名则弹出引导框,点击“知
道了“进入实名认证页面，点击”稍后实名“or关闭按钮 or其他区域，弹框消失；
跳转去实名，且实名成功后，点击返回，直接进入陪聊资料填写页面

 */
export async function toAnnouncerCertificationView() {
    //用户信息
    const userInfoList = await require('../ServerCmd').MyCmd_getUserInfoList({
        userIds: [UserInfoCache.userId],
        type: EUserDataType.PHONENUM + EUserDataType.IS_SET_PAY_PASSWORD,
    })

    if (HResultStatus.Success != userInfoList.state) {
        require('../ErrorStatusModel').default.showTips(userInfoList.state)
        return
    }
    const userInfo = userInfoList.data.list[0]

    if (!userInfo.phoneNum) {
        //未设置手机号
        require("../../router/level2_router").showNormInfoDialog('手机号未绑定',
            "去绑定", toBindPhoneView,
            "我知道了", undefined);
        return
    }

    let res = await require('../../model/mine/UserCertificationModel').default.getUserCertification("未实名认证");
    if (res) {
        require("../../router/level3_router").showAnnouncerCertificationView();
    }
}

const AnnouncerCertificationModel = {


    /**
     * //提交用户技能资料审核申请
message applyUserSkill {
	optional int32 type = 1;// 技能类型(1:1V1陪聊，修改可不填)	
	optional string picInfoTime = 2;// 修改认证资料图时间戳
	optional string videoInfoTime = 3;// 修改认证资料图时间戳
	optional string voiceInfoTime = 4;// 修改语音介绍时间戳
	optional int32 price = 5;// 技能单价(钻石)	
	optional string note = 6;// 自我介绍,使用用URLEncoder编码
	optional int32 voiceTimeSpan = 7;//录音时间长度(s)
	optional string labelIds = 8;//标签,用逗号分隔
}
     */
    async applyUserSkill(price, bVideo, skillTimestamp, audioTimestamp, voiceTimeSpan, note,) {
        if(!skillTimestamp) {
            ToastUtil.showCenter("技能封面图不能为空")
            return
        }
        if(!audioTimestamp) {
            ToastUtil.showCenter("语音介绍不能为空")
            return
        }
        note = encodeURI(note);
        let params = {
            type: 1,                                            //技能类型(1:1V1陪聊，修改可不填)	
            picInfoTime: `${skillTimestamp}`,
            voiceInfoTime: `${audioTimestamp}`,                      // 修改语音介绍实际上是cos的文件名
            price,                                              // 技能单价(钻石)	
            note,                                               // 自我介绍,使用用URLEncoder编码
            voiceTimeSpan,                                      //录音时间长度(s)
        }
        params.videoInfoTime = bVideo ? "video" : "pic";
        const res = await require("../ServerCmd").SkillCmd_applyUserSkill(params);

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }
        return true;
    },

    /**
     * //查询技能申请审核状态(返回SkillResult.SkillInfo)
message querySkillApplyState {
	required string userId = 1;// 用户Id
	required int32 type = 2;// 技能类型(1:1V1陪聊)
}
     * @param {*} userId 
     */
    async querySkillApplyState(userId = UserInfoCache.userId) {

        const res = await require("../ServerCmd").SkillCmd_querySkillApplyState({
            userId,// 用户Id
            type: 1,// 技能类型(1:1V1陪聊)
        });

        if(res.state == HResultStatus.UserSkillApplyingRecordExit || res.state == HResultStatus.UserSkillApplyRecordNotExitOrRefused) {
            return res.state;
        }
        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return
        }

        return res.data;
    },

    /**
     * 评价标签
     * @param {string} labelIds 
     */
    async modifyUserSkillLabels(labelIds) {
        note = encodeURI(note);
        const res = await require("../ServerCmd").SkillCmd_modifyUserSkillLabels({
            type: 1,                    //技能类型(1:1V1陪聊，修改可不填)	
            labelIds,                   // 标签id,用逗号分隔
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }
        return true;
    },


}

export default AnnouncerCertificationModel;