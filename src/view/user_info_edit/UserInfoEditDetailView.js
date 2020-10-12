
/**
 * 修改页面
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import BackTitleView from "../base/BackTitleView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, Modal, ImageBackground, TextInput } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { TitleBar } from '../anchorincome/ConvertView';
import DatePicker from 'react-native-date-picker';
import Picker from "react-native-wheel-picker";
import moment from 'moment';
import { THEME_COLOR } from "../../styles";

const [nickName, area, birthday, slogan, height] = [520, 555, 886, 777, 996];
export { nickName, area, birthday, slogan, height };

const PickerItem = Picker.Item;
export default class UserInfoEditDetailView extends BaseView {
    constructor(props) {
        super(props);

        this._type = this.props.params.viewType;

        if (this._type == birthday) {
            this._dateString = this.props.params.text;
            this._text = this._getAge(this._dateString);
        } else {
            this._text = this.props.params.text;
        }

        this._pickerVisible = true;
        this._list;
        this._provinceList = [];
        this._cityList = [];

        this._provinceIndex = 0;
        this._cityIndex = 0;

        if (this._type == area) {
            //读取地区数据
            require("../../model/user_info_edit/UserInfoEditModel").default.getAreaData()
                .then(data => {
                    this._list = data;
                    for (let i = 0; i < this._list.length; i++) {
                        this._provinceList[i] = this._list[i].name;
                    }
                    this._setCityList();
                })
        }

    }

    _onBackPress = () => {
        this.popSelf();
    }

    _title() {
        switch (this._type) {
            case nickName:
                return "昵称";
            case area:
                return "地区";
            case birthday:
                return "出生日期";
            case slogan:
                return "个性签名";
            case height:
                return "身高";
            default:
        }
        return "";
    }

    _setCityList = () => {
        this._cityIndex = 0;
        this._cityList = [];
        for (let i = 0; i < this._list[this._provinceIndex].cityList.length; i++) {
            this._cityList[i] = this._list[this._provinceIndex].cityList[i].name;
        }
        this.forceUpdate();
    }

    _onSavePress = () => {
        if (this._text.trim() == "" && this._type == nickName) {
            require("../base/ToastUtil").default.showCenter("昵称不能为空");
            return
        }
        if (this._text.trim() == "" && this._type == height) {
            require("../base/ToastUtil").default.showCenter("身高不能为空");
            return
        }
        switch (this._type) {
            case nickName:
                this.props.params.callBack(this._text);
                break;
            case area:
                this.props.params.callBack(this._text);
                break;
            case birthday:
                this.props.params.callBack(this._dateString);
                break;
            case slogan:
                this.props.params.callBack(this._text);
                break;
            case height:
                this.props.params.callBack(this._text);
                break;
            default:
        }
        this.popSelf();
    }

    _onChangeText = (s) => {
        this._text = s;
        this.forceUpdate();
    }

    /**
     * 日期按钮记录按下那个
     */
    _onDatePress = () => {
        require("../../router/level4_router").showDatePickerDialog(this._setBirthday, "YYYY-MM-DD", new Date(), "出生年月");
    }

    _cancelePress = () => {
        // this._pickerVisible = false;
        // this.forceUpdate();
        this.popSelf()
    }

    _setBirthday = (s) => {
        this._dateString = s;

        this._text = this._getAge(this._dateString);
        this.forceUpdate();
    }

    /**
     * 计算年龄
     */
    _getAge = (dateString) => {
        let nowDate = moment();
        let [year, month, day] = dateString.split("-");
        let age = nowDate.year() - Number(year);
        if (nowDate.month() + 1 < Number(month)) {
            age--;
        } else if (nowDate.month() + 1 == Number(month)) {
            if (nowDate.day() < Number(day)) {
                age--;
            }
        }
        return age + "";
        // try {
        //     let nowDate = moment.now();
        //     let [year, month, day] = dateString.split("-");
        //     let age = nowDate.getFullYear() - Number(year);
        //     if (nowDate.getMonth < Number(month)) {
        //         age--;
        //     } else if (nowDate.getMonth() == Number(month)) {
        //         if (nowDate.getDate() < Number(day)) {
        //             age--;
        //         }
        //     }
        //     return age + "";
        // }catch(err) {
        //     return dateString;
        // }
    }

    /**
     * 地区选择器
     */
    _onAreaPress = () => {
        if (this._list.length == 0) {
            require("../base/ToastUtil").default.showCenter("地区数据加载中");
            return
        }
        this._pickerVisible = true;
        this.forceUpdate();
    }

    /**
     * Province滑动时暂存
     */
    _onProvincePickerSelect = (index) => {
        // console.log(index);
        this._provinceIndex = index;
        this._setCityList();
        this.forceUpdate()
    }

    /**
     * City滑动时暂存
     */
    _onCityPickerSelect = (index) => {
        // console.log(index);
        this._cityIndex = index;
    }

    _onAreaChangePress = () => {
        this._text = this._cityList[this._cityIndex];
        this._pickerVisible = false;
        this.forceUpdate();
        this._onSavePress()
        // this.popSelf();
    }

    _renderAreaPicker() {
        if (this._provinceList.length > 0) {
            return (

                <View
                    style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                        backgroundColor: "red",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}>

                    <View
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(26),
                            backgroundColor: "white",
                            flexDirection: "row",
                            alignItems: "center",
                            paddingLeft: DesignConvert.getW(20),
                            paddingRight: DesignConvert.getW(20),
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this._pickerVisible = false;
                                this.forceUpdate();
                                this.popSelf()
                            }}>
                            <Text style={{
                                color: THEME_COLOR,
                                fontSize: DesignConvert.getF(16),
                                fontWeight: "normal",
                                alignSelf: "center",
                            }}>取消</Text>
                        </TouchableOpacity>

                        <Text
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                fontSize: DesignConvert.getF(16),
                                color: '#333333'
                            }}
                        >所在城市</Text>

                        <TouchableOpacity
                            onPress={this._onAreaChangePress}>
                            <Text style={{
                                color: THEME_COLOR,
                                fontSize: DesignConvert.getF(16),
                                fontWeight: "normal",
                                alignSelf: "center",
                            }}>确定</Text>
                        </TouchableOpacity>

                    </View>

                    <View
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(200),
                            backgroundColor: "white",
                            flexDirection: "row",
                        }}
                    >
                        <Picker
                            style={{
                                flex: 1,
                                height: DesignConvert.getH(200),
                                backgroundColor: "white"
                            }}
                            selectedValue={0}
                            itemStyle={{
                                color: "black",
                                fontSize: DesignConvert.getF(26),
                            }}
                            onValueChange={(index) => this._onProvincePickerSelect(index)}>
                            {this._provinceList.map((i, value) => (
                                <PickerItem label={i} value={value} key={i} />
                            ))}
                        </Picker>

                        <Picker
                            style={{
                                flex: 1,
                                height: DesignConvert.getH(200),
                                backgroundColor: "white"
                            }}
                            selectedValue={0}
                            itemStyle={{
                                color: "black",
                                fontSize: DesignConvert.getF(26),
                            }}
                            onValueChange={(index) => this._onCityPickerSelect(index)}>
                            {this._cityList.map((i, value) => (
                                <PickerItem label={i} value={value} key={i} />
                            ))}
                        </Picker>
                    </View>
                </View>

            )
        }
    }

    _renderContent() {
        if (this._type == nickName || this._type == slogan || this._type == height) {
            return (
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <TextInput
                        style={{
                            width: DesignConvert.swidth,
                            height: DesignConvert.getH(this._type == slogan ? 120 : 50),
                            color: "#1A1A1A",
                            fontSize: DesignConvert.getF(15),
                            marginTop: DesignConvert.getW(20),
                            paddingLeft: DesignConvert.getW(15),
                            paddingRight: DesignConvert.getW(15),
                            backgroundColor: "white",
                        }}
                        textAlignVertical="top"
                        multiline={this._type == slogan}
                        value={this._text}
                        keyboardType={this._type == height ? "numeric" : "default"}
                        underlineColorAndroid="transparent"
                        placeholder={this._type == nickName ? "支持表情、符号，12字符以内" : `填写${this._title()}`}
                        placeholderTextColor="#CCCCCC"
                        returnKeyType="next"
                        onChangeText={this._onChangeText}
                        maxLength={this._type == height ? 6 : this._type == slogan ? 40 : 12}
                    ></TextInput>

                    <Text
                        style={{
                            color: "#CCCCCC",
                            fontSize: DesignConvert.getF(13),
                            marginTop: DesignConvert.getW(10),
                            paddingLeft: DesignConvert.getW(15),
                        }}
                    >{this._type == height ? "" : this._type == slogan ? `${this._text.length}/40` : "使用有趣的名字让别人都关注到你"}</Text>
                </View>
            )
        }

        if (this._type == birthday) {
            return (
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flex: 1,
                        }}
                        onPress={this._onDatePress}
                    >
                        <View
                            style={{
                                width: DesignConvert.swidth,
                                height: DesignConvert.getH(50),
                                marginTop: DesignConvert.getW(20),
                                paddingLeft: DesignConvert.getW(15),
                                paddingRight: DesignConvert.getW(15),
                                backgroundColor: "white",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    flex: 1,
                                    color: "#CCCCCC",
                                    fontSize: DesignConvert.getF(15),
                                }}
                            >年龄</Text>

                            <Text
                                style={{
                                    color: "#CCCCCC",
                                    fontSize: DesignConvert.getF(15),
                                }}
                            >{this._text}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }

        if (this._type == area) {
            return (
                <View>
                    {/* <TouchableOpacity
                        style={{
                            flex: 1,
                        }}
                        onPress={this._onAreaPress}
                    >
                        <View
                            style={{
                                width: DesignConvert.swidth,
                                height: DesignConvert.getH(50),
                                marginTop: DesignConvert.getW(20),
                                paddingLeft: DesignConvert.getW(15),
                                paddingRight: DesignConvert.getW(15),
                                backgroundColor: "white",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    flex: 1,
                                    color: "#CCCCCC",
                                    fontSize: DesignConvert.getF(15),
                                }}
                            >地区</Text>

                            <Text
                                style={{
                                    color: "#CCCCCC",
                                    fontSize: DesignConvert.getF(15),
                                }}
                            >{this._text}</Text>
                        </View>
                    </TouchableOpacity> */}

                    {this._renderAreaPicker()}
                </View>
            )
        }

        return (
            <View></View>
        )
    }

    render() {

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#F5F5F5",
                    justifyContent: 'flex-end',
                }}>

                <BackTitleView
                    titleText={this._title()}
                    onBack={this._onBackPress}
                    rightText="保存"
                    onRightPress={this._onSavePress}
                    containerStyle={{
                        display: this._type == area ? 'none' : 'flex'
                    }}
                />
                {this._renderContent()}
            </View>
        )
    }

}