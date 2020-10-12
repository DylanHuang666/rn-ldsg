'use strict';

import React, { PureComponent } from "react";
import { Text, Image, Animated, Easing, ScrollView, View } from "react-native";
import DesignConvert from "../../../../utils/DesignConvert";
import {
    ic_room_full_service,
} from '../../../../hardcode/skin_imgs/room_gift';
import { COIN_NAME } from "../../../../hardcode/HGLobal";
import Config from "../../../../configs/Config";

/* <_RoomFullServiceGiftItem
    key={key}
    keyIndex={key}
    item={vo}
    onEnd={this._onPlayEnd}
/> */

export default class _RoomFullServiceGiftItem extends PureComponent {

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

        const fromUserBase = this.props.item.data.fromUserBase

        const senderNamwe = decodeURIComponent(this.props.item.data.fromUserBase.nickName);
        const senderHeadUrl = Config.getHeadUrl(fromUserBase.userId, fromUserBase.logoTime, fromUserBase.thirdIconurl, 60)

        // const senderIsMale = this.props.item.data.fromUserBase.sex == ESex_Type_MALE;
        const recieverName = decodeURIComponent(this.props.item.receiverInfo.toNickName);
        // const recieverIsMale = this.props.item.receiverInfo.toSex == ESex_Type_MALE;
        // const boxDrawable = this.props.item.giftData ? ({ uri: Config.getGiftUrl(this.props.item.giftData.giftid, this.props.item.giftData.alterdatetime) }) : null;
        const giftName = this.props.item.giftData ? this.props.item.giftData.giftname : '';
        const bShowPrice = true;//todo 暂时写死显示吧
        const giftPrice = this.props.item.data.price;
        const groupNum = this.props.item.data.groupNum;
        const giftNum = this.props.item.data.giftNum;
        // const bWorld = this.props.item.data.broadcastType == 2;
        const roomName = this.props.item.roomName;

        const giftUrl = Config.getGiftUrl(this.props.item.giftData.giftid, this.props.item.giftData.alterdatetime.toDateTimeTick())

        const gift = giftName || "礼物";
        const price = bShowPrice ? `(${giftPrice}${COIN_NAME})` : "";

        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(60) + DesignConvert.statusBarHeight,
                    left: DesignConvert.getW(20),
                    width: DesignConvert.getW(334),
                    height: DesignConvert.getH(60),
                    paddingTop: DesignConvert.getH(12),
                    paddingTop: DesignConvert.getH(6),
                    paddingRight: DesignConvert.getW(2),
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: DesignConvert.getW(45),

                    // transform: [{
                    //     translateX: this._translateXValue
                    // }],
                    opacity: this._opacityValue,
                }}
            >

                <Image
                    resizeMode="contain"
                    source={ic_room_full_service()}
                    style={{
                        position: 'absolute',
                        width: DesignConvert.getW(334),
                        height: DesignConvert.getH(60),
                    }}
                />

                {/* <Image
                    source={{ uri: senderHeadUrl }}
                    style={{
                        width: DesignConvert.getW(29),
                        height: DesignConvert.getH(29),
                        borderRadius: DesignConvert.getW(20),
                        marginLeft: DesignConvert.getW(5),
                        marginRight: DesignConvert.getW(2),
                    }}
                /> */}


                {/* 这里根据业务来调整吧 要怎么展示文字 */}
                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        marginStart: DesignConvert.getW(60),
                        color: '#FFF781',
                        maxWidth: DesignConvert.getW(60),   // 50刚好显示4个字... 如果Text控件作为Text的子控件 貌似起不了作用
                    }}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                >{senderNamwe}</Text>

                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFFFFF',
                    }}
                >
                    {` 向 `}
                </Text>

                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFF781',
                        maxWidth: DesignConvert.getW(60),   // 80刚好显示五个字... 如果Text控件作为Text的子控件 貌似起不了作用
                    }}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                >{recieverName}</Text>

                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(11),
                    }}
                >
                    {` 送出 `}
                </Text>

                {/* 
                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFC000',
                    }}
                >{`${gift}${price}`}</Text> */}

                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFF781',
                    }}
                >
                    {/* {gift} */}
                    {giftPrice}
                </Text>

                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFFFFF',
                    }}
                >
                    {'x'}
                </Text>

                <Text
                    style={{
                        fontSize: DesignConvert.getF(11),
                        color: '#FFFFFF',
                    }}
                >

                    {groupNum * giftNum}
                </Text>


                <Image
                    source={{ uri: giftUrl }}
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(5),
                        width: DesignConvert.getW(34),
                        height: DesignConvert.getH(34),
                        resizeMode: 'contain',
                    }}
                />

            </Animated.View >
        );
    }
}