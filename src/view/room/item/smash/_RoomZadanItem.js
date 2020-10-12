'use strict';

import React, { PureComponent } from "react";
import { Image, Text, Animated, Easing, ScrollView, View } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import {
    ic_zadan_banner,
    ic_gift_gift
} from '../../../../hardcode/skin_imgs/room_gift';
import Config from "../../../../configs/Config";
import HGlobal, { COIN_NAME } from "../../../../hardcode/HGLobal";


export default class _RoomZadanItem extends PureComponent {

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
        //砸蛋结果广播
        // message SmashEggResultBroadcast {
        // 	optional UserResult.UserBase smashUserBase = 1;// 砸蛋用户信息
        // 	repeated ReceiveGiftInfo giftList = 2;//中奖礼物列表
        // 	optional int32 broadcastType = 3;//播放类型:0公屏显示,1房间跑道,2全服跑道,3:全服公屏流水
        // 	optional int32 action = 4;//砸蛋动作(0:自动砸,1:单砸,10:十砸,100:百砸)	
        //     optional string eggType = 5; //蛋的类型(1:铁蛋 2:银蛋 3:金蛋) 
        //     optional string roomId = 6; //砸蛋所在房间Id	
        //     optional string roomName = 7; //砸蛋所在房间名称
        // }

        // 礼物信息
        // message ReceiveGiftInfo {
        // 	required string giftId = 1;//礼物ID
        // 	required int64 num = 2;//数量
        // 	required int32 price = 3;//价格(用户排序用)
        // 	optional string name = 4;//名称
        // }

        // *  data: SmashEggResultBroadcast,
        // *  giftVo: ReceiveGiftInfo,

        const smashUserBase = this.props.item.data.smashUserBase

        const senderName = decodeURIComponent(smashUserBase.nickName);
        const senderHeadUrl = Config.getHeadUrl(smashUserBase.userId, smashUserBase.logoTime, smashUserBase.thirdIconurl, 40)
        // const senderIsMale = this.props.item.data.smashUserBase.sex == ESex_Type_MALE;
        const giftName = this.props.item.giftVo.name;
        const bShowPrice = true;//todo 暂时写死显示吧
        const giftPrice = this.props.item.giftVo.price;
        const num = this.props.item.giftVo.num;
        // const roomName = this.props.item.data.roomName;

        const gift = giftName || "礼物";
        this._giftUrl = Config.getGiftUrl(this.props.item.giftVo.giftId, this.props.item.giftVo.alterdatetime)
        // const price = bShowPrice ? `(${giftPrice}${COIN_NAME})` : "";
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(157) + DesignConvert.statusBarHeight,
                    left: DesignConvert.getW(4.5),
                    width: DesignConvert.getW(347),
                    height: DesignConvert.getH(67),
                    flexDirection: 'row',
                    alignItems: 'center',

                    paddingLeft: DesignConvert.getW(24),
                    transform: [
                        { translateX: this._translateXValue },
                    ]
                }}
            >

                <Image
                    resizeMode="contain"
                    source={ic_zadan_banner()}
                    style={{
                        position: 'absolute',
                        width: DesignConvert.getW(347),
                        height: DesignConvert.getH(67),
                    }}
                />

                {/* <Text
                    style={{
                        marginLeft: DesignConvert.getW(14),
                        color: '#FFFFFF',
                    }}>
                    恭喜
                    </Text> */}
                <Image
                    source={{ uri: senderHeadUrl }}
                    style={{
                        width: DesignConvert.getW(45),
                        height: DesignConvert.getH(45),
                        borderRadius: DesignConvert.getW(45),

                        marginRight: DesignConvert.getW(28),
                    }}
                />

                <View
                    style={{
                        width: DesignConvert.getW(178),
                    }}>

                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: DesignConvert.getF(13),
                            color: '#FFFFFF',
                            maxWidth: DesignConvert.getW(173),
                        }}>
                        {senderName}
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: DesignConvert.getH(2)
                        }}>

                        <Text
                            style={{
                                fontSize: DesignConvert.getF(10),
                                color: '#FFFFFF',
                            }}>
                            {HGlobal.EGG_ACTION}

                            {'中获取'}
                        </Text>
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(10),
                                color: '#FFFFFF',
                            }}>
                            {`${gift}(${giftPrice}${COIN_NAME})`}
                        </Text>


                        <Text
                            style={{
                                fontSize: DesignConvert.getF(10),
                                color: '#FFFFFF',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: DesignConvert.getF(10),
                                }}
                            >
                                {'*'}
                            </Text>
                            {num}
                        </Text>
                    </View>
                </View>


                <Image
                    source={{ uri: this._giftUrl }}
                    style={{
                        marginLeft: DesignConvert.getW(10),
                        marginRight: DesignConvert.getW(27),
                        width: DesignConvert.getW(35),
                        height: DesignConvert.getH(35),
                    }}
                />

            </Animated.View >
        );
    }
}