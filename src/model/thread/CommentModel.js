/**
 * 评论逻辑
 */
'use strict';

import HResultStatus from "../../hardcode/HResultStatus";
import UserInfoModel from "../userinfo/UserInfoModel";
import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_ROOM_REFRESH_ROOM } from "../../hardcode/HLogicEvent";
let sm_commentList = {}
let sm_bLoadcomments = {}

const CommentModel = {

    /**
     * //发起评论 结果：CommentResult.CommentMixtureVO
message issueComment {
    required string dataId = 1; //数据id(动态id或父评论id)
    required int32 type = 2; //评论的类型, 1：动态评论 2:评论回复
    optional string word = 3; //文字
    optional string voice = 4; //声音
    optional int32 voiceDur = 5; //声音时长(单位：秒)
    repeated string pics = 6; //图片
    optional string beRepliedCommentId = 7;//评论回复列表下,被回复的评论(是一条回复)ID
}
     */
    async issueComment(dataId, type, word, beRepliedCommentId, voice, voiceDur, pics) {
        let params = {
            dataId,
            type,
            word,
        }
        if (beRepliedCommentId) {
            params.beRepliedCommentId = beRepliedCommentId;
        }
        if (voice) {
            params.voice = voice;
        }
        if (voiceDur) {
            params.voiceDur = voiceDur;
        }
        if (pics) {
            params.pics = pics;
        }
        const res = await require("../ServerCmd").CommentCmd_issueComment(params);

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        if (type === 1) {
            ModelEvent.dispatchEntity(null, EVT_LOGIC_ROOM_REFRESH_ROOM, null)
        }
        return true;
    },


    /**
     * //获取评论列表 结果:CommentResult.CommentMixtureVOs
message listComment {
    required string dataId = 1; //动态id
    required int32 type = 2; //评论的类型, 1：动态评论 2:评论回复
    optional string lastId = 3; // 最后一条dataID 没有则传空字符串
    required int32 size = 4; //分页条数
    required int32 sort = 5; //排序规则：1、时间
    required int32 order = 6; //顺序 1、升序 -1、倒序
}
     */
    async listComment(dataId, sort = 1, size = 15, bRefresh = true, type = 1) {
        if (sm_bLoadcomments[dataId]) return sm_commentList[dataId] || { commentMixtureVO: [] }

        sm_bLoadcomments[dataId] = true

        const length = sm_commentList[dataId] && sm_commentList[dataId].commentMixtureVO ? sm_commentList[dataId].commentMixtureVO.length : 0

        const lastId = bRefresh || length === 0 ? '' : sm_commentList[dataId].commentMixtureVO[length - 1].commentVO.id

        const res = await require("../ServerCmd").CommentCmd_listComment({
            dataId,
            type,
            lastId,
            size,
            sort,
            order: -1,
        });
        if (!sm_commentList[dataId] || bRefresh) {
            sm_commentList[dataId] = { commentMixtureVO: [] }
        }

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            sm_bLoadcomments[dataId] = false

            return sm_commentList[dataId]
        }

        if (!res.data) {
            sm_bLoadcomments[dataId] = false
            return sm_commentList[dataId]
        }

        if (!res.data.commentMixtureVO) {
            res.data.commentMixtureVO = []
        }

        //大v配置
        let vipIds = await UserInfoModel.getVipAuthentication()

        res.data.commentMixtureVO.forEach(item => {
            if (item.userInfo) {
                item.userInfo.isBigV = !!vipIds[item.userInfo.userId];
            }
            if (item.commentVO && item.commentVO.id) {
                item.key = item.commentVO.id + item.commentVO.issueTime
            }
        })

        if (res.data.parentCommentMixtureVO) {
            sm_commentList[dataId].parentCommentMixtureVO = res.data.parentCommentMixtureVO
        }
        sm_commentList[dataId].commentMixtureVO = sm_commentList[dataId].commentMixtureVO.concat(res.data.commentMixtureVO)

        sm_bLoadcomments[dataId] = false
        return sm_commentList[dataId];
    },



    /**
     * 
     * @param {*} id 
     * @param {bool} bLike 是否点赞
     */
    async likeOrUnLikeComment(id, bLike = true) {
        const res = bLike ? await CommentModel.likeComment(id) :
            await CommentModel.cancelLikeComment(id);


        return res;
    },

    /**
     * //评论点赞
message likeComment {
    required string id = 1; //评论id
}
     * @param {*} id 
     */
    async likeComment(id) {

        const res = await require("../ServerCmd").CommentCmd_likeComment({
            id
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        return true;
    },


    /**
     * //取消评论赞
message cancelLikeComment {
    required string id = 1; //评论id
}
     * @param {*} id 
     */
    async cancelLikeComment(id) {

        const res = await require("../ServerCmd").CommentCmd_cancelLikeComment({
            id
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        return true;
    },


    /**
     * //删除评论
message delComment {
    required string id = 1; //评论id
}
     * @param {*} id 
     */
    async delComment(id) {

        const res = await require("../ServerCmd").CommentCmd_delComment({
            id
        });

        if (HResultStatus.Success != res.state) {
            require("../ErrorStatusModel").default.showTips(res.state);
            return false
        }

        return true;
    },

}

export default CommentModel;