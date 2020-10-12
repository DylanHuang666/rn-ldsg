
/**
 * 编辑资料逻辑
 */
'use strict';

import HResultStatus from "../../hardcode/HResultStatus";
import { LiveRoomCmd_getMatchmakerEarningData } from "../ServerCmd";
import ToastUtil from "../../view/base/ToastUtil";


const UserInfoEditModel = {
    /**
     * 获取用户信息
     */
    async getPersonPage() {
        const res = await require("../ServerCmd").MyCmd_getPersonPage({
            userId: "",
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return;
        }
        return res.data.info;
    },


    /**
     * message modifyUserSkillLabels {
    required int32 type = 1;// 技能类型(1:1V1陪聊)	
    required string labelIds = 2;//标签,用逗号分隔
}
     */
    async modifyUserSkillLabels(labelIds) {
        const res = await require("../ServerCmd").SkillCmd_modifyUserSkillLabels({
            type: 1,
            labelIds,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        return true;
    },

    /**
     * 编辑资料
     * MyCmd$modifyUserInfo, {"nickName": "活泼的北极熊","sex": 1,"birthday": "1994-04-12","logo": true,"photoIds": "4d344d5e676fc16c7e2194cf09e25f13,e70e91b3b63d81c663a02be683b4e35f","position": "南京","slogan": "1001071"}
     */
    async modifyUserInfo(nickName, sex, birthday, logo, photoIds, position, slogan = "种一棵树最好的时间是十年前，其次是现在", height,checkRepeat) {
        let check1 = await require("../staticdata/StaticDataModel").checkSensitiveWordByOfficial(nickName);
        if ((check1 != null) && (check1 === true)) {
            ToastUtil.showCenter('昵称含有不规范内容')
            return false
        }

        let check2 = await require("../staticdata/StaticDataModel").checkSensitiveWordByOfficial(slogan);
        if ((check2 != null) && (check2 === true)) {
            ToastUtil.showCenter('个性签名含有不规范内容')
            return false
        }

        const check3 = await require("../ServerCmd").MyCmd_checkNickNameExist({
            nickName
        })

        if (checkRepeat) {
            const check3 = await require("../ServerCmd").MyCmd_checkNickNameExist({
                nickName
            })


            if (check3.data.data === 1) {
                ToastUtil.showCenter('此昵称已存在')
                return false
            }
        }
        const res = await require("../ServerCmd").MyCmd_modifyUserInfo({
            nickName,
            sex,
            birthday,
            logo,
            photoIds,
            position,
            slogan,
            height,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }

        let res2 = await require("../ServerCmd").MyCmd_modifyUserDetail({});

        if (HResultStatus.Success != res2.state) {
            require("../ErrorStatusModel").default.showTips(res2.state);
            return false;
        }
        return true;
    },

    /**
     * 获取地址数据
     */
    async getAreaData() {
        const data = await require("../../model/network/ApiModel").default.getJSON("https://voicex-cos-1258539251.cos.ap-guangzhou.myqcloud.com/app/rn/data/address.js");

        return data;
    },

    /**
    * 获取我的相册地址
    * 
    */
    async getAlbums(userId, star, end, orderBy) {
        const res = await require("../ServerCmd").AlbumCmd_getAlbums({
            userId,
            star,
            end,
            orderBy
        });

        // console.log('aaa', res)
        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }

        return res.data.list;
    },

    /**
    * 上传相册
    * 
    */
    async addAlbums(photoId) {
        const res = await require("../ServerCmd").AlbumCmd_addPhotos({
            photoId
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }

        return true
    }
}

export default UserInfoEditModel;