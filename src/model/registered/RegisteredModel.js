'use strict';

import HResultStatus from "../../hardcode/HResultStatus";
import ToastUtil from "../../view/base/ToastUtil";

const RegisteredModel = {
    //获取随机头像
    async getRandomAvatar() {
        const result = await require('../../model/staticdata/StaticDataModel').getPublicConfig(28)
        if (!result) {
            require('../ErrorStatusModel').default.showTips(HResultStatus.Fail)
            return 0;
        }
        let data = Math.round(Math.random() * Number(result.value));
        // console.log("获取随机头像", data);
        return data;
    },

    //随机名称
    async getRandomName() {
        const result = await require('../../model/staticdata/StaticDataModel').getRandomNameTableData()
        if (!result) {
            require('../ErrorStatusModel').default.showTips(HResultStatus.Fail)
            return "沫清尘"
        }
        let index = Math.round(Math.random() * (result.length - 1));
        return result[index].part1 + result[index].part3;
    },

    /**
     * 编辑资料
     */
    async modifyUserInfo(nickName, sex, birthday, headUrl, logo = false, photoIds = "") {

        const check3 = await require("../ServerCmd").MyCmd_checkNickNameExist({
            nickName
        })

        if (check3.data.data === 1) {
            ToastUtil.showCenter('此昵称已存在')
            return false
        }

        let param
        if (logo) {
            param = {
                nickName,
                sex,
                birthday,
                logo,
                photoIds,
            }
        } else {
            param = {
                nickName,
                sex,
                birthday,
                headUrl,
            }
        }

        // console.log("打印---", param)
        const res = await require("../ServerCmd").MyCmd_modifyUserInfo(param);

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }
        return true;
    },
}

export default RegisteredModel;