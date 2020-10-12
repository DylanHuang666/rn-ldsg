/**
 * DatePickerDialog
 * 日期选择界面
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, Modal } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { THEME_COLOR } from "../../styles";


export default class DatePickerDialog extends BaseView {
    constructor(props) {
        super(props);

        this._selectedTime = !this.props.params.selectedTime ? new Date() : this.props.params.selectedTime;
        this._dateFormatString = !this.props.params.dateFormatString ? "YYYY-MM-DD" : this.props.params.dateFormatString;
        this._dateString = moment(this._selectedTime).format(this._dateFormatString);
        this._title = this.props.params.title;

        this._datePickerVisible = true;
    }

    /**
     * datePicker的确定按钮
     */
    _onDateChangePress = () => {
        this._dateString = moment(this._dateSelected).format(this._dateFormatString);

        this.popSelf();
        this.props.params.dateSelectedCallback && this.props.params.dateSelectedCallback(this._dateString);
    }


    /**
     * datePicker滑动时暂存
     */
    _handleDateTimeChange = (date) => {
        // console.log(date);
        this._dateSelected = date;
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
                    transparent={true}
                    visible={this._datePickerVisible}
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
                                height: DesignConvert.getH(50),
                                backgroundColor: 'white',
                                borderTopLeftRadius: DesignConvert.getW(8),
                                borderTopRightRadius: DesignConvert.getW(8),
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingLeft: DesignConvert.getW(15),
                                paddingRight: DesignConvert.getW(15),
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
                                        color: THEME_COLOR,
                                        fontSize: DesignConvert.getF(15),
                                        fontWeight: 'normal',
                                    }}>取消</Text>
                            </TouchableOpacity>

                            {this._title ? (
                                <Text
                                    style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        color: '#333333',
                                        fontSize: DesignConvert.getF(15),
                                    }}
                                >{this._title}</Text>
                            ) : null}

                            <TouchableOpacity
                                onPress={this._onDateChangePress}
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "flex-end",
                                    paddingHorizontal: DesignConvert.getW(15),
                                }}>
                                <Text
                                    style={{
                                        color: THEME_COLOR,
                                        fontSize: DesignConvert.getF(16),
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

                        <DatePicker
                            mode="date"
                            date={this._selectedTime}
                            maximumDate={new Date()}
                            onDateChange={this._handleDateTimeChange}
                            style={{
                                width: DesignConvert.swidth,
                                backgroundColor: "white",
                            }}
                        />
                    </View>
                </Modal>
            </View>
        )
    }
}
