/**
 * 声优认证
 */
'use strict';

import React, { PureComponent } from "react";
import { View, Image, Text, TouchableOpacity, ImageBackground, PanResponder } from 'react-native';
import DesignConvert from '../../utils/DesignConvert';
import BackTitleView from '../base/BackTitleView';
import BaseView from '../base/BaseView';
import {
    audio_recording,
    ic_skill,
    ic_upload_photo,
    ic_price,
    ic_voice,
    ic_vioce_normal,
    ic_vioce_recording,
    ic_vioce_cancel,
    ic_vioce_start,
    cert_succ,
    cert_ing,
    cert_fail,
    ic_chacha,
} from "../../hardcode/skin_imgs/announcer";
import ImagePicker from 'react-native-image-crop-picker';
import { COIN_NAME } from "../../hardcode/HGLobal";
import { arrow_right } from "../../hardcode/skin_imgs/common";
import { SubmitButton } from "../anchorincome/VerifyPayPasswordView";
import { AudioUtils } from "react-native-audio";
import AudioUtil from "../../model/media/AudioUtil";
import SoundUtil from "../../model/media/SoundUtil";
import Video from 'react-native-video';
import ToastUtil from "../base/ToastUtil";
import Config from "../../configs/Config";
import HResultStatus from "../../hardcode/HResultStatus";
import RNSvgaPlayer from 'react-native-svga-player'

class _Item extends PureComponent {

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.getW(345),
                    height: DesignConvert.getH(46),
                    paddingHorizontal: DesignConvert.getW(10),
                    flexDirection: "row",
                    alignItems: "center",
                }}>

                <Image
                    source={this.props.img}
                    style={{
                        width: DesignConvert.getW(20),
                        height: DesignConvert.getH(20),
                        marginRight: DesignConvert.getW(7),
                    }}></Image>

                <Text
                    style={{
                        flex: 1,
                        color: "#333333",
                        fontSize: DesignConvert.getF(13),
                    }}>{this.props.title}</Text>

                <Text
                    style={{
                        color: "#999999",
                        fontSize: DesignConvert.getF(11),
                    }}>{this.props.content}</Text>
            </View>
        )
    }
}


class _SkillItem extends PureComponent {
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: DesignConvert.getW(11),
                }}>

                <TouchableOpacity
                    activeOpacity={this.props.onPress ? 0.5 : 1}
                    onPress={this.props.onPress}>

                    {this.props.bVideo ? (
                        <View>
                            <Video
                                source={this.props.img}
                                style={[{
                                    width: DesignConvert.getW(70),
                                    height: DesignConvert.getH(70),
                                    marginBottom: DesignConvert.getW(5),
                                }, this.props.imgStyle]}></Video>

                            {/* <TouchableOpacity
                            activeOpacity={this.props.onPress ? 0.5 : 1}
                            onPress={this.props.onPress}
                            style={{
                                width: DesignConvert.getW(20),
                                height: DesignConvert.getH(20),
                                position: "absolute",
                                right: 0,
                                backgroundColor: "#FFFFFF33",
                                justifyContent: "center",
                                alignItems: "center",
                            }}>

                            <Image
                                source={ic_chacha()}
                                style={{
                                    width: DesignConvert.getW(10),
                                    height: DesignConvert.getH(10),
                                }}></Image>
                        </TouchableOpacity> */}
                        </View>
                    ) : (
                            <Image
                                source={this.props.img}
                                style={[{
                                    width: DesignConvert.getW(70),
                                    height: DesignConvert.getH(70),
                                    marginBottom: DesignConvert.getW(5),
                                }, this.props.imgStyle]}></Image>
                        )}

                </TouchableOpacity>



                {this.props.title ? (
                    <Text
                        style={{
                            color: "#333333",
                            fontSize: DesignConvert.getF(12),
                            marginBottom: DesignConvert.getW(5),
                        }}>{this.props.title}</Text>
                ) : null}

                {this.props.content ? (
                    <Text
                        style={{
                            color: "#999999",
                            fontSize: DesignConvert.getF(10),
                        }}>{this.props.content}</Text>
                ) : null}

            </View>
        )
    }
}

////状态(0:待审核 1:已通过 2:自动驳回 3:已拒绝 4:已取消资格 5:资料已失效)
//TODO: 后台还没出接口
const [SUCCEED, FAIL, ING, NOR] = [2, 1, 0, 666];
export default class AnnouncerCertificationView extends BaseView {
    constructor(props) {
        super(props);

        this._skillPath = ic_upload_photo();
        //技能类型
        this._bVideo = false;
        //cos上面的文件名称
        this._skillTimestamp;
        this._audioTimestamp;



        //是否上传技能
        this._bSkillUpload = false;

        this._price = undefined;


        this._certStatus = NOR;

        this._submitEnable = true;

        //录音
        this._hasPermission = false;
        this._audioPath = null; // 文件路径
        this._audioDuration = 0.0;
        this._recording = false; //是否录音
        this._panResponder = PanResponder.create({
            // 返回ture时，表示该组件愿意成为触摸事件的响应者，如触摸点击。默认返回false。
            onStartShouldSetPanResponder: () => true,
            // 返回ture时，表示该组件愿意成为触摸(滑屏)事件的响应者，如触摸滑屏，默认返回false。
            onMoveShouldSetPanResponder: () => false,
            // 与onStartShouldSetPanResponder相同，当此组件A里包含了子组件B也为触摸事件响应者时，若此时设为true，则父组件A优先级更高
            onStartShouldSetPanResponderCapture: () => true,
            // 与onMoveShouldSetPanResponder相同，当此组件A里包含了子组件B也为触摸事件响应者时，若此时设为true，则父组件A优先级更高
            onMoveShouldSetPanResponderCapture: () => true,
            // 手势刚开始触摸(即刚接触屏幕时)时，若响应成功则触发该事件
            onPanResponderGrant: async (evt, gestureState) => {
                if (!this._hasPermission) {
                    this._hasPermission = await require("../../model/PermissionModel").checkUploadAudioPermission();
                }
                if (!this._recording && this._hasPermission) {
                    this._recording = true;
                    AudioUtil._record(AudioUtils.DocumentDirectoryPath + '/announcer_certification.aac',
                        (data) => {
                            this._audioDuration = Math.floor(data.currentTime);
                        },
                        (data) => {
                            // alert('录制完成')
                            this._audioPath = AudioUtils.DocumentDirectoryPath + '/announcer_certification.aac';
                            this._recording = false;
                            this._checkSubmitEnable();
                            this.forceUpdate();
                        })
                    this.forceUpdate();
                }

            },
            // 手势刚开始触摸(即刚接触屏幕时)时，若响应失败则触发该事件，失败原因有可能是其它组件正在响应手势且不肯放权
            onResponderReject: (evt, gestureState) => { },
            // 手势滑动时触发该事件
            onPanResponderMove: (evt, gestureState) => { },
            // 手势松开时触发该事件
            onPanResponderRelease: (evt, gestureState) => {
                if (this._audioDuration < 1) {
                    ToastUtil.showCenter("录音过短,自动录音")
                    return
                }
                AudioUtil._stop();
                this.forceUpdate();
            },
            // 当其它组件需要响应手势时，此时为ture则表示本组件愿意放权给其它组件响应；为false时表示不放权，依然由本组件来响应手势事件
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            // 当组件响应放权后(即由其它组件拿到了手势响应权)触发该事件
            onPanResponderTerminate: (evt, gestureState) => { }
        });
    }

    async componentDidMount() {
        super.componentDidMount();
        await this._initData();
    }

    componentWillUnmount() {
        super.componentWillUnmount()
        SoundUtil._stop()
    }

    /**
     * //用户技能详情
message UserSkillInfo {
	optional string userId = 1;//用户Id
	optional string name = 2;//技能名称
	optional int32 type = 3;//技能类型
	optional int32 status = 4;//状态(0:待审核 1:已通过 2:自动驳回 3:已拒绝 4:已取消资格 5:资料已失效)
	optional string picInfoTime = 5;// 修改认证资料图时间戳
	optional string videoInfoTime = 6;// 修改认证资料图时间戳
	optional string voiceInfoTime = 7;// 修改语音介绍时间戳
	optional int32 level = 8;//等级
	optional string levelDesc = 9;//等级说明
	optional int32 price = 10;//价格
	optional string note = 11;//服务介绍
	optional double avgScore = 12;//评分
	optional int32 orderNum = 13;//接单数
	optional int32 updateTime = 14;//更新时间,以1971-01-01为起点的秒数
	optional bool noDisturbMode = 15;
	optional string labelIds = 16;
	optional bool online = 17;//是否在线
	optional bool oncall = 18;//是否在服务中
}
     */
    _initData = async () => {
        let data = await require("../../model/announcer/AnnouncerCertificationModel").default.querySkillApplyState();
        //此用户没有提交过陪聊技能审核申请或者第一次申请已被拒绝
        if (data === HResultStatus.UserSkillApplyRecordNotExitOrRefused) {
            this._certStatus = NOR;
            this._submitEnable = false;

        } else if (data === HResultStatus.UserSkillApplyingRecordExit) {
            this._certStatus = ING;
        } else if (data.status == 0) {
            this._certStatus = ING;
        } else {
            //显示资源
            if (data.videoInfoTime == "pic") {
                this._bVideo = false;
                this._skillPath = { uri: Config.getAnnouncerCertificatioPicUrl(data.userId, data.picInfoTime) }
            } else {
                this._bVideo = true;
                this._skillPath = { uri: Config.getAnnouncerCertificatioVideoUrl(data.userId, data.picInfoTime) }
            }

            this._skillTimestamp = data.picInfoTime;
            this._audioTimestamp = data.voiceInfoTime;
            this._audioPath = Config.getAnnouncerCertificatioAudioUrl(data.userId, data.voiceInfoTime)
            this._price = data.price;
            this._audioDuration = data.voiceTimeSpan;
            this._bSkillUpload = true;
            this._checkSubmitEnable();
        }
        // switch (data.status) {
        //     case 1:
        //         this._certStatus = SUCCEED;
        //         break;
        //     case 0:
        //         this._certStatus = ING;
        //         break;
        //     case 2:
        //     case 3:
        //     case 4:
        //     case 5:
        //         this._certStatus = FAIL;
        //         break;
        //     default:
        //         this._certStatus = NOR;
        //         this._submitEnable = false;
        // }
        this.forceUpdate();
    }


    /**
     * 上传技能
     */
    _openCameralRoll = async () => {
        let data = await require("../../model/PermissionModel").checkUploadPhotoPermission();
        if (data) {
            //TODO:这个ImagePicker找到的文件有问题，video没有，any不生效
            let image = await ImagePicker.openPicker({
                mediaType: "photo",
                // width: 400,
                // height: 400,
                // cropping: true,
            });
            // console.log("---------------------", image)
            let res;
            this._skillTimestamp = Date.now();
            if (image.mime == "video/mp4") {
                this._bVideo = true;
                res = await require("../../model/UploadModel").default.uploadAnnouncerCertificatioVideoFile(image.path, this._skillTimestamp);
            } else {
                this._bVideo = false;
                res = await require("../../model/UploadModel").default.uploadAnnouncerCertificatioPicFile(image.path, this._skillTimestamp);
            }
            this._skillPath = { uri: image.path };
            this._bSkillUpload = true;
            this._checkSubmitEnable();
            this.forceUpdate();
        }
    }

    /**
     * 选择价格
     */
    _showPricePicker = () => {
        //TODO:选择价格
        this._priceList = [10, 15, 20, 25, 30, 35, 40, 45, 50];

        require("../../router/level4_router").showNormalWheelPickerDialog(
            this._priceList,
            this._setPrice,
            this._price ? this._price : this._priceList[0],
            "选择价格",
            `（单位：${COIN_NAME}/分钟）`)
    }

    _setPrice = (price) => {
        this._price = price;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    /**
     * 录音播放
     */
    _onAudioStartPress = () => {
        SoundUtil._play(this._audioPath, () => {
            // alert('播放完成')
        })
        this.forceUpdate();
    }

    /**
     * 录音
     */
    _onAudioRecordPress = () => {
        alert("//TODO:录音")
        this._audioPath = ".ashdoado";
        this._audioDuration = 45;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _onAudioCancelPress = () => {
        require("../../router/level2_router").showNormInfoDialog("确认删除已录制的语音吗", "确认", this._clearAudio);
    }
    /**
     * 清空录音
     */
    _clearAudio = () => {
        this._audioPath = null;
        this._audioDuration = 0;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _checkSubmitEnable = () => {
        if (!this._bSkillUpload || this._price == undefined || this._audioPath == null) {
            this._submitEnable = false;
        } else {
            this._submitEnable = true;
        }
    }

    _onSubmitPress = async () => {
        switch (this._certStatus) {
            case SUCCEED:
                this._certStatus = NOR;
                this.forceUpdate();
                break
            case ING:
                this.popSelf();
                return
            case FAIL:
                this._certStatus = NOR;
                this.forceUpdate();
                return
            case NOR:
                if (this._audioPath == AudioUtils.DocumentDirectoryPath + '/announcer_certification.aac') {
                    this._audioTimestamp = Date.now();
                    await require("../../model/UploadModel").default.uploadAnnouncerCertificatioVoiceFile(this._audioPath, this._audioTimestamp);
                }

                let res = await require("../../model/announcer/AnnouncerCertificationModel").default.applyUserSkill(this._price, this._bVideo, this._skillTimestamp, this._audioTimestamp, this._audioDuration);
                this.popSelf();
                if (res) {
                    ToastUtil.showCenter("申请成功")
                }
                return
        }
    }


    _getCertStatusImg = () => {
        switch (this._certStatus) {
            case SUCCEED:
                return cert_succ();
            case ING:
                return cert_ing();
            case FAIL:
                return cert_fail();
        }
    }

    _getCertStatusText = () => {
        switch (this._certStatus) {
            case SUCCEED:
                return "恭喜你，您的审核已通过！";
            case ING:
                return "3个工作日内将会通过小秘书发送审核结果，请耐心等待";
            case FAIL:
                return "抱歉，您的审核未通过！";
        }
    }

    _getCertStatusImgText = () => {
        switch (this._certStatus) {
            case SUCCEED:
                return "审核通过";
            case ING:
                return "官方审核中";
            case FAIL:
                return "审核失败";
        }
    }


    _getSubmitText = () => {
        switch (this._certStatus) {
            case SUCCEED:
                return "确认";
            case ING:
                return "完成";
            case FAIL:
                return "重新提交";
            case NOR:
                return "提交审核";
        }
    }


    _renderLine = () => {
        return (
            <View
                style={{
                    width: DesignConvert.getW(345),
                    height: DesignConvert.getH(1),
                    backgroundColor: "#F0F0F0",
                }}></View>
        )
    }

    _renderContent = () => {
        //什么都不是，直接显示内容
        if (this._certStatus == NOR) {
            return (
                <View
                    style={{
                        width: DesignConvert.swidth,
                        alignItems: "center",
                    }}>
                    <View
                        style={{
                            width: DesignConvert.getW(345),
                            backgroundColor: "white",
                            borderRadius: DesignConvert.getW(4),
                            marginTop: DesignConvert.getH(10),
                        }}>

                        <_Item
                            img={ic_skill()}
                            title="设置技能封面图"
                            content="将展示在大厅的卡片上哦～" />

                        {this._renderLine()}

                        <View
                            style={{
                                alignItems: "center",
                                flexDirection: "row",
                                width: DesignConvert.getW(345),
                            }}>

                            <_SkillItem
                                img={ic_skill()}
                                title="头像示例"
                                content="必须真人正面清晰照" />

                            <_SkillItem
                                bVideo={this._bVideo}
                                onPress={this._openCameralRoll}
                                img={this._skillPath}
                                title="上传图片"
                                content="点击进行更换" />
                        </View>
                    </View>

                    <View
                        style={{
                            width: DesignConvert.getW(345),
                            backgroundColor: "white",
                            borderRadius: DesignConvert.getW(4),
                            marginTop: DesignConvert.getH(10),
                        }}>

                        <_Item
                            img={ic_price()}
                            title="设置价格" />

                        {this._renderLine()}

                        <TouchableOpacity
                            onPress={this._showPricePicker}
                            style={{
                                width: DesignConvert.getW(345),
                                height: DesignConvert.getH(45),
                                justifyContent: "center",
                                alignItems: "center",
                            }}>

                            <Text
                                style={{
                                    color: "#999999",
                                    fontSize: DesignConvert.getF(12),
                                }}>{this._price ? `${this._price}${COIN_NAME}/分钟` : "请选择价格"}</Text>

                            <Image
                                source={arrow_right()}
                                style={{
                                    width: DesignConvert.getW(7),
                                    height: DesignConvert.getH(11),
                                    position: "absolute",
                                    bottom: DesignConvert.getH(16),
                                    right: DesignConvert.getW(7),
                                }}></Image>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            width: DesignConvert.getW(345),
                            backgroundColor: "white",
                            borderRadius: DesignConvert.getW(4),
                            marginTop: DesignConvert.getH(10),
                            alignItems: "center",
                        }}>

                        <_Item
                            img={ic_voice()}
                            title="语音介绍"
                            content="" />

                        {this._renderLine()}

                        {!this._audioPath ? (
                            <View
                                {...this._panResponder.panHandlers}
                                style={{
                                    flexDirection: "row",
                                    height: DesignConvert.getH(154),
                                }}>
                                <_SkillItem
                                    onPress={this._onAudioRecordPress}
                                    img={this._recording ? ic_vioce_recording() : ic_vioce_normal()}
                                    imgStyle={{
                                        width: DesignConvert.getW(85),
                                        height: DesignConvert.getH(96),
                                        marginBottom: 0,
                                    }}
                                    title="语音打招呼" />

                            </View>

                        ) : (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        height: DesignConvert.getH(154),
                                    }}>
                                    <_SkillItem
                                        onPress={this._onAudioCancelPress}
                                        img={ic_vioce_cancel()}
                                        imgStyle={{
                                            width: DesignConvert.getW(85),
                                            height: DesignConvert.getH(96),
                                            marginBottom: 0,
                                        }}
                                        title="重录" />

                                    <_SkillItem
                                        onPress={this._onAudioStartPress}
                                        img={ic_vioce_start()}
                                        imgStyle={{
                                            width: DesignConvert.getW(85),
                                            height: DesignConvert.getH(96),
                                            marginBottom: 0,
                                        }}
                                        title={`试听${this._audioDuration}s`} />
                                </View>
                            )}

                    </View>

                </View>
            )
        }

        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    alignItems: "center",
                }}>

                <ImageBackground
                    source={this._getCertStatusImg()}
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(211),
                    }}>

                    <Text
                        style={{
                            color: "white",
                            fontSize: DesignConvert.getF(12),
                            marginTop: DesignConvert.getH(106),
                            alignSelf: "center",
                        }}>
                        {this._getCertStatusImgText()}
                    </Text>
                </ImageBackground>

                <Text
                    style={{
                        width: DesignConvert.getW(205),
                        textAlign: "center",
                        color: "#999999",
                        fontSize: DesignConvert.getF(14),
                        marginTop: DesignConvert.getH(26),
                    }}>
                    {this._getCertStatusText()}
                </Text>
            </View>
        )
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#F0F0F0",
                    alignItems: "center",
                }}>

                <View
                    style={{
                        backgroundColor: "white",
                    }}>
                    <BackTitleView
                        titleText={"认证声优"}
                        onBack={this.popSelf}
                    />
                </View>

                {this._renderContent()}

                <SubmitButton
                    enable={this._submitEnable}
                    btnText={this._getSubmitText()}
                    onPress={this._onSubmitPress}></SubmitButton>


                {this._recording ? (
                    <RNSvgaPlayer
                        source={audio_recording()}
                        style={{
                            width: DesignConvert.getW(80),
                            height: DesignConvert.getH(80),
                            top: DesignConvert.getH(350) + DesignConvert.statusBarHeight,
                            position: "absolute",
                        }}
                    />
                ) : null}

            </View>
        )
    }
}