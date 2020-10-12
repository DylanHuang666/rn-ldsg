/**
 * InfoDialog
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { LINEARGRADIENT_COLOR } from "../../styles";

export default class InfoDialog extends BaseView {
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

        if (!this.props.params.positiveText) {
            this._positiveText = "我知道了";
        } else {
            this._positiveText = this.props.params.positiveText;
        }

    }

    _onBackPress = () => {
        this.popSelf();
    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        width: DesignConvert.getW(297),
                        borderRadius: DesignConvert.getW(10),
                        backgroundColor: "white",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: DesignConvert.getW(22),
                    }}>

                    {this._dialogTitleText ? (
                        <Text
                            style={{
                                color: "#333333",
                                fontSize: DesignConvert.getF(16),
                                marginBottom: DesignConvert.getH(20),
                            }}
                        >{this._dialogTitleText}</Text>
                    ) : null}


                    <Text
                        style={{
                            color: "#333333",
                            fontSize: DesignConvert.getF(14),
                            textAlign: "center",
                        }}
                    >{this._dialogContentText}</Text>

                    <TouchableOpacity
                        style={{
                            marginTop: DesignConvert.getH(20),
                        }}
                        onPress={this._onBackPress}>

                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={LINEARGRADIENT_COLOR}
                            style={{
                                width: DesignConvert.getW(120),
                                height: DesignConvert.getW(40),
                                borderRadius: DesignConvert.getW(6),
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: DesignConvert.getF(14),
                                    textAlign: "center",
                                }}
                            >{this._positiveText}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}