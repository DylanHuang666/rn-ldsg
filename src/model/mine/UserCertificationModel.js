import HResultStatus from '../../hardcode/HResultStatus';
import ToastUtil from '../../view/base/ToastUtil';


//去实名认证界面
function toCertification() {
    require("../../router/level2_router").showCertificationPage();
}

//弹出去认证提示
function showToCertifiction(tips) {
    require("../../router/level2_router").showNormInfoDialog(tips,
        "去认证", toCertification,
        "我知道了", undefined);
}

//用户实名认证
// message UserCertification {
// 	required int32 status = 1;//审核状态  0:审核中， 1:认证不通过，2:认证通过
// 	optional string userId = 2;//用户Id
// 	optional string idCard = 3;//身份证号
// 	optional string realName = 4;//真实姓名
// 	optional int32 coverTime = 5;//修改身份证头像的时间 0为没修改过
// }
const UserCertificaitonModel = {

    //查询实名认证的业务流程
    async getUserCertification(tips) {
        const result = await require('../ServerCmd').UserCertificationCmd_getUserCertification()
        if (HResultStatus.Success != result.state) {
            if (result.state == 77) {
                showToCertifiction(tips)
            } else {
                require('../ErrorStatusModel').default.showTips(result.state)
            }
            return false
        }

        if (!result.data) {
            ToastUtil.showCenter('查询异常')
            return false
        }

        if (result.data.status == 0) {
            //审核中
            ToastUtil.showCenter('实名认证审核中，审核通过后才可继续操作')
            return false
        }

        if (result.data.status == 1) {
            //去认证
            showToCertifiction(tips)
            return false
        }

        return true
    },


    //转赠是否需要实名认证
    async sendGoldShellUserCertificatin() {
        const publicConfig = await require('../staticdata/StaticDataModel').getPublicConfigByIds([1142])
        if (publicConfig[0] && publicConfig[0].value == '1') {
            return UserCertificaitonModel.getUserCertification('未实名认证')
        } else {
            return true
        }
    }

}

export default UserCertificaitonModel;