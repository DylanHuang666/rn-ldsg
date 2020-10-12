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
import {THEME_COLOR} from '../../styles/index';

export default class NormInfoDialog extends BaseView {
    constructor(props) {
        super(props);

        if (!this.props.params.dialogTitleText) {
            this._dialogTitleText = null
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
                this._onBackPress();
                this.props.params.negativePress();
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
                this._onBackPress();
                this.props.params.positivePress();
            };
        }

        if (!this.props.params.positiveText) {
            this._positiveText = "我知道了";
        } else {
            this._positiveText = this.props.params.positiveText;
        }

    }

    _onBackPress = () => {
        this.popSelf();
    }

    _renderLine = () => {
        return (
            <View
                style={{
                    width: DesignConvert.getW(270),
                    height: DesignConvert.getH(1),
                    backgroundColor: "#F0F0F0",
                }}></View>
        )
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
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={{
                        width: DesignConvert.getW(270),
                        borderRadius: DesignConvert.getW(15),
                        backgroundColor: "white",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: DesignConvert.getH(21),
                    }}
                >
                    {this._dialogTitleText ? (
                        <Text
                            style={{
                                color: "#333333",
                                textAlign: "center",
                                fontWeight: "bold",
                                marginBottom: DesignConvert.getH(16),
                            }}
                        >{this._dialogTitleText}</Text>
                    ) : null}

                    <Text
                        style={{
                            color: "#333333",
                            fontSize: DesignConvert.getF(14),
                            width: DesignConvert.getW(224),
                            textAlign: "center",
                            marginBottom: DesignConvert.getH(16),
                        }}
                    >{this._dialogContentText}</Text>

                    {this._renderLine()}

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                height: DesignConvert.getW(45),
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={this._negativePress}>

                            <Text
                                style={{
                                    color: "#333333",
                                    fontSize: DesignConvert.getF(15),
                                    textAlign: "center",
                                }}
                            >{this._negativeText}</Text>
                        </TouchableOpacity>

                        <View
                            style={{
                                width: DesignConvert.getW(1),
                                height: DesignConvert.getH(45),
                                backgroundColor: "#F0F0F0",
                            }}></View>

                        <TouchableOpacity
                            style={{
                                flex: 1,
                                height: DesignConvert.getW(45),
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={this._positivePress}>

                            <Text
                                style={{
                                    color: THEME_COLOR,
                                    fontSize: DesignConvert.getF(15),
                                    textAlign: "center",
                                }}
                            >{this._positiveText}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
}
