/**
 * 错误状态码信息处理逻辑
 */
'use strict';

import HResultStatus from "../hardcode/HResultStatus";
function _doShowTips(vo, state) {
    if (!vo) {
        require("../view/base/ToastUtil").default.showBottom(`请稍后再试${state}`);
        return;
    }

    require("../view/base/ToastUtil").default.showCenter(vo.zh_cn);
}



const ErrorStatusModel = {
    showTips(state) {

        //过滤部分不提示的错误码
        if (
            HResultStatus.ERROR_TRY_LOGON_FAIL == state
            || HResultStatus.ERROR_TRY_LOGIN_FAIL == state
            || HResultStatus.ERROR_TRY_LOGIN_SAVE_FAIL == state
        ) {
            return;
        }

        require("./staticdata/StaticDataModel").getResultStatus(state, _doShowTips);
    }
};

export default ErrorStatusModel;