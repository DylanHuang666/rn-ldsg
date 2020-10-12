'use strict';

import React, { PureComponent } from "react";
import { Image, Text, Animated, Easing, View } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import {
    ic_gift_banner,
    ic_gift_gift,
    ic_zadan_full_service
} from '../../../../hardcode/skin_imgs/room_gift';
import Config from "../../../../configs/Config";
import HGlobal, { COIN_NAME } from "../../../../hardcode/HGLobal";

/* <_RoomGiftBannerItem
    key={key}
    item={vo}
    onEnd={this._onPlayEnd}
/> */

export default class _RoomContainerKoiFishItem extends PureComponent {

    constructor(props) {
        super(props);

        this._translateXValue = new Animated.Value(DesignConvert.swidth)     // 起始值

        this._firstStopValue = DesignConvert.getW(4.5);                     // 两秒的出场地方
        this._firstStopDuration = 2000;     // 两秒的出场时间

        this._secondDuration = 1000;    // 出场后停留一秒

        this._toRightValue = DesignConvert.getW(80 + 4.5); // 向右走80个单位
        this._toRightDuration = 1000;     // 移动80个单位的时长

        this._endLeaveValue = -DesignConvert.swidth;                         // 最终值
        this._endLeaveDuration = 4000;      // 花费4秒离开界面
    }

    componentDidMount() {
        this._startAnimated();
    }

    componentWillUnmount() {
        this._isCompUnmount = true;
        this._stopAnimated();
    }

    _stopAnimated = () => {
        this.animate && this.animate.stop();
        this.animate = null;
    }

    _startAnimated = () => {
        // 0 -> 2   从左到右
        // 2 -> 3    停留
        // 3 -> 4   向左移动 80  个单位
        // 4 -> 8   向右移动 到左面

        this._translateXValue.setValue(DesignConvert.swidth);         // 起始值

        this.animate = Animated.sequence(
            [
                Animated.timing(
                    this._translateXValue,
                    {
                        toValue: this._firstStopValue,
                        duration: this._firstStopDuration,
                        easing: Easing.linear,
                        isInteraction: false,
                        useNativeDriver: true,
                    }
                ),
                Animated.delay(this._secondDuration),
                Animated.timing(
                    this._translateXValue,
                    {
                        toValue: this._toRightValue,
                        duration: this._toRightDuration,
                        easing: Easing.linear,
                        isInteraction: false,
                        useNativeDriver: true,
                    }
                ),
                Animated.timing(
                    this._translateXValue,
                    {
                        toValue: this._endLeaveValue,
                        duration: this._endLeaveDuration,
                        easing: Easing.linear,
                        isInteraction: false,
                        useNativeDriver: true,
                    }
                ),
            ]
        )

        this.animate.start(
            endState => {
                if (this._isCompUnmount) return;

                if (endState.finished) {
                    this._stopAnimated();

                    this.props.onEnd(this.props.keyIndex);
                }
            }
        );
    }

    render() {
        //锦鲤砸蛋活动结果广播
        // message SmashEggActivityResultBroadcast {
        // 	optional UserResult.UserBase smashUserBase = 1;// 砸蛋用户信息
        // 	repeated ReceiveGiftInfo giftList = 2;//活动礼物列表,一般只有一个
        // 	optional int32 broadcastType = 3;//播放类型:0公屏显示,1房间跑道,2全服跑道,3:全服公屏流水
        // 	optional int32 action = 4;//砸蛋动作(0:自动砸,1:单砸,10:十砸,100:百砸,暂不用)
        //     optional string eggType = 5; //蛋的类型(1:铁蛋 2:银蛋 3:金蛋) 
        //     optional string roomId = 6; //砸蛋所在房间Id	
        //     optional string roomName = 7; //砸蛋所在房间名称
        //     optional int32 activityType = 8; //活动类型,目前只有锦鲤活动(1:锦鲤活动)
        //     optional int32 activityMode = 9; //活动模式(锦鲤活动 1:抽一送一,2:返还固定金币 3:返还砸蛋总消耗比例金币)
        //     optional int32 activityValue = 10; //活动获得金币值(锦鲤活动:抽一送一就是礼物的价值,其他的就是返还金币数量)

        // }

        // console.log('锦鲤活动', this.props.item)

        // console.log('dddddddddddddddddd', this.props.item)


        const eggType = this.props.item.data.eggType
        const eggName = eggType == 1 ? HGlobal.EGG_A : eggType == 2 ? HGlobal.EGG_B : HGlobal.EGG_C;

        const smashUserBase = this.props.item.data.smashUserBase

        const senderName = decodeURIComponent(smashUserBase.nickName);
        const senderHeadUrl = Config.getHeadUrl(smashUserBase.userId, smashUserBase.logoTime, smashUserBase.thirdIconurl, 100)
        // const senderIsMale = this.props.item.data.smashUserBase.sex == ESex_Type_MALE;
        const bShowPrice = true;//todo 暂时写死显示吧
        const num = this.props.item.giftVo.num;
        // const roomName = this.props.item.data.roomName;

        const gift = giftName || "礼物";
        this._giftUrl = Config.getGiftUrl(this.props.item.giftVo.giftId, this.props.item.giftVo.alterdatetime)
        // const price = bShowPrice ? `(${giftPrice}${COIN_NAME})` : "";
        const tracktext = this.props.item.tracktext
        const trackstylemedia = this.props.item.trackstylemedia
        const imgUri = { uri: Config.getActivityImageUrl(trackstylemedia) }


        const userName = senderName.length > 5 ? senderName.slice(0, 5) + '...' : senderName
        const giftName = this.props.item.giftVo.name;
        const giftPrice = this.props.item.giftVo.price;
        const extraPrice = this.props.item.data.activityValue ? `${this.props.item.data.activityValue}` : "";

        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(175) + DesignConvert.statusBarHeight,
                    left: DesignConvert.getW(18),

                    width: DesignConvert.getW(365),
                    height: DesignConvert.getH(53),

                    flexDirection: 'row',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    transform: [
                        { translateX: this._translateXValue },
                    ],

                }}
            >


                <Image
                    source={imgUri}
                    style={{
                        position: 'absolute',
                        width: DesignConvert.getW(365),
                        height: DesignConvert.getH(53),
                        resizeMode: 'contain'
                    }}
                />
                <Image
                    style={{

                        position: 'absolute',
                        left: DesignConvert.getW(5),

                        width: DesignConvert.getW(37),
                        height: DesignConvert.getH(37),
                        borderRadius: DesignConvert.getW(30),
                        backgroundColor: 'red'
                    }}
                    source={{ uri: senderHeadUrl }}
                />
                {/* <Text
                    numberOfLines={1}

                    style={{
                        maxWidth: DesignConvert.getW(58),
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(12),

                    }}
                >
                    {senderName}
                </Text> */}

                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(12),

                        marginLeft: DesignConvert.getW(50)

                    }}
                >
                    {tracktext.format(userName, giftName, giftPrice, extraPrice)}
                </Text>





                {/* <Image
                    style={{
                        width: DesignConvert.getW(26),
                        height: DesignConvert.getH(21),
                        resizeMode: 'contain',
                    }}
                    source={{ uri: this._giftUrl }}
                >
                </Image> */}


            </Animated.View>
        );
    }
}