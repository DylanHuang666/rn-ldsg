'use strict';

import React, { PureComponent } from "react";
import { Text, Animated, Easing, Image } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import {
    ic_zadan_full_service,ic_zadan_banner
} from '../../../../hardcode/skin_imgs/room_gift';
import HGlobal, { COIN_NAME } from "../../../../hardcode/HGLobal";

export default class _RoomFullServiceZadanItem extends PureComponent {

    constructor(props) {
        super(props);

        this._translateXValue = new Animated.Value(DesignConvert.swidth)     // 起始值
        this._opacityValue = new Animated.Value(1);

        this._stopValue = 0;                // 0.5秒的出场地方
        this._firstStopDuration = 500;      // 出场时间

        this._secondDuration = 5000;        // 出场后停留五秒

        this._endLeaveDuration = 200;      // 渐变消失掉时间
    }

    componentDidMount() {
        this._startAnimated()
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
        // 0 -> 0.5   从左到右
        // 5秒后消失

        // 起始值
        this._translateXValue.setValue(DesignConvert.swidth);
        this._opacityValue.setValue(1);

        this.animate = Animated.sequence(
            [
                Animated.timing(
                    this._translateXValue,
                    {
                        toValue: this._stopValue,
                        duration: this._firstStopDuration,
                        easing: Easing.linear,
                        isInteraction: false,
                        useNativeDriver: true,
                    }
                ),
                Animated.delay(this._secondDuration),
                Animated.timing(
                    this._opacityValue,
                    {
                        toValue: 0,
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

        const senderNamwe = decodeURIComponent(this.props.item.data.smashUserBase.nickName);
        // const senderIsMale = this.props.item.data.smashUserBase.sex == ESex_Type_MALE;
        const giftName = this.props.item.giftVo.name;
        const bShowPrice = true;//todo 暂时写死显示吧
        const giftPrice = this.props.item.giftVo.price;
        // const roomName = this.props.item.data.roomName;

        const gift = giftName || "礼物";
        const price = bShowPrice ? `(${giftPrice}${COIN_NAME})` : "";


        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(218) + DesignConvert.statusBarHeight,
                    left: DesignConvert.getW(73),
                    width: DesignConvert.getW(368),
                    height: DesignConvert.getH(60),
                    flexDirection: 'row',
                    paddingTop: DesignConvert.getH(9),
                    paddingLeft: DesignConvert.getW(70),
                    alignItems: 'center',
                    transform: [{
                        translateX: this._translateXValue
                    }],
                    opacity: this._opacityValue,
                }}
                source={ic_zadan_full_service()}
            >

                <Image
                    source={ic_zadan_banner()}
                    style={{
                        position: 'absolute',
                        width: DesignConvert.getW(368),
                        height: DesignConvert.getH(60),
                    }}
                />

                {/* <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#201904',
                    }}
                >恭喜</Text> */}

                {/* 这里根据业务来调整吧 要怎么展示文字 */}
                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFF781',
                        maxWidth: DesignConvert.getW(80),   // 50刚好显示4个字... 如果Text控件作为Text的子控件 貌似起不了作用
                    }}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                >{senderNamwe}</Text>

                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFFFFF',
                    }}
                >{HGlobal.EGG_ACTION}获得</Text>

                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFFFFF',
                    }}
                >{gift}{price}</Text>

            </Animated.View>
        );
    }
}