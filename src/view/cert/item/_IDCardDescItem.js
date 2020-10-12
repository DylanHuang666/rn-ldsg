/**
 * 实名认证 上传身份证 身份证描述
 */
'use strict';

import React, { PureComponent } from "react";
import { Image, Text, View } from 'react-native';
import {
    ic_blurry, ic_correct,
    ic_incomplete,
    ic_lightly,
    ic_no,
    ic_yes,
} from '../../../hardcode/skin_imgs/certification';
import DesignConvert from '../../../utils/DesignConvert';
import { THEME_COLOR } from "../../../styles";

class _Item extends PureComponent {
    render() {
        return (
            <View
                style={{
                    width: DesignConvert.getW(79),
                    alignItems: 'center',
                }}>

                <Image
                    source={this.props.img}
                    style={{
                        width: DesignConvert.getW(79),
                        height: DesignConvert.getH(53),
                    }}></Image>

                <View
                    style={{
                        marginTop: DesignConvert.getH(6),
                        flexDirection: "row",
                        alignItems: "center",
                    }}>

                    <Image
                        source={this.props.bCorrect ? ic_yes() : ic_no()}
                        style={{
                            width: DesignConvert.getW(9),
                            height: DesignConvert.getH(9),
                            marginRight: DesignConvert.getW(6),
                        }}></Image>

                    <Text
                        style={{
                            color: "#333333",
                            fontSize: DesignConvert.getF(10),
                        }}>
                        {this.props.desc}
                    </Text>
                </View>
            </View>
        )
    }
}

export default class _IDCardDescItem extends PureComponent {
    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                }}>

                <View
                    style={{
                        width: DesignConvert.getW(345),
                        backgroundColor: "#F0F0F0",
                        height: DesignConvert.getH(1),
                        alignSelf: "center",
                    }}></View>

                <Text
                    style={{
                        color: "#999999",
                        fontSize: DesignConvert.getF(12),
                        marginTop: DesignConvert.getH(17),
                        marginLeft: DesignConvert.getW(15),
                    }}>
                    {"拍摄时，请确保身份证"}

                    <Text
                        style={{
                            color: THEME_COLOR,
                        }}>
                        {"边框完整，字体清晰，亮度均匀"}
                    </Text>
                </Text>

                <View
                    style={{
                        width: DesignConvert.swidth,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        marginTop: DesignConvert.getH(17),
                    }}>

                    <_Item
                        bCorrect
                        img={ic_correct()}
                        desc={"标准拍摄"}
                    />

                    <_Item
                        img={ic_incomplete()}
                        desc={"边框缺失"}
                    />

                    <_Item
                        img={ic_blurry()}
                        desc={"照片模糊"}
                    />

                    <_Item
                        img={ic_lightly()}
                        desc={"强烈闪光"}
                    />
                </View>
            </View>
        )
    }
}