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

class _Item extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={{
                    width: DesignConvert.getW(325),
                    height: DesignConvert.getH(46),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "whte",
                }}>
                <Text
                    style={{
                        color: "#1A1A1A",
                        fontSize: DesignConvert.getF(11),
                    }}>{this.props.text}</Text>

                <View
                    style={{
                        width: DesignConvert.getW(51),
                        height: DesignConvert.getBorderWidth(1),
                        backgroundColor: "#979797",
                        position: "absolute",
                        bottom: 0,
                    }}></View>
            </TouchableOpacity>
        )
    }
}

export default class InfoDialog extends BaseView {
    constructor(props) {
        super(props);

    }

    _onBackPress = () => {
        this.popSelf();
    }

    _pullBlack = () => {
        this.props.params.pullBlackPress(!this.props.params.isPullBlack);
        this.popSelf();
    }

    _Report = () => {
        this.popSelf();
        this.props.params.reportPress();
    }

    _cancelAttiend = () => {
        this.props.params.cancelAttiend();
        this.popSelf();
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this._onBackPress}
                style={styles.bg}
            >
                <View
                    style={{
                        position: "absolute",
                        top: DesignConvert.getH(40),
                        right: DesignConvert.getW(56),
                        flexDirection: "column",
                        alignItems: "center",
                        width: DesignConvert.getW(69),
                        borderRadius: DesignConvert.getW(5),
                        backgroundColor: 'white'
                    }}>
                    <View
                        style={{
                            width: DesignConvert.getW(10),
                            height: DesignConvert.getH(10),
                            backgroundColor: 'white',
                            position: 'absolute',
                            right: DesignConvert.getW(-5),
                            top: DesignConvert.getW(15),
                            transform: [{ rotate: "45deg" }]
                        }}
                    />
                    {this.props.params.cancelAttiend ?
                        <_Item
                            text="取消关注"
                            onPress={this._cancelAttiend} /> : null}

                    <_Item
                        text="举报"
                        onPress={this._Report} />

                    {/* <_Item 
                                text={this.props.params.isPullBlack? "移出黑名单" : "拉黑"}
                                onPress={this._pullBlack}/> */}
                </View>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    bg: {
        width: DesignConvert.swidth,
        height: DesignConvert.sheight,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
})