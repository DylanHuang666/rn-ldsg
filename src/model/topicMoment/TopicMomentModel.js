/**
 * 话题动态逻辑
 */
'use strict';

import HResultStatus from "../../hardcode/HResultStatus";
import Config from "../../configs/Config";
import UserInfoModel from "../userinfo/UserInfoModel";

let sm_topicMomentsLists = {};
let sm_bLoadTopicList = {};

let sm_topicSelectList = {};
let sm_bLoadSelectList = {};

let sm_topicHotAndRecommendList = {};
let sm_bLoadTwoList = {};

function arrDuplicate(arr1, id) {
    const isExit = arr1.findIndex(item => {
        return item.moments.id === id
    })
    return isExit
}

function arrDuplicate1(arr1, id) {
    const isExit = arr1.findIndex(item => {
        return item.topicData.id === id
    })
    return isExit
}

const TopicMomentModel = {
    async getTopicMoments(topicId, bRefresh, tabType) {
        //         //获取话题动态:MomentResult.SquareMomentVOs
        // message getTopicMoments {
        //     required string topicId = 1;//话题id
        //     required string lastId = 2;//最后一条的dataId 没有则传空字符串
        //     required int32 size = 3;//分页条数
        //     required int32 tabType = 4; //tab类型（1.最新 2.热门）
        //     optional int32 index = 5;// 数据的下标：tabType=2时填,其它填0
        // }

        if (sm_bLoadTopicList[topicId + tabType]) {
            return sm_topicMomentsLists[topicId + tabType] || []
        }

        sm_bLoadTopicList[topicId + tabType] = true

        const length = sm_topicMomentsLists[topicId + tabType] ? sm_topicMomentsLists[topicId + tabType].length : 0

        const lastId = bRefresh ? '' : sm_topicMomentsLists[topicId + tabType][length - 1].moments.id

        let index = bRefresh || length === 0 ? 0 : length

        if (tabType === 1) {
            index = 0
        }

        const res = await require('../ServerCmd').MomentCmd_getTopicMoments({
            topicId,
            lastId,
            size: 3,
            tabType,
            index
        })
        // console.log('话题广场', res.data, res.state)


        if (!sm_topicMomentsLists[topicId + tabType] || bRefresh) {
            sm_topicMomentsLists[topicId + tabType] = []
        }

        if (HResultStatus.Success != res.state) {
            require("../../model/ErrorStatusModel").default.showTips(res.state)

            sm_bLoadTopicList[topicId + tabType] = false
            return sm_topicMomentsLists[topicId + tabType]
        }

        if (!res.data || !res.data.squareMomentVO) {
            sm_bLoadTopicList[topicId + tabType] = false
            return sm_topicMomentsLists[topicId + tabType]
        }

        //大v配置
        let vipIds = await UserInfoModel.getVipAuthentication()
        // 去重
        res.data.squareMomentVO.forEach(item => {
            item.userBase.isBigV = !!vipIds[item.userBase.userId];

            if (arrDuplicate(sm_topicMomentsLists[topicId + tabType], item.moments.id) === -1) {
                item.key = item.moments.id
                if (item.moments && item.moments.mediaList) {
                    item.moments.mediaList.forEach(element => {
                        let userId = item.userBase && item.userBase.userId ? item.userBase.userId : ""
                        element.userId = userId;
                        if (element.type == 2) {
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

                sm_topicMomentsLists[topicId + tabType].push(item);
            }
        })

        sm_bLoadTopicList[topicId + tabType] = false
        // console.log('我单位我',sm_topicMomentsLists[topicId + tabType])
        // console.log('话题广场过滤后长度', sm_topicMomentsLists[topicId+tabType].length)
        return sm_topicMomentsLists[topicId + tabType]
    },


    async getTopicsSelectListOrMine(bRefresh, type = 2) {

        // //获取话题广场 结果：MomentResult.SquareTopicVOs
        // message topicSquare {
        //     required int32 type = 1; //tab类型(1.热搜|2.推荐|3.用户关注或创建话题)
        //     required int32 index = 2;// 数据的下标(type=2时填,其他填0)
        //     required int32 size = 3; //分页条数(type=2时填)
        // }

        if (sm_bLoadSelectList[type]) {
            return sm_topicSelectList[type] || []
        }

        sm_bLoadSelectList[type] = true;

        const length = sm_bLoadSelectList[type] ? sm_bLoadSelectList[type].length : 0

        const index = bRefresh || length === 0 ? 0 : length
        const res = await require('../ServerCmd').MomentCmd_topicSquare({
            type,
            index,
            size: 10,
        })
        // console.warn(type, index)
        if (!sm_topicSelectList[type] || bRefresh) {
            sm_topicSelectList[type] = []
        }



        if (HResultStatus.Success != res.state) {
            require("../../model/ErrorStatusModel").default.showTips(result.state)
            sm_bLoadSelectList[type] = false
            return sm_topicSelectList[type]

        }

        if (!res.data || !res.data.squareTopicVO) {
            sm_bLoadSelectList[type] = false
            return sm_topicSelectList[type]

        }

        res.data.squareTopicVO.forEach(item => {
            if (arrDuplicate1(sm_topicSelectList[type], item.topicData.id) === -1) {
                if (item.topicData.pic && item.topicData.id) {
                    item.uri = require('../../configs/Config').default.getTopicPicUrl(item.topicData.pic)
                    item.key = item.topicData.id
                }
                sm_topicSelectList[type].push(item)
            }


        })

        // console.log('话题选择列表', sm_topicSelectList[type])
        sm_bLoadSelectList[type] = false

        return sm_topicSelectList[type]

    },

    async getTopicsMine(bRefresh, type, userId) {

        // //获取话题广场 结果：MomentResult.SquareTopicVOs
        // message topicSquare {
        //     required int32 type = 1; //tab类型(1.热搜|2.推荐|3.用户关注或创建话题)
        //     required int32 index = 2;// 数据的下标(type=2时填,其他填0)
        //     required int32 size = 3; //分页条数(type=2时填)
        // }

        if (sm_bLoadSelectList[type + userId]) {
            return sm_topicSelectList[type + userId] || []
        }

        sm_bLoadSelectList[type + userId] = true;
        console.log('wail1', sm_bLoadSelectList[type + userId].length)

        const length = sm_bLoadSelectList[type + userId] ? sm_bLoadSelectList[type + userId].length : 0

        let index = bRefresh || length === 0 ? 0 : length

        const res = await require('../ServerCmd').MomentCmd_topicSquare({
            type,
            index,
            size: 10,
            targetUserId: userId
        })
        console.log('wail', res.data.squareTopicVO)
        if (!sm_topicSelectList[type + userId] || bRefresh) {
            sm_topicSelectList[type + userId] = []
        }



        if (HResultStatus.Success != res.state) {
            require("../../model/ErrorStatusModel").default.showTips(res.state)
            sm_bLoadSelectList[type + userId] = false
            return sm_topicSelectList[type + userId]

        }

        if (!res.data || !res.data.squareTopicVO) {
            sm_bLoadSelectList[type + userId] = false
            return sm_topicSelectList[type + userId]

        }

        res.data.squareTopicVO.forEach(item => {
            if (arrDuplicate1(sm_topicSelectList[type + userId], item.topicData.id) === -1) {
                if (item.topicData.pic && item.topicData.id) {
                    item.uri = require('../../configs/Config').default.getTopicPicUrl(item.topicData.pic)
                    item.key = item.topicData.id
                }
                sm_topicSelectList[type + userId].push(item)
            }


        })

        // console.log('话题选择列表', sm_topicSelectList[type+userId])
        sm_bLoadSelectList[type + userId] = false

        return sm_topicSelectList[type + userId]

    },

    async getTopicData(topicId) {

        // //单个获取话题数据:MomentResult.TopicData
        // message getTopicData {
        //     required string topicId = 1;//话题id
        // }
        const res = await require('../ServerCmd').MomentCmd_getTopicData({
            topicId
        })

        // //动态话题数据
        // message TopicData {
        //     required string id = 1;//话题id
        //     required string topicName = 2;//话题名称
        //     required string topicIntroduce = 3;//话题介绍
        //     required string pic = 4;//图片
        //     optional bool topSearchTopic = 5;//是否是热搜话题
        //     optional string topSearchLabel = 6;//热搜标签
        //     optional string topSearchStartTime = 7;//热搜开始时间
        //     optional string topSearchEndTime = 8;//热搜结束时间
        //     optional int32 weight = 9;//权重
        //     optional int64 momentCount = 10;//动态数量
        //     optional int64 joinCount = 11;//参与数量
        //     optional int32 heat = 12;//热度
        // }

        if (HResultStatus.Success != res.state) {
            require("../../model/ErrorStatusModel").default.showTips(res.state)
            return null
        }


        if (!res.data) {
            return null
        }

        return res.data
    },

    async getHotOrRecommendList(bRefresh, type, size = 10) {

        // //获取话题广场 结果：MomentResult.SquareTopicVOs
        // message topicSquare {
        //     required int32 type = 1; //tab类型(1.热搜|2.推荐|3.用户关注或创建话题)
        //     required int32 index = 2;// 数据的下标(type=2时填,其他填0)
        //     required int32 size = 3; //分页条数(type=2时填)
        // }
        if (sm_bLoadTwoList[type]) {
            return sm_topicHotAndRecommendList[type] || []
        }

        sm_bLoadTwoList[type] = true;

        const length = sm_topicHotAndRecommendList[type] ? sm_topicHotAndRecommendList[type].length : 0

        let index = bRefresh || length === 0 ? 0 : length

        if (type === 1 || type === 3) {
            index = 0
        }
        const res = await require('../ServerCmd').MomentCmd_topicSquare({
            type,
            index,
            size
        })

        if (!sm_topicHotAndRecommendList[type] || bRefresh) {
            sm_topicHotAndRecommendList[type] = []
        }



        if (HResultStatus.Success != res.state) {
            require("../../model/ErrorStatusModel").default.showTips(result.state)
            sm_bLoadTwoList[type] = false
            return sm_topicHotAndRecommendList[type]

        }

        if (!res.data || !res.data.squareTopicVO) {
            sm_bLoadTwoList[type] = false
            return sm_topicHotAndRecommendList[type]

        }




        res.data.squareTopicVO.forEach(item => {
            if (arrDuplicate1(sm_topicHotAndRecommendList[type], item.topicData.id) === -1) {
                if (item.topicData.pic && item.topicData.id) {
                    item.uri = require('../../configs/Config').default.getTopicPicUrl(item.topicData.pic)
                    item.key = item.topicData.id
                }
                sm_topicHotAndRecommendList[type].push(item)
            }


        })

        // console.log('话题选择列表', sm_topicHotAndRecommendList[type])
        sm_bLoadTwoList[type] = false

        return sm_topicHotAndRecommendList[type]

    },

    /**
     * 关注话题
     */
    async addTopicLover(topicId) {
        //         //新增关注话题
        // message addFocusTopic {
        // 	required string topicId = 1;//话题id
        // }
        const res = await require("../ServerCmd").MomentCmd_addFocusTopic({
            topicId
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }

        if (HResultStatus.Success === res.state) {
            require('../../view/base/ToastUtil').default.showCenter('关注成功')
            return true;
        }

    },

    /**
     * 取消话题
     */
    async cancelTopicLover(topicId) {
        //         //新增关注话题
        // message addFocusTopic {
        // 	required string topicId = 1;//话题id
        // }
        const res = await require("../ServerCmd").MomentCmd_cancelFocusTopic({
            topicId
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false;
        }

        if (HResultStatus.Success === res.state) {
            // require('../../view/base/ToastUtil').default.showCenter('关注成功')
            return true;
        }

    },
}

export default TopicMomentModel;
