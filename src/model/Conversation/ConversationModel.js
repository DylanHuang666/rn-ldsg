/**
 * 动态广场逻辑
 */
'use strict';

import HResultStatus from "../../hardcode/HResultStatus";
import Config from "../../configs/Config";
import UserInfoModel from "../userinfo/UserInfoModel";
let sm_conversationList = {};
let sm_bLoadConversatioList = {};

let sm_conversationMediaList = {};
let sm_bLoadConversatioMediaList = {};

function arrDuplicate(arr1, id) {
    const isExit = arr1.findIndex(item => {
        return item.moments.id === id
    })
    return isExit
}

function arrDuplicate1(arr1, id) {
    const isExit = arr1.findIndex(item => {
        return item.id === id
    })
    return isExit
}

const ConversationModel = {
    // 获取用户动态广场
    async getHomeConversationList(userId, bRefresh) {
        // console.warn('====话题首页', userId, size, lastId)
        //获取用户动态 结果：MomentResult.MomentVOS
        // message listMoments {
        //     required string userId = 1; //用户id
        //     required string lastId = 2; // 最后一条dataID 没有则传空字符串
        //     required int32 size = 3; //分页条数
        // }
        if (sm_bLoadConversatioList[userId]) {
            return sm_conversationList[userId] || []
        }

        sm_bLoadConversatioList[userId] = true

        const length = sm_conversationList[userId] ? sm_conversationList[userId].length : 0

        const lastId = bRefresh || length === 0 ? '' : sm_conversationList[userId][length - 1].moments.id

        const res = await require('../ServerCmd').MomentCmd_listMoments({
            userId,
            lastId,
            size: 10,
        })
        // console.log('----->1', res.data)

        // console.warn('===话题首页', res.state)
        // console.log('话题首页', res)
        if (!sm_conversationList[userId] || bRefresh) {
            sm_conversationList[userId] = []
        }

        if (HResultStatus.Success != res.state) {
            require("../../model/ErrorStatusModel").default.showTips(res.state)
            sm_bLoadConversatioList[userId] = false
            return sm_conversationList[userId]
        }



        if (!res.data || !res.data.squareMomentVO) {
            sm_bLoadConversatioList[userId] = false
            return sm_conversationList[userId]
        }

        //大v配置
        let vipIds = await UserInfoModel.getVipAuthentication()
        // 去重
        res.data.squareMomentVO.forEach(item => {
            // console.log('============', arrDuplicate(sm_conversationList[tabType], item.moments.id) === -1)
            if (arrDuplicate(sm_conversationList[userId], item.moments.id) === -1) {
                // console.log('=============', item.moments.id)
                item.key = item.moments.id + item.moments.issueTime
                // console.log('我要看看我应该怎么加', item.key, item)

                item.userBase.isBigV = !!vipIds[item.userBase.userId];
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

                sm_conversationList[userId].push(item);
            }
        })

        sm_bLoadConversatioList[userId] = false
        // console.log('话题广场过滤后长度', sm_conversationList[userId].length)
        return sm_conversationList[userId]

    },

    async getSquareConversationList(tabType, bRefresh) {
        //获取动态广场 结果：MomentResult.SquareMomentVOs
        // message momentSquare {
        //     required string lastId = 1; // 最后一条dataID 没有则传空字符串,推荐广场无效要填index
        //     required int32 size = 2; //分页条数
        //     required int32 tabType = 3; //tab类型（1.最新|2.推荐|3.关注）
        //     required int32 index = 4;// 数据第一条的下标：推荐广场填,其它填0
        // }
        // console.log('话题广场')
        // console.log('话题广场', tabType)



        if (sm_bLoadConversatioList[tabType]) {
            return sm_conversationList[tabType] || []
        }

        sm_bLoadConversatioList[tabType] = true

        const length = sm_conversationList[tabType] ? sm_conversationList[tabType].length : 0
        let index

        index = bRefresh || length === 0 ? 0 : length
        // if (!bRefresh) {
        //     console.log('话题广成', sm_conversationList[tabType][length - 1])

        // }
        if (tabType === 1 || tabType === 3) {
            index = 0
        }
        const lastId = bRefresh ? '' : sm_conversationList[tabType][length - 1].moments.id
        // console.warn(tabType, index, lastId)

        const res = await require('../ServerCmd').MomentCmd_momentSquare({
            size: 10,
            tabType,
            lastId,
            index,
        })
        // console.warn(tabType, index, lastId, 2)
        // console.log('话题广场', res.data)


        if (!sm_conversationList[tabType] || bRefresh) {
            sm_conversationList[tabType] = []
        }

        if (HResultStatus.Success != res.state) {
            require("../../model/ErrorStatusModel").default.showTips(res.state)
            sm_bLoadConversatioList[tabType] = false
            return sm_conversationList[tabType]
        }

        if (!res.data || !res.data.squareMomentVO) {
            sm_bLoadConversatioList[tabType] = false
            return sm_conversationList[tabType]
        }
        // console.log('话题广场2', sm_conversationList[tabType])
        // console.log('话题广场过滤前长度', res.data.squareMomentVO.length)

        //大v配置
        let vipIds = await UserInfoModel.getVipAuthentication()
        // 去重
        res.data.squareMomentVO.forEach(item => {
            // console.log('============', arrDuplicate(sm_conversationList[tabType], item.moments.id) === -1)
            if (arrDuplicate(sm_conversationList[tabType], item.moments.id) === -1) {
                // console.log('=============', item.moments.id)
                item.key = item.moments.id + item.moments.issueTime
                // console.log('我要看看我应该怎么加', item.key, item)

                item.userBase.isBigV = !!vipIds[item.userBase.userId];
                if (item.moments && item.moments.mediaList) {
                    item.moments.mediaList.forEach(element => {
                        element.userId = userId;
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

                sm_conversationList[tabType].push(item);
            }
        })

        sm_bLoadConversatioList[tabType] = false
        // console.log('话题广场过滤后长度', sm_conversationList[tabType].length)
        return sm_conversationList[tabType]
    },


    async getSquareConversationMediaList(tabType, bRefresh) {
        //获取多媒体数据 结果：MomentResult.SquareMomentVOs
        // message listMomentMedia {
        //     required int32 index = 1; // 数据的下标
        //     required int32 size = 2; //分页条数
        //     repeated int32 contType = 3; //内容类型（1:图文动态；2:带背景音乐的语音动态；3:不带背景音乐的语音动态；4:纯文字5.视频）
        // }


        if (sm_bLoadConversatioMediaList[tabType]) {
            return sm_conversationMediaList[tabType] || []
        }

        sm_bLoadConversatioMediaList[tabType] = true

        const length = sm_conversationMediaList[tabType] ? sm_conversationMediaList[tabType].length : 0

        const index = bRefresh || length === 0 ? 0 : length
        // if (!bRefresh) {
        //     console.log('话题广成', sm_conversationMediaList[tabType][length - 1])

        // }

        // const lastId = bRefresh ? '' : sm_conversationMediaList[tabType][length - 1].moments.id
        // console.warn(size,)

        const res = await require('../ServerCmd').MomentCmd_listMomentMedia({
            size: 10,
            contType: [tabType],
            index,
        })

        // console.log('图文或者视频', tabType, res.data)

        if (!sm_conversationMediaList[tabType] || bRefresh) {
            sm_conversationMediaList[tabType] = []
        }

        if (HResultStatus.Success != res.state) {
            require("../../model/ErrorStatusModel").default.showTips(res.state)
            sm_bLoadConversatioMediaList[tabType] = false
            return sm_conversationMediaList[tabType]
        }

        if (!res.data || !res.data.squareMomentVO) {
            sm_bLoadConversatioMediaList[tabType] = false
            return sm_conversationMediaList[tabType]
        }
        // console.log('话题广场', res.data.squareMomentVO)
        // console.log('话题广场2', sm_conversationMediaList[tabType])
        // console.log('话题广场过滤前长度', res.data.squareMomentVO.length)

        // 去重
        res.data.squareMomentVO.forEach(item => {
            // console.log('============', arrDuplicate(sm_conversationMediaList[tabType], item.moments.id) === -1)
            if (arrDuplicate(sm_conversationMediaList[tabType], item.moments.id) === -1) {
                // console.log('=============', item.moments.id)
                item.key = item.moments.id + item.moments.issueTime
                // console.log('我要看看我应该怎么加', item.key, item)
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

                sm_conversationMediaList[tabType].push(item);
            }
        })

        sm_bLoadConversatioMediaList[tabType] = false
        // console.log('话题广场过滤后长度', sm_conversationMediaList[tabType].length)
        return sm_conversationMediaList[tabType]
    },


    async getMomentConversation(momentId) {
        //阅读动态 结果：MomentResult.SquareMomentVO
        // message viewMoment {
        //     required string momentId = 1; //动态id
        // }
        const res = await require('../ServerCmd').MomentCmd_viewMoment({
            momentId
        })

        if (HResultStatus.Success != res.state) {
            require("../../model/ErrorStatusModel").default.showTips(res.state)
            return null
        }

        if (!res.data) {
            return null
        }

        //大v配置
        let vipIds = await UserInfoModel.getVipAuthentication()

        if (res.data.userBase) {
            res.data.userBase.isBigV = !!vipIds[res.data.userBase.userId];
        }

        if (res.data.moments && res.data.moments.mediaList) {
            res.data.moments.mediaList.forEach(element => {
                let userId = res.data.userBase && res.data.userBase.userId ? res.data.userBase.userId : ""
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
        return res.data
    },


}

export default ConversationModel;
