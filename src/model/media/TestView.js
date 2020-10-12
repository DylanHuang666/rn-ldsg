
'use strict';

import React, { PureComponent, Component } from "react";
import { View, Text, Image, StyleSheet, ImageBackground, FlatList, TextInput, ScrollView, ActivityIndicator, Slider } from 'react-native';

import Sound from 'react-native-sound';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import AudioUtil from "./AudioUtil";
import BaseView from "../../view/base/BaseView";
import SoundUtil from "./SoundUtil";
import UploadModel from "../UploadModel";


export default class TestView extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            hasPermission: undefined, //授权状态
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac', // 文件路径
            recording: false, //是否录音
            pause: false, //录音是否暂停
            stop: false, //录音是否停止
            currentTime: 0, //录音时长
        };

    }

    // 开始录音
    _record = async () => {
        AudioUtil._record(this.state.audioPath,
            (data) => {
                this.setState({ currentTime: Math.floor(data.currentTime) });
            },
            (data) => {
                alert('录制完成')
            })
    }

    // 暂停录音
    _pause = async () => {
        AudioUtil._pause()
    }

    // 恢复录音
    _resume = async () => {
        AudioUtil._resume()
    }

    // 停止录音
    _stop = async () => {
        AudioUtil._stop()
    }

    // 播放录音
    _play = async () => {
        // const mp3Url = 'https://voicex-cos-1258539251.cos.ap-guangzhou.myqcloud.com/test/mp3/5e957fdfc84bb70877.mp3'
        // const mp3Url = 'http://music.163.com/song/media/outer/url?id=562598065.mp3'
        SoundUtil._play(this.state.audioPath, () => {
            alert('播放完成')
        })
    }

    _pausePlay = async () => {
        SoundUtil._pause()
    }

    _resumePlay = async () => {
        SoundUtil._resume(() => {
            alert('播放完成')
        })
    }

    _stopPlay = async () => {
        SoundUtil._stop()
    }

    _upload = async () => {
        UploadModel.uploadVoiceFile(this.state.audioPath)
    }

    render() {
        let { recording, pause, currentTime } = this.state
        return (
            <View style={styles.container}>
                <Text style={styles.text} onPress={this._record}> Record(开始录音) </Text>
                <Text style={styles.text} onPress={this._pause}> Pause(暂停录音) </Text>
                <Text style={styles.text} onPress={this._resume}> Resume(恢复录音) </Text>
                <Text style={styles.text} onPress={this._stop}> Stop(停止录音) </Text>

                <Text style={styles.text} onPress={this._play}> (播放音频) </Text>
                <Text style={styles.text} onPress={this._pausePlay}> (暂停播放音频) </Text>
                <Text style={styles.text} onPress={this._resumePlay}> (继续播放音频) </Text>
                <Text style={styles.text} onPress={this._stopPlay}> (停止播放音频) </Text>

                <Text style={styles.text}>
                    {
                        recording ? '正在录音' :
                            pause ? '已暂停' : '未开始'
                    }
                </Text>
                <Text style={styles.text}>时长: {currentTime}</Text>

                <Text style={styles.text} onPress={this._upload}> 上传录音 </Text>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginVertical: 10,
    }
})
