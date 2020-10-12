/**
 * 话题类型枚举
 */

'use strict';

export const ConversationType = {
    LATEST_CONVERSATION: 1,          //最新
    RECOMMEND_CONVERSATION: 2,       //推荐
    FOCUS_CONVERSATION: 3,           //关注
}

export const ConversationMediaType = {
    PHOTO_AND_LETTER_CONVERSATION: 1,          //图文
    VIDEO_CONVERSATION: 5,                     //视频

}

export const CommentsSortType = {
    COMMENTS_SORT_BY_TIME: 1,         //按照时间排序
}

export const TopicType = {
    HOT_TOPIC_TYPE: 1,         //热搜
    RECOMMEND_TOPIC_TYPE: 2,         //推荐
}

export const TopicMomentType = {
    HOT_TOPIC_MOMETNS_TYPE: 1,         //热搜
    RECOMMEND_TOPIC_MOMENTS_TYPE: 2,         //推荐
}