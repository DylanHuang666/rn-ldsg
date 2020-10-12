
/**
 * 首页 -> 个人主页 ->播放音频
 */
'use strict';

import React, { PureComponent } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Config from '../../../configs/Config';
import { isAnnouncer } from '../../../model/main/AnnouncerModel';
import SoundUtil from '../../../model/media/SoundUtil';
import DesignConvert from '../../../utils/DesignConvert';
import { ic_sound, ic_stop } from '../../../hardcode/skin_imgs/chat';
import { ic_play } from '../../../hardcode/skin_imgs/chat';

export default class _VioceItem extends PureComponent {
    constructor(props) {
        super(props);


        this._userId = this.props.userId;
        this._bAudioPlaying = false;

        this._mySoundDuration = 10;
        this._AnnouncerData = null;
    }

    componentWillUnmount() {
        SoundUtil._stop()
    }

    //播放录音
    _openSoundOrClose = () => {
        if (this._bAudioPlaying) {
            SoundUtil._stop();
            this._bAudioPlaying = false;
        } else {
            this._bAudioPlaying = true;
            SoundUtil._play(Config.getAnnouncerCertificatioAudioUrl(this._userId, this._AnnouncerData.voiceInfoTime), () => {
                this._bAudioPlaying = false;
                // alert('播放完成')
                this.forceUpdate()
            })
        }
        this.forceUpdate()

    }

    async componentDidMount() {
        await this._initData();
    }

    _initData = async () => {
        //判断是否声优
        let res = await isAnnouncer(this._userId);
        if (res === undefined) {
            this.forceUpdate();
            return
        }
        this._isAnnouncer = res;
        if (this._isAnnouncer) {
            this._AnnouncerData = await require("../../../model/main/AnnouncerModel").default.getUserSkillInfo(this._userId)

            this._mySoundDuration = this._AnnouncerData.voiceTimeSpan;
        }
        this.forceUpdate();
    }

    render() {

        let soundImg = this._bAudioPlaying ? require("../../../hardcode/skin_imgs/user_info").open_sound()
            : require("../../../hardcode/skin_imgs/user_info").close_sound();

        if (this.props.type == 2) {
            soundImg = this._bAudioPlaying ? ic_stop()
                : ic_play();
        }

        const soundDuration = require("../../../hardcode/skin_imgs/user_info").sound_duration();

        if (!this._isAnnouncer) {
            return null
        }

        if (this.props.type == 2) {

            return (

                <TouchableOpacity
                    onPress={this._openSoundOrClose}
                    style={{
                        position: 'absolute',
                        left: DesignConvert.getW(12.5),
                        bottom: DesignConvert.getH(9),
                        width: DesignConvert.getW(90),
                        height: DesignConvert.getH(25),
                        backgroundColor: '#FDF5F9',
                        borderWidth: DesignConvert.getW(1),
                        borderColor: '#FF4D91',
                        borderRadius: DesignConvert.getW(20),
                        marginTop: DesignConvert.getH(5),
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}
                >

                    <Image
                        source={soundImg}
                        style={{
                            width: DesignConvert.getW(17),
                            height: DesignConvert.getH(17),
                            resizeMode: 'contain',
                            marginStart: DesignConvert.getW(6),
                        }}
                    />

                    <Text
                        style={{
                            flex: 1,
                            textAlign: 'right',
                            color: '#FF4D91',
                            fontSize: DesignConvert.getF(11),
                        }}
                    >
                        {this._mySoundDuration}s
                    </Text>

                    <Image
                        source={ic_sound()}
                        style={{
                            width: DesignConvert.getW(12),
                            height: DesignConvert.getH(15),
                            resizeMode: 'contain',
                            marginStart: DesignConvert.getW(5),
                            marginEnd: DesignConvert.getW(9),
                        }}
                    />

                </TouchableOpacity>

            )
        }

        return (
            <View
                style={{
                    position: 'absolute',
                    top: DesignConvert.getH(304),
                    left: DesignConvert.getW(25),
                }}>
                <TouchableOpacity
                    onPress={this._openSoundOrClose}
                    style={{
                        width: DesignConvert.getW(73),
                        height: DesignConvert.getH(30),
                        borderRadius: DesignConvert.getW(16),
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Image
                        source={soundImg}
                        style={{
                            width: DesignConvert.getW(30),
                            height: DesignConvert.getH(30),
                            borderRadius: DesignConvert.getW(16),
                        }}
                    />
                    <Text
                        style={{
                            color: '#FF4D91',
                            fontSize: DesignConvert.getF(11),
                            marginHorizontal: DesignConvert.getW(3)
                        }}
                    >{this._mySoundDuration}s</Text>
                    <Image
                        source={soundDuration}
                        style={{
                            width: DesignConvert.getW(12),
                            height: DesignConvert.getH(15),
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}