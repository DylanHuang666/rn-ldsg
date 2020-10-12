/**
 * 修改生日页面
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import DatePicker from 'react-native-date-picker';
import Picker from "react-native-wheel-picker";
import moment from "moment";
import Config from '../../configs/Config';
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal, ImageBackground, TextInput } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import { THEME_COLOR } from "../../styles";


export default class BirthdaySelect extends BaseView {


    constructor(props) {
        super(props)
        this._dateString = moment().format("YYYY-MM-DD");
        this._dateSelected = new Date();

    }

    _onDateChangePress = () => {
        let date = this._dateSelected;

        let YY = date.getFullYear() + '-';
        let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        this._dateString = YY + MM + DD;

        let nowDate = new Date();
        let age = nowDate.getFullYear() - date.getFullYear();
        if (nowDate.getMonth() < date.getMonth()) {
            age--;
        } else if (nowDate.getMonth() == date.getMonth()) {
            if (nowDate.getDate() < date.getDate()) {
                age--;
            }
        }
        this._text = age + "";

        this.props.params.callBack(this._dateString)

        this.popSelf()

    }


    _handleDateTimeChange = (date) => {
        // console.log(date);
        this._dateSelected = date;
    }

    render() {
        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <TouchableOpacity
                    onPress={this.popSelf}
                    style={{
                        flex: 1,
                    }}
                />

                <View
                    style={{
                        borderTopLeftRadius: DesignConvert.getW(10),
                        borderTopRightRadius: DesignConvert.getW(10),

                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(341),

                        backgroundColor: "#FFFFFF",
                        alignItems: "center",
                    }}>
                    <Text
                        style={{
                            marginTop: DesignConvert.getH(15),

                            color: '#121212',
                            fontSize: DesignConvert.getF(17),
                            fontWeight: 'bold'
                        }}
                    >日期选择</Text>




                    <DatePicker
                        mode="date"
                        date={new Date()}
                        maximumDate={new Date()}
                        onDateChange={this._handleDateTimeChange}
                        style={{
                            width: DesignConvert.swidth,
                            backgroundColor: "white",
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            bottom: DesignConvert.getH(30),

                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(44),

                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: 'space-between',



                            paddingLeft: DesignConvert.getW(38),
                            paddingRight: DesignConvert.getW(38),
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: DesignConvert.getW(130),
                                height: DesignConvert.getH(44),
                                borderRadius: DesignConvert.getW(24),

                                justifyContent: 'center',
                                alignItems: 'center',

                                backgroundColor: '#ECECEC'
                            }}
                            onPress={this.popSelf}>
                            <Text style={{
                                color: "#121212",
                                fontSize: DesignConvert.getF(14),
                            }}>取消</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: DesignConvert.getW(130),
                                height: DesignConvert.getH(44),
                                borderRadius: DesignConvert.getW(24),

                                justifyContent: 'center',
                                alignItems: 'center',

                                backgroundColor: THEME_COLOR
                            }}
                            onPress={this._onDateChangePress}>
                            <Text style={{
                                color: "#FFFFFF",
                                fontSize: DesignConvert.getF(14),
                            }}>确认</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        )
    }

}
