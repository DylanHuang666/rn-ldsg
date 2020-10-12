/**
 * 动态逻辑
 */
'use strict';

import HResultStatus from "../../hardcode/HResultStatus";
import { KEY_MOMENT_PUBLISH } from "../../hardcode/HLocalStorageKey";
import AsyncStorage from "@react-native-community/async-storage";
import ToastUtil from "../../view/base/ToastUtil";
import { CLICK_INTERVAL } from "../../hardcode/HGLobal";
import UserInfoCache from "../../cache/UserInfoCache";
import Config from "../../configs/Config";
import ModelEvent from "../../utils/ModelEvent";
import {
    EVT_LOGIC_LIKE_MOMENT_CHANGE, EVT_LOGIC_ROOM_REFRESH_ROOM,
} from '../../hardcode/HLogicEvent';
import UserInfoModel from "../userinfo/UserInfoModel";

export const getLocalSavePublicInfo = async () => {
    try {
        let ret = await AsyncStorage.getItem(KEY_MOMENT_PUBLISH);
        if (ret) {
            ret = JSON.parse(ret);
        }
        return ret;
    } catch (error) {

    }
    return null;
}

export async function saveLocalPublicInfo(momentData) {
    try {
        await AsyncStorage.setItem(
            KEY_MOMENT_PUBLISH,
            JSON.stringify(momentData)
        );
        return true;
    } catch (error) {

    }
    return false;
}

export async function clearLocalPublicInfo() {
    try {
        await AsyncStorage.removeItem(
            KEY_MOMENT_PUBLISH,
        );
        return true;
    } catch (error) {

    }
    return false;
}

let g_clickTime = 0;

let sm_likeMomentList = {}
let sm_bLoadlikeMoment = {}
let sm_likeMomentPageNo = {}
const MomentModel = {
    /**
      * //发表动态 结果：MomentResult.SquareMomentVO
message issueMoment {
    optional string word = 1; //文字
    optional string location = 2; //地理位置
    optional string topic = 3; //话题id
    optional int32 contType = 4; //内容类型（1:图文动态；2:带背景音乐的语音动态；3:不带背景音乐的语音动态；4:纯文字；5:视频动态(包含视频就是)）
    optional int32 isVoiceCard = 5; //是否从声音卡片录制(1:是;0:否)
    optional double lng = 6;// 经度
    optional double lat = 7;// 纬度
    optional string cityCode = 8;//城市代码
    repeated MomentMedia medias = 9;//媒体信息列表
}

    //动态媒体信息,发动态时上传媒体文件信息
message MomentMedia {
	optional string pic = 1;//图片
	optional int32 height = 2;//图片高度
	optional int32 width = 3;//图片宽度
	optional string video = 4;//视频
	optional string videoPic = 5;//视频封面
	optional string voice = 6;//声音
	optional int32 voiceDuration = 7;//声音长度(单位:秒)
	required int32 type = 8;//媒体类型:1图片,2视频,3音频
}
         */
    async issueMoment(params) {
        let now = Date.now();
        if (g_clickTime + CLICK_INTERVAL * 4 > now) {
            return
        }
        g_clickTime = now;
        let check1 = await require("../staticdata/StaticDataModel").checkSensitiveWordByOfficial(params.word);
        if ((check1 != null) && (check1 === true)) {
            ToastUtil.showCenter('当前内容含有不规范内容')
            return false
        }

        if (params && params.medias && params.medias.length > 0 && params.medias[params.medias.length - 1] && params.medias[params.medias.length - 1].bAdd) {
            params.medias.pop();
        }
        const res = await require("../ServerCmd").MomentCmd_issueMoment(params);


        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        return true;
    },

    /**
     * message createTopic {
        required string topicName = 1;//话题名称
        required string topicIntroduce = 2;//话题介绍
        required string pic = 3;//图片
        optional bool topSearchTopic = 4;//是否是热搜话题
        optional string topSearchLabel = 5;//热搜标签
        optional string topSearchStartTime = 6;//热搜开始时间
        optional string topSearchEndTime = 7;//热搜结束时间
        optional int32 weight = 8;//权重
    }
     */
    async createTopic(topicName, topicIntroduce, pic) {
        let now = Date.now();
        if (g_clickTime + CLICK_INTERVAL * 4 > now) {
            return
        }
        g_clickTime = now;
        let check1 = await require("../staticdata/StaticDataModel").checkSensitiveWordByOfficial(topicName);
        if ((check1 != null) && (check1 === true)) {
            ToastUtil.showCenter('当前话题命名不规范')
            return false
        }

        let check2 = await require("../staticdata/StaticDataModel").checkSensitiveWordByOfficial(topicIntroduce);
        if ((check2 != null) && (check2 === true)) {
            ToastUtil.showCenter('当前话题介绍不规范')
            return false
        }

        const res = await require("../ServerCmd").MomentCmd_createTopic({
            topicName,
            topicIntroduce,
            pic,
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return
        }

        if (!res.data || !res.data.data) {
            return
        }

        return res.data.data;
    },

    /**
     * 
     * @param {*} momentId 
     * @param {bool} bLike 是否点赞
     * @param {bool} unRefreshHomePage 是否刷新首页（md）分页不能直接刷新
     */
    async likeOrUnLikeMoment(momentId, bLike = true, unRefreshHomePage) {
        const res = bLike ? await MomentModel.likeMoment(momentId) :
            await MomentModel.cancelLikeMoment(momentId);

        ModelEvent.dispatchEntity(null, EVT_LOGIC_LIKE_MOMENT_CHANGE, null);
        if (!unRefreshHomePage) {
            ModelEvent.dispatchEntity(null, EVT_LOGIC_ROOM_REFRESH_ROOM, null)
        }
        return res;
    },

    /**
     * //动态点赞
message likeMoment {
    required string momentId = 1; //动态id
}
     * @param {*} momentId 
     */
    async likeMoment(momentId) {
        const res = await require("../ServerCmd").MomentCmd_likeMoment({
            momentId
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        return true;
    },


    /**
     * //取消点赞
message cancelLikeMoment {
    required string momentId = 1; //动态id
}
     * @param {*} momentId 
     */
    async cancelLikeMoment(momentId) {

        const res = await require("../ServerCmd").MomentCmd_cancelLikeMoment({
            momentId
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        return true;
    },

    /**
     * //删除动态
message delMoment {
    required string momentId = 1; //动态id
}
     * @param {*} momentId 
     */
    async delMoment(momentId) {

        const res = await require("../ServerCmd").MomentCmd_delMoment({
            momentId
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }
        ModelEvent.dispatchEntity(null, EVT_LOGIC_ROOM_REFRESH_ROOM, null)
        return true;
    },

    /**
     * //阅读动态 结果：MomentResult.SquareMomentVO
message viewMoment {
    required string momentId = 1; //动态id
}
     * @param {*} momentId 
     */
    async viewMoment(momentId) {

        const res = await require("../ServerCmd").MomentCmd_viewMoment({
            momentId
        });

        console.warn(res)
        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        return true;
    },

    /**
         * //分页获取点赞过的动态列表:MomentResult.LikeMomentData
    message listLikeMoments {
        required string userId = 1;//用户id
        required int32 pageNo = 2;//页码,从1开始
        required int32 pageSize = 3;//页大小
    }


    //点赞过的动态列表数据
message LikeMomentData {
	required int32 totalPage = 1;//总页数
	required int32 totalCount = 2;//总条数
	repeated MomentVO moments = 3;//动态信息
    repeated MomentChangeData changes = 4;//动态变化信息
}
         */
    async listLikeMoments(bRefresh = true, userId = UserInfoCache.userId, pageSize = 15) {
        if (sm_bLoadlikeMoment[userId]) return sm_likeMomentList[userId] || { squareMomentVO: [] }

        sm_bLoadlikeMoment[userId] = true

        sm_likeMomentPageNo[userId] = bRefresh ? 1 : sm_likeMomentPageNo[userId] + 1

        const res = await require("../ServerCmd").MomentCmd_listLikeMoments({
            userId,
            pageNo: sm_likeMomentPageNo[userId],
            pageSize,
        });
        if (!sm_likeMomentList[userId] || bRefresh) {
            sm_likeMomentList[userId] = { squareMomentVO: [] }
        }

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            sm_bLoadlikeMoment[userId] = false

            return sm_likeMomentList[userId]
        }

        if (!res.data) {
            sm_bLoadlikeMoment[userId] = false
            return sm_likeMomentList[userId]
        }

        if (!res.data.squareMomentVO) {
            res.data.squareMomentVO = []
        }
        //大v配置
        let vipIds = await UserInfoModel.getVipAuthentication()

        res.data.squareMomentVO.forEach(item => {
            // if (item.moments && item.moments.id && item.moments.issueTime) {
            //     item.key = item.id + item.issueTime
            // }
            if (item.userBase) {
                item.userBase.isBigV = !!vipIds[item.userBase.userId];
            }
            if (item.moments && item.moments.mediaList) {
                item.moments.mediaList.forEach(element => {
                    let userId = item.userBase && item.userBase.userId ? item.userBase.userId : ""
                    element.userId = userId;
                    if (element.type == 2) {
                        //视频
                        if (element.videoPic) {
                            element.uri = Config.getThreadPublishPicUrl(userId, element.videoPic)
                        } else {
                            element.uri = Config.getThreadPublishVideoUrl(userId, element.pic)
                        }

                    } else {
                        element.uri = Config.getThreadPublishPicUrl(userId, element.pic)
                    }
                });
            }
        })

        if (res.data.totalCount !== undefined) {
            sm_likeMomentList[userId].totalCount = res.data.totalCount
        }
        sm_likeMomentList[userId].squareMomentVO = sm_likeMomentList[userId].squareMomentVO.concat(res.data.squareMomentVO)

        sm_bLoadlikeMoment[userId] = false
        return sm_likeMomentList[userId];
    },


}

export default MomentModel;