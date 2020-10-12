/**
 * 主界面 -> 1v1陪聊 -> AnnouncerItem
 */
'use strict';

import React, { PureComponent, Component } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, FlatList, } from 'react-native';
import DesignConvert from '../../../utils/DesignConvert';
import LinearGradient from 'react-native-linear-gradient';
import Config from '../../../configs/Config';
import { THEME_COLOR } from '../../../styles';
import { COIN_NAME } from '../../../hardcode/HGLobal';
import Video from 'react-native-video';
import AnnouncerModel from '../../../model/main/AnnouncerModel';
import SoundUtil from '../../../model/media/SoundUtil';
import SexAgeWidget from '../../userinfo/SexAgeWidget';

const [oncall, online, noDisturb] = [{ statusColor: "#31C1FF", statusDesc: "在聊" }, { statusColor: "#FD7687", statusDesc: "空闲" }, { statusColor: "#7858F8", statusDesc: "勿扰" }]
export default class AnnouncerItem extends PureComponent {
    constructor(props) {
        super(props);
        //音频是否播放
        this._bAudioPlaying = false;
    }

    componentWillUnmount() {
        SoundUtil._stop()
    }

    //播放录音
    _onAudioPress = () => {
        if (this._bAudioPlaying) {
            SoundUtil._stop();
            this._bAudioPlaying = false;
        } else {
            this._bAudioPlaying = true;
            SoundUtil._play(Config.getAnnouncerCertificatioAudioUrl(this.props.item.userBase.userId, this.props.item.voiceInfoTime), () => {
                this._bAudioPlaying = false;
                // alert('播放完成')
            })
        }


    }

    _onItemPress = (item) => {
        SoundUtil._stop()
        require('../../../router/level2_router').showUserInfoView(this.props.item.userBase.userId);
    };

    //打电话
    _onPhonePress = () => {
        // require('../../../model/room/RoomModel').default.leave();
        // AnnouncerModel.cancelCall(this.props.item.userBase.userId);
        SoundUtil._stop()
        AnnouncerModel.callAnchor(this.props.item.userBase.userId, this.props.item.price);
    }

    render() {
        let statusItem = oncall;
        if (this.props.item.oncall) {
            statusItem = oncall;
        } else if (this.props.item.noDisturbMode || !this.props.item.online) {
            statusItem = noDisturb;
        } else {
            statusItem = online;
        }

        //头像
        let headerUrl = Config.getHeadUrl(this.props.item.userBase.userId, this.props.item.userBase.logoTime, this.props.item.userBase.thirdIconurl)

        //技能类型pic   video
        let bVideo = this.props.item.videoInfoTime == "video";
        //技能地址
        let skillUrl = bVideo ?
            Config.getAnnouncerCertificatioVideoUrl(this.props.item.userBase.userId, this.props.item.picInfoTime) :
            Config.getAnnouncerCertificatioPicUrl(this.props.item.userBase.userId, this.props.item.picInfoTime);
        // console.log("技能地址", skillUrl)

        let myLabels = this.props.item.myLabels;

        return (
            <ImageBackground
                source={require("../../../hardcode/skin_imgs/main").announcer_item_bg()}
                style={{
                    width: DesignConvert.getW(178),
                    height: DesignConvert.getH(263),
                    justifyContent: "center",
                    alignItems: "center",
                }}>

                <View
                    style={{
                        width: DesignConvert.getW(168),
                        height: DesignConvert.getH(253),
                    }}>

                    <TouchableOpacity
                        onPress={this._onItemPress}
                        style={{
                            width: DesignConvert.getW(168),
                            height: DesignConvert.getH(180),
                        }}>

                        {!bVideo ? (
                            <Image
                                source={{ uri: skillUrl }}
                                style={{
                                    width: DesignConvert.getW(168),
                                    height: DesignConvert.getH(180),
                                    borderTopLeftRadius: DesignConvert.getW(10),
                                    borderTopRightRadius: DesignConvert.getW(10),
                                    position: "absolute",
                                }}></Image>

                        ) : (
                                <Video
                                    // paused={this.props.videoPause}
                                    // repeat
                                    source={{ uri: skillUrl }}
                                    style={{
                                        width: DesignConvert.getW(168),
                                        height: DesignConvert.getH(180),
                                        borderTopLeftRadius: DesignConvert.getW(10),
                                        borderTopRightRadius: DesignConvert.getW(10),
                                        position: "absolute",
                                    }}></Video>
                            )}


                        {/* 蒙层 */}
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            colors={["#00000000", "#0000004D"]}
                            style={{
                                width: DesignConvert.getW(168),
                                height: DesignConvert.getH(30),
                                position: "absolute",
                                bottom: 0,
                            }}></LinearGradient>

                        {/* 状态 */}
                        <View
                            style={{
                                width: DesignConvert.getW(44),
                                height: DesignConvert.getH(24),
                                borderTopRightRadius: DesignConvert.getW(10),
                                borderBottomLeftRadius: DesignConvert.getW(10),
                                backgroundColor: statusItem.statusColor,
                                position: "absolute",
                                right: 0,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: DesignConvert.getF(13),
                                }}>
                                {statusItem.statusDesc}
                            </Text>
                        </View>

                        {/* 标签 */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                position: "absolute",
                                left: DesignConvert.getW(5),
                                bottom: DesignConvert.getH(5),
                            }}>

                            {myLabels.map((element, i) => {
                                if (i > 1) {
                                    return
                                }
                                return (
                                    <View
                                        style={{
                                            paddingHorizontal: DesignConvert.getW(5),
                                            height: DesignConvert.getH(18),
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginRight: DesignConvert.getW(3),
                                            backgroundColor: "#FFFFFFE6",
                                            borderRadius: DesignConvert.getW(5),
                                        }}>
                                        <Text
                                            style={{
                                                color: "#666666",
                                                fontSize: DesignConvert.getF(11),
                                            }}>
                                            {element}
                                        </Text>
                                    </View>
                                )
                            })}
                        </View>

                        {/* 语音 */}
                        <TouchableOpacity
                            onPress={this._onAudioPress}
                            style={{
                                width: DesignConvert.getW(43),
                                height: DesignConvert.getH(18),
                                borderRadius: DesignConvert.getW(9),
                                backgroundColor: "#FD7687",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "absolute",
                                right: DesignConvert.getW(5),
                                bottom: DesignConvert.getH(5),
                            }}>

                            <Image
                                source={require("../../../hardcode/skin_imgs/main").ic_voice()}
                                style={{
                                    width: DesignConvert.getW(8),
                                    height: DesignConvert.getH(11),
                                    marginRight: DesignConvert.getW(3),
                                }}></Image>

                            <Text
                                style={{
                                    color: "white",
                                    fontSize: DesignConvert.getF(11),
                                }}>
                                {`${this.props.item.voiceTimeSpan}s`}
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>


                    <View
                        style={{
                            flex: 1,
                            width: DesignConvert.getW(168),
                            paddingHorizontal: DesignConvert.getW(5),
                            paddingVertical: DesignConvert.getH(8),
                        }}>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}>

                            <Text
                                numberOfLines={1}
                                style={{
                                    maxWidth: DesignConvert.getW(80),
                                    color: "#333333",
                                    fontWeight: "bold",
                                    fontSize: DesignConvert.getF(14),
                                }}>
                                {decodeURI(this.props.item.userBase.nickName)}
                            </Text>

                            <SexAgeWidget
                                sex={this.props.item.userBase.sex} />

                            <View
                                style={{
                                    flex: 1,
                                }}></View>

                            <Text
                                style={{
                                    color: "#666666",
                                    fontSize: DesignConvert.getF(11),
                                }}>
                                {`${this.props.item.userBase.age}岁·${this.props.item.userBase.position}`}
                            </Text>
                        </View>

                        <Text
                            numberOfLines={1}
                            style={{
                                marginVertical: DesignConvert.getH(2),
                                width: DesignConvert.getW(111),
                                color: "#666666",
                                fontSize: DesignConvert.getF(11),
                            }}>
                            {decodeURI(this.props.item.userBase.slogan)}
                        </Text>

                        <Text
                            style={{
                                color: "#F87787",
                                fontSize: DesignConvert.getF(12),
                                marginTop: DesignConvert.getH(2),
                            }}>
                            {`${this.props.item.price}${COIN_NAME}/分钟`}
                        </Text>

                        <TouchableOpacity
                            onPress={this._onPhonePress}
                            style={{
                                position: "absolute",
                                right: DesignConvert.getW(5),
                                bottom: DesignConvert.getH(9),
                            }}>

                            <Image
                                source={require("../../../hardcode/skin_imgs/main").ic_call()}
                                style={{
                                    width: DesignConvert.getW(44),
                                    height: DesignConvert.getH(22),
                                }}></Image>
                        </TouchableOpacity>
                    </View>


                </View>
            </ImageBackground>
        )
    }
}