/**
 * Listdialog
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';


class _Item extends PureComponent {
    _onPress = () => {
        this.props.popSelf && this.props.popSelf();
        this.props.item && this.props.item.onPress && this.props.item.onPress();
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this._onPress}
                style={{
                    width: DesignConvert.getW(320),
                    height: DesignConvert.getH(44),
                    backgroundColor: "white",
                    borderRadius: DesignConvert.getW(10),
                    alignSelf: "center",
                    justifyContent: "center",
                    alignItems: "center",

                    ... this.props.containerStyle,
                }}>

                <Text
                    style={{
                        color: "#1D1D1D",
                        fontSize: DesignConvert.getF(16),
                    }}>{this.props.item.text}</Text>

                {this.props.hideLine ? null : (
                    <View
                        style={{
                            width: DesignConvert.getW(320),
                            height: DesignConvert.getH(1),
                            backgroundColor: "#878787",
                            position: "absolute",
                            bottom: 0,
                        }}></View>
                )}
            </TouchableOpacity>
        )
    }
}
/**
 * items[{text, onPress}]
 */
export default class ListDialog extends BaseView {
    constructor(props) {
        super(props);

        this._items = this.props.params.items || [];

    }

    render() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={this.popSelf}
                style={{
                    width: DesignConvert.swidth,
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    flexDirection: "column-reverse",
                    alignItems: "center",
                    paddingBottom: DesignConvert.getH(10) + DesignConvert.addIpxBottomHeight(),
                }}>

                <_Item
                    hideLine
                    item={{ text: "取消" }}
                    popSelf={this.popSelf} />

                <View
                    style={{
                        width: DesignConvert.getW(320),
                        backgroundColor: "white",
                        borderRadius: DesignConvert.getW(10),
                        marginBottom: DesignConvert.getH(10),
                    }}>
                    {this._items.map((item, index) => (
                        <_Item
                            key={index}
                            hideLine={index == this._items.length - 1}
                            item={item}
                            popSelf={this.popSelf} />
                    ))}
                </View>
            </TouchableOpacity>
        )
    }
}