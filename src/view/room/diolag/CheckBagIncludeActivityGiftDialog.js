
'use strict'

import React, { PureComponent } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';
import BaseView from "../../base/BaseView";
import DesignConvert from "../../../utils/DesignConvert";
import Config from "../../../configs/Config";
import LinearGradient from "react-native-linear-gradient";

class ActivityGiftItem extends PureComponent {

    _getGiftImg = (giftItem) => {
        return { uri: Config.getGiftUrl(giftItem.goodsId) };
    }

    render() {
        let giftUrl = this._getGiftImg(this.props.giftItem);

        return (
            <View
                style={{
                    marginHorizontal: DesignConvert.getW(15),
                    flexDirection: "row",
                    alignItems: "center",
                    minWidth: DesignConvert.getW(85),
                    height: DesignConvert.getH(50),
                }}>
                <Image
                    resizeMode="contain"
                    source={giftUrl}
                    style={{
                        width: DesignConvert.getW(50),
                        height: DesignConvert.getH(50),
                        marginRight: DesignConvert.getW(10),
                    }}></Image>

                <Text
                    style={{
                        color: "#333333",
                        fontSize: DesignConvert.getF(14),
                    }}>{`x${this.props.giftItem.num}`}</Text>
            </View>
        )
    }
}

class ActivityGiftItemRow extends PureComponent {
    constructor(props) {
        super(props);

        this._activityGiftList = this.props.activityGiftList;
    }

    render() {
        return (
            <View
                style={{
                    flexDirection: "row",
                }}>
                {this._activityGiftList.map(item => (
                    <ActivityGiftItem
                        giftItem={item} />
                ))}
            </View>
        )
    }
}

export default class CheckBagIncludeActivityGiftDialog extends BaseView {
    constructor(props) {
        super(props);

        this._activityGiftList = [];
        if (this.props.params.activityGiftList) {
            let list = this.props.params.activityGiftList;
            //分层
            if (Array.isArray(list)) {
                for (let i = 0; i < list.length; i += 2) {
                    this._activityGiftList.push(list.slice(i, i + 2))
                }
            }
        }
    }

    _sendAllGfitAndActivityGift = () => {
        this.popSelf();
        if (this.props.params.sendAllGfitAndActivityGift) {
            this.props.params.sendAllGfitAndActivityGift();
        }
    }

    _sendAllGift = () => {
        this.popSelf();
        if (this.props.params.sendAllGift) {
            this.props.params.sendAllGift();
        }
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.popSelf}
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                }}>

                <TouchableOpacity
                    activeOpacity={1}
                    style={{
                        width: DesignConvert.getW(297),
                        alignItems: "center",
                        backgroundColor: "white",
                        borderRadius: DesignConvert.getW(13),
                        padding: DesignConvert.getW(20),
                    }}>

                    <Text
                        style={{
                            minWidth: DesignConvert.getW(224),
                            marginBottom: DesignConvert.getH(19),
                            color: "#333333",
                            fontSize: DesignConvert.getF(14),
                        }}>{"当前包裹中含有活动礼物，是否确定全部送出？"}</Text>

                    <View
                        style={{
                            marginVertical: DesignConvert.getH(5),
                        }}>
                        {this._activityGiftList.map(item => (
                            <ActivityGiftItemRow
                                activityGiftList={item} />
                        ))}
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: DesignConvert.getH(20),
                        }}>

                        <TouchableOpacity
                            onPress={this._sendAllGfitAndActivityGift}
                            style={{
                                width: DesignConvert.getW(115),
                                height: DesignConvert.getH(35),
                                borderWidth: DesignConvert.getW(1),
                                borderColor: "#A055FF",
                                borderRadius: DesignConvert.getW(18),
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            <Text
                                style={{
                                    color: "#A055FF",
                                    fontSize: DesignConvert.getF(13),
                                }}>{"确认全部送出"}</Text>
                        </TouchableOpacity>

                        <View
                            style={{
                                flex: 1,
                            }}></View>

                        <TouchableOpacity
                            onPress={this._sendAllGift}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={["#7479FF", "#B785FF"]}
                                style={{
                                    width: DesignConvert.getW(115),
                                    height: DesignConvert.getH(35),
                                    borderRadius: DesignConvert.getW(18),
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: DesignConvert.getF(13),
                                    }}>{"仅送出普通礼物"}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
}