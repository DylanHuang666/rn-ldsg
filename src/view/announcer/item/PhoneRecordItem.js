/**
 * 通话记录 Item
 */
'use strict';

import React, { PureComponent } from "react";
import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import UserInfoCache from "../../../cache/UserInfoCache";
import Config from "../../../configs/Config";
import { duration2Time } from "../../../utils/CDTick";
import DesignConvert from '../../../utils/DesignConvert';
import { item_bg } from "../../../hardcode/skin_imgs/announcer";
import { LINEARGRADIENT_COLOR } from "../../../styles";
import AnnouncerModel from "../../../model/main/AnnouncerModel";
import MedalWidget from "../../userinfo/MedalWidget";

export default class PhoneRecordItem extends PureComponent {

    /**主播视角
         * { id: '5eeddabb0b6f985120efb82b',
                  anchor: 
                   { userId: '36744591',
                     nickName: '%E6%B8%B8%E5%AE%A2%C2%B7%E9%9B%B6%E6%A0%80_%E5%BF%83%E6%81%8D',
                     logoTime: 77751589,
                     thirdIconurl: '562',
                     sex: 1,
                     age: 18,
                     vipLv: 0,
                     slogan: '%E8%B0%81%E8%AF%B4%E6%88%91%E6%87%92%E4%BA%86%E3%80%82%E6%88%91%E5%91%8A%E8%AF%89%E4%BD%A0%E4%BB%AC%EF%BC%8C%E6%88%91%E5%AF%B9%E4%BA%8E%E5%90%83%E6%98%AF%E5%BE%88%E5%8B%A4%E5%BF%AB%E7%9A%84%E3%80%82',
                     contributeLv: 12,
                     position: '湛江',
                     charmLv: 10 },
                  caller: 
                   { userId: '1023657',
                     nickName: '%E6%98%9F%E5%85%8933027',
                     logoTime: 0,
                     thirdIconurl: '2',
                     sex: 1,
                     age: 18,
                     vipLv: 0,
                     slogan: '%E5%B9%BF%E5%91%8A%E4%B9%8B%E5%90%8E%EF%BC%8C%E9%A9%AC%E4%B8%8A%E5%9B%9E%E6%9D%A5%EF%BC%81',
                     contributeLv: 5,
                     position: '南通',
                     charmLv: 2 },
                  chatTime: 16,
                  logTime: '2020-06-20 17:45:31' },
         */
    //跳转Im或打电话
    _chatOrCall = () => {
        const userBean = this.props.item.anchor.userId == UserInfoCache.userId ? this.props.item.caller : this.props.item.anchor;
        if (this.props.bAnnouncer) {
            require("../../../router/level2_router").showChatView(userBean.userId, decodeURI(userBean.nickName), false);
        } else {
            AnnouncerModel.callAnchor(userBean.userId, 0);
        }
    }

    render() {
        const item = this.props.item;
        const userBean = item.anchor.userId == UserInfoCache.userId ? item.caller : item.anchor;
        const headUrl = { uri: Config.getHeadUrl(userBean.userId, userBean.logoTime, userBean.thirdIconurl) };
        const nickName = decodeURI(userBean.nickName);
        const chatTime = duration2Time(item.chatTime);
        const time = item.logTime;

        const contributeLv = userBean.contributeLv;

        return (
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <ImageBackground
                    source={item_bg()}
                    style={{
                        width: DesignConvert.getW(365),
                        height: DesignConvert.getH(95),
                    }}>

                    <Image
                        source={headUrl}
                        style={{
                            width: DesignConvert.getW(53),
                            height: DesignConvert.getH(53),
                            borderRadius: DesignConvert.getW(53),
                            position: "absolute",
                            left: DesignConvert.getW(20),
                            top: DesignConvert.getH(21),
                        }}></Image>

                    <View
                        style={{
                            position: "absolute",
                            left: DesignConvert.getW(80),
                            top: DesignConvert.getH(26),
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                maxWidth: DesignConvert.getW(120),
                                color: "#333333",
                                fontSize: DesignConvert.getF(15),
                                fontWeight: "bold",
                                marginRight: DesignConvert.getW(5),
                            }}>
                            {nickName}
                        </Text>

                        {this.props.bAnnouncer ? (
                            <MedalWidget
                                richLv={contributeLv}
                            />
                        ) : null}

                    </View>

                    <Text
                        style={{
                            width: DesignConvert.getW(175),
                            color: "#666666",
                            fontSize: DesignConvert.getF(13),
                            position: "absolute",
                            left: DesignConvert.getW(80),
                            top: DesignConvert.getH(53),
                        }}>
                        {`总时长 ${chatTime}`}
                    </Text>

                    <TouchableOpacity
                        onPress={this._chatOrCall}
                        style={{
                            position: "absolute",
                            right: DesignConvert.getW(24),
                            top: DesignConvert.getH(23),
                        }}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={LINEARGRADIENT_COLOR}
                            style={{
                                width: DesignConvert.getW(80),
                                height: DesignConvert.getH(32),
                                borderRadius: DesignConvert.getW(23),
                                justifyContent: "center",
                                alignItems: "center",
                            }}>

                            <Text
                                style={{
                                    color: "white",
                                    fontSize: DesignConvert.getF(13),
                                }}>
                                {this.props.bAnnouncer ? "私聊" : "1v1热聊"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text
                        style={{
                            color: "#999999",
                            fontSize: DesignConvert.getF(11),
                            position: "absolute",
                            top: DesignConvert.getW(60),
                            right: DesignConvert.getH(42),
                        }}>
                        {time}
                    </Text>
                </ImageBackground>

            </View>
        )
    }
}