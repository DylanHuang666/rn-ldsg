/**
 *礼物消息
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

export default class _ChatGiftItem extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        // console.log('礼物数据', this.props.data)
        // return null
        const recieverName = decodeURIComponent(this.props.data.receiverInfo.toNickName)
        const senderName = decodeURIComponent(this.props.data.data.fromUserBase.nickName)
        const isFromUser = UserInfoCache.userId === this.props.data.data.fromUserBase.userId
        const giftName = this.props.data.giftData.giftname

        const giftNum = this.props.data.data.giftNum

        const giftUrl = Config.getGiftUrl(this.props.data.giftData.giftid, this.props.data.giftData.alterdatetime)

        return (
            <View
                style={{
                    marginBottom: DesignConvert.getH(15),
                    marginLeft: DesignConvert.getW(42),
                    width: DesignConvert.getW(291),
                    height: DesignConvert.getH(32),
                    borderRadius: DesignConvert.getW(20),
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >

                <Text
                    numberOfLines={1}
                    style={{
                        maxWidth: DesignConvert.getW(90),
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(12),
                    }}
                >{isFromUser ? '我' : senderName}</Text>
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(12),
                    }}
                >给</Text>
                <Text
                    numberOfLines={1}
                    style={{
                        maxWidth: DesignConvert.getW(90),
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(12),
                    }}
                > {isFromUser ? recieverName : '我'}</Text>
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(12),
                    }}
                >{isFromUser ? '送出' : '送了'} {giftName}</Text>
                <Image
                    style={{
                        width: DesignConvert.getW(23),
                        height: DesignConvert.getH(23)
                    }}
                    source={{ uri: giftUrl }}
                />
                <Text
                    style={{
                        color: '#FFFFFF',
                        fontSize: DesignConvert.getF(12),
                    }}
                >x{giftNum}</Text>
            </View>
        )
    }
}

