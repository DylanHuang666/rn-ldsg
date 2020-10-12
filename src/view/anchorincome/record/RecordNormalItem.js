/**
 * 当各种记录{流水记录，提现记录， 兑换记录， 直播间记录}样式一致时直接用这个,否则这个就是流水记录
 */


'use strict';

import React, { PureComponent } from 'react';
import { Image, Text, View } from 'react-native';
import DesignConvert from '../../../utils/DesignConvert';

export default class RecordNormalItem extends PureComponent {

    _renderImage(imageUri) {
        if (imageUri) {
            // console.log(imageUri);
            return (
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={{
                            color: '#AEAEAE',
                            fontSize: DesignConvert.getF(11),
                            fontWeight: 'normal',
                            alignSelf: 'center',
                            marginRight: DesignConvert.getW(5),
                        }}
                    >来自</Text>

                    <Image
                        source={{ uri: imageUri }}
                        style={{
                            width: DesignConvert.getW(22),
                            height: DesignConvert.getH(22),
                            borderRadius: DesignConvert.getW(16),
                            marginRight: DesignConvert.getW(5),
                        }}
                    ></Image>
                </View>
            );
        } else {
            return (
                <View></View>
            );
        }
    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(73),
                    paddingLeft: DesignConvert.getW(20),
                    paddingRight: DesignConvert.getW(20),
                    flexDirection: "row",
                    alignItems: 'center',
                }}>

                {this.props.item.leftImg ? (
                    <Image
                        resizeMode="contain"
                        source={this.props.item.leftImg}
                        style={{
                            width: DesignConvert.getW(32),
                            height: DesignConvert.getH(32),
                            marginRight: DesignConvert.getW(11),
                        }}
                    ></Image>
                ) : null}

                <View
                    style={{
                        flex: 1,
                        height: DesignConvert.getH(73),
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                            {this.props.item.img ? (
                                <Image
                                    resizeMode="contain"
                                    source={this.props.item.img}
                                    style={{
                                        width: DesignConvert.getW(18),
                                        height: DesignConvert.getH(18),
                                        marginRight: DesignConvert.getW(5),
                                    }}
                                ></Image>
                            ) : null}

                            <Text
                                style={[{
                                    color: "#1D1D1D",
                                    fontSize: DesignConvert.getF(13),
                                    fontWeight: "normal",
                                }, this.props.item.contentStyle]}
                            >{this.props.item.content}</Text>
                        </View>

                        {this.props.item.rightImg ? (
                            <Image
                                resizeMode="contain"
                                source={this.props.item.rightImg}
                                style={{
                                    width: DesignConvert.getW(18),
                                    height: DesignConvert.getH(18),
                                    marginRight: DesignConvert.getW(5),
                                }}
                            ></Image>
                        ) : null}

                        <Text
                            style={[{
                                color: "#1D1D1D",
                                fontSize: DesignConvert.getF(13),
                                fontWeight: "normal",
                            }, this.props.item.rightTextStyle]}
                        >{this.props.item.rightText}</Text>



                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: DesignConvert.getH(5),
                        }}>

                        {this._renderImage(this.props.item.imageUri)}

                        <Text
                            numberOfLines={1}
                            style={[{
                                flex: 1,
                                color: '#1D1D1D',
                                fontSize: DesignConvert.getF(11),
                                fontWeight: "normal",
                                alignSelf: 'center',
                                marginRight: DesignConvert.getH(5),
                            }, this.props.item.leftTextStyle]}
                        >{this.props.item.leftText}</Text>

                        <Text
                            style={[{
                                color: '#B8B8B8',
                                fontSize: DesignConvert.getF(11),
                                fontWeight: 'normal',
                                alignSelf: 'center',
                            }, this.props.item.timeStyle]}
                        >{this.props.item.time}</Text>
                    </View>

                </View>

                <View
                    style={{
                        width: DesignConvert.getW(345),
                        height: DesignConvert.getH(0.5),
                        backgroundColor: "#F6F6F6",
                        position: "absolute",
                        left: DesignConvert.getW(15),
                        bottom: 0,
                    }}></View>
            </View>
        )
    }
}