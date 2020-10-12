/**
 * 标题返回控件
 */
'use strict';

import React, { PureComponent } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ic_back_black } from "../../hardcode/skin_imgs/common";
import DesignConvert from "../../utils/DesignConvert";
import StatusBarView from "./StatusBarView";
import LinearGradient from 'react-native-linear-gradient';


{/* <BackTitleView
    containerStyle={{       //容器的样式，一般用来设置背景颜色
    }}

    bgColor={['#CB5CFF', '#FF4D91']}

    onBack={() => { }}       //返回处理
    backImgStyle={{}}       //返回的图片样式，一般设置 tintColor，来改变颜色

    titleTextStyle={{}}     //中间标题的样式，一般设置字体颜色，默认是白色
    titleText={'标题'}      //标题文案

    rightText={'右面文本'}  //右面的文本
    rightTouchStyle={{}}    //右面点击样式
    rightTextStyle={{}}     //右面文本样式
    onRightPress={() => { }}//右面文本点击处理

    rightImg={}             //右面图片
    rightImgStyle={{}}      //右面图片样式

    bShowUnderLine={true}   //是否显示底部线条

/> */}

export default class BackTitleView extends PureComponent {


    render() {
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={this.props.bgColor ? this.props.bgColor : ['#FFFFFF', '#FFFFFF']
                }
            >

                <StatusBarView
                    style={{
                        backgroundColor: '#FFFFFFF00'
                    }}
                />

                <View
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(44),
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',

                        ... this.props.containerStyle,
                    }}
                >

                    <Text
                        numberOfLines={1}
                        style={{
                            maxWidth: DesignConvert.getW(200),
                            fontWeight: '800',
                            color: '#333333',
                            fontSize: DesignConvert.getF(17),

                            ... this.props.titleTextStyle,
                        }}
                    >{this.props.titleText}</Text>

                    <TouchableOpacity
                        style={{
                            height: DesignConvert.getH(44),
                            position: 'absolute',
                            left: 0,
                            justifyContent: 'center',
                        }}
                        onPress={this.props.onBack}
                    >
                        <Image
                            style={{
                                width: DesignConvert.getW(9),
                                height: DesignConvert.getH(15),
                                marginLeft: DesignConvert.getW(15),
                                marginEnd: DesignConvert.getW(15),

                                ... this.props.backImgStyle,
                            }}
                            source={require('../../hardcode/skin_imgs/lvdong').title_back_icon()}
                        />
                    </TouchableOpacity>

                    {this.props.rightText ? (
                        <View
                            style={{
                                position: 'absolute',
                                right: DesignConvert.getW(15),
                                top: DesignConvert.getH(12),
                                minWidth: DesignConvert.getW(30),
                            }}>

                            <TouchableOpacity
                                onPress={this.props.onRightPress}
                                style={{
                                    minWidth: DesignConvert.getW(50),
                                    height: DesignConvert.getH(24),
                                    justifyContent: "center",
                                    alignItems: "center",

                                    ... this.props.rightTouchStyle,
                                }}>
                                <Text
                                    style={{
                                        color: '#333333',
                                        fontSize: DesignConvert.getF(13),

                                        ... this.props.rightTextStyle,
                                    }}
                                >{this.props.rightText}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {this.props.rightImg ? (
                        <TouchableOpacity
                            style={{
                                height: DesignConvert.getH(44),
                                position: 'absolute',
                                right: 0,
                                justifyContent: 'center',
                            }}
                            onPress={this.props.onRightPress}
                        >
                            <Image
                                style={{
                                    width: DesignConvert.getW(17),
                                    height: DesignConvert.getH(20),
                                    marginLeft: DesignConvert.getW(15),
                                    marginEnd: DesignConvert.getW(15),

                                    ... this.props.rightImgStyle,
                                }}
                                source={this.props.rightImg}
                            />
                        </TouchableOpacity>
                    ) : null}
                </View>

                {
                    this.props.bShowUnderLine ? (
                        <View
                            style={{
                                width: DesignConvert.swidth,
                                height: DesignConvert.getH(0.5),
                                backgroundColor: "#F1F1F1",
                            }}
                        />
                    ) : null
                }
            </LinearGradient >
        );
    }
}