/**
 * 普通dialog
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { THEME_COLOR } from "../../styles";

export default class NormTitleInfoDialog extends BaseView {
    constructor(props) {
        super(props);

        if (!this.props.params.dialogTitleText) {
            this._dialogTitleText = "提示"
        } else {
            this._dialogTitleText = this.props.params.dialogTitleText;
        }

        if (!this.props.params.dialogContentText) {
            this._dialogContentText = "暂不支持哦"
        } else {
            this._dialogContentText = this.props.params.dialogContentText;
        }

        if (!this.props.params.negativePress) {
            this._negativePress = this._onBackPress;
        } else {
            this._negativePress = () => {
                this.props.params.negativePress();
                this._onBackPress();
            };
        }

        if (!this.props.params.negativeText) {
            this._negativeText = "取消";
        } else {
            this._negativeText = this.props.params.negativeText;
        }

        if (!this.props.params.positivePress) {
            this._positivePress = this._onBackPress;
        } else {
            this._positivePress = () => {
                this.props.params.positivePress();
                this._onBackPress();
            };
        }

        if (!this.props.params.positiveText) {
            this._positiveText = "确认";
        } else {
            this._positiveText = this.props.params.positiveText;
        }

    }

    _onBackPress = () => {
        this.popSelf();
    }

    render() {
        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: "#00000033",
                }}
                onPress={this.popSelf}
            >

                <View
                    style={{
                        width: DesignConvert.getW(264),
                        height: DesignConvert.getH(173),
                        backgroundColor: 'white',

                        borderRadius: DesignConvert.getW(10),

                        // borderTopLeftRadius: DesignConvert.getW(10),
                        // borderTopRightRadius: DesignConvert.getW(10),

                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            marginTop: DesignConvert.getH(15),
                            color: '#1D1D1D',
                            fontSize: DesignConvert.getF(16),
                            fontWeight: 'bold',
                        }}
                    >{this._dialogTitleText}</Text>

                    <Text
                        style={{
                            marginTop: DesignConvert.getH(14),
                            color: '#333333',
                            fontSize: DesignConvert.getF(14),
                            textAlign: "center",
                            width: DesignConvert.getW(210),
                            alignSelf: "center",
                        }}
                    >{this._dialogContentText}</Text>

                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            height: DesignConvert.getH(45),

                            flexDirection: 'row',
                        }}>

                        <View
                            style={{
                                width: DesignConvert.getW(264),
                                height: DesignConvert.getH(0.5),
                                backgroundColor: '#F0F0F0',
                                position:"absolute",
                            }}></View>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                            }}
                            onPress={this._negativePress}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: 'white',
                                    borderBottomLeftRadius: DesignConvert.getW(10),

                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#333333',
                                        fontSize: DesignConvert.getF(15),
                                    }}
                                >{this._negativeText}</Text>
                            </View>
                        </TouchableOpacity>

                        <View
                            style={{
                                width: DesignConvert.getW(0.5),
                                height: DesignConvert.getH(45),
                                backgroundColor: '#F0F0F0',
                            }}></View>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                            }}
                            onPress={this._positivePress}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: "white",
                                    borderBottomRightRadius: DesignConvert.getW(10),

                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: THEME_COLOR,
                                        fontSize: DesignConvert.getF(15),
                                    }}
                                >{this._positiveText}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>


            </TouchableOpacity>

        )
    }
}
