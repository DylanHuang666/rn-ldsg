import moment from 'moment';
import RoomInfoCache from "../../cache/RoomInfoCache";
import Config from '../../configs/Config';
import { ERoomType } from '../../hardcode/ERoom';
import HResultStatus from "../../hardcode/HResultStatus";
import { user } from "../../hardcode/skin_imgs/login";
import ModelEvent from "../../utils/ModelEvent";



//免费礼物id
const freeGiftId = 'G101';

/**
  * 礼物列表
  */
function _filterGiftList(list) {

    if (!list || list.length == 0) {
        return []
    }

    const now = Date.now();


    const ret = []

    for (let item of list) {
        if (!item.valid) continue;
        // 判断时间是否有效

        if (now > item.endtime.toDateTimeTick()) continue;
        if (now < item.starttime.toDateTimeTick()) continue;
        if (item.giftid.indexOf('G') == -1) continue
        const roomids = item.roomids.split(',')
        if (item.gifttype == 5 && roomids.indexOf(RoomInfoCache.roomId) == -1) continue


        if (item.giftid == freeGiftId) {
            //免费礼物,排第一
            ret.unshift(item)
        } else {
            ret.push(item)
        }
    }

    return ret
}

/**
* 包裹列表
*/
function _filterBagList(giftList, result, resActivityList) {

    if (HResultStatus.Success != result.state) {
        require('../ErrorStatusModel').default.showTips(result.state)
        return {
            bagList: [],
            totalPrice: 0,
        }
    }

    //玩家当前的物品列表(目前只有系统赠送,后期开通购买)
    // message GoodsList {
    // 	repeated GoodsInfo goods = 1;
    // 	optional string useCarId = 2;//使用中的坐驾ID
    // 	optional string useHeadFrameId = 3;//使用中的头像框ID
    // 	optional string useDialogFrameId = 4;//使用中的对话框ID
    // 	repeated string useMedals = 5;//使用中的勋章
    // }
    if (!result || !result.data || !result.data.goods) {
        return {
            bagList: [],
            totalPrice: 0,
        }
    }

    let totalPrice = 0

    const ret = []

    for (let giftItem of giftList) {
        giftItem.count = 0
    }

    // console.warn(result.data.goods.length == 0)
    result.data.goods.forEach(bagItem => {

        for (let giftItem of giftList) {
            //初始化背包数量
            // message GoodsInfo {
            //     optional string goodsId = 1;//物品ID
            //     optional int32 num = 2;//物品数量
            //     optional int32 remainTime = 3;//有效剩余时间S(有时效物品专用字段,不存在时代表座驾未使用)
            //     optional int32 updateTime = 4;//创建或续期时间
            //     optional bool isNew = 5;//是否新物品
            // }
            if (bagItem.goodsId == giftItem.giftid) {
                giftItem.count = bagItem.num
                if (giftItem.count > 0 && giftItem.gifttype != 5) {
                    totalPrice = totalPrice + (giftItem.price * giftItem.count)
                }
                if (giftItem.giftid == freeGiftId) {
                    //免费礼物,排第一
                    ret.unshift(giftItem)
                } else {
                    ret.push(giftItem)
                }
            }
        }
    })

    // if (ret.length == 0) {
    //     for (let giftItem of giftList) {
    //         giftItem.count = 0
    //     }
    // }
    // 配置活动标签
    for (let myBagGift of ret) {
        for (let vo of resActivityList) {
            const time = vo.end.replace(/-/g, '/')

            const endTime = new Date(time).getTime();

            const timestamp = (new Date()).valueOf()
            // vo.momentTime = new Date(time)


            if (myBagGift.giftid === vo.giftId && timestamp <= endTime) {
                myBagGift.isActivity = myBagGift.giftid === vo.giftId
                break
            }
        }


    }

    return {
        bagList: ret,
        totalPrice: totalPrice,
    }

}



/**
 * 礼物Model
 */
const GiftModel = {

    async giftAndBagList() {

        const list = await Promise.all([
            require('../staticdata/StaticDataModel').getGiftListTableData(),

            //获取物品列表:返回BagResult.GoodsList
            // message getGoodsList {
            // 	required int32 type = 1;//物品类型0全部,1免费礼物,2包裹礼物,3座驾,4头像框,5对话框,7勋章
            // 	required string targetUserId = 2;// 目标用户id，传空查自己
            // }
            require('../ServerCmd').BagCmd_getGoodsList({
                type: 2,
                targetUserId: '',
            })
        ])
        let resActivityList = await require('../staticdata/StaticDataModel').getCS_SmashEggActivityRule()

        if (!resActivityList) {
            resActivityList = []
        }

        const giftList = _filterGiftList(list[0])

        const bagData = _filterBagList(list[0], list[1], resActivityList)
        // console.warn(bagData)
        return {
            giftList: giftList,//礼物列表
            bagList: bagData.bagList,//包裹列表
            bagTotalPrice: bagData.totalPrice,//包裹总价值
        }

    },


    /**
     * 送礼
     */
    async sendGifts(userId, giftId, giftNum, roomId, groupNum) {
        // console.log('送礼信息', 'userId' + userId + '----giftId' + giftId + '----giftNum' + giftNum + '-----roomId' + roomId + '-----groupNum' + groupNum)
        //赠送礼物给多个用户
        // message sendGifts {
        // 	repeated string userId = 1;//接收的玩家ID数组
        // 	required string giftId = 2;//赠送的礼物ID
        // 	required int32 giftNum = 3;//赠送的礼物数量(连击改变这里的数量即可)
        // 	required string roomId = 4;//当前房间ID
        // 	optional int32 groupNum = 5;// 分组数量，默认为1，总数量=giftNum X groupNum  (groupNum是外面选择的，giftNum是里面选择)
        // 	optional bool addLover = 6;//是否关注
        // 	optional int32 action = 7;//送礼绑定动作(1:视频房男嘉宾上麦)
        // }

        const result = await require('../ServerCmd').BagCmd_sendGifts({
            userId,
            giftId,
            giftNum,
            roomId,
            groupNum,
        })

        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return false
        }

        return true
    },

    /**
     * 检查包裹里是否包含活动礼物
     */
    async checkBagIncludeActivityGift() {
        const list = await Promise.all([
            require('../staticdata/StaticDataModel').getEggDisplayConfig(),
            require('../ServerCmd').BagCmd_getGoodsList({
                type: 2,
                targetUserId: '',
            })
        ])

        let activityIds = undefined;
        let have = undefined;

        if (list && list[0] && list[0][0]) {
            activityIds = list[0][0].activitygifts
        }
        if (activityIds && list[1] && list[1].state == HResultStatus.Success && list[1].data && list[1].data.goods) {
            list[1].data.goods.forEach(element => {

                if (activityIds.indexOf(element.goodsId) >= 0) {
                    if (!have) {
                        have = [element];
                    } else {
                        have.push(element);
                    }
                }
            })
        }
        return have
    },

    /**
     * 一键全送
     */
    async sendAllMyPkgGIfts(userId, roomId, sendCommon) {
        //赠送全部的我包裹里的礼物给一个用户
        // message sendAllMyPkgGifts {
        // 	required string userId = 1;//接收的玩家ID
        // 	required string roomId = 2;//当前房间ID
        //  require boolean sendCommon = 3;//只送普通的礼物（排除活动礼物）
        // }

        const result = await require('../ServerCmd').BagCmd_sendAllMyPkgGifts({
            userId,
            roomId,
            sendCommon,
        })
        if (HResultStatus.Success != result.state) {
            require('../ErrorStatusModel').default.showTips(result.state)
            return false
        }

        return true
    },


    /**
     * 是否显示宝箱列表
     */
    async isShowTreasureBoxList() {

        const list = await require('../staticdata/StaticDataModel').getisShowTreasureBoxList()

        if (!list || list.length === 0) return false

        const mobileInfos = await Config.getMobileInfosAsync();

        const nowVersion = `${NativeModules.PackageInfo.versionName}.${NativeModules.PackageInfo.versionCode}.${require('../../configs/Version').default}`

        const nowChannel = mobileInfos.channel

        const res = list.some((item, index) => {
            return item.versionhide === nowVersion || item.channelhide === nowChannel
        })

        return !res
    },

    /**
     * 获取宝箱列表
     */
    async getTreasureBoxList() {

        const list = await require('../staticdata/StaticDataModel').getTreasureBoxTableData()

        if (!list || list.length === 0) return []

        list.forEach(item => {
            item.giftid = item.boxid
            item.alterdatetime = item.updatedate
            item.giftname = item.boxname
        })

        const roomData = RoomInfoCache.roomData

        if (!roomData) return []

        const now = Date.now();

        // 判断是否在有效时间
        const timeValidList = list.filter(item => {
            return item.startdate.toDateTimeTick() < now && item.enddate.toDateTimeTick() > now
        })

        const finalList = timeValidList.filter(item => {
            return (item.boxtype == 0 && roomData.roomType != ERoomType.FUN_VIDEO_ROOM) || (item.boxtype == 1 && roomData.roomType == ERoomType.FUN_VIDEO_ROOM)
        })

        return finalList

    }

}


export default GiftModel;


function _isSvga(animationname) {
    return animationname && animationname.indexOf('.svga') > 0;
}

function _isMp4(animationname) {
    return animationname && animationname.indexOf('.mp4') > 0;
}


export function getGiftDataAnimationTime(giftData) {
    if (giftData.alterdatetime) {
        return moment(giftData.alterdatetime).valueOf()
    }

    return '';
}


