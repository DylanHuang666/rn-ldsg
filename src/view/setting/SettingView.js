/**
 * 设置界面
 */

'use strict';


import React, { PureComponent } from 'react';
import BaseView from '../base/BaseView';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import BackTitleView from '../base/BackTitleView';
import DesignConvert from '../../utils/DesignConvert';
import { icon_next } from '../../hardcode/skin_imgs/main';
import UserInfoCache from '../../cache/UserInfoCache';
import ToastUtil from '../base/ToastUtil';
import { THEME_COLOR, THEME_COLOR_LEFT, THEME_COLOR_RIGHT } from '../../styles';
import LinearGradient from 'react-native-linear-gradient';
import { updatePayPassword, updatePassword } from './UpdatePasswordView';

class _Item extends PureComponent {

    render() {
        return (
            <TouchableOpacity
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(52),
                    flexDirection: 'row',
                    // justifyContent: 'flex-start',
                    alignItems: 'center',
                }}

                onPress={this.props.onPress}
            >
                <Text
                    style={{
                        marginLeft: DesignConvert.getW(20),
                        fontSize: DesignConvert.getF(13),
                        color: '#333333'
                    }}
                >{this.props.text}</Text>

                <Image
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(20),
                        top: DesignConvert.getH(20),

                        width: DesignConvert.getW(6),
                        height: DesignConvert.getH(10),
                    }}
                    source={icon_next()}
                />
            </TouchableOpacity>
        )
    }
}

class _Item2 extends PureComponent {

    render() {
        return (
            <TouchableOpacity
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(52),
                    flexDirection: 'row',
                    // justifyContent: 'flex-start',
                    alignItems: 'center',
                }}

                onPress={this.props.onPress}
            >
                <Text
                    style={{
                        marginLeft: DesignConvert.getW(20),
                        fontSize: DesignConvert.getF(16),
                    }}
                >{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}

class _ClearCacheItem extends PureComponent {

    render() {
        //todo
        const casheSize = '????????'

        return (
            <TouchableOpacity
                style={{
                    width: DesignConvert.swidth,
                    height: DesignConvert.getH(52),

                    flexDirection: 'row',
                    // justifyContent: 'flex-start',
                    alignItems: 'center',
                }}

                onPress={this.props.onPress}
            >
                <Text
                    style={{
                        marginLeft: DesignConvert.getW(20),

                        fontWeight: 'bold',
                        fontSize: DesignConvert.getF(13),
                    }}
                >{this.props.text}</Text>

                <Text
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(36),

                        fontSize: DesignConvert.getF(12),
                        color: '#333333',
                    }}
                >{casheSize}</Text>

                <Image
                    style={{
                        position: 'absolute',
                        right: DesignConvert.getW(20),
                        top: DesignConvert.getH(20),

                        width: DesignConvert.getW(6),
                        height: DesignConvert.getH(10),
                    }}
                    source={icon_next()}
                />
            </TouchableOpacity>
        )
    }
}


export default class SettingView extends BaseView {

    _onBlack = () => {
        //todo
        alert('todo: 查看黑名单');
    }

    _onSetPsw = () => {
        if (!UserInfoCache.phoneNumber) {
            ToastUtil.showCenter("请先绑定手机")
            return
        }
        require("../../router/level3_router").showUpdatePasswordView(updatePassword);
    }

    _onSetPayPsw = () => {
        if (!UserInfoCache.phoneNumber) {
            ToastUtil.showCenter("请先绑定手机")
            return
        }
        require("../../router/level3_router").showUpdatePasswordView(updatePayPassword);
    }

    _onChangePhone = () => {
        require("../../router/level3_router").showBindPhoneView();
    }

    _onCertification = () => {
        require("../../router/level2_router").showCertificationPage();
    }

    _onClearCache = () => {
        //todo
        alert('todo: 清除缓存');
    }

    _onAbout = () => {
        require("../../router/level3_router").showAboutUsView();
    }

    _onExit = () => {
        require('../../model/LoginModel').default.logout();
    }

    _renderBlackLine() {
        return (
            <View
                style={{
                    width: DesignConvert.getW(345),
                    height: DesignConvert.getH(0.5),
                    backgroundColor: '#F0F0F0',
                    marginTop: DesignConvert.getH(12.5),
                    marginBottom: DesignConvert.getH(12.5)
                }}
            />
        );
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                }}
            >
                <BackTitleView
                    bgColor={[THEME_COLOR_LEFT, THEME_COLOR_RIGHT]}
                    titleText={'设置'}
                    onBack={this.popSelf}
                    backImgStyle={{
                        tintColor: '#FFFFFF'
                    }}
                    titleTextStyle={{
                        color: '#FFFFFF'
                    }}
                />


                {/* <_Item
                    text='查看黑名单'
                    onPress={this._onBlack}
                />
                {this._renderBlackLine()} */}

                <_Item
                    text='登录密码'
                    onPress={this._onSetPsw}
                />

                <_Item
                    text='支付密码'
                    onPress={this._onSetPayPsw}
                />

                <_Item
                    text='实名认证'
                    onPress={this._onCertification}
                />


                <_Item
                    text='手机绑定'
                    onPress={this._onChangePhone}
                />

                {/* <_ClearCacheItem
                    text='清除缓存'
                    onPress={this._onClearCache}
                /> */}
                

                {this._renderBlackLine()}

                <_Item
                    text='关于我们'
                    onPress={this._onAbout}
                />

                {/* <_Item
                    text='黑名单'
                    onPress={this._onChangePhone}
                />

                <_Item
                    text='帮助中心'
                    onPress={this._onChangePhone}
                /> */}

                <View
                    style={{
                        flex: 1
                    }}
                />

                <TouchableOpacity
                    style={{
                        width: DesignConvert.getW(280),
                        height: DesignConvert.getH(44),
                        marginBottom: DesignConvert.getH(30) + DesignConvert.addIpxBottomHeight(),
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={this._onExit}
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={[THEME_COLOR_LEFT, THEME_COLOR_RIGHT]}
                        style={{
                            position: 'absolute',
                            width: DesignConvert.getW(280),
                            height: DesignConvert.getH(44),
                            backgroundColor: '#A055FF',
                            borderRadius: DesignConvert.getW(8),
                            borderRadius: DesignConvert.getW(25),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    />

                    <Text
                        style={{
                            color: 'white',
                            fontSize: DesignConvert.getF(15),
                        }}
                    >退出登录</Text>
                </TouchableOpacity>

            </View>
        )
    }
}