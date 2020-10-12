'use strict';

import React, { PureComponent } from "react";
import { View, Animated, Easing} from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import ModelEvent from "../../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_GIFT_FLY } from "../../../hardcode/HLogicEvent";

export default class _RoomGiftFlyAnimateItem extends PureComponent {

    constructor(props) {
        super(props);

        this._keyIndex = 0;
        this._flyArr = [];
    }

    componentDidMount() {
        ModelEvent.addEvent(null, EVT_LOGIC_UPDATE_GIFT_FLY, this._handleFlyData)
    }


    componentWillUnmount() {
        ModelEvent.removeEvent(null, EVT_LOGIC_UPDATE_GIFT_FLY, this._handleFlyData)
    }

    /**
     * 接收一组数据
     * [
     *  {
     *     micPostion,
     *     imageUri,
     *  }
     * ]
     */
    _handleFlyData = (arr) => {
        if (!arr || arr.length == 0) return;

        arr.map(item => { 
            this._flyArr.push(Object.assign({}, item, {uKey: this._keyIndex++}))
        })
        this.forceUpdate();
    }

    _onFlyEnd = (uKey) => {
        for (let i = 0; i < this._flyArr.length; i++) {
            if (this._flyArr[i].uKey == uKey) {
                this._flyArr.splice(i, 1);
                this.forceUpdate();
                return;
            }
        }
    }

    render() {
        if (this._flyArr.length == 0) return null;

        const flyItems = this._flyArr.map(item => {
            return (
                <FlyImage 
                    key={item.uKey}
                    uKey={item.uKey}
                    imageUri={item.imageUri}
                    micPostion={item.micPostion}
                    onFlyEnd={this._onFlyEnd}
                />
            )
        })
        return (
            <View
                style={{
                    position: 'absolute',
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                    backgroundColor: '#00000000'
                }}
                pointerEvents='none'
            >
                {flyItems}
            </View>
        );
    }
}

class FlyImage extends PureComponent {

    constructor(props) {
        super(props);

        this._translateXValue = new Animated.Value(0);
        this._translateYValue = new Animated.Value(0);

        this._left = (DesignConvert.swidth - DesignConvert.getW(40))/2;
        this._top = DesignConvert.getH(500);
    }

    componentDidMount() {
        this._playAnim()
    }

    _playAnim = () => {
        const {screenX, screenY} = require('../../../model/room/MicPostionModel').default.getMicPostionWithIndex(this.props.micPostion);

        if (!screenX || !screenY) return;

        // screenX, screenY 指向的是麦位的左上角 要飞到正中心可以微调下

        Animated.sequence([

            Animated.timing(
                this._translateYValue, 
                {
                    toValue: -150,
                    duration: 500,
                    easing: Easing.linear,
                    isInteraction: false,
                    useNativeDriver: true,
                }
            ),

            Animated.parallel([
                Animated.timing(
                    this._translateXValue, 
                    {
                        toValue: (screenX - this._left),
                        duration: 500,
                        easing: Easing.linear,
                        isInteraction: false,
                        useNativeDriver: true,
                    }
                ),
                Animated.timing(
                    this._translateYValue, 
                    {
                        toValue: (screenY - this._top),
                        duration: 500,
                        easing: Easing.linear,
                        isInteraction: false,
                        useNativeDriver: true,
                    }
                ),
            ])
        ]).start(()=>{
            this.props.onFlyEnd && this.props.onFlyEnd(this.props.uKey)
        });
    }

    render() {
        return (
            <Animated.Image
                style={{
                    width: DesignConvert.getW(40),
                    height: DesignConvert.getH(40),
                    position: "absolute",
                    left: this._left,
                    top: this._top,
                    transform: [
                        {translateX: this._translateXValue},
                        {translateY: this._translateYValue},
                    ]
                }}
                source={this.props.imageUri}
            />
        )
    }
}