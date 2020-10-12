/**
 * 静态数据表
 */

'use strict';

import { NativeModules } from "react-native";
import Config from "../../configs/Config";
import HClientTables from "../../hardcode/HClientTables";
import HResultStatus from "../../hardcode/HResultStatus";
import PromiseResolveQueue from "../../utils/PromiseResolveQueue";
import ApiModel from "../network/ApiModel";

const _native_getStaticDataTable = NativeModules.HttpUtil.getStaticDataTable;


async function _doGetStaticDataTable(tableVo, fnOnCache) {
    //没有版本号要调用api接口获取
    if (tableVo.version === undefined) {
        let res = await ApiModel.requestTableVersion(tableVo.tableName);

        if (HResultStatus.Success != res.state) {
            return null;
        }

        if (!res.data || res.data.length != 1) {
            return null;
        }

        tableVo.version = res.data[0];
    }

    //检查缓存的版本号是否是最新的
    if (tableVo.version === tableVo.dataVersion) {
        return tableVo.data;
    }

    let url = Config.getStaticTableUrl(tableVo.tableName, tableVo.version);
    if (!url) {
        const bSuc = await ApiModel.appInit();
        if (!bSuc) {
            //appInit不成功
            return null;
        }
        url = Config.getStaticTableUrl(tableVo.tableName, tableVo.version);
    }

    //从引擎内部读取
    let data
    try {
        data = await _native_getStaticDataTable(url);
    } catch (error) {
        return null;
    }

    //缓存处理
    if (fnOnCache) {
        tableVo.data = data;
        tableVo.dataVersion = tableVo.version;
        fnOnCache(tableVo);
    }

    return data;
}

/**
 * 获得数据表数据
 * @param {HClientTables.???} tableVo
 */
function _getStaticDataTable(tableVo, fnOnCache) {
    return new Promise(async (resolve, reject) => {
        if (!tableVo) {
            console.error('不能传入 HClientTables.??? == null');
            resolve(null);
            return;
        }

        //检查缓存的版本号是否是最新的
        if (tableVo.data && tableVo.version === tableVo.dataVersion) {
            return tableVo.data;
        }

        if (tableVo.getting) {
            tableVo.getting.add(resolve);
            return;
        }

        tableVo.getting = new PromiseResolveQueue(resolve);

        const result = await _doGetStaticDataTable(tableVo, fnOnCache);

        const queue = tableVo.getting;
        tableVo.getting = null;
        queue.end(result);
    });

}

/**
 * 获得数据表url
 * @param {HClientTables.???} tableVo
 */
async function _getStaticDataTableUrl(tableVo) {
    if (!tableVo) {
        console.error('不能传入 HClientTables.??? == null');
        return null;
    }

    //检查缓存的版本号是否是最新的
    if (tableVo.data && tableVo.version === tableVo.dataVersion) {
        return Config.getStaticTableUrl(tableVo.tableName, tableVo.version);
    }

    //没有版本号要调用api接口获取
    if (tableVo.version === undefined) {
        let res = await ApiModel.requestTableVersion(tableVo.tableName);

        if (HResultStatus.Success != res.state) {
            return null;
        }

        if (!res.data || res.data.length != 1) {
            return null;
        }

        tableVo.version = res.data[0];
    }

    //检查缓存的版本号是否是最新的
    if (tableVo.version === tableVo.dataVersion) {
        return Config.getStaticTableUrl(tableVo.tableName, tableVo.version);
    }

    let url = Config.getStaticTableUrl(tableVo.tableName, tableVo.version);
    if (!url) {
        const bSuc = await ApiModel.appInit();
        if (!bSuc) {
            //appInit不成功
            return null;
        }
        url = Config.getStaticTableUrl(tableVo.tableName, tableVo.version);
    }
    return url;
}

function _doQueryIds(tableVo, ids) {
    const ret = new Array(ids.length);
    for (let i = ret.length - 1; i >= 0; --i) {
        ret[i] = tableVo.dataMap[ids[i]];
    }
    return ret;
}

//-------------------  状态码表 -------------------------------------------------------

function _onCacheResultStatus(tableVo) {
    tableVo.dataMap = {};
    for (let vo of tableVo.data) {
        tableVo.dataMap[vo.status] = vo;
    }
}

/**
 * 根据状态码，回调数据
 * @param {int} state 
 * @param {Function} fnGot 
 */
export const getResultStatus = (state, fnGot) => {
    // "keys":["status","name","zh_cn","tw_cn","en"]
    const tableVo = HClientTables.ResultStatus;

    if (tableVo.data && tableVo.version === tableVo.dataVersion) {
        fnGot(tableVo.dataMap[state], state);
        return;
    }

    _getStaticDataTable(tableVo, _onCacheResultStatus)
        .then(data => {
            if (!data) {
                fnGot(null, state);
                return;
            }

            fnGot(tableVo.dataMap[state], state);

        });
}


//-------------------  公共配置表 -------------------------------------------------------

function _onCachePublicConfig(tableVo) {
    tableVo.dataMap = {};
    for (let vo of tableVo.data) {
        tableVo.dataMap[vo.id] = vo;
    }
}

/**
 * 根据id列表查找公共配置数据
 * @param {int[]} ids 
 */
export const getPublicConfigByIds = async (ids) => {
    // "keys":["id","value","desc"]
    const tableVo = HClientTables.PublicConfig;

    if (tableVo.data && tableVo.version === tableVo.dataVersion) {
        return _doQueryIds(tableVo, ids);
    }

    const data = await _getStaticDataTable(tableVo, _onCachePublicConfig);
    if (!data) {
        return [];
    }

    return _doQueryIds(tableVo, ids);
}

/**
 * 根据id查找公共配置
 * @param {int} id 
 */
export const getPublicConfig = async (id) => {
    // "keys":["id","value","desc"]
    const tableVo = HClientTables.PublicConfig;

    if (tableVo.data && tableVo.version === tableVo.dataVersion) {
        return tableVo.dataMap[id];
    }

    const data = await _getStaticDataTable(tableVo, _onCachePublicConfig);
    if (!data) {
        return null;
    }

    return tableVo.dataMap[id];
}

//-------------------  充值表 -------------------------------------------------------

/**
 * 获得充值列表数据
 */
export const getRechargeTableData = async () => {
    // "keys":["id","desc","os","type","goldShell","price","addGoldShell","firstAddGoldShell","buyLimit","goods","validTime"]
    const list = await _getStaticDataTable(HClientTables.Recharge);
    if (!list) {
        return null
    }

    const ret = []

    for (let vo of list) {
        if (vo.os == "1") {
            ret.push(vo)
        }
    }

    return ret
}

/**
 * 获取所有充值列表数据，不筛选平台
 */
export const getAllRechargeData = async () => {
    // "keys":["id","desc","os","type","goldShell","price","addGoldShell","firstAddGoldShell","buyLimit","goods","validTime"]
    const list = await _getStaticDataTable(HClientTables.Recharge);
    if (!list) {
        return []
    }
    return list
}

//-------------------  CS_ChannelInfo 表数据 -------------------------------------------------------


/**
 * 获取GiftList表数据
 */
export function getChannelInfo() {
    // "keys":["channelid","channelname","version","downloadurl","forceupdate","iospaytype","issanbox","desc","newvisitor","oldvisitor"]
    return _getStaticDataTable(HClientTables.CS_ChannelInfo);
}

//-------------------  GiftList表数据 -------------------------------------------------------

function _onCacheGiftList(tableVo) {
    tableVo.dataMap = {};
    for (let vo of tableVo.data) {
        tableVo.dataMap[vo.giftid] = vo;
    }
}

/**
 * 获取GiftList表数据
 */
export const getGiftListTableData = async () => {
    //"keys":["alterdatetime","animationname","descs","duration","endtime","funlevel","giftid","giftlabelid","giftname","gifttype","id","include","isvip","isvoice","pranktype","price","roomids","sequenceid","showarea","showtype","starttime","valid","visibleroomtype"]

    const tableVo = HClientTables.CS_GiftList;

    if (tableVo.data && tableVo.version === tableVo.dataVersion) {
        return tableVo.data
    }

    const data = await _getStaticDataTable(tableVo, _onCacheGiftList);

    if (!data) {
        return [];
    }

    return data
}


export const getGiftById = async (id) => {
    // "keys":["alterdatetime","animationname","descs","duration","endtime","funlevel","giftid","giftlabelid","giftname","gifttype","id","include","isvip","isvoice","pranktype","price","roomids","sequenceid","showarea","showtype","starttime","valid","visibleroomtype"]
    const tableVo = HClientTables.CS_GiftList;


    if (tableVo.data && tableVo.version === tableVo.dataVersion) {
        return tableVo.dataMap[id];
    }

    const data = await _getStaticDataTable(tableVo, _onCacheGiftList);

    if (!data) {
        return null;
    }

    return tableVo.dataMap[id];
}


//-------------------  大表情表数据 -------------------------------------------------------

function _parsePlayType(data) {
    if (!data.playType) {
        //不合法的数据类型
        console.warn(data);
        data.playType = 0;
        return;
    }

    const a = data.playType.split(',');
    if (!a) {
        //不合法的数据类型
        console.warn(data);
        data.playType = 0;
        return;
    }

    const al = a.length;
    const playType = a[0];

    if ('1' == playType) {
        // 1、直接播放动画
        // 格式：1,最后一帧停留秒数
        if (al != 2) {
            //不合法的数据类型
            console.warn(data);
            data.playType = 0;
            return;
        }
        data.playType = 1;
        data.stopTick = Math.ceil(Number(a[1]) * 1000);
        return;
    }

    if ('2' == playType) {
        // 2、播放到指定帧后，逐一显示抽取图片
        // 格式：2,最后一帧停留秒数,旧图片前缀,新图片前缀,指定帧序号,指定帧序号…,指定帧序号
        if (al < 5) {
            //不合法的数据类型
            console.warn(data);
            data.playType = 0;
            return;
        }
        data.playType = 2;
        data.stopTick = Math.ceil(Number(a[1]) * 1000);
        data.oldPrevName = a[2];
        data.newPrevName = a[3];
        data.frameIndex = [];
        for (let i = 4; i < al; ++i) {
            data.frameIndex.push(parseInt(a[i]));
        }
        return;
    }

    if ('3' == playType) {
        // 3、播放一次后，定在抽取的帧
        // 格式：3,最后一帧停留秒数,最后非抽取帧序号

        if (al != 3) {
            console.warn(data);
            data.playType = 0;
            return;
        }

        data.playType = 3;
        data.stopTick = Math.ceil(Number(a[1]) * 1000);
        data.frameIndex = parseInt(a[2]);
        return;
    }

    //不合法的数据类型
    console.warn(data);
    data.playType = 0;
}

function _onCacheRecreation(tableVo) {
    tableVo.dataMap = {};
    for (let vo of tableVo.data) {
        _parsePlayType(vo);
        tableVo.dataMap[vo.id] = vo;
    }
}

/**
 * 获取大表情数据
 */
export const getRecreation = async () => {
    // "keys":["id","name","playType","num","range","msg","flashName","flashVersion","isShowScreen"]
    const tableVo = HClientTables.RecreationConfig;

    if (tableVo.data && tableVo.version === tableVo.dataVersion) {
        return tableVo.data
    }

    const data = await _getStaticDataTable(tableVo, _onCacheRecreation);

    if (!data) {
        return [];
    }

    return data
}

export const getRecreationById = async (id) => {
    const tableVo = HClientTables.RecreationConfig;
    await getRecreation();

    return tableVo.dataMap && tableVo.dataMap[id];
}


//-------------------  是否需要实名制认证表数据 -------------------------------------------------------

/**
 * 获取GiftList表数据
 */
export const getLiveSetUp = () => {
    // "keys":["identifymode","needrealname"]
    return _getStaticDataTable(HClientTables.CS_LiveSetUp);
}

//-------------------  音频房背景数据表 -------------------------------------------------------

/**
 * 获取音频房背景表数据
 */
export const getVoiceRoomBackground = async () => {
    // "keys":["animationname","backgroundid","createtime","endtime","id","name","price","starttime","updatetime","valid","visibleroom","weight"]
    const list = await _getStaticDataTable(HClientTables.CS_VoiceRoomBackground);
    if (!list) {
        return null;
    }

    const ret = [];

    const now = Date.now();
    for (let vo of list) {
        if (now > vo.endtime.toDateTimeTick()) continue;
        if (now < vo.starttime.toDateTimeTick()) continue;

        ret.push(vo);
    }

    return ret;
}


//-------------------  财富等级列表 -------------------------------------------------------
export const getRichLvList = async () => {
    return _getStaticDataTable(HClientTables.ContributeLevel)
}

//-------------------  魅力等级列表 -------------------------------------------------------
export const getCharmLvList = async () => {
    return _getStaticDataTable(HClientTables.CharmLevel)
}



//-------------------  充值页banner -------------------------------------------------------
export const getCommonBanner = async (moduleType) => {
    const list = await _getStaticDataTable(HClientTables.CS_CommonBanner);
    if (!list) {
        return []
    }

    const ret = []

    for (let vo of list) {
        if (vo == null) continue

        if (now > vo.endtime.toDateTimeTick()) continue;
        if (now < vo.starttime.toDateTimeTick()) continue;


        if (moduleType != vo.moduletype) continue

        let version = Config.version
        let channel = Config.channel

        let hideVersion

        if (!vo.versionhide) {
            hideVersion = vo.versionhide.split(",")
        }

        let hideChannel
        if (!vo.channel) {
            hideChannel = vo.channelhide.split(",")
        }

        let isAllVersion = "all" == vo.versionhide
        let isAllChannel = "all" == vo.channelhide

        let isHideVersion = hideVersion && hideVersion.indexOf(version) >= 0//>代表包含
        let isHideChannel = hideChannel && hideChannel.indexOf(channel) >= 0

        let isVisible = true
        if (isHideVersion || isHideChannel || isAllVersion || isAllChannel) {
            isVisible = false
        }

        if (isVisible && vo.state == 1 && vo.platform != 2) {
            ret.push(vo)
        }

    }
    return ret
}

//-------------------  转赠权限白名单 -------------------------------------------------------
export const getMoneyGivingList = async () => {
    const list = await _getStaticDataTable(HClientTables.MoneyGivingList);
    // console.log("转赠名单", list)
    if (!list) {
        return false
    }

    let giving = false;
    list.forEach(element => {
        if (element.userId == require("../../cache/UserInfoCache").default.userId) {
            giving = true
        }
    });
    return giving
}



//-------------------  机器人配置协议 -------------------------------------------------------
export const getFunRobotManual = async (createId) => {
    const list = await _getStaticDataTable(HClientTables.FunRobotManual)
    if (!list) {
        return false
    }
    let giving = false
    list.forEach(element => {
        if (element && element.userId == createId) {
            giving = true
        }
    })
    return giving
}


//-------------------  好友白名单表 -------------------------------------------------------

/**
 * 根据用户id查找白名单
 * @param {stting} userId 
 * @returns {Promise.resolve(HResultStatus.Fail | HResultStatus.Success | null)}
 * HResultStatus.Fail:      读表失败
 * HResultStatus.Success:   查到数据
 * null:                    没有找到
 */
export const getFriendRoomWrite = async userId => {
    // "keys":["userId"]
    const list = await _getStaticDataTable(HClientTables.FriendRoomWriteList);
    if (!list) {
        return HResultStatus.Fail;
    }

    for (const vo of list) {
        if (vo.userId == userId) {
            return HResultStatus.Success;
        }
    }
    return null;
}


//-------------------  视频房白名单表 -------------------------------------------------------

/**
 * 根据用户id查找白名单
 * @param {stting} userId 
 * @returns {Promise.resolve(HResultStatus.Fail | HResultStatus.Success | null)}
 * HResultStatus.Fail:      读表失败
 * HResultStatus.Success:   查到数据
 * null:                    没有找到
 */
export const getVideoRoomWhite = async userId => {
    // "keys":["userId"]
    const list = await _getStaticDataTable(HClientTables.VideoRoomWhiteList);
    if (!list) {
        return HResultStatus.Fail;
    }

    for (const vo of list) {
        if (vo.userId == userId) {
            return HResultStatus.Success;
        }
    }
    return null;
}

//-------------------  房间类型数据表 -------------------------------------------------------

function _onCacheRoomType(tableVo) {
    tableVo.dataMap = {};
    for (let vo of tableVo.data) {
        tableVo.dataMap[vo.id] = vo;
    }
}

/**
 * 房间类型数据表
 */
export const getRoomType = () => {
    // "keys":["icon","id","keyid","type"]
    const tableVo = HClientTables.RoomType;

    if (tableVo.data && tableVo.version === tableVo.dataVersion) {
        return tableVo.data;
    }

    return _getStaticDataTable(tableVo, _onCacheRoomType);
}

/**
 * 通过房间类型id查找房间类型名称
 */
export const getRoomTypeById = async (id) => {
    // "keys":["id","value","desc"]
    const tableVo = HClientTables.RoomType;

    if (tableVo.data && tableVo.version === tableVo.dataVersion) {
        return tableVo.dataMap[id];
    }

    const data = await _getStaticDataTable(tableVo, _onCacheRoomType);

    if (!data) {
        return null;
    }

    return tableVo.dataMap[id];

}


//-------------------  靓号 -------------------------------------------------------

function _onCacheCuteNumberManager(tableVo) {
    tableVo.dataMap = {};
    for (let vo of tableVo.data) {
        tableVo.dataMap[vo.sociatynumber] = vo;
    }
}

/**
 * 靓号展示数据表
 */
const _getCuteNumberManager = async () => {
    // "keys":["cutenumber","cutetypeid","datatype","endtime","id","istimerange","operatorloginname","sociatynumber","starttime","type","updatetime"]
    const tableVo = HClientTables.CS_CuteNumberManager;

    if (tableVo.data && tableVo.version === tableVo.dataVersion) {
        return tableVo.data;
    }

    const data = await _getStaticDataTable(tableVo, _onCacheCuteNumberManager);
    if (!data) {
        return null;
    }

    return tableVo.data;
}

function _onCacheCuteNumber(tableVo) {
    tableVo.dataMap = {};
    for (let vo of tableVo.data) {
        tableVo.dataMap[vo.id] = vo;
    }
}

/**
 * 获取靓号类型
 */
const _getCuteNumber = async () => {
    // "keys":["alterdatetime","icon","id","type"]
    const tableVo = HClientTables.CS_CuteNumber;

    if (tableVo.data && tableVo.version === tableVo.dataVersion) {
        return tableVo.data;
    }

    const data = await _getStaticDataTable(tableVo, _onCacheCuteNumber);
    if (!data) {
        return null;
    }

    return tableVo.data;
}

/**
 * 根据userId列表查找靓号
 * @param {string[]} userIds 
 * @returns {userId:String -> CS_CuteNumber}
 * null: 表示读表失败
 * {}:   表示读取成功
 */
export const getCuteNumberByUserIds = async userIds => {

    if (!userIds || userIds.length == 0) {
        return {};
    }

    const resultList = await Promise.all([
        // "keys":["cutenumber","cutetypeid","datatype","endtime","id","istimerange","operatorloginname","sociatynumber","starttime","type","updatetime"]
        _getCuteNumberManager(),//靓号id表

        // "keys":["alterdatetime","icon","id","type"]
        _getCuteNumber(),//靓号icon表
    ]);

    if (!resultList[0] || !resultList[1]) {
        return null;
    }
    const cuteNumberManagers = resultList[0];
    if (cuteNumberManagers.length == 0) {
        return {};
    }
    const cuteNumbers = resultList[1];
    if (cuteNumbers.length == 0) {
        return {};
    }

    const ret = {};

    const now = Date.now();

    for (const userId of userIds) {

        if (ret[userId]) continue;
        // "keys":["cutenumber","cutetypeid","datatype","endtime","id","istimerange","operatorloginname","sociatynumber","starttime","type","updatetime"]
        const cuteNumberManager = HClientTables.CS_CuteNumberManager.dataMap[userId];

        if (!cuteNumberManager) continue;
        // "keys":["alterdatetime","icon","id","type"]
        const cuteNumber = HClientTables.CS_CuteNumber.dataMap[cuteNumberManager.cutetypeid];

        if (!cuteNumber) continue;
        if (cuteNumberManager.type != '1') continue;

        // 判断时间是否有效
        if (now > cuteNumberManager.endtime.toDateTimeTick()) continue;
        if (now < cuteNumberManager.starttime.toDateTimeTick()) continue;
        cuteNumberManager.icon = cuteNumber.icon
        ret[userId] = cuteNumberManager;

    }

    // for (const cuteNumberManager of cuteNumberManagers) {
    //     // "keys":["cutenumber","cutetypeid","datatype","endtime","id","istimerange","operatorloginname","sociatynumber","starttime","type","updatetime"]
    //     if (cuteNumberManager.type != '1') continue;
    //     const userId = cuteNumberManager.sociatynumber;
    //     if (userIds.indexOf(userId) < 0) continue;
    //     // 判断时间是否有效
    //    if (now > cuteNumberManager.endtime.toDateTimeTick()) continue;
    //    if (now < cuteNumberManager.starttime.toDateTimeTick()) continue;

    //     for (const cuteNumber of cuteNumbers) {
    //         // "keys":["alterdatetime","icon","id","type"]
    //         if (cuteNumber.id != cuteNumberManager.cutetypeid) continue;

    //         ret[userId] = cuteNumber;
    //         break;
    //     }

    // }

    return ret;
}

/**
 * 根据userId查找靓号
 * @param {string} userId 
 * @returns {HResultStatus.Fail | null | CS_CuteNumber}
 * HResultStatus.Fail:      表示读表失败
 * null:                    表示没有靓号
 * CS_CuteNumber:           返回靓号数据
 */
export const getCuteNumberByUserId = async userId => {
    //传入参数错误
    if (!userId) {
        return HResultStatus.Fail;
    }

    const resultList = await Promise.all([
        // "keys":["cutenumber","cutetypeid","datatype","endtime","id","istimerange","operatorloginname","sociatynumber","starttime","type","updatetime"]
        _getCuteNumberManager(),

        // "keys":["alterdatetime","icon","id","type"]
        _getCuteNumber(),
    ]);

    if (!resultList[0] || !resultList[1]) {
        return HResultStatus.Fail;
    }

    const cuteNumberManagers = resultList[0];
    if (cuteNumberManagers.length == 0) {
        return null;
    }
    const cuteNumbers = resultList[1];
    if (cuteNumbers.length == 0) {
        return null;
    }

    // "keys":["cutenumber","cutetypeid","datatype","endtime","id","istimerange","operatorloginname","sociatynumber","starttime","type","updatetime"]
    const cuteNumberManager = HClientTables.CS_CuteNumberManager.dataMap[userId];
    if (!cuteNumberManager) return null;
    // "keys":["alterdatetime","icon","id","type"]
    const cuteNumber = HClientTables.CS_CuteNumber.dataMap[cuteNumberManager.cutetypeid];
    if (!cuteNumber) return null;
    if (cuteNumberManager.type != '1') return null;
    // 判断时间是否有效
    if (now > cuteNumberManager.endtime.toDateTimeTick()) return null;
    if (now < cuteNumberManager.starttime.toDateTimeTick()) return null;

    return cuteNumber;
}

//-------------------  随机房间名数据表 -------------------------------------------------------

/**
 * 随机房间名
 */
export const randomRoomName = async () => {
    // "keys":["roomName"]
    const list = await _getStaticDataTable(HClientTables.RandomRoomName);
    if (!list) {
        return null;
    }

    if (list.length == 0) {
        return '';
    }

    const vo = list[Math.round(Math.random() * (list.length - 1))];
    return vo.roomName;
}

//-------------------  敏感词 -------------------------------------------------------

/**
 * 检查关键词
 * @param {String} s 
 */
export const checkSensitiveWordByOfficial = async (s) => {
    if (!s) return s;
    const url = await _getStaticDataTableUrl(HClientTables.CS_SureLiveKeywords);

    //拿url失败
    if (!url) {
        return null;
    }

    try {
        const res = await NativeModules.HttpUtil.checkSensitiveWord(url, s);
        if (1 == res.level) {
            //严重
            return true;
        }
        return res.replace;
    } catch (error) {
        return null;
    }
}


//-------------------  砸蛋 -------------------------------------------------------

export const getPrizeRule = () => {
    // "keys":["allgoldshell","allswitch","bigrpool","bigrratio","buygiftids","canbigrdivide","canbigrratio","canbigrvalue","canhighcount","canhighratio","canhighvalue","canhighweekvalue","channelhide","createtime","daygoldshell","dayincome","effectiveroom","effectiveuserid","eggtype","gameswitch","giftids","giftnames","giftswitch","highpoolratio","id","income","luckfullvalue","luckratio","max","maxtoast","noticeswitch","officialswitch","priority","privategoldshell","prizetype","ratio1","ratio2","ratio3","ratio4","resetpoolratio","resetpoolvalue","riskswitch","roomgoldshell","s1cartoon","s1goldshell","s1ratio","s2cartoon","s2goldshell","s2ratio","s3cartoon","s3goldshell","s3ratio","screengoldshell","showgiftids","showgiftnames","smltpoolswitch","sms","tabswitch","telephone","toast","updatetime","userid","username","versionhide","visibleroom","wewinratio2"]
    return _getStaticDataTable(HClientTables.CS_PrizeRule);
}

export const getEggDisplayConfig = () => {
    // "keys":["activitygifts","allimgoldshell","channelhide","consumemode","contribute","egg1mode","egg2mode","iconname","id","imgoldshell","landh5url","privategoldshell","renewcount","renewgoldshell","renewratio","renewvaluepercent","roomgoldshell","servergoldshell","updatetime","versionhide"]
    return _getStaticDataTable(HClientTables.EggDisplayConfig);
}

export const getCS_SmashEggActivityRule = () => {
    // {"keys":["activityMode","end","giftId","id","labelId","productValue","refundDuration","refundRatio","refundValue","start","winExplanation"],"values":[[3,"2020-09-04 00:00:00","G3002",11,3,0,11,0.01,0,"2020-08-26 00:00:00","124gfsdga"]]}

    let res = _getStaticDataTable(HClientTables.CS_SmashEggActivityRule);
    if (!res) return []
    return res
}

//-------------------  Banner数据表 -------------------------------------------------------

/**
 * Banner数据表
 */
export const bannerList = async () => {
    // "keys":["alterdatetime","bannerid","bannerurl","channelhide","enddatetime","id","isplatfrom","isshare","pushswitch","pushtime","sharediconurl","sharedsubtitle","showtype","startdatetime","state","targetobject","targetparam","title","type","versionhide","weight"]
    let list = await _getStaticDataTable(HClientTables.CS_VoiceFriendBanner);
    if (!list) {
        //读取数据表失败
        // require("../ErrorStatusModel").default.showTips(HResultStatus.Fail);
        return [];
    }

    if (list.length == 0) {
        return [];
    }

    const now = Date.now();
    list = list.filter(item => {
        if (!item) return false;

        // 判断时间是否有效
        if (now > item.enddatetime.toDateTimeTick()) return false;
        if (now < item.startdatetime.toDateTimeTick()) return false;

        return true;
    })
        .sort((a, b) => {
            return Number(a.weight) - Number(b.weight);
        });
    return list;
}
//-------------------  SquareBanner -------------------------------------------------------
export const getSquareBanner = async () => {
    const list = await _getStaticDataTable(HClientTables.CS_SquareBanner);
    if (!list) {
        return
    }
    const ret = []
    const now = Date.now();

    for (let vo of list) {
        if (vo == null) continue
        if (vo.state != 1) continue;//无效Banner
        if (now > vo.endtime.toDateTimeTick()) continue;//无效开始日期
        if (now < vo.starttime.toDateTimeTick()) continue;//无效截至日期
        ret.push(vo)
    }
    return ret
}



//-------------------  直播间大Banner -------------------------------------------------------
export const getRoomBigBanner = async () => {
    // [ { versionhide: '0',
    //     targetparam: '',
    //     title: 'test',
    //     startdatetime: '2020-04-24 19:30:03',
    //     sharedsubtitle: '22',
    //     sharediconurl: 'voicefriendbanner/1587727956048_d35d66866e3af408.',
    //     pushtime: '2020-04-24 19:30:18',
    //     isshare: 0,
    //     isplatfrom: 1,
    //     h5url: 'http://139.199.10.60/html/yuan-store.html',
    //     flag: 2,
    //     pushswitch: 0,
    //     state: 1,
    //     bannerurl: 'voicefriendbanner/1587727972840_d35d66866e3af408.',
    //     type: 3,
    //     alterdatetime: '2020-04-25 18:55:58',
    //     id: 3,
    //     weight: 1,
    //     bannerid: '',
    //     enddatetime: '2020-04-25 19:30:07',
    //     targetobject: 'http://192.168.101.20:3000/html/yuan-store.html',
    //     showtype: 0,
    //     channelhide: '0' } ]

    const list = await _getStaticDataTable(HClientTables.CS_RoomFriendBanner);


    if (!list) {
        return []
    }

    const ret = []
    const now = Date.now();

    for (let vo of list) {
        if (vo == null) continue
        if (vo.state != 1) continue;//无效Banner
        if (now > vo.enddatetime.toDateTimeTick()) continue;//无效开始日期
        if (now < vo.startdatetime.toDateTimeTick()) continue;//无效截至日期
        if (vo.isplatfrom == 2) continue;//当前平台不可见


        let hideVersion

        if (!vo.versionhide) {
            hideVersion = vo.versionhide.split(',')
        }

        let hideChannel
        if (!vo.channelhide) {
            hideChannel = vo.channelhide.split(",")
        }

        let isHideVersion = hideVersion && hideVersion.indexOf(Config.version) >= 0//>代表包含
        let isHideChannel = hideChannel && hideChannel.indexOf(Config.channel) >= 0

        const isVisible = !(isHideVersion || isHideChannel || "all" == vo.versionhide || "all" == vo.channelhide)

        if (isVisible) {
            ret.push(vo)
        }

    }
    return ret
}

//-------------------  GiftList表数据 -------------------------------------------------------

/**
 * 获取GiftList表数据
 */
export const getRandomNameTableData = () => {
    //"keys":["part1","part2","part3"]
    return _getStaticDataTable(HClientTables.RandomName);
}

//-------------------  CS_TreasureBox表数据 -------------------------------------------------------


/**
 * 宝箱处理后的数据列表
 */

function _onCacheTreasureBox(tableVo) {
    // "keys":["boxid","boxname","boxtype","createdate","createuser","detail","enddate","giftlable","gifurl","id","isonline","maxcount","maxtoast","picurl","price","serialnumber","startdate","updatedate"],

    tableVo.dataMap = {};
    for (let vo of tableVo.data) {

        tableVo.dataMap[vo.boxid] = vo;


        switch (vo.boxname) {
            case '红宝箱':
                vo.animationname = "redbox"
                break;
            case '铂金宝箱':
                vo.animationname = "bogoldenbox"
                break;
            // case '白银宝箱':
            default:
                vo.animationname = "silverbox"
                break;
        }

    }

}

/**
 * 获取宝箱列表数据
 */
export const getTreasureBoxTableData = async () => {

    // "keys":["boxid","boxname","boxtype","createdate","createuser","detail","enddate","giftlable","gifurl","id","isonline","maxcount","maxtoast","picurl","price","serialnumber","startdate","updatedate"],

    const tableVo = HClientTables.CS_TreasureBox;

    if (tableVo.data && tableVo.version === tableVo.dataVersion) {
        return tableVo.data;
    }

    const list = await _getStaticDataTable(tableVo, _onCacheTreasureBox);

    if (!list) return []

    return list

}

/**
 * 获取特定宝箱数据
 */
export const getTreasureBoxByBoxId = async (boxId) => {
    // "keys":["boxid","boxname","boxtype","createdate","createuser","detail","enddate","giftlable","gifurl","id","isonline","maxcount","maxtoast","picurl","price","serialnumber","startdate","updatedate"],

    const tableVo = HClientTables.CS_TreasureBox;

    // const list = await getTreasureBoxTableData();
    await getTreasureBoxTableData();

    return tableVo.dataMap && tableVo.dataMap[boxId];

}

//-------------------  TreasureBoxDisplayConfig表数据 -------------------------------------------------------

/**
 * 获取是否显示宝箱数据列表
 */
export const getisShowTreasureBoxList = async () => {
    //"keys":["part1","part2","part3"]
    const res = await _getStaticDataTable(HClientTables.TreasureBoxDisplayConfig);

    return res

}


//-------------------  MusicList列表数据 -------------------------------------------------------

/**
 * 获取MusicList列表数据
 */
export const getMusicLibaray = () => {
    //"keys":["createTime","downloadURL","fileExt","fileSize","id","musicName","musicTime","seat","singerName","status","updateTime","uploader","uploaderName","userSeat"],
    return _getStaticDataTable(HClientTables.MusicList)
}

//-------------------  ChatterLabel列表数据 -------------------------------------------------------

/**
 * 获取ChatterLabel列表数据
 */
export const getChatterLabel = () => {
    //"keys":["id","label"]
    return _getStaticDataTable(HClientTables.ChatterLabel)
}

//-------------------  VipAuthentication列表数据 -------------------------------------------------------

function _onCacheVipAuthentication(tableVo) {
    const now = Date.now();

    tableVo.dataMap = {};
    for (let vo of tableVo.data) {
        if (vo == null) continue
        if (now > decodeURI(vo.endTime).toDateTimeTick()) continue;//无效开始日期
        if (now < decodeURI(vo.startTime).toDateTimeTick()) continue;//无效截至日期

        tableVo.dataMap[vo.userId] = vo;
    }
}

/**
 * vip列表
 * 获取VipAuthentication列表数据
 */
export const getVipAuthentication = async () => {
    //"keys":["userId","userName","startTime","endTime"]
    const tableVo = HClientTables.VipAuthentication;

    if (tableVo.data && tableVo.version === tableVo.dataVersion) {
        return tableVo.dataMap;
    }

    const list = await _getStaticDataTable(HClientTables.VipAuthentication, _onCacheVipAuthentication);

    if (!list) {
        return null;
    }

    return tableVo.dataMap;
}

//-------------------  CS_AvatarBox 表数据 -------------------------------------------------------

/**
 * 获取AvatarBox列表数据
 */
export const getAvatarBoxList = async () => {
    //"keys":["animationname","avatarboxid","createtime","duration","endtime","gifttype","h5url","id","name","onedayprice","pictype","price","sevendayprice","starttime","updatetime","valid","weight"]

    const list = await _getStaticDataTable(HClientTables.CS_AvatarBox);


    if (!list) {
        return null;
    }

    const ret = []
    const now = Date.now();

    for (let vo of list) {
        if (vo == null) continue
        if (!vo.valid) continue;
        if (now > vo.endtime.toDateTimeTick()) continue;//无效开始日期
        if (now < vo.starttime.toDateTimeTick()) continue;//无效截至日期

        ret.push(vo);
    }
    return ret;
}

/**
 * 根据id 获取AvatarBox数据
 * @param {string} avatarboxid 
 */
export const getAvatarBox = async (avatarboxid) => {
    //"keys":["animationname","avatarboxid","createtime","duration","endtime","gifttype","h5url","id","name","onedayprice","pictype","price","sevendayprice","starttime","updatetime","valid","weight"]

    const list = await _getStaticDataTable(HClientTables.CS_AvatarBox);


    if (!list) {
        return null;
    }

    const ret = []
    const now = Date.now();

    for (let vo of list) {
        if (vo == null) continue
        if (avatarboxid == vo.avatarboxid) {
            return vo;
        }
    }
    return null;
}

//-------------------  CS_CarList 表数据 -------------------------------------------------------

/**
 * 获取GiftList表数据
 */
export const getCarList = async () => {
    //"keys":["alterdatetime","animationname","animationurl","biganimationname","biganimationurl","carid","carname","carpictureurl","carsummary","cartype","coinmonth","coinyear","endtime","exclusiveid","funlevel","gamecdkey","gameid","gifttype","h5url","id","indate","inserttime","mallurl","onedayprice","pictype","sequenceid","sevendayprice","starttime","valid"]

    const list = await _getStaticDataTable(HClientTables.CS_CarList);


    if (!list) {
        return null;
    }

    const ret = []
    const now = Date.now();

    for (let vo of list) {
        if (vo == null) continue
        if (!vo.valid) continue;
        if (now > vo.endtime.toDateTimeTick()) continue;//无效开始日期
        if (now < vo.starttime.toDateTimeTick()) continue;//无效截至日期

        ret.push(vo);
    }
    return ret;
}

/**
 * 根据carId 获得座驾数据
 * @param {string} carId 
 */
export const getCarByCarId = async (carId) => {
    //"keys":["alterdatetime","animationname","animationurl","biganimationname","biganimationurl","carid","carname","carpictureurl","carsummary","cartype","coinmonth","coinyear","endtime","exclusiveid","funlevel","gamecdkey","gameid","gifttype","h5url","id","indate","inserttime","mallurl","onedayprice","pictype","sequenceid","sevendayprice","starttime","valid"]

    const list = await _getStaticDataTable(HClientTables.CS_CarList);


    if (!list) {
        return null;
    }


    for (let vo of list) {
        if (vo == null) continue
        if (carId == vo.carid) {
            return vo;
        }
    }
    return null;
}

//-------------------  活动跑道文案+背景+气泡 表数据 -------------------------------------------------------

/**
 * 获取GiftList表数据
 */
export const getActivityList = async () => {
    //"keys":["alterdatetime","animationname","animationurl","biganimationname","biganimationurl","carid","carname","carpictureurl","carsummary","cartype","coinmonth","coinyear","endtime","exclusiveid","funlevel","gamecdkey","gameid","gifttype","h5url","id","indate","inserttime","mallurl","onedayprice","pictype","sequenceid","sevendayprice","starttime","valid"]

    const list = await _getStaticDataTable(HClientTables.EggDisplayConfig);


    if (!list) {
        return null;
    }


    return list;
}
