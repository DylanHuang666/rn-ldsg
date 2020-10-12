/**
 * 配置
 */

'use strict';

import { NativeModules } from "react-native";
import moment from 'moment';
import { EUploadType } from "../hardcode/EUpload";


const server_config = __DEV__
    ? require('./servers/config.dev').default
    : require('./servers/config.xserver5').default
/**
 * appinit.do调用的服务器列表
 * 一个连不上，就用另外一个
 */
export const APP_INIT_SERVERS = server_config.APP_INIT_SERVERS;
export const APP_KEY = server_config.APP_KEY;


//-------------------- 换皮参数 -------------------------------------------------------------

export const LOGIN_APP_ID = 'lvdongshiguang';     //登录时候使用的，服务器用于确认是什么包
export const H5_appPlatform = 'lvdongshiguang' //h5传参

//-------------------------------------------------------------------------------------------

export const WECHAT_APPID = "wx8fff93d81b3c079d";//微信开发 appId
export const WECHAT_API_SECRET = "4a712dd0a8ca7219087937361b87e692";
export const QQ_APP_ID = "1109236638";//QQ开发 appId


const RN_IMG_SERVER = 'http://xvoice-outtest-1301112906.image.myqcloud.com/app/rn/lvdongshiguang/';   //用来放本地定死的图片，这个跟包吧

let _serverConfig = {
    // "logicHost": "139.199.10.60",
    // "h5Port": 8082,
    // "centerServer": "http://centertest.app.liyu12.com",
    // "appServer": 'http://apptest.liyu12.com',
    // "cdnServer": "https://xvoice-outtest-1301112906.file.myqcloud.com",
    // "resServer": "http://restest.liyu12.com",
    // "apiServer": "http://apitest.liyu12.com",
    // "logoServer": "http://xvoice-outtest-1301112906.image.myqcloud.com",
    // "musicServer": "https://xvoice-outtest-1301112906.file.myqcloud.com",
    // "officialServer": "http://www.liyu12.com",
    // "h5Server": "http://activiytest.liyu12.com",
    // "IMAccountId": "1400341243",
    // "voiceAccountId": "06748cadbbcd43b9a3c8d546ed3fe507",
};

let sm_mobileInfo;

const Config = {
    /***
     * 获取app id
     */
    get appId() {
        return LOGIN_APP_ID
    },

    /**
     * 获得手机信息
     * {channel, deviceId, model, release, imei, mac, isEmu}
     */
    get mobileInfos() {
        return sm_mobileInfo;
    },

    get H5_appPlatform() {
        return H5_appPlatform
    },
    /**
     * 获得手机信息，从底层获取
     * {channel, deviceId, model, release, imei, mac, isEmu}
     */
    async getMobileInfosAsync() {
        const info = await NativeModules.PackageInfo.getMobileInfos();
        if (info) {
            sm_mobileInfo = info;
        }
        return sm_mobileInfo;
    },

    /**
     * 获得包的versionName
     */
    get version() {
        //NativeModules.PackageInfo.applicationId;
        // NativeModules.PackageInfo.versionCode
        return NativeModules.PackageInfo.versionName;
    },

    /**
     * appInit成功后，更新服务器配置
     * @param {object} vo 
     */
    updateServerConfig(vo) {
        if (!vo) return false;

        // "logicHost": "139.199.10.60",
        // "h5Port": 8082,
        // "centerServer": "http://centertest.app.liyu12.com",
        // "appServer": 'http://apptest.liyu12.com',
        // "cdnServer": "https://xvoice-outtest-1301112906.file.myqcloud.com",
        // "resServer": "http://restest.liyu12.com",
        // "apiServer": "http://apitest.liyu12.com",
        // "logoServer": "http://xvoice-outtest-1301112906.image.myqcloud.com",
        // "musicServer": "https://xvoice-outtest-1301112906.file.myqcloud.com",
        // "officialServer": "http://www.liyu12.com",
        // "h5Server": "http://activiytest.liyu12.com",
        // "IMAccountId": "1400341243",
        // "voiceAccountId": "06748cadbbcd43b9a3c8d546ed3fe507",
        if (
            !vo.logicHost
            || !vo.h5Port
            || !vo.centerServer
            || !vo.appServer
            || !vo.cdnServer
            || !vo.resServer
            || !vo.apiServer
            || !vo.logoServer
            || !vo.musicServer
            || !vo.officialServer
            || !vo.h5Server
            || !vo.IMAccountId
            || !vo.voiceAccountId
        ) {
            return false;
        }

        for (let k in vo) {
            _serverConfig[k] = vo[k];
        }

        return true;
    },

    /**
     * 拼接api调用接口的url
     * @param {string} api 
     */
    getApiUrl(api) {
        if (!_serverConfig.apiServer) {
            return null;
        }
        return _serverConfig.apiServer + api;
    },

    /**
     * 拼接app服务器调用接口的url
     * @param {string} api 
     */
    getAppUrl(api) {
        if (!_serverConfig.appServer) {
            return null;
        }
        return _serverConfig.appServer + api;
    },

    geth5Url(url) {
        if (!_serverConfig.h5Server) {
            return null;
        }
        return _serverConfig.h5Server + url
    },

    /**
     * 获得websocket的url
     */
    get webSocketUrl() {
        if (!_serverConfig.logicHost) {
            return null;
        }
        return `ws://${_serverConfig.logicHost}:${_serverConfig.h5Port}`;
    },

    /**
     * 当多次连接websocket失败的时候，清除配置
     * 让下次连接的时候重新appInit
     */
    clearWebSocket() {
        _serverConfig.logicHost = null;
    },

    /**
     * 中心服url
     */
    get centerUrl() {
        if (!_serverConfig.centerServer) {
            return null;
        }
        return _serverConfig.centerServer + '/App';
    },

    /**
     * 上传资源url
     */
    get uploadUrl() {
        if (!_serverConfig.resServer) {
            return null;
        }
        return _serverConfig.resServer;
    },

    /**
     * 获得静态数据表下载url
     * @param {string} tableName 表名
     * @param {int} version 版本号
     */
    getStaticTableUrl(tableName, version) {
        if (!_serverConfig.cdnServer) {
            return null;
        }

        return `${_serverConfig.cdnServer}/app/data/${tableName}?${version}`;
    },

    /**
     * 这个字段不知道干啥，貌似跟游客有关系
     */
    get isNew() {
        return _serverConfig.isNew;
    },

    /**
     * 获得腾讯云通讯的sdk app Id
     */
    get imSdkAppId() {
        return _serverConfig.IMAccountId;
    },

    /**
     * 获得声网的app id
     */
    get agoraSdkAppId() {
        return _serverConfig.voiceAccountId;
    },

    /**
     * 获取设计定死图片的url
     * @param {String} url 
     * @param {int} logoTime 
     * @param {int} width 
     * @param {int} height 
     * @param {int} quality 
     */
    getRNImageUrl(url, logoTime, width, height, quality) {
        let ret = `${RN_IMG_SERVER}${url}?imageView2/0`;
        // if ((ret + "").indexOf("?imageView2/0") === -1) {
        //     ret += "?imageView2/0";
        // }

        if (width) {
            ret += '/w/' + width;
        }
        if (height) {
            ret += '/h/' + height;
        }

        if (quality) {
            ret += '/q/' + quality;
        }

        if (logoTime) {
            ret += '&' + logoTime;
        }

        return ret;
    },

    /**
    * 获得头像的url
    * @param {string} userId           用户id
    * @param {number} logoTime         头像版本号，主要处理自定义头像的更新问题
    * @param {string} thirdIconUrl     第三方头像(qq、微信)
    * @param {number} size             图片分辨率，例如传入40，就是 40 * 40
    * @returns {string}
    */
    getHeadUrl(userId, logoTime, thirdIconUrl, size) {
        let sizeString = size ? `/w/${size}/h/${size}` : "";
        if (logoTime > 0 || thirdIconUrl == userId) {
            if (!_serverConfig.logoServer) {
                return '';
            }
            return `${_serverConfig.logoServer}/app/logo/user/${userId}?imageView2/auto-orient${sizeString}&logotime=${logoTime}`;
        }

        if (!_serverConfig.logoServer) {
            return '';
        }

        if (thirdIconUrl != "") {
            return this.getRandomAvatar(thirdIconUrl, size);
        } else {
            return `${_serverConfig.logoServer}/app/logo/user/${userId}?imageView2/auto-orient${sizeString}&logotime=${logoTime}`;
        }

    },

    /**
     * 获取用户Banner URL
     * @param {*} userId 
     * @param {*} photoId 
     */
    getUserBannerUrl(userId, photoId) {
        return `${_serverConfig.logoServer}/app/logo/userBanner/${userId}/${photoId}`
    },

    /**
     * 获取Cos文件
     * @param {*} userId 
     * @param {*} key 文件名
     */
    getPublicImgUrl(userId, key) {
        if (!_serverConfig.logoServer) {
            return '';
        }
        return `${_serverConfig.logoServer}/app/${EUploadType.PUBLIC_IMG}/${userId}/${key}`;

    },

    /**
     * 获取话题封面的图片
     * @param {*} key 文件名
     */
    getTopicPicUrl(key) {
        if (!_serverConfig.logoServer) {
            return '';
        }
        return `${_serverConfig.logoServer}/app/${EUploadType.MOMENT_TOPIC_PIC}/${key}`;

    },

    /**
     * 获取发动态的图片
     * @param {*} userId 
     * @param {*} key 文件名
     */
    getThreadPublishPicUrl(userId, key) {
        if (!_serverConfig.logoServer) {
            return '';
        }
        return `${_serverConfig.logoServer}/app/${EUploadType.MOMENT_PIC}/${userId}/${key}`;

    },

    /**
     * 获取发动态的视频
     * @param {*} userId 
     * @param {*} key 文件名
     */
    getThreadPublishVideoUrl(userId, key) {
        if (!_serverConfig.cdnServer) {
            return '';
        }
        return `${_serverConfig.cdnServer}/app/${EUploadType.MOMENT_VIDEO}/${userId}/${key}`;

    },

    /**
     * 获取发动态的音频
     * @param {*} userId 
     * @param {*} key 文件名
     */
    getThreadPublishAudioUrl(userId, key) {
        if (!_serverConfig.cdnServer) {
            return '';
        }
        return `${_serverConfig.cdnServer}/app/${EUploadType.MOMENT_VOICE}/${userId}/${key}`;

    },

    /**
     * 获取声优认证的音频
     * @param {*} userId 
     * @param {*} key 文件名
     */
    getAnnouncerCertificatioAudioUrl(userId, key) {
        if (!_serverConfig.cdnServer) {
            return '';
        }
        return `${_serverConfig.cdnServer}/app/${EUploadType.ANNOUNCER_AUDIO}/${userId}/${key}`;

    },

    /**
     * 获取声优认证的视频
     * @param {*} userId 
     * @param {*} key 文件名
     */
    getAnnouncerCertificatioVideoUrl(userId, key) {
        if (!_serverConfig.cdnServer) {
            return '';
        }
        return `${_serverConfig.cdnServer}/app/${EUploadType.ANNOUNCER_VIDEO}/${userId}/${key}`;

    },

    /**
     * 获取声优认证的图片
     * @param {*} userId 
     * @param {*} key 文件名
     */
    getAnnouncerCertificatioPicUrl(userId, key) {
        if (!_serverConfig.logoServer) {
            return '';
        }
        return `${_serverConfig.logoServer}/app/${EUploadType.ANNOUNCER_PIC}/${userId}/${key}`;

    },

    /**
     * 获得万象有图的 app/logo/??? 的 url
     * @param {String} url 
     * @param {int} logoTime 
     * @param {int} width 
     * @param {int} height 
     * @param {int} quality 
     */
    getLogoUrl(url, logoTime, width, height, quality) {
        if (!_serverConfig.logoServer) {
            return null;
        }

        let ret = `${_serverConfig.logoServer}/app/logo/${url}?imageView2/0`;
        // if ((ret + "").indexOf("?imageView2/0") === -1) {
        //     ret += "?imageView2/0";
        // }

        if (width) {
            ret += '/w/' + width;
        }
        if (height) {
            ret += '/h/' + height;
        }

        if (quality) {
            ret += '/q/' + quality;
        }

        if (logoTime) {
            ret += '&' + logoTime;
        }

        return ret;
    },

    /**
     * 获得cdn文件url
     * @param {String} url 
     * @param {int} version 
     */
    getCdnFileUrl(url, version) {
        if (!_serverConfig.cdnServer) {
            return null;
        }

        return version
            ? `${_serverConfig.cdnServer}/${url}?${version}`
            : `${_serverConfig.cdnServer}/${url}`;
    },

    /**
     * 
     * @param {string} userId 
     * @param {number} logoTime 
     * @param {string} thirdIconUrl 
     */
    getRoomUserHeadUrl(userId, logoTime, thirdIconUrl) {
        if (userId != "" && (logoTime > 0 || thirdIconUrl == userId)) {
            return `${_serverConfig.logoServer}/app/logo/user/${userId}?logotime=${logoTime}`;
        }
        if (thirdIconUrl != "") {
            return `${_serverConfig.logoServer}/app/logo/randomlogo/${thirdIconUrl}.jpg`;
        }
        return "";
    },

    /**
    * 获得聊天室的url
    * @param {string} roomLogoTime     聊天室版本号
    * @param {string} roomId           聊天室id
    * @param {string} userId           用户id
    * @param {number} logoTime         头像版本号，主要处理自定义头像的更新问题
    * @param {string} thirdIconUrl     第三方头像(qq、微信)
    * @param {number} size             图片分辨率，例如传入40，就是 40 * 40
    * @returns {string}
    */
    getRoomCreateLogoUrl(roomLogoTime, roomId, userId, logoTime, thirdIconUrl, size) {
        if (roomLogoTime <= 0) {
            return this.getHeadUrl(userId, logoTime, thirdIconUrl);
        }

        if (!_serverConfig.logoServer) {
            return null;
        }
        return this.getRoomLogoUrl(roomLogoTime, roomId, size)
    },


    getRoomLogoUrl(roomLogoTime, roomId, size) {
        let sizeString = size ? `/w/${size}/h/${size}` : "";
        return `${_serverConfig.logoServer}/app/logo/room/${roomId}?imageView2/auto-orient/rq/100${sizeString}/roomLogoTime/${roomLogoTime}`;
    },

    /**
     * 获得大表情cdn路径
     * @param {String} fileName 
     * @param {int}     logoTime
     */
    getRecreationUrl(fileName) {
        if (!_serverConfig.cdnServer) {
            return null;
        }
        return `${_serverConfig.cdnServer}/app/logo/recreation/${fileName}`;
    },

    /**
     * 获得魔法表情cdn路径
     * @param {String} fileName 
     * @param {int}     logoTime
     */
    getMagicFlash(fileName, logoTime) {
        if (!_serverConfig.cdnServer) {
            return null;
        }
        return `${_serverConfig.cdnServer}/app/logo/magic/${fileName}?${logoTime}`;
    },

    /**
     * 获得魔法表情抽取结果图片路径
     * @param {string} flashName 
     * @param {int} result 
     * @param {int} logoTime 
     */
    getMagicResult(flashName, result, logoTime) {
        if (!_serverConfig.logoServer) {
            return null;
        }
        return `${_serverConfig.logoServer}/app/logo/magic/${flashName}/${result}.png?${logoTime}`;
    },

    /**
     * 获得Banner的url，用于拼接后端传来的图片url
     * @param {String} url 
     */
    getBannerUrl(url) {
        if (!_serverConfig.logoServer) {
            return "";
        }
        return `${_serverConfig.logoServer}/app/logo/${url}`;
    },

    /**
     * 获得公屏图片消息的url
     * @param {String} url 
     */
    gettPublicImageUrl(url) {
        if (!_serverConfig.cdnServer) {
            return null;
        }
        return `${_serverConfig.logoServer}/app/publicimg/${url}`;
    },

    /**
             * 获得活动配置的跑道背景或者公屏气泡
             * @param {String} url 
             */
    getActivityImageUrl(url) {
        if (!_serverConfig.cdnServer) {
            return null;
        }
        return `${_serverConfig.logoServer}/app/${EUploadType.BROAD_MEDIA_PIC}/${url}`;
    },

    /**
     * 获得礼物的url
     * @param {string} giftId           礼物id
     * @param {int} logoTime
     * @returns {string}
     */
    getGiftUrl(giftId, logoTime) {
        if (!_serverConfig.logoServer) {
            return "";
        }
        return `${_serverConfig.logoServer}/app/logo/gift/${giftId}?${logoTime}`;
    },

    /**
       * 获得活动配置的跑道背景或者公屏气泡
       * @param {String} url 
       */
    getActivityImageUrl(url) {
        if (!_serverConfig.cdnServer) {
            return null;
        }
        return `${_serverConfig.logoServer}/app/${EUploadType.BROAD_MEDIA_PIC}/${url}`;
    },

    /**
    * 获取随机头像
    * @param {string} value           value
    * @param {number} size             图片分辨率，例如传入40，就是 40 * 40
    * @returns {string}
    */
    getRandomAvatar(value, size) {
        let sizeString = size ? `/w/${size}/h/${size}` : "";
        if (!_serverConfig.logoServer) {
            return "";
        }

        return `${_serverConfig.logoServer}/app/logo/randomlogo/${value}.jpg?imageView2/auto-orient${sizeString}`;
    },

    /**
     * 获取头像框
     * @param {string} headFrameId 
     * @param {string} updateTime 
     */
    getHeadFrameIdUrl(headFrameId, updateTime) {
        if (!_serverConfig.logoServer) {
            return "";
        }

        return `${_serverConfig.logoServer}/app/logo/avatarbox/${headFrameId}?${updateTime}`;
    },

    /**
     * 获取商场头像框
     * @param {string} headFrameId 
     * @param {string} updateTime 
     */
    getShopHeadFrameIdUrl(headFrameId, updateTime) {
        if (!_serverConfig.logoServer) {
            return "";
        }

        return `${_serverConfig.logoServer}/app/logo/avatarboxshop/${headFrameId}?${updateTime}`;
    },

    /**
     * 获取座驾静态图片地址
     * @param {string} carId 
     * @param {string} updateTime 
     */
    getCarUrl(carId, updateTime) {
        if (!_serverConfig.logoServer) {
            return "";
        }

        return `${_serverConfig.logoServer}/app/logo/car/${carId}?${updateTime}`;
    },

    /**
     * 获取座驾动画态图片地址
     * @param {string} carId 
     * @param {string} updateTime 
     */
    getCarAnimationUrl(carId, updateTime) {
        if (!_serverConfig.logoServer) {
            return "";
        }

        return `${_serverConfig.logoServer}/app/logo/caranimation/${carId}?${updateTime}`;
    },


    /**
     * 获取动画礼物url
     * @param {String} animationName 
     * @param {String} time 
     */
    getAnimaorUrl(animationName, time) {
        if (!_serverConfig.logoServer) {
            return "";
        }
        return `${_serverConfig.logoServer}/app/logo/giftanimation/${animationName}?time${time}`;
    },

    /**
     * 获得房间背景url
     * @param {String} backgroundId 
     * @param {string} updateTime
     * @param {Boolean} bJpg 
     */
    getVoiceRoomBackgroundUrl(backgroundId, updateTime, bJpg) {
        if (!_serverConfig.logoServer) {
            return "";
        }

        if (bJpg) {
            return `${_serverConfig.logoServer}/app/logo/voiceroombackgroundthumbnail/${backgroundId}?imageView2/auto-orient/format/jpg&v=${updateTime}`;
        }

        return `${_serverConfig.logoServer}/app/logo/voiceroombackgroundanimation/${backgroundId}?${updateTime}`;
    },

    /**
     * 获取IM时间
     * @param {long} timestamp 
     */
    getIMStatusTime(timestamp) {
        let time = "";
        try {
            if (moment(timestamp).isSame(new Date(), "day")) {
                //今天
                time = moment(timestamp).format("a") == ("pm") ? "下午" + moment(timestamp).format("HH:mm") : "上午" + moment(timestamp).format("HH:mm");
            } else {
                time = moment(timestamp).format("MM-DD");
            }
        } catch (err) {
            return ""
        }
        return time;
    },

    /**
     * 判断俩时间间隔
     * @param {long} timestamp1 
     * @param {long} timestamp2 
     * @param {int} number 
     * @param {string} unit //years || quarters || months || weeks || days || hours || minutes || seconds || milliseconds
     */
    isTimeBefore(timestamp1, timestamp2, number = 3, unit = "minutes") {
        return moment(timestamp1).add(number, unit).isBefore(moment(timestamp2));
    },

    /**
    * 获取宝箱的图片url
    * @param {string} boxid 文件名
    * @param {string} time
    */
    getTreasureBoxIconUrl(boxid, time) {
        if (!_serverConfig.logoServer) {
            return '';
        }
        time = moment(time).valueOf();
        return `${_serverConfig.logoServer}/app/logo/treasureBox/${boxid}?${time}`;

    },

    /**
     * 获得宝箱动画cdn
     * @param {String} fileName 
     * @param {string} time
     */
    getTreasureBoxAnimationUrl(fileName, time) {
        if (!_serverConfig.cdnServer) {
            return null;
        }
        time = moment(time).valueOf();
        return `${_serverConfig.cdnServer}/app/publicFlash/${fileName}.zip?${time}`;
    },
};

export default Config;