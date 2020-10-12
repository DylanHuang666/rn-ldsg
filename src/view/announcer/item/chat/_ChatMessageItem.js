/**
 *文本消息
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Image, Clipboard, Button } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import DesignConvert from "../../../../utils/DesignConvert";
import Config from "../../../../configs/Config";
import ToastUtil from "../../../base/ToastUtil";
import { TYPE_IM_TEXT, TYPE_IM_PHOTO } from "../../../../cache/RoomPublicScreenCache";
import { EUploadType } from "../../../../hardcode/EUpload";
import UserInfoCache from "../../../../cache/UserInfoCache";
import { ESex_Type_MALE } from "../../../../hardcode/HGLobal";

export default class _ChatMessageItem extends PureComponent {
    constructor(props) {
        super(props);

    }

    _onAvatarPress = () => {
        require("../../../../router/level2_router").showUserInfoView(this.props.data.sender.userId);
    }

    //复制文本
    _onCopyPress = () => {
        Clipboard.setString(this.props.data.content);
        ToastUtil.showCenter("复制成功");
    }

    _renderContent = () => {
        let isSelf = this.props.data.sender.userId == UserInfoCache.userId;

        switch (this.props.type) {
            case TYPE_IM_TEXT:
                return (
                    <TouchableOpacity
                        onLongPress={this._onCopyPress}
                        activeOpacity={1}
                        style={{
                            maxWidth: DesignConvert.getW(213),
                            backgroundColor: isSelf ? "#CA1FDF" : "#54015E",
                            borderTopLeftRadius: isSelf ? DesignConvert.getW(7) : DesignConvert.getW(2),
                            borderTopRightRadius: isSelf ? DesignConvert.getW(2) : DesignConvert.getW(7),
                            borderBottomLeftRadius: DesignConvert.getW(7),
                            borderBottomRightRadius: DesignConvert.getW(7),
                            marginLeft: isSelf ? 0 : DesignConvert.getW(8),
                            marginRight: isSelf ? DesignConvert.getW(8) : 0,
                            justifyContent: 'center',
                            alignItems: 'center'
                            // backgroundColor: 'red'
                        }}>

                        <Text
                            style={{
                                color: isSelf ? "#FFFFFF" : "#EE63FF",
                                fontSize: DesignConvert.getF(14),
                                margin: DesignConvert.getW(10),
                            }}>{this.props.data.content}</Text>

                    </TouchableOpacity>
                )

            case TYPE_IM_PHOTO:
                const photo = JSON.parse(this.props.data.content);
                const imgUrl = Config.getPublicImgUrl(this.props.data.sender.userId, photo.key);
                const imgWith = photo.width;
                const imgHeight = photo.height;

                return (
                    <Image
                        source={{ uri: imgUrl }}
                        style={{
                            width: DesignConvert.getW(200),
                            height: DesignConvert.getH(imgHeight / imgWith * 200),
                            borderRadius: DesignConvert.getW(0),
                            marginLeft: isSelf ? 0 : DesignConvert.getW(8),
                            marginRight: isSelf ? DesignConvert.getW(8) : 0,
                        }}></Image>
                )
        }
    }

    render() {

        // const data = {
        //     type: 1,    //MessageConstant.TEXT
        //     content,
        //     sender: {
        //         headUrl: Config.getHeadUrl(userInfo.userId, userInfo.logoTime, userInfo.thirdIconurl),
        //         charmLv: userInfo.charmLv,
        //         vipLv: userInfo.vipLv,
        //         sex: userInfo.sex,
        //         headFrameId: userInfo.headFrameId,
        //         contributeLv: userInfo.contributeLv,
        //         nickName: userInfo.nickName,
        //         userId: userInfo.userId,
        //         isNewUser: userInfo.isNew,

        //         hatId,
        //         guardianName,
        //         isGuardian,
        //         guardianLv,
        //     },
        // };

        const senderName = decodeURIComponent(this.props.data.sender.nickName);
        const contributeLv = this.props.data.sender.contributeLv;
        // const charmLv = this.props.data.sender.charmLv;
        const senderIsMale = this.props.data.sender.sex == ESex_Type_MALE;
        const isSelf = this.props.data.sender.userId == UserInfoCache.userId;

        return (
            <View>
                <View
                    style={{
                        marginBottom: DesignConvert.getH(15),
                        width: DesignConvert.swidth,
                        flexDirection: isSelf ? "row-reverse" : "row",
                        paddingLeft: DesignConvert.getW(20),
                        paddingRight: DesignConvert.getW(20),
                    }}>

                    <TouchableOpacity
                        onPress={this._onAvatarPress}>
                        <Image
                            source={{ uri: this.props.data.sender.headUrl }}
                            style={{
                                width: DesignConvert.getW(40),
                                height: DesignConvert.getH(40),
                                borderRadius: DesignConvert.getW(40),
                            }}></Image>
                    </TouchableOpacity>

                    {this._renderContent()}
                </View>
            </View>
        )
    }
}