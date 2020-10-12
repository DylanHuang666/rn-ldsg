/**
 * 上传枚举
 */

'use strict';

/*
    * 上传位置类型
    */
export const EUploadType = {
    ANNOUNCER_VIDEO: "chatingService_video",//声优认证上传视频文件
    ANNOUNCER_PIC: "chatingService_pic",    //声优认证上传图片
    ANNOUNCER_AUDIO: "chatingService_voice",  //声优认证上传音频文件


    PUBLIC_IMG: "publicimg",  //公屏IM上传图片

    
    MOMENT_PIC: "moment_pic",  //动态图片
    MOMENT_VIDEO: "moment_video",  //动态视频
    MOMENT_VOICE: "moment_voice",  //动态录音

    MOMENT_TOPIC_PIC: "momentTopic_pic",  //话题封面

    BROAD_MEDIA_PIC: "broadcastMedia",  //活动图片或气泡

}