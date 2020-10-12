/**
 * 实名认证逻辑
 */
'use strict';

import HResultStatus from "../../hardcode/HResultStatus";

const CertificationModel = {
    /**
     * 实名认证
     */
    async saveUserCertification(idCard, realName, code) {

        const res = await require("../ServerCmd").UserCertificationCmd_saveUserCertification({
            idCard, //身份证号
            realName,
            code   //真实姓名
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }
        return true;
    },
}

export default CertificationModel;