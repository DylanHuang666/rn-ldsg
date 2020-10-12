/**
 *各种消息
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Image, Clipboard, Button, ImageBackground } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../utils/DesignConvert";
import Config from "../../configs/Config";
import ToastUtil from "../base/ToastUtil";
import StatusBarView from "../base/StatusBarView";
import BaseView from "../base/BaseView";
import { ic_default_header } from "../../hardcode/skin_imgs/registered";
import UserInfoCache from "../../cache/UserInfoCache";
import { COIN_NAME } from "../../hardcode/HGLobal";
import { THEME_COLOR } from "../../styles";
import { DES } from "crypto-js";
import { duration2Time } from "../../utils/CDTick";
import { SYSTEM_UNION_SECRETARY_ID } from "../../model/chat/ChatModel";
import { bg_user_data_card, ic_play, ic_sound, ic_stop, bg_layer } from "../../hardcode/skin_imgs/chat";
import SoundUtil from "../../model/media/SoundUtil";
import _VioceItem from "../userinfo/item/_VioceItem";



class _StatusMessage extends PureComponent {

    render() {
        return (
            <View
                style={[{
                    width: DesignConvert.swidth,
                    alignItems: "center",
                    padding: DesignConvert.getW(7),
                }, this.props.style]}>
                <Text
                    style={{
                        color: "#96969C",
                        fontSize: DesignConvert.getF(10),
                        textAlign: "center",
                        borderRadius: DesignConvert.getW(4),
                        padding: DesignConvert.getW(5),
                    }}>{this.props.statusText}</Text>
            </View>
        )
    }
}

/**
 * 结束1v1陪聊消息
 */
export class _AnnouncerFinishMessage extends PureComponent {

    render() {
        return (
            <View>
                <_StatusMessage
                    statusText={this.props.message.showTime}
                    style={{
                        display: !this.props.message.showTime ? "none" : "flex",
                    }} />

                <View
                    style={{
                        alignSelf: "center",
                        width: DesignConvert.getW(208),
                        padding: DesignConvert.getW(10),
                        backgroundColor: "#DBDBDB",
                        borderRadius: DesignConvert.getW(6),
                        justifyContent: "center",
                        alignItems: "center",
                        marginVertical: DesignConvert.getH(7),
                    }}>
                    <Text
                        style={{
                            color: "#666666",
                            fontSize: DesignConvert.getF(12),
                        }}>
                        {this.props.message.data.message ? this.props.message.data.callerId == UserInfoCache.userId ? "抱歉，主播当前正忙，可以试试给 TA留言哦~" : "你拒绝了当前用户的通话请求" : `1v1热聊结束，通话时长${duration2Time(this.props.message.data.chatTime)}`}
                    </Text>
                </View>
            </View>
        )
    }
}

export class LuckryMoneyMessageItem extends PureComponent {
    render() {
        return (
            <View>
                <_StatusMessage
                    statusText={this.props.message.showTime}
                    style={{
                        display: !this.props.message.showTime ? "none" : "flex",
                    }} />

                <View
                    style={{
                        alignSelf: "center",
                        width: DesignConvert.getW(208),
                        padding: DesignConvert.getW(10),
                        backgroundColor: "#DBDBDB",
                        borderRadius: DesignConvert.getW(5),
                        justifyContent: "center",
                        alignItems: "center",
                        marginVertical: DesignConvert.getH(7),
                    }}>
                    <Text
                        style={{
                            color: "#666666",
                            fontSize: DesignConvert.getF(12),
                        }}>
                        {this.props.message.data.toUserId == UserInfoCache.userId ? this.props.message.data.toUserName : "我"}
                    </Text>
                </View>
            </View>
        )
    }
}

export default class BaseMessageItem extends PureComponent {
    constructor(props) {
        super(props);

    }

    _onAvatarPress = () => {
        try {
            // console.log("官方ID", "officialGroupId", UserInfoCache.officialGroupId)
            if (this.props.message.id != UserInfoCache.officialGroupId && !this.props.isShowOverlay) {
                require("../../router/level2_router").showUserInfoView(this.props.message.userInfo.userId);
            }
        } catch (err) {

        }
    }

    //override
    renderContent = () => {
        const msg = this.props.message.id == UserInfoCache.officialGroupId ? this.props.message.desc.data + "" : this.props.message.data + ""
        if (!this.props.renderContent) {
            // console.log("renderContent", this.props.message.desc.data);
            return (
                <Text
                    style={{
                        color: this.props.isSelf ? "white" : "#100D20",
                        fontSize: DesignConvert.getF(13),
                        marginHorizontal: DesignConvert.getW(10),
                    }}>{msg}</Text>
            )
        } else {
            return (
                this.props.renderContent(this.props.message)
            )
        }
    }

    _getAvatorUrl = () => {
        try {
            // console.log("官方ID", this.props.message, UserInfoCache.officialGroupId)
            if (this.props.message.id == UserInfoCache.officialGroupId) {
                return require("../../hardcode/skin_imgs/main").ic_offical_message();
            }
            if (this.props.message.sender == SYSTEM_UNION_SECRETARY_ID && !this.props.isSelf) {
                return require("../../hardcode/skin_imgs/main").ic_customer_service();
            }
            return { uri: Config.getHeadUrl(this.props.message.userInfo.userId, this.props.message.userInfo.logoTime, this.props.message.userInfo.thirdIconurl) };
        } catch (err) {
            return ic_default_header();
        }
    }

    _onCopyPress = () => {
        if (2 == this.props.message.type) {
            return;
        }
        Clipboard.setString(this.props.renderContent ? this.props.renderContent : this.props.message.data + "");
        ToastUtil.showCenter("复制成功");
    }

    render() {

        if (this.props.message.type === 'luckryMoney') {
            return (
                <View>
                    <_StatusMessage
                        statusText={this.props.message.showTime}
                        style={{
                            display: !this.props.message.showTime ? "none" : "flex",
                        }} />

                    <View
                        style={{
                            width: DesignConvert.swidth,
                            flexDirection: this.props.isSelf ? "row-reverse" : "row",
                            paddingLeft: DesignConvert.getW(20),
                            paddingRight: DesignConvert.getW(20),
                            paddingTop: DesignConvert.getH(7),
                            paddingBottom: DesignConvert.getH(7),
                        }}>

                        <TouchableOpacity
                            onPress={this._onAvatarPress}>
                            <Image
                                source={this._getAvatorUrl()}
                                style={{
                                    width: DesignConvert.getW(40),
                                    height: DesignConvert.getH(40),
                                    borderRadius: DesignConvert.getW(40),
                                    marginLeft: this.props.isSelf ? DesignConvert.getW(8) : 0,
                                }}></Image>
                        </TouchableOpacity>

                        <View
                            style={{
                                width: DesignConvert.getW(145),
                                height: DesignConvert.getH(61),
                                backgroundColor: '#FF964A',
                                flexDirection: this.props.isSelf ? "row-reverse" : "row",
                                // backgroundColor: this.props.isSelf ? THEME_COLOR : "#F3F3F3",
                                borderTopLeftRadius: this.props.isSelf ? DesignConvert.getW(11) : DesignConvert.getW(0),
                                borderTopRightRadius: this.props.isSelf ? DesignConvert.getW(0) : DesignConvert.getW(11),
                                borderBottomLeftRadius: this.props.isSelf ? DesignConvert.getW(11) : DesignConvert.getW(20),
                                borderBottomRightRadius: this.props.isSelf ? DesignConvert.getW(20) : DesignConvert.getW(11),
                                marginLeft: this.props.isSelf ? 0 : DesignConvert.getW(8),
                                marginRight: this.props.isSelf ? DesignConvert.getW(8) : 0,
                                // justifyContent:,
                                paddingHorizontal: DesignConvert.getW(11),
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require('../../hardcode/skin_imgs/room').ic_red_paperl()}
                                style={{
                                    width: DesignConvert.getW(25),
                                    height: DesignConvert.getH(31),
                                    resizeMode: 'contain'
                                }}
                            />
                            <View
                                style={{
                                    alignItems: this.props.isSelf ? 'flex-end' : 'flex-start',
                                    marginLeft: this.props.isSelf ? 0 : DesignConvert.getW(10),
                                    marginRight: this.props.isSelf ? DesignConvert.getW(10) : 0,
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: DesignConvert.getF(13)
                                    }}
                                >{this.props.message.data.amount}{COIN_NAME}</Text>
                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: DesignConvert.getF(9)
                                    }}
                                >{this.props.isSelf ? '向Ta' : '向您'}发送红包</Text>
                            </View>
                        </View>


                    </View>
                </View>
            )
        }

        if (this.props.message.type === 'userDataCard') {
            return (
                <_UserDataCardItem
                    data={this.props}
                />
            )
        }

        return (
            <View>
                <_StatusMessage
                    statusText={this.props.message.showTime}
                    style={{
                        display: !this.props.message.showTime ? "none" : "flex",
                    }} />

                <View
                    style={{
                        width: DesignConvert.swidth,
                        flexDirection: this.props.isSelf ? "row-reverse" : "row",
                        paddingLeft: DesignConvert.getW(20),
                        paddingRight: DesignConvert.getW(20),
                        paddingTop: DesignConvert.getH(7),
                        paddingBottom: DesignConvert.getH(7),
                    }}>

                    <TouchableOpacity
                        onPress={this._onAvatarPress}>
                        <Image
                            source={this._getAvatorUrl()}
                            style={{
                                width: DesignConvert.getW(40),
                                height: DesignConvert.getH(40),
                                borderRadius: DesignConvert.getW(40),
                                marginLeft: this.props.isSelf ? DesignConvert.getW(8) : 0,
                            }}></Image>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onLongPress={this._onCopyPress}
                        activeOpacity={1}
                        style={{
                            maxWidth: DesignConvert.getW(213),
                            backgroundColor: this.props.isSelf ? '#FE4F45' : "#ffffff",
                            borderTopLeftRadius: this.props.isSelf ? DesignConvert.getW(12) : DesignConvert.getW(12),
                            borderTopRightRadius: this.props.isSelf ? DesignConvert.getW(12) : DesignConvert.getW(12),
                            borderBottomLeftRadius: this.props.isSelf ? DesignConvert.getW(12) : DesignConvert.getW(12),
                            borderBottomRightRadius: this.props.isSelf ? DesignConvert.getW(12) : DesignConvert.getW(12),
                            marginLeft: this.props.isSelf ? 0 : DesignConvert.getW(8),
                            marginRight: this.props.isSelf ? DesignConvert.getW(8) : 0,
                            paddingVertical: !this.props.renderContent ? DesignConvert.getH(11) : 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: DesignConvert.getH(40)
                            // backgroundColor: 'red'
                        }}>
                        {
                            this.renderContent()
                        }

                    </TouchableOpacity>

                </View>
            </View>
        )
    }
}


class _UserDataCardItem extends PureComponent {

    constructor(props) {
        super(props)

        this._data

        require('../../model/main/AnnouncerModel').default.getUserSkillInfo(this.props.data.message.userInfo.userId)
            .then(data => {
                this._data = data
                this.forceUpdate()
            })
    }

    _getAvatorUrl = () => {
        try {
            return { uri: Config.getHeadUrl(this.props.data.message.userInfo.userId, this.props.data.message.userInfo.logoTime, this.props.data.message.userInfo.thirdIconurl) };
        } catch (err) {

            return ic_default_header();
        }
    }


    _onAvatarPress = () => {
        require("../../router/level2_router").showUserInfoView(this.props.data.message.userInfo.userId);
    }



    /**
     * 个人设置的标签
     */
    _renderMyLabels = () => {
        if (!this._data) {
            return null
        }
        return (
            <View
                style={{
                    position: 'absolute',
                    right: DesignConvert.getW(5),
                    bottom: DesignConvert.getH(5),
                    flexDirection: 'row',
                }}
            >

                {this._data.myLabels.map((element, i) => (
                    <View
                        style={{
                            paddingHorizontal: DesignConvert.getW(2.5),
                            height: DesignConvert.getH(17),
                            borderRadius: DesignConvert.getW(3),
                            backgroundColor: i == 0 ? '#FD798A' : i == 1 ? '#B54CF7' : '#F5B664',
                            marginStart: DesignConvert.getW(5),
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <Text
                            style={{
                                fontSize: DesignConvert.getF(9),
                                color: '#FFFFFF',
                            }}
                        >
                            {element}
                        </Text>
                    </View>
                ))}
            </View>
        )
    }

    render() {
        if (!this._data) {
            return null
        }
        return (
            <View>
                <_StatusMessage
                    statusText={this.props.data.message.showTime}
                    style={{
                        display: !this.props.data.message.showTime ? "none" : "flex",
                    }} />

                <View
                    style={{
                        width: DesignConvert.swidth,
                        flexDirection: this.props.data.isSelf ? "row-reverse" : "row",
                        paddingLeft: DesignConvert.getW(20),
                        paddingRight: DesignConvert.getW(20),
                        paddingTop: DesignConvert.getH(7),
                        paddingBottom: DesignConvert.getH(7),
                    }}>

                    <TouchableOpacity
                        onPress={this._onAvatarPress}>
                        <Image
                            source={this._getAvatorUrl()}
                            style={{
                                width: DesignConvert.getW(40),
                                height: DesignConvert.getH(40),
                                borderRadius: DesignConvert.getW(40),
                                marginLeft: this.props.isSelf ? DesignConvert.getW(8) : 0,
                            }}></Image>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={this._onAvatarPress}
                    >

                        <ImageBackground
                            source={bg_user_data_card()}
                            resizeMode={'stretch'}
                            style={{
                                width: DesignConvert.getW(229),
                                height: DesignConvert.getH(324),
                                // flexDirection: this.props.isSelf ? "row-reverse" : "row",
                                // backgroundColor: this.props.isSelf ? THEME_COLOR : "#F3F3F3",
                                borderRadius: this.props.data.isSelf ? DesignConvert.getW(14.5) : DesignConvert.getW(14.5),
                                marginLeft: this.props.data.isSelf ? 0 : DesignConvert.getW(8),
                                marginRight: this.props.data.isSelf ? DesignConvert.getW(8) : 0,
                                // justifyContent:,
                                paddingHorizontal: DesignConvert.getW(11),
                                alignItems: 'center',
                            }}
                        >

                            <View
                                style={{
                                    margin: DesignConvert.getW(2),
                                    width: DesignConvert.getW(225),
                                    height: DesignConvert.getH(240),
                                }}
                            >
                                <Image
                                    source={this._getAvatorUrl()}
                                    resizeMode={'stretch'}
                                    style={{
                                        width: DesignConvert.getW(225),
                                        height: DesignConvert.getH(240),
                                        borderTopLeftRadius: DesignConvert.getW(4),
                                        borderTopRightRadius: DesignConvert.getW(4),
                                    }}
                                />

                                <Image
                                    source={bg_layer()}
                                    style={{
                                        width: DesignConvert.getW(225),
                                        height: DesignConvert.getH(60),
                                        position: 'absolute',
                                        bottom: 0,
                                    }}
                                />

                                <Text
                                    style={{
                                        color: '#FFFFFF',
                                        fontSize: DesignConvert.getF(14),
                                        position: 'absolute',
                                        left: DesignConvert.getW(7),
                                        bottom: DesignConvert.getH(30),
                                    }}
                                >

                                    {this.props.data.message.userInfo.nickName}

                                </Text>

                                <Text
                                    style={{
                                        position: 'absolute',
                                        left: DesignConvert.getW(7),
                                        bottom: DesignConvert.getH(5),
                                        color: '#FFFFFF',
                                        fontSize: DesignConvert.getF(11),
                                    }}
                                >
                                    {`${this._data.userDetail && this._data.userDetail.height ? this._data.userDetail.height + 'cm' : '190cm'} | ${this._data.userInfo.position}`}

                                </Text>

                                {this._renderMyLabels()}
                            </View>


                            <Text
                                numberOfLines={2}
                                style={{
                                    color: '#333333',
                                    fontSize: DesignConvert.getF(12),
                                    width: DesignConvert.getW(205),
                                    marginTop: DesignConvert.getH(5),
                                }}
                            >
                                {this._data.userInfo.slogan}
                            </Text>

                            <_VioceItem
                                type={2}
                                userId={this.props.data.message.userInfo.userId}
                            />

                        </ImageBackground>

                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
