
/**
 * 上传逻辑
 */
'use strict';

import CryptoJS from 'crypto-js';
import Config, { APP_KEY, } from '../configs/Config';
import UserInfoCache from '../cache/UserInfoCache';
import { NativeModules } from "react-native";
import RoomInfoCache from '../cache/RoomInfoCache';
import { EUploadType } from '../hardcode/EUpload';
import { delay } from '../utils/CDTick';
import ToastUtil from '../view/base/ToastUtil';


const HttpUtil = NativeModules.HttpUtil;
const baseUrl = Config.uploadUrl; //服务器地址

function _doParseResult(result) {
    let bSuc = false;
    bSuc = result == 0;

    if (!bSuc) {
        ToastUtil.showCenter("上传失败")
    }

    return bSuc;
}

/**
 * 上传文件
 */
async function uploadFile(path, fileId, logoType) {
    path = path.replace('file:///', '/')
    const sign = CryptoJS.MD5(`fileId=${fileId}&logoType=${logoType}&userId=${UserInfoCache.userId}${APP_KEY}`).toString()
    const url = baseUrl + `/resource/upload.do?logoType=${logoType}&fileId=${fileId}&sign=${sign}&userId=${UserInfoCache.userId}`
    const result = await HttpUtil.uploadFile(url, path)

    //因为上传成功，返回0，非0则失败，上传动态视频需要拿到视频第一帧，所以注释掉
    // return _doParseResult(result);
    return result;
}

const UploadModel = {
    /**
     * 使用fetch实现图片上传(默认上传头像)
     * @param {string}      path       图片路径
     * @param {string}      logoType   头像 "user"
     * @param {string}      fileId     头像 userId
     */
    async uploadImage(path, logoType = "user", fileId = UserInfoCache.userId) {
        let sign = CryptoJS.MD5(`fileId=${UserInfoCache.userId}&logoType=user&userId=${UserInfoCache.userId}${APP_KEY}`).toString();
        path = path.replace("file:///", "/");
        let url = baseUrl + `/resource/upload.do?logoType=${logoType}&fileId=${fileId}&sign=${sign}&userId=${UserInfoCache.userId}`
        // console.log("上传图片地址：", url);
        let res = await HttpUtil.uploadFile(url, path);

        // console.log("上传图片结果：", res);
        return _doParseResult(res);
    },

    /**
     * 上传身份证
     * @param {string}      path       图片路径
     * @param {bool}      bFront     身份证正反
     */
    async uploadCertificationImage(path, bFront) {
        path = path.replace("file:///", "/");
        let sign = CryptoJS.MD5(`fileId=${UserInfoCache.userId}${bFront ? "/1" : "/2"}&logoType=user_certification&userId=${UserInfoCache.userId}${APP_KEY}`).toString()

        let url = baseUrl + `/resource/upload.do?logoType=user_certification&fileId=${UserInfoCache.userId}${bFront ? "/1" : "/2"}&sign=${sign}&userId=${UserInfoCache.userId}`
        // console.log("上传图片地址：", url);

        let res = await HttpUtil.uploadFile(url, path);

        // console.log("上传图片结果：", res);
        return _doParseResult(res);
    },

    /**
     * 房间头像
     * @param {string}      path       图片路径
     * @param {string}      roomId     房间Id
     */
    async uploadRoomImage(path, roomId) {
        path = path.replace("file:///", "/");

        let sign = CryptoJS.MD5(`fileId=${roomId}&logoType=room&userId=${UserInfoCache.userId}${APP_KEY}`).toString()

        let url = baseUrl + `/resource/upload.do?logoType=room&fileId=${roomId}&sign=${sign}&userId=${UserInfoCache.userId}`
        // console.log("上传图片地址：", url);

        let res = await HttpUtil.uploadFile(url, path);

        // console.log("上传图片结果：", res);
        return _doParseResult(res);
    },

    /**
     * 上传客户端日志
     * @param {string} zipFilePath 
     */
    async uploadXLog(zipFilePath) {
        let sign = CryptoJS.MD5(`fileName=xlog&userId=${UserInfoCache.userId}${APP_KEY}`).toString()

        let url = baseUrl + `/applog/uploadLogFile.do?fileName=xlog&sign=${sign}&userId=${UserInfoCache.userId}`

        let res = await HttpUtil.uploadFile(url, zipFilePath);

        return _doParseResult(res);
    },

    /**
     * 上传音频文件
     */
    async uploadVoiceFile(path) {
        uploadFile(path, `${UserInfoCache.userId}/${CryptoJS.MD5(path)}`, 'voice')
    },

    /**
     * 上传视频文件
     */
    async uploadVideoFile(path) {
        uploadFile(path, `${UserInfoCache.userId}/${CryptoJS.MD5(path)}`, 'video')
    },

    /**
     * 声优认证上传音频文件
     */
    async uploadAnnouncerCertificatioVoiceFile(path, timestamp) {
        let res = await uploadFile(path, `${UserInfoCache.userId}/${timestamp}`, EUploadType.ANNOUNCER_AUDIO);
        return res;
    },

    /**
     * 声优认证上传视频文件
     */
    async uploadAnnouncerCertificatioVideoFile(path, timestamp) {
        let res = await uploadFile(path, `${UserInfoCache.userId}/${timestamp}`, EUploadType.ANNOUNCER_VIDEO);
        return res;
    },

    /**
     * 声优认证上传图片
     */
    async uploadAnnouncerCertificatioPicFile(path, timestamp) {
        let res = await uploadFile(path, `${UserInfoCache.userId}/${timestamp}`, EUploadType.ANNOUNCER_PIC);
        return res;
    },

    /**
     * 公屏IM上传图片
     */
    async uploadRoomChatPicFile(path, timestamp) {
        let res = await uploadFile(path, `${UserInfoCache.userId}/${timestamp}`, EUploadType.PUBLIC_IMG);
        return res;
    },

    /**
     * 上传相册
     */
    async uploadAblum(path, timestamp) {
        let res = await uploadFile(path, `${UserInfoCache.userId}/${timestamp}`, 'userBanner')
        return res
    },


    /**
     * 动态图片
     */
    async uploadMomentPic(path, timestamp) {
        let res = await uploadFile(path, `${UserInfoCache.userId}/${timestamp}`, EUploadType.MOMENT_PIC)
        return res
    },

    /**
     * 动态视频
     */
    async uploadMomentVideo(path, timestamp) {
        let res = await uploadFile(path, `${UserInfoCache.userId}/${timestamp}`, EUploadType.MOMENT_VIDEO)
        // let result;
        // do {
        //     result = await fetch(Config.getThreadPublishVideoUrl(UserInfoCache.userId, res))
        //     await delay(1000)
        //     console.warn("+1s")
        // } while (result.status == 404)

        return res
    },

    /**
     * 动态录音
     */
    async uploadMomentVoice(path, timestamp) {
        let res = await uploadFile(path, `${UserInfoCache.userId}/${timestamp}`, EUploadType.MOMENT_VOICE)
        return res
    },

    /**
     * 话题封面图片
     */
    async uploadTopicPic(path, timestamp) {
        let res = await uploadFile(path, `${timestamp}`, EUploadType.MOMENT_TOPIC_PIC)
        return res
    },

}

export default UploadModel;