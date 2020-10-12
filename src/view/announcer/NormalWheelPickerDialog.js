
/**
 * NormalWheelPickerDialog
 * 通用Wheel选择界面
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, Modal } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { THEME_COLOR } from "../../styles";
import Picker from 'react-native-wheel-picker';


const PickerItem = Picker.Item;

export default class NormalWheelPickerDialog extends BaseView {
    constructor(props) {
        super(props);

        this._title = this.props.params.title;
        this._content = this.props.params.content;

        if (!this.props.params.list || this.props.params.list.length == 0) {
            this._list = [this.props.params.defaultSelected]
        }else {
            this._list = this.props.params.list;
        }

        this._dataSelected = this.props.params.defaultSelected;

        this._defaultIndex = 0;
        this._list.forEach((element, index) => {
            if(this._dataSelected == element) {
                this._defaultIndex = index;
            }
        });
    }

    /**
     * Picker的确定按钮
     */
    _onSubmitPress = () => {
        this.popSelf();
        this.props.params.callBack && this.props.params.callBack(this._dataSelected);
    }

    /**
     * 滑动时暂存
     */
    _handleDataChange = (index) => {
        this._dataSelected = this._list[index];
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    paddingBottom: DesignConvert.addIpxBottomHeight(),
                }}>
                <TouchableOpacity
                    onPress={this.popSelf}
                    style={{
                        flex: 1,
                    }}>
                </TouchableOpacity>

                <Modal
                    animationType="fade"
                    transparent
                    visible
                    onRequestClose={this.popSelf}>
                    <View
                        style={{
                            width: DesignConvert.swidth,
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}>

                        <TouchableOpacity
                            onPress={this.popSelf}
                            style={{
                                flex: 1,
                                width: DesignConvert.swidth,
                            }}
                        />


                        <View
                            style={{
                                width: DesignConvert.swidth,
                                height: DesignConvert.getH(68),
                                backgroundColor: 'white',
                                borderTopLeftRadius: DesignConvert.getW(0),
                                borderTopRightRadius: DesignConvert.getW(0),
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <TouchableOpacity
                                onPress={this.popSelf}
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    paddingHorizontal: DesignConvert.getW(15),
                                }}>
                                <Text
                                    style={{
                                        color: '#D1D1D1',
                                        fontSize: DesignConvert.getF(14),
                                        fontWeight: 'normal',
                                    }}>取消</Text>
                            </TouchableOpacity>

                            <View
                                style={{
                                    height: DesignConvert.getH(68),
                                    justifyContent: "center",
                                    alignSelf: "center",
                                }}>
                                {this._title ? (
                                    <Text
                                        style={{
                                            color: "#333333",
                                            fontSize: DesignConvert.getF(15),
                                        }}>{this._title}</Text>
                                ) : null}

                                {this._content ? (
                                    <Text
                                        style={{
                                            color: "#999999",
                                            fontSize: DesignConvert.getF(12),
                                        }}>{this._content}</Text>
                                ) : null}

                            </View>

                            <TouchableOpacity
                                onPress={this._onSubmitPress}
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "flex-end",
                                    paddingHorizontal: DesignConvert.getW(15),
                                }}>
                                <Text
                                    style={{
                                        color: THEME_COLOR,
                                        fontSize: DesignConvert.getF(14),
                                        fontWeight: 'normal',
                                    }}>确定</Text>
                            </TouchableOpacity>

                            <View
                                style={{
                                    backgroundColor: "#F1F1F1",
                                    width: DesignConvert.swidth,
                                    height: DesignConvert.getH(1),
                                    position: "absolute",
                                    bottom: 0,
                                }}></View>
                        </View>

                        <Picker
                            style={{
                                width: DesignConvert.swidth,
                                height: DesignConvert.getH(200),
                                backgroundColor: 'white',
                            }}
                            selectedValue={this._defaultIndex}
                            itemStyle={{
                                color: 'black',
                                fontSize: DesignConvert.getF(26),
                            }}
                            onValueChange={(index) => this._handleDataChange(index)}>
                            {this._list.map((i, value) => (
                                <PickerItem label={i + ""} value={value} key={i} />
                            ))}
                        </Picker>
                    </View>
                </Modal>
            </View>
        )
    }
}