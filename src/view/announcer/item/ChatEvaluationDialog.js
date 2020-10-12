/**
 * 陪聊评价dialog
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../../base/BaseView";
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList } from "react-native";
import DesignConvert from "../../../utils/DesignConvert";
import Config from '../../../configs/Config';
import { THEME_COLOR } from '../../../styles/index';
import { ic_report } from "../../../hardcode/skin_imgs/chatroom";
import { ic_chacha, star_full, star_empty } from "../../../hardcode/skin_imgs/announcer";
import { SubmitButton } from "../../anchorincome/VerifyPayPasswordView";
import { duration2Time } from "../../../utils/CDTick";
import AnnouncerModel from "../../../model/main/AnnouncerModel";
import ToastUtil from "../../base/ToastUtil";
import { MAX_LABEL } from "../../../hardcode/HGLobal";

//评价item
class _evaluationTextItem extends PureComponent {

    //评价
    onPress = () => {
        this.props.callBack && this.props.item && this.props.callBack(this.props.item);
    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.getW(140),
                    height: DesignConvert.getH(45),
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <TouchableOpacity
                    onPress={this.onPress}
                    style={{
                        width: DesignConvert.getW(119),
                        height: DesignConvert.getH(31),
                        borderColor: this.props.bSelected ? THEME_COLOR : "#F0F0F0",
                        borderWidth: DesignConvert.getW(1),
                        justifyContent: "center",
                        alignItems: "center",
                    }}>

                    <Text
                        style={{
                            color: this.props.bSelected ? THEME_COLOR : "#999999",
                            fontSize: DesignConvert.getF(12),
                        }}>
                        {this.props.item.label}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

//评分item
class _evaluationItem extends PureComponent {


    onPress = () => {
        this.props.callBack && this.props.index && this.props.callBack(this.props.index);
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.onPress}
                style={{
                    padding: DesignConvert.getW(3),
                }}>

                <Image
                    source={this.props.currentScore < this.props.index ? star_empty() : star_full()}
                    style={{
                        width: DesignConvert.getW(22),
                        height: DesignConvert.getH(21),
                    }}></Image>
            </TouchableOpacity>
        )
    }
}


export default class ChatEvaluationDialog extends BaseView {
    constructor(props) {
        super(props);

        this._userId = this.props.params.userId;
        this._currentScore = 5;

        this._list = [];
        for (let index = 0; index < 5; index++) {
            this._list.push(index + 1);
        }

        this._evaluationTextList = [];

        //最多三个标签
        this._selectedItems = [];
    }

    //举报
    _reportPress = () => {
        require("../../../router/level3_router").showReportDialog(this._userId, 6);
    }

    //评价
    _onSubmitPress = async () => {
        let labelIds = '';
        this._selectedItems.forEach(element => {
            labelIds = labelIds + `${element.id}` + ","
        });
        let res = await AnnouncerModel.evalChat(this._userId, this._currentScore, labelIds);
        if (res) {
            this.popSelf();
            ToastUtil.showCenter("评价成功");
        }

    }

    _setScore = i => {
        this._currentScore = i;
        this.forceUpdate();
    }

    _selectEvaluationText = item => {
        let index = this._selectedItems.indexOf(item);
        if (index > -1) {
            item.bSelected = false;
            this._selectedItems.splice(index, 1);
        } else {
            if (this._selectedItems.length == MAX_LABEL) {
                ToastUtil.showCenter(`最多只能选 ${MAX_LABEL} 个标签哦`)
                return
            }
            item.bSelected = true;
            this._selectedItems.unshift(item);
        }

        this.forceUpdate();
    }

    async componentDidMount() {
        super.componentDidMount();
        await this._initData();
    }

    _initData = async () => {
        this._userInfo = await require('../../../model/userinfo/UserInfoModel').default.getPersonPage(this._userId);
        this._evaluationTextList = await AnnouncerModel.getChatterLabel();
        this._evaluationTextList.forEach(element => {
            element.bSelected = false;
        });
        if (this._evaluationTextList.length > 0) {
            this._selectEvaluationText(this._evaluationTextList[0]);
        }
        this.forceUpdate();
    }


    _renderTitleBar = () => {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(44),
                    flexDirection: "row",
                    alignItems: "center",
                }}>

                <TouchableOpacity
                    onPress={this._reportPress}
                    style={{
                        height: DesignConvert.getH(44),
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                    <Image
                        source={ic_report()}
                        style={{
                            width: DesignConvert.getW(20),
                            height: DesignConvert.getH(18),
                            marginLeft: DesignConvert.getW(15),
                            marginRight: DesignConvert.getW(6),
                            tintColor: "#333333",
                        }}></Image>
                </TouchableOpacity>

                <View
                    style={{
                        flex: 1,
                    }}></View>

                <TouchableOpacity
                    onPress={this.popSelf}
                    style={{
                        height: DesignConvert.getH(44),
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                    <Image
                        source={ic_chacha()}
                        style={{
                            width: DesignConvert.getW(14),
                            height: DesignConvert.getH(15),
                            marginRight: DesignConvert.getW(15),
                            tintColor: "#333333",
                        }}></Image>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        let chatTime = duration2Time(this.props.params.data.chatTime);
        let nickName = decodeURI(this._userInfo ? this._userInfo.nickName : "");
        let headUrl = !this._userInfo ? null : { uri: Config.getHeadUrl(this._userInfo.userId, this._userInfo.logoTime, this._userInfo.thirdIconurl) }

        return (
            <TouchableOpacity
                onPress={this.popSelf}
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.sheight,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={{
                        width: DesignConvert.swidth,
                        borderTopLeftRadius: DesignConvert.getW(15),
                        borderTopRightRadius: DesignConvert.getW(15),
                        backgroundColor: "white",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingBottom: DesignConvert.getH(15) + DesignConvert.addIpxBottomHeight(),
                    }}
                >

                    {this._renderTitleBar()}

                    <Text
                        style={{
                            fontSize: DesignConvert.getF(25),
                            color: "#333333",
                            fontWeight: "bold",
                        }}>通话结束</Text>

                    <Text
                        style={{
                            marginTop: DesignConvert.getH(5),
                            fontSize: DesignConvert.getF(19),
                            color: "#333333",
                            fontWeight: "bold",
                        }}>{chatTime}</Text>

                    <Image
                        source={headUrl}
                        style={{
                            marginTop: DesignConvert.getH(12),
                            width: DesignConvert.getW(105),
                            height: DesignConvert.getH(105),
                            borderRadius: DesignConvert.getW(105),
                        }}></Image>

                    <Text
                        style={{
                            marginTop: DesignConvert.getH(10),
                            fontSize: DesignConvert.getF(16),
                            color: "#333333",
                        }}>{nickName}</Text>

                    <Text
                        style={{
                            marginTop: DesignConvert.getH(18),
                            fontSize: DesignConvert.getF(13),
                            color: "#999999",
                        }}>{"给它一个评价"}</Text>

                    <View
                        style={{
                            marginTop: DesignConvert.getH(11),
                            flexDirection: "row",
                            alignItems: "center",
                        }}>

                        {this._list.map(element => (
                            <_evaluationItem
                                index={element}
                                currentScore={this._currentScore}
                                callBack={this._setScore}
                            />
                        ))}

                    </View>

                    <View
                        style={{
                            marginTop: DesignConvert.getH(11),
                            flexDirection: "row",
                            flexWrap: "wrap",
                            width: DesignConvert.getW(280),
                            alignItems: "center",
                        }}>

                        {this._evaluationTextList.map((element, i) => (
                            <_evaluationTextItem
                                key={i}
                                item={element}
                                bSelected={element.bSelected}
                                callBack={this._selectEvaluationText}
                            />
                        ))}

                    </View>

                    <SubmitButton
                        enable={true}
                        btnText="提交"
                        onPress={this._onSubmitPress}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
}
