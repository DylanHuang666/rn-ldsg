'use strict';

//------------ 声网 -----------------------------

/**
 * 有人说话通知，
 * 一般用于显示波纹显示
 * 数据:
 * {
 *      uid : {
 *              volume,
 *              vad,
 *              }
 * }
 */
export const AGORA_ON_AUDIO_VOLUMN_INDICATION = "AGORA_ON_AUDIO_VOLUMN_INDICATION";

/**
 * 播放音效结束通知
 * 数据：
 * null
 */
export const AGORA_AUDIO_EFFECT_FINISHED = "AGORA_AUDIO_EFFECT_FINISHED";


//------------ 腾讯IM -----------------------------

export const TX_IM_NEW_MSG = "TX_IM_NEW_MSG"; //新消息

export const TX_IM_FORCE_OFFLINE = "TX_IM_FORCE_OFFLINE"; //被踢下线

export const TX_IM_USER_SIG_EXPIRED = "TX_IM_USER_SIG_EXPIRED";//票据过期，需要换票后重新登陆

export const TX_IM_GROUP_TIPS = "TX_IM_GROUP_TIPS";//群提示消息


//------------ HttpUtil -----------------------------

/**
 * 文件下载进度
 * {
 *  url,
 *  saveFolder,
 *  downloadBytes,
 *  fileSize,
 * }
 */
export const HTTP_UTIL_DOWNLOAD_FILE_PROGRESS = 'HTTP_UTIL_DOWNLOAD_FILE_PROGRESS';