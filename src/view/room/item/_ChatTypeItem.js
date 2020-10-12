'use strict';

import React, { PureComponent } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import _ChatClassicTypeItem from "./chat/classic/_ChatClassicTypeItem";
import { icon_arrowdown_black } from "../../../hardcode/skin_imgs/anchorincome";
import { CLASSIC_ALL, CLASSIC_GIFT, CLASSIC_IM, getCurClassic, setCurClassic } from "../../../cache/RoomPublicScreenCache";

export default class _ChatTypeItem extends PureComponent {


    constructor(props) {
        super(props);

        this._classicText = "全部"
        this.bShow = false;
    }

    _onClassicType = (classic) => {
        this.bShow = false;
        switch (classic) {
            case CLASSIC_ALL:
                this._classicText = "全部"
                break
            case CLASSIC_GIFT:
                this._classicText = "礼物"
                break
            case CLASSIC_IM:
                this._classicText = "消息"
                break
        }
        this.forceUpdate()
        setCurClassic(classic);
    }


    _onClassicPress = () => {
        this.bShow = true;
        this.forceUpdate();
    }


    render() {
        const typeItemBottom = DesignConvert.getH(45) + DesignConvert.getH(10);
        const classic = getCurClassic();
        const top = DesignConvert.getH(420) + DesignConvert.statusBarHeight;

        return (
            <View
                style={{
                    position: 'absolute',
                    right: 0,
                    top: top,
                }}
            >
                <TouchableOpacity
                    onPress={this._onClassicPress}
                    style={{
                        width: DesignConvert.getW(56),
                        height: DesignConvert.getH(24),
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#FFFFFF40",
                        borderTopLeftRadius: DesignConvert.getW(30),
                        borderBottomLeftRadius: DesignConvert.getW(30),
                    }}>
                    <Text
                        style={{
                            color: "white",
                            fontSize: DesignConvert.getF(11),
                            marginRight: DesignConvert.getW(5),
                        }}>
                        {this._classicText}
                    </Text>

                    <Image
                        source={icon_arrowdown_black()}
                        style={{
                            width: DesignConvert.getW(9),
                            height: DesignConvert.getH(5),
                            tintColor: "white",
                        }}></Image>
                </TouchableOpacity>

                {this.bShow ? (
                    <View
                        style={{
                            backgroundColor: "#FFFFFF40",
                            borderRadius: DesignConvert.getW(5),
                            marginEnd: DesignConvert.getW(6),
                            marginTop: DesignConvert.getH(5),
                        }}>
                        <_ChatClassicTypeItem
                            classicType={CLASSIC_ALL}
                            classicName={'全部'}
                            bottom={typeItemBottom + 2 * DesignConvert.getH(24)}
                            onPress={this._onClassicType}
                            selected={classic}
                        />
                        <_ChatClassicTypeItem
                            classicType={CLASSIC_GIFT}
                            classicName={'礼物'}
                            bottom={typeItemBottom + DesignConvert.getH(24)}
                            onPress={this._onClassicType}
                            selected={classic}
                        />
                        <_ChatClassicTypeItem
                            classicType={CLASSIC_IM}
                            classicName={'聊天'}
                            bottom={typeItemBottom}
                            onPress={this._onClassicType}
                            selected={classic}
                        />
                    </View>
                ) : null}
            </View>
        )
    }
}