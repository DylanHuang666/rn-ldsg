
/**
 * PhoneDialog
 * 在房间时来电弹窗
 */

'use strict';

import React from "react";
import { ImageBackground, TouchableOpacity, View, Image, Vibration, Text, Animated, PanResponder } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import BaseView from "../base/BaseView";
import {
    dialog_bg,
    cir_phone_start,
    cir_phone_stop,
} from "../../hardcode/skin_imgs/announcer";
import AnnouncerModel from "../../model/main/AnnouncerModel";
import UserInfoCache from "../../cache/UserInfoCache";
import ModelEvent from "../../utils/ModelEvent";
import ToastUtil from "../base/ToastUtil";
import Config from "../../configs/Config";
import { EVT_LOGIC_PHONE_CANCEL } from "../../hardcode/HLogicEvent";


export default class PhoneDialog extends BaseView {
    constructor(props) {
        super(props);

        this._userId = this.props.params.userId;
        this._data = this.props.params.data;

        this._userInfo = null;

        this._top = 10;
        this._left = 5;
        this._leftResponder = true;
        //是否已经判断手势起手式
        this._bJudge = false;
        this._panResponder = PanResponder.create({
            // 返回ture时，表示该组件愿意成为触摸事件的响应者，如触摸点击。默认返回false。
            onStartShouldSetPanResponder: () => true,
            // 返回ture时，表示该组件愿意成为触摸(滑屏)事件的响应者，如触摸滑屏，默认返回false。
            onMoveShouldSetPanResponder: () => true,
            // 与onStartShouldSetPanResponder相同，当此组件A里包含了子组件B也为触摸事件响应者时，若此时设为true，则父组件A优先级更高
            onStartShouldSetPanResponderCapture: () => false,
            // 与onMoveShouldSetPanResponder相同，当此组件A里包含了子组件B也为触摸事件响应者时，若此时设为true，则父组件A优先级更高
            onMoveShouldSetPanResponderCapture: () => false,
            // 手势刚开始触摸(即刚接触屏幕时)时，若响应成功则触发该事件
            onPanResponderGrant: (evt, gestureState) => { },
            // 手势刚开始触摸(即刚接触屏幕时)时，若响应失败则触发该事件，失败原因有可能是其它组件正在响应手势且不肯放权
            onResponderReject: (evt, gestureState) => { },
            // 手势滑动时触发该事件
            onPanResponderMove: (evt, gestureState) => {
                //判断是左右滑动还是上滑动
                if (!this._bJudge && (Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10)) {
                    this._leftResponder = !(gestureState.dy < 0 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy));
                    this._bJudge = true;
                }

                if (this._leftResponder) {
                    //如果是水平滑动
                    this._left = 5 + gestureState.dx;
                    this.forceUpdate();
                } else {
                    this._top = 10 + gestureState.dy > 10 ? 10 : 10 + gestureState.dy;
                    this.forceUpdate();
                }

            },
            // 手势松开时触发该事件
            onPanResponderRelease: (evt, gestureState) => {
                if (this._leftResponder) {
                    if (5 - this._left > 40 || this._left - 5 > 40) {
                        this._left = 5;
                        this._cancelPhone();
                    } else {
                        this._left = 5;
                    }
                } else {
                    if (10 - this._top > 40 || this._top - 10 > 40) {
                        this._top = 10;
                        this._cancelPhone();
                    } else {
                        this._top = 10;
                    }
                }
                this._bJudge = false;
                this.forceUpdate();
            },
            // 当其它组件需要响应手势时，此时为ture则表示本组件愿意放权给其它组件响应；为false时表示不放权，依然由本组件来响应手势事件
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            // 当组件响应放权后(即由其它组件拿到了手势响应权)触发该事件
            onPanResponderTerminate: (evt, gestureState) => { }
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this._initData();
        Vibration.vibrate([0, 1000, 2000, 3000], true);
        ModelEvent.addEvent(null, EVT_LOGIC_PHONE_CANCEL, this._cancelPhoneEvent)
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        Vibration.cancel();
        ModelEvent.removeEvent(null, EVT_LOGIC_PHONE_CANCEL, this._cancelPhoneEvent)
    }

    _initData = () => {
        require('../../model/userinfo/UserInfoModel').default.getPersonPage(this._userId)
            .then(data => {
                this._userInfo = data;
                this.forceUpdate();
            })
    }

    _cancelPhoneEvent = data => {
        this.popSelf();
        switch (data.status) {
            case 3:
                ToastUtil.showCenter("用户取消呼叫")
                break
            case 4:
                ToastUtil.showCenter("呼叫超时")
                break
        }
    }


    /**
     * 接电话
     */
    _startPhone = async () => {
        this.popSelf();
        if (await AnnouncerModel.pickUpCall()) {
        }
    }

    /**
     * 挂电话
     */
    _cancelPhone = () => {
        require("../../router/level2_router").showNormInfoDialog("非勿扰模式下挂断电话将影响您在首页的推荐位置哦～", "挂断", this._stopPhone)
    }

    _stopPhone = () => {
        AnnouncerModel.cancelCall(UserInfoCache.userId);
        this.popSelf();
    }


    render() {
        const head = !this._userInfo ? null : { uri: Config.getHeadUrl(this._userInfo.userId, this._userInfo.logoTime, this._userInfo.thirdIconurl) }
        const nickName = !this._userInfo ? "" : decodeURI(this._userInfo.nickName)
        const desc = "申请与你1v1热聊";

        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    justifyContent: "flex-start",
                }}
            >
                <Animated.View
                    style={{
                        marginTop: DesignConvert.getH(this._top) + DesignConvert.statusBarHeight,
                        marginLeft: DesignConvert.getW(this._left),
                        width: DesignConvert.getW(365),
                        height: DesignConvert.getH(79),
                    }}
                >
                    <ImageBackground
                        {...this._panResponder.panHandlers}
                        source={dialog_bg()}
                        style={{
                            width: DesignConvert.getW(365),
                            height: DesignConvert.getH(79),
                            borderRadius: DesignConvert.getW(15),
                            flexDirection: "row",
                            alignItems: "center",
                            padding: DesignConvert.getH(18),
                        }}>


                        <Image
                            source={head}
                            style={{
                                width: DesignConvert.getW(44),
                                height: DesignConvert.getH(44),
                                borderRadius: DesignConvert.getW(10),
                            }}>
                        </Image>

                        <View
                            style={{
                                marginLeft: DesignConvert.getW(9),
                                justifyContent: "center",
                            }}>

                            <Text
                                numberOfLines={1}
                                style={{
                                    color: "#333333",
                                    fontSize: DesignConvert.getF(12),
                                    fontWeight: "bold",
                                    maxWidth: DesignConvert.getW(100),
                                }}>
                                {nickName}
                            </Text>

                            <Text
                                style={{
                                    color: "#999999",
                                    fontSize: DesignConvert.getF(11),
                                    marginTop: DesignConvert.getH(2),
                                }}>
                                {desc}
                            </Text>
                        </View>

                    </ImageBackground>

                    <TouchableOpacity
                        onPress={this._cancelPhone}
                        style={{
                            position: "absolute",
                            right: DesignConvert.getW(97),
                            top: DesignConvert.getH(21),
                        }}>
                        <Image
                            source={cir_phone_stop()}
                            style={{
                                width: DesignConvert.getW(35),
                                height: DesignConvert.getH(35),
                            }}>
                        </Image>
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={this._startPhone}
                        style={{
                            position: "absolute",
                            right: DesignConvert.getW(31),
                            top: DesignConvert.getH(21),
                        }}>
                        <Image
                            source={cir_phone_start()}
                            style={{
                                width: DesignConvert.getW(35),
                                height: DesignConvert.getH(35),
                            }}>
                        </Image>
                    </TouchableOpacity>
                </Animated.View>
            </View >
        )
    }
}