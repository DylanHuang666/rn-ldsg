
/**
 * 我的 -> 编辑资料
 */

'use strict';

import React, { PureComponent, Component } from "react";
import BaseView from "../base/BaseView";
import BackTitleView from "../base/BackTitleView";
import LinearGradient from 'react-native-linear-gradient';
import { FlatList, ScrollView, View, Image, Text, TouchableOpacity, Modal, ImageBackground, TextInput, CameraRoll, } from "react-native";
import DesignConvert from "../../utils/DesignConvert";
import Config from '../../configs/Config';
import StatusBarView from '../base/StatusBarView';
import ModelEvent from "../../utils/ModelEvent";
import { EVT_LOGIC_UPDATE_USER_INFO, } from "../../hardcode/HLogicEvent";
import ImagePicker from 'react-native-image-crop-picker';
import CryptoJS from 'crypto-js';
import UserInfoCache from "../../cache/UserInfoCache";
import { THEME_COLOR } from "../../styles";
import AnnouncerModel, { isAnnouncer } from "../../model/main/AnnouncerModel";
import { MAX_LABEL } from "../../hardcode/HGLobal";
import ToastUtil from "../base/ToastUtil";
import _AblumSelectedList from "./item/_AblumSelectedList";


const [nickName, area, birthday, slogan] = [520, 555, 886, 777];

//评价item
class _evaluationTextItem extends PureComponent {

    //评价
    onPress = () => {
        this.props.callBack && this.props.item && this.props.callBack(this.props.item);
    }

    render() {
        return (
            <TouchableOpacity
                onPress={this.onPress}
                style={{
                    paddingHorizontal: DesignConvert.getW(5),
                    height: DesignConvert.getH(20),
                    borderColor: this.props.bSelected ? THEME_COLOR : "#F0F0F0",
                    borderRadius: DesignConvert.getW(4),
                    borderWidth: DesignConvert.getW(1),
                    marginHorizontal: DesignConvert.getW(5),
                    marginVertical: DesignConvert.getH(5),
                    justifyContent: "center",
                    alignItems: "center",
                }}>

                <Text
                    style={{
                        color: this.props.bSelected ? THEME_COLOR : "#F0F0F0",
                        fontSize: DesignConvert.getF(10),
                    }}>
                    {this.props.item.label}
                </Text>
            </TouchableOpacity>
        )
    }
}

class _Item extends PureComponent {

    render() {
        return (
            <TouchableOpacity
                onPress={this.props.type == nickName ? null : this.props.onPress}
                style={[{
                    width: DesignConvert.swidth,
                    minHeight: DesignConvert.getH(50),
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: DesignConvert.getW(15),
                    paddingRight: DesignConvert.getW(24),
                }, this.props.style]}>

                <Text
                    style={{
                        color: "rgba(192, 192, 192, 1)",
                        fontSize: DesignConvert.getF(16),
                        marginRight: DesignConvert.getW(15)
                    }}>{this.props.title}</Text>
                {
                    this.props.type == nickName ? <TextInput
                        style={{
                            flex: 1,
                            color: this.props.textColor || "rgba(255, 255, 255, 1)",
                            fontSize: DesignConvert.getF(13),
                            padding: 0,
                            textAlign: 'right',
                            marginRight: DesignConvert.getW(15)
                        }}
                        maxLength={12}
                        value={this.props.content}
                        onChangeText={this.props.onPress}
                    />
                        :
                        <Text
                            style={{
                                flex: 1,
                                color: this.props.textColor || "rgba(255, 255, 255, 1)",
                                fontSize: DesignConvert.getF(13),
                                textAlign: 'right',
                                marginRight: DesignConvert.getW(15)
                            }}>{this.props.content}</Text>
                }


                <Image
                    source={require("../../hardcode/skin_imgs/main").icon_next()}
                    style={{
                        width: DesignConvert.getW(8),
                        height: DesignConvert.getH(14),
                        display: !this.props.showArrowRight ? "flex" : "none",
                        tintColor: "#999999",
                    }}></Image>
            </TouchableOpacity>
        )
    }
}

export default class UserInfoEditView extends BaseView {
    constructor(props) {
        super(props);

        this._HeaderPath = "";
        this._photoId = "";
        this._slogan = "";
        this._height = "190";

        this._myAblumList = [];


        // 自我评价标签
        this._evaluationTextList = [];
        this._selectedItems = [];

        this._AnnouncerData = null;
        this._isAnnouncer = false;
    }

    _onBackPress = () => {
        this.popSelf();
    }

    async componentDidMount() {
        super.componentDidMount();

        await this._initData();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    _onSavePress = async () => {
        let AblumIds = "";
        this._myAblumList.forEach(element => {
            if (element.ablumId) {
                AblumIds = AblumIds + `${element.ablumId},`
            }
        });
        const photoId = AblumIds

        if (this._isAnnouncer) {
            let labelIds = '';
            this._selectedItems.forEach(element => {
                labelIds = labelIds + `${element.id}` + ","
            });
            let res = await require("../../model/user_info_edit/UserInfoEditModel").default.modifyUserSkillLabels(labelIds);
            if (!res) {
                ToastUtil.showCenter("标签修改失败");
            }
        }


        let data = await require("../../model/user_info_edit/UserInfoEditModel").default.modifyUserInfo(this._nickName, this._sex, this._birthday, this._HeaderPath != "", photoId, this._position, this._slogan, this._height)
        if (data) {
            ModelEvent.dispatchEntity(null, EVT_LOGIC_UPDATE_USER_INFO, null);
            ToastUtil.showCenter("修改成功");
            this.popSelf();
        }
        // require("../../model/user_info_edit/UserInfoEditModel").default.addAlbums(this._upAblumId);

    }

    _onNickNamePress = () => {
        require("../../router/level3_router").showUserInfoEditDetailView(require("../user_info_edit/UserInfoEditDetailView").nickName, this._nickName, this._setNickName);
    }


    _setNickName = (s) => {
        this._nickName = s;
        this.forceUpdate();
    }

    _showeEditSexDialog = () => {
        require("../../router/level4_router").showeEditSexDialog(this._onSexPress);
    }

    _onSexPress = (i) => {
        // if (this._sex == 1) {
        //     this._sex = 2;
        // } else {
        //     this._sex = 1;
        // }
        this._sex = i
        this.forceUpdate();
    }

    _onAreaPress = () => {
        require("../../router/level3_router").showUserInfoEditDetailView(require("../user_info_edit/UserInfoEditDetailView").area, this._position, this._setArea);
    }

    _setArea = (s) => {
        this._position = s;
        this.forceUpdate();
    }

    _onBirthdayPress = () => {
        require("../../router/level4_router").showDatePickerDialog(this._setBirthday, "YYYY-MM-DD", new Date(), "出生年月");
    }

    _setBirthday = (s) => {
        this._birthday = s;
        this.forceUpdate();
    }

    _onHeightPress = () => {
        require("../../router/level3_router").showUserInfoEditDetailView(require("../user_info_edit/UserInfoEditDetailView").height, this._height, this._setHeight);
    }

    _setHeight = (s) => {
        this._height = s;
        this.forceUpdate();
    }


    _onSloganPress = () => {
        require("../../router/level3_router").showUserInfoEditDetailView(require("../user_info_edit/UserInfoEditDetailView").slogan, this._slogan, this._setSlogan);
    }

    _setSlogan = (s) => {
        this._slogan = s;
        this.forceUpdate();
    }

    _openCameralRoll = async (bool) => {
        let data = await require("../../model/PermissionModel").checkUploadPhotoPermission();
        if (data) {
            let image = await ImagePicker.openPicker({
                mediaType: "photo",
                width: 400,
                height: 400,
                cropping: true,
            });
            // console.log("找图片", image);
            //TODO:这个是通过图片本地路径拿到MD5，需要引进库
            if (bool) {
                this._photoId = new Date().getTime() + "";
                let res = await require("../../model/UploadModel").default.uploadImage(image.path);
                this._HeaderPath = image.path;
                this.forceUpdate();
            } else {
                const ablumId = new Date().getTime() + "";
                let res = await require("../../model/UploadModel").default.uploadAblum(image.path, ablumId)
                this._myAblumList.push({ ablumId: ablumId, uri: image.path });

                this.forceUpdate();
            }

        }
    }

    /**
     * 删除一张图片
     * @param {*} item 
     */
    _delAblm = (item) => {
        this._myAblumList.splice(this._myAblumList.indexOf(item), 1);
        this.forceUpdate();
    }

    /**
     * 点击标签
     * @param {*} item 
     */
    _selectEvaluationText = item => {
        let index = this._selectedItems.indexOf(item);
        if (index > -1) {
            item.bSelected = false;
            this._selectedItems.splice(index, 1);
        } else {
            if (this._selectedItems.length == 3) {
                ToastUtil.showCenter(`sorry～最多只能选择三个标签哦`)
                return
            }
            item.bSelected = true;
            this._selectedItems.unshift(item);
        }

        this.forceUpdate();
    }

    _initData = async () => {
        let data = await require("../../model/user_info_edit/UserInfoEditModel").default.getPersonPage()
        // console.log("编辑资料", data);
        this._userId = data.userId;
        this._nickName = decodeURI(data.nickName);
        this._avatar = Config.getHeadUrl(data.userId, data.logoTime, data.thirdIconurl);
        this._sex = data.sex;
        this._position = data.position;
        this._birthday = data.birthday;
        this._height = data.height;
        this._slogan = data.slogan;


        if (data.banners) {
            this._myAblumList = [];
            let bannerList = data.banners.split(",");
            bannerList.forEach(element => {
                if (element.length > 0) {
                    this._myAblumList.push({ ablumId: element, uri: Config.getUserBannerUrl(UserInfoCache.userId, element) });
                }
            });
        }


        //判断是否声优
        let res = await isAnnouncer(this._userId);
        if (res === undefined) {
            this.forceUpdate();
            return
        }
        this._isAnnouncer = res;
        if (this._isAnnouncer) {
            this._AnnouncerData = await AnnouncerModel.getUserSkillInfo(this._userId)
            let labelIds = this._AnnouncerData.labelIds.split(",");
            //获取标签
            this._evaluationTextList = await AnnouncerModel.getChatterLabel();
            this._evaluationTextList.forEach(element => {
                let index = labelIds.indexOf(element.id);
                if (index > -1) {
                    element.bSelected = true;
                    this._selectedItems.push(element);
                } else {
                    element.bSelected = false;
                }

            });
        }


        this.forceUpdate();
    }



    renderLine = () => {
        return (
            <View
                style={{
                    width: DesignConvert.getW(345),
                    height: DesignConvert.getH(0.5),
                    backgroundColor: '#E4E3E7',
                    marginLeft: DesignConvert.getW(29),
                }}
            />
        )
    }

    render() {

        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#3B0D1E', '#260713']}
                style={{
                    flex: 1,
                }}
            >

                <BackTitleView
                    onBack={this._onBackPress}
                    titleText="编辑资料"
                    bgColor={['#3B0D1E','#260713']}
                    titleTextStyle={{
                        color:'white'
                    }}

                />
                <View
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(1),
                    }}
                />
                <TouchableOpacity
                    style={{
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(85),
                        marginTop: DesignConvert.getH(15)
                    }}
                    onPress={this._openCameralRoll}
                >
                    <View
                        style={{
                            marginLeft: DesignConvert.getW(15),
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontSize: DesignConvert.getF(14),
                            }}
                        >
                            头像
                        </Text>
                        <Text
                            style={{
                                color: 'rgba(158, 158, 158, 1)',
                                fontSize: DesignConvert.getF(11),
                                marginTop: DesignConvert.getH(10),
                                maxWidth: DesignConvert.getW(255)
                            }}
                        >
                            真实的头像图片能极大的增加曝光几率
                        </Text>
                    </View>
                    <Image
                        source={this._HeaderPath ? { uri: this._HeaderPath } : this._avatar ? { uri: this._avatar } : require("../../hardcode/skin_imgs/main").upload_photo()}
                        style={{
                            width: DesignConvert.getW(37),
                            height: DesignConvert.getH(37),
                            borderRadius: DesignConvert.getW(37 * 0.5),
                            position: 'absolute',
                            right: DesignConvert.getW(37),
                            top: DesignConvert.getH(25)
                        }}></Image>
                    <Image
                        source={require('../../hardcode/skin_imgs/mine').mine_arrow_right()}
                        style={{
                            position: 'absolute',
                            top: DesignConvert.getH(38),
                            right: DesignConvert.getW(15),
                            width: DesignConvert.getW(6),
                            height: DesignConvert.getH(10),
                            resizeMode: 'contain',
                        }}></Image>
                </TouchableOpacity>
                <View
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        width: DesignConvert.swidth,
                        height: DesignConvert.getH(5),
                    }}
                />
                <Text
                    style={{
                        color: 'white',
                        fontSize: DesignConvert.getF(14),
                        marginLeft: DesignConvert.getW(15),
                        marginTop: DesignConvert.getH(15),

                    }}
                >
                    基础信息
                        </Text>
                <_Item
                    title="昵称"
                    type={nickName}
                    content={this._nickName}
                    onPress={this._setNickName}></_Item>
                <_Item
                    title="生日"
                    content={this._birthday}
                    onPress={this._onBirthdayPress}></_Item>
                <_Item
                    title="签名"
                    content={this._slogan || '这个人太懒了'}
                    // textColor={this._slogan ? '#333333' : '#999999'}
                    onPress={this._onSloganPress}
                ></_Item>
                 <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        colors={["#FF5245", "#CD0031"]}
                        style={{
                            width: DesignConvert.getW(240),
                            height: DesignConvert.getH(50),
                            backgroundColor: '#FFFFFF',
                            borderRadius: DesignConvert.getW(10),
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            marginTop: DesignConvert.getH(100)
                        }}
                    >
                        <TouchableOpacity
                            onPress={this._onSavePress}
                        >
                            <Text
                                style={{ color: 'white' }}
                            >
                                保存
                                </Text>
                        </TouchableOpacity>

                    </LinearGradient>


                {/* <ScrollView
                    style={{
                        flex: 1,
                    }}
                >


                    <_Item
                        title="昵称"
                        type={nickName}
                        content={this._nickName}
                        onPress={this._setNickName}></_Item>

                    <Text
                        style={{
                            color: '#666666',
                            fontSize: DesignConvert.getF(16),
                            marginLeft: DesignConvert.getW(15),
                            marginTop: DesignConvert.getH(10),
                        }}
                    >相册</Text>

                    <_AblumSelectedList
                        data={this._myAblumList}
                        onDeletePress={this._delAblm}
                        onAddPress={() => this._openCameralRoll(false)}
                    />
                    <TouchableOpacity />

                    <_Item
                        title="性别"
                        content={this._sex == 1 ? "男" : "女"}
                        onPress={this._showeEditSexDialog}
                        showArrowRight></_Item>

                    
                    <_Item
                        title="身高"
                        content={this._height ? `${this._height}cm` : "190cm"}
                        onPress={this._onHeightPress}></_Item>

                    <_Item
                        title="地区"
                        content={this._position}
                        onPress={this._onAreaPress}></_Item>

                    <Text
                        style={{
                            color: '#666666',
                            fontSize: DesignConvert.getF(16),
                            marginLeft: DesignConvert.getW(15),
                            marginTop: DesignConvert.getH(10),
                        }}
                    >个性签名</Text>
                    <View
                        style={{
                            width: DesignConvert.getW(345),
                            height: DesignConvert.getH(77),
                            borderRadius: DesignConvert.getW(7),
                            borderWidth: DesignConvert.getW(1),
                            borderColor: THEME_COLOR,
                            padding: DesignConvert.getW(10),
                            marginLeft: DesignConvert.getW(15),
                            marginTop: DesignConvert.getH(10),
                        }}
                    >
                        <TextInput
                            value={this._slogan}
                            multiline={true}
                            style={{
                                padding: 0,
                                flex: 1,
                                color: '#333333',
                                fontSize: DesignConvert.getF(13),
                                textAlignVertical: 'top',
                            }}
                            onChangeText={this._setSlogan}
                        />
                    </View>

                    {this._isAnnouncer ? (
                        <View>
                            <Text
                                style={{
                                    color: '#666666',
                                    fontSize: DesignConvert.getF(16),
                                    marginLeft: DesignConvert.getW(15),
                                    marginTop: DesignConvert.getH(25),
                                }}
                            >个人标签</Text>
                            <View
                                style={{
                                    marginTop: DesignConvert.getH(11),
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    width: DesignConvert.swidth,
                                    paddingHorizontal: DesignConvert.getW(10),
                                    alignItems: "center",
                                    marginBottom: DesignConvert.getH(80),
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
                        </View>
                    ) : null}

                </ScrollView> */}
            </LinearGradient>
        )
    }
}