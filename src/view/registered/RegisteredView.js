/**
 * 登录 -> 注册资料
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import BackTitleView from "../base/BackTitleView";
import LinearGradient from 'react-native-linear-gradient';
import { View, Image, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList, StyleSheet, TextInput } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import { SubmitButton } from '../anchorincome/VerifyPayPasswordView';
import moment from "moment";
import ToastUtil from "../base/ToastUtil";
import ImagePicker from 'react-native-image-crop-picker';


class SexSelectedView extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            sex: require("../../hardcode/HGLobal").ESex_Type_MALE,
        }
    }

    _onMalePress = () => {
        this.setState({
            sex: require("../../hardcode/HGLobal").ESex_Type_MALE,
        })
        this.props.checkSex(require("../../hardcode/HGLobal").ESex_Type_MALE);
    }

    _onFemalePress = () => {
        this.setState({
            sex: require("../../hardcode/HGLobal").ESex_Type_FEMALE,
        })
        this.props.checkSex(require("../../hardcode/HGLobal").ESex_Type_FEMALE);
    }

    render() {
        return (
            <View
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(80),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}>

                <TouchableOpacity
                    onPress={this._onMalePress}
                    style={{
                        width: DesignConvert.getW(110),
                        height: DesignConvert.getH(40),
                        backgroundColor: this.state.sex == require("../../hardcode/HGLobal").ESex_Type_MALE ? "#FA495F" : "white",
                        borderRadius: DesignConvert.getW(20),
                        borderWidth: DesignConvert.getW(1),
                        borderColor: this.state.sex == require("../../hardcode/HGLobal").ESex_Type_MALE ? "#FA495F" : "#000000",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>

                    <Image
                        source={require("../../hardcode/skin_imgs/registered").ic_default_male()}
                        style={{
                            width: DesignConvert.getW(15),
                            height: DesignConvert.getH(15),
                            marginRight: DesignConvert.getW(7),
                        }}></Image>

                    <Text
                        style={{
                            color: "#000000",
                            fontSize: DesignConvert.getF(14),
                        }}>男生</Text>
                </TouchableOpacity>

                <Text
                    style={{
                        color: "#000000",
                        fontSize: DesignConvert.getF(20),
                        marginRight: DesignConvert.getW(20),
                        marginLeft: DesignConvert.getW(20),
                    }}>or</Text>

                <TouchableOpacity
                    onPress={this._onFemalePress}
                    style={{
                        width: DesignConvert.getW(110),
                        height: DesignConvert.getH(40),
                        backgroundColor: this.state.sex == require("../../hardcode/HGLobal").ESex_Type_FEMALE ? "#FA495F" : "white",
                        borderRadius: DesignConvert.getW(20),
                        borderWidth: DesignConvert.getW(1),
                        borderColor: this.state.sex == require("../../hardcode/HGLobal").ESex_Type_FEMALE ? "#FA495F" : "#000000",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>

                    <Image
                        source={require("../../hardcode/skin_imgs/registered").ic_default_female()}
                        style={{
                            width: DesignConvert.getW(15),
                            height: DesignConvert.getH(15),
                            marginRight: DesignConvert.getW(7),
                        }}></Image>

                    <Text
                        style={{
                            color: "#000000",
                            fontSize: DesignConvert.getF(14),
                        }}>女生</Text>
                </TouchableOpacity>
            </View>
        )
    }
}


export default class RegisteredView extends BaseView {
    constructor(props) {
        super(props);

        this._headUrl = "-1";
        this._nickName = "";
        this._birthday = moment().format("YYYY-MM-DD");
        this._sex = require("../../hardcode/HGLobal").ESex_Type_MALE;
        this._submitEnable = false;

        this._HeaderPath = "";
        this._photoId = "";
    }

    _openCameralRoll = async () => {
        //TODO:
        let data = await require("../../model/PermissionModel").checkUploadPhotoPermission();
        if (data) {
            let image = await ImagePicker.openPicker({
                mediaType: "photo",
                width: 400,
                height: 400,
                cropping: true,
            });
            this._photoId = new Date().getTime() + "";
            let res = await require("../../model/UploadModel").default.uploadImage(image.path);
            this._HeaderPath = image.path;
            this.forceUpdate();
        }
    }

    _checkSubmitEnable = () => {
        if (this._nickName == "") {
            this._submitEnable = false;
        } else {
            this._submitEnable = true;
        }
    }

    componentDidMount() {
        super.componentDidMount();
        require("../../model/registered/RegisteredModel").default.getRandomName()
            .then(data => {
                this._nickName = data;
                this._checkSubmitEnable();
                this.forceUpdate();
            });
    }

    _randomHeader = () => {
        require("../../model/registered/RegisteredModel").default.getRandomAvatar()
            .then(data => {
                this._headUrl = data + "";
                this._HeaderPath = "";
                this.forceUpdate();
            });
    }

    _randomNickName = () => {
        require("../../model/registered/RegisteredModel").default.getRandomName()
            .then(data => {
                this._nickName = data;
                this._checkSubmitEnable();
                this.forceUpdate();
            });
    }

    _onBirthdayPress = () => {
        require("../../router/level3_router").showUserInfoEditDetailView(require("../user_info_edit/UserInfoEditDetailView").birthday, this._birthday, this._setBirthday);
    }

    _setBirthday = (s) => {
        this._birthday = s;
        this.forceUpdate();
    }

    _onChangeNickName = (s) => {
        this._nickName = s;
        this._checkSubmitEnable();
        this.forceUpdate();
    }

    _checkSex = (sex) => {
        this._sex = sex;
    }

    _onSubmitPress = () => {
        if (this._headUrl == "-1" && this._HeaderPath == "") {
            ToastUtil.showCenter("请完善头像");
            return
        }
        require("../../model/registered/RegisteredModel").default.modifyUserInfo(this._nickName, this._sex, this._birthday, this._headUrl, this._HeaderPath != "", this._photoId)
            .then(data => {
                if (data) {
                    //重置当前跟页面到主界面
                    require("../../router/level1_router").showMainRootView();
                }
            })
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: "white",
                }}>
                <BackTitleView
                    titleText="注册资料"
                    onBack={this.popSelf} />

                <TouchableOpacity
                    onPress={this._openCameralRoll}
                    style={{
                        marginTop: DesignConvert.getH(35),
                    }}>
                    <Image
                        source={{
                            uri: this._HeaderPath ? this._HeaderPath :
                                this._headUrl == -1 ? require("../../hardcode/skin_imgs/registered").ic_default_header() :
                                    Config.getRandomAvatar(this._headUrl)
                        }}
                        style={{
                            width: DesignConvert.getW(90),
                            height: DesignConvert.getH(90),
                            borderRadius: DesignConvert.getW(90),
                        }}></Image>

                    <Image
                        source={require("../../hardcode/skin_imgs/registered").ic_change_header()}
                        style={{
                            width: DesignConvert.getW(22),
                            height: DesignConvert.getH(22),
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                        }}></Image>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={this._randomHeader}
                    style={{
                        width: DesignConvert.getW(62),
                        height: DesignConvert.getH(20),
                        marginTop: DesignConvert.getH(14),
                        borderRadius: DesignConvert.getW(10),
                        borderColor: "#FA495FFF",
                        borderWidth: DesignConvert.getW(1),
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: DesignConvert.getH(8),
                    }}>
                    <Text
                        style={{
                            color: "#1A1A1AFF",
                            fontSize: DesignConvert.getF(10),
                        }}>随机头像</Text>
                </TouchableOpacity>

                <View style={styles.input}>
                    <Text
                        style={{
                            color: "#1A1A1AFF",
                            fontSize: DesignConvert.getF(14),
                            marginRight: DesignConvert.getW(12),
                        }}>昵称</Text>

                    <TextInput
                        value={this._nickName}
                        underlineColorAndroid="transparent"
                        placeholder="填写你的昵称"
                        placeholderTextColor="#999999"
                        returnKeyType="done"
                        keyboardType="default"
                        autoFocus={false}
                        onChangeText={this._onChangeNickName}
                        maxLength={15}
                        style={{
                            marginRight: DesignConvert.getW(12),
                            flex: 1,
                        }}></TextInput>

                    <TouchableOpacity
                        onPress={this._randomNickName}
                        style={{
                            width: DesignConvert.getW(40),
                            height: DesignConvert.getH(20),
                            borderRadius: DesignConvert.getW(10),
                            borderColor: "#FA495FFF",
                            borderWidth: DesignConvert.getW(1),
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <Text
                            style={{
                                color: "#1A1A1AFF",
                                fontSize: DesignConvert.getF(10),
                            }}>随机</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={this._onBirthdayPress}
                    style={styles.input}>
                    <Text
                        style={{
                            color: "#1A1A1AFF",
                            fontSize: DesignConvert.getF(14),
                            marginRight: DesignConvert.getW(12),
                        }}>生日</Text>

                    <Text
                        style={{
                            color: "#1A1A1AFF",
                            fontSize: DesignConvert.getF(14),
                            marginRight: DesignConvert.getW(12),
                            flex: 1,
                        }}>{this._birthday}</Text>

                    <Image
                        source={require("../../hardcode/skin_imgs/main").icon_next()}
                        style={{
                            width: DesignConvert.getW(9),
                            height: DesignConvert.getH(16),
                            tintColor: "#808080FF",
                        }}></Image>
                </TouchableOpacity>

                <SexSelectedView
                    checkSex={this._checkSex} />

                <SubmitButton
                    enable={this._submitEnable}
                    btnText="完成"
                    onPress={this._onSubmitPress}></SubmitButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        width: DesignConvert.getW(320),
        height: DesignConvert.getH(51),
        backgroundColor: "#F2F2F2FF",
        borderRadius: DesignConvert.getW(10),
        paddingLeft: DesignConvert.getW(18),
        paddingRight: DesignConvert.getW(18),
        marginTop: DesignConvert.getH(15),
        flexDirection: "row",
        alignItems: "center",
    }
})